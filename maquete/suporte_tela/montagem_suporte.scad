// Visualização (não imprimir): suporte + tela Guition 10,1" + espaçadores.
include <suporte_tela10.scad>     // desenha o suporte

module tela_mock() {
    na_face() translate([0, L/2, 0]) {
        // espaçadores + colunas de latão
        for (f = furos) if (!(furos_dos_dois_lados && f[0] == furo_meio))
            translate([f[0], f[1], 0]) {
                color("white") translate([0, 0, -rebaixo_esp]) cylinder(d = 8, h = espacador);
                color("gold") translate([0, 0, espacador - rebaixo_esp]) cylinder(d = 7.5, h = coluna_alt);
            }
        // caixa da eletrônica
        color("#222") translate([-caixa_l/2, -caixa_a/2, vao - caixa_prof]) cube([caixa_l, caixa_a, caixa_prof]);
        // painel (chapa + vidro)
        color("#111") translate([-tela_l/2, -tela_a/2, vao]) cube([tela_l, tela_a, 7]);
        color("#2a4d8f") translate([-216.58/2, -135.36/2, vao + 7]) cube([216.58, 135.36, 0.2]);
    }
}
tela_mock();
