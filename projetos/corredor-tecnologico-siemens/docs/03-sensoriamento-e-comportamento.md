# 03 — Sensoriamento e comportamento

## Os sensores

Dois radares **mmWave LD2450**, um em cada extremidade, montados a 1,60 m do
piso e apontados ao longo do eixo do corredor.

| | |
|---|---|
| Saída | posição (X, Y) de até **3 alvos simultâneos**, via UART 256000 bps |
| Alcance útil | ~6 m por unidade → os dois cobrem os 12 m com sobreposição no centro |
| Ligação | RS485 (MAX3485) sobre Cat5e dedicado até o rack, um cabo por sensor |
| Latência | < 80 ms da detecção ao primeiro quadro que reage |

### Por que radar e não PIR ou barreira óptica

- **PIR** responde sim/não, é lento e tem histerese alta. Com ele, o melhor que
  se consegue é acender o corredor inteiro — a luz não pode acompanhar ninguém.
- **Barreira óptica** dá o instante da passagem e a direção, mas não a posição
  contínua. Serve como gatilho, não como rastreamento.
- **mmWave** devolve coordenada contínua, atravessa acabamento não metálico
  (fica escondido atrás de janela de PETG), não é câmera e portanto **não capta
  imagem** — ponto relevante para aprovação de privacidade em ambiente
  corporativo.

### Cuidados de instalação

- Janela de **PETG de 2 mm** na peça impressa que abriga o sensor. Não usar
  chapa metálica nem tinta com pigmento metálico sobre a janela: carga metálica
  bloqueia 24 GHz e o sensor simplesmente para de enxergar.
- Não apontar para porta de vidro em movimento nem para ventilador/ar-condicionado
  no eixo de visada — geram alvos fantasma.
### A zona cega da soleira

Varrendo a cobertura dos dois radares ao longo dos 12 m, sobra um furo nas duas
pontas: o LD2450 tem distância mínima de detecção (~0,30 m) e campo de visão de
±60°, então **os primeiros ~45 cm de cada entrada não são vistos** pelo radar
daquele lado — e estão longe demais para o radar oposto.

Na prática, alguém entrando a 1,3 m/s cruza esses 45 cm em 0,35 s: sem
tratamento, o despertar da parede sai atrasado justamente no instante em que a
pessoa cruza a soleira, que é o momento mais importante do efeito.

Por isso o **par de barreira IR em cada entrada não é opcional**: ele dá o
gatilho instantâneo na soleira, e o radar assume o rastreamento a partir de
~0,5 m. Como bônus, a barreira mantém a parede reagindo enquanto a calibração
do radar ainda está em ajuste, e serve de referência para conferir a fusão
durante o comissionamento.

## Fusão dos dois sensores

Cada radar reporta no seu próprio referencial. O engine converte para uma
coordenada única do corredor (0 → 12000 mm):

```
sensor A (x=150,   sentido +1):  x_corredor = 150   + y_alvo
sensor B (x=11850, sentido -1):  x_corredor = 11850 - y_alvo
```

Na faixa de sobreposição (≈ 5 a 7 m) o mesmo alvo aparece nos dois. A fusão
mantém um único alvo, ponderando pela distância — quanto mais perto do sensor,
mais confiável a leitura — e casa alvos entre quadros por proximidade, para que
o `id` da pessoa não troque no meio do corredor (troca de id faria a luz
"pular").

## Máquina de estados

```
                     alguém entra
      REPOUSO  ──────────────────────►  DESPERTAR
         ▲                                   │ frente varre os 12 m
         │ decaimento concluído              ▼
    ADORMECER  ◄──── corredor vazio ───  ACOMPANHAR ◄──┐
         │             por 12 s              │         │ voltou a andar
         │ alguém reentra                    │ parou   │
         └──────► DESPERTAR              PERMANÊNCIA ──┘
```

| Estado | O que acontece | Entra quando |
|---|---|---|
| **Repouso** | Trilhas em 7,5%, respiro lento, 1 pacote a cada ~3 s. | Ninguém detectado e decaimento concluído. |
| **Despertar** | Frente de luz parte da entrada usada a 6,5 m/s e energiza as trilhas. Cada peça impressa acende na ordem em que a frente passa, com cintilar de partida. | Primeira detecção. |
| **Acompanhar** | Halo segue a posição do radar, 70 cm à frente. A velocidade dos pacotes acompanha a velocidade da caminhada. | Frente terminou de varrer. |
| **Permanência** | Pacotes convergem para o processador central; a assinatura pulsa devagar. | Velocidade < 0,25 m/s por mais de 2,2 s. |
| **Adormecer** | A energia extra escoa do centro para as pontas. O piso de repouso **não** é drenado. | 12 s sem ninguém. |
| **Modo evento** | Coreografia manual de ~90 s para visitas e inaugurações, independente dos sensores. | Acionamento pelo painel. |

### Duas decisões de comportamento que vale defender

**O piso de repouso nunca escoa.** Na primeira versão, o adormecer drenava tudo
até o preto e o retorno ao repouso reacendia de uma vez — um "pop" de 160 W
visível como piscada. Separar o piso (que nunca escoa) da energia reativa (que
escoa) resolveu: hoje o maior degrau entre quadros consecutivos na saída do
adormecer é de 0,8 W, imperceptível.

**A frente de onda deixa rastro com memória.** Quando a frente sai do corredor,
ela não pode simplesmente sumir: some junto com ela ~200 W de trilha energizada,
e a parede pisca na passagem para o modo acompanhar. O rastro decai em ~0,7 s
depois que a frente sai.

Ambos os casos foram encontrados medindo a potência quadro a quadro na
simulação, antes de existir uma parede para piscar.

## Parâmetros de ajuste fino

Todos em `sistema/engine.js → PADRAO`, alteráveis sem recompilar nada:

| Parâmetro | Padrão | Efeito |
|---|---|---|
| `nivelRepouso` | 0,075 | Brilho de standby. Principal alavanca de consumo. |
| `velocidadeOnda` | 6.500 mm/s | Velocidade da frente de despertar. |
| `raioPessoa` | 1.500 mm | Largura do halo que segue a pessoa. |
| `avancoPessoa` | 700 mm | Quanto o halo vai à frente de quem caminha. |
| `tempoParaVazio` | 12 s | Espera antes de adormecer. |
| `tempoParaParado` | 2,2 s | Imobilidade até entrar em permanência. |
| `pacotesPorSegundo` | 26 | Densidade de dados nas trilhas. |
| `brilhoMestre` | 1,0 | Multiplicador da agenda de funcionamento. |

O ajuste final é feito **no local, com o corredor em uso** — parâmetro que
funciona na bancada costuma parecer exagerado na parede real.

## Agenda de funcionamento

O repouso, não a animação, é o maior custo de energia: são ≈ 273 W ligados o dia
inteiro, contra picos de ~1.000 W que duram segundos. A agenda proposta:

| Faixa | `brilhoMestre` | Consumo aprox. |
|---|---|---|
| 07:00 – 20:00 (comercial) | 1,00 | 273 W em repouso |
| 20:00 – 23:00 (limpeza/ronda) | 0,45 | ≈ 137 W |
| 23:00 – 07:00 | 0,12 | ≈ 29 W |

Com essa agenda, o consumo mensal cai de ≈ 197 kWh para ≈ 126 kWh (queda de 36%). A parede
continua reagindo à passagem em qualquer faixa — o que muda é o teto de brilho.
