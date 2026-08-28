/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - CAMADA DE MATERIA
 * -----------------------------------------------------------------------------
 * O painel APAGADO: grafite, canaletas escavadas, pecas impressas, letreiro.
 * Nao depende do estado da animacao - e desenhado uma vez e reaproveitado.
 *
 * Consumido por:
 *   - simulador/index.html        textura da parede na apresentacao
 *   - ferramentas/gerar-textura.js textura da parede no video
 *
 * Fonte unica: se o painel mudar, muda nos dois ao mesmo tempo.
 * ========================================================================== */

(function (raiz) {
  'use strict';
  var LAYOUT = (typeof module !== 'undefined' && module.exports)
    ? require('./layout.js') : raiz.LAYOUT;

  /* Ruido deterministico. Math.random() faria a textura do simulador e a do
   * video serem diferentes - o cliente aprovaria uma parede e receberia outra
   * no video. */
  function semente(n) {
    n = (n << 13) ^ n;
    return (((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741823.0);
  }

  /* g: contexto 2D | opts.escala: px por mm | opts.mapa: mapa de pixels */
  function desenharMaterial(g, opts) {
    var esc = opts.escala;
    var mapa = opts.mapa || LAYOUT.gerarMapaPixels();
    var C = LAYOUT.CORREDOR;
    var W = Math.round(C.comprimento * esc);
    var Hbase = (C.faixaAltura - 0) * esc;           // base da faixa grafica

    function tx(x) { return x * esc; }
    function ty(y) { return (C.faixaAltura - y) * esc; }

    // ------------------------------------------------------- fundo do painel
    g.fillStyle = '#11161a';
    g.fillRect(0, 0, W, Math.round((C.faixaBase + C.faixaAltura) * esc));

    var grad = g.createLinearGradient(0, 0, 0, Hbase);
    grad.addColorStop(0, '#171d22');
    grad.addColorStop(1, '#0e1316');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, Hbase);

    // textura fina do acabamento acetinado
    g.globalAlpha = 0.045;
    for (var i = 0; i < 2600; i++) {
      g.fillStyle = (i % 2) ? '#ffffff' : '#000000';
      g.fillRect(semente(i * 3 + 1) * W, semente(i * 7 + 5) * Hbase, 1.6 * esc / 0.22, 1.6 * esc / 0.22);
    }
    g.globalAlpha = 1;

    // -------------------------------------------------- juntas entre painéis
    g.strokeStyle = 'rgba(0,0,0,.42)';
    g.lineWidth = Math.max(1, 6 * esc);
    for (var p = 1; p < 8; p++) {
      var xj = tx(p * 1500);
      g.beginPath(); g.moveTo(xj, 0); g.lineTo(xj, Hbase); g.stroke();
    }

    // ------------------------------------------------------------ canaletas
    // Sombra no fundo do sulco + fio de luz na aresta superior: e o que faz a
    // canaleta ler como escavada e nao como linha pintada.
    g.lineCap = 'round'; g.lineJoin = 'round';
    mapa.tracos.forEach(function (tr) {
      g.beginPath();
      for (var k = 0; k < tr.pts.length; k++) {
        var X = tx(tr.pts[k][0]), Y = ty(tr.pts[k][1]);
        if (k) g.lineTo(X, Y); else g.moveTo(X, Y);
      }
      g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 14 * esc; g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.055)'; g.lineWidth = 14 * esc * 0.42;
      var d = Math.max(0.8, 5 * esc);
      g.translate(0, -d); g.stroke(); g.translate(0, d);
    });

    // ------------------------------------------------- peças impressas em 3D
    LAYOUT.COMPONENTES.forEach(function (c) {
      var x = tx(c.x), y = ty(c.y + c.a);
      var w = c.l * esc, h = c.a * esc;
      var rel = Math.max(2 * esc / 0.22, c.e * esc * 0.9);

      g.fillStyle = 'rgba(0,0,0,.5)';
      g.fillRect(x + rel * 0.5, y + rel * 0.7, w, h);

      var gc = g.createLinearGradient(0, y, 0, y + h);
      gc.addColorStop(0, '#5a6672'); gc.addColorStop(0.30, '#3b454e'); gc.addColorStop(1, '#222a30');
      g.fillStyle = gc; g.fillRect(x, y, w, h);

      var fio = Math.max(1, 5 * esc);
      g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = fio;
      g.beginPath(); g.moveTo(x, y + fio / 2); g.lineTo(x + w, y + fio / 2); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.55)';
      g.beginPath(); g.moveTo(x, y + h - fio / 2); g.lineTo(x + w, y + h - fio / 2); g.stroke();

      if (c.pinos) {
        g.fillStyle = '#8b98a4';
        var passo = w / (c.pinos + 1), lp = Math.max(1.4, 5 * esc);
        for (var k = 1; k <= c.pinos; k++) {
          g.fillRect(x + passo * k - lp / 2, y - rel * 0.8, lp, rel * 0.8);
          g.fillRect(x + passo * k - lp / 2, y + h, lp, rel * 0.8);
        }
      }
      if (c.tipo === 'cpu') {
        g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = Math.max(1, 4 * esc);
        g.strokeRect(x + w * 0.16, y + h * 0.16, w * 0.68, h * 0.68);
      }
    });

    // -------------------------------------------------------------- letreiro
    var M = LAYOUT.MARCA;
    g.fillStyle = '#dfe9ec';
    g.font = '700 ' + (M.alturaCaixa * esc * 0.86) + 'px "Barlow Condensed", Archivo, sans-serif';
    g.textBaseline = 'alphabetic';
    var larguraAlvo = M.largura * esc;
    var med = g.measureText(M.texto).width;
    g.save();
    g.translate(tx(M.x), ty(M.y));
    g.scale(larguraAlvo / med, 1);
    g.fillText(M.texto, 0, 0);
    g.restore();

    g.fillStyle = '#8fa0a8';
    g.font = '500 ' + (M.assinaturaAltura * esc) + 'px Archivo, sans-serif';
    var med2 = g.measureText(M.assinatura).width;
    g.fillText(M.assinatura, tx(M.x) + (larguraAlvo - med2) / 2, ty(M.assinaturaY));

    // ------------------------------------------- perfil de alumínio do rodapé
    g.fillStyle = '#1b2226';
    g.fillRect(0, ty(C.rodapeY) - 15 * esc, W, 30 * esc);
    g.fillStyle = '#0a0d0f';
    g.fillRect(0, ty(-200) - 2, W, 6);
  }

  var API = { desenharMaterial: desenharMaterial };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.MATERIAL = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
