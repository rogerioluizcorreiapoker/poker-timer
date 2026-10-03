// =====================================================================
//  SAMA 3: peça de canto (pé + capa da quina do perfil + luva da cúpula)
//  Imprimir 4 peças iguais em PLA. A peça é simétrica na diagonal,
//  então a mesma peça serve nos 4 cantos.
//
//  Maquete: base 1000 x 800 mm, 35 mm de altura, perfil de alumínio
//  em volta. Cúpula de acrílico 6 mm apoiada em cima da base.
//
//  Princípio: a face interna da parede em L é UM plano contínuo.
//    - embaixo ela encosta no perfil de alumínio (face externa da base);
//    - em cima ela encosta no acrílico (face externa da cúpula).
//  Como os dois encostam no mesmo plano, a cúpula fica RENTE à base
//  por construção e nunca passa para fora. Só a peça de PLA fica
//  4 mm para fora, nos cantos, cobrindo a quina imperfeita do perfil.
//
//  Origem: quina externa da base (encontro das duas faces externas do
//  perfil), na altura da FACE DE BAIXO da base. +X e +Y entram na base,
//  +Z para cima.  Mesa = -30, fundo da base = 0, topo da base = +35.
//  Medidas em mm.
// =====================================================================

/* [Maquete (medidas reais)] */
altura_base = 35;          // do fundo da base até o PONTO MAIS ALTO do perfil/tampo
altura_pe   = 30;          // "pezinho de 3 cm": levanta a base da mesa

/* [Peça] */
parede      = 4;           // espessura da parede (é o quanto a peça fica para fora)
braco       = 50;          // comprimento externo de cada braço do L
luva_acima  = 15;          // quanto a parede sobe acima do topo da base (cobre o acrílico)
funil_h     = 2;           // funil de entrada da cúpula: abertura horizontal
funil_v     = 5;           // funil de entrada da cúpula: altura

/* [Alívios para o perfil imperfeito] */
bolsa_prof  = 2;           // bolsa na quina do perfil: profundidade na parede
bolsa_comp  = 12;          // bolsa: comprimento a partir da quina (em cada face)
bolsa_acima = 2;           // bolsa sobe até topo da base + isto (depois teto 45°)
faixa_larg  = 15;          // rebaixo no topo do pé (aba de baixo do perfil / rebarba)
faixa_prof  = 3;
entalhe_prof = 1.2;        // entalhe vertical na quina (cola/aresta da caixa de acrílico)
entalhe_comp = 8.5;        // > espessura do acrílico + 2 (emenda colada de topo)

/* [Ajuste se o acrílico for MENOR que a base] */
recuo = 0;                 // 0 = rente. Caixa menor em D (total) -> recuo = D/2. Máx 2.

/* [Acabamento] */
raio_quina   = 2;          // arredondamento da quina externa vertical
chanfro_base = 0.6;        // chanfro na borda de baixo (pé de elefante)
chanfro_cosm = 0.5;        // chanfro nas bordas externas visíveis
chanfro_pe   = 6;          // chanfro do canto interno do pé (economia/visual)

/* [Fixação opcional (desligada no teste)] */
furo_parafuso   = false;   // rasgo diagonal para parafuso 3,5 mm de baixo para cima
rasgo_larg      = 4.2;
rasgo_curso     = 5;       // folga de ajuste ao longo da diagonal
rebaixo_larg    = 9;       // cabeça do parafuso
alma_parafuso   = 6;       // PLA que sobra entre a cabeça e a base
pele_sacrificio = 0.2;     // camada para não precisar de ponte; furar com broca 4

/* [Saída] */
teste_rapido = false;      // só a fatia de cima (25 mm) para testar o encaixe
teste_z0     = 25;

$fn = 64;
e = 0.01;

// ---------- derivadas ----------
L     = braco - parede;               // comprimento da face de referência (46)
z_top = altura_base + luva_acima;     // topo da peça (50)
z_fun = z_top - funil_v;              // início do funil (45)
z_bol = altura_base + bolsa_acima;    // topo reto da bolsa (37)
// início do recuo: depois que o teto da bolsa fecha, para não ter ponte solta
z_rec = altura_base + bolsa_acima + (recuo > 0 ? bolsa_prof : 0);
G     = L + 10;                       // cavidade passa das pontas dos braços

assert(recuo >= 0 && recuo <= 2, "recuo deve ficar entre 0 e 2 mm");
assert(funil_h < parede, "funil maior que a parede");
assert(bolsa_prof < parede, "bolsa maior que a parede");

echo(str("Altura total: ", altura_pe + z_top, " mm | parede para fora da base: ", parede, " mm"));
echo(str("Apoio da base no pé: ", L - faixa_larg, " x ", L - faixa_larg, " mm"));

// ---------- contorno externo (convexo) ----------
module contorno() {
    polygon(concat(
        // quina externa arredondada (centro em -parede+raio)
        [for (a = [180:5:270]) [-parede + raio_quina + raio_quina*cos(a),
                                -parede + raio_quina + raio_quina*sin(a)]],
        [[L - chanfro_cosm, -parede], [L, -parede + chanfro_cosm],
         [L, L - chanfro_pe], [L - chanfro_pe, L],
         [-parede + chanfro_cosm, L], [-parede, L - chanfro_cosm]]
    ));
}

module lamina(z, d = 0) {   // contorno fino na altura z, recuado d
    translate([0, 0, z]) linear_extrude(e) offset(delta = -d) contorno();
}

// casca externa com chanfro embaixo e no topo
module casca() {
    hull() {
        lamina(-altura_pe, chanfro_base);
        lamina(-altura_pe + chanfro_base);
        lamina(z_top - chanfro_cosm - e);
        lamina(z_top - e, chanfro_cosm);
    }
}

// ---------- cavidade (onde ficam base e acrílico) ----------
module quadrante(z, o) {    // quadrante interno a partir de (o,o)
    translate([o, o, z]) cube([G - o, G - o, e]);
}

module cavidade() {
    r = recuo;
    // base + perfil: plano de referência em x=0 / y=0
    hull() { quadrante(0, 0); quadrante(z_rec, 0); }
    if (r > 0) {
        hull() { quadrante(z_rec, 0); quadrante(z_rec + r, r); }   // degrau a 45°
        hull() { quadrante(z_rec + r, r); quadrante(z_fun, r); }
    } else {
        hull() { quadrante(z_rec, 0); quadrante(z_fun, 0); }
    }
    // funil de entrada
    hull() { quadrante(z_fun, r); quadrante(z_top, r - funil_h); }
    hull() { quadrante(z_top, r - funil_h); quadrante(z_top + 1, r - funil_h); }
}

// ---------- alívios ----------
module em_L(a, b, c, z0, z1) {  // L nas duas faces: faixa [a,b] na parede, até c ao longo
    translate([a, a, z0]) cube([b - a, c - a, z1 - z0]);
    translate([a, a, z0]) cube([c - a, b - a, z1 - z0]);
}

module bolsa_quina() {          // bolsa da quina do perfil, com teto a 45°
    for (m = [0, 1]) mirror(m ? [1, -1, 0] : [0, 0, 0])
        hull() {
            translate([-bolsa_prof, -bolsa_prof, -faixa_prof])
                cube([bolsa_prof + e, bolsa_comp + bolsa_prof, z_bol + faixa_prof]);
            translate([0, -bolsa_prof, z_bol + bolsa_prof])
                cube([e, bolsa_comp + bolsa_prof, e]);
        }
}

module entalhe_quina() {        // entalhe vertical para a aresta colada do acrílico
    em_L(-entalhe_prof, e, entalhe_comp, -faixa_prof, z_rec + e);
    // com recuo: acompanha o degrau a 45° (cada braço é convexo, hull separado)
    for (m = [0, 1]) mirror(m ? [1, -1, 0] : [0, 0, 0])
        hull() {
            translate([-entalhe_prof, -entalhe_prof, z_rec])
                cube([entalhe_prof + e, entalhe_comp + entalhe_prof, e]);
            translate([recuo - entalhe_prof, recuo - entalhe_prof, z_rec + recuo])
                cube([entalhe_prof + e, entalhe_comp + entalhe_prof, e]);
        }
    translate([recuo, recuo, 0])
        em_L(-entalhe_prof, e, entalhe_comp, z_rec + recuo, z_top + 1);
}

module faixa_pe() {             // rebaixo no topo do pé, junto ao perfil
    translate([0, 0, -faixa_prof]) cube([faixa_larg, G, faixa_prof + e]);
    translate([0, 0, -faixa_prof]) cube([G, faixa_larg, faixa_prof + e]);
}

module rasgo_parafuso() {
    c1 = (L + faixa_larg) / 2 - rasgo_curso / (2*sqrt(2));
    c2 = (L + faixa_larg) / 2 + rasgo_curso / (2*sqrt(2));
    z_reb = -alma_parafuso;
    hull() for (c = [c1, c2]) translate([c, c, z_reb + pele_sacrificio])
        cylinder(d = rasgo_larg, h = alma_parafuso);
    hull() for (c = [c1, c2]) translate([c, c, -altura_pe - 1])
        cylinder(d = rebaixo_larg, h = altura_pe - alma_parafuso + 1);
}

// ---------- peça ----------
module peca() {
    difference() {
        casca();
        cavidade();
        faixa_pe();
        bolsa_quina();
        entalhe_quina();
        if (furo_parafuso) rasgo_parafuso();
    }
}

if (teste_rapido)
    translate([0, 0, -teste_z0])
    difference() {
        intersection() {
            peca();
            translate([-50, -50, teste_z0]) cube([200, 200, 100]);
        }
        // chanfro na borda de baixo das faces que encostam no perfil
        hull() { quadrante(teste_z0 - e, -chanfro_base); quadrante(teste_z0 + chanfro_base, 0); }
    }
else
    translate([0, 0, altura_pe]) peca();   // mesa em z=0 para exportar
