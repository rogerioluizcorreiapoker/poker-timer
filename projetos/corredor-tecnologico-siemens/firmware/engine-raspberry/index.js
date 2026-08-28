/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - ENGINE
 * Roda no Raspberry Pi. Le os dois radares, funde os alvos, executa a maquina
 * de estados e emite sACN para os dois controladores, a 40 quadros por segundo.
 *
 *   node index.js                 operacao normal
 *   node index.js --simular       sem radar, com pessoa fantasma (bancada)
 *   node index.js --varredura     acende 1 pixel por vez (caca emenda fria)
 * ========================================================================== */
'use strict';

const LAYOUT = require('../../sistema/layout.js');
const ENGINE = require('../../sistema/engine.js');
const { RadarLD2450, Fusao } = require('./radar-ld2450.js');
const { EmissorSACN } = require('./sacn.js');
const CFG = require('./config.json');

const args = process.argv.slice(2);
const modoSimulacao = args.includes('--simular');
const modoVarredura = args.includes('--varredura');

// ---------------------------------------------------------------- inicializacao
const mapa = LAYOUT.gerarMapaPixels();
const motor = new ENGINE.Engine({ mapa });
const emissor = new EmissorSACN({ nome: 'Corredor Siemens' });
const fusao = new Fusao({});

console.log('pixels     :', mapa.totais.qtdPixels);
console.log('trilhas    :', mapa.totais.qtdTracos, '| emendas:', mapa.totais.qtdCantos);
console.log('quadros    :', CFG.taxaQuadros, 'fps');

/* Mapa de universos: cada strand comeca num limite de universo.
 * Empacotar corrido economizaria alguns universos e tornaria a configuracao
 * dos controladores um pesadelo de conferir em obra. */
const universos = [];
let proximoUniverso = CFG.universoInicial;
Object.values(mapa.strands).sort((a, b) => a.id - b.id).forEach((s) => {
  const ctrl = CFG.controladores.find((c) => c.strands.includes(s.id));
  if (!ctrl) throw new Error('strand ' + s.id + ' sem controlador em config.json');
  const indices = mapa.pixels.filter((p) => p.strand === s.id).map((p) => p.i);
  const qtd = Math.ceil(indices.length * 3 / 512);
  universos.push({ strand: s.id, ip: ctrl.ip, base: proximoUniverso, qtd, indices });
  proximoUniverso += qtd;
});
console.log('universos  :', proximoUniverso - CFG.universoInicial,
            'em', CFG.controladores.length, 'controladores');

// ---------------------------------------------------------------------- radares
const radares = [];
if (!modoSimulacao && !modoVarredura) {
  const { SerialPort } = require('serialport');
  CFG.sensores.forEach((s) => {
    const r = new RadarLD2450(s);
    const porta = new SerialPort({ path: s.porta, baudRate: 256000 });
    porta.on('data', (d) => r.alimentar(d));
    porta.on('error', (e) => console.error('[' + s.id + ']', e.message));
    radares.push(r);
  });
}

// -------------------------------------------------------------------- fantasma
// Sem radar, uma pessoa vai e volta pelo corredor: valida a parede inteira
// antes dos sensores estarem calibrados.
let fantasma = { x: -800, dir: 1 };
function pessoaFantasma(dt) {
  fantasma.x += 1300 * fantasma.dir * dt / 1000;
  if (fantasma.x > 12800) fantasma.dir = -1;
  if (fantasma.x < -800) fantasma.dir = 1;
  return [{ id: 1, x: fantasma.x, v: 1300 * fantasma.dir }];
}

// ------------------------------------------------------------------- varredura
let varreduraIdx = 0;
function quadroVarredura() {
  const rgb = new Uint8Array(mapa.pixels.length * 3);
  const i = varreduraIdx % mapa.pixels.length;
  rgb[i * 3] = 255; rgb[i * 3 + 1] = 255; rgb[i * 3 + 2] = 255;
  if (varreduraIdx % 8 === 0) {
    const p = mapa.pixels[i];
    process.stdout.write('\rpixel ' + i + '  strand ' + p.strand +
                         '  x=' + Math.round(p.x) + 'mm  ');
  }
  varreduraIdx++;
  return rgb;
}

// ------------------------------------------------------------------ envio sACN
const bufUniverso = Buffer.alloc(512);
function enviarQuadro(rgb) {
  universos.forEach((u) => {
    for (let n = 0; n < u.qtd; n++) {
      bufUniverso.fill(0);
      const primeiro = n * 512 / 3 | 0;
      let escrito = 0;
      for (let k = primeiro; k < u.indices.length && escrito + 3 <= 512; k++) {
        const src = u.indices[k] * 3;
        bufUniverso[escrito++] = rgb[src];
        bufUniverso[escrito++] = rgb[src + 1];
        bufUniverso[escrito++] = rgb[src + 2];
      }
      if (escrito > 0) emissor.enviar(u.ip, u.base + n, bufUniverso);
    }
  });
}

// ------------------------------------------------------------- agenda de brilho
// O repouso e o maior consumidor do sistema: fica ligado o dia inteiro.
function brilhoDaHora() {
  const h = new Date().getHours();
  const faixa = CFG.agenda.find((f) => (f.de <= f.ate)
    ? (h >= f.de && h < f.ate)
    : (h >= f.de || h < f.ate));
  return faixa ? faixa.brilho : 1;
}

// ------------------------------------------------------------------ laco 40 fps
const periodo = 1000 / CFG.taxaQuadros;
let ultimo = process.hrtime.bigint();
let conta = 0, somaMs = 0;

setInterval(() => {
  const agora = process.hrtime.bigint();
  const dt = Number(agora - ultimo) / 1e6;
  ultimo = agora;
  const t0 = process.hrtime.bigint();

  let rgb;
  if (modoVarredura) {
    rgb = quadroVarredura();
  } else {
    motor.cfg.brilhoMestre = brilhoDaHora();
    const pessoas = modoSimulacao
      ? pessoaFantasma(dt)
      : fusao.processar(radares.map((r) => r.alvos));
    motor.setPessoas(pessoas);
    rgb = motor.passo(dt);
  }
  enviarQuadro(rgb);

  somaMs += Number(process.hrtime.bigint() - t0) / 1e6;
  if (++conta % (CFG.taxaQuadros * 10) === 0) {
    const t = motor.telemetria();
    console.log([
      new Date().toISOString().slice(11, 19),
      t.estado.padEnd(11),
      'pessoas=' + t.pessoas,
      'A=' + t.correnteA.toFixed(1),
      'W=' + Math.round(t.consumoW),
      'abl=' + t.abl.toFixed(2),
      'cpu=' + (somaMs / conta).toFixed(2) + 'ms/quadro',
      'radar=' + radares.map((r) => r.vivo ? 'ok' : 'MUDO').join('/')
    ].join('  '));
  }
}, periodo);

process.on('SIGINT', () => {
  console.log('\napagando...');
  enviarQuadro(new Uint8Array(mapa.pixels.length * 3));
  setTimeout(() => { emissor.fechar(); process.exit(0); }, 120);
});
