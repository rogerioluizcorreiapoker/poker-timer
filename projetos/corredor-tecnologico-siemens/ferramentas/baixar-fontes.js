/* Baixa as fontes do projeto e grava marca/fontes-embutidas.css com os arquivos
 * em data URI.
 *
 * Motivo: o Chromium headless deste ambiente nao busca as fontes do Google na
 * hora de renderizar. Tudo que foi rasterizado localmente - PDF, legendas do
 * video, textura da parede - caiu no fallback, que e mais largo e estourou o
 * layout do orcamento para tres paginas.
 *
 * As paginas publicadas (simulador e proposta) continuam usando o link do
 * Google: la quem renderiza e o navegador do leitor, que tem rede.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const FAMILIAS = [
  'Barlow+Condensed:wght@500;600;700',
  'Archivo:wght@400;500;600',
  'JetBrains+Mono:wght@400;700'
];
const SUBCONJUNTOS = ['latin', 'latin-ext'];   // suficiente para português

function buscar(url, binario) {
  return execFileSync('curl', ['-sSL', '-A', UA, url],
    { maxBuffer: 32 * 1024 * 1024, encoding: binario ? 'buffer' : 'utf8' });
}

let saida = '/* Fontes do projeto embutidas — gerado por ferramentas/baixar-fontes.js */\n';
let faces = 0, bytes = 0;

FAMILIAS.forEach((fam) => {
  const css = buscar('https://fonts.googleapis.com/css2?family=' + fam + '&display=swap', false);

  // cada bloco vem precedido de um comentario com o nome do subconjunto
  const blocos = css.split('/*').slice(1);
  blocos.forEach((bloco) => {
    const nome = bloco.slice(0, bloco.indexOf('*/')).trim();
    if (!SUBCONJUNTOS.includes(nome)) return;
    const corpo = bloco.slice(bloco.indexOf('*/') + 2);
    const url = (corpo.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/) || [])[1];
    if (!url) return;

    const dados = buscar(url, true);
    bytes += dados.length; faces++;
    saida += corpo
      .replace(/url\(https:\/\/fonts\.gstatic\.com[^)]+\)/,
               "url(data:font/woff2;base64," + dados.toString('base64') + ")")
      .trim() + '\n';
  });
});

const destino = path.join(__dirname, '..', 'marca', 'fontes-embutidas.css');
fs.writeFileSync(destino, saida);
console.log('OK ->', destino);
console.log('   ', faces, 'faces |', (bytes / 1024).toFixed(0), 'kB de fonte |',
            (fs.statSync(destino).size / 1024).toFixed(0), 'kB de CSS');
