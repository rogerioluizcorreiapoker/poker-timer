# -*- coding: utf-8 -*-
"""Vistas do cartao: ortograficas, perspectiva, explodido e detalhe NFC."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, os.pardir, "lib"))
sys.path.insert(0, os.path.join(HERE, os.pardir))

import manifold3d
from manifold3d import Manifold

import artwork
import nfc_card
import render
import spec as S

manifold3d.set_circular_segments(160)
OUT = os.path.join(HERE, os.pardir, "preview")

CX, CY = S.CARD_W / 2.0, S.CARD_H / 2.0
BG = (10, 13, 18)

# Cores por cota -- as mesmas faixas que permitem troca de filamento por
# altura de camada na impressao multicolor.
GRAPHITE = (48, 56, 68)
DARK = (30, 36, 45)
CYAN = (0, 178, 214)

FRONT = render.palette("alto", [
    (S.Z_FRONT - 0.05, S.Z_FRONT + 0.05, GRAPHITE),                    # plano base
    (S.Z_FRONT + S.R_LINE - 0.05, S.Z_FRONT + S.R_LINE + 0.05,
     (104, 162, 196)),                                                 # linhas   +0.2
    (S.Z_FRONT + S.R_GRAPHIC - 0.05, S.Z_FRONT + S.R_GRAPHIC + 0.05,
     (208, 220, 233)),                                                 # graficos +0.4
    (S.Z_FRONT + S.R_LOGO - 0.05, S.Z_FRONT + S.R_LOGO + 0.05, CYAN),  # logo     +0.6
], DARK)

# no verso a arte e gravada: as faces baixas sao os fundos de gravacao
BACK = render.palette("alto", [
    (S.E_TEXT - 0.05, S.E_TEXT + 0.05, (96, 152, 186)),   # gravacao -0.2
    (S.E_DEEP - 0.05, S.E_DEEP + 0.05, CYAN),             # gravacao -0.3
], GRAPHITE)

EDGE = render.flat(GRAPHITE)
TAG = render.flat((216, 180, 126))
LID = render.flat((150, 162, 178))


def nfc_tag():
    """Etiqueta adesiva de 25 mm, so para as ilustracoes."""
    return Manifold.cylinder(0.35, 12.5, 12.5, 0, False).translate((S.NFC_CX, S.NFC_CY, 0))


def main():
    os.makedirs(OUT, exist_ok=True)
    front, back = artwork.front(), artwork.back()
    cover = nfc_card.build_cover(front)
    base = nfc_card.build_base(back)
    lid = nfc_card.build_lid()

    # --- vistas ortograficas
    render.render(render.Scene().add(cover, FRONT).add(base, EDGE),
                  (1300, 860), eye=(CX, CY, 300), target=(CX, CY, 1.0),
                  up=(0, 1, 0), ortho=60.0, bg=BG,
                  light=(-0.42, -0.62, 1.0)).save(
        os.path.join(OUT, "vista_frente.png"))
    print("vista frente")

    render.render(render.Scene().add(base, BACK).add(cover, FRONT),
                  (1300, 860), eye=(CX, CY, -300), target=(CX, CY, 1.0),
                  up=(0, 1, 0), ortho=60.0, bg=BG,
                  light=(0.42, -0.62, -1.0)).save(
        os.path.join(OUT, "vista_verso.png"))
    print("vista verso")

    # --- perspectiva 3/4
    render.render(render.Scene().add(cover, FRONT).add(base, EDGE),
                  (1300, 900), eye=(CX - 46, CY - 74, 62), target=(CX, CY, 1.2),
                  fov=44.0, bg=BG, light=(-0.40, -0.70, 0.95)).save(
        os.path.join(OUT, "perspectiva.png"))
    print("perspectiva")

    # --- explodido
    sc = (render.Scene()
          .add(cover, FRONT, offset=(0, 0, 25.0))
          .add(lid, LID, offset=(0, 0, 15.0))
          .add(nfc_tag(), TAG, offset=(0, 0, 8.5))
          .add(base, EDGE))
    # elevacao baixa: achata cada peca na tela e deixa as de baixo aparecerem
    render.render(sc, (1200, 900), eye=(CX - 34, CY - 200, 80),
                  target=(CX, CY, 13.5), fov=29.0, bg=BG,
                  light=(-0.40, -0.70, 0.95)).save(
        os.path.join(OUT, "explodido.png"))
    print("explodido")

    # --- detalhe da area NFC
    render.render(render.Scene().add(cover, FRONT).add(base, EDGE),
                  (1100, 900), eye=(S.NFC_CX - 14, S.NFC_CY - 22, 24),
                  target=(S.NFC_CX, S.NFC_CY, 2.1), fov=40.0, bg=BG,
                  light=(-0.45, -0.65, 0.9)).save(
        os.path.join(OUT, "detalhe_nfc.png"))
    print("detalhe nfc")


if __name__ == "__main__":
    main()
