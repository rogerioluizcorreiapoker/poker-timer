// Visualização (não imprimir): peças de canto + base com perfil + cúpula.
// vista = "canto"  -> close de um canto
// vista = "geral"  -> maquete inteira 1000 x 800
use <canto_sama3.scad>

vista        = "canto";
base_x       = 1000;
base_y       = 800;
altura_base  = 35;
altura_pe    = 30;
perfil_esp   = 1.5;     // só para desenhar o alumínio
acrilico     = 6;
cupula_h     = 250;     // altura da cúpula (desenho)

module base_com_perfil(X, Y) {
    color("burlywood") translate([perfil_esp, perfil_esp, 0])
        cube([X - 2*perfil_esp, Y - 2*perfil_esp, altura_base - 0.5]);
    color("silver") difference() {
        cube([X, Y, altura_base]);
        translate([perfil_esp, perfil_esp, -1]) cube([X - 2*perfil_esp, Y - 2*perfil_esp, altura_base + 2]);
    }
}

module cupula(X, Y, H) {
    color("lightskyblue", 0.35) translate([0, 0, altura_base]) difference() {
        cube([X, Y, H]);
        translate([acrilico, acrilico, -1]) cube([X - 2*acrilico, Y - 2*acrilico, H - acrilico + 1]);
    }
}

module cantos(X, Y) {
    color("#2b2b2b") {
        peca();
        translate([X, 0, 0]) mirror([1, 0, 0]) peca();
        translate([0, Y, 0]) mirror([0, 1, 0]) peca();
        translate([X, Y, 0]) mirror([1, 0, 0]) mirror([0, 1, 0]) peca();
    }
}

if (vista == "geral") {
    base_com_perfil(base_x, base_y);
    cupula(base_x, base_y, cupula_h);
    cantos(base_x, base_y);
} else {
    X = 160; Y = 130;     // trecho do canto
    intersection() {
        union() { base_com_perfil(base_x, base_y); cupula(base_x, base_y, 70); }
        translate([-10, -10, -40]) cube([X, Y, 200]);
    }
    color("#2b2b2b") peca();
}
