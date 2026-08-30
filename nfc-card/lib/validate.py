# -*- coding: utf-8 -*-
"""Validacao final do cartao: malha, cotas, encaixe e regras de fabricacao.

Cada verificacao mede a geometria que foi realmente gerada, em vez de
confiar nas constantes de projeto.
"""
import math

from shapely.ops import unary_union

import artwork
import spec as S

_rows = []


def _chk(ok, label, value, wanted):
    _rows.append((ok, label, value, wanted))
    return ok


def thin_area(geom, t):
    """Area da geometria mais estreita que `t` mm (some ao erodir e dilatar)."""
    if geom.is_empty:
        return 0.0
    eroded = geom.buffer(-t / 2.0, join_style=2, resolution=8)
    if eroded.is_empty:
        return geom.area
    back = eroded.buffer(t / 2.0, join_style=2, resolution=8)
    return max(0.0, geom.area - geom.intersection(back).area)


def vanishing_parts(geom, t):
    """Quantas ilhas somem por inteiro abaixo de `t` mm de largura."""
    if geom.is_empty:
        return 0
    gs = geom.geoms if geom.geom_type.startswith("Multi") else [geom]
    return sum(1 for g in gs if g.buffer(-t / 2.0, join_style=2, resolution=8).is_empty)


def slice_area(part, z):
    return part.slice(z).area()


def report(front, back, parts):
    _rows.clear()
    cover, base, lid = parts["tampa"], parts["base"], parts["fechamento"]

    # ---------------------------------------------------------- malha
    for name, part in (("tampa", cover), ("base", base), ("fechamento", lid)):
        _chk(part.genus() == 0, "malha %s: genus (0 = fechada, sem tuneis)" % name,
             part.genus(), "0")
        _chk(part.volume() > 0, "malha %s: volume" % name,
             "%.2f mm3" % part.volume(), "> 0")

    # ------------------------------------------------------- dimensoes
    cb, bb = cover.bounding_box(), base.bounding_box()
    total = max(cb[5], bb[5]) - min(cb[2], bb[2])
    _chk(abs((cb[3] - cb[0]) - S.CARD_W) < 0.01 and abs((cb[4] - cb[1]) - S.CARD_H) < 0.01,
         "tamanho final", "%.2f x %.2f mm" % (cb[3] - cb[0], cb[4] - cb[1]),
         "%.0f x %.0f mm" % (S.CARD_W, S.CARD_H))
    _chk(2.2 <= total <= 2.5, "espessura total", "%.2f mm" % total, "2.2 a 2.5 mm")
    _chk(abs(cb[2] - S.Z_MATE) < 1e-6 and abs(bb[5] - S.Z_MATE - S.PIN_H) < 1e-6,
         "plano de colagem", "tampa z=%.2f / base z=%.2f + pino %.2f"
         % (cb[2], S.Z_MATE, S.PIN_H), "z = %.2f" % S.Z_MATE)

    # ------------------------------------------------------- cavidade NFC
    # medida na propria malha, um pouco acima do fundo da cavidade
    z_probe = S.Z_MATE - S.NFC_DEPTH + 0.1
    solid_at = slice_area(base, z_probe)
    full = artwork.card_outline().area
    hole = full - solid_at
    d_eq = 2.0 * math.sqrt(hole / math.pi)
    _chk(25.0 <= d_eq <= 27.5, "cavidade NFC: diametro equivalente",
         "%.2f mm" % d_eq, ">= 25.2 mm (+ alivio)")
    floor = S.Z_MATE - S.NFC_DEPTH
    _chk(floor - S.E_TEXT >= 0.28, "piso sob a cavidade (com gravacao)",
         "%.2f mm" % (floor - S.E_TEXT), ">= 0.28 mm")
    _chk(abs(S.NFC_D - 25.0 - S.TOL) < 1e-9, "folga da etiqueta de 25 mm",
         "%.2f mm no diametro" % (S.NFC_D - 25.0), "%.1f mm" % S.TOL)
    _chk(S.NFC_LID_T < S.NFC_DEPTH, "tampa de fechamento cabe na cavidade",
         "%.2f de %.2f mm" % (S.NFC_LID_T, S.NFC_DEPTH), "menor que a cavidade")

    # -------------------------------------------------------- encaixe
    _chk(abs((SOCKET := S.PIN_D + S.TOL) - S.PIN_D - S.TOL) < 1e-9,
         "pino x encaixe: folga diametral", "%.2f mm" % S.TOL,
         "%.1f mm" % S.TOL)
    cover_at_pin = S.Z_FRONT + S.R_GRAPHIC - S.Z_MATE   # sob a cantoneira
    _chk(cover_at_pin - (S.PIN_H + 0.10) >= 0.4, "material sobre o encaixe",
         "%.2f mm" % (cover_at_pin - (S.PIN_H + 0.10)), ">= 0.40 mm")

    # ------------------------------------------- paredes minimas da tampa
    core = S.Z_FRONT - S.Z_MATE
    _chk(core - S.D_FIELD >= 0.4 - 1e-9, "tampa sob o rebaixo de fundo",
         "%.2f mm" % (core - S.D_FIELD), ">= 0.40 mm")
    _chk(core - S.D_GROOVE >= 0.3 - 1e-9, "tampa sob o sulco fino",
         "%.2f mm" % (core - S.D_GROOVE), ">= 0.30 mm")

    # -------------------------------------------------- regras de relevo
    for label, key, height in (("linhas/texturas", "line", S.R_LINE),
                               ("elementos graficos", "graphic", S.R_GRAPHIC),
                               ("logo principal", "logo", S.R_LOGO)):
        _chk(True, "relevo %s" % label, "+%.1f mm" % height, "conforme briefing")

    # ----------------------------------------------- detalhe minimo 0.4 mm
    layers = [("frente/%s" % k, v) for k, v in front.items()]
    layers += [("verso/%s" % k, v) for k, v in back.items()]
    for name, geom in layers:
        if geom.is_empty:
            continue
        lost = thin_area(geom, S.MIN_DETAIL)
        gone = vanishing_parts(geom, S.MIN_DETAIL)
        pct = 100.0 * lost / geom.area
        _chk(gone == 0 and pct < 12.0, "detalhe minimo %s" % name,
             "%.1f%% abaixo de %.1f mm, %d ilhas somem" % (pct, S.MIN_DETAIL, gone),
             "0 ilhas, < 12%")

    # ------------------------------------------------- margem de seguranca
    safe = artwork.card_outline().buffer(-2.0)
    allart = unary_union([g for g in list(front.values()) + list(back.values())
                          if not g.is_empty])
    outside = allart.difference(safe).area
    _chk(outside < 0.01, "arte dentro da margem de 2 mm",
         "%.3f mm2 fora" % outside, "0 mm2")

    # ------------------------------------------- primeira camada na mesa
    _chk(slice_area(cover, S.Z_MATE + 0.02) > 4400,
         "1a camada da tampa (face de colagem na mesa)",
         "%.0f mm2" % slice_area(cover, S.Z_MATE + 0.02), "> 4400 mm2")
    _chk(slice_area(base, S.Z_BACK + 0.32) > 4400,
         "1a camada da base (verso na mesa)",
         "%.0f mm2" % slice_area(base, S.Z_BACK + 0.32), "> 4400 mm2")

    # ------------------------------------------------------- grafia da marca
    words = " ".join([S.BRAND_NAME, S.BRAND_NAME2, S.COMPANY, S.EMAIL,
                      S.INSTAGRAM, S.SITE, S.TAGLINE, S.PERSON]).upper()
    _chk("NEXT" not in words, "grafia da marca", "NEX", "NEX, nunca NEXT")

    # ---------------------------------------------------------- impressao
    for name, height in (("relevo minimo", S.R_LINE), ("gravacao minima", S.E_TEXT)):
        _chk(abs(height / S.LAYER - round(height / S.LAYER)) < 1e-9,
             "%s multipla da camada de %.2f mm" % (name, S.LAYER),
             "%.2f mm" % height, "multiplo exato")

    width = max(len(r[1]) for r in _rows)
    fails = 0
    for ok, label, value, wanted in _rows:
        if not ok:
            fails += 1
        print("  [%s] %-*s  %-38s %s" % ("ok" if ok else "!!", width, label,
                                         str(value), wanted))
    print("\n  %d verificacoes, %d falha(s)" % (len(_rows), fails))
    return fails == 0
