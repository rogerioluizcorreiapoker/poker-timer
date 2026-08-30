# -*- coding: utf-8 -*-
"""Marca oficial NEX Layer3D em geometria exata.

A marca sao duas placas isometricas empilhadas, desenhadas em traco. Os
parametros vem de `assets/logo_mark.json`, obtidos por ajuste da forma
contra os pixels da arte oficial (tools/fit_logo.py usa o `build` daqui,
de modo que o que se mede e exatamente o que se imprime).

Reconstruir a marca analiticamente -- em vez de usar o contorno
rasterizado -- garante arestas retas, que e o que se quer em relevo.
"""
import json
import os

from shapely.affinity import translate
from shapely.geometry import LinearRing, Polygon
from shapely.ops import unary_union

_DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                     os.pardir, "assets", "logo_mark.json")

MITRE = 8.0


def build(a, b, t, s, step):
    """Marca em coordenadas CAD (y para cima), origem no centro da placa 1.

    a, b   meia largura e meia altura do losango da face superior
    t      espessura da placa
    s      espessura do traco
    step   distancia vertical entre as duas placas
    """
    def diamond(oy):
        return [(0, oy + b), (a, oy), (0, oy - b), (-a, oy)]

    def band(oy):
        # aresta frontal da face superior descendo pela espessura da placa
        return [(-a, oy), (0, oy - b), (a, oy),
                (a, oy - t), (0, oy - b - t), (-a, oy - t)]

    def silhouette(oy):
        return Polygon([(0, oy + b), (a, oy), (a, oy - t),
                        (0, oy - b - t), (-a, oy - t), (-a, oy)])

    def line(pts):
        return LinearRing(pts).buffer(s / 2.0, join_style=2, mitre_limit=MITRE)

    def plate(oy):
        # o recorte pela silhueta evita a farpa que apareceria onde os
        # cantos do losango e da faixa se encontram no vertice lateral
        drawn = unary_union([line(diamond(oy)), line(band(oy))])
        return drawn.intersection(silhouette(oy).buffer(
            s / 2.0, join_style=2, mitre_limit=MITRE))

    top = plate(0.0)
    # a placa de baixo aparece parcialmente encoberta pela de cima
    bottom = plate(-step).difference(
        silhouette(0.0).buffer(s / 2.0, join_style=2, mitre_limit=MITRE))

    geom = unary_union([top, bottom])
    return geom if geom.is_valid else geom.buffer(0)


def _spec():
    with open(_DATA) as fh:
        return json.load(fh)


SPEC = _spec()
ASPECT = SPEC["aspect"]  # altura / largura


def mark(width, x=0.0, y=0.0, anchor="left-bottom"):
    """Marca em milimetros, com `width` de largura total.

    anchor define a que ponto (x, y) se refere.
    """
    p = SPEC["params_norm"]
    geom = build(p["a"] * width, p["b"] * width, p["t"] * width,
                 p["stroke"] * width, p["step"] * width)

    minx, miny, maxx, maxy = geom.bounds
    if anchor == "center":
        dx, dy = x - (minx + maxx) / 2.0, y - (miny + maxy) / 2.0
    elif anchor == "left-bottom":
        dx, dy = x - minx, y - miny
    elif anchor == "left-center":
        dx, dy = x - minx, y - (miny + maxy) / 2.0
    else:
        raise ValueError("anchor invalido: %r" % anchor)
    return translate(geom, dx, dy)


def stroke_width(width):
    """Espessura do traco da marca para uma dada largura total (mm)."""
    return SPEC["params_norm"]["stroke"] * width
