// Probabilidade de vitória (equity) de cada mão dado o board atual.
//
// equity({ players: [{ id, cards }], community, unknown, samples, rng })
//   players  mãos conhecidas
//   unknown  quantos oponentes com cartas desconhecidas (aleatórias) entram na conta
// Devolve { [id]: { win, tie, equity } } com valores de 0 a 1, e 'unknown' agregando os desconhecidos.
// Quando faltam poucas cartas e não há desconhecidos, enumera todas as combinações (resultado exato).

import { newDeck } from './deck.js';
import { evaluate } from './evaluator.js';

export function equity({ players, community = [], unknown = 0, samples = 1000, rng = Math.random }) {
  const known = new Set([...community, ...players.flatMap((p) => p.cards)]);
  const deck = newDeck().filter((c) => !known.has(c));
  const toBoard = 5 - community.length;
  const need = toBoard + unknown * 2;
  const ids = [...players.map((p) => p.id), ...Array.from({ length: unknown }, (_, i) => `?${i}`)];
  const wins = Object.fromEntries(ids.map((id) => [id, 0]));
  const ties = Object.fromEntries(ids.map((id) => [id, 0]));
  let runs = 0;

  const scoreRound = (drawn) => {
    const board = community.concat(drawn.slice(0, toBoard));
    const scores = [];
    for (let i = 0; i < players.length; i++) scores.push(evaluate(players[i].cards.concat(board)).score);
    for (let u = 0; u < unknown; u++) {
      const hole = [drawn[toBoard + u * 2], drawn[toBoard + u * 2 + 1]];
      scores.push(evaluate(hole.concat(board)).score);
    }
    let best = -1;
    let count = 0;
    for (const s of scores) {
      if (s > best) { best = s; count = 1; } else if (s === best) count++;
    }
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] !== best) continue;
      if (count === 1) wins[ids[i]] += 1;
      else ties[ids[i]] += 1 / count;
    }
    runs++;
  };

  if (need === 0) {
    scoreRound([]);
  } else if (unknown === 0 && need <= 2) {
    // exato: todas as combinações das cartas que faltam
    if (need === 1) for (const a of deck) scoreRound([a]);
    else for (let i = 0; i < deck.length; i++) for (let j = i + 1; j < deck.length; j++) scoreRound([deck[i], deck[j]]);
  } else {
    const pool = deck.slice();
    for (let s = 0; s < samples; s++) {
      // embaralha só as primeiras `need` posições (Fisher-Yates parcial)
      for (let i = 0; i < need; i++) {
        const j = i + Math.floor(rng() * (pool.length - i));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      scoreRound(pool.slice(0, need));
    }
  }

  const out = {};
  for (const p of players) out[p.id] = { win: wins[p.id] / runs, tie: ties[p.id] / runs, equity: (wins[p.id] + ties[p.id]) / runs };
  if (unknown > 0) {
    let w = 0;
    let t = 0;
    for (let u = 0; u < unknown; u++) { w += wins[`?${u}`]; t += ties[`?${u}`]; }
    out.unknown = { win: w / runs, tie: t / runs, equity: (w + t) / runs };
  }
  return out;
}
