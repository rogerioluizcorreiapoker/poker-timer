"""Vetoriza a marca oficial NEX Layer3D a partir da imagem de referencia.

Le a arte enviada pelo cliente, isola o traco ciano da marca, extrai os
contornos em subpixel e grava o resultado como poligonos normalizados em
`assets/logo_mark.json`, prontos para serem extrudados no cartao.
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from shapely.geometry import Polygon
from shapely.ops import unary_union
from skimage import measure

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, os.pardir, "assets", "logo_mark.json")

# Recorte da marca na arte de referencia (imagem do briefing).
CROP = (360, 14, 460, 133)
UPSCALE = 6
SIMPLIFY_PX = 2.2  # em pixels da imagem ampliada


def tealness(rgb):
    """Campo continuo 0..1 que mede o quanto o pixel e o ciano da marca."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return np.clip((np.minimum(g, b) - r) / 90.0, 0.0, 1.0)


def contours_to_polygons(field, level=0.5):
    rings = []
    for c in measure.find_contours(field, level):
        if len(c) < 4:
            continue
        poly = Polygon([(x, y) for y, x in c])
        if not poly.is_valid:
            poly = poly.buffer(0)
        if poly.is_empty or poly.area < 4:
            continue
        rings.append(poly)

    # Aneis contidos em outro anel sao furos (a marca e desenhada em traco).
    rings.sort(key=lambda p: -p.area)
    result = None
    for poly in rings:
        result = poly if result is None else result.symmetric_difference(poly)
    return result


def main(src):
    img = np.asarray(Image.open(src).convert("RGB")).astype(np.float64)
    x0, y0, x1, y1 = CROP
    field = tealness(img[y0:y1, x0:x1])

    big = Image.fromarray((field * 255).astype(np.uint8))
    big = big.resize((big.width * UPSCALE, big.height * UPSCALE), Image.LANCZOS)
    field = np.asarray(big).astype(np.float64) / 255.0
    field = np.pad(field, 2, constant_values=0.0)

    shape = contours_to_polygons(field)
    shape = shape.simplify(SIMPLIFY_PX, preserve_topology=True)
    shape = unary_union(shape)

    minx, miny, maxx, maxy = shape.bounds
    w, h = maxx - minx, maxy - miny
    scale = 1.0 / w  # normaliza pela largura; y e invertido (imagem -> CAD)

    polys = []
    geoms = shape.geoms if shape.geom_type == "MultiPolygon" else [shape]
    for g in geoms:
        ext = [((x - minx) * scale, (maxy - y) * scale) for x, y in g.exterior.coords]
        holes = [[((x - minx) * scale, (maxy - y) * scale) for x, y in r.coords]
                 for r in g.interiors]
        polys.append({"exterior": ext, "holes": holes})

    data = {
        "source": os.path.basename(src),
        "crop": CROP,
        "aspect": h / w,  # altura / largura
        "polygons": polys,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump(data, fh, indent=1)

    npts = sum(len(p["exterior"]) + sum(len(h) for h in p["holes"]) for p in polys)
    print("poligonos: %d  furos: %d  vertices: %d  aspect(h/w): %.4f"
          % (len(polys), sum(len(p["holes"]) for p in polys), npts, data["aspect"]))
    print("gravado em", os.path.normpath(OUT))


if __name__ == "__main__":
    main(sys.argv[1])
