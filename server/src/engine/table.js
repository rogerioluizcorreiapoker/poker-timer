// Mesa de Texas Hold'em. Motor puro: sem rede, sem timers. Quem chama decide quando.
//
// Ciclo: addPlayer -> startHand -> act (várias vezes) -> mão termina (stage 'showdown' ou 'finished')
//        -> startHand de novo.
//
// Regras implementadas:
// - Dealer gira a cada mão entre jogadores elegíveis. Heads-up: dealer é o small blind e age primeiro no pré-flop.
// - Small blind, big blind e, opcionalmente, ante do big blind (BB ante).
// - Fold, check, call, raise (valor total da aposta) e all-in.
// - Raise mínimo = tamanho do último raise (ou o big blind). All-in abaixo do mínimo não reabre a ação.
// - Potes laterais por contribuição. Aposta não paga volta para quem apostou.
// - Se sobra só um jogador, leva o pote sem mostrar as cartas.
// - Se todos os que restam estão all-in (ou só um pode agir e já está pago), o board corre até o fim.

import { shuffledDeck } from './deck.js';
import { buildPots } from './pot.js';
import { pickWinners, evaluate } from './hand-rank.js';

export const STAGES = ['preflop', 'flop', 'turn', 'river'];

export class Table {
  constructor({ maxSeats = 9, rng = Math.random, blinds = { sb: 100, bb: 200, bbAnte: false }, autoRunout = true } = {}) {
    this.maxSeats = maxSeats;
    this.autoRunout = autoRunout; // false: quem chama avança o board carta a carta com advanceRunout()
    this.runout = false;
    this.rng = rng;
    this.blinds = { sb: blinds.sb, bb: blinds.bb, bbAnte: Boolean(blinds.bbAnte) };
    this.players = new Map(); // id -> player
    this.handNumber = 0;
    this.dealerSeat = null;
    this.stage = 'waiting'; // waiting | preflop | flop | turn | river | showdown | finished
    this.community = [];
    this.deck = [];
    this.currentSeat = null;
    this.highestBet = 0;
    this.minRaise = this.blinds.bb;
    this.toAct = new Set();
    this.acted = new Set(); // quem já agiu nesta rodada
    this.noRaise = new Set(); // quem já agiu e só pode pagar ou desistir (all-in curto não reabre)
    this.lastResult = null;
    this.log = [];
    this.nextDeck = null; // para testes: baralho pré-definido para a próxima mão
  }

  // ---------- jogadores ----------

  addPlayer({ id, name, stack }) {
    if (this.players.has(id)) throw new Error('jogador já está na mesa');
    const seat = this.freeSeat();
    if (seat === null) throw new Error('mesa cheia');
    const player = {
      id,
      name,
      seat,
      stack,
      bet: 0,
      totalBet: 0,
      cards: [],
      inHand: false,
      folded: false,
      allIn: false,
      sittingOut: false,
      connected: true,
      lastAction: null,
      timeouts: 0,
    };
    this.players.set(id, player);
    return player;
  }

  removePlayer(id) {
    const p = this.players.get(id);
    if (!p) return;
    if (p.inHand && this.handInProgress()) {
      // As fichas dele ficam no pote. Ele sai de verdade quando a mão fechar.
      p.leaving = true;
      p.sittingOut = true;
      if (!p.folded) this.act(id, { type: 'fold' }, { force: true });
      return;
    }
    this.players.delete(id);
  }

  freeSeat() {
    const taken = new Set([...this.players.values()].map((p) => p.seat));
    for (let s = 0; s < this.maxSeats; s++) if (!taken.has(s)) return s;
    return null;
  }

  player(id) {
    const p = this.players.get(id);
    if (!p) throw new Error('jogador não encontrado');
    return p;
  }

  playerAtSeat(seat) {
    for (const p of this.players.values()) if (p.seat === seat) return p;
    return null;
  }

  seatedInOrder() {
    return [...this.players.values()].sort((a, b) => a.seat - b.seat);
  }

  setBlinds({ sb, bb, bbAnte }) {
    if (sb !== undefined) this.blinds.sb = sb;
    if (bb !== undefined) this.blinds.bb = bb;
    if (bbAnte !== undefined) this.blinds.bbAnte = Boolean(bbAnte);
  }

  eligiblePlayers() {
    return this.seatedInOrder().filter((p) => p.stack > 0 && !p.sittingOut);
  }

  canStartHand() {
    return !this.handInProgress() && this.eligiblePlayers().length >= 2;
  }

  handInProgress() {
    return STAGES.includes(this.stage);
  }

  // ---------- início da mão ----------

  startHand() {
    if (!this.canStartHand()) throw new Error('não dá para iniciar a mão');
    const eligible = this.eligiblePlayers();
    this.handNumber += 1;
    this.lastResult = null;
    this.log = [];
    this.community = [];
    this.runout = false;
    this.deck = this.nextDeck ? this.nextDeck.slice() : shuffledDeck(this.rng);
    this.nextDeck = null;

    for (const p of this.players.values()) {
      const plays = eligible.includes(p);
      p.inHand = plays;
      p.folded = false;
      p.allIn = false;
      p.bet = 0;
      p.totalBet = 0;
      p.cards = plays ? [this.deck.pop(), this.deck.pop()] : [];
      p.lastAction = null;
    }

    const seats = eligible.map((p) => p.seat);
    this.dealerSeat = this.dealerSeat === null ? seats[0] : this.nextSeat(this.dealerSeat, seats);

    let sbSeat;
    let bbSeat;
    if (seats.length === 2) {
      sbSeat = this.dealerSeat;
      bbSeat = this.nextSeat(sbSeat, seats);
    } else {
      sbSeat = this.nextSeat(this.dealerSeat, seats);
      bbSeat = this.nextSeat(sbSeat, seats);
    }
    this.sbSeat = sbSeat;
    this.bbSeat = bbSeat;

    const bbPlayer = this.playerAtSeat(bbSeat);
    if (this.blinds.bbAnte) this.postAnte(bbPlayer, this.blinds.bb);
    this.postBlind(this.playerAtSeat(sbSeat), this.blinds.sb);
    this.postBlind(bbPlayer, this.blinds.bb);

    this.stage = 'preflop';
    this.highestBet = Math.max(...this.playersInHand().map((p) => p.bet));
    this.minRaise = this.blinds.bb;
    this.openRound(this.nextSeat(bbSeat, this.actableSeats().concat(bbSeat).sort((a, b) => a - b)));
    this.settleIfRoundOver();
    return this;
  }

  postAnte(p, amount) {
    const paid = Math.min(amount, p.stack);
    p.stack -= paid;
    p.totalBet += paid;
    if (p.stack === 0) p.allIn = true;
    this.log.push({ type: 'ante', playerId: p.id, amount: paid });
  }

  postBlind(p, amount) {
    const paid = Math.min(amount, p.stack);
    p.stack -= paid;
    p.bet += paid;
    p.totalBet += paid;
    if (p.stack === 0) p.allIn = true;
    this.log.push({ type: 'blind', playerId: p.id, amount: paid });
  }

  // ---------- rodada de apostas ----------

  playersInHand() {
    return this.seatedInOrder().filter((p) => p.inHand);
  }

  activePlayers() {
    return this.playersInHand().filter((p) => !p.folded);
  }

  actableSeats() {
    return this.activePlayers()
      .filter((p) => !p.allIn)
      .map((p) => p.seat);
  }

  nextSeat(fromSeat, seats) {
    const sorted = seats.slice().sort((a, b) => a - b);
    for (const s of sorted) if (s > fromSeat) return s;
    return sorted[0];
  }

  openRound(firstSeat) {
    this.toAct = new Set(this.actableSeats());
    this.acted = new Set();
    this.noRaise = new Set();
    this.currentSeat = this.toAct.has(firstSeat) ? firstSeat : this.nextActable(firstSeat);
  }

  nextActable(fromSeat) {
    const seats = [...this.toAct];
    if (seats.length === 0) return null;
    return this.nextSeat(fromSeat, seats);
  }

  currentPlayer() {
    return this.currentSeat === null ? null : this.playerAtSeat(this.currentSeat);
  }

  legalActions(playerId) {
    const p = this.players.get(playerId);
    if (!p || !this.handInProgress() || this.currentSeat !== p.seat || p.folded || p.allIn) return null;
    const toCall = Math.min(this.highestBet - p.bet, p.stack);
    const canRaise = p.stack > toCall && !this.noRaise.has(p.seat);
    const minRaiseTo = Math.min(this.highestBet + this.minRaise, p.bet + p.stack);
    return {
      fold: true,
      check: toCall === 0,
      call: toCall > 0 ? toCall : 0,
      raise: canRaise ? { min: minRaiseTo, max: p.bet + p.stack } : null,
      allIn: p.bet + p.stack,
    };
  }

  // action: { type: 'fold' | 'check' | 'call' | 'raise' | 'allin', amount }
  // 'raise' usa amount = valor total da aposta nesta rodada (ex.: subir para 600).
  act(playerId, action, { force = false } = {}) {
    const p = this.player(playerId);
    if (!this.handInProgress()) throw new Error('nenhuma mão em andamento');
    if (!force && this.currentSeat !== p.seat) throw new Error('não é a sua vez');
    if (p.folded || p.allIn) throw new Error('jogador não pode agir');

    if (force && this.currentSeat !== p.seat) {
      p.folded = true;
      p.lastAction = 'fold';
      this.toAct.delete(p.seat);
      this.log.push({ type: 'fold', playerId, amount: p.bet, stage: this.stage });
      if (this.activePlayers().length === 1) this.finishByFold();
      return this;
    }

    const legal = force ? { fold: true } : this.legalActions(playerId);
    const toCall = this.highestBet - p.bet;

    switch (action.type) {
      case 'fold':
        p.folded = true;
        p.lastAction = 'fold';
        break;
      case 'check':
        if (!legal.check) throw new Error('não pode dar check, há aposta para pagar');
        p.lastAction = 'check';
        break;
      case 'call': {
        if (toCall <= 0) throw new Error('nada para pagar, use check');
        this.putChips(p, Math.min(toCall, p.stack));
        p.lastAction = p.allIn ? 'all-in' : 'call';
        break;
      }
      case 'allin': {
        const total = p.bet + p.stack;
        this.applyRaiseOrCall(p, total, legal);
        break;
      }
      case 'raise': {
        const total = Number(action.amount);
        if (!legal.raise) throw new Error('não pode subir');
        if (!Number.isFinite(total) || total < legal.raise.min || total > legal.raise.max) {
          throw new Error(`raise precisa ficar entre ${legal.raise.min} e ${legal.raise.max}`);
        }
        this.applyRaiseOrCall(p, total, legal);
        break;
      }
      default:
        throw new Error('ação desconhecida');
    }

    this.log.push({ type: action.type, playerId, amount: p.bet, stage: this.stage });
    this.acted.add(p.seat);
    this.toAct.delete(p.seat);
    this.advanceAfter(p.seat);
    return this;
  }

  // Coloca fichas para chegar a uma aposta total `total`. Decide se é call, raise completo ou all-in curto.
  applyRaiseOrCall(p, total, legal) {
    const previousHighest = this.highestBet;
    this.putChips(p, total - p.bet);
    if (p.bet > previousHighest) {
      const raiseSize = p.bet - previousHighest;
      const fullRaise = raiseSize >= this.minRaise;
      this.highestBet = p.bet;
      if (fullRaise) {
        this.minRaise = raiseSize;
        // Raise completo reabre a ação para todo mundo que ainda pode agir.
        this.toAct = new Set(this.actableSeats());
        this.noRaise = new Set();
      } else {
        // All-in curto: quem está abaixo precisa pagar a diferença, mas quem já agiu não pode subir de novo.
        for (const seat of this.actableSeats()) {
          const other = this.playerAtSeat(seat);
          if (other.bet < this.highestBet) {
            this.toAct.add(seat);
            if (this.acted.has(seat)) this.noRaise.add(seat);
          }
        }
      }
      p.lastAction = p.allIn ? 'all-in' : 'raise';
    } else {
      p.lastAction = p.allIn ? 'all-in' : 'call';
    }
  }

  putChips(p, amount) {
    const paid = Math.min(amount, p.stack);
    p.stack -= paid;
    p.bet += paid;
    p.totalBet += paid;
    if (p.stack === 0) p.allIn = true;
    if (p.bet > this.highestBet) this.highestBet = p.bet;
  }

  advanceAfter(seat) {
    if (this.activePlayers().length === 1) {
      this.finishByFold();
      return;
    }
    this.toAct.delete(seat);
    if (this.toAct.size === 0) {
      this.endRound();
      return;
    }
    this.currentSeat = this.nextActable(seat);
  }

  settleIfRoundOver() {
    if (this.toAct.size === 0 || this.currentSeat === null) this.endRound();
  }

  endRound() {
    this.currentSeat = null;
    for (const p of this.playersInHand()) p.bet = 0;
    this.highestBet = 0;
    this.minRaise = this.blinds.bb;

    const actable = this.actableSeats();
    const everyoneDone = actable.length <= 1;

    if (this.stage === 'river') {
      this.showdown();
      return;
    }
    if (everyoneDone) {
      // Ninguém mais pode apostar: o board corre até o river, de uma vez ou carta a carta.
      this.runout = true;
      if (!this.autoRunout) return;
      while (this.stage !== 'river') this.dealNextStreet();
      this.showdown();
      return;
    }
    this.dealNextStreet();
    this.openRound(this.nextSeat(this.dealerSeat, actable));
  }

  dealNextStreet() {
    if (this.stage === 'preflop') {
      this.community.push(this.deck.pop(), this.deck.pop(), this.deck.pop());
      this.stage = 'flop';
    } else if (this.stage === 'flop') {
      this.community.push(this.deck.pop());
      this.stage = 'turn';
    } else if (this.stage === 'turn') {
      this.community.push(this.deck.pop());
      this.stage = 'river';
    }
  }

  // Modo carta a carta (autoRunout = false): cada chamada vira a próxima rua; no river, faz o showdown.
  advanceRunout() {
    if (!this.runout || !this.handInProgress()) return false;
    if (this.stage === 'river') {
      this.showdown();
      return true;
    }
    this.dealNextStreet();
    if (this.stage === 'river') this.showdown();
    return true;
  }

  // ---------- fim da mão ----------

  contributions() {
    return this.playersInHand().map((p) => ({ id: p.id, totalBet: p.totalBet, folded: p.folded }));
  }

  totalPot() {
    return this.playersInHand().reduce((sum, p) => sum + p.totalBet, 0);
  }

  finishByFold() {
    const winner = this.activePlayers()[0];
    const pots = buildPots(this.contributions());
    const payouts = new Map();
    for (const pot of pots) {
      // Só há um ativo; qualquer pote onde ele não é elegível é devolução de aposta não paga. Não ocorre aqui.
      const to = pot.eligible.includes(winner.id) || pot.eligible.length === 0 ? winner.id : pot.eligible[0];
      payouts.set(to, (payouts.get(to) ?? 0) + pot.amount);
    }
    for (const [id, amount] of payouts) this.player(id).stack += amount;
    this.lastResult = {
      type: 'fold',
      winners: [{ playerId: winner.id, amount: payouts.get(winner.id) ?? 0, handName: null }],
      revealed: {},
      pots,
    };
    this.closeHand();
  }

  showdown() {
    const pots = buildPots(this.contributions());
    const active = this.activePlayers();
    const payouts = new Map();
    const hands = new Map();
    for (const p of active) hands.set(p.id, evaluate(p.cards, this.community));

    const potResults = [];
    for (const pot of pots) {
      const entries = active.filter((p) => pot.eligible.includes(p.id)).map((p) => ({ id: p.id, cards: p.cards }));
      if (entries.length === 0) continue;
      const { winnerIds, handName } = pickWinners(entries, this.community);
      const ordered = this.orderFromDealer(winnerIds);
      const share = Math.floor(pot.amount / ordered.length);
      let remainder = pot.amount - share * ordered.length;
      for (const id of ordered) {
        let amount = share;
        if (remainder > 0) {
          amount += 1;
          remainder -= 1;
        }
        payouts.set(id, (payouts.get(id) ?? 0) + amount);
      }
      potResults.push({ amount: pot.amount, winners: ordered, handName });
    }
    for (const [id, amount] of payouts) this.player(id).stack += amount;

    const revealed = {};
    for (const p of active) revealed[p.id] = { cards: p.cards, handName: hands.get(p.id).name, descr: hands.get(p.id).descr };

    this.lastResult = {
      type: 'showdown',
      winners: [...payouts.entries()].map(([playerId, amount]) => ({
        playerId,
        amount,
        handName: hands.get(playerId).name,
      })),
      revealed,
      pots: potResults,
    };
    this.closeHand();
  }

  orderFromDealer(ids) {
    const bySeat = ids.map((id) => this.player(id)).sort((a, b) => a.seat - b.seat);
    const after = bySeat.filter((p) => p.seat > this.dealerSeat);
    const before = bySeat.filter((p) => p.seat <= this.dealerSeat);
    return [...after, ...before].map((p) => p.id);
  }

  closeHand() {
    this.stage = 'finished';
    this.runout = false;
    this.currentSeat = null;
    this.toAct = new Set();
    for (const p of [...this.players.values()]) {
      p.bet = 0;
      if (p.stack === 0) p.allIn = false;
      if (p.leaving) this.players.delete(p.id);
    }
  }

  // Usado pelo timer de ação: check se puder, senão fold.
  timeoutAction(playerId) {
    const legal = this.legalActions(playerId);
    if (!legal) return null;
    const p = this.player(playerId);
    p.timeouts += 1;
    const type = legal.check ? 'check' : 'fold';
    this.act(playerId, { type });
    return type;
  }

  // ---------- visões ----------

  publicState() {
    const current = this.currentPlayer();
    return {
      handNumber: this.handNumber,
      stage: this.stage,
      runout: this.runout,
      community: this.community,
      pot: this.totalPot(),
      pots: this.handInProgress() ? buildPots(this.contributions()).map((p) => p.amount) : [],
      dealerSeat: this.dealerSeat,
      sbSeat: this.sbSeat ?? null,
      bbSeat: this.bbSeat ?? null,
      currentPlayerId: current ? current.id : null,
      highestBet: this.highestBet,
      blinds: this.blinds,
      players: this.seatedInOrder().map((p) => ({
        id: p.id,
        name: p.name,
        seat: p.seat,
        stack: p.stack,
        bet: p.bet,
        inHand: p.inHand,
        folded: p.folded,
        allIn: p.allIn,
        sittingOut: p.sittingOut,
        connected: p.connected,
        lastAction: p.lastAction,
        // Cartas abertas: no showdown, ou durante o run-out (todos all-in, como na TV).
        cards: this.lastResult?.revealed?.[p.id]?.cards ?? (this.runout && p.inHand && !p.folded ? p.cards : null),
      })),
      lastResult: this.lastResult,
      log: this.log,
    };
  }

  privateState(playerId) {
    const p = this.players.get(playerId);
    if (!p) return null;
    const legal = this.legalActions(playerId);
    const best = p.cards.length && this.community.length >= 3 ? evaluate(p.cards, this.community) : null;
    return {
      cards: p.cards,
      legalActions: legal,
      bestHand: best ? best.name : null,
    };
  }
}
