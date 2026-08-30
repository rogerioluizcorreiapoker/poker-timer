# -*- coding: utf-8 -*-
"""Previa 2D das camadas de relevo, para conferir o layout antes do solido."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "lib"))

from PIL import Image, ImageDraw

import artwork
import spec as S

PX = 12  # pixels por mm
COLORS = {
    "groove": (24, 30, 40), "field": (20, 26, 36), "line": (96, 178, 214),
    "graphic": (188, 208, 224), "logo": (0, 178, 214),
    "text": (150, 172, 190), "deep": (232, 240, 248),
}


def draw(geoms, path, title):
    w, h = int(S.CARD_W * PX) + 2, int(S.CARD_H * PX) + 2
    img = Image.new("RGB", (w, h), (14, 17, 22))

    def put(geom, color):
        """Compoe a geometria por mascara -- furos ficam transparentes."""
        if geom.is_empty:
            return
        mask = Image.new("L", (w, h), 0)
        dr = ImageDraw.Draw(mask)
        gs = geom.geoms if geom.geom_type.startswith("Multi") else [geom]
        for g in sorted(gs, key=lambda p: -p.area):
            dr.polygon([(x * PX, h - y * PX) for x, y in g.exterior.coords], fill=255)
            for r in g.interiors:
                dr.polygon([(x * PX, h - y * PX) for x, y in r.coords], fill=0)
        img.paste(color, (0, 0), mask)

    put(artwork.card_outline(), (32, 38, 48))
    for name in ("groove", "field", "line", "graphic", "logo", "text", "deep"):
        if name in geoms:
            put(geoms[name], COLORS[name])

    # contorno da cavidade NFC, so como referencia
    put(artwork.nfc_pocket_area().boundary.buffer(0.12), (220, 90, 60))
    img.save(path)
    print(title, "->", path)


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "preview")
    os.makedirs(out, exist_ok=True)
    draw(artwork.front(), os.path.join(out, "layout_frente.png"), "frente")
    draw(artwork.back(), os.path.join(out, "layout_verso.png"), "verso")
