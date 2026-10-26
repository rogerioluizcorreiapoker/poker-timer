// Modo aprendiz: classifica a mão inicial, calcula pot odds e dá um veredito sobre cada jogada.
// Os números são estimativas (equity contra mãos aleatórias). O texto sempre diz isso.

const RANK_ORDER = '23456789TJQKA';

// Grupos de mãos iniciais (adaptado da tabela de Sklansky-Malmuth). 1 = melhor, 8 = pior jogável.
const GROUPS = {
  1: 'AA KK QQ JJ AKs',
  2: 'TT AQs AJs KQs AKo',
  3: '99 JTs QJs KJs ATs AQo',
  4: 'T9s KQo 88 QTs 98s J9s AJo KTs',
  5: '77 87s Q9s T8s KJo QJo JTo 76s 97s A9s A8s A7s A6s A5s A4s A3s A2s 65s',
  6: '66 ATo 55 86s KTo QTo 54s K9s J8s 75s',
  7: '44 J9o 64s T9o 53s 33 98o 43s 22 K8s K7s K6s K5s K4s K3s K2s T7s Q8s',
  8: '87o A9o Q9o 76o 42s 32s 96s 85s J8o J7s 65o 54o 74s K9o T8o',
};
const GROUP_OF = new Map();
for (const [g, list] of Object.entries(GROUPS)) for (const h of list.split(' ')) GROUP_OF.set(h, Number(g));

export const GROUP_LABEL = {
  1: 'Premium', 2: 'Muito forte', 3: 'Forte', 4: 'Boa', 5: 'Jogável', 6: 'Especulativa', 7: 'Fraca', 8: 'Muito fraca', 9: 'Para desistir',
};

const GROUP_ADVICE = {
  1: 'Suba de qualquer posição. Se alguém subir antes, suba de novo.',
  2: 'Suba de qualquer posição. Pague um re-raise com cuidado.',
  3: 'Suba se ninguém subiu antes. Pague um raise de quem está em posição.',
  4: 'Boa para subir em posição tardia ou pagar um raise pequeno.',
  5: 'Jogue barato, de preferência com vários na mão: busca flush, sequência ou trinca.',
  6: 'Só em posição tardia e sem ninguém ter subido. Desista se a aposta ficar cara.',
  7: 'Quase sempre desista. Em um pote sem raise e na última posição, dá para ver o flop.',
  8: 'Desista, a não ser que esteja no big blind sem ninguém subindo.',
  9: 'Desista. Mão sem valor: cartas baixas, sem par, sem naipe igual.',
};

export function handKey(cards) {
  const [a, b] = cards;
  const r1 = RANK_ORDER.indexOf(a[0]);
  const r2 = RANK_ORDER.indexOf(b[0]);
  const hi = r1 >= r2 ? a : b;
  const lo = r1 >= r2 ? b : a;
  if (hi[0] === lo[0]) return hi[0] + lo[0];
  return hi[0] + lo[0] + (hi[1] === lo[1] ? 's' : 'o');
}

export function classifyStartingHand(cards) {
  const key = handKey(cards);
  const group = GROUP_OF.get(key) ?? 9;
  const pretty = key.length === 2 ? `${key} (par)` : key.endsWith('s') ? `${key.slice(0, 2)} do mesmo naipe` : `${key.slice(0, 2)} de naipes diferentes`;
  return { key, group, label: GROUP_LABEL[group], advice: GROUP_ADVICE[group], pretty };
}

// Quanto de equity você precisa para pagar: toCall / (pote + toCall).
export function requiredEquity(toCall, pot) {
  if (toCall <= 0) return 0;
  return toCall / (pot + toCall);
}

const pct = (x) => `${Math.round(x * 100)}%`;

// Veredito de uma ação. Devolve { verdict: 'boa' | 'ok' | 'erro', title, text }.
export function assessAction({ stage, action, equity, toCall, pot, handClass, opponents, stack = 0 }) {
  const required = requiredEquity(toCall, pot);
  const type = action.type;

  if (stage === 'preflop') {
    const g = handClass.group;
    const strong = g <= 3;
    const playable = g <= 6;
    // Aposta enorme: pagar custa quase metade do pote (o pote já inclui o all-in) ou boa parte do seu stack.
    const huge = toCall >= pot * 0.45 || (stack > 0 && toCall >= stack * 0.4);
    const monster = ['AA', 'KK'].includes(handClass.key);
    if (type === 'fold' && huge) {
      if (monster) return v('erro', 'Desistiu com a melhor mão possível', `${handClass.key} é favorita contra qualquer mão. Mesmo diante de um all-in, pagar é obrigatório.`);
      if (strong) return v('ok', 'Desistiu diante de aposta enorme', `${handClass.key} é ${handClass.label.toLowerCase()}, mas a aposta era maior que o pote. Contra um all-in, só AA e KK são claramente favoritas. Desistir é defensável.`);
      return v('boa', 'Boa: não pagou aposta enorme', `Com ${handClass.key} e uma aposta maior que o pote, desistir é a jogada certa.`);
    }
    if ((type === 'call') && huge) {
      if (g <= 2) return v('boa', 'Pagou aposta enorme com mão forte', `${handClass.key} aguenta pagar um all-in. Vai ser moeda ou melhor na maioria dos confrontos.`);
      if (g === 3) return v('ok', 'Pagou aposta enorme no limite', `${handClass.key} é forte, mas contra um all-in costuma estar atrás de pares altos e AK. Jogada arriscada.`);
      return v('erro', 'Pagou aposta enorme com mão média', `${handClass.key} está no grupo ${g}. Pagar mais do que há no pote com essa mão é apostar tudo em sorte.`);
    }
    if (type === 'fold') {
      if (strong) return v('erro', 'Desistiu com mão forte', `${handClass.key} é uma mão ${handClass.label.toLowerCase()} (grupo ${g}). Vale pelo menos pagar, e quase sempre subir.`);
      if (playable && toCall <= pot * 0.5) return v('ok', 'Desistiu com mão jogável', `${handClass.key} dava para pagar barato e ver o flop. Desistir não é erro, mas perde valor.`);
      return v('boa', 'Boa: desistiu com mão fraca', `${handClass.key} está no grupo ${g}. Economizar fichas aqui é a jogada certa.`);
    }
    if (type === 'check') return v('boa', 'Check de graça', 'Ninguém subiu e você estava no big blind. Ver o flop sem pagar nada é sempre bom.');
    if (type === 'call') {
      if (strong && toCall <= pot) return v('ok', 'Pagou, mas podia subir', `${handClass.key} é ${handClass.label.toLowerCase()}. Subir tira adversários da mão e faz o pote crescer quando você é favorito.`);
      if (playable) return v('boa', 'Boa: pagou com mão jogável', `${handClass.key} vale ver o flop. ${handClass.advice}`);
      return v('erro', 'Pagou com mão fraca', `${handClass.key} está no grupo ${g}. Pagar aqui é dar fichas de graça na maioria das vezes.`);
    }
    if (type === 'raise' || type === 'allin') {
      if (strong) return v('boa', 'Boa: subiu com mão forte', `${handClass.key} é ${handClass.label.toLowerCase()}. Subir é exatamente o que ela pede.`);
      if (playable) return v('ok', type === 'allin' ? 'All-in ousado' : 'Subiu com mão média', `${handClass.key} é ${handClass.label.toLowerCase()}. Subir funciona como blefe ou para roubar os blinds, mas prepare-se para desistir se vier um re-raise.`);
      return v('ok', 'Blefe', `${handClass.key} não tem valor. Subir aqui é blefe puro: funciona de vez em quando, custa caro quando pagam.`);
    }
  }

  // pós-flop: equity estimada contra as mãos que ainda estão na jogada
  const e = equity ?? 0;
  const vsN = opponents === 1 ? '1 oponente' : `${opponents} oponentes`;
  if (type === 'fold') {
    if (e >= required + 0.15) return v('erro', 'Desistiu sendo favorito', `Você tinha ~${pct(e)} de chance contra ${vsN} e precisava de só ${pct(required)} para pagar. Era para continuar.`);
    if (e >= required) return v('ok', 'Desistiu no limite', `~${pct(e)} de chance contra ${pct(required)} necessários. Pagar era um pouco melhor, mas é discutível.`);
    return v('boa', 'Boa: desistiu sem chance suficiente', `~${pct(e)} de chance, e precisava de ${pct(required)} para o pagamento valer a pena.`);
  }
  if (type === 'check') {
    if (e >= 0.7) return v('ok', 'Check com mão forte', `~${pct(e)} de chance. Apostar aqui faria o pote crescer enquanto você é favorito.`);
    return v('boa', 'Check', 'Ver a próxima carta de graça com uma mão média é correto.');
  }
  if (type === 'call') {
    if (e >= required) return v('boa', 'Boa: pagou com chance suficiente', `~${pct(e)} de chance contra ${pct(required)} necessários. O pagamento é lucrativo no longo prazo.`);
    if (e >= required - 0.08) return v('ok', 'Pagou no limite', `~${pct(e)} de chance, precisava de ${pct(required)}. Quase empata; aceitável se você acha que ganha mais fichas quando acerta.`);
    return v('erro', 'Pagou caro', `~${pct(e)} de chance e precisava de ${pct(required)}. No longo prazo esse pagamento perde fichas.`);
  }
  if (type === 'raise' || type === 'allin') {
    if (e >= 0.6) return v('boa', 'Boa: apostou por valor', `~${pct(e)} de chance. Apostar com a melhor mão faz o pote crescer a seu favor.`);
    if (e >= 0.35) return v('ok', 'Semi-blefe', `~${pct(e)} de chance. Você pode ganhar se todos desistirem ou se melhorar a mão. Jogada legítima, com risco.`);
    return v('ok', 'Blefe', `~${pct(e)} de chance. Só funciona se os outros desistirem. Contra vários oponentes raramente dá certo.`);
  }
  return v('ok', 'Jogada', '');
}

function v(verdict, title, text) {
  return { verdict, title, text };
}
