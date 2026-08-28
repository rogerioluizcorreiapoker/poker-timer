/* Costura o simulador num arquivo unico, pronto para publicar.
 * O simulador roda EXATAMENTE o mesmo layout.js e engine.js que o Raspberry
 * usa na parede - o que o cliente aprova e o que fica instalado. */
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const ler = (r) => fs.readFileSync(path.join(raiz, r), 'utf8');

const LAYOUT = require('../sistema/layout.js');
const ELETRICA = require('../sistema/eletrica.js');
const ENGINE = require('../sistema/engine.js');

// ---- numeros da ficha, medidos e nao digitados -----------------------------
const mapa = LAYOUT.gerarMapaPixels();
const calc = ELETRICA.calcular();
const maiorStrand = Math.max(...Object.values(mapa.strands).map((s) => s.qtd));

// Consumo de repouso: roda o proprio motor ate estabilizar e entao tira a
// media de um ciclo inteiro de respiracao - pegar o valor instantaneo faz o
// numero oscilar 1 W entre builds, o que so gera ruido no diff.
const motor = new ENGINE.Engine({ mapa });
for (let i = 0; i < 400; i++) { motor.setPessoas([]); motor.passo(25); }
let soma = 0;
for (let i = 0; i < 480; i++) { motor.setPessoas([]); motor.passo(25); soma += motor.consumoEstimadoW; }
const repousoW = Math.round(soma / 480);

const FICHA = {
  maiorStrand,
  tetoFps: Math.floor(1000 / (maiorStrand * 0.030)),
  qtdFontes: ELETRICA.FONTES.quantidade,
  potFonte: ELETRICA.FONTES.potenciaW,
  ablPorZona: ELETRICA.ABL.correnteMaxPorFonteA,
  picoW: Math.round(calc.total.potenciaComABL_W),
  redeA: calc.total.correnteRede220A.toFixed(1).replace('.', ','),
  repousoW
};

// ---- elevacao tecnica embutida ---------------------------------------------
// Tira a declaracao XML (invalida em innerHTML) e as dimensoes fixas em mm,
// para o desenho escalar dentro do container em vez de estourar a pagina.
let svg = ler('desenhos/elevacao-tecnica.svg')
  .replace(/<\?xml[^>]*\?>\s*/, '')
  .replace(/(<svg[^>]*?)\swidth="[^"]*"\sheight="[^"]*"/, '$1');

// ---- montagem ---------------------------------------------------------------
// A marca entra embutida em base64: o artifact e um arquivo unico, nao pode
// depender de imagem externa.
const logo = 'data:image/png;base64,' +
  fs.readFileSync(path.join(raiz, 'marca/nexlayer3d-web.png')).toString('base64');

let html = ler('simulador/template.html');
html = html.replace('/*INJETAR_LOGO*/', () => logo);
html = html.replace('/*INJETAR_LAYOUT*/', () => ler('sistema/layout.js'));
html = html.replace('/*INJETAR_MATERIAL*/', () => ler('sistema/material.js'));
html = html.replace('/*INJETAR_ENGINE*/', () =>
  ler('sistema/engine.js') +
  '\nvar FICHA = ' + JSON.stringify(FICHA) + ';' +
  '\nvar ELEVACAO_SVG = ' + JSON.stringify(svg) + ';'
);

if (html.includes('INJETAR_')) throw new Error('marcador de injecao nao substituido');

const destino = path.join(raiz, 'simulador', 'index.html');
fs.writeFileSync(destino, html);
console.log('OK ->', destino);
console.log('   ', (fs.statSync(destino).size / 1024).toFixed(0), 'kB');
console.log('    ficha:', JSON.stringify(FICHA));
