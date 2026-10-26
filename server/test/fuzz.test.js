import { describe, it, expect } from 'vitest';
import { Table } from '../src/engine/table.js';

// Jogo aleatório com semente fixa: nenhuma ficha pode aparecer ou sumir, e o motor nunca pode travar.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('fuzz do motor', () => {
  it('conserva fichas e nunca trava em 400 mesas aleatórias', { timeout: 60000 }, () => {
    for (let seed = 1; seed <= 400; seed++) {
      const rng = mulberry32(seed);
      const t = new Table({ rng, blinds: { sb: 100, bb: 200, bbAnte: seed % 3 === 0 } });
      const n = 2 + Math.floor(rng() * 8);
      for (let i = 0; i < n; i++) t.addPlayer({ id: 'p' + i, name: 'P' + i, stack: 300 + Math.floor(rng() * 20) * 500 });
      let total = [...t.players.values()].reduce((a, p) => a + p.stack, 0);
      for (let hand = 0; hand < 20 && t.canStartHand(); hand++) {
        t.startHand();
        let guard = 0;
        while (t.handInProgress()) {
          expect(guard++, `seed ${seed} travou`).toBeLessThan(300);
          const cur = t.currentPlayer();
          expect(cur, `seed ${seed} sem jogador atual`).toBeTruthy();
          const l = t.legalActions(cur.id);
          const r = rng();
          if (r < 0.25) t.act(cur.id, { type: 'fold' });
          else if (r < 0.65) t.act(cur.id, { type: l.check ? 'check' : 'call' });
          else if (r < 0.97 && l.raise) t.act(cur.id, { type: 'raise', amount: Math.min(l.raise.max, l.raise.min + Math.floor(rng() * l.raise.min * 3)) });
          else t.act(cur.id, { type: 'allin' });
        }
        const now = [...t.players.values()].reduce((a, p) => a + p.stack, 0);
        expect(now, `seed ${seed} mão ${hand}: fichas mudaram`).toBe(total);
        for (const p of t.players.values()) if (p.stack === 0) { p.stack = 2000; total += 2000; }
      }
    }
  });
});
