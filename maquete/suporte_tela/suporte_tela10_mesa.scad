// =====================================================================
//  Suporte de MESA pequeno e bem deitado para a tela Guition 10,1".
//  É o suporte_tela10_fino.scad com outros valores:
//    - tela a 30° da mesa (60° para trás da vertical), ~8 cm de altura;
//    - paredes finas (0,9 mm) e face de 1,8 mm, sem logo: impressão rápida;
//    - o STL sai GIRADO, com a traseira na mesa da impressora: a face fica
//      a 30° da vertical e imprime SEM SUPORTE. Não gire no fatiador.
// =====================================================================
include <suporte_tela10_fino.scad>

angulo      = 30;
fundo_atras = 10;
imprimir_de_costas = true;
janelas_fundo = 3;
