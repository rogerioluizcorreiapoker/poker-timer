// Cálculo de potes principais e laterais a partir do total apostado por cada jogador na mão.
//
// Entrada: lista de { id, totalBet, folded }.
// Saída: lista de potes { amount, eligible: [ids] }, do principal para o último lateral.
// Quem foldou contribui com fichas mas não concorre. Um pote cuja única pessoa elegível
// é quem apostou a mais representa a aposta não paga, que volta para ela.

export function buildPots(contributions) {
  const levels = [...new Set(contributions.filter((c) => c.totalBet > 0).map((c) => c.totalBet))].sort(
    (a, b) => a - b
  );
  const pots = [];
  let previous = 0;
  for (const level of levels) {
    let amount = 0;
    const eligible = [];
    for (const c of contributions) {
      const slice = Math.min(c.totalBet, level) - Math.min(c.totalBet, previous);
      amount += slice;
      if (!c.folded && c.totalBet >= level) eligible.push(c.id);
    }
    previous = level;
    if (amount === 0) continue;
    const last = pots[pots.length - 1];
    if (eligible.length === 0) {
      // Só quem foldou chegou a este nível (os outros estavam all-in com menos). Dinheiro morto: vai para o pote de baixo.
      if (last) last.amount += amount;
      else pots.push({ amount, eligible: contributions.filter((c) => !c.folded).map((c) => c.id) });
    } else if (last && sameSet(last.eligible, eligible)) {
      last.amount += amount;
    } else {
      pots.push({ amount, eligible });
    }
  }
  return pots;
}

function sameSet(a, b) {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((x) => set.has(x));
}
