/* Gera cenarios/NexLayer3D-niveis-de-escopo.pdf: as tres versoes do corredor
 * lado a lado, com o que muda entre elas.
 *
 * Serve para virar um "nao cabe" em uma escolha. Tres opcoes ancoradas fecham
 * mais que um numero unico levado de volta para negociacao. */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const CENARIOS = require('../sistema/cenarios.js');

const raiz = path.join(__dirname, '..');
const r = CENARIOS.calcular();
const brl = (v) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
const logo = 'data:image/png;base64,' +
  fs.readFileSync(path.join(raiz, 'marca/nexlayer3d-tinta-web.png')).toString('base64');
const fontes = fs.readFileSync(path.join(raiz, 'marca/fontes-embutidas.css'), 'utf8');
const hoje = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

/* Linhas da tabela comparativa. Cada uma responde "o que muda de fato". */
const LINHAS = [
  ['Linha de luz', (c) => c.trilha.toString().replace('.', ',') + ' m'],
  ['Peças em relevo', (c) => c.pecas + (c.pecas === 1 ? ' peça' : ' peças')],
  ['Substrato', (c) => c.paineis ? 'Painéis de MDF usinados' : 'Parede preparada e pintada'],
  ['Embutimento da fita', (c) => c.canaletaUsinada ? 'Canaleta usinada, difusor rente'
                                                   : 'Perfil de alumínio de superfície'],
  ['A luz acompanha a pessoa', () => 'sim'],
  ['Cobertura do sensoriamento', (c) => c.controle === 'completo'
      ? 'Posição de até 3 pessoas, corredor inteiro' : 'Posição de 1 pessoa por vez'],
  ['Letreiro', (c) => c.letreiro === 'acrilico' ? 'Acrílico' : 'Vinil recortado'],
  ['Prazo', (c) => c.semanas + ' semanas']
];

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>${fontes}</style>
<style>
  @page { size: A4 landscape; margin: 0; }
  *{box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact}
  :root{
    --tinta:#101a1e; --fraca:#56666d; --apagada:#8a9aa0; --fio:#d9e2e4;
    --petrol:#10767f; --veu:#eef6f6;
    --cond:'Barlow Condensed',sans-serif; --texto:'Archivo',sans-serif;
    --mono:'JetBrains Mono',monospace;
  }
  html,body{margin:0;padding:0;background:#fff}
  body{width:297mm; height:210mm; padding:11mm 13mm 9mm;
       font-family:var(--texto); font-size:8.6pt; line-height:1.4; color:var(--tinta);
       display:flex; flex-direction:column}
  h1{margin:0; font-family:var(--cond); font-weight:700; font-size:19pt;
     letter-spacing:.01em; text-transform:uppercase; line-height:1}

  .topo{display:flex; align-items:flex-end; justify-content:space-between; gap:10mm;
        border-bottom:1.4pt solid var(--tinta); padding-bottom:3mm; margin-bottom:4mm}
  .topo img{height:10mm; width:auto; display:block}
  .topo .meio{flex:1}
  .topo .tipo{font-family:var(--cond); font-weight:600; font-size:9.5pt; letter-spacing:.18em;
              text-transform:uppercase; color:var(--petrol); margin-bottom:1mm}
  .topo .ref{font-family:var(--mono); font-size:6.8pt; color:var(--apagada); text-align:right}

  .lead{font-size:8.8pt; color:var(--fraca); max-width:175mm; margin-bottom:4.5mm}
  .lead b{color:var(--tinta)}

  table{width:100%; border-collapse:collapse; table-layout:fixed}
  th,td{padding:2mm 3.5mm; border-bottom:.5pt solid var(--fio); vertical-align:top}
  .rot{width:42mm; font-family:var(--cond); font-weight:600; font-size:8.4pt;
       letter-spacing:.09em; text-transform:uppercase; color:var(--fraca)}
  thead th{border-bottom:1pt solid var(--tinta); padding-bottom:2.5mm}
  thead .nome{font-family:var(--cond); font-weight:700; font-size:15pt; letter-spacing:.05em;
              text-transform:uppercase; text-align:left; line-height:1}
  thead .preco{font-family:var(--mono); font-weight:700; font-size:17pt; color:var(--petrol);
               display:block; margin-top:1.5mm}
  thead .prop{font-size:7.4pt; color:var(--apagada); display:block; margin-top:1mm;
              font-family:var(--texto); font-weight:400; letter-spacing:0; text-transform:none}
  td{font-size:8.4pt}
  col.destaque, .destaque{background:var(--veu)}
  tbody tr:last-child td{border-bottom:none}

  .resumo td{font-size:8pt; color:var(--fraca); line-height:1.4; padding-top:2.5mm;
             padding-bottom:3mm; border-bottom:1pt solid var(--fio)}

  .rodape{margin-top:auto; padding-top:3.5mm; border-top:.6pt solid var(--fio);
          display:flex; justify-content:space-between; gap:8mm; align-items:flex-start}
  .rodape .nota{font-size:7.6pt; color:var(--fraca); max-width:190mm}
  .rodape .nota b{color:var(--tinta)}
  .rodape .assina{font-size:7.2pt; color:var(--apagada); text-align:right; white-space:nowrap}
</style></head>
<body>

  <div class="topo">
    <img src="${logo}" alt="NexLayer3D">
    <div class="meio">
      <div class="tipo">Níveis de escopo</div>
      <h1>Corredor Tecnológico — três versões</h1>
    </div>
    <div class="ref">REV 00 · ${hoje}<br>validade 30 dias</div>
  </div>

  <div class="lead">O mesmo comportamento em três tamanhos de obra. <b>O que muda é a quantidade
  de desenho na parede e o modo de embutir a fita</b> — não a inteligência: as três versões rodam
  o mesmo motor, e nas três a luz acompanha quem caminha pelo corredor.</div>

  <table>
    <colgroup>
      <col style="width:42mm"><col><col><col class="destaque">
    </colgroup>
    <thead>
      <tr>
        <th></th>
        ${r.map((c) => `<th class="${c.id === 'essencial' ? 'destaque' : ''}">
          <span class="nome">${c.nome}</span>
          <span class="preco">${brl(c.preco)}</span>
          <span class="prop">${Math.round(c.proporcaoTrilha * 100)}% do desenho original</span>
        </th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr class="resumo">
        <td class="rot">Em uma frase</td>
        ${r.map((c) => `<td class="${c.id === 'essencial' ? 'destaque' : ''}">${c.resumo}</td>`).join('')}
      </tr>
      ${LINHAS.map((l) => `<tr>
        <td class="rot">${l[0]}</td>
        ${r.map((c) => `<td class="${c.id === 'essencial' ? 'destaque' : ''}">${l[1](c)}</td>`).join('')}
      </tr>`).join('\n      ')}
    </tbody>
  </table>

  <div class="rodape">
    <div class="nota"><b>Todas incluem</b> material, execução, engenharia e comissionamento.
    Ficam de fora obra civil, ponto de energia, andaimes, taxas de acesso, ART e impostos.
    O vídeo e a simulação apresentados mostram a versão <b>Completo</b> — a densidade de desenho
    das outras duas é menor, e vale alinhar isso com o cliente final antes de fechar.</div>
    <div class="assina"><b style="color:var(--fraca)">NexLayer3D</b><br>projeto, engenharia e execução</div>
  </div>

</body></html>`;

const destHtml = path.join(raiz, 'cenarios', 'niveis-de-escopo.html');
fs.mkdirSync(path.dirname(destHtml), { recursive: true });
fs.writeFileSync(destHtml, html);

const destPdf = path.join(raiz, 'cenarios', 'NexLayer3D-niveis-de-escopo.pdf');
execFileSync(process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', [
  '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  '--virtual-time-budget=6000', '--print-to-pdf=' + destPdf, 'file://' + destHtml
], { stdio: 'ignore' });

const zlib = require('zlib');
const bruto = fs.readFileSync(destPdf);
const pedacos = [bruto];
const re = /stream\r?\n/g;
let m;
while ((m = re.exec(bruto.toString('latin1'))) !== null) {
  const ini = m.index + m[0].length;
  const fim = bruto.indexOf('endstream', ini);
  if (fim > 0) { try { pedacos.push(zlib.inflateSync(bruto.subarray(ini, fim))); } catch (e) { /* ok */ } }
}
const paginas = (Buffer.concat(pedacos).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

console.log('OK ->', destPdf);
console.log('    páginas:', paginas, paginas === 1 ? '' : '<-- ATENÇÃO: deveria ser 1');
r.forEach((c) => console.log('   ', c.nome.padEnd(10), brl(c.preco).padStart(11),
  '| margem', brl(c.preco - c.custo).padStart(9), '|', c.semanas, 'semanas'));
