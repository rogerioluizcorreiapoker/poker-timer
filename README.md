# Poker Semipresencial

A TV é o dealer. Os jogadores presentes recebem as cartas no celular. Quem está longe vê o board e
joga no próprio celular. Texas Hold'em, modo torneio (blinds sobem com o tempo) ou cash game.

## Rodar em casa (TV + celulares no mesmo Wi-Fi)

Precisa de um computador com [Node.js](https://nodejs.org) 20 ou mais novo ligado na TV por HDMI
(ou um Chromecast/Fire Stick abrindo o endereço do computador).

```
git clone https://github.com/rogerioluizcorreiapoker/poker-timer.git
cd poker-timer
npm install
npm start
```

O terminal mostra algo como:

```
Poker semipresencial no ar.
  Neste computador: http://localhost:3000
  Na rede da casa (abra este na TV): http://192.168.0.10:3000/tv
```

1. Abra na TV o endereço com o IP (`http://192.168.0.10:3000/tv`). Aperte **F** para tela cheia.
2. Aparece um QR code e um código de 4 letras. Cada jogador aponta a câmera do celular para o QR
   (ou abre `http://192.168.0.10:3000` e digita o código), coloca o nome e entra.
3. O **primeiro a entrar é o anfitrião**. No celular dele, o botão ⚙ abre o menu com **Iniciar**,
   pausar, configuração (stack, blinds, segundos por ação, modo) e a lista de jogadores (dar fichas, remover).
4. A TV mostra o board, o pote, de quem é a vez e o relógio dos blinds. O celular mostra só as suas
   cartas e os botões: **Desistir**, **Pagar/Check**, **Subir**, **All-in**. Vibra e apita na sua vez.

Se alguém derrubar a conexão ou a tela apagar, basta reabrir a página: o jogador volta no mesmo lugar,
com as mesmas cartas. Se não voltar a tempo, o servidor dá fold automático. Depois de 3 timeouts seguidos
o jogador senta fora e volta pelo menu.

## Jogador remoto (fora de casa)

Quem está longe precisa alcançar o servidor pela internet. Dois caminhos:

### Opção A: servidor na nuvem (recomendado)

Suba o projeto no [Railway](https://railway.app) ou [Fly.io](https://fly.io). Os dois leem o `Dockerfile`
deste repositório. No Fly:

```
flyctl launch --no-deploy     # aceita o fly.toml do repositório
flyctl deploy
```

Depois todo mundo, inclusive a TV, usa o endereço público (`https://seu-app.fly.dev/tv`).
Se o endereço público for diferente do que a TV abre, defina a variável `PUBLIC_URL` no servidor
(`PUBLIC_URL=https://seu-app.fly.dev`) para o QR code apontar para ele.

### Opção B: túnel a partir do computador de casa

Com o servidor rodando em casa:

```
npx cloudflared tunnel --url http://localhost:3000
```

O comando imprime um endereço `https://....trycloudflare.com`. Reinicie o servidor com
`PUBLIC_URL=https://....trycloudflare.com npm start` para o QR da TV usar esse endereço, e mande o link
`https://....trycloudflare.com/j/CODIGO` para o amigo remoto. No celular dele, o botão **Ver mesa**
mostra o board completo.

## Configuração

No menu ⚙ do anfitrião:

| Campo | O que faz |
|---|---|
| Modo | Torneio: blinds sobem pela tabela de níveis (a mesma do timer original). Cash: blinds fixos. |
| Stack inicial | Fichas de cada um ao entrar. Só vale antes de iniciar. |
| Small / Big blind | Usados no modo cash. |
| Ante do BB | O big blind paga um ante igual ao BB a cada mão. |
| Segundos por ação | Tempo para agir. Padrão 30. |
| Minutos por nível | 0 usa a tabela (15/17/20/25 min). Outro valor iguala todos os níveis. |

Durante o torneio o anfitrião pode avançar ou voltar nível. O intervalo da tabela pausa a distribuição
de mãos sozinho.

## Desenvolvimento

```
npm test         # testes do motor, dos potes, da sala e fuzz de 400 mesas aleatórias
npm run dev      # reinicia ao salvar
```

Leia `CLAUDE.md` para a arquitetura e as regras. O esboço do produto está em
`docs/esboco-poker-semipresencial.md`.

O timer de blinds original continua disponível sozinho em `/timer`.
