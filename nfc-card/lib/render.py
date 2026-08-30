# -*- coding: utf-8 -*-
"""Renderizador z-buffer simples, para conferir as pecas sem sair do script.

Rasteriza triangulos com sombreamento plano. Nao e um motor de render: o
objetivo e ver o relevo e a montagem com fidelidade geometrica.
"""
import numpy as np
from PIL import Image


def mesh_of(part):
    m = part.to_mesh()
    v = np.asarray(m.vert_properties)[:, :3].astype(np.float64)
    t = np.asarray(m.tri_verts).astype(np.int64)
    return v, t


class Scene:
    def __init__(self):
        self.items = []

    def add(self, part, color_fn, offset=(0.0, 0.0, 0.0)):
        v, t = mesh_of(part)
        # a cor sai da geometria na posicao de projeto; o deslocamento do
        # explodido nao pode mudar a leitura de cotas
        self.items.append((v + np.asarray(offset, float), t, color_fn(v, t)))
        return self


def _basis(eye, target, up):
    f = np.asarray(target, float) - np.asarray(eye, float)
    f /= np.linalg.norm(f)
    r = np.cross(f, np.asarray(up, float))
    r /= np.linalg.norm(r)
    u = np.cross(r, f)
    return r, u, f


def render(scene, size, eye, target, up=(0, 0, 1), ortho=None, fov=28.0,
           bg=(11, 14, 19), ss=2, light=(-0.45, -0.75, 0.95)):
    """Devolve uma imagem PIL. `ortho` = altura da cena em mm (vista reta)."""
    W, H = size[0] * ss, size[1] * ss
    eye = np.asarray(eye, float)
    r, u, f = _basis(eye, target, up)

    zbuf = np.full((H, W), np.inf)
    img = np.zeros((H, W, 3), np.float64)
    img[:] = np.asarray(bg, float) / 255.0

    ldir = np.asarray(light, float)
    ldir /= np.linalg.norm(ldir)

    for verts, tris, cols in scene.items:
        rel = verts - eye
        cam = np.stack([rel @ r, rel @ u, rel @ f], axis=1)

        if ortho:
            scale = H / ortho
            sx = cam[:, 0] * scale + W / 2.0
            sy = H / 2.0 - cam[:, 1] * scale
        else:
            focal = (H / 2.0) / np.tan(np.radians(fov) / 2.0)
            d = np.maximum(cam[:, 2], 1e-6)
            sx = cam[:, 0] / d * focal + W / 2.0
            sy = H / 2.0 - cam[:, 1] / d * focal
        depth = cam[:, 2]

        p0, p1, p2 = sx[tris[:, 0]], sx[tris[:, 1]], sx[tris[:, 2]]
        q0, q1, q2 = sy[tris[:, 0]], sy[tris[:, 1]], sy[tris[:, 2]]
        area = (p1 - p0) * (q2 - q0) - (p2 - p0) * (q1 - q0)

        a, b, c = verts[tris[:, 0]], verts[tris[:, 1]], verts[tris[:, 2]]
        nrm = np.cross(b - a, c - a)
        nl = np.linalg.norm(nrm, axis=1, keepdims=True)
        nrm = np.divide(nrm, nl, out=np.zeros_like(nrm), where=nl > 0)

        keep = np.nonzero((area < -1e-9) & (depth[tris].min(axis=1) > 0))[0]

        lam = np.clip(nrm @ ldir, 0.0, 1.0)
        view = -f
        half = ldir + view
        half /= np.linalg.norm(half)
        spec = np.clip(nrm @ half, 0.0, 1.0) ** 34
        shade = 0.26 + 0.74 * lam                       # ambiente + difusa
        shade = shade[:, None] * cols + 0.34 * spec[:, None]

        order = keep[np.argsort(-depth[tris[keep]].mean(axis=1))]
        for i in order:
            x0 = max(int(np.floor(min(p0[i], p1[i], p2[i]))), 0)
            x1 = min(int(np.ceil(max(p0[i], p1[i], p2[i]))) + 1, W)
            y0 = max(int(np.floor(min(q0[i], q1[i], q2[i]))), 0)
            y1 = min(int(np.ceil(max(q0[i], q1[i], q2[i]))) + 1, H)
            if x1 <= x0 or y1 <= y0:
                continue
            xs = np.arange(x0, x1) + 0.5
            ys = np.arange(y0, y1) + 0.5
            gx, gy = np.meshgrid(xs, ys)
            inv = 1.0 / area[i]
            w0 = ((p1[i] - gx) * (q2[i] - gy) - (p2[i] - gx) * (q1[i] - gy)) * inv
            w1 = ((p2[i] - gx) * (q0[i] - gy) - (p0[i] - gx) * (q2[i] - gy)) * inv
            w2 = 1.0 - w0 - w1
            inside = (w0 >= 0) & (w1 >= 0) & (w2 >= 0)
            if not inside.any():
                continue
            d0, d1, d2 = depth[tris[i, 0]], depth[tris[i, 1]], depth[tris[i, 2]]
            if ortho:
                z = w0 * d0 + w1 * d1 + w2 * d2
            else:
                # em perspectiva a profundidade nao e linear na tela: quem
                # interpola linearmente erra em triangulos grandes, e a face
                # de tras chega a vencer o teste de profundidade
                z = 1.0 / (w0 / d0 + w1 / d1 + w2 / d2)
            sub = zbuf[y0:y1, x0:x1]
            hit = inside & (z < sub)
            if not hit.any():
                continue
            sub[hit] = z[hit]
            img[y0:y1, x0:x1][hit] = shade[i]

    out = np.clip(img * 255.0, 0, 255).astype(np.uint8)
    return Image.fromarray(out).resize((size[0], size[1]), Image.LANCZOS)


def palette(mode, bands, default, flat_only=True):
    """Cor por faixa de cota.

    mode='alto'  usa o z maximo do triangulo (topo de cada relevo);
    mode='fundo' usa o z minimo. Cada faixa e (z_min, z_max, cor) e as
    faixas sao aplicadas na ordem dada -- a ultima que casar prevalece.

    flat_only limita a pintura as faces horizontais. Sem isso, uma face
    inclinada como o chanfro da borda cai na faixa de uma gravacao so
    porque termina na mesma cota.
    """
    def fn(verts, tris):
        z = verts[tris, 2]
        key = z.max(axis=1) if mode == "alto" else z.min(axis=1)
        cols = np.tile(np.asarray(default, float) / 255.0, (len(tris), 1))
        if flat_only:
            a, b, c = verts[tris[:, 0]], verts[tris[:, 1]], verts[tris[:, 2]]
            n = np.cross(b - a, c - a)
            ln = np.linalg.norm(n, axis=1)
            horizontal = np.divide(abs(n[:, 2]), ln, out=np.zeros(len(n)),
                                   where=ln > 0) > 0.9
        else:
            horizontal = np.ones(len(tris), bool)
        for lo, hi, color in bands:
            sel = horizontal & (key >= lo - 1e-6) & (key <= hi + 1e-6)
            cols[sel] = np.asarray(color, float) / 255.0
        return cols
    return fn


def flat(color):
    rgb = np.asarray(color, float) / 255.0

    def fn(verts, tris):
        return np.tile(rgb, (len(tris), 1))
    return fn
