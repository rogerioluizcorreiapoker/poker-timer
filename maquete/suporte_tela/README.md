# Suporte da tela Guition 10,1" (JC8012P4A1C, ESP32-P4)

Suporte de mesa para a tela de 10,1" da maquete, no estilo do suporte do modelo de 7". Ele fica em pé na mesa, e também pode ser parafusado na maquete pelos 4 furos da base.

| Suporte | Com a tela | Por trás | De lado |
|---|---|---|---|
| ![](img/suporte_frente.png) | ![](img/com_tela_frente.png) | ![](img/com_tela_tras.png) | ![](img/com_tela_lado.png) |

## Medidas da tela

Tiradas do desenho oficial da Guition (`JC8012P4A1_desenho_guition.pdf`, nesta pasta):
- vidro de **242,8 × 158,7 mm**, espessura total de 22,51 mm (painel de 7 mm + caixa de 15,51 mm atrás);
- **6 colunas de latão M2,5** a 15 mm das bordas: **212,8 × 128,7 mm** entre os furos dos cantos. O furo do meio fica 16,4 mm fora do centro (90 + 122,8 mm);
- caixa da eletrônica de 138,35 × 93,5 mm, centralizada, com os USB-C na lateral comprida.

## Como é

- **Tamanho:** 237 × 120 × 143 mm. Cabe na mesa de 256 × 256 (Bambu P1/X1/A1).
- **Inclinação:** a tela fica deitada (paisagem), a **65°** da mesa (`angulo`).
- **Espaçadores:** 6 espaçadores de 13 mm entre o suporte e as colunas da tela. A caixa de trás e o plugue USB cabem no vão de 17,5 mm.
- **Furos:** a face tem **8 furos** (os 4 dos cantos e o do meio dos dois lados), então a tela pode ser montada virada 180°.
- **Abertura no meio da face:** o cabo entra no suporte e sai por trás. O ideal é um **cabo USB-C em L (90°)**: o plugue vira direto para dentro da abertura. Com cabo reto, o fio sai pela borda da tela.
- **Fundo e traseira abertos:** dá para alcançar os parafusos e passar o cabo.
- **Base:** se estende para trás, para a tela não tombar quando você toca nela.
- **Logo NEX LAYER3D** gravado nas duas laterais.

## Arquivos

- `stl/suporte_tela10.stl`: o suporte.
- `stl/espacadores_x7.stl`: 7 espaçadores (6 + 1 reserva).
- `suporte_tela10.scad`: modelo paramétrico (OpenSCAD).
- `montagem_suporte.scad`: só para ver o suporte com a tela (não imprimir).
- `JC8012P4A1_desenho_guition.pdf`: desenho mecânico da Guition.

Gerar de novo:
```
openscad -o stl/suporte_tela10.stl suporte_tela10.scad
openscad -o stl/espacadores_x7.stl -D 'peca="espacadores"' suporte_tela10.scad
```

## Impressão (PLA)

- **Suporte:** em pé, com a base na mesa (como no arquivo), **sem suporte**. A face inclinada e a borda da abertura ficam a no máximo 45°.
- **Configuração:** 0,2 mm de camada, 3 perímetros, 15% de preenchimento.
- **Espaçadores:** em pé, 100% de preenchimento.

## Montagem

1. **Se for prender na maquete ou na mesa:** faça isso **antes** de pôr a tela, porque ela cobre os furos da frente. Use 4 parafusos de madeira **3,5 × 16 mm**, cabeça chata, de cima para baixo.
2. Deite a tela **de bruços** sobre um pano macio.
3. Coloque um espaçador em cima de cada coluna de latão (6).
4. Apoie a face do suporte sobre os espaçadores, com a abertura em volta da caixa da tela.
5. Prenda com 6 parafusos **M2,5 × 22** por dentro do suporte. Passam pela face (5 mm) e pelo espaçador (13 mm) e entram 4 mm na coluna. **Não use mais comprido que 22 mm:** pode encostar no painel. Se a rosca da coluna for rasa, use M2,5 × 20.
6. Ligue o cabo USB-C (de preferência em L), passe pela abertura e saia por trás.

## Ajustes no `.scad`

- `angulo`: inclinação (padrão 65°). Por exemplo, 55° fica mais deitada e 75° mais em pé.
- `espacador`: altura dos espaçadores. Se mudar, ajuste o tamanho do parafuso: face 5 + espaçador + 4 mm.
- `cauda`: quanto a base vai para trás.
- `logo = false` tira o logo.
