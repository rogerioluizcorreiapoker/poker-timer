// =====================================================================
//  Peça de canto da maquete — pé de 3 cm + apoio da base + encaixe da cúpula
//  Imprimir 4 peças em PLA (são iguais e simétricas — servem nos 4 cantos).
//
//  Ideia:
//    - Embaixo: pé de 30 mm que levanta a base.
//    - Meio: degrau (rebaixo) em L onde o canto da base apoia.
//    - Em cima: canaleta em L onde a parede da cúpula encaixa.
//      A canaleta em 90° força a cúpula a ficar no esquadro.
//
//  Todas as medidas em mm. Ajuste os parâmetros com as medidas reais.
// =====================================================================

/* [Medidas das peças existentes] */
espessura_base    = 3;    // espessura da chapa da base (MDF/acrílico)
espessura_cupula  = 3;    // espessura da parede da cúpula

/* [Folgas para PLA] */
folga_base   = 0.4;       // folga vertical/lateral da base
folga_cupula = 0.4;       // folga total da canaleta (largura = parede + folga)

/* [Geometria da peça] */
altura_pe          = 30;  // pé de 3 cm (do chão até a face de baixo da base)
comprimento_braco  = 45;  // comprimento de cada braço do L
parede_externa     = 3;   // parede de fora da canaleta (acabamento externo)
parede_interna     = 3;   // parede entre a canaleta e a borda da base
largura_apoio_base = 12;  // quanto a base apoia em cima do pé
profundidade_canal = 10;  // quanto a parede da cúpula entra na canaleta
chanfro_canal      = 1;   // chanfro na entrada da canaleta (facilita encaixe)
altura_acima_base  = 9;   // altura das paredes acima da face de cima da base

/* [Furo para parafuso (opcional)] */
usar_furo        = true;
diam_furo        = 3.2;   // M3 / parafuso de madeira 3 mm
diam_cabeca      = 6.5;
carne_furo       = 6;     // material sob a base no furo (o resto é rebaixo por baixo)

$fn = 48;

// ---------- medidas derivadas ----------
largura_canal = espessura_cupula + folga_cupula;
u_canal_ini   = parede_externa;
u_canal_fim   = parede_externa + largura_canal;
u_borda_base  = u_canal_fim + parede_interna;          // onde fica a borda da base
largura_total = u_borda_base + largura_apoio_base;
z_topo        = altura_pe + espessura_base + folga_base + altura_acima_base;
z_fundo_canal = z_topo - profundidade_canal;
A = comprimento_braco;

echo(str("Altura total da peça: ", z_topo, " mm"));
echo(str("Largura da canaleta: ", largura_canal, " mm"));
echo(str("Base recuada da face externa da peça: ", u_borda_base, " mm"));
echo(str("=> Cúpula externa = Base + ", 2*(u_borda_base - u_canal_ini - folga_cupula/2), " mm"));

// região em L com largura w (canto externo na origem)
module L2d(w) {
    union() {
        square([A, w]);
        square([w, A]);
    }
}

// um braço da canaleta (seção com chanfro), correndo ao longo de X
module canal_braco() {
    translate([u_canal_ini, 0, 0])   // começa no canto da canaleta
    rotate([90, 0, 90])
    linear_extrude(A + 1)
    polygon([
        [u_canal_ini,               z_fundo_canal],
        [u_canal_fim,               z_fundo_canal],
        [u_canal_fim,               z_topo - chanfro_canal],
        [u_canal_fim + chanfro_canal, z_topo + 0.01],
        [u_canal_fim + chanfro_canal, z_topo + 1],
        [u_canal_ini - chanfro_canal, z_topo + 1],
        [u_canal_ini - chanfro_canal, z_topo + 0.01],
        [u_canal_ini,               z_topo - chanfro_canal],
    ]);
}

module peca_canto() {
    difference() {
        union() {
            // pé + apoio da base
            linear_extrude(altura_pe) L2d(largura_total);
            // paredes (externa + canaleta + interna) até o topo
            linear_extrude(z_topo) L2d(u_borda_base);
        }
        // canaleta em L (dois braços se cruzando no canto)
        canal_braco();
        mirror([1, -1, 0]) canal_braco();

        // furo de fixação da base (no meio do apoio, na diagonal)
        if (usar_furo) {
            c = u_borda_base + largura_apoio_base / 2;
            translate([c, c, -1]) cylinder(d = diam_furo, h = altura_pe + 2);
            translate([c, c, -1]) cylinder(d = diam_cabeca, h = altura_pe - carne_furo + 1);
        }
    }
}

peca_canto();
