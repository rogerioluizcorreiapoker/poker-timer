// =====================================================================
//  Case para o adaptador de bornes ESP32 30 pinos (MRD068A) + ESP32 DevKit
//  Fica presa EMBAIXO da maquete Sama 3 (pé de 30 mm).
//
//  Ideia: bandeja aberta em cima. A face de baixo da maquete fecha a case.
//    - a placa fica sobre 4 colunas, componentes para cima (para a maquete);
//    - saídas laterais em U abertas a partir da borda: deita os fios
//      (até com conector) e depois parafusa a case na maquete;
//    - 4 orelhas com furo escareado por baixo: parafuso de baixo para cima
//      entrando na maquete. Para mexer, solta 4 parafusos e a case desce
//      com a placa e os fios.
//
//  Origem: centro da placa, Z=0 na face de baixo (externa) da case.
//  Medidas em mm. CONFIRA as medidas da placa com paquímetro.
// =====================================================================

/* [Placa MRD068A (conferir)] */
placa_x       = 66.2;   // comprimento da placa
placa_y       = 63.1;   // largura da placa
placa_esp     = 1.6;    // espessura do PCB
furo_dx       = 60;     // distância entre centros dos furos (em X)
furo_dy       = 57.5;   // distância entre centros dos furos (em Y)
altura_conjunto = 20;   // altura total medida: pinos de baixo até topo do ESP32
pinos_baixo   = 2.5;    // quanto os pinos/soldas passam por baixo do PCB

/* [Case] */
folga_placa   = 1.0;    // folga entre placa e parede (cada lado)
parede        = 2.0;
fundo         = 2.0;
folga_topo    = 1.5;    // entre o topo do ESP32 e a maquete
raio_canto    = 3;
altura_coluna = 3.0;    // coluna sob a placa (>= pinos_baixo + 0.5)
diam_coluna   = 6.5;
furo_coluna   = 2.6;    // parafuso M3 auto-atarraxante no PLA (M2.5: 2.1)

/* [Saídas laterais em U (abertas na borda de cima)] */
// a borda de baixo das saídas fica na altura do topo do PCB + isto
saida_acima_pcb = 0.5;
saida_x_larg  = 22;     // largura de cada saída nas paredes longas (X), 2 por lado
saida_y_larg  = 40;     // largura da saída nas paredes curtas (Y), 1 por lado
saida_raio    = 2;

/* [Fixação na maquete] */
orelha_comp   = 11;     // quanto a orelha sai da parede
orelha_larg   = 12;
orelha_esp    = 3;
furo_orelha   = 4.0;    // parafuso de madeira 3,5 mm
cabeca_orelha = 7.5;    // escareado (cabeça chata 90°) por baixo

/* [Saída] */
gabarito = false;       // só a placa de fundo com as colunas, para testar a furação

$fn = 48;
e = 0.01;

// ---------- derivadas ----------
in_x = placa_x + 2*folga_placa;
in_y = placa_y + 2*folga_placa;
ex_x = in_x + 2*parede;
ex_y = in_y + 2*parede;
z_pcb_base = fundo + max(altura_coluna, pinos_baixo + 0.5);
z_pcb_topo = z_pcb_base + placa_esp;
altura = fundo + max(altura_coluna, pinos_baixo + 0.5) + (altura_conjunto - pinos_baixo) + folga_topo;
z_saida = z_pcb_topo + saida_acima_pcb;

echo(str("Case externa: ", ex_x, " x ", ex_y, " x ", altura, " mm (sobram ", 30 - altura, " mm até a mesa com pé de 30)"));
assert(altura <= 28, "case alta demais para o pé de 30 mm");
assert(altura_coluna >= pinos_baixo + 0.5, "coluna menor que os pinos de baixo");

module ret_arred(x, y, r) {
    offset(r) square([x - 2*r, y - 2*r], center = true);
}

module saida(larg, prof) {      // rasgo em U, aberto em cima
    h = altura - z_saida + 1;
    translate([0, 0, z_saida])
    rotate([90, 0, 0])
    linear_extrude(prof, center = true)
    hull() {
        for (s = [-1, 1]) translate([s*(larg/2 - saida_raio), saida_raio]) circle(saida_raio);
        translate([-larg/2, h - 1]) square([larg, 1]);
    }
}

module orelha() {               // orelha na borda de cima, com mão-francesa a 45°
    hull() {
        translate([0, -orelha_larg/2, altura - orelha_esp]) cube([orelha_comp, orelha_larg, orelha_esp]);
        translate([0, -orelha_larg/2, altura - orelha_esp - orelha_comp]) cube([e, orelha_larg, orelha_comp]);
    }
}

module furo_orelha() {
    translate([orelha_comp - orelha_larg/2 + 0.5, 0, 0]) {
        cylinder(d = furo_orelha, h = altura + 1);
        // escareado por baixo da orelha
        translate([0, 0, altura - orelha_esp - e])
            cylinder(d1 = cabeca_orelha, d2 = furo_orelha, h = (cabeca_orelha - furo_orelha) / 2);
        translate([0, 0, -1]) cylinder(d = cabeca_orelha, h = altura - orelha_esp + 1);
    }
}

module colunas(h_extra = 0) {
    for (sx = [-1, 1], sy = [-1, 1])
        translate([sx*furo_dx/2, sy*furo_dy/2, 0])
            difference() {
                cylinder(d = diam_coluna, h = z_pcb_base + h_extra);
                translate([0, 0, 1]) cylinder(d = furo_coluna, h = z_pcb_base + 1);
            }
}

module case() {
    difference() {
        union() {
            difference() {
                linear_extrude(altura) ret_arred(ex_x, ex_y, raio_canto);
                translate([0, 0, fundo]) linear_extrude(altura) ret_arred(in_x, in_y, max(raio_canto - parede, 0.5));
            }
            colunas();
            for (sx = [-1, 1], sy = [-1, 1])
                translate([sx*ex_x/2, sy*(ex_y/2 - orelha_larg/2 - 1), 0])
                    mirror([sx < 0 ? 1 : 0, 0, 0]) orelha();
        }
        // saídas nas paredes longas (2 por lado) e curtas (1 por lado)
        for (sy = [-1, 1], sx = [-1, 1])
            translate([sx*in_x/4, sy*(ex_y/2 - parede/2), 0]) saida(saida_x_larg, parede + 2);
        for (sx = [-1, 1])
            translate([sx*(ex_x/2 - parede/2), 0, 0]) rotate([0, 0, 90]) saida(saida_y_larg, parede + 2);
        // furos das orelhas
        for (sx = [-1, 1], sy = [-1, 1])
            translate([sx*ex_x/2, sy*(ex_y/2 - orelha_larg/2 - 1), 0])
                mirror([sx < 0 ? 1 : 0, 0, 0]) furo_orelha();
        // texto gravado no fundo (lado de fora)
        translate([0, 0, -e]) linear_extrude(0.6)
            mirror([1, 0, 0]) text("SAMA 3 · ESP32", size = 6, halign = "center", valign = "center");
    }
}

module gabarito_furos() {
    difference() {
        linear_extrude(1.2) ret_arred(ex_x, ex_y, raio_canto);
        translate([0, 0, -1]) linear_extrude(3) ret_arred(in_x - 8, in_y - 8, 2);
    }
    // braços até as colunas
    for (sx = [-1, 1], sy = [-1, 1]) {
        hull() {
            translate([sx*furo_dx/2, sy*furo_dy/2, 0]) cylinder(d = diam_coluna, h = 1.2);
            translate([sx*(in_x/2), sy*(in_y/2), 0]) cylinder(d = diam_coluna, h = 1.2);
        }
        translate([sx*furo_dx/2, sy*furo_dy/2, 0])
            difference() {
                cylinder(d = diam_coluna, h = 4);
                translate([0, 0, -1]) cylinder(d = furo_coluna, h = 6);
            }
    }
    // contorno da placa (degrau de 0,6 mm para conferir o tamanho)
    translate([0, 0, 1.2]) difference() {
        linear_extrude(0.6) ret_arred(in_x + 2, in_y + 2, 1);
        translate([0, 0, -1]) linear_extrude(3) square([in_x, in_y], center = true);
    }
}

if (gabarito) gabarito_furos(); else case();
