// =====================================================================
//  Suporte fechado da tela Guition 10,1" — versão MAIS DEITADA e MAIS GROSSA.
//  É o suporte_tela10_fino.scad com outros valores:
//    - tela a 35° da mesa (55° para trás da vertical);
//    - paredes de 1,6 mm e face de 2,4 mm (fina era 0,9 / 1,8);
//    - o STL sai GIRADO (imprimir_de_costas = true), com a traseira na mesa da impressora: assim a face
//      fica a 35° da vertical e imprime SEM SUPORTE;
//    - fundo com 3 janelas de topo em Λ (na posição de impressão o fundo fica
//      em pé e o topo das janelas fica a 45°).
// =====================================================================
include <suporte_tela10_fino.scad>

angulo      = 35;
parede      = 1.6;
esp_face    = 2.4;
fundo_atras = 12;
imprimir_de_costas = true;
janelas_fundo = 3;
// Para imprimir EM PÉ (com suporte no fatiador): imprimir_de_costas = false.
