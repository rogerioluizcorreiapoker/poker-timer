// =====================================================================
//  Suporte da tela Guition 10,1" para ficar com a TRASEIRA COLADA NA PAREDE
//  (ou no balcão), tela um pouco mais em pé e paredes mais grossas.
//  É o suporte_tela10_fino.scad com outros valores:
//    - tela a 36° da mesa, ~97 mm de altura;
//    - paredes de 2 mm e face de 3 mm;
//    - traseira FECHADA (sem o furo do cabo): área inteira para colar;
//    - o cabo desce pela abertura e sai por um rasgo embaixo das laterais,
//      perto da parede (tem dos dois lados);
//    - peça única, o STL sai GIRADO de costas (traseira na mesa da
//      impressora): imprime sem suporte. Não gire no fatiador.
// =====================================================================
include <suporte_tela10_fino.scad>

angulo      = 36;
parede      = 2.0;
esp_face    = 3.0;
fundo_atras = 10;
furo_tras_d = 0;
rasgo_cabo_lado = 12;
imprimir_de_costas = true;
janelas_fundo = 3;
