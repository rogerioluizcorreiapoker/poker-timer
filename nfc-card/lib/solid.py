"""Ponte entre geometria 2D (shapely) e solidos manifold (manifold3d).

Toda a arte do cartao e desenhada em 2D em milimetros e depois extrudada
entre duas cotas Z. As operacoes booleanas do manifold3d garantem malhas
fechadas (manifold), que e o requisito para fatiar sem reparos.
"""
import numpy as np
from manifold3d import CrossSection, FillRule, Manifold, OpType
from shapely.geometry import MultiPolygon, Polygon
from shapely.geometry.polygon import orient

EPS = 1e-3  # folga para garantir corte limpo em faces coincidentes


def _rings(geom):
    if geom.is_empty:
        return []
    geoms = geom.geoms if isinstance(geom, MultiPolygon) else [geom]
    out = []
    for g in geoms:
        if not isinstance(g, Polygon) or g.is_empty:
            continue
        g = orient(g, 1.0)  # exterior anti-horario, furos horarios
        out.append(np.asarray(g.exterior.coords[:-1], dtype=np.float64))
        for ring in g.interiors:
            out.append(np.asarray(ring.coords[:-1], dtype=np.float64))
    return out


def cross_section(geom):
    """shapely -> CrossSection do manifold."""
    rings = _rings(geom)
    if not rings:
        return CrossSection()
    return CrossSection(rings, FillRule.Positive)


def extrude(geom, z0, z1):
    """Extruda a geometria 2D entre z0 e z1."""
    cs = cross_section(geom)
    if cs.is_empty():
        return Manifold()
    return Manifold.extrude(cs, z1 - z0).translate((0.0, 0.0, z0))


def union(parts):
    parts = [p for p in parts if not p.is_empty()]
    if not parts:
        return Manifold()
    return Manifold.batch_boolean(parts, OpType.Add)


def difference(base, parts):
    parts = [p for p in parts if not p.is_empty()]
    for p in parts:
        base = base - p
    return base


def chamfered_slab(outline, levels):
    """Bloco convexo com chanfros, feito pelo fecho convexo de secoes finas.

    `levels` e uma lista de (z, recuo) -- o contorno recuado de `recuo` mm
    naquela cota. Como o contorno do cartao e convexo, o fecho convexo das
    secoes reproduz exatamente o chanfro reto entre elas.
    """
    slices, thin = [], 1e-4
    for i, (z, inset) in enumerate(levels):
        geom = outline if inset == 0 else outline.buffer(-inset, join_style=1, resolution=16)
        # a fatia do topo cresce para baixo para nao ultrapassar a cota pedida
        z0, z1 = (z - thin, z) if i == len(levels) - 1 else (z, z + thin)
        slices.append(extrude(geom, z0, z1))
    return Manifold.batch_hull(slices)


def to_stl(manifold, path):
    """Grava STL binario em milimetros."""
    mesh = manifold.to_mesh()
    verts = np.asarray(mesh.vert_properties)[:, :3].astype(np.float32)
    tris = np.asarray(mesh.tri_verts).astype(np.int64)
    v0, v1, v2 = verts[tris[:, 0]], verts[tris[:, 1]], verts[tris[:, 2]]
    normals = np.cross(v1 - v0, v2 - v0)
    lengths = np.linalg.norm(normals, axis=1, keepdims=True)
    normals = np.divide(normals, lengths, out=np.zeros_like(normals), where=lengths > 0)

    rec = np.zeros(len(tris), dtype=np.dtype([
        ("n", "<f4", 3), ("v0", "<f4", 3), ("v1", "<f4", 3),
        ("v2", "<f4", 3), ("attr", "<u2")]))
    rec["n"], rec["v0"], rec["v1"], rec["v2"] = normals, v0, v1, v2

    with open(path, "wb") as fh:
        fh.write(b"NEX Layer3D - cartao NFC - unidade: milimetro".ljust(80, b" "))
        fh.write(np.uint32(len(tris)).tobytes())
        fh.write(rec.tobytes())
    return len(tris)
