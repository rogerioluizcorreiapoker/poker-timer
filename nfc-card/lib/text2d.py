"""Contornos de texto -> poligonos 2D, em milimetros.

Converte glifos de uma fonte TrueType em geometria shapely para serem
extrudados como relevo ou gravacao no cartao. O tamanho e informado como
altura de caixa alta (cap height) em mm, que e a medida util em projeto
grafico de um objeto fisico.
"""
import os

from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from shapely.affinity import translate
from shapely.geometry import Polygon
from shapely.ops import unary_union

FONT_DIR = "/mnt/skills/examples/canvas-design/canvas-fonts"

# Achatamento das curvas: 0.02 mm fica bem abaixo da resolucao do bico de
# 0.2 mm, entao as letras saem lisas sem inflar a malha.
FLATNESS_MM = 0.02


class _PolyPen(BasePen):
    """Pen que acumula contornos como polilinhas achatadas."""

    def __init__(self, glyph_set, scale, steps):
        super().__init__(glyph_set)
        self.scale = scale
        self.steps = steps
        self.contours = []
        self._cur = []

    def _moveTo(self, pt):
        self._flush()
        self._cur = [pt]

    def _lineTo(self, pt):
        self._cur.append(pt)

    def _curveToOne(self, p1, p2, p3):
        p0 = self._cur[-1]
        n = self.steps
        for i in range(1, n + 1):
            t = i / n
            u = 1.0 - t
            self._cur.append((
                u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
                u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
            ))

    def _closePath(self):
        self._flush()

    def _endPath(self):
        self._flush()

    def _flush(self):
        if len(self._cur) >= 3:
            self.contours.append([(x * self.scale, y * self.scale) for x, y in self._cur])
        self._cur = []


def _signed_area(ring):
    total = 0.0
    for (x0, y0), (x1, y1) in zip(ring, ring[1:] + ring[:1]):
        total += x0 * y1 - x1 * y0
    return total / 2.0


def _assemble(contours):
    """Monta um glifo pela regra non-zero winding.

    Fontes modernas desenham letras com contornos sobrepostos (o "L" da
    Outfit sao dois retangulos). Unir contornos de mesmo sentido e subtrair
    os de sentido oposto e a interpretacao correta -- tratar todo contorno
    interno como furo abriria vazios falsos nas letras.
    """
    rings = [(c, _signed_area(c)) for c in contours if len(c) >= 3]
    rings = [(c, a) for c, a in rings if abs(a) > 1e-9]
    if not rings:
        return None
    outer_sign = 1.0 if max(rings, key=lambda r: abs(r[1]))[1] > 0 else -1.0

    def build(sel):
        polys = []
        for c, a in rings:
            if (a > 0) == (sel > 0):
                p = Polygon(c)
                polys.append(p if p.is_valid else p.buffer(0))
        return unary_union(polys) if polys else None

    solid = build(outer_sign)
    holes = build(-outer_sign)
    if solid is None:
        return None
    return solid.difference(holes) if holes is not None else solid


class Font:
    """Uma fonte carregada, medida em altura de caixa alta."""

    _cache = {}

    def __init__(self, name):
        path = name if os.path.isabs(name) else os.path.join(FONT_DIR, name)
        self.path = path
        self.tt = TTFont(path)
        self.glyphs = self.tt.getGlyphSet()
        self.cmap = self.tt.getBestCmap()
        self.upm = self.tt["head"].unitsPerEm
        cap = getattr(self.tt["OS/2"], "sCapHeight", None)
        if not cap:  # fallback: caixa do H
            cap = self.tt["glyf"]["H"].yMax if "glyf" in self.tt else self.upm * 0.7
        self.cap = cap
        self.kern = self._load_kern()

    @classmethod
    def get(cls, name):
        if name not in cls._cache:
            cls._cache[name] = cls(name)
        return cls._cache[name]

    def _load_kern(self):
        try:
            return dict(self.tt["kern"].kernTables[0].kernTable)
        except Exception:
            return {}

    def _gname(self, ch):
        name = self.cmap.get(ord(ch))
        if name is None:
            raise KeyError("glifo ausente na fonte %s: %r" % (os.path.basename(self.path), ch))
        return name

    def _units_per_mm(self, cap_mm):
        return self.upm / (self.cap / cap_mm * self.upm / self.upm) if False else self.cap / cap_mm

    def advance(self, text, cap_mm, tracking=0.0):
        """Largura de avanco do texto em mm (sem folga de contorno)."""
        upm_per_mm = self.cap / cap_mm
        total = 0.0
        prev = None
        for ch in text:
            g = self._gname(ch)
            if prev is not None:
                total += self.kern.get((prev, g), 0) / upm_per_mm
            total += self.glyphs[g].width / upm_per_mm + tracking
            prev = g
        return total - tracking if text else 0.0

    def text(self, text, cap_mm, x=0.0, y=0.0, anchor="left", tracking=0.0, bias=0.0):
        """Poligonos do texto, em mm.

        anchor: posicao horizontal de (x, y) -- 'left', 'center' ou 'right'.
        y e sempre a linha de base.

        bias engorda o traco em `bias` mm de cada lado. Serve para levar
        glifos finos (o "@" e os til/cedilha sao os criticos) ao detalhe
        minimo imprimivel, sem ter que aumentar o corpo do texto.
        """
        upm_per_mm = self.cap / cap_mm
        scale = 1.0 / upm_per_mm
        steps = max(3, int(round((cap_mm / FLATNESS_MM) ** 0.5)))

        width = self.advance(text, cap_mm, tracking)
        pen_x = {"left": x, "center": x - width / 2.0, "right": x - width}[anchor]

        parts = []
        prev = None
        for ch in text:
            g = self._gname(ch)
            if prev is not None:
                pen_x += self.kern.get((prev, g), 0) * scale
            if not ch.isspace():
                pen = _PolyPen(self.glyphs, scale, steps)
                self.glyphs[g].draw(pen)
                shape = _assemble(pen.contours)
                if shape is not None and not shape.is_empty:
                    parts.append(translate(shape, pen_x, y))
            pen_x += self.glyphs[g].width * scale + tracking
            prev = g

        out = unary_union(parts) if parts else Polygon()
        if bias and not out.is_empty:
            out = out.buffer(bias, join_style=1, resolution=8)
        return out
