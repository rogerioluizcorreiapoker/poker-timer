// Fina camada sobre o pokersolver: dado hole cards + board, devolve a melhor mão e compara.
import pokersolver from 'pokersolver';

const { Hand } = pokersolver;

const NAMES_PT = {
  'Royal Flush': 'Royal Flush',
  'Straight Flush': 'Straight Flush',
  'Four of a Kind': 'Quadra',
  'Full House': 'Full House',
  Flush: 'Flush',
  Straight: 'Sequência',
  'Three of a Kind': 'Trinca',
  'Two Pair': 'Dois Pares',
  Pair: 'Par',
  'High Card': 'Carta Alta',
};

export function evaluate(holeCards, community) {
  const hand = Hand.solve([...holeCards, ...community]);
  return { hand, name: NAMES_PT[hand.name] ?? hand.name, descr: hand.descr };
}

// Recebe [{ id, cards }], devolve os ids vencedores (empate = mais de um) e o nome da mão.
export function pickWinners(entries, community) {
  const solved = entries.map((e) => {
    const { hand, name } = evaluate(e.cards, community);
    hand.playerId = e.id;
    return { id: e.id, hand, name };
  });
  const winning = Hand.winners(solved.map((s) => s.hand));
  const winnerIds = new Set(winning.map((h) => h.playerId));
  const winners = solved.filter((s) => winnerIds.has(s.id));
  return { winnerIds: winners.map((w) => w.id), handName: winners[0]?.name ?? '' , ranked: solved };
}
