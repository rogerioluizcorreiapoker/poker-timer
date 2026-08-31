/* Gera orcamento/orcamento-material.html e o PDF de uma pagina.
 *
 * Documento enxuto para o parceiro integrador: custo de material agrupado por
 * FUNCAO, prazo de execucao, e o que fica de fora. Sem modelo de componente,
 * sem arquitetura, sem o caminho para refazer o sistema.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ORCAMENTO = require('../sistema/orcamento.js');

const raiz = path.join(__dirname, '..');
const r = ORCAMENTO.calcular();
const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR');

const logo = 'data:image/png;base64,' +
  fs.readFileSync(path.join(raiz, 'marca/nexlayer3d-tinta-web.png')).toString('base64');

const hoje = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

/* Fontes embutidas em vez do link do Google: o Chromium headless deste
 * ambiente nao busca a fonte na hora de imprimir, cai no fallback (mais
 * largo) e o documento estoura de uma para tres paginas. */
const fontes = fs.readFileSync(path.join(raiz, 'marca/fontes-embutidas.css'), 'utf8');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>${fontes}</style>
<style>
  @page { size: A4; margin: 0; }
  *{box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact}
  :root{
    --tinta:#101a1e; --fraca:#56666d; --apagada:#8a9aa0;
    --fio:#d9e2e4; --petrol:#10767f; --veu:#eef6f6;
    --cond:'Barlow Condensed',sans-serif; --texto:'Archivo',sans-serif;
    --mono:'JetBrains Mono',monospace;
  }
  html,body{margin:0; padding:0; background:#fff}
  body{width:210mm; min-height:297mm; padding:12mm 16mm 10mm;
       font-family:var(--texto); font-size:8.6pt; line-height:1.4; color:var(--tinta)}
  h1,h2{margin:0}
  .mono{font-family:var(--mono); font-variant-numeric:tabular-nums}

  .topo{display:flex; align-items:flex-end; justify-content:space-between; gap:14mm;
        border-bottom:1.6pt solid var(--tinta); padding-bottom:4mm}
  .topo img{height:11.5mm; width:auto; display:block}
  .topo .dir{text-align:right}
  .topo .tipo{font-family:var(--cond); font-weight:700; font-size:14pt; letter-spacing:.12em;
              text-transform:uppercase; line-height:1}
  .topo .ref{font-family:var(--mono); font-size:7pt; color:var(--apagada); margin-top:1.5mm}

  h1{font-family:var(--cond); font-weight:700; font-size:20pt; letter-spacing:.01em;
     text-transform:uppercase; margin:3mm 0 3mm; line-height:1.05}
  .linha-obra{font-size:9pt; color:var(--fraca); margin-bottom:2.6mm}

  .aviso{border:1pt solid var(--petrol); background:var(--veu); padding:2.3mm 4mm;
         margin-bottom:3.5mm; display:flex; gap:4mm; align-items:baseline}
  .aviso .marcador{font-family:var(--cond); font-weight:700; font-size:8pt; letter-spacing:.14em;
         text-transform:uppercase; color:var(--petrol); white-space:nowrap}
  .aviso p{margin:0; font-size:8.6pt; color:var(--tinta)}

  h2{font-family:var(--cond); font-weight:700; font-size:11pt; letter-spacing:.14em;
     text-transform:uppercase; color:var(--petrol); margin:0 0 2.5mm;
     padding-bottom:1.2mm; border-bottom:.6pt solid var(--fio)}
  section{margin-bottom:2.2mm}

  table{width:100%; border-collapse:collapse}
  td,th{padding:1.2mm 0; vertical-align:top; border-bottom:.5pt solid var(--fio)}
  .g-nome{font-weight:600; font-size:8.9pt}
  .g-desc{font-size:7.2pt; color:var(--fraca); line-height:1.32; margin-top:.3mm}
  .g-valor{font-family:var(--mono); font-weight:700; font-size:10pt; text-align:right;
           white-space:nowrap; width:28mm}
  tr.sub td{border-top:.8pt solid var(--fio); border-bottom:none; padding-top:2mm}
  tr.sub .g-nome{font-family:var(--cond); font-weight:600; font-size:9.5pt;
                 letter-spacing:.1em; text-transform:uppercase; color:var(--fraca)}
  tr.sub .g-valor{font-size:10.5pt; color:var(--fraca)}
  tr.total td{border-bottom:none; border-top:1.4pt solid var(--tinta); padding-top:2.6mm}
  tr.total .g-nome{font-family:var(--cond); font-weight:700; font-size:12pt;
                   letter-spacing:.08em; text-transform:uppercase}
  tr.total .g-valor{font-size:15pt; color:var(--petrol)}
  .nota-total{font-size:7.8pt; color:var(--fraca); margin-top:1.5mm; text-align:right}

  .prazo td{padding:1.2mm 0}
  .prazo .et{font-size:9pt}
  .prazo .sem{font-family:var(--mono); text-align:right; width:26mm; font-size:9pt}
  .prazo tr.total .et{font-family:var(--cond); font-weight:700; font-size:11.5pt;
                      letter-spacing:.08em; text-transform:uppercase}
  .prazo tr.total .sem{font-weight:700; font-size:12.5pt; color:var(--petrol)}

  p.fora{margin:0; font-size:8.4pt; color:var(--fraca); line-height:1.5}

  .faixa-prazo{display:flex; gap:0; border:.6pt solid var(--fio)}
  .etapa{flex:1; padding:2.4mm 3mm; border-right:.6pt solid var(--fio)}
  .etapa:last-child{border-right:none}
  .etapa.fim{background:var(--veu); flex:0 0 30mm}
  .etapa .n{font-family:var(--mono); font-weight:700; font-size:13pt; line-height:1;
            color:var(--tinta)}
  .etapa.fim .n{color:var(--petrol)}
  .etapa .l{font-size:7.2pt; color:var(--fraca); line-height:1.3; margin-top:1mm}

  footer{border-top:.6pt solid var(--fio); padding-top:3mm; margin-top:auto;
         display:flex; justify-content:space-between; gap:8mm;
         font-size:7.6pt; color:var(--apagada)}
  .envoltorio{min-height:calc(297mm - 22mm); display:flex; flex-direction:column}
</style></head>
<body><div class="envoltorio">

  <div class="topo">
    <img src="${logo}" alt="NexLayer3D">
    <div class="dir">
      <div class="tipo">Orçamento</div>
      <div class="ref">REV 00 · ${hoje} · validade 30 dias</div>
    </div>
  </div>

  <h1>Corredor Tecnológico</h1>

  <div class="aviso">
    <span class="marcador">Preço fechado</span>
    <p>Parede cinética de 12,00 m em LED endereçável embutido, com componentes em relevo
    impressos em 3D e reação automática à passagem de pessoas. Inclui
    <strong>material, execução e engenharia</strong>, do projeto executivo ao comissionamento
    com o corredor em uso.</p>
  </div>

  <section>
    <h2>Material por sistema</h2>
    <table>
      <tbody>
        ${r.material.map((g) => `<tr>
          <td><div class="g-nome">${g.nome}</div><div class="g-desc">${g.descricao}</div></td>
          <td class="g-valor">${brl(g.preco)}</td>
        </tr>`).join('\n        ')}
        <tr class="sub"><td class="g-nome">Subtotal de material</td>
          <td class="g-valor">${brl(r.subtotalMaterial)}</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>Execução e engenharia</h2>
    <table>
      <tbody>
        ${r.servico.map((g) => `<tr>
          <td><div class="g-nome">${g.nome}</div><div class="g-desc">${g.descricao}</div></td>
          <td class="g-valor">${brl(g.preco)}</td>
        </tr>`).join('\n        ')}
        <tr class="sub"><td class="g-nome">Subtotal de execução</td>
          <td class="g-valor">${brl(r.subtotalServico)}</td></tr>
        <tr class="total">
          <td class="g-nome">Total</td>
          <td class="g-valor">${brl(r.preco)}</td>
        </tr>
      </tbody>
    </table>
    <div class="nota-total">valores sujeitos a recotação após a validade ·
    itens importados sujeitos a variação cambial</div>
  </section>

  <section>
    <h2>Tempo de execução</h2>
    <div class="faixa-prazo">
      ${r.prazo.map((p) => `<div class="etapa">
        <div class="n">${p[1]}</div><div class="l">${p[0]}</div></div>`).join('')}
      <div class="etapa fim"><div class="n">${r.semanas}</div><div class="l">semanas no total</div></div>
    </div>
  </section>

  <section>
    <h2>Não incluso</h2>
    <p class="fora">${r.fora.join(' · ')}.</p>
  </section>

  <footer>
    <span><strong style="color:var(--fraca)">NexLayer3D</strong> · projeto, engenharia e execução</span>
    <span>Sujeito a medição no local · pagamento 30% assinatura · 40% bancada · 30% entrega</span>
  </footer>

</div></body></html>`;

const destHtml = path.join(raiz, 'orcamento', 'orcamento.html');
fs.writeFileSync(destHtml, html);

const destPdf = path.join(raiz, 'orcamento', 'NexLayer3D-orcamento.pdf');
execFileSync(process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', [
  '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  '--virtual-time-budget=6000', '--print-to-pdf=' + destPdf, 'file://' + destHtml
], { stdio: 'ignore' });

// Conta as paginas do PDF gerado. O documento tem que fechar em uma folha -
// se o conteudo crescer, isso aqui avisa em vez de deixar passar batido.
const zlib = require('zlib');
const bruto = fs.readFileSync(destPdf);
const pedacos = [bruto];
const re = /stream\r?\n/g;
let m;
while ((m = re.exec(bruto.toString('latin1'))) !== null) {
  const ini = m.index + m[0].length;
  const fim = bruto.indexOf('endstream', ini);
  if (fim > 0) { try { pedacos.push(zlib.inflateSync(bruto.subarray(ini, fim))); } catch (e) { /* nao inflavel */ } }
}
const paginas = (Buffer.concat(pedacos).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

console.log('OK ->', destPdf);
console.log('    páginas:', paginas, paginas === 1 ? '' : '<-- ATENÇÃO: deveria ser 1');
console.log('   ', (fs.statSync(destPdf).size / 1024).toFixed(0), 'kB');
console.log('    preço:', brl(r.preco), '| custo:', brl(Math.round(r.custo)),
            '| margem efetiva:', r.margemEfetiva + '%', '| prazo:', r.semanas, 'semanas');
