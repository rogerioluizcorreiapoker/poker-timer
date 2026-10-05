// =====================================================================
//  Suporte de mesa para a tela Guition JC8012P4A1C (ESP32-P4, 10,1")
//  Inspirado no suporte de mesa do modelo de 7" (JC1060P470).
//
//  Medidas da tela (desenho oficial Guition, JC8012P4A1.pdf):
//    - vidro 242,8 x 158,7 mm, espessura total 22,51 mm
//      (7 mm de painel + caixa de 15,51 mm atrás);
//    - 6 colunas de latão M2,5 (Ø7,5, 4,5 mm de altura), a 15 mm das bordas:
//      128,7 mm na largura; no comprimento 90 + 122,8 mm (o furo do meio
//      NÃO fica no centro: fica 16,4 mm deslocado);
//    - caixa da eletrônica 138,35 x 93,5 mm, centralizada, com os USB-C
//      na lateral comprida.
//
//  Ideia:
//    - cavalete com a face inclinada (padrão 65°) onde a tela parafusa;
//    - ESPAÇADORES impressos entre a face e as colunas da tela: a tela fica
//      afastada da face e a caixa + plugue USB cabem no vão;
//    - abertura no meio da face para o cabo (de preferência USB-C em L)
//      entrar no suporte e sair por trás;
//    - fundo e traseira abertos: dá para alcançar os parafusos na montagem.
//
//  Eixos: X = largura (tela deitada), Y = profundidade (+Y para a frente),
//  Z para cima. Medidas em mm.
// =====================================================================

/* [Tela (desenho Guition)] */
tela_l      = 242.8;    // largura (tela deitada)
tela_a      = 158.7;    // altura
furo_borda  = 15;       // centro dos furos até a borda
furo_meio   = 16.4;     // deslocamento do furo do meio em relação ao centro
caixa_l     = 138.35;   // caixa de trás
caixa_a     = 93.5;
caixa_prof  = 15.51;    // atrás da chapa da tela
coluna_alt  = 4.5;      // colunas de latão da tela

/* [Suporte] */
angulo      = 65;       // inclinação da tela em relação à mesa
espacador   = 13;       // altura dos espaçadores impressos
recuo_face  = 3;        // a face fica menor que a tela isto (cada lado)
esp_face    = 5;        // espessura da face
esp_lateral = 4;
altura_frente = 5;      // altura da borda de baixo da face acima da mesa
bico_frente = 10;       // quanto a base avança para a frente
cauda       = 45;       // quanto a base vai para trás da face (estabilidade no toque)
barra_alt   = 6;        // barras do chão (frente e trás)
barra_larg  = 20;
furo_fixar  = 4.0;      // furos nas barras do chão: parafuso de madeira 3,5 (mesa ou maquete)
cabeca_fixar = 7.5;     // escareado por cima
margem_usb  = 10;       // folga da abertura além da caixa (plugue USB em L)

/* [Parafusos] */
furo_parafuso = 2.9;    // M2,5 passa folgado
furos_dos_dois_lados = true;  // furo do meio nos dois lados: a tela entra virada 180° também

/* [Logo] */
logo      = true;
logo_l1   = "NEX";
logo_l2   = "LAYER3D";
logo_larg = 55;
logo_prof = 0.6;

/* [Saída] */
peca = "suporte";       // "suporte", "espacadores" (7 juntos: 6 + 1 reserva) ou "espacador"

$fn = 48;
e = 0.01;

// ---------- derivadas ----------
W  = tela_l - 2*recuo_face;          // largura da face
L  = tela_a - 2*recuo_face;          // comprimento inclinado da face
ca = cos(angulo); sa = sin(angulo);
s_meio = L/2;                        // s do centro da tela na face
v2s = function(v) v + L/2;           // v (centro da tela) -> s (na face)
z_topo = altura_frente + L*sa;
y_topo = -L*ca;
y_cauda = y_topo - cauda;
vao = coluna_alt + espacador;        // chapa da tela até a face

assert(vao >= caixa_prof + 1, "espaçador curto: a caixa da tela encosta na face");
echo(str("Suporte: ", W, " x ", bico_frente - y_cauda, " x ", round(z_topo + esp_face*ca), " mm (L x P x A)"));
echo(str("Vão entre a tela e a face: ", vao, " mm (caixa ", caixa_prof, " mm)"));
echo(str("Parafuso M2,5 de ", esp_face + espacador + 4, " mm (entra 4 mm na coluna)"));

// furos na tela (coordenadas u, v a partir do centro da tela, tela deitada)
fu = tela_l/2 - furo_borda;          // 106,4
fv = tela_a/2 - furo_borda;          // 64,35
furos = concat(
    [for (su = [-1, 1], sv = [-1, 1]) [su*fu, sv*fv]],
    [for (sv = [-1, 1]) [-furo_meio, sv*fv]],
    furos_dos_dois_lados ? [for (sv = [-1, 1]) [furo_meio, sv*fv]] : []
);

// local da face (u, s, n) -> mundo; n = 0 é a frente da face
module na_face() {
    multmatrix([[1, 0,   0,  0],
                [0, -ca, sa, 0],
                [0, sa,  ca, altura_frente],
                [0, 0,   0,  1]]) children();
}

module face() {
    abre_u = caixa_l/2 + 6;
    abre_v = caixa_a/2 + margem_usb;
    difference() {
        na_face() translate([-W/2, 0, -esp_face]) cube([W, L, esp_face]);
        // furos dos parafusos, perpendiculares à face
        for (f = furos) na_face() translate([f[0], v2s(f[1]), -esp_face - 1]) cylinder(d = furo_parafuso, h = esp_face + 2);
        // abertura do meio: cortada a 45° para trás/baixo, assim a borda de cima
        // da abertura fica a 45° (imprime sem suporte) e o corte desloca pouco
        hull() for (k = [0, 14])
            translate([0, -k, -k]) na_face()
                translate([-abre_u, v2s(-abre_v), 0.5]) cube([2*abre_u, 2*abre_v, e]);
    }
}

// perfil da lateral (no plano YZ)
module perfil_lateral() {
    polygon([[bico_frente, 0], [bico_frente, barra_alt], [0, altura_frente],
             [y_topo, z_topo], [y_topo - esp_face*sa, z_topo + esp_face*ca - esp_face*ca],
             [y_cauda, barra_alt], [y_cauda, 0]]);
}

module logo2d() {
    fonte = "Liberation Sans:style=Bold";
    translate([0, 7]) resize([logo_larg, 0], auto = true)
        text(logo_l1, size = 16, font = fonte, halign = "center", valign = "center");
    translate([0, -5.5]) square([logo_larg, 1.4], center = true);
    translate([0, -12.5]) resize([logo_larg, 0], auto = true)
        text(logo_l2, size = 8, font = fonte, halign = "center", valign = "center");
}

module lateral(lado) {   // lado = -1 esquerda, +1 direita
    x0 = lado > 0 ? W/2 - esp_lateral : -W/2;
    // centro do logo: parte baixa do triângulo da lateral, onde ele é mais largo
    cz = 32;
    cy = (y_topo * (cz - altura_frente) / (z_topo - altura_frente)
          + y_cauda + (y_topo - y_cauda) * (cz - barra_alt) / (z_topo - barra_alt)) / 2;
    difference() {
        translate([x0, 0, 0]) rotate([90, 0, 90]) linear_extrude(esp_lateral) perfil_lateral();
        if (logo)
            translate([lado > 0 ? W/2 - logo_prof : -W/2 + logo_prof, cy, cz])
            rotate([90, 0, lado > 0 ? 90 : -90]) linear_extrude(logo_prof + e) logo2d();
    }
}

module suporte() {
    difference() {
        union() {
            face();
            lateral(-1);
            lateral(1);
            // barra da frente (apoia também a borda de baixo da face) e barra de trás
            translate([-W/2, -barra_larg + bico_frente, 0]) cube([W, barra_larg, barra_alt]);
            translate([-W/2, y_cauda, 0]) cube([W, barra_larg, barra_alt]);
        }
        // 4 furos escareados para parafusar na mesa ou na maquete (opcional)
        for (sx = [-1, 1], yb = [bico_frente - barra_larg/2, y_cauda + barra_larg/2])
            translate([sx*(W/2 - 25), yb, 0]) {
                translate([0, 0, -1]) cylinder(d = furo_fixar, h = barra_alt + 2);
                translate([0, 0, barra_alt - (cabeca_fixar - furo_fixar)/2])
                    cylinder(d1 = furo_fixar, d2 = cabeca_fixar, h = (cabeca_fixar - furo_fixar)/2 + e);
            }
    }
}

module espacador_peca() {
    difference() {
        cylinder(d = 8, h = espacador);
        translate([0, 0, -1]) cylinder(d = furo_parafuso, h = espacador + 2);
    }
}

if (peca == "espacador") espacador_peca();
else if (peca == "espacadores") for (i = [0 : 6]) translate([(i % 4) * 12, floor(i / 4) * 12, 0]) espacador_peca();
else suporte();
