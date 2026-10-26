import { describe, it, expect } from 'vitest';
import { classifyStartingHand, requiredEquity, assessAction, handKey } from '../src/learn/coach.js';

describe('coach', () => {
  it('classifica mãos iniciais', () => {
    expect(handKey(['Kd', 'As'])).toBe('AKo');
    expect(handKey(['Kd', 'Ad'])).toBe('AKs');
    expect(handKey(['7c', '7h'])).toBe('77');
    expect(classifyStartingHand(['As', 'Ad']).group).toBe(1);
    expect(classifyStartingHand(['As', 'Kd']).group).toBe(2);
    expect(classifyStartingHand(['7h', '2c']).group).toBe(9);
    expect(classifyStartingHand(['7h', '2c']).label).toBe('Para desistir');
  });

  it('pot odds: pagar 100 num pote de 300 exige 25%', () => {
    expect(requiredEquity(100, 300)).toBeCloseTo(0.25);
    expect(requiredEquity(0, 300)).toBe(0);
  });

  it('pré-flop: desistir com AA é erro, com 72o é bom', () => {
    const aa = classifyStartingHand(['As', 'Ad']);
    const junk = classifyStartingHand(['7h', '2c']);
    expect(assessAction({ stage: 'preflop', action: { type: 'fold' }, toCall: 200, pot: 300, handClass: aa, opponents: 2 }).verdict).toBe('erro');
    expect(assessAction({ stage: 'preflop', action: { type: 'fold' }, toCall: 200, pot: 300, handClass: junk, opponents: 2 }).verdict).toBe('boa');
    expect(assessAction({ stage: 'preflop', action: { type: 'raise' }, toCall: 200, pot: 300, handClass: aa, opponents: 2 }).verdict).toBe('boa');
    expect(assessAction({ stage: 'preflop', action: { type: 'call' }, toCall: 200, pot: 300, handClass: junk, opponents: 2 }).verdict).toBe('erro');
  });

  it('pré-flop diante de all-in enorme: AK pode desistir, AA não, 72o não paga', () => {
    const big = { stage: 'preflop', toCall: 19800, pot: 40200, opponents: 2, stack: 19800 };
    expect(assessAction({ ...big, action: { type: 'fold' }, handClass: classifyStartingHand(['As', 'Kd']) }).verdict).toBe('ok');
    expect(assessAction({ ...big, action: { type: 'fold' }, handClass: classifyStartingHand(['As', 'Ad']) }).verdict).toBe('erro');
    expect(assessAction({ ...big, action: { type: 'call' }, handClass: classifyStartingHand(['Qs', '4d']) }).verdict).toBe('erro');
    expect(assessAction({ ...big, action: { type: 'call' }, handClass: classifyStartingHand(['Ks', 'Kd']) }).verdict).toBe('boa');
  });

  it('pós-flop: compara equity com pot odds', () => {
    const base = { stage: 'flop', toCall: 100, pot: 300, handClass: classifyStartingHand(['9s', '8s']), opponents: 1 };
    expect(assessAction({ ...base, action: { type: 'fold' }, equity: 0.5 }).verdict).toBe('erro');
    expect(assessAction({ ...base, action: { type: 'fold' }, equity: 0.1 }).verdict).toBe('boa');
    expect(assessAction({ ...base, action: { type: 'call' }, equity: 0.4 }).verdict).toBe('boa');
    expect(assessAction({ ...base, action: { type: 'call' }, equity: 0.05 }).verdict).toBe('erro');
    expect(assessAction({ ...base, action: { type: 'raise' }, equity: 0.8 }).verdict).toBe('boa');
    expect(assessAction({ ...base, action: { type: 'allin' }, equity: 0.1 }).title).toBe('Blefe');
    const r = assessAction({ ...base, action: { type: 'call' }, equity: 0.4 });
    expect(r.text).toMatch(/40%/);
    expect(r.text).toMatch(/25%/);
  });
});
