"""Ajusta um modelo geometrico exato da marca NEX Layer3D aos pixels oficiais.

A marca e composta por duas placas isometricas empilhadas, desenhadas em
traco. Como toda a forma e feita de retas, reconstrui-la parametricamente
produz arestas perfeitas para impressao 3D (o contorno rasterizado direto
carrega ondulacoes de antialiasing).

O ajuste maximiza a IoU entre o modelo e a mascara ciano da arte original,
de modo que a reconstrucao e verificada contra o logo oficial, nao chutada.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy.optimize import minimize
from shapely import affinity

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, os.pardir, "lib"))

import logo  # noqa: E402  (precisa do sys.path acima)

OUT = os.path.join(HERE, os.pardir, "assets", "logo_mark.json")

CROP = (360, 14, 460, 133)
SS = 6  # supersampling do raster de referencia


def reference_mask(src):
    img = np.asarray(Image.open(src).convert("RGB")).astype(np.float64)
    x0, y0, x1, y1 = CROP
    sub = img[y0:y1, x0:x1]
    r, g, b = sub[..., 0], sub[..., 1], sub[..., 2]
    field = np.clip((np.minimum(g, b) - r) / 90.0, 0.0, 1.0)
    big = Image.fromarray((field * 255).astype(np.uint8))
    big = big.resize((big.width * SS, big.height * SS), Image.LANCZOS)
    return np.asarray(big) > 127


def build_mark(p):
    """Marca parametrica em coordenadas de imagem (y para baixo).

    Usa a mesma construcao do modulo lib/logo.py que gera o cartao, para
    que a IoU medida aqui valha para a geometria realmente impressa.
    """
    a, b, t, s, d, cx, cy = p
    geom = logo.build(abs(a), abs(b), abs(t), abs(s), abs(d))
    return affinity.translate(affinity.scale(geom, 1.0, -1.0, origin=(0, 0)), cx, cy)


def rasterize(geom, shape):
    img = Image.new("1", (shape[1], shape[0]), 0)
    dr = ImageDraw.Draw(img)
    geoms = geom.geoms if geom.geom_type == "MultiPolygon" else [geom]
    for g in geoms:
        dr.polygon([tuple(c) for c in g.exterior.coords], fill=1)
        for ring in g.interiors:
            dr.polygon([tuple(c) for c in ring.coords], fill=0)
    return np.asarray(img)


def runs_of(col):
    out, start = [], None
    for i, v in enumerate(col):
        if v and start is None:
            start = i
        elif not v and start is not None:
            out.append((start + i - 1) / 2.0)
            start = None
    if start is not None:
        out.append((start + len(col) - 1) / 2.0)
    return out


def measure(ref):
    """Chute inicial medido na propria arte, nao arbitrado."""
    ys, xs = np.nonzero(ref)
    cx = (xs.min() + xs.max()) / 2.0

    # A coluna central corta 5 vertices: apice da face superior da placa 1,
    # V frontal da placa 1, base da placa 1, V frontal da placa 2, base da 2.
    m = runs_of(ref[:, int(round(cx))])
    if len(m) != 5:
        raise SystemExit("perfil central inesperado: %r" % (m,))
    b = (m[1] - m[0]) / 2.0
    t = m[2] - m[1]
    d = m[3] - m[1]
    cy = (m[0] + m[1]) / 2.0

    # espessura do traco a partir da altura de tinta no apice em V
    col = ref[:, int(round(cx))]
    idx = np.nonzero(col)[0]
    seg = np.split(idx, np.nonzero(np.diff(idx) > 1)[0] + 1)[1]
    a = (xs.max() - xs.min()) / 2.0
    for _ in range(20):  # o vertice lateral estende o traco em miter
        s = len(seg) * np.sin(np.arctan2(a, b))
        a = ((xs.max() - xs.min()) - 2.0 * (s / 2.0) / np.sin(np.arctan2(b, a))) / 2.0
    return np.array([a, b, t, s, d, cx, cy])


def main(src):
    ref = reference_mask(src)
    p0 = measure(ref)
    print("medido na arte: a=%.1f b=%.1f t=%.1f traco=%.1f passo=%.1f" % tuple(p0[:5]))

    def cost(p):
        try:
            m = rasterize(build_mark(p), ref.shape)
        except Exception:
            return 1.0
        inter = np.count_nonzero(m & ref)
        union = np.count_nonzero(m | ref)
        return 1.0 - inter / union if union else 1.0

    best, bp = cost(p0), p0
    print("IoU do chute medido: %.4f" % (1.0 - best))
    for scale in (0.25, 0.08, 0.03):
        res = minimize(cost, bp, method="Nelder-Mead",
                       options={"xatol": 1e-3, "fatol": 1e-6, "maxiter": 4000,
                                "initial_simplex": np.vstack(
                                    [bp] + [bp + np.eye(7)[i] * max(abs(bp[i]) * 0.18, 0.6) * scale
                                            for i in range(7)])})
        if res.fun < best:
            best, bp = res.fun, res.x

    a, b, t, s, d, cx, cy = bp
    print("IoU com o logo oficial: %.4f" % (1.0 - best))
    print("parametros (px da arte): a=%.2f b=%.2f t=%.2f traco=%.2f passo=%.2f" %
          (a, b, t, s, d))
    print("proporcoes  b/a=%.4f  t/a=%.4f  traco/a=%.4f  passo/a=%.4f" %
          (b / a, t / a, s / a, d / a))

    geom = build_mark(bp)
    minx, miny, maxx, maxy = geom.bounds
    gw, gh = maxx - minx, maxy - miny
    k = 1.0 / gw

    polys = []
    geoms = geom.geoms if geom.geom_type == "MultiPolygon" else [geom]
    for g in geoms:
        polys.append({
            "exterior": [((x - minx) * k, (maxy - y) * k) for x, y in g.exterior.coords],
            "holes": [[((x - minx) * k, (maxy - y) * k) for x, y in r.coords]
                      for r in g.interiors],
        })

    data = {
        "source": os.path.basename(src),
        "method": "ajuste parametrico verificado contra a arte oficial",
        "iou": round(1.0 - best, 4),
        "aspect": gh / gw,
        "params_norm": {"a": a * k, "b": b * k, "t": t * k, "stroke": s * k, "step": d * k},
        "polygons": polys,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump(data, fh, indent=1)
    print("aneis: %d  vertices: %d  aspect(h/w)=%.4f"
          % (len(polys), sum(len(p["exterior"]) + sum(len(x) for x in p["holes"])
                             for p in polys), data["aspect"]))
    print("gravado em", os.path.normpath(OUT))

    # comparativo visual
    m = rasterize(geom, ref.shape)
    cmp_img = np.zeros(ref.shape + (3,), np.uint8)
    cmp_img[..., 0] = ref * 255          # vermelho = arte oficial
    cmp_img[..., 1] = m * 255            # verde    = modelo ajustado
    cmp_img[..., 2] = (ref & m) * 255
    Image.fromarray(cmp_img).save(os.path.join(HERE, os.pardir, "assets", "logo_fit_check.png"))


if __name__ == "__main__":
    main(sys.argv[1])
