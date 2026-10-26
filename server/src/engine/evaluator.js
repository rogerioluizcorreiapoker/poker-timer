// Avaliador rápido de 5 a 7 cartas. Usado nas simulações de probabilidade (milhares por segundo).
// O showdown oficial continua usando o pokersolver; um teste garante que os dois concordam.
//
// score: inteiro comparável (maior vence). category: 0 = carta alta ... 8 = straight flush.

const RANK_INDEX = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, T: 8, J: 9, Q: 10, K: 11, A: 12 };
const SUIT_INDEX = { s: 0, h: 1, d: 2, c: 3 };

export const CATEGORY_PT = ['Carta Alta', 'Par', 'Dois Pares', 'Trinca', 'Sequência', 'Flush', 'Full House', 'Quadra', 'Straight Flush'];

export function cardCode(card) {
  return { rank: RANK_INDEX[card[0]], suit: SUIT_INDEX[card[1]] };
}

// Devolve a carta mais alta de uma sequência dentro de um bitmask de ranks, ou -1.
function straightHigh(mask) {
  // Ás também vale como 1 (roda A-2-3-4-5): bit 0 = ás baixo, bit r+1 = rank r.
  const m = (mask << 1) | ((mask >> 12) & 1);
  for (let high = 13; high >= 4; high--) {
    const need = 0b11111 << (high - 4);
    if ((m & need) === need) return high - 1;
  }
  return -1;
}

function encode(category, kickers) {
  let score = category;
  for (let i = 0; i < 5; i++) score = score * 16 + (kickers[i] ?? 0);
  return score;
}

export function evaluate(cards) {
  const rankCount = new Array(13).fill(0);
  const suitCount = [0, 0, 0, 0];
  const suitMask = [0, 0, 0, 0];
  let mask = 0;
  for (const c of cards) {
    const { rank, suit } = cardCode(c);
    rankCount[rank]++;
    suitCount[suit]++;
    suitMask[suit] |= 1 << rank;
    mask |= 1 << rank;
  }

  // flush e straight flush
  let flushSuit = -1;
  for (let s = 0; s < 4; s++) if (suitCount[s] >= 5) flushSuit = s;
  if (flushSuit >= 0) {
    const sf = straightHigh(suitMask[flushSuit]);
    if (sf >= 0) return { score: encode(8, [sf]), category: 8 };
  }

  let quads = -1;
  let trips = -1;
  let trips2 = -1;
  const pairs = [];
  for (let r = 12; r >= 0; r--) {
    const n = rankCount[r];
    if (n === 4) quads = r;
    else if (n === 3) {
      if (trips < 0) trips = r;
      else if (trips2 < 0) trips2 = r;
    } else if (n === 2) pairs.push(r);
  }

  if (quads >= 0) {
    let kicker = -1;
    for (let r = 12; r >= 0; r--) if (r !== quads && rankCount[r] > 0) { kicker = r; break; }
    return { score: encode(7, [quads, kicker]), category: 7 };
  }
  if (trips >= 0 && (pairs.length > 0 || trips2 >= 0)) {
    const pair = Math.max(trips2, pairs[0] ?? -1);
    return { score: encode(6, [trips, pair]), category: 6 };
  }
  if (flushSuit >= 0) {
    const kick = [];
    for (let r = 12; r >= 0 && kick.length < 5; r--) if (suitMask[flushSuit] & (1 << r)) kick.push(r);
    return { score: encode(5, kick), category: 5 };
  }
  const st = straightHigh(mask);
  if (st >= 0) return { score: encode(4, [st]), category: 4 };
  if (trips >= 0) {
    const kick = [trips];
    for (let r = 12; r >= 0 && kick.length < 3; r--) if (r !== trips && rankCount[r] > 0) kick.push(r);
    return { score: encode(3, kick), category: 3 };
  }
  if (pairs.length >= 2) {
    const [p1, p2] = pairs;
    let kicker = -1;
    for (let r = 12; r >= 0; r--) if (r !== p1 && r !== p2 && rankCount[r] > 0) { kicker = r; break; }
    return { score: encode(2, [p1, p2, kicker]), category: 2 };
  }
  if (pairs.length === 1) {
    const kick = [pairs[0]];
    for (let r = 12; r >= 0 && kick.length < 4; r--) if (r !== pairs[0] && rankCount[r] > 0) kick.push(r);
    return { score: encode(1, kick), category: 1 };
  }
  const kick = [];
  for (let r = 12; r >= 0 && kick.length < 5; r--) if (rankCount[r] > 0) kick.push(r);
  return { score: encode(0, kick), category: 0 };
}
