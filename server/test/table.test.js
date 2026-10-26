import { describe, it, expect } from 'vitest';
import { Table } from '../src/engine/table.js';
import { rig, seat, stacks } from './helpers.js';

function table(specs, blinds = { sb: 50, bb: 100 }) {
  const t = new Table({ blinds });
  seat(t, specs);
  return t;
}

describe('início da mão', () => {
  it('distribui duas cartas, posta blinds e começa na posição certa com 3 jogadores', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    expect(t.stage).toBe('preflop');
    expect(t.dealerSeat).toBe(0);
    expect(t.sbSeat).toBe(1);
    expect(t.bbSeat).toBe(2);
    expect(t.player('b').bet).toBe(50);
    expect(t.player('c').bet).toBe(100);
    expect(t.currentPlayer().id).toBe('a'); // depois do BB
    for (const p of t.players.values()) expect(p.cards).toHaveLength(2);
    expect(t.totalPot()).toBe(150);
  });

  it('heads-up: dealer é o small blind e age primeiro no pré-flop', () => {
    const t = table([['a', 1000], ['b', 1000]]);
    t.startHand();
    expect(t.dealerSeat).toBe(0);
    expect(t.sbSeat).toBe(0);
    expect(t.bbSeat).toBe(1);
    expect(t.currentPlayer().id).toBe('a');
    t.act('a', { type: 'call' });
    t.act('b', { type: 'check' });
    expect(t.stage).toBe('flop');
    expect(t.currentPlayer().id).toBe('b'); // pós-flop, quem não é dealer age primeiro
  });

  it('o dealer gira a cada mão', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    expect(t.dealerSeat).toBe(0);
    t.act('a', { type: 'fold' });
    t.act('b', { type: 'fold' });
    t.startHand();
    expect(t.dealerSeat).toBe(1);
  });

  it('não começa com menos de dois jogadores com fichas', () => {
    const t = table([['a', 1000], ['b', 0]]);
    expect(t.canStartHand()).toBe(false);
    expect(() => t.startHand()).toThrow();
  });

  it('BB ante vai para o pote sem contar como aposta da rodada', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]], { sb: 50, bb: 100, bbAnte: true });
    t.startHand();
    expect(t.player('c').stack).toBe(800);
    expect(t.player('c').bet).toBe(100);
    expect(t.totalPot()).toBe(250);
  });
});

describe('ações', () => {
  it('rejeita agir fora da vez e check com aposta pendente', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    expect(() => t.act('b', { type: 'call' })).toThrow(/vez/);
    expect(() => t.act('a', { type: 'check' })).toThrow(/check/);
  });

  it('legalActions informa call, raise mínimo e máximo', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    expect(t.legalActions('a')).toEqual({ fold: true, check: false, call: 100, raise: { min: 200, max: 1000 }, allIn: 1000 });
    expect(t.legalActions('b')).toBeNull();
  });

  it('raise exige o mínimo e reabre a ação', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    expect(() => t.act('a', { type: 'raise', amount: 150 })).toThrow(/entre/);
    t.act('a', { type: 'raise', amount: 300 });
    expect(t.minRaise).toBe(200);
    t.act('b', { type: 'call' });
    t.act('c', { type: 'raise', amount: 500 }); // re-raise de 200, o mínimo
    expect(t.currentPlayer().id).toBe('a');
    t.act('a', { type: 'call' });
    t.act('b', { type: 'call' });
    expect(t.stage).toBe('flop');
    expect(t.totalPot()).toBe(1500);
  });

  it('todos foldando, o último leva o pote sem showdown', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    t.act('a', { type: 'raise', amount: 300 });
    t.act('b', { type: 'fold' });
    t.act('c', { type: 'fold' });
    expect(t.stage).toBe('finished');
    expect(t.lastResult.type).toBe('fold');
    expect(t.lastResult.winners[0]).toMatchObject({ playerId: 'a', amount: 450 });
    expect(stacks(t)).toEqual({ a: 1150, b: 950, c: 900 });
    expect(t.lastResult.revealed).toEqual({});
  });

  it('timeout dá check quando possível, senão fold', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    expect(t.timeoutAction('a')).toBe('fold');
    expect(t.timeoutAction('b')).toBe('fold');
    expect(t.stage).toBe('finished');
  });

  it('passa pelas quatro ruas com checks e chega ao showdown', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    t.act('a', { type: 'call' });
    t.act('b', { type: 'call' });
    t.act('c', { type: 'check' });
    for (const stage of ['flop', 'turn', 'river']) {
      expect(t.stage).toBe(stage);
      expect(t.currentPlayer().id).toBe('b');
      t.act('b', { type: 'check' });
      t.act('c', { type: 'check' });
      t.act('a', { type: 'check' });
    }
    expect(t.stage).toBe('finished');
    expect(t.lastResult.type).toBe('showdown');
    expect(t.community).toHaveLength(5);
  });
});

describe('showdown e potes', () => {
  it('a melhor mão leva e as cartas são reveladas', () => {
    const t = table([['a', 1000], ['b', 1000]]);
    rig(t, ['As', 'Ad', '7c', '2d', 'Ah', 'Kd', '9s', '3c', '5h']);
    t.startHand();
    t.act('a', { type: 'call' });
    t.act('b', { type: 'check' });
    for (let i = 0; i < 3; i++) {
      t.act('b', { type: 'check' });
      t.act('a', { type: 'check' });
    }
    expect(t.lastResult.winners).toEqual([{ playerId: 'a', amount: 200, handName: 'Trinca' }]);
    expect(t.lastResult.revealed.a.cards).toEqual(['As', 'Ad']);
    expect(t.lastResult.revealed.b.cards).toEqual(['7c', '2d']);
    expect(stacks(t)).toEqual({ a: 1100, b: 900 });
  });

  it('empate divide o pote', () => {
    const t = table([['a', 1000], ['b', 1000]]);
    rig(t, ['2s', '3d', '2c', '3h', 'Ah', 'Kd', 'Qs', 'Jc', 'Th']); // sequência no board para os dois
    t.startHand();
    t.act('a', { type: 'call' });
    t.act('b', { type: 'check' });
    for (let i = 0; i < 3; i++) {
      t.act('b', { type: 'check' });
      t.act('a', { type: 'check' });
    }
    expect(stacks(t)).toEqual({ a: 1000, b: 1000 });
    expect(t.lastResult.winners).toHaveLength(2);
  });

  it('all-in curto: pote principal para o curto, pote lateral para o segundo', () => {
    const t = table([['a', 300], ['b', 1000], ['c', 1000]]);
    // a: AA (melhor), b: KK, c: 72
    rig(t, ['As', 'Ad', 'Ks', 'Kd', '7c', '2d', '9h', '5s', '3c', 'Jd', '8h']);
    t.startHand();
    t.act('a', { type: 'allin' }); // 300
    t.act('b', { type: 'raise', amount: 800 });
    t.act('c', { type: 'call' });
    // a está all-in, b e c sem mais ação pendente: board corre até o river? Não: b e c ainda podem apostar no flop.
    expect(t.stage).toBe('flop');
    t.act('b', { type: 'check' });
    t.act('c', { type: 'check' });
    t.act('b', { type: 'check' });
    t.act('c', { type: 'check' });
    t.act('b', { type: 'check' });
    t.act('c', { type: 'check' });
    expect(t.stage).toBe('finished');
    // principal: 300*3 = 900 para a. lateral: 500*2 = 1000 para b.
    expect(stacks(t)).toEqual({ a: 900, b: 1200, c: 200 });
    expect(t.lastResult.pots).toEqual([
      { amount: 900, winners: ['a'], handName: 'Par' },
      { amount: 1000, winners: ['b'], handName: 'Par' },
    ]);
  });

  it('quando todos estão all-in o board corre sozinho até o showdown', () => {
    const t = table([['a', 500], ['b', 500]]);
    t.startHand();
    t.act('a', { type: 'allin' });
    t.act('b', { type: 'call' });
    expect(t.stage).toBe('finished');
    expect(t.community).toHaveLength(5);
    const s = stacks(t);
    expect(s.a + s.b).toBe(1000);
  });

  it('aposta não paga volta para quem apostou', () => {
    const t = table([['a', 200], ['b', 1000], ['c', 1000]]);
    rig(t, ['2s', '3d', 'Ks', 'Kd', '7c', '2d', '9h', '5s', 'Ac', 'Jd', '8h']);
    t.startHand();
    t.act('a', { type: 'allin' }); // 200
    t.act('b', { type: 'raise', amount: 1000 }); // all-in
    t.act('c', { type: 'fold' });
    expect(t.stage).toBe('finished');
    // a perde o principal (200*2 + 100 do c = 500) para b; os 800 extras voltam para b.
    expect(stacks(t)).toEqual({ a: 0, b: 1300, c: 900 });
  });

  it('all-in curto acima da aposta obriga os outros a pagar a diferença sem poder subir', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 350]]);
    t.startHand(); // dealer a, sb b(50), bb c(100)
    t.act('a', { type: 'raise', amount: 300 });
    t.act('b', { type: 'call' });
    t.act('c', { type: 'allin' }); // 350: raise de 50, abaixo do mínimo de 200
    expect(t.stage).toBe('preflop');
    expect(t.currentPlayer().id).toBe('a');
    expect(t.legalActions('a')).toMatchObject({ call: 50, raise: null });
    t.act('a', { type: 'call' });
    expect(t.legalActions('b')).toMatchObject({ call: 50, raise: null });
    t.act('b', { type: 'call' });
    expect(t.stage).toBe('flop');
    expect(t.totalPot()).toBe(1050);
  });
});

describe('entrada e saída de jogadores', () => {
  it('quem entra durante a mão só joga a próxima', () => {
    const t = table([['a', 1000], ['b', 1000]]);
    t.startHand();
    t.addPlayer({ id: 'c', name: 'C', stack: 1000 });
    expect(t.player('c').inHand).toBe(false);
    t.act('a', { type: 'fold' });
    t.startHand();
    expect(t.player('c').inHand).toBe(true);
  });

  it('quem sai durante a mão deixa as fichas no pote e some ao fim', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    t.act('a', { type: 'raise', amount: 300 });
    t.act('b', { type: 'call' });
    t.removePlayer('b');
    expect(t.players.has('b')).toBe(true);
    expect(t.player('b').folded).toBe(true);
    expect(t.currentPlayer().id).toBe('c');
    t.act('c', { type: 'fold' });
    expect(t.lastResult.winners[0]).toMatchObject({ playerId: 'a', amount: 700 });
    expect(t.players.has('b')).toBe(false);
  });

  it('remover o jogador da vez passa a vez adiante', () => {
    const t = table([['a', 1000], ['b', 1000], ['c', 1000]]);
    t.startHand();
    t.removePlayer('a');
    expect(t.currentPlayer().id).toBe('b');
  });

  it('jogador sem fichas fica de fora da próxima mão', () => {
    const t = table([['a', 500], ['b', 500], ['c', 2000]]);
    rig(t, ['As', 'Ad', 'Ks', 'Kd', '7c', '2d', '9h', '5s', '3c', 'Jd', '8h']);
    t.startHand();
    t.act('a', { type: 'allin' });
    t.act('b', { type: 'allin' });
    t.act('c', { type: 'call' });
    expect(t.stage).toBe('finished');
    expect(stacks(t)).toEqual({ a: 1500, b: 0, c: 1500 });
    t.startHand();
    expect(t.player('b').inHand).toBe(false);
    expect(t.player('a').inHand).toBe(true);
  });
});

describe('visões', () => {
  it('estado público não expõe cartas antes do showdown; privado mostra só as próprias', () => {
    const t = table([['a', 1000], ['b', 1000]]);
    t.startHand();
    const pub = t.publicState();
    for (const p of pub.players) expect(p.cards).toBeNull();
    expect(t.privateState('a').cards).toHaveLength(2);
    expect(t.privateState('a').legalActions).not.toBeNull();
    expect(t.privateState('b').legalActions).toBeNull();
  });
});
