/* Gera desenhos/elevacao-tecnica.svg a partir do layout mestre.
 * Desenho de fabricacao: canaletas, cortes de painel, pecas impressas,
 * pontos de emenda e cotas. Escala 1:20 na impressao (viewBox em mm). */
'use strict';
const fs = require('fs');
const path = require('path');
const LAYOUT = require('../sistema/layout.js');
const ELETRICA = require('../sistema/eletrica.js');

const L = LAYOUT.CORREDOR;
const mapa = LAYOUT.gerarMapaPixels();
const calc = ELETRICA.calcular();

const MARGEM_X = 2100, MARGEM_TOPO = 900, MARGEM_BASE = 1500;
const H_DESENHO = L.faixaAltura + 520;                 // faixa + rodape + piso
const W = L.comprimento + MARGEM_X * 2;
const H = H_DESENHO + MARGEM_TOPO + MARGEM_BASE;
const LARG_PAINEL = 1500, N_PAINEIS = 8;

// layout(y) -> svg(y).  Y=0 do layout fica a 320 mm acima da base do desenho.
const Y0 = MARGEM_TOPO + L.faixaAltura;
const ty = (y) => Y0 - y;
const tx = (x) => MARGEM_X + x;

const out = [];
const p = (s) => out.push(s);

p(`<?xml version="1.0" encoding="UTF-8"?>`);
p(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${(W/20).toFixed(0)}mm" height="${(H/20).toFixed(0)}mm">`);
p(`<title>Corredor Tecnologico Siemens - Elevacao tecnica</title>`);
p(`<defs>
  <pattern id="hatch" width="40" height="40" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="40" stroke="#5b6672" stroke-width="7"/>
  </pattern>
  <marker id="seta" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
    <path d="M0,0 L9,3 L0,6 z" fill="#1d2733"/>
  </marker>
</defs>`);
p(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);

// ---------------------------------------------------------------- moldura
p(`<rect x="30" y="30" width="${W-60}" height="${H-60}" fill="none" stroke="#1d2733" stroke-width="12"/>`);

// ---------------------------------------------------------------- piso e faixa
p(`<g id="arquitetura">`);
p(`<rect x="${tx(0)}" y="${ty(L.faixaAltura)}" width="${L.comprimento}" height="${L.faixaAltura}" fill="#f3f5f7" stroke="#1d2733" stroke-width="9"/>`);
// piso acabado (NPA) - a faixa comeca 200 mm acima
p(`<line x1="${tx(-600)}" y1="${ty(-L.faixaBase)}" x2="${tx(L.comprimento+600)}" y2="${ty(-L.faixaBase)}" stroke="#1d2733" stroke-width="14"/>`);
for (let i = 0; i < 44; i++) {
  const x = tx(-600) + i * 300;
  p(`<line x1="${x}" y1="${ty(-L.faixaBase)}" x2="${x-90}" y2="${ty(-L.faixaBase)+90}" stroke="#8a97a5" stroke-width="6"/>`);
}
p(`<text x="${tx(L.comprimento+660)}" y="${ty(-L.faixaBase)+14}" font-family="Helvetica,Arial" font-size="62" fill="#1d2733">NPA +0,00</text>`);
// rodape luminoso (perfil de aluminio)
p(`<rect x="${tx(0)}" y="${ty(L.rodapeY)-38}" width="${L.comprimento}" height="76" fill="#dfe6ec" stroke="#1d2733" stroke-width="7"/>`);
p(`</g>`);

// ---------------------------------------------------------------- juntas de painel
p(`<g id="paineis">`);
for (let i = 0; i <= N_PAINEIS; i++) {
  const x = i * LARG_PAINEL;
  p(`<line x1="${tx(x)}" y1="${ty(L.faixaAltura)}" x2="${tx(x)}" y2="${ty(0)}" stroke="#c2ccd6" stroke-width="7" stroke-dasharray="60 40"/>`);
  if (i < N_PAINEIS) {
    p(`<text x="${tx(x + LARG_PAINEL/2)}" y="${ty(L.faixaAltura)-40}" text-anchor="middle" font-family="Helvetica,Arial" font-size="76" font-weight="bold" fill="#7d8b99">P${i+1}</text>`);
  }
}
p(`</g>`);

// ---------------------------------------------------------------- canaletas (trilhas)
p(`<g id="canaletas" fill="none" stroke-linecap="round" stroke-linejoin="round">`);
mapa.tracos.forEach((tr) => {
  const d = tr.pts.map((pt, i) => `${i ? 'L' : 'M'}${tx(pt[0]).toFixed(1)},${ty(pt[1]).toFixed(1)}`).join(' ');
  const cor = tr.halo ? '#9aa7b4' : '#0a7f8c';
  const dash = tr.halo ? ' stroke-dasharray="70 45"' : '';
  p(`<path d="${d}" stroke="${cor}" stroke-width="14"${dash}/>`);
});
p(`</g>`);

// ------------------------------------------------- pontos de emenda (cantos)
// Cada vertice = corte da fita + furo passante + jumper de 3 vias por tras.
p(`<g id="emendas">`);
mapa.tracos.forEach((tr) => {
  for (let i = 1; i < tr.pts.length - 1; i++) {
    p(`<circle cx="${tx(tr.pts[i][0]).toFixed(1)}" cy="${ty(tr.pts[i][1]).toFixed(1)}" r="26" fill="#ffffff" stroke="#c2410c" stroke-width="9"/>`);
  }
});
p(`</g>`);

// ------------------------------------------------------ vias (ilhas pintadas)
// Ponta de trilha que nao encosta em nenhuma outra vira uma ilha circular
// pintada. Custo zero de LED e de eletronica, ganho grande de densidade visual.
p(`<g id="vias">`);
const pontas = [];
mapa.tracos.forEach((tr) => { if (!tr.halo) { pontas.push(tr.pts[0]); pontas.push(tr.pts[tr.pts.length-1]); } });
const livres = pontas.filter((a) => {
  if (a[0] <= 2 || a[0] >= L.comprimento - 2) return false;   // borda do painel nao e ponta livre
  return pontas.filter((b) => Math.hypot(a[0]-b[0], a[1]-b[1]) < 60).length === 1;
});
livres.forEach((v) => {
  p(`<circle cx="${tx(v[0])}" cy="${ty(v[1])}" r="46" fill="none" stroke="#0a7f8c" stroke-width="13"/>`);
  p(`<circle cx="${tx(v[0])}" cy="${ty(v[1])}" r="17" fill="#0a7f8c"/>`);
});
p(`</g>`);
console.log('   vias (ilhas pintadas) geradas:', livres.length);

// ---------------------------------------------------------------- componentes 3D
p(`<g id="componentes">`);
LAYOUT.COMPONENTES.forEach((c) => {
  p(`<rect x="${tx(c.x)}" y="${ty(c.y + c.a)}" width="${c.l}" height="${c.a}" fill="url(#hatch)" stroke="#1d2733" stroke-width="10"/>`);
  const fs_ = c.l > 250 ? 62 : 44;
  p(`<text x="${tx(c.x + c.l/2)}" y="${ty(c.y + c.a/2) + fs_/3}" text-anchor="middle" font-family="Helvetica,Arial" font-size="${fs_}" font-weight="bold" fill="#0f1720">${c.id}</text>`);
  // pinos do encapsulamento
  if (c.pinos) {
    const passo = c.l / (c.pinos + 1);
    for (let i = 1; i <= c.pinos; i++) {
      const px = tx(c.x + passo * i);
      p(`<line x1="${px}" y1="${ty(c.y + c.a)}" x2="${px}" y2="${ty(c.y + c.a) - 46}" stroke="#1d2733" stroke-width="9"/>`);
      p(`<line x1="${px}" y1="${ty(c.y)}" x2="${px}" y2="${ty(c.y) + 46}" stroke="#1d2733" stroke-width="9"/>`);
    }
  }
});
p(`</g>`);

// ---------------------------------------------------------------- marca
const M = LAYOUT.MARCA;
p(`<g id="marca">`);
p(`<rect x="${tx(M.protecao.x)}" y="${ty(M.protecao.y + M.protecao.a)}" width="${M.protecao.l}" height="${M.protecao.a}" fill="none" stroke="#b45309" stroke-width="9" stroke-dasharray="90 60"/>`);
p(`<text x="${tx(M.protecao.x + M.protecao.l/2)}" y="${ty(M.protecao.y) + 96}" text-anchor="middle" font-family="Helvetica,Arial" font-size="52" fill="#b45309">ZONA DE PROTECAO DA MARCA - nenhuma trilha invade</text>`);
p(`<rect x="${tx(M.x)}" y="${ty(M.y + M.alturaCaixa)}" width="${M.largura}" height="${M.alturaCaixa}" fill="none" stroke="#1d2733" stroke-width="9"/>`);
p(`<text x="${tx(M.x + M.largura/2)}" y="${ty(M.y + M.alturaCaixa/2) + 62}" text-anchor="middle" font-family="Helvetica,Arial" font-size="180" font-weight="bold" letter-spacing="14" fill="#1d2733">SIEMENS</text>`);
p(`<text x="${tx(M.x + M.largura/2)}" y="${ty(M.assinaturaY) + 20}" text-anchor="middle" font-family="Helvetica,Arial" font-size="66" fill="#4a5865">${M.assinatura}</text>`);
p(`<text x="${tx(M.x)}" y="${ty(M.assinaturaY) - 130}" font-family="Helvetica,Arial" font-size="46" fill="#7d8b99">letreiro: aplicar arte oficial do brand book - nao redesenhar</text>`);
p(`</g>`);

// ---------------------------------------------------------------- sensores
p(`<g id="sensores">`);
LAYOUT.SENSORES.forEach((s) => {
  const sx = tx(s.x), sy = ty(s.alturaMontagem - L.faixaBase);
  p(`<rect x="${sx-70}" y="${sy-70}" width="140" height="140" fill="#fff" stroke="#0f766e" stroke-width="12"/>`);
  p(`<text x="${sx}" y="${sy+22}" text-anchor="middle" font-family="Helvetica,Arial" font-size="62" font-weight="bold" fill="#0f766e">R</text>`);
  const alvo = tx(s.x + s.sentido * s.alcance);
  p(`<line x1="${sx + s.sentido*90}" y1="${sy}" x2="${alvo}" y2="${sy}" stroke="#0f766e" stroke-width="8" stroke-dasharray="120 70" marker-end="url(#seta)"/>`);
  p(`<text x="${(sx+alvo)/2}" y="${sy-40}" text-anchor="middle" font-family="Helvetica,Arial" font-size="56" fill="#0f766e">${s.id} ${s.modelo} - cobertura ${s.alcance/1000} m</text>`);
});
p(`</g>`);

// ---------------------------------------------------------------- zonas
const ZONAS_G = [
  { id: 'A', x0: 0, x1: 3400, t: 'BARRAMENTO DE ENTRADA' },
  { id: 'B', x0: 3400, x1: 6280, t: 'NUCLEO / CPU' },
  { id: 'C', x0: 6280, x1: 8980, t: 'MARCA' },
  { id: 'D', x0: 8980, x1: 12000, t: 'MALHA DE DADOS' }
];
p(`<g id="zonas">`);
const yZ = ty(0) + 250;
ZONAS_G.forEach((z) => {
  p(`<line x1="${tx(z.x0)}" y1="${yZ}" x2="${tx(z.x1)}" y2="${yZ}" stroke="#4a5865" stroke-width="10"/>`);
  p(`<line x1="${tx(z.x0)}" y1="${yZ-40}" x2="${tx(z.x0)}" y2="${yZ+40}" stroke="#4a5865" stroke-width="10"/>`);
  p(`<line x1="${tx(z.x1)}" y1="${yZ-40}" x2="${tx(z.x1)}" y2="${yZ+40}" stroke="#4a5865" stroke-width="10"/>`);
  p(`<text x="${tx((z.x0+z.x1)/2)}" y="${yZ+95}" text-anchor="middle" font-family="Helvetica,Arial" font-size="62" font-weight="bold" fill="#4a5865">ZONA ${z.id} - ${z.t}</text>`);
});
p(`</g>`);

// ---------------------------------------------------------------- zonas de forca
p(`<g id="forca">`);
const yF = ty(0) + 480;
calc.zonas.forEach((z) => {
  p(`<line x1="${tx(z.x0)}" y1="${yF}" x2="${tx(Math.min(z.x1,12000))}" y2="${yF}" stroke="#b91c1c" stroke-width="10"/>`);
  p(`<line x1="${tx(z.x0)}" y1="${yF-40}" x2="${tx(z.x0)}" y2="${yF+40}" stroke="#b91c1c" stroke-width="10"/>`);
  p(`<text x="${tx((z.x0+Math.min(z.x1,12000))/2)}" y="${yF+95}" text-anchor="middle" font-family="Helvetica,Arial" font-size="56" fill="#b91c1c">${z.id} | ${z.fonte} LRS-450-12 | ${z.qtdPixels} px | ${z.metrosFita.toFixed(1)} m | ${z.potenciaComABL_W.toFixed(0)} W op.</text>`);
});
p(`<line x1="${tx(12000)}" y1="${yF-40}" x2="${tx(12000)}" y2="${yF+40}" stroke="#b91c1c" stroke-width="10"/>`);
p(`</g>`);

// ---------------------------------------------------------------- cotas
p(`<g id="cotas" font-family="Helvetica,Arial" fill="#1d2733">`);
const yC = ty(L.faixaAltura) - 260;
p(`<line x1="${tx(0)}" y1="${yC}" x2="${tx(L.comprimento)}" y2="${yC}" stroke="#1d2733" stroke-width="8" marker-end="url(#seta)" marker-start="url(#seta)"/>`);
p(`<text x="${tx(L.comprimento/2)}" y="${yC-40}" text-anchor="middle" font-size="86" font-weight="bold">12.000 mm  =  8 x 1.500 (painel)</text>`);
for (let i = 0; i <= N_PAINEIS; i++) {
  const x = i * LARG_PAINEL;
  p(`<line x1="${tx(x)}" y1="${yC-45}" x2="${tx(x)}" y2="${yC+45}" stroke="#1d2733" stroke-width="8"/>`);
}
// cotas verticais
const xV = tx(0) - 300;
const cotas = [
  { y: L.rodapeY, r: '+0,08', t: 'eixo do rodape luminoso' },
  { y: 0,         r: '+0,20', t: 'base da faixa grafica' },
  { y: L.faixaAltura, r: '+2,05', t: 'topo da faixa grafica' }
];
cotas.forEach((c) => {
  p(`<line x1="${xV-160}" y1="${ty(c.y)}" x2="${tx(0)}" y2="${ty(c.y)}" stroke="#1d2733" stroke-width="7" stroke-dasharray="40 30"/>`);
  p(`<text x="${xV-170}" y="${ty(c.y)-18}" text-anchor="end" font-size="60" font-weight="bold">${c.r}</text>`);
  p(`<text x="${xV-170}" y="${ty(c.y)+52}" text-anchor="end" font-size="46" fill="#6b7a89">${c.t}</text>`);
});
p(`<line x1="${xV}" y1="${ty(0)}" x2="${xV}" y2="${ty(L.faixaAltura)}" stroke="#1d2733" stroke-width="8" marker-end="url(#seta)" marker-start="url(#seta)"/>`);
p(`<text transform="translate(${xV-40},${ty(L.faixaAltura/2)}) rotate(-90)" text-anchor="middle" font-size="66" font-weight="bold">1.850</text>`);
p(`</g>`);

// ---------------------------------------------------------------- legenda + selo
const yL = H - MARGEM_BASE + 380;
p(`<g id="legenda" font-family="Helvetica,Arial" fill="#1d2733">`);
p(`<rect x="${tx(0)}" y="${yL-70}" width="6400" height="800" fill="none" stroke="#c2ccd6" stroke-width="7"/>`);
p(`<text x="${tx(60)}" y="${yL+10}" font-size="70" font-weight="bold">LEGENDA</text>`);
const itens = [
  ['#0a7f8c', 'solid',  'Canaleta usinada 14 x 14 mm - fita WS2815 + difusor acrilico rente'],
  ['#9aa7b4', 'dash',   'Canaleta de halo - retroilumina o contorno da peca impressa'],
  ['#c2410c', 'circle', `Ponto de emenda (${mapa.totais.qtdCantos} no total) - corte + furo passante + jumper 3 vias por tras`],
  ['#b45309', 'dash',   'Zona de protecao da marca'],
  ['#0f766e', 'solid',  'Radar mmWave LD2450 + cone de cobertura'],
  ['#b91c1c', 'solid',  'Limite de zona de forca (1 fonte + 1 bloco de distribuicao por zona)']
];
itens.forEach((it, i) => {
  const y = yL + 120 + i * 105;
  if (it[1] === 'circle') p(`<circle cx="${tx(200)}" cy="${y-16}" r="26" fill="#fff" stroke="${it[0]}" stroke-width="9"/>`);
  else p(`<line x1="${tx(80)}" y1="${y-16}" x2="${tx(330)}" y2="${y-16}" stroke="${it[0]}" stroke-width="14"${it[1]==='dash'?' stroke-dasharray="70 45"':''}/>`);
  p(`<text x="${tx(410)}" y="${y}" font-size="56">${it[2]}</text>`);
});
p(`</g>`);

// selo
const xS = tx(L.comprimento) - 4200, yS = yL - 70;
p(`<g id="selo" font-family="Helvetica,Arial" fill="#1d2733">`);
p(`<rect x="${xS}" y="${yS}" width="4200" height="800" fill="none" stroke="#1d2733" stroke-width="10"/>`);
p(`<text x="${xS+70}" y="${yS+130}" font-size="96" font-weight="bold">CORREDOR TECNOLOGICO</text>`);
p(`<text x="${xS+70}" y="${yS+245}" font-size="72">Cliente: Siemens</text>`);
const linhas = [
  `Elevacao tecnica - parede de 12,00 m`,
  `${mapa.totais.qtdPixels} pixels enderecaveis | ${mapa.totais.metrosFita.toFixed(1)} m de fita | ${Object.keys(mapa.strands).length} saidas de dados`,
  `Pico com ABL: ${calc.total.potenciaComABL_W.toFixed(0)} W | rede 220 V: ${calc.total.correnteRede220A.toFixed(1)} A`,
  `Escala 1:20 em A1 | cotas em mm | rev. 00`
];
linhas.forEach((t, i) => p(`<text x="${xS+70}" y="${yS+350 + i*105}" font-size="56" fill="#4a5865">${t}</text>`));
p(`</g>`);

p(`</svg>`);

const destino = path.join(__dirname, '..', 'desenhos', 'elevacao-tecnica.svg');
fs.writeFileSync(destino, out.join('\n'));
console.log('OK ->', destino);
console.log('   ', (fs.statSync(destino).size / 1024).toFixed(0), 'kB |', W, 'x', H, 'mm |', mapa.totais.qtdCantos, 'emendas marcadas');
