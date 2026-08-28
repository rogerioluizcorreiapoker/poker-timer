/* Monta proposta/index.html: embute a marca e o link do simulador.
 * Arquivo unico, pronto para publicar. */
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

const LINK_SIMULADOR = process.env.LINK_SIMULADOR ||
  'https://claude.ai/code/artifact/307a51b2-3b59-44bb-93cb-d2de0a296206';

function embutir(rel) {
  return 'data:image/png;base64,' +
    fs.readFileSync(path.join(raiz, rel)).toString('base64');
}
const logoClaro = embutir('marca/nexlayer3d-web.png');
const logoTinta = embutir('marca/nexlayer3d-tinta-web.png');

let html = fs.readFileSync(path.join(raiz, 'proposta/template.html'), 'utf8');
html = html.split('/*INJETAR_LOGO_CLARO*/').join(logoClaro);
html = html.split('/*INJETAR_LOGO_TINTA*/').join(logoTinta);
html = html.split('__LINK_SIMULADOR__').join(LINK_SIMULADOR);

if (html.includes('INJETAR_') || html.includes('__LINK_')) {
  throw new Error('marcador nao substituido');
}
const destino = path.join(raiz, 'proposta', 'index.html');
fs.writeFileSync(destino, html);
console.log('OK ->', destino, '|', (fs.statSync(destino).size / 1024).toFixed(0), 'kB');
