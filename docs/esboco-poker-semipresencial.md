# Esboço: Poker Semipresencial

Data: 2026-10-26
Estado: Fase 1 e Fase 2 implementadas (ver README.md). Este documento é o desenho original.

## 1. A ideia em uma frase

Uma mesa de Texas Hold'em onde a TV é o dealer e o board, os jogadores presentes
recebem as cartas no celular, e os jogadores remotos veem o board e jogam no
próprio celular. Todos jogam a mesma mão, ao mesmo tempo, contra o mesmo servidor.

## 2. Quem participa e o que cada um vê

| Papel | Dispositivo | O que mostra | O que faz |
|---|---|---|---|
| Board | TV (navegador em tela cheia) | Mesa, cartas comunitárias, pote, stacks, de quem é a vez, timer de blinds, QR code para entrar | Nada. Só exibe. Não tem controle. |
| Jogador presencial | Celular (navegador) | Só as duas cartas dele e os botões de ação (fold, check, call, raise) | Age na vez dele. Olha o board na TV. |
| Jogador remoto | Celular ou notebook | Board completo + as duas cartas dele + botões de ação | Age na vez dele. Vê tudo na tela. |
| Anfitrião | Celular (mesmo app, modo admin) | Tudo do jogador + painel de mesa | Cria a mesa, aprova entradas, pausa, ajusta blinds, expulsa. |

Presencial e remoto usam a **mesma página**. A única diferença é um botão
"estou na mesa" que esconde o board no celular para não duplicar a TV.
Quem está na mesa pode ligar o board no celular a qualquer momento se quiser.

## 3. Por que precisa de um servidor

Hoje o `index.html` roda sozinho na TV. Para o jogo isso não funciona, por três motivos:

1. **Segredo das cartas.** A TV não pode conhecer a mão de ninguém, senão qualquer
   um que olhar o código-fonte ou a rede vê as cartas dos outros. Quem embaralha e
   distribui tem que ser um servidor que só manda para cada celular as cartas dele.
2. **Jogador remoto.** Ele não está na mesma rede Wi-Fi. Precisa de um ponto na
   internet onde todos se conectam.
3. **Uma única verdade.** Pote, stacks, de quem é a vez, side pots. Se cada tela
   calcular por conta própria, elas desencontram. O servidor decide, as telas só mostram.

Então a arquitetura é: **servidor autoritativo + telas burras**.

```
                 ┌───────────────────────────┐
                 │   Servidor (Node.js)       │
                 │   - baralho e distribuição │
                 │   - regras e validação     │
                 │   - pote, stacks, side pot │
                 │   - timer de ação e blinds │
                 └──────┬──────┬──────┬───────┘
          WebSocket     │      │      │
        ┌───────────────┘      │      └───────────────┐
        ▼                      ▼                      ▼
   ┌─────────┐          ┌───────────┐          ┌─────────────┐
   │  TV     │          │ Celular   │          │ Celular     │
   │ (board) │          │ presencial│          │ remoto      │
   │ vê tudo │          │ só a mão  │          │ board + mão │
   │ público │          │ + botões  │          │ + botões    │
   └─────────┘          └───────────┘          └─────────────┘
```

O servidor manda para cada conexão só o que ela pode ver:

- Para a TV: estado público (cartas comunitárias, pote, stacks, ações, vez).
- Para cada jogador: estado público + as duas cartas dele.
- No showdown: as cartas de quem foi até o fim viram públicas.

## 4. Fluxo de uma noite de jogo

1. Anfitrião abre `tv.html` na TV. Aparece um QR code com o código da mesa.
2. Cada presencial escaneia o QR no celular, digita o nome, entra na mesa.
3. O amigo remoto recebe o link por WhatsApp, abre, digita o nome, entra.
4. Anfitrião define blinds iniciais, stack inicial e aperta "iniciar".
5. Servidor embaralha, distribui, cobra os blinds, marca de quem é a vez.
6. Na TV aparece "vez de Fulano" com um timer. No celular de Fulano acendem os botões.
7. Fulano age. Servidor valida, atualiza, avisa todo mundo.
8. Flop, turn, river, showdown. Servidor compara mãos, distribui o pote.
9. Nova mão. O timer de blinds (o `index.html` de hoje) sobe os níveis sozinho.

Se alguém perde a conexão (tela do celular apagou, 4G caiu), o servidor segura
a vaga dele. Ao reabrir a página ele volta no mesmo lugar, com as mesmas cartas.
Se não voltar dentro do tempo de ação, o servidor dá fold automático.

## 5. Tecnologia proposta

Critério: o mais simples que roda de verdade, e que o Claude Code consegue manter.

| Peça | Escolha | Por quê |
|---|---|---|
| Servidor | Node.js + TypeScript | Uma linguagem só no projeto inteiro. |
| Tempo real | Socket.IO | Reconexão automática, salas prontas, funciona atrás de qualquer Wi-Fi e 4G. |
| Motor de poker | Módulo próprio, puro, sem dependência de rede | Dá para testar cada regra sem subir servidor. |
| Avaliar mãos | Biblioteca `pokersolver` | Comparar mãos é chato de acertar na unha. Essa já é usada e testada. |
| Telas | HTML + CSS + JS puro, como o timer atual | Sem build, sem framework. Abre em qualquer TV, celular ou notebook. |
| Hospedagem | Fly.io ou Railway | Precisa de conexão WebSocket aberta por horas. Vercel e similares cortam. Plano grátis serve para uma mesa. |
| Banco de dados | Nenhum no início | O estado vive na memória do servidor. Histórico de mãos vai em arquivo JSON. Banco entra só quando quisermos ranking ou várias mesas. |

Uma alternativa a considerar depois é o **Colyseus**, um framework de servidor
de jogos em Node que já traz salas, sincronização de estado e reconexão. Ele
reduz código mas adiciona uma camada para aprender. Para a primeira versão,
Socket.IO direto é mais fácil de depurar.

## 6. Estrutura do repositório

```
poker-timer/
├── CLAUDE.md                 regras para o agente (o que é, como testar, o que não quebrar)
├── docs/
│   ├── esboco-poker-semipresencial.md   este arquivo
│   ├── regras-do-jogo.md                regras que o servidor implementa, com exemplos
│   └── decisoes.md                      por que escolhemos cada coisa
├── server/
│   ├── src/
│   │   ├── engine/           motor de poker puro: baralho, mesa, apostas, side pots, showdown
│   │   ├── rooms/            uma sala por mesa, conecta engine ao Socket.IO
│   │   ├── blinds/           estrutura de níveis, reaproveitado do timer atual
│   │   └── index.ts          sobe o servidor e serve as páginas de public/
│   └── test/                 testes do motor, sem rede
├── public/
│   ├── tv.html               board para a TV
│   ├── player.html           celular (presencial e remoto, mesmo arquivo)
│   ├── timer.html            o index.html de hoje, mantido como está
│   └── shared/               CSS e JS comuns
└── package.json
```

O `index.html` de hoje não é jogado fora. Ele vira a parte de blinds do board
e continua funcionando sozinho para quem só quer o timer.

## 7. Fases, do mais simples ao completo

Cada fase termina com algo que dá para jogar de verdade.

### Fase 1: Mesa presencial (2 a 3 semanas de trabalho com agente)

- Servidor com uma mesa só, Hold'em cash game, sem torneio.
- TV mostra board, celulares mostram mão e botões.
- Entrada por QR code. Reconexão. Fold automático por tempo.
- Motor de poker com testes: distribuição, ordem de ação, call, raise, all-in,
  side pots, showdown, empate.
- Roda no Fly.io. Já dá para jogar entre amigos na sala.

**Critério de pronto:** uma mesa de 6 pessoas joga 30 mãos seguidas sem o
anfitrião precisar intervir e sem o pote fechar errado.

### Fase 2: Jogador remoto (1 semana)

- Modo "estou longe": board aparece no celular.
- Link de convite que funciona fora do Wi-Fi.
- Indicador de conexão no board ("Fulano caiu, 20s para voltar").
- Som de "sua vez" no celular, porque o remoto não ouve a mesa.

**Critério de pronto:** um amigo em outra cidade joga uma sessão inteira.

### Fase 3: Torneio (1 semana)

- Integra o timer de blinds atual ao servidor. Os níveis sobem sozinhos.
- Eliminação, rebuy, add-on, intervalo.
- Tabela de posição final na TV.

### Fase 4: Acabamento (contínuo)

- Animações de cartas e fichas na TV.
- Histórico de mãos exportável.
- Estatísticas por jogador.
- Várias mesas ao mesmo tempo.

## 8. Problemas conhecidos e como tratar

| Problema | Tratamento |
|---|---|
| Navegador de Smart TV é fraco | Não depender dele. Ligar um notebook, Chromecast ou Fire Stick por HDMI. A página é leve de propósito. |
| Tela do celular apaga e desconecta | Usar a Wake Lock API para manter a tela acesa durante a sessão. Reconexão automática do Socket.IO cobre o resto. |
| Remoto com lag | Timer de ação de 30s, generoso. O servidor é quem conta o tempo, não o celular. |
| Presencial espiando o celular do vizinho | Problema social, não técnico. Mesmo risco das cartas físicas. |
| Remotos combinando por fora | Idem. É jogo entre amigos, não dinheiro real. Não vale construir anti-trapaça. |
| Servidor cai no meio da mão | Salvar o estado da mesa em arquivo a cada ação. Ao reiniciar, retoma. |
| Vários torneios, ranking, dinheiro | Fora de escopo até a Fase 4. Dinheiro real exige licença e não é o objetivo. |

## 9. Como o Vibe Coding Toolkit entra aqui

O toolkit não constrói o jogo. Ele organiza como o agente trabalha nele.
As partes que aproveitamos:

- **`CLAUDE.md`** com as regras da casa: o motor de poker é puro e testado,
  o servidor é a única verdade, as telas não calculam nada, ninguém mexe
  em `timer.html` sem pedir.
- **Tarefas pequenas por fase**, cada uma com os arquivos que pode tocar e o
  teste que prova que terminou. Exemplo: "implementar side pot" só toca
  `server/src/engine/pot.ts` e `server/test/pot.test.ts`.
- **Evidência antes de "pronto".** Nenhuma fase fecha sem `npm test` verde e
  uma sessão jogada de verdade.
- **Teto de linhas por arquivo.** O motor vai crescer. Separar por
  responsabilidade (baralho, apostas, pote, showdown) desde o início evita
  um arquivo de 2000 linhas que ninguém entende.
- **Docs de decisão.** Cada escolha da seção 5 ganha uma entrada em
  `docs/decisoes.md` com o motivo e o que foi descartado.

## 10. Próximo passo concreto

Começar a Fase 1 pelo motor de poker, sem servidor e sem tela:

1. Criar `server/` com TypeScript e Vitest.
2. Implementar baralho, distribuição e uma rodada de apostas, com testes.
3. Só depois ligar Socket.IO e fazer a TV e o celular.

Motivo: o motor é a parte mais fácil de errar e a mais fácil de testar.
Tela bonita em cima de regra errada não serve.
