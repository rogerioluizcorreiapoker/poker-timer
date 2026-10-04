// =====================================================================
//  Case para o adaptador de bornes ESP32 30 pinos (MRD068A) + ESP32 DevKit
//  Fica presa EMBAIXO da maquete Sama 3 (pé de 30 mm).
//
//  Ideia: bandeja aberta em cima. A face de baixo da maquete fecha a case.
//    - a placa fica sobre 4 colunas, componentes para cima (para a maquete),
//      presa com 4 parafusos M2.5 x 5;
//    - saídas em U abertas a partir da borda:
//        * paredes dos BORNES: rasgo comprido na frente das 2 fileiras de
//          15 bornes, na altura da entrada dos fios;
//        * paredes das pontas: rasgo para o USB do ESP32 (nos dois lados,
//          a placa pode entrar em qualquer sentido);
//      dá para deitar os fios (até com conector) e depois parafusar a case;
//    - 4 orelhas com furo escareado por baixo: parafuso de baixo para cima
//      entrando na maquete. Para colocar/tirar os parafusos é preciso levantar
//      a base (com o pé de 30 só sobra 4 mm embaixo da case).
//
//  Eixos: X = de uma fileira de bornes até a outra (70 mm),
//         Y = ao longo do ESP32 / USB e dos bornes (64 mm).
//  Origem: centro da placa, Z=0 na face de baixo (externa) da case.
//  Medidas em mm. Placa 70 x 64, furos 65 x 60 centro a centro (medidos).
// =====================================================================

/* [Placa MRD068A (conferir)] */
placa_x       = 70;     // de um lado de bornes até o outro (medido)
placa_y       = 64;     // ao longo do ESP32 (lado dos bornes) (medido)
placa_esp     = 1.6;    // espessura do PCB
furo_dx       = 65;     // centro a centro dos furos entre os lados de bornes (medido)
furo_dy       = 60;     // centro a centro dos furos ao longo dos bornes (medido)
altura_conjunto = 20;   // altura total medida: pinos de baixo até topo do ESP32
pinos_baixo   = 2.5;    // quanto os pinos/soldas passam por baixo do PCB
usb_altura    = 14;     // centro do USB do ESP32 acima do topo do PCB do adaptador

/* [Case] */
folga_placa   = 1.0;    // folga entre placa e parede (cada lado)
parede        = 2.0;
fundo         = 2.0;
folga_topo    = 3.5;    // entre o topo do ESP32 e a maquete (espaço para o plugue USB)
raio_canto    = 3;
altura_coluna = 3.0;    // coluna sob a placa (>= pinos_baixo + 0.5)
diam_coluna   = 7.4;    // larga; nas medidas atuais encosta e funde na parede
furo_coluna   = 2.2;    // parafuso M2.5 x 5 auto-atarraxante no PLA (M3: 2.6)
fundo_piloto  = 0.6;    // fundo que sobra embaixo do furo-piloto

/* [Saídas em U (abertas na borda de cima)] */
saida_bornes_larg = 56;  // fileira de 15 bornes passo 3,5 = 52,5 mm
saida_acima_pcb   = 0.5; // fundo do rasgo dos bornes: topo do PCB + isto
usb_larg          = 15;  // rasgo do USB
usb_alto          = 11;  // parte útil do rasgo do USB em volta do centro
usb_dois_lados    = true;
saida_raio        = 2;

/* [Fixação na maquete] */
orelha_comp   = 11;     // quanto a orelha sai da parede
orelha_larg   = 12;
orelha_esp    = 3;
furo_orelha   = 4.0;    // parafuso de madeira 3,5 mm
cabeca_orelha = 7.5;    // escareado (cabeça chata 90°) por baixo

/* [Saída] */
gabarito = false;       // só uma placa com pinos nos furos, para testar a furação
logo     = true;        // logo NEX LAYER3D gravado no fundo
logo_l1  = "NEX";
logo_l2  = "LAYER3D";
logo_larg = 50;         // largura do logo no fundo
logo_prof = 0.6;        // profundidade da gravação (3 camadas de 0,2)

$fn = 48;
e = 0.01;

// ---------- derivadas ----------
in_x = placa_x + 2*folga_placa;
in_y = placa_y + 2*folga_placa;
ex_x = in_x + 2*parede;
ex_y = in_y + 2*parede;
h_col = max(altura_coluna, pinos_baixo + 0.5);
z_pcb_base = fundo + h_col;
z_pcb_topo = z_pcb_base + placa_esp;
altura = fundo + h_col + (altura_conjunto - pinos_baixo) + folga_topo;
z_saida_bornes = z_pcb_topo + saida_acima_pcb;
z_saida_usb    = z_pcb_topo + usb_altura - usb_alto/2;
orelha_x = ex_x/2 - orelha_larg/2 - raio_canto;   // orelhas nas paredes das pontas (Y), no trecho reto

echo(str("Case externa: ", ex_x, " x ", ex_y, " x ", altura, " mm (sobram ", 30 - altura, " mm até a mesa com pé de 30)"));
assert(altura <= 28, "case alta demais para o pé de 30 mm");
assert(z_saida_usb < altura - 3, "rasgo do USB acima da borda");
assert(saida_bornes_larg < in_y - 2, "rasgo dos bornes maior que a parede");

module ret_arred(x, y, r) {
    offset(r) square([x - 2*r, y - 2*r], center = true);
}

// rasgo em U no plano XZ (aberto em cima), atravessando a parede em Y
module saida(larg, z0, prof) {
    h = altura - z0 + 1;
    translate([0, 0, z0])
    rotate([90, 0, 0])
    linear_extrude(prof, center = true)
    hull() {
        for (s = [-1, 1]) translate([s*(larg/2 - saida_raio), saida_raio]) circle(saida_raio);
        translate([-larg/2, h - 1]) square([larg, 1]);
    }
}

// orelha na borda de cima saindo em +Y, com mão-francesa a 45° (imprime sem suporte)
module orelha() {
    hull() {
        translate([-orelha_larg/2, -parede/2, altura - orelha_esp]) cube([orelha_larg, orelha_comp + parede/2, orelha_esp]);
        translate([-orelha_larg/2, -parede/2, altura - orelha_esp - orelha_comp]) cube([orelha_larg, parede/2, orelha_comp]);
    }
}

module furo_orelha() {
    translate([0, orelha_comp - orelha_larg/2 + 0.5, 0]) {
        cylinder(d = furo_orelha, h = altura + 1);
        translate([0, 0, altura - orelha_esp - e])
            cylinder(d1 = cabeca_orelha, d2 = furo_orelha, h = (cabeca_orelha - furo_orelha) / 2);
        translate([0, 0, -1]) cylinder(d = cabeca_orelha, h = altura - orelha_esp + 1);
    }
}

module em_cada_furo() {
    for (sx = [-1, 1], sy = [-1, 1]) translate([sx*furo_dx/2, sy*furo_dy/2, 0]) children();
}

module em_cada_orelha() {
    for (sx = [-1, 1], sy = [-1, 1])
        translate([sx*orelha_x, sy*ex_y/2, 0]) mirror([0, sy < 0 ? 1 : 0, 0]) children();
}

// logo: NEX grande, traço, LAYER3D embaixo, as duas linhas com a mesma largura
module logo2d() {
    fonte = "Liberation Sans:style=Bold";
    translate([0, 7]) resize([logo_larg, 0], auto = true)
        text(logo_l1, size = 16, font = fonte, halign = "center", valign = "center");
    translate([0, -5.5]) square([logo_larg, 1.2], center = true);
    translate([0, -12]) resize([logo_larg, 0], auto = true)
        text(logo_l2, size = 8, font = fonte, halign = "center", valign = "center");
}

module case() {
    difference() {
        union() {
            difference() {
                linear_extrude(altura) ret_arred(ex_x, ex_y, raio_canto);
                translate([0, 0, fundo]) linear_extrude(altura) ret_arred(in_x, in_y, max(raio_canto - parede, 0.5));
            }
            // colunas, ligadas ao canto da parede (sem frestas entre coluna e canto)
            for (sx = [-1, 1], sy = [-1, 1]) hull() {
                translate([sx*furo_dx/2, sy*furo_dy/2, 0]) cylinder(d = diam_coluna, h = z_pcb_base);
                translate([sx*(in_x/2 - 0.5), sy*(in_y/2 - 0.5), z_pcb_base/2]) cube([1, 1, z_pcb_base], center = true);
            }
            em_cada_orelha() orelha();
        }
        // furo-piloto das colunas
        em_cada_furo() translate([0, 0, fundo_piloto]) cylinder(d = furo_coluna, h = z_pcb_base);
        // rasgos dos bornes (paredes em ±X)
        for (sx = [-1, 1])
            translate([sx*(ex_x/2 - parede/2), 0, 0]) rotate([0, 0, 90])
                saida(saida_bornes_larg, z_saida_bornes, parede + 2);
        // rasgo do USB (paredes em ±Y)
        for (sy = usb_dois_lados ? [-1, 1] : [1])
            translate([0, sy*(ex_y/2 - parede/2), 0]) saida(usb_larg, z_saida_usb, parede + 2);
        // furos das orelhas
        em_cada_orelha() furo_orelha();
        // logo gravado no fundo (lê certo olhando por baixo)
        if (logo) translate([0, 0, -e]) linear_extrude(logo_prof + e) mirror([1, 0, 0]) logo2d();
    }
}

// gabarito: moldura fina com 4 pinos nos furos da placa + degrau do contorno
module gabarito_furos() {
    pino = 2.5;                       // entra no furo de 3 mm da placa
    difference() {
        linear_extrude(1.2) ret_arred(in_x + 4, in_y + 4, raio_canto);
        translate([0, 0, -1]) linear_extrude(3) ret_arred(in_x - 14, in_y - 14, 2);
    }
    em_cada_furo() {
        cylinder(d = diam_coluna, h = 3);
        cylinder(d = pino, h = 3 + placa_esp + 1);
        translate([0, 0, 3 + placa_esp + 1]) cylinder(d1 = pino, d2 = pino - 1, h = 0.5);
    }
    // moldura na medida interna da case, até o topo da placa: a placa tem que
    // descer dentro dela e assentar nas colunas
    translate([0, 0, 1]) difference() {
        linear_extrude(3 + placa_esp - 1) ret_arred(in_x + 4, in_y + 4, raio_canto);
        translate([0, 0, -1]) linear_extrude(10) square([in_x, in_y], center = true);
    }
}

if (gabarito) gabarito_furos(); else case();
