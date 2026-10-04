# Case do ESP32 (adaptador de bornes MRD068A), embaixo da maquete

Case para o **adaptador de bornes ESP32 30 pinos (MRD068A)** com o **ESP32 DevKit** já encaixado. Ela fica presa embaixo da maquete Sama 3.

- O conjunto montado mede **20 mm** de altura. A case tem **24 mm** de altura total: com o pé de 30 mm, sobram **6 mm** até a mesa.
- Medida externa: **72 × 69 mm**, mais as 4 orelhas de fixação (91 mm no total, nas pontas).

| Case | Com a placa | Por baixo | Gabarito de teste |
|---|---|---|---|
| ![](img/case_cima.png) | ![](img/case_com_placa.png) | ![](img/case_baixo.png) | ![](img/gabarito.png) |

## Como funciona

- **Bandeja aberta em cima:** a face de baixo da maquete fecha a case. Não tem tampa.
- **Placa:** fica sobre 4 colunas, com os bornes e o ESP32 virados para cima. Com a case montada, a placa fica deitada nas colunas. Os parafusos da placa são opcionais.
- **Saídas laterais em U, abertas na borda de cima.** Dá para deitar os fios, até com conector, antes de parafusar a case na maquete.
  - Nas **duas paredes dos bornes:** um rasgo comprido (56 mm) na frente de cada fileira de 15 bornes, começando logo acima da placa, na altura da entrada dos fios.
  - Nas **duas pontas:** um rasgo de 15 mm para o **USB do ESP32**. Tem dos dois lados, então a placa entra em qualquer sentido.
- **Fixação:** 4 orelhas com furo escareado por baixo. O parafuso entra de baixo para cima na maquete. Para mexer, solte os 4 parafusos e a case desce com a placa e os fios juntos.
- **Texto** "SAMA 3 · ESP32" gravado no fundo.

## Antes de imprimir: conferir a furação

As lojas não concordam na distância entre os furos da placa. Ao longo dos bornes as fontes dão de 57,5 a 59 mm; entre um lado de bornes e o outro, de 60 a 63,7 mm. O modelo usa **61 × 58,5 mm**.

1. Imprima o **`stl/gabarito_furos.stl`** (moldura fina com 4 pinos, uns 15 minutos).
2. Encaixe a placa nos pinos. Se entrar nos 4 sem forçar, a furação está certa, e a placa precisa caber dentro do degrau do contorno.
3. Se não entrar, meça com paquímetro a distância **de centro a centro** dos furos (borda interna de um furo até a borda interna do outro, mais 3 mm). Ajuste `furo_dx` (entre os lados de bornes) e `furo_dy` (ao longo dos bornes) no `case_mrd068a.scad` e gere de novo.

Confira também:
- se a placa tem **15 bornes de cada lado** (versão 30 pinos, cerca de 66 × 63 mm). Se tiver 19, é a versão de 38 pinos, maior, e as medidas mudam;
- quanto os pinos passam por baixo da placa (`pinos_baixo = 2,5`; a coluna tem 3 mm).

## Arquivos

- `case_mrd068a.scad`: modelo paramétrico (OpenSCAD). As medidas ficam no topo.
- `stl/case_mrd068a.stl`: a case.
- `stl/gabarito_furos.stl`: teste da furação.
- `montagem_case.scad`: só para ver a placa dentro da case (não imprimir).

Gerar de novo:
```
openscad -o stl/case_mrd068a.stl case_mrd068a.scad
openscad -o stl/gabarito_furos.stl -D gabarito=true case_mrd068a.scad
```

## Impressão (PLA)

- Com o fundo na mesa (como no arquivo), **sem suporte**. As orelhas têm mão-francesa a 45°.
- 0,2 mm de camada, 3 perímetros, 15–20% de preenchimento.
- O texto gravado no fundo fica na primeira camada. Se a sua mesa não gostar, use `texto = ""`.

## Montagem

1. Coloque a placa (com o ESP32) nas colunas. Se quiser, prenda com 4 parafusos **M2,5 × 6** auto-atarraxantes. Para M3, mude `furo_coluna` para 2,6.
2. Ligue os fios nos bornes e deite-os nos rasgos laterais. O cabo USB sai pelo rasgo da ponta.
3. Encoste a case embaixo da maquete, num lugar plano, longe dos pés de canto. Prenda com 4 parafusos de madeira **3,5 × 16 mm**, cabeça chata, de baixo para cima. A base tem 35 mm, então não passe de 30 mm de parafuso.
4. A antena do ESP32 fica do lado oposto ao USB. Evite encostar essa ponta no perfil de alumínio.
