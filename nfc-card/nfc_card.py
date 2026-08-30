# -*- coding: utf-8 -*-
"""Gera os STL do cartao de visita NFC da NEX Layer3D.

Sao tres pecas independentes, cada uma exportada ja na orientacao de
impressao (face decorada para cima, face plana na mesa):

    tampa superior      frente em relevo, cola sobre a base
    base inferior       verso gravado e cavidade da etiqueta NFC
    tampa de fechamento disco fino opcional, prende a etiqueta sem cola

Uso:  python3 nfc_card.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "lib"))

import manifold3d
from manifold3d import Manifold

import artwork
import geo
import solid
import spec as S
import validate

manifold3d.set_circular_segments(160)

HERE = os.path.dirname(os.path.abspath(__file__))
STL = os.path.join(HERE, "stl")

# Colapsa arestas menores que isto: metade da altura de camada mais fina
# nao chega perto, entao a malha encolhe pela metade sem mudar a peca.
SIMPLIFY = 0.002

SOCKET_D = S.PIN_D + S.TOL      # furo do pino, com a tolerancia recomendada
SOCKET_H = S.PIN_H + 0.10       # folga de fundo para o pino assentar
CHAM = S.EDGE_CHAMFER


def cylinder(d, z0, z1, cx=0.0, cy=0.0):
    return Manifold.cylinder(z1 - z0, d / 2.0, d / 2.0, 0, False) \
        .translate((cx, cy, z0))


# --------------------------------------------------------------- pecas
def build_cover(front):
    """Tampa superior: da face de colagem ate o topo do logo."""
    outline = artwork.card_outline()
    blank = solid.chamfered_slab(outline, [
        (S.Z_MATE, 0.0),            # face de colagem, plana
        (S.Z_FRONT - CHAM, 0.0),
        (S.Z_FRONT, CHAM),          # chanfro de toque na aresta da frente
    ])

    reliefs = [
        solid.extrude(front["line"], S.Z_FRONT, S.Z_FRONT + S.R_LINE),
        solid.extrude(front["graphic"], S.Z_FRONT, S.Z_FRONT + S.R_GRAPHIC),
        solid.extrude(front["logo"], S.Z_FRONT, S.Z_FRONT + S.R_LOGO),
    ]
    cuts = [
        solid.extrude(front["field"], S.Z_FRONT - S.D_FIELD, S.Z_FRONT + solid.EPS),
        solid.extrude(front["groove"], S.Z_FRONT - S.D_GROOVE, S.Z_FRONT + solid.EPS),
    ]
    # encaixes dos pinos de alinhamento, sob as cantoneiras (onde a tampa
    # tem 1.0 mm de material e nao os 0.6 mm do plano base)
    cuts += [cylinder(SOCKET_D, S.Z_MATE - solid.EPS, S.Z_MATE + SOCKET_H, x, y)
             for x, y in artwork.PIN_XY]

    return solid.difference(solid.union([blank] + reliefs), cuts)


def build_base(back):
    """Base inferior: verso gravado, cavidade NFC e pinos de alinhamento."""
    outline = artwork.card_outline()
    blank = solid.chamfered_slab(outline, [
        (S.Z_BACK, CHAM),           # chanfro de toque na aresta do verso
        (S.Z_BACK + CHAM, 0.0),
        (S.Z_MATE, 0.0),            # face de colagem, plana
    ])

    engrave = [
        solid.extrude(back["text"], S.Z_BACK - solid.EPS, S.Z_BACK + S.E_TEXT),
        solid.extrude(back["deep"], S.Z_BACK - solid.EPS, S.Z_BACK + S.E_DEEP),
    ]

    # cavidade da etiqueta + alivio lateral para tirar a etiqueta com a unha
    pocket_area = geo.merge(artwork.nfc_pocket_area(),
                            geo.disc(S.NFC_CX, S.NFC_CY - S.NFC_D / 2.0, 7.0))
    pocket = solid.extrude(pocket_area, S.Z_MATE - S.NFC_DEPTH, S.Z_MATE + solid.EPS)

    # canal de cola: a cola escorre para dentro dele em vez de vazar na borda
    glue_ring = geo.outline(
        geo.rounded_rect(S.CARD_W - 2 * S.GLUE_INSET, S.CARD_H - 2 * S.GLUE_INSET,
                         S.CORNER_R - S.GLUE_INSET, S.CARD_W / 2.0, S.CARD_H / 2.0),
        S.GLUE_W)
    glue = solid.extrude(glue_ring, S.Z_MATE - S.GLUE_DEPTH, S.Z_MATE + solid.EPS)

    pins = [cylinder(S.PIN_D, S.Z_MATE, S.Z_MATE + S.PIN_H, x, y)
            for x, y in artwork.PIN_XY]

    body = solid.difference(blank, engrave + [pocket, glue])
    return solid.union([body] + pins)


def build_lid():
    """Tampa fina opcional: prende a etiqueta sem colar as duas metades."""
    tab = geo.disc(S.NFC_CX, S.NFC_CY - S.NFC_D / 2.0, 6.4)
    disc = geo.merge(geo.disc(S.NFC_CX, S.NFC_CY, S.NFC_LID_D), tab)
    top = disc.buffer(-0.15, join_style=1, resolution=16)
    z_step = S.NFC_LID_T - 0.10
    return solid.union([
        solid.extrude(disc, 0.0, z_step),
        solid.extrude(top, z_step, S.NFC_LID_T),   # alivio para entrar facil
    ])


# ---------------------------------------------------------------- saida
def main():
    os.makedirs(STL, exist_ok=True)
    front, back = artwork.front(), artwork.back()

    print("gerando solidos...")
    exact = (build_cover(front), build_base(back), build_lid())
    cover, base, lid = (part.simplify(SIMPLIFY) for part in exact)

    parts = [
        ("01_tampa_superior", cover, S.Z_MATE),
        ("02_base_inferior", base, S.Z_BACK),
        ("03_tampa_fechamento", lid, 0.0),
    ]
    print()
    for name, part, z_floor in parts:
        printable = part.translate((0.0, 0.0, -z_floor))  # face plana na mesa
        path = os.path.join(STL, "nexlayer3d_%s.stl" % name)
        tris = solid.to_stl(printable, path)
        bb = printable.bounding_box()
        print("%-22s %7d triangulos  %6.2f mm3  %.2f x %.2f x %.2f mm  genus %d"
              % (name, tris, part.volume(), bb[3] - bb[0], bb[4] - bb[1],
                 bb[5] - bb[2], part.genus()))

    # montagem: as duas metades na posicao final, so para conferencia.
    # A uniao sai das pecas exatas e so depois e simplificada -- unir duas
    # malhas ja simplificadas deixaria arestas soltas no plano de colagem.
    assembly = solid.union([exact[0], exact[1]]).simplify(SIMPLIFY)
    path = os.path.join(STL, "nexlayer3d_04_montagem.stl")
    tris = solid.to_stl(assembly, path)
    bb = assembly.bounding_box()
    print("%-22s %7d triangulos  %6.2f mm3  %.2f x %.2f x %.2f mm"
          % ("04_montagem", tris, assembly.volume(),
             bb[3] - bb[0], bb[4] - bb[1], bb[5] - bb[2]))

    print()
    ok = validate.report(front, back, {"tampa": cover, "base": base, "fechamento": lid})
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
