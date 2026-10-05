// Visualização (não imprimir): suporte fechado + tela Guition 10,1" encaixada.
include <suporte_tela10.scad>     // desenha o suporte

module tela_mock() {
    na_face() translate([0, L/2, 0]) {
        // colunas de latão (entram nos encaixes da borda)
        for (f = encaixes) if (!(encaixes_dos_dois_lados && f[0] == furo_meio))
            color("gold") translate([f[0], f[1], -coluna_alt]) cylinder(d = coluna_d, h = coluna_alt);
        // caixa da eletrônica (entra na abertura)
        color("#222") translate([-caixa_l/2, -caixa_a/2, -caixa_prof]) cube([caixa_l, caixa_a, caixa_prof]);
        // painel (chapa + vidro) apoiado na borda
        color("#111") translate([-tela_l/2, -tela_a/2, 0]) cube([tela_l, tela_a, 7]);
        color("#2a4d8f") translate([-216.58/2, -135.36/2, 7]) cube([216.58, 135.36, 0.2]);
    }
}
tela_mock();
