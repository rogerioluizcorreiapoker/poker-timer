import { newDeck } from '../src/engine/deck.js';

// Monta o baralho para a próxima mão na ordem em que será distribuído:
// cartas do jogador 1, do jogador 2, ..., depois flop (3), turn, river.
// O que faltar é preenchido com o resto do baralho.
export function rig(table, dealOrder) {
  const rest = newDeck().filter((c) => !dealOrder.includes(c));
  table.nextDeck = [...rest, ...dealOrder.slice().reverse()];
}

export function seat(table, specs) {
  for (const [id, stack] of specs) table.addPlayer({ id, name: id.toUpperCase(), stack });
}

export function stacks(table) {
  const out = {};
  for (const p of table.players.values()) out[p.id] = p.stack;
  return out;
}
