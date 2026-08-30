# -*- coding: utf-8 -*-
"""Especificacao do cartao NFC NEX Layer3D.

Todas as cotas em milimetros. O eixo Z de montagem tem z=0 na face externa
do verso e z=T_TOTAL no ponto mais alto da frente (topo do logo).

    z = 2.50  topo do logo (+0.6)
    z = 2.30  elementos graficos (+0.4)
    z = 2.10  linhas e texturas (+0.2)
    z = 1.90  plano base da frente ....... face externa da TAMPA
    z = 1.60  fundo de sulco (-0.3)
    z = 1.30  face de colagem ............ TAMPA | BASE
    z = 0.50  fundo da cavidade NFC
    z = 0.00  face externa do verso ...... face externa da BASE
"""

# ---------------------------------------------------------------- dimensoes
CARD_W = 85.0
CARD_H = 54.0
CORNER_R = 3.5
EDGE_CHAMFER = 0.3          # arestas confortaveis ao toque

T_TOTAL = 2.5               # espessura total (faixa pedida: 2.2 a 2.5)
T_BASE = 1.3                # base inferior
T_COVER = 1.2               # tampa superior

Z_BACK = 0.0
Z_MATE = T_BASE             # plano de colagem entre as duas pecas
Z_FRONT = 1.9               # plano base da frente (relevo 0.0)
Z_TOP = T_TOTAL

# ------------------------------------------------------------------ relevos
R_LINE = 0.2                # linhas / texturas
R_GRAPHIC = 0.4             # elementos graficos
R_LOGO = 0.6                # logo principal
D_FIELD = 0.2               # rebaixo de fundo
D_GROOVE = 0.3              # rebaixo de sulco fino
E_TEXT = 0.2                # gravacao no verso
E_DEEP = 0.3                # gravacao profunda no verso

# --------------------------------------------------------------- cavidade NFC
NFC_D = 25.2                # etiqueta adesiva de 25 mm + folga
NFC_DEPTH = 0.8
NFC_CX = 66.5               # centro da area NFC (coordenadas da FRENTE)
NFC_CY = 29.0
NFC_LID_D = 25.0            # tampa fina opcional de fechamento
NFC_LID_T = 0.35

# --------------------------------------------------------------- montagem
PIN_D = 1.6                 # pinos de alinhamento na base
PIN_H = 0.35
TOL = 0.2                   # tolerancia recomendada
GLUE_W = 0.9                # canal de cola no plano de colagem
GLUE_DEPTH = 0.25
GLUE_INSET = 1.5

# ------------------------------------------------------------ fabricacao
NOZZLE = 0.2
LAYER = 0.1                 # faixa util: 0.08 a 0.12
MIN_DETAIL = 0.4            # menor detalhe visivel

# ------------------------------------------------------------------ conteudo
BRAND_NAME = "Nex"
BRAND_NAME2 = "Layer3D"
TAGLINE = "MAQUETES • TECNOLOGIA • INOVAÇÃO"
NFC_CALL = "APROXIME"

PERSON = "ROGÉRIO CORREIA"
ROLE = "VENDAS"
COMPANY = "NEX LAYER3D"
PHONE = "(11) 91528-5298"
EMAIL = "vendas@nexlayer3d.net"
INSTAGRAM = "@nexlayer3d"
SITE = "nexlayer3d.net"

FONT_BOLD = "Outfit-Bold.ttf"
FONT_REG = "Outfit-Regular.ttf"
