// Baralho de 52 cartas. Carta = rank + naipe, no formato que o pokersolver entende: 'As', 'Td', '9h', '2c'.

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const SUITS = ['s', 'h', 'd', 'c'];

export function newDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) deck.push(rank + suit);
  }
  return deck;
}

// Fisher-Yates com gerador injetável, para os testes serem determinísticos.
export function shuffle(deck, rng = Math.random) {
  const cards = deck.slice();
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function shuffledDeck(rng = Math.random) {
  return shuffle(newDeck(), rng);
}
