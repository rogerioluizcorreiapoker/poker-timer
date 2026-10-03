// Só para visualizar: peça de canto + pedaço da base + pedaço da cúpula.
// (não imprimir este arquivo)
include <canto_pe_cupula.scad>   // já desenha a peça de canto

trecho = 70;   // pedaço de base/cúpula mostrado

// base (chapa) apoiada no degrau
color("burlywood")
translate([u_borda_base, u_borda_base, altura_pe])
    cube([trecho, trecho, espessura_base]);

// paredes da cúpula entrando na canaleta
color("lightskyblue", 0.55)
translate([0, 0, z_fundo_canal + 0.2]) {
    translate([u_canal_ini + folga_cupula/2, u_canal_ini + folga_cupula/2, 0])
        cube([trecho, espessura_cupula, 35]);
    translate([u_canal_ini + folga_cupula/2, u_canal_ini + folga_cupula/2, 0])
        cube([espessura_cupula, trecho, 35]);
}
