"""Gera img/desenho_tecnico.png a partir do próprio modelo.

Exporta o STL de canto_sama3.scad e corta a malha em planos, então o
desenho sempre bate com a peça impressa. Cotas lidas dos parâmetros do .scad.

Uso:  python3 desenho_tecnico.py      (precisa de openscad e matplotlib)
"""
import os, re, subprocess, tempfile
from collections import defaultdict
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Rectangle, PathPatch
from matplotlib.path import Path

AQUI = os.path.dirname(os.path.abspath(__file__))
SCAD = os.path.join(AQUI, "canto_sama3.scad")

# ---------- parâmetros do .scad ----------
P = {}
for m in re.finditer(r"^(\w+)\s*=\s*([-\d.]+)\s*;", open(SCAD, encoding="utf-8").read(), re.M):
    P[m.group(1)] = float(m.group(2))
t, braco, Hb, Hp = P["parede"], P["braco"], P["altura_base"], P["altura_pe"]
L = braco - t
z_top = Hb + P["luva_acima"]
z_fun = z_top - P["funil_v"]
z_bol = Hb + P["bolsa_acima"]

# ---------- malha ----------
def carregar_stl():
    f = os.path.join(tempfile.mkdtemp(), "peca.stl")
    subprocess.run(["openscad", "-o", f, SCAD], check=True, capture_output=True)
    v = [list(map(float, l.split()[1:])) for l in open(f) if l.strip().startswith("vertex")]
    tri = np.array(v).reshape(-1, 3, 3)
    tri[:, :, 2] -= Hp          # volta para origem no fundo da base
    return tri

def volume(tri):
    a, b, c = tri[:, 0], tri[:, 1], tri[:, 2]
    return np.einsum("ij,ij->i", a, np.cross(b, c)).sum() / 6000.0   # cm³

def cortar(tri, eixo, valor):
    """Retorna laços (listas de pontos 2D) da seção no plano eixo=valor."""
    outros = [i for i in range(3) if i != eixo]
    segs = []
    for T in tri:
        d = T[:, eixo] - valor
        pts = []
        for i in range(3):
            a, b = T[i], T[(i + 1) % 3]
            da, db = d[i], d[(i + 1) % 3]
            if (da < 0) != (db < 0):
                p = a + (b - a) * (da / (da - db))
                pts.append(tuple(np.round(p[outros], 4)))
        if len(pts) == 2 and pts[0] != pts[1]:
            segs.append(pts)
    viz = defaultdict(list)
    for s in segs:
        viz[s[0]].append(s[1]); viz[s[1]].append(s[0])
    usados, lacos = set(), []
    for ini in list(viz):
        if ini in usados:
            continue
        laco, atual, ant = [ini], ini, None
        usados.add(ini)
        while True:
            prox = [q for q in viz[atual] if q != ant and q not in usados]
            if not prox:
                break
            ant, atual = atual, prox[0]
            usados.add(atual); laco.append(atual)
        if len(laco) > 2:
            lacos.append(laco)
    return lacos

def desenhar_secao(ax, lacos, **kw):
    """Preenche a seção; laços dentro de outros laços viram furos."""
    def area(l):
        a = np.array(l); x, y = a[:, 0], a[:, 1]
        return (np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1))) / 2
    verts, codes = [], []
    for i, l in enumerate(lacos):
        dentro = sum(Path(o).contains_point(l[0]) for j, o in enumerate(lacos) if j != i)
        furo = dentro % 2 == 1
        l = list(l) if (area(l) > 0) != furo else list(l)[::-1]   # externo anti-horário, furo horário
        verts += l + [l[0]]
        codes += [Path.MOVETO] + [Path.LINETO] * (len(l) - 1) + [Path.CLOSEPOLY]
    if verts:
        ax.add_patch(PathPatch(Path(verts, codes), **kw))

def cota(ax, p1, p2, txt, off, vertical=False, fs=8):
    (x1, y1), (x2, y2) = p1, p2
    if vertical:
        x = x1 + off
        ax.annotate("", (x, y1), (x, y2), arrowprops=dict(arrowstyle="<->", lw=.7))
        ax.plot([x1, x], [y1, y1], "k:", lw=.4); ax.plot([x2, x], [y2, y2], "k:", lw=.4)
        ax.text(x + (.8 if off > 0 else -.8), (y1 + y2) / 2, txt, rotation=90, va="center",
                ha="left" if off > 0 else "right", fontsize=fs)
    else:
        y = y1 + off
        ax.annotate("", (x1, y), (x2, y), arrowprops=dict(arrowstyle="<->", lw=.7))
        ax.plot([x1, x1], [y1, y], "k:", lw=.4); ax.plot([x2, x2], [y2, y], "k:", lw=.4)
        ax.text((x1 + x2) / 2, y + (.6 if off > 0 else -.6), txt, ha="center",
                va="bottom" if off > 0 else "top", fontsize=fs)

PLA, ALU, MDF, ACR = "#3a3f47", "#b9bec4", "#d9b98c", "#a9d8f5"

def contexto(ax):
    """Base + perfil + acrílico na seção (desenho ilustrativo)."""
    perf = 1.5
    ax.add_patch(Rectangle((perf, 0), 34, Hb - .3, fc=MDF, ec="none"))
    ax.add_patch(Rectangle((0, 0), perf, Hb, fc=ALU, ec="k", lw=.5))
    ax.add_patch(Rectangle((P["recuo"], Hb + .15), 6, z_top + 12 - Hb, fc=ACR, ec="k", lw=.5, alpha=.85))

def main():
    tri = carregar_stl()
    vol = volume(tri)
    fig = plt.figure(figsize=(17, 11))
    gs = fig.add_gridspec(2, 3, height_ratios=[1.25, 1], hspace=.25, wspace=.15)

    # ---- CORTE A: no meio do braço (plano x = 30) -> coordenadas (y, z)
    ax = fig.add_subplot(gs[0, 0])
    contexto(ax)
    desenhar_secao(ax, cortar(tri, 0, 30.0), fc=PLA, ec="k", lw=1, alpha=.92)
    cota(ax, (-t, -Hp), (0, -Hp), f"{t:g}", -4)
    cota(ax, (0, -Hp), (L, -Hp), f"{L:g}", -4)
    cota(ax, (L, -Hp), (L, 0), f"pé {Hp:g}", 3, vertical=True)
    cota(ax, (L, 0), (L, Hb), f"base {Hb:g}", 3, vertical=True)
    cota(ax, (L, Hb), (L, z_top), f"luva {z_top - Hb:g}", 3, vertical=True)
    cota(ax, (-t, -Hp), (-t, z_top), f"total {z_top + Hp:g}", -5, vertical=True)
    cota(ax, (0, -P["faixa_prof"]), (P["faixa_larg"], -P["faixa_prof"]),
         f"rebaixo {P['faixa_larg']:g}×{P['faixa_prof']:g}", -3, fs=7)
    ax.annotate(f"funil {P['funil_h']:g}×{P['funil_v']:g}", (P["recuo"] - P["funil_h"] / 2, z_top - 2),
                (8, z_top + 9), fontsize=7.5, arrowprops=dict(arrowstyle="->", lw=.6))
    ax.annotate("PLANO DE REFERÊNCIA\nperfil e acrílico encostam\nna MESMA face → rente",
                (0, 20), (10, 12), fontsize=7.5, color="#b00020",
                arrowprops=dict(arrowstyle="->", lw=.8, color="#b00020"))
    ax.text(-t - 1, z_top + 6, "FORA", ha="right", fontsize=8, color="gray")
    ax.text(L - 2, z_top + 6, "DENTRO", ha="right", fontsize=8, color="gray")
    ax.set_title("CORTE A — meio do braço", fontsize=11, weight="bold")
    ax.set_xlim(-16, L + 9); ax.set_ylim(-Hp - 10, z_top + 14)
    ax.set_aspect("equal"); ax.axis("off")

    # ---- CORTE B: perto da quina (plano x = 6) -> bolsa da esquadria
    ax = fig.add_subplot(gs[0, 1])
    contexto(ax)
    desenhar_secao(ax, cortar(tri, 0, 6.0), fc=PLA, ec="k", lw=1, alpha=.92)
    cota(ax, (-P["bolsa_prof"], 15), (0, 15), f"{P['bolsa_prof']:g}", 0, fs=7)
    cota(ax, (-t, -P["faixa_prof"]), (-t, z_bol), f"bolsa até {z_bol:g}", -5, vertical=True, fs=7)
    ax.annotate("teto 45° (sem suporte)", (-1, z_bol + 1), (8, z_bol + 13), fontsize=7.5,
                arrowprops=dict(arrowstyle="->", lw=.6))
    ax.annotate("bolsa: a quina torta do perfil\nNÃO encosta na peça", (-1, 6), (9, 2),
                fontsize=7.5, color="#b00020", arrowprops=dict(arrowstyle="->", lw=.8, color="#b00020"))
    ax.set_title(f"CORTE B — a 6 mm da quina (dentro da bolsa de {P['bolsa_comp']:g} mm)",
                 fontsize=11, weight="bold")
    ax.set_xlim(-16, L + 9); ax.set_ylim(-Hp - 10, z_top + 14)
    ax.set_aspect("equal"); ax.axis("off")

    # ---- PLANTA 1: corte horizontal na altura do perfil (z = 20)
    ax = fig.add_subplot(gs[0, 2])
    desenhar_secao(ax, cortar(tri, 2, 20.0), fc=PLA, ec="k", lw=1, alpha=.92)
    ax.add_patch(Rectangle((0, 0), L + 6, L + 6, fc=MDF, ec="none", alpha=.35, zorder=0))
    cota(ax, (-t, -t), (L, -t), f"braço {braco:g}", -5)
    cota(ax, (-t, -t), (-t, L), f"{braco:g}", -5, vertical=True)
    cota(ax, (0, 0), (P["bolsa_comp"], 0), f"bolsa {P['bolsa_comp']:g}", 6, fs=7)
    ax.annotate(f"quina externa R{P['raio_quina']:g}", (-t + .6, -t + .6), (-12, -14),
                fontsize=7.5, arrowprops=dict(arrowstyle="->", lw=.6))
    ax.text(L / 2 + 4, L / 2 + 6, "BASE", fontsize=10, color="#8a6b3f", ha="center")
    ax.set_title("PLANTA — corte na altura do perfil (z = 20)", fontsize=11, weight="bold")
    ax.set_xlim(-17, L + 8); ax.set_ylim(-17, L + 8)
    ax.set_aspect("equal"); ax.axis("off")

    # ---- PLANTA 2: topo do pé (z = -1.5)
    ax = fig.add_subplot(gs[1, 0])
    desenhar_secao(ax, cortar(tri, 2, -1.5), fc=PLA, ec="k", lw=1, alpha=.55)
    desenhar_secao(ax, cortar(tri, 2, -P["faixa_prof"] - 1), fc="none", ec="k", lw=.6, ls="--")
    a0 = P["faixa_larg"]
    ch = P["chanfro_pe"]
    ax.add_patch(Polygon([(a0, a0), (L, a0), (L, L - ch), (L - ch, L), (a0, L)],
                         fc="none", ec="#b00020", lw=1.2, hatch="///"))
    ax.text((a0 + L) / 2 - 2, L - 7, f"apoio da base\n{L - a0:g} × {L - a0:g}",
            ha="center", va="center", fontsize=8, color="#b00020",
            bbox=dict(fc="white", ec="none", alpha=.8))
    cota(ax, (0, -t), (a0, -t), f"rebaixo {a0:g}", -4, fs=7)
    ax.set_title("PLANTA — topo do pé", fontsize=11, weight="bold")
    ax.set_xlim(-12, L + 6); ax.set_ylim(-12, L + 6)
    ax.set_aspect("equal"); ax.axis("off")

    # ---- PLANTA 3: altura da luva do acrílico (z = base + 7)
    ax = fig.add_subplot(gs[1, 1])
    zl = Hb + 7
    ax.add_patch(Rectangle((P["recuo"], P["recuo"]), L + 6, 6, fc=ACR, ec="k", lw=.5, zorder=0))
    ax.add_patch(Rectangle((P["recuo"], P["recuo"]), 6, L + 6, fc=ACR, ec="k", lw=.5, zorder=0))
    desenhar_secao(ax, cortar(tri, 2, zl), fc=PLA, ec="k", lw=1, alpha=.92)
    ax.annotate(f"entalhe {P['entalhe_prof']:g}×{P['entalhe_comp']:g}\n(aresta/cola da caixa)",
                (P["recuo"] - .6, P["recuo"] - .6), (12, 18), fontsize=7.5, arrowprops=dict(arrowstyle="->", lw=.6))
    ax.text(L / 2 + 6, 3, "acrílico 6", fontsize=8, ha="center", va="center")
    ax.set_title(f"PLANTA — altura do acrílico (z = {zl:g})", fontsize=11, weight="bold")
    ax.set_xlim(-12, L + 6); ax.set_ylim(-12, L + 6)
    ax.set_aspect("equal"); ax.axis("off")

    # ---- texto: requisitos e como imprimir
    ax = fig.add_subplot(gs[1, 2])
    ax.axis("off")
    txt = (
        "SAMA 3 · base 1000 × 800 × 35 com perfil\n"
        "de alumínio · cúpula de acrílico 6 mm\n\n"
        "• 4 peças IGUAIS em PLA (servem nos 4 cantos)\n"
        f"• Pé de {Hp:g} mm. A base apoia em {L - a0:g} × {L - a0:g} mm,\n"
        "  longe do perfil.\n"
        f"• Parede de {t:g} mm cobre a quina do perfil\n"
        f"  em toda a altura e {L:g} mm para cada lado.\n"
        "• A cúpula desce pelo funil e APOIA NA BASE.\n"
        "  Encosta na mesma face que o perfil:\n"
        "  fica RENTE e nunca passa para fora.\n"
        f"• Só a peça fica {t:g} mm para fora, nos cantos.\n"
        "• Cúpula menor que a base: D = a MENOR das\n"
        "  diferenças (comprimento, largura);\n"
        "  recuo = D/2 (máx. 2) e reimprimir.\n\n"
        "IMPRESSÃO: em pé, SEM suporte, 0,2 mm,\n"
        "4 perímetros, 15% infill. Costura (seam)\n"
        "na ponta dos braços, NUNCA na face interna.\n"
        "Primeiro o TESTE RÁPIDO (fatia 25 mm).\n"
        f"Peça: {vol:.0f} cm³ → estim. ≈ {vol * 0.55:.0f} g / ≈ 3,5 h\n"
        "(depende do fatiador)."
    )
    ax.text(-.05, 1, txt, va="top", fontsize=9, family="DejaVu Sans", linespacing=1.35)

    fig.suptitle("Maquete SAMA 3 — peça de canto (pé + capa do perfil + luva da cúpula) · medidas em mm",
                 fontsize=15, weight="bold")
    out = os.path.join(AQUI, "img", "desenho_tecnico.png")
    plt.savefig(out, dpi=120, bbox_inches="tight")
    print("ok", out)

if __name__ == "__main__":
    main()
