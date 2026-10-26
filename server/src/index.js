// Servidor: serve as páginas, cria salas e liga os sockets à Room.
//
// Eventos que o cliente manda:
//   tv:create {}                        -> cria sala nova, responde { code }
//   tv:watch { code }                   -> passa a receber o estado público da sala
//   player:join { code, name, token }   -> entra ou reconecta, responde { playerId, token }
//   player:action { type, amount }      -> fold | check | call | raise | allin
//   player:sit { out }                  -> sentar fora / voltar
//   host:start | host:pause | host:resume | host:config {..} | host:addChips {playerId, amount}
//   host:kick {playerId} | host:level {delta} | host:rename {playerId, name}
// Eventos que o servidor manda:
//   state  -> snapshot (público para a TV, com `me` para o jogador)
//   toast  -> aviso curto { text, kind }

import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Server } from 'socket.io';
import QRCode from 'qrcode';
import { Room } from './rooms/room.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const PUBLIC = path.join(ROOT, 'public');
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

const app = express();
app.use(express.static(PUBLIC));
app.get('/timer', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')));
app.get('/tv', (_req, res) => res.sendFile(path.join(PUBLIC, 'tv.html')));
app.get('/j/:code', (_req, res) => res.sendFile(path.join(PUBLIC, 'player.html')));
app.get('/api/qr', async (req, res) => {
  const url = String(req.query.url ?? '');
  if (!url.startsWith('http')) return res.status(400).end();
  res.type('png').send(await QRCode.toBuffer(url, { width: 400, margin: 1, color: { dark: '#000000', light: '#ffffff' } }));
});
app.get('/api/info', (_req, res) => res.json({ publicUrl: PUBLIC_URL || null }));
app.get('/healthz', (_req, res) => res.json({ ok: true, rooms: rooms.size }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const rooms = new Map(); // code -> Room

function newCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  } while (rooms.has(code));
  return code;
}

function createRoom() {
  const code = newCode();
  const room = new Room({ code, onChange: broadcast });
  rooms.set(code, room);
  return room;
}

function broadcast(room) {
  io.to(`tv:${room.code}`).emit('state', room.publicSnapshot());
  for (const p of room.table.players.values()) {
    io.to(`player:${room.code}:${p.id}`).emit('state', room.snapshotFor(p.id));
  }
}

// Sala vazia por muito tempo some da memória.
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    const anyone = [...room.table.players.values()].some((p) => p.connected) || io.sockets.adapter.rooms.get(`tv:${code}`)?.size;
    if (!anyone) {
      room.idleSince ??= now;
      if (now - room.idleSince > 6 * 60 * 60 * 1000) {
        room.destroy();
        rooms.delete(code);
      }
    } else {
      room.idleSince = null;
    }
  }
}, 60 * 1000).unref();

io.on('connection', (socket) => {
  let room = null;
  let playerId = null;

  const fail = (msg) => socket.emit('toast', { text: msg, kind: 'error' });
  const guard = (fn) => (payload = {}, ack) => {
    try {
      const out = fn(payload) ?? {};
      if (typeof ack === 'function') ack({ ok: true, ...out });
    } catch (err) {
      if (typeof ack === 'function') ack({ ok: false, error: err.message });
      else fail(err.message);
    }
  };
  const hostOnly = (fn) =>
    guard((payload) => {
      if (!room || room.hostId !== playerId) throw new Error('só o anfitrião pode fazer isso');
      return fn(payload);
    });

  socket.on(
    'tv:create',
    guard(() => {
      room = createRoom();
      socket.join(`tv:${room.code}`);
      socket.emit('state', room.publicSnapshot());
      return { code: room.code };
    })
  );

  socket.on(
    'tv:watch',
    guard(({ code }) => {
      const r = rooms.get(String(code ?? '').toUpperCase());
      if (!r) throw new Error('mesa não encontrada');
      room = r;
      socket.join(`tv:${room.code}`);
      socket.emit('state', room.publicSnapshot());
      return { code: room.code };
    })
  );

  socket.on(
    'player:join',
    guard(({ code, name, token }) => {
      const r = rooms.get(String(code ?? '').toUpperCase());
      if (!r) throw new Error('mesa não encontrada. Confira o código na TV.');
      room = r;
      const result = room.join({ name, token });
      playerId = result.playerId;
      socket.join(`player:${room.code}:${playerId}`);
      socket.emit('state', room.snapshotFor(playerId));
      return result;
    })
  );

  socket.on(
    'player:action',
    guard(({ type, amount }) => {
      if (!room || !playerId) throw new Error('você não está numa mesa');
      room.playerAction(playerId, { type, amount });
    })
  );

  socket.on(
    'player:sit',
    guard(({ out }) => {
      if (!room || !playerId) throw new Error('você não está numa mesa');
      room.sitOut(playerId, out);
    })
  );

  socket.on(
    'player:rename',
    guard(({ name }) => {
      if (!room || !playerId) throw new Error('você não está numa mesa');
      room.rename(playerId, name);
    })
  );

  socket.on('host:start', hostOnly(() => room.start()));
  socket.on('host:pause', hostOnly(() => room.pause()));
  socket.on('host:resume', hostOnly(() => room.resume()));
  socket.on('host:config', hostOnly((cfg) => room.setConfig(cfg)));
  socket.on('host:level', hostOnly(({ delta }) => room.jumpLevel(Number(delta) || 1)));
  socket.on('host:addChips', hostOnly(({ playerId: id, amount }) => room.addChips(id, Number(amount))));
  socket.on('host:rename', hostOnly(({ playerId: id, name }) => room.rename(id, name)));
  socket.on(
    'host:kick',
    hostOnly(({ playerId: id }) => {
      room.kick(id);
      io.to(`player:${room.code}:${id}`).emit('kicked');
    })
  );

  socket.on('disconnect', () => {
    if (room && playerId) {
      // Só marca como desconectado se não houver outra aba dele aberta.
      const others = io.sockets.adapter.rooms.get(`player:${room.code}:${playerId}`)?.size ?? 0;
      if (others === 0) room.disconnect(playerId);
    }
  });
});

function lanAddresses() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list ?? []) if (net.family === 'IPv4' && !net.internal) out.push(net.address);
  }
  return out;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('Poker semipresencial no ar.');
  console.log(`  Neste computador: http://localhost:${PORT}`);
  for (const ip of lanAddresses()) console.log(`  Na rede da casa (abra este na TV): http://${ip}:${PORT}/tv`);
  if (PUBLIC_URL) console.log(`  Endereço público: ${PUBLIC_URL}`);
});
