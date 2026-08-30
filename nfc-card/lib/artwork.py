# -*- coding: utf-8 -*-
"""Arte 2D do cartao: frente (tampa) e verso (base).

Cada face e descrita como um conjunto de camadas por nivel de relevo. As
camadas sao resolvidas por prioridade -- o nivel mais alto vence e abre uma
folga visivel no nivel de baixo -- para que sobreposicoes de layout nunca
virem geometria ambigua.

A frente e desenhada em coordenadas do cartao (x para a direita, y para
cima, origem no canto inferior esquerdo). O verso e desenhado como quem o
le, de costas para a frente, e espelhado ao final -- assim o layout do
verso e escrito de forma natural e cai alinhado com a frente na montagem.
"""
import math

from shapely.affinity import scale as _scale
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

import geo
import logo
import spec as S
from text2d import Font

GAP = 0.25   # folga entre niveis de relevo, para o desenho respirar
BIAS = 0.05  # engorda tipos pequenos ate o detalhe minimo de 0.4 mm


# ------------------------------------------------------------------ apoio
def _bold():
    return Font.get(S.FONT_BOLD)


def fit_cap(font, text, target_w, tracking):
    """Altura de caixa alta que faz o texto ocupar exatamente `target_w`."""
    a, b = 1.0, 2.0
    wa, wb = font.advance(text, a, tracking), font.advance(text, b, tracking)
    return a + (target_w - wa) * (b - a) / (wb - wa)


def card_outline():
    return geo.rounded_rect(S.CARD_W, S.CARD_H, S.CORNER_R)


def nfc_pocket_area():
    """Pegada da cavidade NFC, em coordenadas da frente."""
    return geo.disc(S.NFC_CX, S.NFC_CY, S.NFC_D)


def mirror(geom):
    """Espelha do referencial do verso para o referencial de montagem."""
    return _scale(geom, -1.0, 1.0, origin=(S.CARD_W / 2.0, 0.0))


def resolve(layers, order):
    """Aplica prioridade entre niveis: o de cima corta o de baixo com folga."""
    out, above = {}, None
    for name in order:
        g = layers.get(name)
        g = Polygon() if g is None or g.is_empty else g
        if above is not None and not above.is_empty:
            g = g.difference(above.buffer(GAP, join_style=2, resolution=8))
        out[name] = g
        above = g if above is None else unary_union([above, g])
    return out


# --------------------------------------------------------------- icones
def _icon_phone(cx, cy, h, w):
    body = geo.outline(geo.rounded_rect(h * 0.62, h, h * 0.16, cx, cy), w)
    dot = geo.disc(cx, cy - h * 0.33, w * 1.3)
    return geo.merge(body, dot)


def _icon_mail(cx, cy, h, w):
    box = geo.rounded_rect(h * 1.35, h * 0.95, h * 0.10, cx, cy)
    flap = geo.stroke([(cx - h * 0.60, cy + h * 0.40), (cx, cy - h * 0.05),
                       (cx + h * 0.60, cy + h * 0.40)], w, cap="flat", join="mitre")
    return geo.merge(geo.outline(box, w), flap.intersection(box))


def _icon_instagram(cx, cy, h, w):
    frame = geo.outline(geo.rounded_rect(h, h, h * 0.28, cx, cy), w)
    lens = geo.outline(geo.disc(cx, cy, h * 0.46), w)
    dot = geo.disc(cx + h * 0.28, cy + h * 0.28, w * 1.25)
    return geo.merge(frame, lens, dot)


def _icon_site(cx, cy, h, w):
    circle = geo.outline(geo.disc(cx, cy, h), w)
    meridian = geo.outline(_scale(geo.disc(cx, cy, h), 0.45, 1.0, origin=(cx, cy)), w * 0.9)
    equator = geo.stroke([(cx - h / 2.0, cy), (cx + h / 2.0, cy)], w * 0.9)
    return geo.merge(circle, meridian, equator)


ICONS = {"phone": _icon_phone, "mail": _icon_mail,
         "instagram": _icon_instagram, "site": _icon_site}


# ---------------------------------------------------------------- FRENTE
HEX_R = 14.0
HEX_RING = 1.3          # diferenca de raio entre hexagono externo e interno
BRACKET_INSET = 4.2
BRACKET_ARM = 5.0
BRACKET_W = 1.8
PIN_XY = [(BRACKET_INSET, BRACKET_INSET),
          (S.CARD_W - BRACKET_INSET, BRACKET_INSET),
          (BRACKET_INSET, S.CARD_H - BRACKET_INSET),
          (S.CARD_W - BRACKET_INSET, S.CARD_H - BRACKET_INSET)]

_HEX_TOP = S.NFC_CY + HEX_R * math.sqrt(3) / 2.0
_HEX_BOT = S.NFC_CY - HEX_R * math.sqrt(3) / 2.0

TRACES = [
    # (pontos, pad inicial, pad final) -- trilhas de circuito, nivel linha
    ([(12.5, 47.6), (30.0, 47.6), (33.2, 44.4)], 1.7, 1.7),
    ([(38.0, 47.4), (62.9, 47.4), (66.5, 43.8), (66.5, _HEX_TOP)], 1.7, 0.0),
    ([(73.5, _HEX_BOT), (77.0, 13.4), (77.0, 10.8)], 0.0, 1.9),
    ([(6.9, 22.6), (6.9, 17.5), (9.9, 14.5)], 1.8, 1.8),
    ([(21.0, 44.8), (31.0, 44.8)], 1.6, 1.6),
    ([(48.0, 11.0), (56.0, 11.0)], 1.6, 1.6),
]

ENERGY = [(12.0, 26.5), (12.0, 12.5), (36.0, 12.5),
          (36.0 + (_HEX_BOT - 12.5), _HEX_BOT), (S.NFC_CX - HEX_R / 2.0, _HEX_BOT)]


def front():
    """Camadas de relevo da frente, em coordenadas do cartao."""
    bold = _bold()

    # --- logo principal (+0.6)
    mark = logo.mark(11.5, x=6.5, y=34.6, anchor="left-center")
    word1 = bold.text(S.BRAND_NAME, 5.2, 20.0, 35.8)
    word2 = bold.text(S.BRAND_NAME2, 5.2, 20.0, 29.0)
    lvl_logo = geo.merge(mark, word1, word2)

    # --- area NFC hexagonal
    hex_out = geo.hexagon(S.NFC_CX, S.NFC_CY, HEX_R)
    hex_in = geo.hexagon(S.NFC_CX, S.NFC_CY, HEX_R - HEX_RING)
    hex_ring = geo.ring(hex_out, hex_in)
    nfc = geo.nfc_symbol(S.NFC_CX, 32.8, 6.6, 0.9)
    call = bold.text(S.NFC_CALL, 2.0, S.NFC_CX, 24.4, anchor="center",
                     tracking=0.35, bias=BIAS)

    # --- cantoneiras (recebem os pinos de alinhamento por baixo)
    brackets = [geo.bracket(x, y, BRACKET_ARM, BRACKET_W,
                            1 if x < S.CARD_W / 2 else -1,
                            1 if y < S.CARD_H / 2 else -1) for x, y in PIN_XY]

    # --- assinatura e linha de energia ate a area NFC
    tag_cap = fit_cap(bold, S.TAGLINE, 66.0, 0.30)
    tagline = bold.text(S.TAGLINE, tag_cap, S.CARD_W / 2.0, 6.2,
                        anchor="center", tracking=0.30, bias=BIAS)
    energy = geo.merge(geo.stroke(ENERGY, 0.9, cap="flat", join="mitre"),
                       geo.disc(*ENERGY[0], 2.0))

    lvl_graphic = geo.merge(hex_ring, nfc, call, tagline, energy, *brackets)

    # --- trilhas de circuito (+0.2)
    traces = []
    for pts, d0, d1 in TRACES:
        traces.append(geo.stroke(pts, 0.55, cap="round", join="mitre"))
        if d0:
            traces.append(geo.disc(pts[0][0], pts[0][1], d0))
        if d1:
            traces.append(geo.disc(pts[-1][0], pts[-1][1], d1))
    divider = geo.stroke([(S.NFC_CX - 6.0, 27.6), (S.NFC_CX + 6.0, 27.6)], 0.5)
    lvl_line = geo.merge(divider, *traces)

    # --- rebaixos
    field = hex_in
    groove = geo.outline(geo.rounded_rect(S.CARD_W - 4.8, S.CARD_H - 4.8,
                                          S.CORNER_R - 2.4, S.CARD_W / 2.0,
                                          S.CARD_H / 2.0), 0.55)

    layers = {"logo": lvl_logo, "graphic": lvl_graphic, "line": lvl_line,
              "field": field, "groove": groove}
    out = resolve(layers, ["logo", "graphic", "line", "field", "groove"])
    # o fundo rebaixado do hexagono nao deve invadir o anel externo
    out["field"] = geo.drop_thin(out["field"].intersection(hex_in), S.MIN_DETAIL)
    return out


# ----------------------------------------------------------------- VERSO
# Layout do verso em coordenadas de leitura (espelhado no final).
# A esquerda fica o eco hexagonal da area NFC, exatamente sobre a antena;
# a direita, o bloco de contato -- que assim nao cai sobre a cavidade.
BACK_HEX_CX = S.CARD_W - S.NFC_CX      # 18.5 -- alinhado com a antena
BACK_HEX_CY = S.NFC_CY
BACK_HEX_R = 12.0
COL_X = 34.0


def back():
    """Camadas de gravacao do verso, ja espelhadas para a montagem."""
    bold = _bold()

    # --- eco da area NFC, sobre a antena
    hex_echo = geo.merge(
        geo.outline(geo.hexagon(BACK_HEX_CX, BACK_HEX_CY, BACK_HEX_R), 0.8),
        geo.outline(geo.hexagon(BACK_HEX_CX, BACK_HEX_CY, BACK_HEX_R - 2.6), 0.5),
        geo.nfc_symbol(BACK_HEX_CX, BACK_HEX_CY + 1.4, 5.6, 0.8),
        bold.text("NFC", 2.1, BACK_HEX_CX, BACK_HEX_CY - 6.4,
                  anchor="center", tracking=0.55, bias=BIAS))

    # --- marca e assinatura
    mark = logo.mark(9.0, x=COL_X, y=45.8, anchor="left-center")
    word = geo.merge(bold.text(S.BRAND_NAME, 3.0, COL_X + 11.0, 47.0),
                     bold.text(S.BRAND_NAME2, 3.0, COL_X + 11.0, 43.0))
    divider = geo.stroke([(COL_X, 38.6), (S.CARD_W - 6.0, 38.6)], 0.5)

    # --- identificacao
    name = bold.text(S.PERSON, 3.2, COL_X, 32.6, tracking=0.05)
    role = bold.text(S.ROLE, 2.4, COL_X, 27.8, tracking=0.50, bias=BIAS)
    company = bold.text(S.COMPANY, 2.4, COL_X, 23.6, tracking=0.25, bias=BIAS)

    # --- contatos
    rows = [("phone", S.PHONE), ("mail", S.EMAIL),
            ("instagram", S.INSTAGRAM), ("site", S.SITE)]
    contacts = []
    for i, (icon, text) in enumerate(rows):
        y = 18.0 - i * 4.3
        contacts.append(ICONS[icon](COL_X + 1.6, y + 0.95, 2.8, 0.50))
        contacts.append(bold.text(text, 2.4, COL_X + 5.0, y, tracking=0.05, bias=BIAS))

    # --- traco decorativo na coluna da esquerda
    accents = geo.merge(
        geo.stroke([(6.5, 46.5), (14.0, 46.5), (16.5, 44.0)], 0.5),
        geo.disc(6.5, 46.5, 1.5),
        geo.stroke([(20.5, 10.0), (28.0, 10.0), (30.5, 12.5)], 0.5),
        geo.disc(30.5, 12.5, 1.5))

    deep = name
    text = geo.merge(hex_echo, mark, word, divider, role, company, accents, *contacts)

    # A gravacao profunda nao pode invadir a pegada da cavidade NFC: ali o
    # piso tem 0.5 mm e -0.3 deixaria so 0.2 mm. O que cair sobre a cavidade
    # e rebaixado para a gravacao rasa.
    guard = mirror(nfc_pocket_area()).buffer(0.5)
    over = deep.intersection(guard)
    if not over.is_empty:
        deep = deep.difference(guard)
        text = geo.merge(text, over)

    layers = resolve({"deep": deep, "text": text}, ["deep", "text"])
    return {k: mirror(geo.drop_thin(v, S.MIN_DETAIL)) for k, v in layers.items()}
