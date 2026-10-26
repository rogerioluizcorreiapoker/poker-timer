// Utilidades compartilhadas entre TV e celular.

export const SUIT_SYMBOL = { s: '♠', h: '♥', d: '♦', c: '♣' };

export function cardEl(card, { hidden = false, placeholder = false } = {}) {
  const el = document.createElement('div');
  el.className = 'card';
  if (placeholder) {
    el.classList.add('placeholder');
    return el;
  }
  if (hidden || !card) {
    el.classList.add('back');
    return el;
  }
  const rank = card[0] === 'T' ? '10' : card[0];
  const suit = card[1];
  if (suit === 'h' || suit === 'd') el.classList.add('red');
  el.innerHTML = `<span class="rank">${rank}</span><span class="suit">${SUIT_SYMBOL[suit]}</span>`;
  return el;
}

export function fmt(n) {
  return new Intl.NumberFormat('pt-BR').format(Math.round(n ?? 0));
}

export function fmtShort(n) {
  if (n >= 1000) {
    if (n % 1000 === 0) return n / 1000 + 'k';
    return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  }
  return String(n);
}

export function fmtMMSS(sec) {
  sec = Math.max(0, Math.ceil(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const STAGE_PT = {
  waiting: 'Aguardando',
  preflop: 'Pré-flop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
  showdown: 'Showdown',
  finished: 'Fim da mão',
};

export const ACTION_PT = {
  fold: 'Desistiu',
  check: 'Check',
  call: 'Pagou',
  raise: 'Subiu',
  'all-in': 'ALL-IN',
};

let toastTimer = null;
export function toast(text, kind = 'info', ms = 3000) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.className = `show ${kind}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = ''), ms);
}

// Diferença entre o relógio do servidor e o do cliente, para contagens regressivas.
let skew = 0;
export function syncClock(serverNow) {
  if (serverNow) skew = serverNow - Date.now();
}
export function serverNow() {
  return Date.now() + skew;
}

export function blindsText(blinds) {
  if (!blinds) return '';
  return `${fmtShort(blinds.sb)}/${fmtShort(blinds.bb)}${blinds.bbAnte ? ' + ante' : ''}`;
}
