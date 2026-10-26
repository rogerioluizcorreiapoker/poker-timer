import { describe, it, expect } from 'vitest';
import pokersolver from 'pokersolver';
import { evaluate, CATEGORY_PT } from '../src/engine/evaluator.js';
import { equity } from '../src/engine/equity.js';
import { newDeck, shuffle } from '../src/engine/deck.js';

const { Hand } = pokersolver;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('evaluate', () => {
  it('reconhece cada categoria', () => {
    const cases = [
      [['As', 'Ks', 'Qs', 'Js', 'Ts', '2d', '3c'], 8],
      [['9h', '9d', '9s', '9c', '2d', '3c', 'Kd'], 7],
      [['9h', '9d', '9s', '2c', '2d', '3c', 'Kd'], 6],
      [['2h', '7h', '9h', 'Jh', 'Kh', '3c', 'Kd'], 5],
      [['5h', '6d', '7s', '8c', '9d', '3c', 'Kd'], 4],
      [['Ah', '2d', '3s', '4c', '5d', '9c', 'Kd'], 4],
      [['9h', '9d', '9s', '2c', '4d', '3c', 'Kd'], 3],
      [['9h', '9d', '4s', '2c', '4d', '3c', 'Kd'], 2],
      [['9h', '9d', '5s', '2c', '4d', '3c', 'Kd'], 1],
      [['9h', 'Jd', '5s', '2c', '4d', '3c', 'Kd'], 0],
    ];
    for (const [cards, cat] of cases) expect(evaluate(cards).category, cards.join(' ')).toBe(cat);
    expect(CATEGORY_PT[8]).toBe('Straight Flush');
  });

  it('a roda (A-5) perde para a sequência 6-alta e kickers desempatam', () => {
    const wheel = evaluate(['Ah', '2d', '3s', '4c', '5d', '9c', 'Kd']).score;
    const six = evaluate(['2h', '3d', '4s', '5c', '6d', '9c', 'Kd']).score;
    expect(six).toBeGreaterThan(wheel);
    const pairK = evaluate(['9h', '9d', '5s', '2c', '4d', '3c', 'Kd']).score;
    const pairA = evaluate(['9h', '9d', '5s', '2c', '4d', '3c', 'Ad']).score;
    expect(pairA).toBeGreaterThan(pairK);
  });

  it('concorda com o pokersolver em 3000 confrontos aleatórios', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 3000; i++) {
      const d = shuffle(newDeck(), rng);
      const board = d.slice(0, 5);
      const a = d.slice(5, 7);
      const b = d.slice(7, 9);
      const mine = Math.sign(evaluate(a.concat(board)).score - evaluate(b.concat(board)).score);
      const ha = Hand.solve(a.concat(board));
      const hb = Hand.solve(b.concat(board));
      const w = Hand.winners([ha, hb]);
      const theirs = w.length === 2 ? 0 : w[0] === ha ? 1 : -1;
      expect(mine, `${a} vs ${b} em ${board}`).toBe(theirs);
    }
  });
});

describe('equity', () => {
  it('AA contra 72o tem cerca de 87% no pré-flop', () => {
    const r = equity({ players: [{ id: 'a', cards: ['As', 'Ad'] }, { id: 'b', cards: ['7h', '2c'] }], samples: 4000, rng: mulberry32(1) });
    expect(r.a.equity).toBeGreaterThan(0.83);
    expect(r.a.equity).toBeLessThan(0.91);
    expect(r.a.equity + r.b.equity).toBeCloseTo(1, 5);
  });

  it('no turn o cálculo é exato: 9 copas + 3 ases + 3 reis = 15 outs em 44', () => {
    const r = equity({
      players: [{ id: 'a', cards: ['Ah', 'Kh'] }, { id: 'b', cards: ['Qc', 'Qd'] }],
      community: ['2h', '7h', '9s', '3c'],
    });
    expect(r.a.equity).toBeCloseTo(15 / 44, 5);
  });

  it('no turn, outs que dão full house ao oponente não contam: 7 em 44', () => {
    const r = equity({
      players: [{ id: 'a', cards: ['Ah', 'Kh'] }, { id: 'b', cards: ['9c', '9d'] }],
      community: ['2h', '7h', '9s', '3c'],
    });
    expect(r.a.equity).toBeCloseTo(7 / 44, 5);
  });

  it('contra oponentes desconhecidos a equity cai com mais gente', () => {
    const one = equity({ players: [{ id: 'a', cards: ['Ks', 'Kd'] }], unknown: 1, samples: 3000, rng: mulberry32(2) }).a.equity;
    const four = equity({ players: [{ id: 'a', cards: ['Ks', 'Kd'] }], unknown: 4, samples: 3000, rng: mulberry32(3) }).a.equity;
    expect(one).toBeGreaterThan(0.78);
    expect(four).toBeLessThan(one);
    expect(four).toBeGreaterThan(0.4);
  });

  it('é rápido o bastante para a mesa: 9 mãos, 1000 amostras, menos de 300 ms', () => {
    const d = shuffle(newDeck(), mulberry32(9));
    const players = Array.from({ length: 9 }, (_, i) => ({ id: 'p' + i, cards: d.slice(i * 2, i * 2 + 2) }));
    const t0 = performance.now();
    equity({ players, samples: 1000, rng: mulberry32(10) });
    expect(performance.now() - t0).toBeLessThan(300);
  });
});
