import { describe, it, expect } from 'vitest';
import { buildPots } from '../src/engine/pot.js';

describe('buildPots', () => {
  it('um pote simples quando todos apostam igual', () => {
    const pots = buildPots([
      { id: 'a', totalBet: 100, folded: false },
      { id: 'b', totalBet: 100, folded: false },
      { id: 'c', totalBet: 100, folded: false },
    ]);
    expect(pots).toEqual([{ amount: 300, eligible: ['a', 'b', 'c'] }]);
  });

  it('cria pote lateral quando alguém está all-in com menos', () => {
    const pots = buildPots([
      { id: 'a', totalBet: 50, folded: false },
      { id: 'b', totalBet: 200, folded: false },
      { id: 'c', totalBet: 200, folded: false },
    ]);
    expect(pots).toEqual([
      { amount: 150, eligible: ['a', 'b', 'c'] },
      { amount: 300, eligible: ['b', 'c'] },
    ]);
  });

  it('quem foldou contribui mas não concorre', () => {
    const pots = buildPots([
      { id: 'a', totalBet: 100, folded: true },
      { id: 'b', totalBet: 300, folded: false },
      { id: 'c', totalBet: 300, folded: false },
    ]);
    expect(pots).toEqual([{ amount: 700, eligible: ['b', 'c'] }]);
  });

  it('aposta não paga fica num pote só do apostador', () => {
    const pots = buildPots([
      { id: 'a', totalBet: 100, folded: false },
      { id: 'b', totalBet: 400, folded: false },
    ]);
    expect(pots).toEqual([
      { amount: 200, eligible: ['a', 'b'] },
      { amount: 300, eligible: ['b'] },
    ]);
  });

  it('fichas de quem foldou acima de todos os all-ins vão para o pote de baixo', () => {
    const pots = buildPots([
      { id: 'a', totalBet: 4244, folded: true },
      { id: 'b', totalBet: 4244, folded: true },
      { id: 'c', totalBet: 4190, folded: false },
      { id: 'd', totalBet: 2000, folded: false },
    ]);
    expect(pots).toEqual([
      { amount: 8000, eligible: ['c', 'd'] },
      { amount: 2190 * 3 + 54 * 2, eligible: ['c'] },
    ]);
    expect(pots.reduce((s, p) => s + p.amount, 0)).toBe(4244 * 2 + 4190 + 2000);
  });

  it('três all-ins de tamanhos diferentes geram três potes', () => {
    const pots = buildPots([
      { id: 'a', totalBet: 100, folded: false },
      { id: 'b', totalBet: 250, folded: false },
      { id: 'c', totalBet: 600, folded: false },
      { id: 'd', totalBet: 600, folded: false },
    ]);
    expect(pots).toEqual([
      { amount: 400, eligible: ['a', 'b', 'c', 'd'] },
      { amount: 450, eligible: ['b', 'c', 'd'] },
      { amount: 700, eligible: ['c', 'd'] },
    ]);
  });
});
