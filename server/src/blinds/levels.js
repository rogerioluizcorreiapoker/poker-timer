// Estrutura de blinds do torneio. Mesma tabela do timer original (index.html na raiz).
// Cada item é um nível ou um intervalo. `dur` em segundos.

export const DEFAULT_SCHEDULE = [
  { type: 'level', level: 1, sb: 100, bb: 200, dur: 15 * 60 },
  { type: 'level', level: 2, sb: 200, bb: 400, dur: 15 * 60 },
  { type: 'level', level: 3, sb: 300, bb: 600, dur: 15 * 60 },
  { type: 'level', level: 4, sb: 500, bb: 1000, dur: 15 * 60 },
  { type: 'level', level: 5, sb: 700, bb: 1500, dur: 15 * 60 },
  { type: 'level', level: 6, sb: 1000, bb: 2000, dur: 15 * 60 },
  { type: 'break', label: 'INTERVALO', dur: 30 * 60 },
  { type: 'level', level: 7, sb: 1500, bb: 3000, dur: 17 * 60 },
  { type: 'level', level: 8, sb: 2000, bb: 4000, dur: 17 * 60 },
  { type: 'level', level: 9, sb: 2500, bb: 5000, dur: 17 * 60 },
  { type: 'level', level: 10, sb: 3000, bb: 6000, dur: 17 * 60 },
  { type: 'level', level: 11, sb: 4000, bb: 8000, dur: 17 * 60 },
  { type: 'level', level: 12, sb: 5000, bb: 10000, dur: 17 * 60 },
  { type: 'level', level: 13, sb: 7500, bb: 15000, dur: 17 * 60 },
  { type: 'level', level: 14, sb: 10000, bb: 20000, dur: 17 * 60 },
  { type: 'level', level: 15, sb: 12000, bb: 24000, dur: 20 * 60 },
  { type: 'level', level: 16, sb: 15000, bb: 30000, dur: 20 * 60 },
  { type: 'level', level: 17, sb: 20000, bb: 40000, dur: 20 * 60 },
  { type: 'level', level: 18, sb: 30000, bb: 60000, dur: 20 * 60 },
  { type: 'level', level: 19, sb: 40000, bb: 80000, dur: 20 * 60 },
  { type: 'level', level: 20, sb: 50000, bb: 100000, dur: 20 * 60 },
  { type: 'level', level: 21, sb: 70000, bb: 140000, dur: 25 * 60 },
  { type: 'level', level: 22, sb: 100000, bb: 200000, dur: 25 * 60 },
  { type: 'level', level: 23, sb: 150000, bb: 300000, dur: 25 * 60 },
  { type: 'level', level: 24, sb: 200000, bb: 400000, dur: 25 * 60 },
  { type: 'level', level: 25, sb: 250000, bb: 500000, dur: 25 * 60 },
];

// `levelMinutes` > 0 troca a duração de todos os níveis (o intervalo fica como está).
export function buildSchedule(levelMinutes = 0, base = DEFAULT_SCHEDULE) {
  if (!levelMinutes) return base;
  return base.map((item) => (item.type === 'level' ? { ...item, dur: levelMinutes * 60 } : item));
}

export function cumulativeBefore(schedule, index) {
  let total = 0;
  for (let i = 0; i < index; i++) total += schedule[i].dur;
  return total;
}

// Dado o tempo decorrido em segundos, devolve o item atual e quanto falta nele.
export function stateAt(schedule, elapsed) {
  let acc = 0;
  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    if (elapsed < acc + item.dur) {
      return { index: i, item, elapsedInItem: elapsed - acc, remaining: item.dur - (elapsed - acc), done: false };
    }
    acc += item.dur;
  }
  const last = schedule[schedule.length - 1];
  return { index: schedule.length - 1, item: last, elapsedInItem: last.dur, remaining: 0, done: true };
}

export function nextLevel(schedule, index) {
  for (let j = index + 1; j < schedule.length; j++) if (schedule[j].type === 'level') return schedule[j];
  return null;
}
