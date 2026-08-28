/* Gera desenhos/material.png: a parede APAGADA em alta resolucao, usada como
 * textura pelo renderizador de video.
 *
 * Desenha com o mesmo sistema/material.js do simulador, via Chromium - assim a
 * parede do video e a mesma parede que o cliente aprovou na tela, incluindo o
 * letreiro com a tipografia certa. */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const LAYOUT = require('../sistema/layout.js');

const ESCALA = 0.35;                       // px por mm
const raiz = path.join(__dirname, '..');
const C = LAYOUT.CORREDOR;
const W = Math.round(C.comprimento * ESCALA);
const H = Math.round((C.faixaBase + C.faixaAltura) * ESCALA);

const tmp = process.env.SCRATCH || '/tmp';
const pagina = path.join(tmp, 'textura.html');
const destino = path.join(raiz, 'desenhos', 'material.png');

fs.writeFileSync(pagina, `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap">
<style>html,body{margin:0;padding:0;background:#000;overflow:hidden}
canvas{display:block;width:${W}px;height:${H}px}</style></head><body>
<canvas id="t" width="${W}" height="${H}"></canvas>
<script>${fs.readFileSync(path.join(raiz, 'sistema/layout.js'), 'utf8')}</script>
<script>${fs.readFileSync(path.join(raiz, 'sistema/material.js'), 'utf8')}</script>
<script>
function desenhar(){
  MATERIAL.desenharMaterial(document.getElementById('t').getContext('2d'),
                            { escala: ${ESCALA} });
  document.title = 'pronto';
}
// sem a fonte carregada, o letreiro sai no fallback
if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhar); else desenhar();
</script></body></html>`);

const chrome = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
execFileSync(chrome, [
  '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--virtual-time-budget=6000',
  '--screenshot=' + destino, '--window-size=' + W + ',' + H,
  'file://' + pagina
], { stdio: 'ignore' });

const { decodificar } = require('./png.js');
const img = decodificar(fs.readFileSync(destino));
console.log('OK ->', destino);
console.log('   ', img.largura + 'x' + img.altura, '|', img.canais, 'canais |',
            (fs.statSync(destino).size / 1024).toFixed(0), 'kB |', ESCALA, 'px/mm');
if (img.largura !== W || img.altura !== H) {
  console.error('AVISO: dimensao capturada difere da esperada', W + 'x' + H);
  process.exit(1);
}
