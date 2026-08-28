/* Gera as sobreposicoes do video: cabecalho, marca d'agua e legendas de estado.
 * PNGs transparentes de 1280x720 desenhados no Chromium (tipografia de verdade)
 * e depois compostos pelo ffmpeg - esta build nao tem o filtro drawtext.
 *
 * A marca d'agua sai de ferramentas/marca-dagua.json: trocar o logo nao exige
 * renderizar o video de novo, so refazer a composicao. */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const L = 1280, A = 720;
const raiz = path.join(__dirname, '..');
const tmp = process.env.SCRATCH || '/tmp';
const saida = path.join(tmp, 'overlays');
fs.mkdirSync(saida, { recursive: true });

const MARCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'marca-dagua.json'), 'utf8'));

let logoTag = '';
if (MARCA.logo) {
  const p = path.isAbsolute(MARCA.logo) ? MARCA.logo : path.join(raiz, MARCA.logo);
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
  logoTag = '<img class="logo" src="data:' + mime + ';base64,' +
            fs.readFileSync(p).toString('base64') + '" alt="">';
}

/* Legendas alinhadas com os estados reais que o engine percorre no video. */
const LEGENDAS = [
  { de: 0.8,  ate: 4.0,  n: 'Repouso',     d: 'Corredor vazio. A parede respira devagar.' },
  { de: 4.25, ate: 7.6,  n: 'Despertar',   d: 'Alguém entrou. A energia parte da entrada usada.' },
  { de: 8.2,  ate: 14.6, n: 'Acompanhar',  d: 'A luz caminha 70 cm à frente da pessoa.' },
  { de: 15.6, ate: 19.2, n: 'Permanência', d: 'Parou. Os dados convergem para o processador.' },
  { de: 20.0, ate: 24.2, n: 'Acompanhar',  d: 'Voltou a andar. O halo segue junto.' },
  { de: 26.4, ate: 30.6, n: 'Adormecer',   d: 'Esvaziou. A energia escoa pelas pontas.',
    obs: 'espera de 12 s acelerada para o vídeo' }
];

const ESTILO = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap">
<style>
  html,body{margin:0;width:${L}px;height:${A}px;background:transparent;overflow:hidden}
  .quadro{position:relative;width:${L}px;height:${A}px}
  .cab{position:absolute;left:34px;top:30px}
  .cab .t{font:700 19px/1 'Barlow Condensed',sans-serif;letter-spacing:.15em;
          text-transform:uppercase;color:#e4eef0;text-shadow:0 2px 8px rgba(0,0,0,.9)}
  .cab .s{font:500 12px/1.5 Archivo,sans-serif;color:#8ea0a7;margin-top:5px;
          text-shadow:0 2px 8px rgba(0,0,0,.9)}
  .cab .s b{color:#00c8b4;font-weight:600}

  .marca{position:absolute;right:34px;bottom:30px;text-align:right;
         display:flex;flex-direction:column;align-items:flex-end;gap:7px}
  .marca .logo{height:40px;width:auto;display:block;filter:drop-shadow(0 2px 8px rgba(0,0,0,.9))}
  .marca .nome{font:600 17px/1 'Barlow Condensed',sans-serif;letter-spacing:.19em;
               text-transform:uppercase;color:rgba(255,255,255,.86);
               text-shadow:0 2px 8px rgba(0,0,0,.95)}
  .marca .ass{font:400 10.5px/1 Archivo,sans-serif;letter-spacing:.06em;
              color:rgba(255,255,255,.5);text-shadow:0 2px 8px rgba(0,0,0,.95)}

  .leg{position:absolute;left:34px;bottom:30px;max-width:640px}
  .leg .scrim{position:absolute;left:-34px;right:-620px;bottom:-30px;top:-34px;
              background:linear-gradient(90deg,rgba(3,6,7,.80),rgba(3,6,7,.35) 60%,transparent);
              z-index:-1}
  .leg .n{font:700 40px/1 'Barlow Condensed',sans-serif;letter-spacing:.09em;
          text-transform:uppercase;color:#eaf6f4}
  .leg .n::before{content:'';display:inline-block;width:9px;height:9px;border-radius:50%;
          background:#00e6c8;box-shadow:0 0 14px #00e6c8;margin-right:13px;vertical-align:22%}
  .leg .d{font:400 17px/1.45 Archivo,sans-serif;color:#b3c6c9;margin-top:6px}
  .leg .o{font:400 12.5px/1.4 Archivo,sans-serif;color:#7c8f93;margin-top:5px;font-style:italic}
</style>`;

function capturar(nome, corpo) {
  const pag = path.join(tmp, 'ov.html');
  fs.writeFileSync(pag, `<!doctype html><html><head><meta charset="utf-8">${ESTILO}</head>
<body><div class="quadro">${corpo}</div></body></html>`);
  execFileSync(process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--default-background-color=00000000', '--force-device-scale-factor=1',
    '--virtual-time-budget=5000',
    '--screenshot=' + path.join(saida, nome), '--window-size=' + L + ',' + A,
    'file://' + pag
  ], { stdio: 'ignore' });
}

// ---------------------------------------------------------------- cabecalho
capturar('fixo.png', `
  <div class="cab">
    <div class="t">Corredor Tecnológico</div>
    <div class="s">proposta para <b>SIEMENS</b> · 12 m · 6.927 pixels endereçáveis</div>
  </div>
  <div class="marca">
    ${logoTag}
    <div class="nome">${MARCA.empresa}</div>
    <div class="ass">${MARCA.assinatura}${MARCA.contato ? ' · ' + MARCA.contato : ''}</div>
  </div>`);

// ----------------------------------------------------------------- legendas
LEGENDAS.forEach((l, i) => {
  capturar('leg' + i + '.png', `
    <div class="leg"><div class="scrim"></div>
      <div class="n">${l.n}</div>
      <div class="d">${l.d}</div>
      ${l.obs ? '<div class="o">' + l.obs + '</div>' : ''}
    </div>`);
});

fs.writeFileSync(path.join(saida, 'tempos.json'), JSON.stringify(LEGENDAS, null, 2));
console.log('OK ->', saida);
console.log('    fixo.png (cabeçalho + marca d\'água) +', LEGENDAS.length, 'legendas');
console.log('    marca:', MARCA.empresa, MARCA.logo ? '(com logo)' : '(SEM LOGO — texto apenas)');
