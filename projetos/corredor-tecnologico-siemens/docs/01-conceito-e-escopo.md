# 01 — Conceito e escopo

## A ideia em uma frase

O corredor deixa de ser passagem e vira demonstração: a parede desenha um
circuito eletrônico que só se energiza quando alguém passa, e a energia
**acompanha a pessoa** ao longo dos 12 metros.

## Por que não é "parede de LED com efeito"

Três decisões separam isso de uma fita LED com animação genérica:

**1. A parede tem repouso, não tem "desligado".**
Corredor vazio não significa parede apagada. As trilhas ficam em 7,5% de brilho,
com um respiro lento e um pacote de dados solitário a cada três segundos. O
espaço continua vivo mesmo sem público — e a chegada de alguém tem para onde
crescer. Uma parede que acende do preto dá susto; uma que já respira, acolhe.

**2. Os sensores devolvem posição, não presença.**
Sensor de presença comum responde sim/não, e o melhor que se faz com isso é
acender o corredor inteiro. Os radares mmWave nas duas pontas devolvem a
**coordenada** de até três pessoas. É isso que permite a luz andar junto com
quem caminha, e que a onda de despertar sempre nasça na entrada que foi usada.

**3. A luz vai à frente, não atrás.**
O halo fica deliberadamente 70 cm adiante de quem caminha, no sentido do
movimento. A parede convida em vez de perseguir. Detalhe pequeno no código,
diferença grande na sensação.

## Composição da parede

Quatro zonas, lidas da entrada A (0 m) para a entrada B (12 m):

| Zona | Trecho | Papel |
|---|---|---|
| **A — Barramento de entrada** | 0 – 3,40 m | Feixe de trilhas paralelas descendo em degraus de 45°. É o "cabeçote": onde a energia entra. |
| **B — Núcleo / CPU** | 3,40 – 6,28 m | Processador de 600 × 600 mm impresso em 3D, dentro de anel octogonal, com trilhas irradiando nos quatro sentidos. Ponto focal. |
| **C — Marca** | 6,28 – 8,98 m | Faixa central limpa. Trilhas só passam acima de 1,40 m e abaixo de 0,54 m — a zona de proteção da marca não é invadida. |
| **D — Malha de dados** | 8,98 – 12,00 m | Densidade alta, componentes menores, trilhas finas que se dissolvem no fim do corredor. |

Atravessando tudo, o **rodapé luminoso**: uma linha contínua a +0,08 m do piso,
o único elemento que percorre os 12 m sem interrupção. É a âncora visual e o
elemento que dá escala ao corredor inteiro.

## Regra geométrica

Todo segmento é horizontal, vertical ou diagonal de **45° exatos**. Isso não é
capricho estético — resolve três coisas de uma vez:

- **estética**: é a linguagem real de placa de circuito;
- **usinagem**: uma ferramenta só, sem interpolação complexa na CNC;
- **fita LED**: fita não dobra no plano. Toda mudança de direção já vira,
  por projeto, um corte com jumper por trás do painel. São **111 pontos** —
  o principal item de mão de obra da montagem, e estão todos marcados no
  desenho de fabricação.

A regra é verificada em código (`layout.js → validarGeometria()`), então não
existe a possibilidade de um ângulo quebrado escapar para a marcenaria.

## Escopo incluído

- Projeto executivo, elevação técnica e lista de materiais
- Painéis em MDF usinados, pintados e instalados
- Peças de componentes impressas em 3D, acabadas e pintadas
- Fita LED endereçável, difusores, fontes, quadros e cabeamento
- Controladores, engine de animação e sensores
- Programação do comportamento, comissionamento e ajuste fino no local
- Simulação para aprovação prévia do cliente

## Escopo não incluído

- Obra civil, alvenaria, forro e piso
- Ponto de energia até o quadro do corredor (entregue pelo cliente)
- Andaimes, plataforma elevatória e taxas de acesso ao prédio
- ART/projeto elétrico assinado, se exigido pela edificação
- Arte oficial da marca (fornecida pelo cliente a partir do brand book)
- Manutenção após o período de garantia
