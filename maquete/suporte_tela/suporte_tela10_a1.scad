// =====================================================================
//  Suporte de mesa (30°) da tela Guition 10,1" em DUAS METADES, para a
//  Bambu A1 (mesa móvel): cada metade imprime DEITADA sobre a lateral, com
//  todas as paredes verticais. Nada de peça alta e fina balançando.
//    - mesmo encaixe da tela (colunas de latão nos encaixes, sem parafuso);
//    - paredes de 1,6 mm e face de 2,4 mm;
//    - as metades se unem no meio por uma junta sobreposta (lingueta de
//      10 mm da metade direita entra por dentro da esquerda) + cola;
//    - fundo aberto (só a moldura), para não ter ponte na impressão.
//  Usa o suporte_tela10_fino.scad com outros valores.
//
//  peca = "ambas" (as duas já na posição de impressão, lado a lado),
//         "direita" ou "esquerda".
// =====================================================================
include <suporte_tela10_fino.scad>

angulo      = 30;
parede      = 1.6;
esp_face    = 2.4;
fundo_atras = 10;
janelas_fundo = 0;        // fundo só com a moldura: nas metades deitadas não tem ponte
pastilha_rampa = 1;       // lado de fora das pastilhas a 45° (fica virado para baixo)
desenhar = false;

lingueta = 10;            // quanto a lingueta entra na outra metade
folga_junta = 0.15;       // folga por lado da junta
peca = "ambas";

G = 400;

// lingueta: casca interna, um "parede + folga" para dentro da casca.
//  - em x ∈ [-lingueta, 0] ela sai da metade direita e entra na esquerda;
//  - em x ∈ [0, lingueta] ela é fundida à parede da metade direita (reforço).
// A parte que sai não ocupa a região da face da outra metade (mais grossa).
module anel(d0, d1) {
    translate([-W/2, 0, 0]) rotate([90, 0, 90]) linear_extrude(W) difference() {
        offset(delta = -d0) perfil();
        offset(delta = -d1) perfil();
    }
}
module lingueta() {
    prof = parede + folga_junta + esp_face;
    pp = encaixe_prof + 1;                       // profundidade das pastilhas
    difference() {
        union() {
            // parte que sai (entra na metade esquerda)
            intersection() {
                translate([-lingueta, -G/2, -1]) cube([lingueta, G, G]);
                anel(parede + folga_junta, prof);
            }
            // reforço fundido à parede da metade direita, afinando em escada a 45°
            intersection() {
                translate([0, -G/2, -1]) cube([lingueta, G, G]);
                anel(0, prof);
            }
            st = 0.5;
            for (i = [0 : ceil((prof - parede) / st) - 1])
                intersection() {
                    translate([lingueta + i*st, -G/2, -1]) cube([st, G, G]);
                    anel(0, max(parede, prof - (i + 1)*st));
                }
        }
        // não ocupa a região da face da metade esquerda (mais grossa que as paredes)
        na_face() translate([-W/2, -1, -esp_face - folga_junta]) cube([W, L + 2, esp_face + folga_junta + 1]);
        // nem a abertura da caixa da tela (até mais fundo que a lingueta)
        na_face() translate([-abre_u, v2s(-abre_v), -prof - 2]) cube([2*abre_u, 2*abre_v, prof + 3]);
        // nem as pastilhas da metade esquerda (com folga)
        for (f = encaixes) if (f[0] < 0)
            na_face() translate([f[0] - pastilha/2 - pp - folga_junta, v2s(f[1]) - pastilha/2 - pp - folga_junta, -pp - folga_junta])
                cube([pastilha + pp + 2*folga_junta, pastilha + 2*pp + 2*folga_junta, pp + folga_junta + 1]);
    }
}

module metade_direita() {
    difference() {
        union() {
            intersection() { corpo(); translate([0, -G/2, -1]) cube([G, G, G]); }
            lingueta();
        }
        cortes();
    }
}

module metade_esquerda() {
    difference() {
        intersection() { corpo(); translate([-G, -G/2, -1]) cube([G, G, G]); }
        cortes();
    }
}

// posição de impressão: lateral externa na mesa, corte para cima
module direita_impressao() { translate([0, 0, W/2]) rotate([0, 90, 0]) metade_direita(); }
module esquerda_impressao() { translate([0, 0, W/2]) rotate([0, -90, 0]) metade_esquerda(); }

if (peca == "direita") direita_impressao();
else if (peca == "esquerda") esquerda_impressao();
else {
    translate([5, 0, 0]) direita_impressao();
    translate([-5, 0, 0]) esquerda_impressao();
}
