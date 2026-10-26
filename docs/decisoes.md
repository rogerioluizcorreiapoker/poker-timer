# Decisões

Registro curto do porquê de cada escolha. Acrescente no fim; não apague o histórico.

## 2026-10-26 · Primeira versão jogável

- **JavaScript puro, sem TypeScript e sem bundler.** Zero etapa de build: `npm start` e pronto.
  Testes cobrem o que tipos cobririam no motor. Rever se o time crescer.
- **Socket.IO em vez de WebSocket cru.** Reconexão automática, salas e fallback por HTTP de graça.
  Importa porque celular apaga tela e cai do Wi-Fi o tempo todo.
- **Estado só na memória do servidor.** Sem banco. Uma mesa vive algumas horas; se o servidor cair,
  a noite recomeça com um QR novo. Persistência em arquivo é o próximo passo se isso incomodar.
- **`pokersolver` para comparar mãos.** Biblioteca madura; não vale a pena reescrever avaliação de mão.
- **Fichas virtuais para todos, inclusive presenciais.** Única forma de o remoto e o presencial
  jogarem o mesmo pote. Fichas físicas ficam de enfeite.
- **Primeiro a entrar é o anfitrião.** Sem login, sem senha. O anfitrião pode remover qualquer um.
- **All-in curto não reabre a ação.** Regra padrão de cassino. Quem já agiu só paga ou desiste.
- **Dinheiro morto acima do último all-in vai para o pote de baixo.** Caso raro encontrado pelo fuzz:
  todos que apostaram mais foldaram depois, sobrando só all-ins menores. Sem isso as fichas sumiam.
- **Tabela de blinds copiada do timer original.** Mesmos níveis, mesmo intervalo, para a experiência
  ser a que o grupo já conhece.

## 2026-10-26 · Modo aprendiz

- **Avaliador próprio para simulações.** O pokersolver é lento demais para milhares de amostras. O
  `evaluator.js` faz ~1 milhão de mãos por segundo. Teste de 3.000 confrontos garante que concordam.
- **Equity contra mãos aleatórias, não contra ranges.** É uma simplificação assumida e dita na tela.
  Modelar ranges de verdade é outro projeto; para ensinar pot odds, aleatório basta.
- **Grupos de Sklansky para o pré-flop.** Tabela conhecida, fácil de explicar ("grupo 2 de 9").
- **Veredito em três níveis (boa, ok, erro).** Mais granularidade vira falsa precisão.
- **Run-out com cartas abertas sempre, veredito só no modo aprendiz.** A emoção do all-in é para todos;
  a aula é opcional.

## Pendências conhecidas

- `server/src/engine/table.js` está com ~540 linhas, acima do teto de 350. Dividir em `betting.js` e `showdown.js` na próxima rodada, com os testes atuais como rede de segurança.
- Estado das mesas só em memória: se o servidor reiniciar, a noite recomeça.
