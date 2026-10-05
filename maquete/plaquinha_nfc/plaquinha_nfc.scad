// =====================================================================
//  Plaquinha de identificação NEX LAYER3D com etiqueta NFC escondida.
//  Duas partes, impressas juntas na mesma mesa, bico 0,2 mm:
//    - FRENTE: imprime com a face para baixo. Texto, símbolo de aproximação
//      e filete da borda ficam REBAIXADOS na face que encosta na mesa
//      (acabamento liso da mesa, bordas nítidas). Atrás, um bolso redondo
//      para a etiqueta NFC e uma moldura onde a tampa encaixa.
//    - TAMPA: chapa fina que entra na moldura e fecha o bolso, rente.
//  A etiqueta fica entre as duas (o NFC lê bem através de 2-3 mm de PLA).
//  Para o texto em outra cor: troque o filamento quando a impressão chegar
//  na altura 'prof_texto' (0,6 mm).
//  Medidas em mm. Origem no centro da plaquinha; z=0 é a FACE (mesa).
// =====================================================================

/* [Plaquinha] */
larg        = 90;
alt         = 50;
raio_canto  = 6;
esp_frente  = 2.4;      // corpo da frente
chanfro     = 0.8;      // chanfro a 45° na borda da face (vira para fora subindo: imprime)
moldura     = 1.5;      // largura da moldura onde a tampa encaixa
alt_moldura = 1.3;      // altura da moldura acima do corpo
esp_tampa   = 1.2;
folga_tampa = 0.15;     // folga por lado da tampa na moldura

/* [Etiqueta NFC] */
nfc_d       = 25;       // diâmetro da etiqueta (adesivo redondo NTAG ~25 mm; use 30 se for maior)
nfc_folga   = 0.6;
nfc_prof    = 0.8;      // profundidade do bolso (etiqueta adesiva tem ~0,3-0,5 mm)

/* [Arte da face (rebaixada)] */
prof_texto  = 0.6;      // texto e símbolo
prof_filete = 0.3;      // filete da borda
filete_larg = 0.5;
filete_recuo = 3;       // filete a esta distância da borda
fonte       = "Liberation Sans:style=Bold";
l1 = "NEX";         l1_tam = 13;   l1_y = 8;
l2 = "LAYER3D";     l2_tam = 6.4;  l2_y = -1.6;
l3 = "MAQUETES INTERATIVAS"; l3_tam = 3.0; l3_y = -9.8;
texto_x     = -14;      // centro do bloco de texto
simbolo_x   = 26;       // centro do símbolo de aproximação
simbolo_y   = 2.5;
simbolo_esc = 1.1;
l4a = "APROXIME";   l4b = "O CELULAR";  l4_tam = 2.6;  l4_y = -12.6;  l4_dy = 3.6;
l4_x = 31.5;            // centro das linhas pequenas (centro visual dos arcos)
divisor_x = 16.5;       // filete vertical entre o texto e o símbolo
divisor_alt = 30;

/* [Saída] */
peca = "ambas";         // "frente", "tampa" ou "ambas"
gap  = 10;              // distância entre as peças na mesa

$fn = 96;
e = 0.01;

module arred(x, y, r) { offset(r) offset(-r) square([x, y], center = true); }

// símbolo de aproximação (contactless): 4 arcos abrindo para a direita
module simbolo_aproximacao() {
    for (i = [0 : 3]) {
        r = 3.2 + i * 2.7;
        w = 1.15;
        intersection() {
            difference() { circle(r + w/2); circle(r - w/2); }
            // setor de ±45° para a direita, com pontas arredondadas
            polygon([[0, 0], [40, 40], [40, -40]]);
        }
        // pontas redondas dos arcos
        for (a = [-45, 45]) translate([r*cos(a), r*sin(a)]) circle(w/2);
    }
    translate([1.6, 0]) circle(1.3);     // ponto de origem
}

// arte vista de FRENTE (coordenadas normais, sem espelhar)
module arte_frente() {
    translate([texto_x, l1_y]) text(l1, size = l1_tam, font = fonte, halign = "center", valign = "center", spacing = 1.02);
    translate([texto_x, l2_y]) text(l2, size = l2_tam, font = fonte, halign = "center", valign = "center", spacing = 1.08);
    translate([texto_x, l3_y]) text(l3, size = l3_tam, font = fonte, halign = "center", valign = "center", spacing = 1.08);
    translate([simbolo_x, simbolo_y]) scale(simbolo_esc) simbolo_aproximacao();
    translate([l4_x, l4_y]) text(l4a, size = l4_tam, font = fonte, halign = "center", valign = "center", spacing = 1.1);
    translate([l4_x, l4_y - l4_dy]) text(l4b, size = l4_tam, font = fonte, halign = "center", valign = "center", spacing = 1.1);
}

module filete() {
    difference() {
        arred(larg - 2*filete_recuo, alt - 2*filete_recuo, raio_canto - filete_recuo);
        arred(larg - 2*filete_recuo - 2*filete_larg, alt - 2*filete_recuo - 2*filete_larg, raio_canto - filete_recuo - filete_larg);
    }
    translate([divisor_x, 0]) square([filete_larg, divisor_alt], center = true);
}

module frente() {
    difference() {
        union() {
            // corpo com chanfro na face (face menor embaixo, cresce a 45°: imprime sem suporte)
            hull() {
                linear_extrude(e) arred(larg - 2*chanfro, alt - 2*chanfro, raio_canto - chanfro);
                translate([0, 0, chanfro]) linear_extrude(esp_frente - chanfro) arred(larg, alt, raio_canto);
            }
            // moldura da tampa
            translate([0, 0, esp_frente - e]) linear_extrude(alt_moldura + e) difference() {
                arred(larg, alt, raio_canto);
                arred(larg - 2*moldura, alt - 2*moldura, raio_canto - moldura);
            }
        }
        // arte rebaixada na face (espelhada: a face fica virada para a mesa)
        translate([0, 0, -e]) linear_extrude(prof_texto + e) mirror([1, 0, 0]) arte_frente();
        translate([0, 0, -e]) linear_extrude(prof_filete + e) mirror([1, 0, 0]) filete();
        // bolso da etiqueta NFC, atrás
        translate([0, 0, esp_frente - nfc_prof]) cylinder(d = nfc_d + nfc_folga, h = nfc_prof + alt_moldura + 1);
        // rebaixo para a unha, para tirar a etiqueta se precisar
        translate([nfc_d/2 + 1, 0, esp_frente - nfc_prof]) cylinder(d = 6, h = nfc_prof + alt_moldura + 1);
    }
}

module tampa() {
    linear_extrude(esp_tampa) arred(larg - 2*moldura - 2*folga_tampa, alt - 2*moldura - 2*folga_tampa, raio_canto - moldura - folga_tampa);
}

if (peca == "frente") frente();
else if (peca == "tampa") tampa();
else {
    translate([0, alt/2 + gap/2, 0]) frente();
    translate([0, -alt/2 - gap/2, 0]) tampa();
}
