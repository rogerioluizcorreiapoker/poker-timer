import { describe, it, expect } from 'vitest';
import { Room } from '../src/rooms/room.js';

// Relógio e timers falsos: o teste avança o tempo na mão.
function fakeWorld() {
  let now = 1_000_000;
  const timers = new Map();
  let seq = 0;
  const world = {
    now: () => now,
    timers: {
      set: (fn, ms) => {
        const id = ++seq;
        timers.set(id, { at: now + ms, fn });
        return id;
      },
      clear: (id) => timers.delete(id),
    },
    advance(ms) {
      const target = now + ms;
      while (true) {
        const due = [...timers.entries()].filter(([, t]) => t.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        now = due[1].at;
        timers.delete(due[0]);
        due[1].fn();
      }
      now = target;
    },
  };
  return world;
}

function roomWith(names, config = {}) {
  const world = fakeWorld();
  const changes = [];
  const room = new Room({ code: 'TEST', config, now: world.now, timers: world.timers, onChange: () => changes.push(1) });
  const ids = names.map((n) => room.join({ name: n }).playerId);
  return { room, world, ids, changes };
}

describe('Room', () => {
  it('primeiro a entrar é o anfitrião e a mão só começa depois de start', () => {
    const { room, ids } = roomWith(['Ana', 'Bia']);
    expect(room.hostId).toBe(ids[0]);
    expect(room.table.handInProgress()).toBe(false);
    room.start();
    expect(room.status).toBe('running');
    expect(room.table.handInProgress()).toBe(true);
    expect(room.actionDeadline).not.toBeNull();
  });

  it('reconexão pelo token devolve o mesmo jogador', () => {
    const { room } = roomWith([]);
    const first = room.join({ name: 'Ana' });
    room.disconnect(first.playerId);
    expect(room.table.player(first.playerId).connected).toBe(false);
    const again = room.join({ name: 'Ana', token: first.token });
    expect(again.playerId).toBe(first.playerId);
    expect(again.reconnected).toBe(true);
    expect(room.table.player(first.playerId).connected).toBe(true);
  });

  it('timeout de ação dá fold e a mão segue; depois do fim, a próxima começa sozinha', () => {
    const { room, world } = roomWith(['Ana', 'Bia', 'Caio'], { actionSeconds: 10, mode: 'cash', sb: 50, bb: 100 });
    room.start();
    const first = room.table.handNumber;
    world.advance(10_000); // Ana (dealer) estoura o tempo: fold
    world.advance(10_000); // Bia estoura: fold -> Caio leva
    expect(room.table.stage).toBe('finished');
    world.advance(3_000); // foldSeconds
    expect(room.table.handNumber).toBe(first + 1);
    expect(room.table.handInProgress()).toBe(true);
  });

  it('jogador desconectado que estoura o tempo senta fora', () => {
    const { room, world, ids } = roomWith(['Ana', 'Bia', 'Caio'], { actionSeconds: 10, mode: 'cash' });
    room.start();
    const current = room.table.currentPlayer().id;
    room.disconnect(current);
    world.advance(10_000);
    expect(room.table.player(current).sittingOut).toBe(true);
    expect(ids).toContain(current);
  });

  it('torneio: blinds sobem com o relógio e valem na mão seguinte', () => {
    const { room, world } = roomWith(['Ana', 'Bia'], { mode: 'torneio', levelMinutes: 1, actionSeconds: 5 });
    room.start();
    expect(room.table.blinds).toMatchObject({ sb: 100, bb: 200 });
    world.advance(61_000);
    expect(room.levelState().item.level).toBe(2);
    // a mão em andamento pode já ter trocado por timeouts; forçamos mais tempo para garantir mão nova
    world.advance(30_000);
    expect(room.table.blinds).toMatchObject({ sb: 200, bb: 400 });
  });

  it('pausar congela o relógio e não começa mão nova; retomar continua', () => {
    const { room, world } = roomWith(['Ana', 'Bia'], { mode: 'torneio', levelMinutes: 1, actionSeconds: 5 });
    room.start();
    world.advance(20_000);
    room.pause();
    const elapsed = room.clockElapsed();
    world.advance(60_000);
    expect(room.clockElapsed()).toBe(elapsed);
    expect(room.table.handInProgress()).toBe(false);
    room.resume();
    expect(room.table.handInProgress()).toBe(true);
  });

  it('no intervalo não se distribui mão nova', () => {
    const { room, world } = roomWith(['Ana', 'Bia'], { mode: 'torneio', levelMinutes: 1, actionSeconds: 5 });
    room.start();
    room.setClockElapsed(6 * 60); // começo do intervalo
    world.advance(20_000); // mão atual acaba por timeouts
    expect(room.inBreak()).toBe(true);
    expect(room.table.handInProgress()).toBe(false);
  });

  it('snapshot privado mostra as cartas do jogador e o público não', () => {
    const { room, ids } = roomWith(['Ana', 'Bia']);
    room.start();
    const pub = room.publicSnapshot();
    expect(pub.table.players.every((p) => p.cards === null)).toBe(true);
    const mine = room.snapshotFor(ids[0]);
    expect(mine.me.cards).toHaveLength(2);
    expect(mine.isHost).toBe(true);
  });

  it('expulsar o anfitrião passa o papel para o próximo', () => {
    const { room, ids } = roomWith(['Ana', 'Bia', 'Caio']);
    room.kick(ids[0]);
    expect(room.hostId).toBe(ids[1]);
    expect(room.table.players.has(ids[0])).toBe(false);
  });

  it('torneio termina quando sobra um com fichas', () => {
    const { room, world, ids } = roomWith(['Ana', 'Bia'], { mode: 'torneio', startingStack: 300, actionSeconds: 5 });
    room.start();
    // joga all-in até alguém zerar
    for (let i = 0; i < 20 && room.status === 'running'; i++) {
      const cur = room.table.currentPlayer();
      if (cur) {
        const legal = room.table.legalActions(cur.id);
        room.playerAction(cur.id, legal.check ? { type: 'check' } : { type: 'allin' });
      } else {
        world.advance(10_000);
      }
    }
    expect(room.status).toBe('ended');
    expect(room.message).toMatch(/venceu/);
  });
});
