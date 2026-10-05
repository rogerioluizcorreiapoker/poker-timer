// =====================================================================
//  Suporte FECHADO de mesa para a tela Guition JC8012P4A1C (ESP32-P4, 10,1")
//  Igual ao suporte de mesa do modelo de 7" (JC1060P470): uma caixa em
//  cunha, fechada em baixo, atrás e dos lados; a própria tela fecha a frente.
//
//  Medidas da tela (desenho oficial Guition, JC8012P4A1.pdf):
//    - vidro 242,8 x 158,7 mm, espessura total 22,51 mm
//      (7 mm de painel + caixa de 15,51 mm atrás);
//    - 6 colunas de latão (Ø7,5, 4,5 mm de altura), a 15 mm das bordas:
//      128,7 mm na largura; no comprimento 90 + 122,8 mm (o furo do meio
//      NÃO fica no centro: fica 16,4 mm deslocado);
//    - caixa da eletrônica 138,35 x 93,5 mm, centralizada, com os USB-C
//      na lateral comprida.
//
//  Como funciona:
//    - a borda da abertura tem 8 encaixes (os 6 da tela + 2 para a tela
//      entrar virada 180°). As colunas de latão entram nos encaixes e a
//      chapa de trás da tela apoia na borda: a tela fica presa pelo próprio
//      peso, sem parafuso (tira e põe na mão);
//    - a caixa da tela entra na abertura; o cabo USB-C (de preferência em L)
//      sai pelo furo de trás ou pelo túnel da frente, embaixo da tela.
//
//  Eixos: X = largura (tela deitada), Y = profundidade (+Y para a frente),
//  Z para cima. Medidas em mm.
// =====================================================================

/* [Tela (desenho Guition)] */
tela_l      = 242.8;    // largura (tela deitada)
tela_a      = 158.7;    // altura
furo_borda  = 15;       // centro das colunas até a borda
furo_meio   = 16.4;     // deslocamento da coluna do meio em relação ao centro
caixa_l     = 138.35;   // caixa de trás
caixa_a     = 93.5;
caixa_prof  = 15.51;    // atrás da chapa da tela
coluna_d    = 7.5;      // colunas de latão da tela
coluna_alt  = 4.5;

/* [Suporte] */
angulo      = 50;       // inclinação da tela em relação à mesa (mínimo 45 para imprimir sem suporte)
recuo_face  = 3;        // a borda fica menor que a tela isto (cada lado)
esp_borda   = 6;        // espessura da borda onde a tela apoia
parede      = 3;        // laterais, fundo e traseira
altura_frente = 10;     // altura da borda de baixo da tela acima da mesa
fundo_atras = 30;       // quanto a traseira fica atrás do topo da face
encaixe_d   = 8.2;      // encaixe das colunas de latão (folga 0,7)
encaixe_prof = 5;       // fundo do encaixe (coluna tem 4,5)
margem_l    = 5;        // folga da abertura além da caixa (nas pontas)
margem_a    = 10;       // folga da abertura além da caixa (lado do USB, plugue em L)
encaixes_dos_dois_lados = true;  // tela entra virada 180° também

/* [Cabo] */
furo_tras_d = 22;       // furo do cabo na traseira
furo_tras_z = 22;       // altura do centro do furo
rebaixo_frente_r = 8;   // rebaixo do cabo na frente, embaixo (0 = sem)

/* [Fixação na mesa (opcional)] */
furos_mesa   = true;    // 2 furos no fundo, atrás, escareados por dentro
furo_mesa_d  = 4.0;
cabeca_mesa  = 7.5;

/* [Logo] */
logo      = true;
logo_l1   = "NEX";
logo_l2   = "LAYER3D";
logo_larg = 50;
logo_prof = 0.6;

$fn = 48;
e = 0.01;

// ---------- derivadas ----------
W  = tela_l - 2*recuo_face;          // largura da face
L  = tela_a - 2*recuo_face;          // comprimento inclinado da face
ca = cos(angulo); sa = sin(angulo);
v2s = function(v) v + L/2;           // v (do centro da tela) -> s (na face)
z_topo = altura_frente + L*sa;
y_topo = -L*ca;
y_tras = y_topo - fundo_atras;       // face de fora da traseira
z_tras = z_topo - fundo_atras;       // topo da traseira (chanfro de 45° até a face)
bico_frente = altura_frente * ca / sa;   // frente segue o plano da face até a mesa (a tela não encosta)
abre_u = caixa_l/2 + margem_l;
abre_v = caixa_a/2 + margem_a;

echo(str("Suporte: ", W, " x ", round(bico_frente - y_tras), " x ", round(z_topo), " mm (L x P x A)"));

fu = tela_l/2 - furo_borda;          // 106,4
fv = tela_a/2 - furo_borda;          // 64,35
encaixes = concat(
    [for (su = [-1, 1], sv = [-1, 1]) [su*fu, sv*fv]],
    [for (sv = [-1, 1]) [-furo_meio, sv*fv]],
    encaixes_dos_dois_lados ? [for (sv = [-1, 1]) [furo_meio, sv*fv]] : []
);
assert(abre_v + 2 < fv - encaixe_d/2, "abertura encosta nos encaixes de cima/baixo");

// local da face (u, s, n) -> mundo; n = 0 é onde a chapa da tela apoia
module na_face() {
    multmatrix([[1, 0,   0,  0],
                [0, -ca, sa, 0],
                [0, sa,  ca, altura_frente],
                [0, 0,   0,  1]]) children();
}

// perfil de fora da cunha (plano YZ): frente, face inclinada, chanfro, traseira
module perfil() {
    polygon([[bico_frente, 0], [0, altura_frente],
             [y_topo, z_topo], [y_tras, z_tras], [y_tras, 0]]);
}

module casca_externa() {
    translate([-W/2, 0, 0]) rotate([90, 0, 90]) linear_extrude(W) perfil();
}

// miolo oco: a cunha encolhida pela espessura da parede
module miolo() {
    translate([-W/2 + parede, 0, 0]) rotate([90, 0, 90]) linear_extrude(W - 2*parede)
        offset(delta = -parede) perfil();
}

module logo2d() {
    fonte = "Liberation Sans:style=Bold";
    translate([0, 7]) resize([logo_larg, 0], auto = true)
        text(logo_l1, size = 16, font = fonte, halign = "center", valign = "center");
    translate([0, -5.5]) square([logo_larg, 1.4], center = true);
    translate([0, -12.5]) resize([logo_larg, 0], auto = true)
        text(logo_l2, size = 8, font = fonte, halign = "center", valign = "center");
}

module suporte() {
    difference() {
        union() {
            difference() {
                casca_externa();
                miolo();
            }
            // borda grossa da face (onde a tela apoia e ficam os encaixes)
            intersection() {
                casca_externa();
                na_face() translate([-W/2, 0, -esp_borda]) cube([W, L, esp_borda]);
            }
            // frente maciça embaixo: a ponta de baixo da borda grossa não fica no ar
            intersection() {
                casca_externa();
                translate([-W/2, -esp_borda - 4, 0]) cube([W, esp_borda + 4 + bico_frente + 1, altura_frente + 1]);
            }
        }
        // abertura da caixa da tela: borda de baixo reta, borda de cima a 45°
        // (imprime sem suporte), atravessando a borda grossa
        hull() {
            na_face() translate([-abre_u, v2s(-abre_v), 0]) cube([2*abre_u, 2*abre_v, 1]);
            na_face() translate([-abre_u, v2s(-abre_v), -esp_borda - 1])
                cube([2*abre_u, 2*abre_v - (esp_borda + 1) * max(0, tan(angulo - 45)), e]);
        }
        // encaixes das colunas de latão
        for (f = encaixes) na_face() translate([f[0], v2s(f[1]), -encaixe_prof]) cylinder(d = encaixe_d, h = encaixe_prof + 1);
        // furo do cabo atrás
        translate([0, y_tras + parede/2, furo_tras_z]) rotate([90, 0, 0]) cylinder(d = furo_tras_d, h = parede + 2, center = true);
        // passagem do cabo na frente, embaixo: túnel do lado de dentro até a frente
        if (rebaixo_frente_r > 0)
            translate([0, -esp_borda - 5, 0]) rotate([-90, 0, 0])
                cylinder(r = rebaixo_frente_r, h = esp_borda + 5 + bico_frente + 1);
        // furos para prender na mesa (escareados por dentro)
        // (embaixo da abertura: com a tela fora, a chave entra na vertical)
        if (furos_mesa) for (sx = [-1, 1]) translate([sx*55, -40, 0]) {
            translate([0, 0, -1]) cylinder(d = furo_mesa_d, h = parede + 2);
            translate([0, 0, parede - (cabeca_mesa - furo_mesa_d)/2]) cylinder(d1 = furo_mesa_d, d2 = cabeca_mesa, h = (cabeca_mesa - furo_mesa_d)/2 + e);
        }
        // logo nas duas laterais
        if (logo) for (lado = [-1, 1]) {
            cz = 36;
            cy = (y_topo * (cz - altura_frente) / (z_topo - altura_frente) + y_tras) / 2;
            translate([lado > 0 ? W/2 - logo_prof : -W/2 + logo_prof, cy, cz])
                rotate([90, 0, lado > 0 ? 90 : -90]) linear_extrude(logo_prof + e) logo2d();
        }
    }
}

suporte();
