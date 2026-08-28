/* Monta o video final: base 3D + cabecalho + marca d'agua + legendas.
 *
 * Separado do render de proposito - trocar o logo ou uma legenda leva segundos
 * aqui, contra minutos para renderizar os 930 quadros de novo.
 *
 *   node montar-video.js <base.mp4> <saida.mp4>
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const [base, destino] = process.argv.slice(2);
if (!base || !destino) { console.error('uso: montar-video.js <base.mp4> <saida.mp4>'); process.exit(1); }

const tmp = process.env.SCRATCH || '/tmp';
const ov = path.join(tmp, 'overlays');
const legendas = JSON.parse(fs.readFileSync(path.join(ov, 'tempos.json'), 'utf8'));
const MARCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'marca-dagua.json'), 'utf8'));
const DUR = 31;
const FADE = 0.35;

const args = ['-y', '-loglevel', 'error', '-i', base];
// entradas: cabecalho fixo + uma por legenda
args.push('-loop', '1', '-t', String(DUR), '-i', path.join(ov, 'fixo.png'));
legendas.forEach((_, i) => args.push('-loop', '1', '-t', String(DUR), '-i', path.join(ov, 'leg' + i + '.png')));

const filtros = [];
// o cabecalho e a marca entram junto com a imagem e ficam ate o fim
filtros.push('[1:v]format=rgba,fade=t=in:st=0.5:d=0.8:alpha=1[fixo]');
filtros.push('[0:v][fixo]overlay=0:0[v0]');

legendas.forEach((l, i) => {
  const ent = i + 2;
  filtros.push(`[${ent}:v]format=rgba,` +
    `fade=t=in:st=${l.de.toFixed(2)}:d=${FADE}:alpha=1,` +
    `fade=t=out:st=${(l.ate - FADE).toFixed(2)}:d=${FADE}:alpha=1[l${i}]`);
  filtros.push(`[v${i}][l${i}]overlay=0:0:enable='between(t,${(l.de - FADE).toFixed(2)},${l.ate.toFixed(2)})'[v${i + 1}]`);
});
// abre e fecha em preto
filtros.push(`[v${legendas.length}]fade=t=in:st=0:d=0.7,fade=t=out:st=${DUR - 1.1}:d=1.1[final]`);

args.push('-filter_complex', filtros.join(';'), '-map', '[final]');
args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '21',
          '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
          '-movflags', '+faststart', '-t', String(DUR));

// autoria tambem nos metadados do arquivo, nao so na imagem
const autoria = MARCA.empresa + (MARCA.contato ? ' · ' + MARCA.contato : '');
args.push('-metadata', 'title=Corredor Tecnologico - proposta para Siemens');
args.push('-metadata', 'artist=' + autoria);
args.push('-metadata', 'copyright=' + autoria + ' - todos os direitos reservados');
args.push('-metadata', 'comment=Simulacao tecnica. Projeto e execucao: ' + autoria);
args.push(destino);

const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const r = spawnSync(ffmpeg, args, { stdio: ['ignore', 'inherit', 'inherit'] });
if (r.status !== 0) process.exit(r.status || 1);

const mb = fs.statSync(destino).size / 1024 / 1024;
console.log('OK ->', destino, '|', mb.toFixed(1), 'MB |', DUR + 's');
console.log('    marca d\'água:', MARCA.empresa, MARCA.logo ? '(logo + texto)' : '(TEXTO — sem logo)');
if (mb > 15) console.log('    ATENÇÃO: acima de 16 MB, limite de alguns clientes de WhatsApp');
