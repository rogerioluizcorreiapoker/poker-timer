// =====================================================================
//  Suporte FECHADO FINO (impressão rápida) para a tela Guition
//  JC8012P4A1C 10,1". Mesmo encaixe do suporte_tela10.scad, mas:
//    - paredes de 1,6 mm (4 linhas de bico 0,4);
//    - sem logo;
//    - sem a borda grossa: só uma pastilha em volta de cada encaixe;
//    - fundo vazado (só uma moldura apoiando na mesa).
//  A tela apoia na face e as colunas de latão entram nos encaixes:
//  fica presa pelo peso, sem parafuso.
//  Eixos: X = largura, Y = profundidade (+Y para a frente), Z para cima.
// =====================================================================

/* [Tela (desenho Guition)] */
tela_l      = 242.8;
tela_a      = 158.7;
furo_borda  = 15;
furo_meio   = 16.4;
caixa_l     = 138.35;
caixa_a     = 93.5;

/* [Suporte] */
angulo      = 65;
recuo_face  = 5;
parede      = 0.9;      // laterais, traseira e fundo (2 linhas de bico 0,4)
esp_face    = 1.8;      // face onde a tela apoia (mais grossa)
altura_frente = 10;
fundo_atras = 20;
moldura_fundo = 12;     // largura da moldura do fundo (o meio é vazado)
encaixe_d   = 8.2;
encaixe_prof = 5;
pastilha    = 16;       // pastilha em volta de cada encaixe
margem_l    = 5;
margem_a    = 10;
encaixes_dos_dois_lados = true;
furo_tras_d = 22;
furo_tras_z = 20;

$fn = 40;
e = 0.01;

W  = tela_l - 2*recuo_face;
L  = tela_a - 2*recuo_face;
ca = cos(angulo); sa = sin(angulo);
v2s = function(v) v + L/2;
z_topo = altura_frente + L*sa;
y_topo = -L*ca;
y_tras = y_topo - fundo_atras;
z_tras = z_topo - fundo_atras;
bico_frente = altura_frente * ca / sa;
abre_u = caixa_l/2 + margem_l;
abre_v = caixa_a/2 + margem_a;
k45 = max(0, tan(angulo - 45));      // recuo por mm de profundidade p/ ficar a 45°

fu = tela_l/2 - furo_borda;
fv = tela_a/2 - furo_borda;
encaixes = concat(
    [for (su = [-1, 1], sv = [-1, 1]) [su*fu, sv*fv]],
    [for (sv = [-1, 1]) [-furo_meio, sv*fv]],
    encaixes_dos_dois_lados ? [for (sv = [-1, 1]) [furo_meio, sv*fv]] : []
);

echo(str("Suporte fino: ", W, " x ", round(bico_frente - y_tras), " x ", round(z_topo), " mm"));

module na_face() {
    multmatrix([[1, 0,   0,  0],
                [0, -ca, sa, 0],
                [0, sa,  ca, altura_frente],
                [0, 0,   0,  1]]) children();
}

module perfil() {
    polygon([[bico_frente, 0], [0, altura_frente], [y_topo, z_topo],
             [y_tras, z_tras], [y_tras, 0]]);
}

module casca() {
    difference() {
        translate([-W/2, 0, 0]) rotate([90, 0, 90]) linear_extrude(W) perfil();
        translate([-W/2 + parede, 0, 0]) rotate([90, 0, 90]) linear_extrude(W - 2*parede)
            offset(delta = -parede) perfil();
        // fundo vazado: fica só a moldura
        translate([-W/2 + moldura_fundo, y_tras + moldura_fundo, -1])
            cube([W - 2*moldura_fundo, bico_frente - y_tras - 2*moldura_fundo, parede + 2]);
    }
}

// pastilha atrás da face, com a borda de baixo a 45° (imprime sem suporte)
module pastilha_em(u, v) {
    s0 = v2s(v) - pastilha/2;  s1 = v2s(v) + pastilha/2;
    p = encaixe_prof + 1;
    intersection() {
        hull() {
            na_face() translate([u - pastilha/2, s0, -e]) cube([pastilha, s1 - s0, e]);
            na_face() translate([u - pastilha/2, s0 - p*k45, -p]) cube([pastilha, s1 - s0 + p*k45, e]);
        }
        translate([-W/2, 0, 0]) rotate([90, 0, 90]) linear_extrude(W) perfil();
    }
}

module suporte() {
    difference() {
        union() {
            casca();
            // face mais grossa que as outras paredes
            intersection() {
                translate([-W/2, 0, 0]) rotate([90, 0, 90]) linear_extrude(W) perfil();
                na_face() translate([-W/2, 0, -esp_face]) cube([W, L, esp_face]);
            }
            for (f = encaixes) pastilha_em(f[0], f[1]);
        }
        // abertura da caixa: borda de cima a 45°
        hull() {
            na_face() translate([-abre_u, v2s(-abre_v), 0]) cube([2*abre_u, 2*abre_v, 1]);
            na_face() translate([-abre_u, v2s(-abre_v), -esp_face - 1])
                cube([2*abre_u, 2*abre_v - (esp_face + 1) * k45, e]);
        }
        // encaixes das colunas de latão
        for (f = encaixes) na_face() translate([f[0], v2s(f[1]), -encaixe_prof]) cylinder(d = encaixe_d, h = encaixe_prof + 1);
        // furo do cabo atrás
        translate([0, y_tras + parede/2, furo_tras_z]) rotate([90, 0, 0]) cylinder(d = furo_tras_d, h = parede + 2, center = true);
    }
}

suporte();
