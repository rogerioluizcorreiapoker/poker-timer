# 05 — Lista de materiais

> **Quantidades** saem do modelo (`sistema/layout.js` e `sistema/eletrica.js`) e
> são firmes. **Preços** são faixa de referência para dimensionar a proposta e
> **precisam de cotação** — fita endereçável e fontes Mean Well variam com
> câmbio e importação. Valores em BRL, custo direto, sem margem/BDI.

## Eletrônica e luz

| Item | Qtd | Obs. | Custo estim. |
|---|---|---|---|
| Fita WS2815 12 V, 60 LED/m, IP30 | 26 rolos de 5 m | 114,7 m de trilha + 3,9 m de perda de corte + 5,7 m de sobra de rolo + 5 m de reserva. A R$ 200/rolo | 5.200 |
| Fonte Mean Well LRS-450-12 | 4 | uma por zona de 3 m | 1.600 – 2.200 |
| Controlador ESP32 + Ethernet (WT32-ETH01) | 2 | + 1 reserva recomendada | 400 – 700 |
| Placa de saída: 74AHCT125, bornes, fusível, resistores | 2 | 13 saídas no total | 500 – 800 |
| Raspberry Pi 4 (4 GB) + SSD + fonte + case | 1 | engine | 900 – 1.400 |
| Switch gigabit 8 portas + patch cords | 1 | | 300 – 500 |
| Radar mmWave LD2450 | 2 | + 1 reserva | 300 – 500 |
| Transceptor RS485 (MAX3485) + placa | 2 | ligação dos radares | 150 – 300 |
| Barreira IR (par) | 2 | cobre a zona cega da soleira — necessária | 300 – 600 |

## Quadro e cabeamento

| Item | Qtd | Obs. | Custo estim. |
|---|---|---|---|
| Quadro metálico ventilado + trilho DIN | 2 | QE-1 e QE-2 | 700 – 1.200 |
| Disjuntor curva C 16 A + DR 30 mA + DPS II | 1 cj | circuito exclusivo | 500 – 900 |
| Cabo 4 mm² (fonte → distribuição) | 40 m | | 400 – 700 |
| Cabo silicone 1,5 mm² (alimentação de trilha) | 180 m | | 600 – 1.000 |
| Cabo silicone 3 vias 22 AWG (dados e jumpers) | 220 m | 111 jumpers + saídas | 700 – 1.200 |
| Cat5e + conectores | 60 m | sensores e controladores | 200 – 400 |
| Bornes, conectores rápidos, termorretrátil, solda, VHB | 1 cj | | 900 – 1.500 |

## Marcenaria e acabamento

| Item | Qtd | Obs. | Custo estim. |
|---|---|---|---|
| MDF 18 mm (2,75 × 1,85 m) | 9 chapas | 8 painéis + reserva | 3.200 – 4.500 |
| Usinagem CNC das canaletas + 111 furos | 1 serviço | 114,7 m de sulco | 3.500 – 5.500 |
| Perfil metálico/sarrafo da estrutura + cleat | 1 cj | plenum de 40 mm | 900 – 1.500 |
| Difusor acrílico leitoso 14 × 5 mm | 120 m | | 2.000 – 3.200 |
| Perfil de alumínio do rodapé + difusor | 12 m | | 700 – 1.200 |
| Acrílico do letreiro + aplicação da marca | 1 cj | arte oficial do cliente | 1.200 – 2.500 |
| Tinta: fundo PU, grafite, verniz, insumos | 1 cj | ver item de reação ao fogo | 1.800 – 3.000 |
| Filamento PETG + acabamento das peças | 3,5 kg | primer, lixa, prata, verniz | 900 – 1.600 |

## Mão de obra e serviços

| Item | Qtd | Obs. | Custo estim. |
|---|---|---|---|
| Projeto executivo e detalhamento | — | inclui simulação para aprovação | 5.000 – 8.000 |
| Marcenaria: montagem e acabamento | — | | 6.000 – 9.000 |
| Impressão 3D: 130–160 h de máquina | — | | 2.000 – 3.500 |
| Montagem elétrica e 111 emendas | — | maior item de mão de obra | 5.000 – 8.000 |
| Instalação no local | — | | 4.000 – 6.000 |
| Programação, comissionamento e ajuste fino | — | 2 visitas de ajuste incluídas | 6.000 – 9.000 |

## Totais

| | Piso | Teto |
|---|---|---|
| Materiais | 27.850 | 42.100 |
| Mão de obra e serviços | 28.000 | 43.500 |
| **Custo direto** | **55.850** | **85.600** |

**Não incluso:** margem/BDI, impostos, frete de importação, andaimes ou
plataforma elevatória, taxas de acesso à edificação, ART, obra civil, ponto de
energia até o quadro.

## Itens que mais movem o orçamento

1. **Fita LED (26 rolos)** — a R$ 200 o rolo de 5 m, dá R$ 5.200. Comprar de
   uma vez: lote diferente pode ter tom levemente diferente, e a diferença
   aparece numa parede de 12 m contínua.
   **Atenção ao tipo:** R$ 200/rolo é preço de fita endereçável comum de 5 V.
   A de 12 V com linha de dados de backup — que o projeto especifica em
   `docs/02` — costuma custar mais. A de 5 V exige injeção de energia a cada
   1,5 m em vez de 4 a 5 m, o que devolve parte da economia em cabo e mão de
   obra, e um LED queimado apaga o resto da trilha. Confirmar qual está
   cotada antes de fechar.
2. **Usinagem CNC + 111 emendas** — o custo do desenho ser denso. Reduzir o
   número de cantos reduz mão de obra direta; vale revisar se houver aperto.
3. **Reação ao fogo do MDF** — item aberto que pode empurrar o substrato para
   ACM ou placa mineral, mexendo em marcenaria, tinta e prazo.
