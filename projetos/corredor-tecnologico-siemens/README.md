# Corredor Tecnológico — Siemens

Instalação de luz cinética em corredor de **12,00 m**: uma parede que desenha um
circuito eletrônico em fita LED endereçável embutida, com peças de "componentes"
impressas em 3D, e que **reage à passagem das pessoas** — parada quando não há
ninguém, acompanhando quem caminha quando há.

> **Revisão 00 — proposta técnica.** Números de geometria, pixels e potência são
> calculados a partir do modelo (`sistema/`), não digitados à mão. Preços e
> prazos são estimativa de referência e precisam de cotação.

---

## Números do projeto

| | |
|---|---|
| Parede tratada | 12,00 m × 1,85 m de faixa gráfica (de +0,20 a +2,05 do piso) |
| Pixels endereçáveis | **6.927** |
| Fita instalada | **114,7 m** — WS2815 12 V, 60 LED/m |
| Trilhas / pontos de emenda | 43 trilhas · **111 emendas** |
| Saídas de dados | **13** (máx. 705 px por saída → teto de 47 fps) |
| Controladores | 2 × ESP32 com Ethernet, recebendo sACN |
| Fontes | 4 × 450 W / 12 V (uma por zona de 3 m) |
| Pico com ABL | 1.039 W · rede 220 V: 5,4 A |
| Repouso | ≈ 273 W |
| Sensores | 2 × radar mmWave LD2450 (posição, não só presença) |

## Como navegar

| Onde | O que é |
|---|---|
| [`docs/01-conceito-e-escopo.md`](docs/01-conceito-e-escopo.md) | O que a parede faz e por quê. Ponto de partida. |
| [`docs/02-eletrica-e-controle.md`](docs/02-eletrica-e-controle.md) | Fita, potência, zonas, controladores, rede, aterramento. |
| [`docs/03-sensoriamento-e-comportamento.md`](docs/03-sensoriamento-e-comportamento.md) | Radares, fusão, máquina de estados, ajuste fino. |
| [`docs/04-marcenaria-e-acabamento.md`](docs/04-marcenaria-e-acabamento.md) | Painéis, canaletas, peças impressas, pintura. |
| [`docs/05-lista-de-materiais.md`](docs/05-lista-de-materiais.md) | BOM completo com estimativa de custo. |
| [`docs/06-montagem-e-comissionamento.md`](docs/06-montagem-e-comissionamento.md) | Sequência de obra, cronograma, checklist de entrega. |
| [`docs/07-premissas-e-pendencias.md`](docs/07-premissas-e-pendencias.md) | O que assumimos e o que precisa de resposta do cliente. |
| [`docs/08-estrategia-comercial.md`](docs/08-estrategia-comercial.md) | **Uso interno.** Precificação, modalidades de entrega da tecnologia e negociação com o parceiro. Não enviar junto com a proposta. |

## O código é o projeto

A geometria e o comportamento não vivem num PDF: vivem em código, e todo
desenho e número sai dele.

```
sistema/layout.js      geometria mestre (mm) — trilhas, peças, marca, sensores
sistema/eletrica.js    topologia elétrica derivada da geometria
sistema/engine.js      motor de animação — máquina de estados e efeitos
ferramentas/           geradores: elevação técnica (SVG) e simulador (HTML)
firmware/              o que roda na parede
simulador/index.html   simulação para apresentação
proposta/index.html    proposta comercial dirigida ao parceiro integrador
marca/                 marca NexLayer3D nas versões clara e tinta
desenhos/              saída para marcenaria e obra
```

**O simulador executa o mesmo `engine.js` que roda na parede.** O que o cliente
aprovar na tela é literalmente o que vai instalado — não existe "na obra fica
diferente".

## Regerar os artefatos

```bash
cd projetos/corredor-tecnologico-siemens
node ferramentas/gerar-elevacao.js    # -> desenhos/elevacao-tecnica.svg
node ferramentas/build-simulador.js   # -> simulador/index.html
```

Sem dependências: Node puro. `layout.js` valida a própria geometria (regra
0°/90°/45°) e o build falha se algum marcador de injeção não for substituído.

## Vídeo de apresentação

```bash
node ferramentas/gerar-textura.js                    # -> desenhos/material.png
node ferramentas/render-video.js --mp4 base.mp4      # render 3D, ~6 min
node ferramentas/gerar-legendas.js                   # legendas + marca d'água
node ferramentas/montar-video.js base.mp4 final.mp4  # montagem, segundos
```

Câmera 3D percorrendo o corredor em quatro tomadas, com a parede rodando o
**mesmo `engine.js`** do simulador e da instalação. Raytracer de planos em JS
puro — sem dependência de motor gráfico.

A marca d'água sai de `ferramentas/marca-dagua.json`. Trocar o logo custa
segundos: só a montagem é refeita, o render não.

```bash
node ferramentas/render-video.js --em 14 > q.raw     # um quadro, para ajuste
```

## Orçamento (PDF de uma página)

```bash
node ferramentas/baixar-fontes.js     # 1x — embute as fontes do projeto
node ferramentas/build-orcamento.js   # -> orcamento/NexLayer3D-orcamento.pdf
```

Material e execução agrupados por **função**, não por componente: o documento
vai para um parceiro que subcontrata, então descreve o que cada bloco faz sem
entregar modelo de placa, arquitetura ou o caminho para refazer o sistema.

`sistema/orcamento.js` é a fonte do preço. Duas alavancas, e só elas:

```js
var MARGEM = { material: 0.15, servico: 0.45 };
var FITA   = { rolos: 26, precoRolo: 200 };
```

Margem baixa no material é deliberada: o parceiro trabalha com LED e sabe
quanto custa um rolo de fita. A margem mora na execução, que ele não tem como
comparar. O módulo **confere a soma contra `docs/05`** e o build **conta as
páginas do PDF** — se qualquer um dos dois divergir, o build falha em vez de
gerar documento errado.

O PDF do orçamento e a proposta puxam o preço do mesmo módulo, então não há
como sair valor diferente em cada um.
