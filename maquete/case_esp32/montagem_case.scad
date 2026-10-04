// Visualização (não imprimir): case + placa MRD068A + ESP32, presa embaixo da maquete.
// vista = "case"     -> case com a placa dentro
// vista = "maquete"  -> case presa embaixo de um pedaço da base, com um pé de canto
use <case_mrd068a.scad>
include <case_mrd068a.scad>   // traz os parâmetros (desenha a case também)

vista = "case";

module placa_mock() {
    // PCB
    color("#1f7a3a") translate([-placa_x/2, -placa_y/2, z_pcb_base]) cube([placa_x, placa_y, placa_esp]);
    // bornes (2 x 15, passo 3,5) junto às bordas em ±X
    for (sx = [-1, 1]) color("#2a6fdb")
        translate([sx*(placa_x/2 - 4 - 3.5) - 3.5, -52.5/2, z_pcb_topo]) cube([7, 52.5, 8.6]);
    // barras de pinos fêmea
    for (dx = [13, 18]) for (sx = [-1, 1]) color("#222")
        translate([sx*dx - 1.25, -19, z_pcb_topo]) cube([2.5, 38, 8.5]);
    // ESP32 DevKit
    translate([-28.3/2, -51.5/2, z_pcb_topo + 8.5 + 2.5]) {
        color("#1a1a1a") cube([28.3, 51.5, 1.6]);
        color("silver") translate([5, 10, 1.6]) cube([18, 25.5, 3.2]);
        color("silver") translate([28.3/2 - 4, 51.5 - 5, -1.5]) cube([8, 6, 3]);   // USB
    }
}

placa_mock();

if (vista == "maquete") {
    // pedaço da base da maquete (35 mm) por cima da case
    color("burlywood", 0.5) translate([-90, -70, altura]) cube([170, 140, 35]);
}
