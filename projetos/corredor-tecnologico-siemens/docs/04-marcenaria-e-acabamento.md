# 04 — Marcenaria, acabamento e peças impressas

## Painéis

Oito módulos de **1.500 × 1.850 mm** em MDF 18 mm, instalados de +0,20 a
+2,05 m do piso acabado. A chapa brasileira padrão (2,75 × 1,85 m) rende
**um painel por chapa**, com sobra de 1,25 × 1,85 m aproveitada para bases de
componentes, gabaritos e espaçadores. Nove chapas no total (oito + uma reserva).

### Estrutura e fixação

- Montantes de perfil metálico (canaleta drywall) ou sarrafo de MDF criando
  **40 mm de plenum** atrás dos painéis: passagem de cabos, blocos de
  distribuição e fontes.
- Fixação por **cleat francês** (corte a 45° em réguas macho/fêmea).
  Cada painel desce sozinho, sem tocar nos vizinhos — indispensável para
  manutenção de trilha ou troca de fonte sem desmontar a parede inteira.
- Painéis ligados eletricamente por conector rápido, nunca por emenda soldada
  que atravesse a junta.

## Canaletas

| | |
|---|---|
| Sulco usinado | **14 mm largura × 14 mm profundidade** |
| Fita | 10 mm, colada no fundo com fita VHB dupla-face |
| Difusor | acrílico leitoso **14 × 5 mm**, embutido rente à superfície |
| Usinagem | CNC router, fresa reta de 14 mm — só 0°/90°/45°, ferramenta única |

O difusor rente é o que transforma pontos de LED em linha de luz contínua.
Difusor recuado cria sombra na borda do sulco; saliente vira aresta que suja e
pega poeira.

### Os 111 pontos de emenda

Fita LED **não dobra no plano**. Cada uma das 111 mudanças de direção vira:

1. corte da fita no fim do segmento reto;
2. furo passante Ø 6 mm no vértice, atravessando o painel;
3. jumper de 3 vias em cabo silicone 22 AWG **por trás do painel**;
4. termorretrátil em cada solda e identificação da trilha.

Levar o jumper por trás mantém a face limpa — nenhuma emenda aparente na
parede. É o item que mais consome mão de obra da montagem e está inteiro no
desenho de fabricação (círculos laranja em `desenhos/elevacao-tecnica.svg`).

> **Ordem de trabalho:** usinar → furar os 111 vértices → pintar → colar fita →
> soldar jumpers → **testar o painel na bancada** → só então instalar.
> Pintar depois da fita colada é retrabalho garantido.

## Acabamento

| Etapa | Especificação |
|---|---|
| Selagem | Fundo PU para MDF, 2 demãos, lixa 220 entre demãos |
| Base | Grafite acetinado, pistola, 2–3 demãos |
| Proteção | Verniz PU acetinado |
| Rodapé | Perfil de alumínio 12 m com difusor próprio |

**Reação ao fogo — item aberto.** MDF em circulação de edificação corporativa
normalmente exige acabamento com classificação de reação ao fogo compatível com
a instrução técnica do Corpo de Bombeiros do estado. As saídas são tinta
intumescente, verniz retardante certificado ou substituição do substrato por
ACM/placa mineral. **Precisa ser confirmado com a área de segurança do cliente
antes da compra do material** — muda substrato, tinta e custo. Está registrado
em `07-premissas-e-pendencias.md`.

## Peças impressas em 3D

17 peças: 1 processador, 5 circuitos integrados, 1 indutor, 3 capacitores,
6 componentes SMD e 1 conector de borda.

| Item | Especificação |
|---|---|
| Material | PETG (estabilidade térmica e dimensional superior ao PLA junto de LED) |
| Paredes | 3 perímetros, 15% de preenchimento — são cascas, não blocos maciços |
| Estimativa | ≈ 3,5 kg de filamento · 130–160 h de impressão |

### O processador (600 × 600 mm)

Não imprimir maciço. **Núcleo em MDF + capa impressa em 4 partes**, coladas e
com junta rebaixada. Reduz tempo de impressão em ~60%, elimina empenamento e
dá massa para a fixação. As mesmas 4 partes cabem em mesa de 250 mm.

### Acabamento das peças

1. Massa/primer filler em spray, 2 demãos
2. Lixa 320 → 400 (as camadas de impressão têm que sumir; peça com "listra" de
   camada denuncia impressão 3D a três metros de distância)
3. Base grafite escuro
4. **Dry-brush** prateado nas arestas e nos pinos — é o que dá leitura de metal
5. Verniz acetinado

### Fixação e halo

- Insertos roscados M4 a quente na peça; parafuso **por trás do painel**.
  Nenhum ponto de fixação visível na face.
- **Standoff de 3 mm** entre peça e painel: a canaleta de halo em volta
  retroilumina o contorno e a peça ganha volume no escuro. É o detalhe que
  separa "chip colado na parede" de "componente montado na placa".

## Letreiro

Letras em acrílico com retroiluminação dedicada (saída 13), permitindo pulso
sutil sincronizado com o comportamento da parede. A assinatura fica em vinil
recortado ou acrílico fino, sem iluminação própria.

**A arte é aplicada a partir do brand book oficial do cliente — não redesenhada.**
A zona de proteção de 300 mm em volta do letreiro está marcada no desenho e
nenhuma trilha a invade, por construção do layout.
