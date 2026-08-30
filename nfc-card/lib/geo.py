"""Primitivas de desenho 2D em milimetros para a arte do cartao."""
import math

from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

RES = 24  # segmentos por quadrante nos arredondamentos


def rounded_rect(w, h, r, cx=None, cy=None):
    """Retangulo de cantos arredondados; por padrao com canto inferior em (0,0)."""
    cx = w / 2.0 if cx is None else cx
    cy = h / 2.0 if cy is None else cy
    x0, y0 = cx - w / 2.0 + r, cy - h / 2.0 + r
    x1, y1 = cx + w / 2.0 - r, cy + h / 2.0 - r
    return Polygon([(x0, y0), (x1, y0), (x1, y1), (x0, y1)]).buffer(
        r, join_style=1, resolution=RES)


def hexagon(cx, cy, r):
    """Hexagono regular com vertices a esquerda e a direita (topo e base retos)."""
    return Polygon([(cx + r * math.cos(math.radians(a)),
                     cy + r * math.sin(math.radians(a))) for a in range(0, 360, 60)])


def ring(outer, inner):
    return outer.difference(inner)


def stroke(points, width, cap="flat", join="mitre", closed=False):
    """Espessa uma polilinha, como um traco de circuito."""
    caps = {"flat": 2, "round": 1, "square": 3}
    joins = {"mitre": 2, "round": 1, "bevel": 3}
    pts = list(points) + ([points[0]] if closed else [])
    return LineString(pts).buffer(width / 2.0, cap_style=caps[cap],
                                  join_style=joins[join], resolution=RES,
                                  mitre_limit=6.0)


def outline(geom, width):
    """Contorno de espessura `width` centrado na borda da geometria."""
    return geom.boundary.buffer(width / 2.0, cap_style=2, join_style=2,
                                resolution=RES, mitre_limit=6.0)


def disc(cx, cy, d):
    return Point(cx, cy).buffer(d / 2.0, resolution=RES * 2)


def arc(cx, cy, r, a0, a1, width, cap="round"):
    """Arco de circulo espessado (usado no simbolo NFC)."""
    n = max(8, int(abs(a1 - a0) / 3.0))
    pts = [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
            cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
    return stroke(pts, width, cap=cap, join="round")


def bracket(cx, cy, arm, width, sx, sy):
    """Cantoneira em L. (sx, sy) define para que lado os bracos apontam."""
    return stroke([(cx + sx * arm, cy), (cx, cy), (cx, cy + sy * arm)],
                  width, cap="flat", join="mitre")


def nfc_symbol(cx, cy, size, width):
    """Simbolo NFC: um ponto e tres ondas abrindo para a direita."""
    unit = size / 6.0
    parts = [disc(cx - 2.6 * unit, cy, width * 1.5)]
    for i, r in enumerate((2.0, 3.4, 4.8)):
        parts.append(arc(cx - 2.6 * unit, cy, r * unit, -52, 52,
                         width * (1.0 - 0.06 * i)))
    return unary_union(parts)


def drop_thin(geom, t):
    """Remove ilhas mais estreitas que `t` -- o bico nao as reproduziria."""
    if geom.is_empty:
        return geom
    gs = geom.geoms if geom.geom_type.startswith("Multi") else [geom]
    keep = [g for g in gs if not g.buffer(-t / 2.0, join_style=2, resolution=8).is_empty]
    return unary_union(keep) if keep else geom.difference(geom)


def merge(*geoms):
    return unary_union([g for g in geoms if g is not None and not g.is_empty])
