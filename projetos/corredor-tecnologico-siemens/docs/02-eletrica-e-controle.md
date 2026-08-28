# 02 — Elétrica e controle

## Fita LED: WS2815 12 V, 60 LED/m

| Critério | Por que essa e não outra |
|---|---|
| **12 V** | Em 12 m de parede, queda de tensão é o problema central. Fita de 5 V exigiria injeção a cada 1,5 m; a de 12 V aceita 4–5 m. |
| **Linha de dados de backup** | O WS2815 tem uma segunda via de dados. Um LED queimado **não derruba o resto da trilha** — decisivo num painel fechado, onde trocar um trecho significa desmontar acabamento. |
| **60 LED/m** | Com difusor acrílico e a distância de leitura do corredor, 60/m já produz linha contínua. 144/m dobraria custo e potência sem ganho visível. |

Total instalado: **114,7 m** · **6.927 pixels** · 111 pontos de emenda.

## Potência

Quatro zonas de força de 3 m, uma fonte e um bloco de distribuição cada:

| Zona | Trecho | Painéis | Pixels | Fita | Pico teórico | Operacional (ABL 60%) |
|---|---|---|---|---|---|---|
| Z1 | 0 – 3 m | P1–P2 | 1.924 | 32,1 m | 481 W | 289 W |
| Z2 | 3 – 6 m | P3–P4 | 1.673 | 27,9 m | 418 W | 251 W |
| Z3 | 6 – 9 m | P5–P6 | 1.261 | 21,0 m | 315 W | 189 W |
| Z4 | 9 – 12 m | P7–P8 | 2.069 | 34,5 m | 517 W | 310 W |
| **Total** | | | **6.927** | **114,7 m** | **1.732 W** | **1.039 W** |

Consumo na rede em 220 V, no pico: **1.194 W → 5,4 A**.

### Duas travas independentes

- **Hardware:** fonte Mean Well **LRS-450-12** por zona (450 W / 37,5 A).
- **Software:** o ABL do engine estima a corrente de cada quadro e limita a
  **30 A (360 W) por zona** antes de enviar.

O pico teórico de Z4 (517 W) só aconteceria com todos os LEDs em branco pleno —
conteúdo que o projeto nunca gera, já que a paleta é ciano/petrol. Ainda assim,
o ABL garante que nenhuma fonte veja mais que 360 W: nenhuma passa de **70% de
carga** em operação. Isso compra vida útil e silêncio (a série LRS é resfriada
por convecção, sem ventilador).

Quando o quadro estoura o teto, o engine **escala o quadro inteiro** em vez de
cortar por zona. A cena fica 8% mais fraca por um instante; cortar por zona
produziria uma faixa de 3 m visivelmente "chapada" no meio da parede.

### Proteção e partida

- Circuito **exclusivo**, 220 V, disjuntor **curva C 16 A**.
  Curva B abre no ligamento: quatro fontes chaveadas em paralelo somam corrente
  de partida alta.
- Disjuntor DR (30 mA) e DPS classe II no quadro.
- Avaliar **partida escalonada** por relé de retardo (~150 ms entre fontes) se o
  quadro do prédio for sensível a inrush.

## Distribuição

| Trecho | Cabo |
|---|---|
| Fonte → bloco de distribuição | 4 mm² |
| Bloco → alimentação de cada trilha | 1,5 mm² silicone (18 AWG) |
| Injeção | nas duas pontas de toda trilha com mais de 2,5 m |
| Dados: controlador → primeiro pixel | 3 vias silicone 22 AWG, corridas < 3,6 m |
| Jumper de canto (111×) | 3 vias silicone 22 AWG + termorretrátil |

**Regra de terra — não negociável:** barramento de 0 V único interligando F1–F4,
CT‑1, CT‑2 e o engine. Sem isso, a linha de dados de um controlador flutua em
relação ao terra do pixel que ele comanda. O sintoma é piscada aleatória e
intermitente — o defeito mais caro de diagnosticar depois que o painel está
fechado.

## Controladores

Dois **ESP32 com Ethernet** (WT32‑ETH01 ou Olimex ESP32‑POE‑ISO), em quadro
metálico ventilado atrás dos painéis P3 e P7. Eles não decidem nada: são
receptores sACN que empurram bytes para a fita.

| | CT‑1 | CT‑2 |
|---|---|---|
| Posição | x ≈ 3,0 m (quadro QE‑1) | x ≈ 9,0 m (quadro QE‑2) |
| Saídas | 7 | 6 |
| Pixels | 3.707 | 3.220 |
| Cobre | zonas A e B + rodapé esquerdo | zonas C e D + rodapé direito + marca |

### Saídas de dados

13 saídas, a maior com **705 px**. Em WS2815 (800 kbps), 705 px consomem 21 ms
por quadro — teto de **47 fps** por saída. Operamos a 40 fps, com folga.

Cada saída leva **conversor de nível 74AHCT125** (3,3 V → 5 V) e resistor série
de 100 Ω. O ESP32 sozinho, em 3,3 V, fica no limite do que o WS2815 aceita como
nível alto: funciona na bancada e falha na parede.

## Engine

Raspberry Pi 4 (4 GB) ou mini‑PC fanless, em rack, rodando a máquina de estados,
a fusão dos radares e a saída **sACN / E1.31 unicast**, a 40 fps.

**Rede cabeada, não Wi‑Fi.** São 6.927 px × 3 B × 40 fps = 831 kB/s de dados,
que viram **1,2 MB/s no fio** com o cabeçalho sACN (48 universos × 638 B × 40 fps).
E a sincronia entre CT‑1 e CT‑2 precisa ser determinística: qualquer jitter
aparece como rasgo no pulso que atravessa os 12 m — exatamente o efeito que
sustenta a instalação. Switch gigabit de 8 portas no rack, Cat5e até cada
controlador.

### Mapa de universos

Cada saída começa num limite de universo — empacotar corrido economizaria alguns
universos e tornaria a conferência em obra um pesadelo.

| Saída | Controlador | Universos | Pixels |
|---|---|---|---|
| 0 | CT-1 | 1 – 4 | 545 |
| 1 | CT-1 | 5 – 8 | 576 |
| 2 | CT-1 | 9 – 12 | 650 |
| 3 | CT-1 | 13 – 16 | 554 |
| 4 | CT-1 | 17 – 20 | 552 |
| 5 | CT-1 | 21 – 23 | 469 |
| 6 | CT-2 | 24 – 27 | 664 |
| 7 | CT-2 | 28 – 32 | 705 |
| 8 | CT-2 | 33 – 36 | 569 |
| 9 | CT-2 | 37 – 40 | 630 |
| 10 | CT-1 | 41 – 43 | 361 (rodapé esq.) |
| 11 | CT-2 | 44 – 46 | 361 (rodapé dir.) |
| 12 | CT-2 | 47 – 48 | 291 (letreiro) |

### Custo computacional medido

O engine consome **0,56 ms por quadro** em desktop, e a pintura do buffer de
saída, 0,19 ms. Somados, 0,75 ms — **4,5% do orçamento de um quadro a 60 fps**.
Mesmo com o Pi 4 sendo várias vezes mais lento, sobra folga larga para os 40 fps
de projeto.

## Topologia

```
                    ┌──────────────────────┐
   radar A ─RS485───┤                      │
   (x=0,15 m)       │   ENGINE (RPi 4)     │
                    │   estados + fusão    │
   radar B ─RS485───┤   saída sACN 40 fps  │
   (x=11,85 m)      └──────────┬───────────┘
                               │ Ethernet
                        ┌──────┴──────┐
                        │   switch    │
                        └──┬───────┬──┘
                    ┌──────┴──┐ ┌──┴──────┐
                    │  CT-1   │ │  CT-2   │   ESP32 + Ethernet
                    │ 7 saídas│ │ 6 saídas│   74AHCT125 por saída
                    └──┬───┬──┘ └──┬───┬──┘
                      Z1  Z2      Z3  Z4      4 × LRS-450-12
                       └───┴───┬───┴───┘
                          0 V comum
```
