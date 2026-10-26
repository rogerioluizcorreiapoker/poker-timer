// Uma sala = uma mesa + relógio + timers. Liga o motor puro ao mundo real (tempo e conexões).
// Quem chama (o servidor de sockets) recebe `onChange` a cada mudança e reenvia o estado às telas.

import { randomBytes } from 'node:crypto';
import { Table } from '../engine/table.js';
import { buildSchedule, stateAt, cumulativeBefore, nextLevel } from '../blinds/levels.js';

export const DEFAULT_CONFIG = {
  mode: 'torneio', // 'torneio' (blinds sobem com o tempo) | 'cash' (blinds fixos)
  startingStack: 20000,
  sb: 100,
  bb: 200,
  bbAnte: false,
  actionSeconds: 30,
  levelMinutes: 0, // 0 = usa a tabela padrão
  showdownSeconds: 8,
  foldSeconds: 3,
  maxTimeouts: 3, // depois disso o jogador senta fora
};

export class Room {
  constructor({ code, config = {}, now = () => Date.now(), timers = { set: setTimeout, clear: clearTimeout }, onChange = () => {} }) {
    this.code = code;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.now = now;
    this.timers = timers;
    this.onChange = onChange;
    this.status = 'lobby'; // lobby | running | paused | ended
    this.hostId = null;
    this.tokens = new Map(); // token -> playerId
    this.table = new Table({ blinds: { sb: this.config.sb, bb: this.config.bb, bbAnte: this.config.bbAnte } });
    this.schedule = buildSchedule(this.config.levelMinutes);
    this.clock = { running: false, startedAt: null, pausedElapsed: 0 };
    this.actionDeadline = null;
    this.actionTimer = null;
    this.handTimer = null;
    this.levelTimer = null;
    this.createdAt = this.now();
    this.message = null;
  }

  // ---------- jogadores ----------

  join({ name, token }) {
    if (token && this.tokens.has(token)) {
      const id = this.tokens.get(token);
      const p = this.table.players.get(id);
      if (p) {
        p.connected = true;
        if (name) p.name = name;
        this.changed();
        return { playerId: id, token, reconnected: true };
      }
    }
    const id = 'p_' + randomBytes(4).toString('hex');
    const newToken = randomBytes(12).toString('hex');
    this.table.addPlayer({ id, name: cleanName(name), stack: this.config.startingStack });
    this.tokens.set(newToken, id);
    if (!this.hostId) this.hostId = id;
    this.changed();
    this.maybeStartHand();
    return { playerId: id, token: newToken, reconnected: false };
  }

  disconnect(playerId) {
    const p = this.table.players.get(playerId);
    if (!p) return;
    p.connected = false;
    this.changed();
  }

  kick(playerId) {
    this.table.removePlayer(playerId);
    for (const [token, id] of this.tokens) if (id === playerId) this.tokens.delete(token);
    if (this.hostId === playerId) {
      const next = this.table.seatedInOrder().find((p) => !p.leaving);
      this.hostId = next ? next.id : null;
    }
    this.afterTableChange();
  }

  sitOut(playerId, out) {
    const p = this.table.player(playerId);
    p.sittingOut = Boolean(out);
    p.timeouts = 0;
    this.changed();
    this.maybeStartHand();
  }

  addChips(playerId, amount) {
    const p = this.table.player(playerId);
    p.stack += Math.max(0, Math.floor(amount));
    if (p.stack > 0 && p.sittingOut && p.timeouts === 0) p.sittingOut = false;
    this.changed();
    this.maybeStartHand();
  }

  rename(playerId, name) {
    this.table.player(playerId).name = cleanName(name);
    this.changed();
  }

  // ---------- controle do anfitrião ----------

  setConfig(partial) {
    if (this.status !== 'lobby') {
      // Em jogo só aceita o que não bagunça a mão em andamento.
      const allowed = ['actionSeconds', 'showdownSeconds', 'bbAnte', 'sb', 'bb', 'mode'];
      partial = Object.fromEntries(Object.entries(partial).filter(([k]) => allowed.includes(k)));
    }
    this.config = { ...this.config, ...sanitizeConfig(partial) };
    this.schedule = buildSchedule(this.config.levelMinutes);
    if (this.status === 'lobby') {
      for (const p of this.table.players.values()) p.stack = this.config.startingStack;
    }
    this.applyBlinds();
    this.changed();
  }

  start() {
    if (this.status !== 'lobby' && this.status !== 'paused') return;
    this.status = 'running';
    if (this.config.mode === 'torneio' && !this.clock.running) {
      this.clock.running = true;
      this.clock.startedAt = this.now();
    }
    this.armLevelTimer();
    this.changed();
    this.maybeStartHand();
  }

  pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    if (this.clock.running) {
      this.clock.pausedElapsed += (this.now() - this.clock.startedAt) / 1000;
      this.clock.running = false;
    }
    this.clearTimer('handTimer');
    this.clearTimer('levelTimer');
    // A mão em andamento continua; o timer de ação também. Só não começa mão nova.
    this.changed();
  }

  resume() {
    if (this.status !== 'paused') return;
    this.start();
  }

  jumpLevel(delta) {
    if (this.config.mode !== 'torneio') return;
    const st = stateAt(this.schedule, this.clockElapsed());
    let target = st.index + delta;
    if (delta < 0 && st.elapsedInItem > 5) target = st.index; // "voltar" primeiro reinicia o nível atual
    target = Math.max(0, Math.min(this.schedule.length - 1, target));
    this.setClockElapsed(cumulativeBefore(this.schedule, target));
    this.applyBlinds();
    this.armLevelTimer();
    this.changed();
    this.maybeStartHand();
  }

  // ---------- relógio de níveis ----------

  clockElapsed() {
    return this.clock.running ? (this.now() - this.clock.startedAt) / 1000 + this.clock.pausedElapsed : this.clock.pausedElapsed;
  }

  setClockElapsed(seconds) {
    this.clock.pausedElapsed = Math.max(0, seconds);
    if (this.clock.running) this.clock.startedAt = this.now();
  }

  levelState() {
    if (this.config.mode !== 'torneio') return null;
    const st = stateAt(this.schedule, this.clockElapsed());
    return { ...st, next: nextLevel(this.schedule, st.index) };
  }

  inBreak() {
    const st = this.levelState();
    return Boolean(st && st.item.type === 'break' && !st.done);
  }

  // Blinds valem a partir da próxima mão.
  applyBlinds() {
    if (this.config.mode === 'torneio') {
      const st = this.levelState();
      const item = st.item.type === 'level' ? st.item : nextLevel(this.schedule, st.index) ?? lastLevel(this.schedule);
      this.table.setBlinds({ sb: item.sb, bb: item.bb, bbAnte: this.config.bbAnte });
    } else {
      this.table.setBlinds({ sb: this.config.sb, bb: this.config.bb, bbAnte: this.config.bbAnte });
    }
  }

  armLevelTimer() {
    this.clearTimer('levelTimer');
    if (this.config.mode !== 'torneio' || !this.clock.running) return;
    const st = this.levelState();
    if (st.done) return;
    this.levelTimer = this.timers.set(() => {
      this.levelTimer = null;
      this.applyBlinds();
      this.changed();
      this.armLevelTimer();
      this.maybeStartHand();
    }, Math.max(100, st.remaining * 1000 + 50));
  }

  // ---------- ciclo da mão ----------

  maybeStartHand() {
    if (this.status !== 'running') return;
    if (this.table.handInProgress() || this.handTimer) return;
    if (this.inBreak()) return;
    this.applyBlinds();
    if (!this.table.canStartHand()) {
      this.checkTournamentEnd();
      return;
    }
    this.table.startHand();
    this.message = null;
    this.afterTableChange();
  }

  checkTournamentEnd() {
    const alive = [...this.table.players.values()].filter((p) => p.stack > 0);
    if (this.config.mode === 'torneio' && alive.length === 1 && this.table.players.size > 1) {
      this.status = 'ended';
      this.message = `${alive[0].name} venceu o torneio!`;
      this.clearTimer('levelTimer');
      this.changed();
    }
  }

  playerAction(playerId, action) {
    const p = this.table.player(playerId);
    this.table.act(playerId, action);
    p.timeouts = 0;
    this.afterTableChange();
  }

  afterTableChange() {
    this.clearTimer('actionTimer');
    this.actionDeadline = null;
    if (this.table.handInProgress()) {
      const current = this.table.currentPlayer();
      if (current) this.armActionTimer(current.id);
    } else if (this.table.stage === 'finished' && !this.handTimer) {
      const delay = this.table.lastResult?.type === 'showdown' ? this.config.showdownSeconds : this.config.foldSeconds;
      this.handTimer = this.timers.set(() => {
        this.handTimer = null;
        this.maybeStartHand();
      }, delay * 1000);
    }
    this.changed();
  }

  armActionTimer(playerId) {
    const ms = this.config.actionSeconds * 1000;
    this.actionDeadline = this.now() + ms;
    this.actionTimer = this.timers.set(() => {
      this.actionTimer = null;
      const p = this.table.players.get(playerId);
      if (!p) return;
      const did = this.table.timeoutAction(playerId);
      if (did && (!p.connected || p.timeouts >= this.config.maxTimeouts)) p.sittingOut = true;
      this.afterTableChange();
    }, ms);
  }

  clearTimer(name) {
    if (this[name]) {
      this.timers.clear(this[name]);
      this[name] = null;
    }
  }

  destroy() {
    this.clearTimer('actionTimer');
    this.clearTimer('handTimer');
    this.clearTimer('levelTimer');
  }

  changed() {
    this.onChange(this);
  }

  // ---------- snapshots ----------

  publicSnapshot() {
    const level = this.levelState();
    return {
      code: this.code,
      status: this.status,
      hostId: this.hostId,
      config: this.config,
      message: this.message,
      serverNow: this.now(),
      actionDeadline: this.actionDeadline,
      actionSeconds: this.config.actionSeconds,
      clock: level
        ? {
            running: this.clock.running,
            elapsed: this.clockElapsed(),
            index: level.index,
            item: level.item,
            remaining: level.remaining,
            next: level.next,
            done: level.done,
            inBreak: this.inBreak(),
          }
        : null,
      table: this.table.publicState(),
    };
  }

  snapshotFor(playerId) {
    return { ...this.publicSnapshot(), me: this.table.privateState(playerId), myId: playerId, isHost: playerId === this.hostId };
  }
}

function lastLevel(schedule) {
  for (let i = schedule.length - 1; i >= 0; i--) if (schedule[i].type === 'level') return schedule[i];
  return schedule[0];
}

function cleanName(name) {
  const n = String(name ?? '').trim().slice(0, 16);
  return n || 'Jogador';
}

function sanitizeConfig(partial) {
  const out = {};
  const num = (k, min, max) => {
    if (partial[k] === undefined) return;
    const v = Number(partial[k]);
    if (Number.isFinite(v)) out[k] = Math.min(max, Math.max(min, Math.floor(v)));
  };
  if (partial.mode === 'torneio' || partial.mode === 'cash') out.mode = partial.mode;
  num('startingStack', 100, 100000000);
  num('sb', 1, 100000000);
  num('bb', 1, 100000000);
  num('actionSeconds', 5, 600);
  num('levelMinutes', 0, 600);
  num('showdownSeconds', 2, 60);
  if (partial.bbAnte !== undefined) out.bbAnte = Boolean(partial.bbAnte);
  return out;
}
