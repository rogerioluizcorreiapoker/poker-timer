import { describe, it, expect } from 'vitest';
import { newDeck, shuffle } from '../src/engine/deck.js';

describe('deck', () => {
  it('tem 52 cartas únicas', () => {
    const d = newDeck();
    expect(d).toHaveLength(52);
    expect(new Set(d).size).toBe(52);
    expect(d).toContain('As');
    expect(d).toContain('2c');
  });

  it('embaralhar preserva as cartas e não altera o original', () => {
    const d = newDeck();
    let i = 0;
    const s = shuffle(d, () => ((i += 7) % 13) / 13);
    expect(s).toHaveLength(52);
    expect([...s].sort()).toEqual([...d].sort());
    expect(d[0]).toBe('2s');
  });
});
