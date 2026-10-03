"""Gera img/desenho_tecnico.png — corte cotado e vista de cima da peça de canto.
Mantenha os valores iguais aos de canto_pe_cupula.scad."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Rectangle, Circle

espessura_base, espessura_cupula = 3, 3
folga_base, folga_cupula = 0.4, 0.4
altura_pe, A = 30, 45
parede_externa, parede_interna = 3, 3
largura_apoio_base, profundidade_canal = 12, 10
ch, altura_acima_base = 1, 9

g = espessura_cupula + folga_cupula
u0, u1 = parede_externa, parede_externa + g
ub = u1 + parede_interna
W = ub + largura_apoio_base
zt = altura_pe + espessura_base + folga_base + altura_acima_base
zc = zt - profundidade_canal

PLA, BASE, CUP = "#3b6ea8", "#d2a86e", "#9fd3f5"

def cota(ax, p1, p2, txt, off, vertical=False):
    (x1, y1), (x2, y2) = p1, p2
    if vertical:
        x = x1 + off
        ax.annotate("", (x, y1), (x, y2), arrowprops=dict(arrowstyle="<->", lw=.8))
        ax.plot([x1, x], [y1, y1], "k:", lw=.5); ax.plot([x2, x], [y2, y2], "k:", lw=.5)
        ax.text(x + (1 if off > 0 else -1), (y1 + y2) / 2, txt, rotation=90,
                va="center", ha="left" if off > 0 else "right", fontsize=8)
    else:
        y = y1 + off
        ax.annotate("", (x1, y), (x2, y), arrowprops=dict(arrowstyle="<->", lw=.8))
        ax.plot([x1, x1], [y1, y], "k:", lw=.5); ax.plot([x2, x2], [y2, y], "k:", lw=.5)
        ax.text((x1 + x2) / 2, y + (0.8 if off > 0 else -0.8), txt, ha="center",
                va="bottom" if off > 0 else "top", fontsize=8)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 8.5), gridspec_kw=dict(width_ratios=[1.15, 1]))

# ---------------- CORTE ----------------
perfil = [(0, 0), (W, 0), (W, altura_pe), (ub, altura_pe), (ub, zt), (u1 + ch, zt),
          (u1, zt - ch), (u1, zc), (u0, zc), (u0, zt - ch), (u0 - ch, zt), (0, zt)]
ax1.add_patch(Polygon(perfil, fc=PLA, ec="k", lw=1.2, alpha=.9, label="Peça de canto (PLA)"))
ax1.add_patch(Rectangle((ub, altura_pe), W - ub + 18, espessura_base, fc=BASE, ec="k", lw=.8,
                        label=f"Base ({espessura_base} mm)"))
ax1.add_patch(Rectangle((u0 + folga_cupula / 2, zc + .2), espessura_cupula, 30, fc=CUP, ec="k",
                        lw=.8, alpha=.8, label=f"Parede da cúpula ({espessura_cupula} mm)"))
ax1.text(-4, 15, "LADO DE FORA", rotation=90, va="center", ha="right", fontsize=9, color="gray")
ax1.text(W + 10, altura_pe + 12, "LADO DE DENTRO\n(interior da maquete)", ha="center", fontsize=9, color="gray")

cota(ax1, (0, 0), (W, 0), f"{W:.1f}", -5)
cota(ax1, (0, zt), (u0, zt), f"{u0:g}", 6)
cota(ax1, (u0, zt), (u1, zt), f"{g:.1f}", 10)
cota(ax1, (u1, zt), (ub, zt), f"{parede_interna:g}", 6)
cota(ax1, (ub, altura_pe + espessura_base), (W, altura_pe + espessura_base), f"apoio {largura_apoio_base:g}", 14)
cota(ax1, (W, 0), (W, altura_pe), f"pé {altura_pe:g}", 4, vertical=True)
cota(ax1, (0, 0), (0, zt), f"total {zt:.1f}", -9, vertical=True)
cota(ax1, (u0, zc), (u0, zt), f"canal {profundidade_canal:g}", -4.5, vertical=True)
ax1.annotate(f"chanfro {ch:g}×45°", (u1 + ch / 2, zt - ch / 2), (u1 + 9, zt + 18),
             fontsize=8, arrowprops=dict(arrowstyle="->", lw=.7))
ax1.annotate(f"folga {folga_base:g} acima da base", (ub + .3, altura_pe + espessura_base + .2),
             (ub + 10, altura_pe - 9), fontsize=8, arrowprops=dict(arrowstyle="->", lw=.7))
ax1.set_xlim(-20, W + 25); ax1.set_ylim(-12, zt + 30)
ax1.set_aspect("equal"); ax1.axis("off")
ax1.set_title("CORTE de um braço (escala 1:1 em mm)", fontsize=12, weight="bold")
ax1.legend(loc="upper right", fontsize=8, frameon=False)

# ---------------- VISTA DE CIMA ----------------
L = [(0, 0), (A, 0), (A, W), (W, W), (W, A), (0, A)]
ax2.add_patch(Polygon(L, fc=PLA, ec="k", lw=1.2, alpha=.35))
ax2.add_patch(Polygon([(0, 0), (A, 0), (A, ub), (ub, ub), (ub, A), (0, A)], fc=PLA, ec="k", lw=1, alpha=.9))
ax2.add_patch(Polygon([(u0, u0), (A, u0), (A, u1), (u1, u1), (u1, A), (u0, A)], fc="white", ec="k", lw=.8))
c = ub + largura_apoio_base / 2
ax2.add_patch(Circle((c, c), 3.2 / 2, fc="white", ec="k"))
ax2.add_patch(Circle((c, c), 6.5 / 2, fc="none", ec="k", ls="--", lw=.6))
ax2.text(c + 5, c + 1, "furo Ø3,2\n(rebaixo Ø6,5 por baixo)", fontsize=7.5)
ax2.text(A - 6, u0 + g / 2, "canaleta da cúpula", fontsize=7.5, ha="right", va="center")
ax2.text((ub + W) / 2, A - 3, "degrau: base apoia aqui", fontsize=7.5, rotation=90, ha="center", va="top")
cota(ax2, (0, 0), (A, 0), f"braço {A:g}", -5)
cota(ax2, (0, 0), (0, W), f"{W:.1f}", -5, vertical=True)
cota(ax2, (0, A), (ub, A), f"{ub:.1f}", 4)
ax2.annotate("CANTO EXTERNO = canto da maquete", (-0.5, -0.5), (-13, -13), fontsize=8, color="gray",
             arrowprops=dict(arrowstyle="->", color="gray", lw=.6))
ax2.set_xlim(-14, A + 8); ax2.set_ylim(-16, A + 10)
ax2.set_aspect("equal"); ax2.axis("off")
ax2.set_title("VISTA DE CIMA (1 peça — imprimir 4)", fontsize=12, weight="bold")

fig.suptitle("Maquete — pé de canto com encaixe da cúpula  ·  medidas em mm  ·  PLA",
             fontsize=14, weight="bold")
fig.text(.5, .02,
         f"Base fica recuada {ub:.1f} mm da face externa  →  Cúpula (medida externa) = Base + "
         f"{2 * (ub - u0 - folga_cupula / 2):.1f} mm em cada direção  ·  "
         f"Canaleta em L a 90° força a cúpula no esquadro",
         ha="center", fontsize=10)
plt.savefig("img/desenho_tecnico.png", dpi=130, bbox_inches="tight")
