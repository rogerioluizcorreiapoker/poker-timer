# Poker Semipresencial

Jogo de Texas Hold'em onde a TV é o dealer e o board, os jogadores presentes recebem as cartas
no celular, e quem está longe vê o board e joga no próprio celular. Tudo em português do Brasil.

## Como rodar

```
npm install
npm start          # http://localhost:3000 (o terminal mostra o IP da rede para a TV)
npm test           # vitest: motor, potes, sala e fuzz
npm run dev        # reinicia sozinho ao salvar
```

## Arquitetura (não mudar sem motivo)

- **O servidor é a única verdade.** `server/src/engine/table.js` decide tudo: baralho, vez, apostas,
  potes, showdown. As telas só exibem e mandam intenções. Nunca calcule regra de poker no cliente.
- **O motor é puro.** Sem rede, sem timers, sem `Date.now()`. Recebe `rng` injetável. Por isso é testável.
- **`server/src/rooms/room.js`** liga o motor ao tempo real: timer de ação, relógio de blinds,
  troca automática de mão, reconexão por token. Timers e relógio são injetáveis (ver `room.test.js`).
- **`server/src/index.js`** só faz Socket.IO e HTTP. Eventos documentados no topo do arquivo.
- **Cada tela recebe só o que pode ver.** `publicState()` para a TV, `privateState(id)` com as cartas
  do jogador. As cartas dos outros só aparecem no `lastResult.revealed` do showdown.
- **Front sem build.** HTML + CSS + JS puro em `public/`. Socket.IO client vem do próprio servidor.
  Não adicionar framework nem bundler.
- **`index.html` na raiz é o timer de blinds original.** Servido em `/timer`. Não alterar sem pedir.
  A tabela de níveis dele foi copiada para `server/src/blinds/levels.js`.

## Regras do trabalho

- Toda mudança no motor vem com teste em `server/test/`. `npm test` tem que passar antes de qualquer commit.
- O teste de fuzz (`fuzz.test.js`) precisa continuar verde: fichas nunca aparecem nem somem.
- Arquivos acima de 350 linhas devem ser divididos por responsabilidade.
- Textos visíveis ao usuário em português do Brasil, sem jargão em inglês quando houver termo usual
  (fold = desistir, call = pagar, raise = subir; all-in, check, flop, turn, river ficam como estão).
- Nada de dinheiro real, cadastro ou pagamento. É jogo entre amigos.

## Mapa

```
server/src/engine/   deck.js, pot.js, hand-rank.js (pokersolver), table.js
server/src/blinds/   levels.js (tabela do torneio)
server/src/rooms/    room.js (sala = mesa + timers + relógio)
server/src/index.js  servidor HTTP + Socket.IO
server/test/         vitest
public/              index.html (início), tv.html (board), player.html (celular), shared/
docs/                esboço, decisões
```
