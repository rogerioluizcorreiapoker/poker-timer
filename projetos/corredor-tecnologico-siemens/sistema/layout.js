/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - LAYOUT MESTRE
 * -----------------------------------------------------------------------------
 * Fonte unica da verdade da geometria do painel.
 * Consumido por:
 *   - ferramentas/gerar-elevacao.js   -> desenhos/elevacao-tecnica.svg (marcenaria/CNC)
 *   - ferramentas/build-simulador.js  -> simulador/index.html (apresentacao ao cliente)
 *   - firmware/engine-raspberry       -> mapa de pixels do engine de animacao
 *
 * SISTEMA DE COORDENADAS
 *   Unidade: milimetros.
 *   Origem (0,0): canto INFERIOR ESQUERDO da faixa grafica.
 *   X cresce ao longo do corredor (0 -> 12000).
 *   Y cresce para cima (0 -> 1850).
 *   A faixa grafica e instalada de +200 mm a +2050 mm do piso acabado (NPA).
 *   Portanto:  Y_projeto = Y_layout + 200
 *   O rodape luminoso vive em Y = -120 (ou seja, +80 mm do piso), fora da faixa.
 *
 * REGRA DE GEOMETRIA
 *   Todo segmento e horizontal, vertical ou diagonal exata de 45 graus.
 *   Isso e garantido por construcao pelo DSL abaixo (H / V / D) e conferido
 *   por validarGeometria(). Motivos:
 *     - estetica autentica de PCB;
 *     - usinagem CNC simples (mesma ferramenta, sem interpolacao complexa);
 *     - fita LED nao dobra no plano: toda mudanca de direcao vira um corte +
 *       furo passante + jumper de 3 vias por tras do painel.
 * ========================================================================== */

(function (raiz) {
  'use strict';

  // --------------------------------------------------------------------------
  // Dimensoes gerais
  // --------------------------------------------------------------------------
  var CORREDOR = {
    comprimento: 12000,      // mm - extensao total da parede tratada
    faixaAltura: 1850,       // mm - altura da faixa grafica (1 chapa de MDF)
    faixaBase: 200,          // mm - altura do inicio da faixa em relacao ao piso
    peDireito: 2700,         // mm - referencia (confirmar em medicao)
    rodapeY: -120,           // mm - linha de forca no perfil de aluminio
    densidade: 60,           // LEDs/m da fita
    passoLed: 1000 / 60      // mm entre LEDs = 16,667
  };

  // --------------------------------------------------------------------------
  // DSL de caminho - garante 0 / 90 / 45 graus por construcao
  // --------------------------------------------------------------------------
  function H(dx) { return ['H', dx]; }             // horizontal
  function V(dy) { return ['V', dy]; }             // vertical
  function D(dx, dir) { return ['D', dx, dir]; }   // diagonal 45: dy = dir * |dx|

  function construir(x0, y0, ops) {
    var pts = [[x0, y0]], x = x0, y = y0;
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i];
      if (o[0] === 'H') { x += o[1]; }
      else if (o[0] === 'V') { y += o[1]; }
      else { x += o[1]; y += (o[2] < 0 ? -1 : 1) * Math.abs(o[1]); }
      pts.push([x, y]);
    }
    return pts;
  }

  // t(id, zona, strand, x, y, ...ops)
  var TRACOS = [];
  function t(id, zona, strand, x0, y0) {
    var ops = Array.prototype.slice.call(arguments, 5);
    TRACOS.push({ id: id, zona: zona, strand: strand, pts: construir(x0, y0, ops) });
  }

  // ==========================================================================
  // ZONA A (0 - 3400 mm) - BARRAMENTO DE ENTRADA
  // Feixe de trilhas paralelas entrando pela esquerda e descendo em degraus de
  // 45 graus, convergindo para o nucleo. E o "cabecote" da narrativa: e por aqui
  // que a energia entra quando o sensor da ponta A dispara.
  // ==========================================================================
  t('A1', 'A', 0,    0, 1700, H(820),  D(240,-1), H(1440), D(240,-1), H(1020));
  t('A2', 'A', 0,    0, 1520, H(620),  D(240,-1), H(1400), D(240,-1), H(1180));
  t('A3', 'A', 1,    0, 1340, H(1500), D(240,-1), H(360),  D(240,-1), H(1320));
  t('A4', 'A', 1,    0, 1160, H(420),  D(240,-1), H(1140), D(240,-1), H(1620));
  t('A5', 'A', 2,    0,  900, H(1180), D(240,-1), H(1480), D(240,-1), H(760));
  t('A6', 'A', 2,    0,  640, H(900),  D(240,-1), H(2260), D(240,-1), H(1560));
  t('A7', 'A', 3,    0,  380, H(2200), D(240,-1), H(3660));
  t('A8', 'A', 3,  300, 1820, H(1600), D(240,-1), H(1060));
  // Derivacoes curtas terminadas em via (pontos de "respiro" do desenho)
  t('A9',  'A', 2,  980, 1820, V(-140), H(420));
  t('A10', 'A', 1, 1760,  200, V(300),  H(560));
  t('A11', 'A', 2, 2980, 1660, D(200,-1), H(420));

  // ==========================================================================
  // ZONA B (3400 - 6280 mm) - NUCLEO / CPU
  // Anel octogonal envolvendo o processador impresso em 3D, com trilhas
  // irradiando nos quatro sentidos. E o ponto focal da animacao de permanencia.
  // ==========================================================================
  // Anel do pad (octogono fechado ao redor do chip 600x600 centrado em 4400,1000)
  t('B0', 'B', 4, 3760, 760, V(480), D(240,1), H(800), D(240,-1), V(-480), D(-240,-1), H(-800), D(-240,1));
  // Irradiacoes
  t('B1', 'B', 4, 4900, 1480, V(240), H(1500));
  t('B2', 'B', 5, 5040, 1240, H(560), D(240,1), H(200), D(240,1));
  t('B3', 'B', 5, 5040,  880, H(660), D(240,-1), V(-180), D(120,-1), H(220));
  t('B4', 'B', 5, 4400,  520, V(-220), H(1200), D(240,-1), H(760));
  t('B5', 'B', 5, 4160,  520, V(-220), H(-760));
  t('B6', 'B', 5, 3760, 1000, H(-360), D(-240,1), H(-540));

  // ==========================================================================
  // ZONA C (6280 - 8980 mm) - MARCA
  // Faixa central limpa: zona de protecao da marca. As trilhas so passam pela
  // banda superior (y > 1400) e inferior (y < 540).
  // ==========================================================================
  t('C1', 'C', 6, 6280, 1700, H(2700));
  t('C2', 'C', 6, 6280, 1520, H(720),  D(240,1), H(1740));
  t('C3', 'C', 6, 6280,  420, H(2700));
  t('C4', 'C', 6, 6280,  240, H(1320), D(240,1), H(1140));

  // ==========================================================================
  // ZONA D (8980 - 12000 mm) - MALHA DE DADOS
  // Densidade alta, componentes menores, trilhas finas que se dissolvem no fim
  // do corredor. E onde a animacao "se desfaz" quando a pessoa sai.
  // ==========================================================================
  t('D1', 'D', 7,  8980, 1760, H(900),  D(240,-1), H(1080), D(240,-1), H(560));
  t('D2', 'D', 7,  8980, 1700, H(420),  D(240,-1), H(1500), D(240,-1), H(620));
  t('D3', 'D', 7,  8980, 1480, H(1240), D(240,-1), H(700),  D(240,1),  H(600));
  t('D4', 'D', 8,  8980, 1280, H(680),  D(240,1),  H(340),  D(240,-1), H(1300));
  t('D5', 'D', 8,  8980,  980, H(1500), D(240,-1), H(400),  D(240,-1), H(640));
  t('D6', 'D', 8,  8980,  760, H(920),  D(240,-1), H(1180), D(240,1),  H(440));
  t('D7', 'D', 9,  8980,  420, H(2360), D(240,1),  H(420));
  t('D8', 'D', 9,  8980,  240, H(1120), D(240,1),  H(1660));
  // Malha fina de dissolucao (stubs verticais na extremidade)
  t('D9',  'D', 7, 11300, 1580, V(-220), H(420));
  t('D10', 'D', 9, 11480, 1100, V(-260), H(240));
  t('D11', 'D', 9, 11180,  600, V(-180), H(540));

  // ==========================================================================
  // RODAPE - trilha de forca continua, unico elemento que atravessa os 12 m
  // sem interrupcao. Ancora visual do corredor inteiro.
  // ==========================================================================
  t('RD1', 'R', 10, 0, CORREDOR.rodapeY, H(6000));
  t('RD2', 'R', 11, 6000, CORREDOR.rodapeY, H(6000));

  // --------------------------------------------------------------------------
  // COMPONENTES IMPRESSOS EM 3D
  // x,y = canto inferior esquerdo | l,a = largura,altura | e = espessura (relevo)
  // halo: gera trilha de contorno retroiluminada em volta da peca
  // --------------------------------------------------------------------------
  var COMPONENTES = [
    { id: 'CPU',  tipo: 'cpu',       x: 4100, y:  700, l: 600, a: 600, e: 28, pinos: 22, halo: true,  strand: 4,
      nota: 'Processador principal. Nucleo em MDF + capa impressa em 4 partes.' },
    { id: 'IC01', tipo: 'ci',        x: 1620, y: 1500, l: 340, a: 160, e: 14, pinos: 10, halo: true,  strand: 0 },
    { id: 'IC02', tipo: 'ci',        x: 2660, y:  700, l: 260, a: 120, e: 14, pinos:  8, halo: true,  strand: 1 },
    { id: 'IC03', tipo: 'ci',        x: 9300, y: 1120, l: 420, a: 180, e: 16, pinos: 12, halo: true,  strand: 7 },
    { id: 'IC04', tipo: 'ci',        x:10400, y:  560, l: 300, a: 140, e: 14, pinos:  9, halo: true,  strand: 9 },
    { id: 'IC05', tipo: 'ci',        x:11060, y: 1360, l: 220, a: 110, e: 12, pinos:  7, halo: false, strand: 9 },
    { id: 'L1',   tipo: 'indutor',   x: 5280, y: 1440, l: 180, a: 180, e: 24, halo: true,  strand: 4 },
    { id: 'C1',   tipo: 'capacitor', x: 3480, y: 1560, l:  90, a:  90, e: 22, halo: false, strand: 4 },
    { id: 'C2',   tipo: 'capacitor', x: 3600, y: 1560, l:  90, a:  90, e: 22, halo: false, strand: 4 },
    { id: 'C3',   tipo: 'capacitor', x: 3720, y: 1560, l:  90, a:  90, e: 22, halo: false, strand: 4 },
    { id: 'R1',   tipo: 'smd',       x: 2360, y: 1240, l: 120, a:  46, e:  8, halo: false },
    { id: 'R2',   tipo: 'smd',       x: 2540, y: 1240, l: 120, a:  46, e:  8, halo: false },
    { id: 'R3',   tipo: 'smd',       x: 9860, y:  840, l: 120, a:  46, e:  8, halo: false },
    { id: 'R4',   tipo: 'smd',       x:10040, y:  840, l: 120, a:  46, e:  8, halo: false },
    { id: 'Q1',   tipo: 'smd',       x: 6740, y: 1580, l: 160, a:  90, e: 10, halo: false },
    { id: 'Q2',   tipo: 'smd',       x: 7900, y:  280, l: 160, a:  90, e: 10, halo: false },
    { id: 'EDGE', tipo: 'conector',  x:11760, y:  620, l: 240, a: 620, e: 18, halo: true,  strand: 9,
      nota: 'Conector de borda: fecha a narrativa no fim do corredor.' }
  ];

  // --------------------------------------------------------------------------
  // MARCA
  // Zona de protecao respeitada por todas as trilhas. Letreiro em acrilico com
  // retroiluminacao dedicada (strand 9) para pulso sutil sincronizado.
  // ARTE OFICIAL: aplicar a partir do brand book do cliente, nao redesenhar.
  // --------------------------------------------------------------------------
  var MARCA = {
    texto: 'SIEMENS',
    assinatura: 'Tecnologia que conecta o futuro',
    x: 6580, y: 900, largura: 2000, alturaCaixa: 260,
    assinaturaY: 700, assinaturaAltura: 78,
    protecao: { x: 6280, y: 600, l: 2600, a: 1000 },
    strandBacklight: 12
  };

  // --------------------------------------------------------------------------
  // SENSORES - radar mmWave nas duas extremidades, olhando para o eixo do corredor
  // Cobertura util ~6 m cada, com sobreposicao no centro resolvida por fusao.
  // --------------------------------------------------------------------------
  var SENSORES = [
    { id: 'S-A', modelo: 'LD2450', x: 150,   alturaMontagem: 1600, alcance: 6000, sentido: +1 },
    { id: 'S-B', modelo: 'LD2450', x: 11850, alturaMontagem: 1600, alcance: 6000, sentido: -1 }
  ];

  // --------------------------------------------------------------------------
  // PALETA - referencia da identidade do cliente.
  // ATENCAO: valores a validar contra o brand book oficial antes da producao.
  // --------------------------------------------------------------------------
  var PALETA = {
    fundoPainel: '#14181c',
    repouso:     '#04323c',   // azul profundo, nivel de standby
    trilha:      '#009999',   // petrol - cor base das trilhas energizadas
    energia:     '#00e6c8',   // verde-agua - pacotes de dados
    pico:        '#a8fff0',   // nucleo quase branco do pulso
    marca:       '#00c8b4'
  };

  // ==========================================================================
  // DERIVADOS - mapa de pixels
  // ==========================================================================

  function comprimentoTraco(pts) {
    var s = 0;
    for (var i = 1; i < pts.length; i++) {
      s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    }
    return s;
  }

  // Gera o contorno retroiluminado de um componente (offset de 22 mm)
  function haloDoComponente(c, off) {
    var o = off === undefined ? 22 : off;
    var x0 = c.x - o, y0 = c.y - o, x1 = c.x + c.l + o, y1 = c.y + c.a + o;
    return [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
  }

  function montarTracos() {
    var lista = TRACOS.map(function (tr) {
      return { id: tr.id, zona: tr.zona, strand: tr.strand, pts: tr.pts, halo: false };
    });
    COMPONENTES.forEach(function (c) {
      if (!c.halo) return;
      lista.push({
        id: 'H-' + c.id, zona: 'H', strand: c.strand === undefined ? 3 : c.strand,
        pts: haloDoComponente(c), halo: true, componente: c.id
      });
    });
    // Backlight do letreiro: retangulo atras das letras
    lista.push({
      id: 'H-MARCA', zona: 'M', strand: MARCA.strandBacklight, halo: true,
      pts: haloDoComponente({ x: MARCA.x, y: MARCA.y, l: MARCA.largura, a: MARCA.alturaCaixa }, 40)
    });
    return lista;
  }

  // Distribui LEDs a cada passoLed ao longo de cada traco.
  // Retorna { pixels, tracos, strands, totais }
  function gerarMapaPixels() {
    var tracos = montarTracos();
    var pixels = [];
    var idx = 0;

    tracos.forEach(function (tr, ti) {
      var passo = CORREDOR.passoLed;
      var comp = comprimentoTraco(tr.pts);
      var n = Math.max(2, Math.round(comp / passo));
      var real = comp / n;
      tr.indicePrimeiroPixel = idx;
      tr.qtdPixels = n + 1;
      tr.comprimento = comp;
      tr.tracoIndex = ti;

      // percorre a polyline distribuindo pontos equidistantes
      var restante = 0, seg = 0;
      var px = tr.pts[0][0], py = tr.pts[0][1];
      for (var k = 0; k <= n; k++) {
        var alvo = k * real;
        // caminha ate a distancia alvo
        var acc = 0, done = false;
        for (var i = 1; i < tr.pts.length && !done; i++) {
          var ax = tr.pts[i - 1][0], ay = tr.pts[i - 1][1];
          var bx = tr.pts[i][0], by = tr.pts[i][1];
          var L = Math.hypot(bx - ax, by - ay);
          if (acc + L >= alvo - 1e-6 || i === tr.pts.length - 1) {
            var f = L === 0 ? 0 : Math.min(1, (alvo - acc) / L);
            px = ax + (bx - ax) * f;
            py = ay + (by - ay) * f;
            done = true;
          }
          acc += L;
        }
        pixels.push({
          i: idx++, x: px, y: py,
          traco: ti, posNoTraco: k, totalNoTraco: n + 1,
          strand: tr.strand, zona: tr.zona, halo: !!tr.halo
        });
      }
      void restante; void seg;
    });

    // Consolidacao por strand (cada strand = 1 saida de dados fisica)
    var strands = {};
    pixels.forEach(function (p) {
      if (!strands[p.strand]) strands[p.strand] = { id: p.strand, qtd: 0, xMin: 1e9, xMax: -1e9 };
      var s = strands[p.strand];
      s.qtd++; s.xMin = Math.min(s.xMin, p.x); s.xMax = Math.max(s.xMax, p.x);
    });

    var metrosFita = tracos.reduce(function (a, tr) { return a + tr.comprimento; }, 0) / 1000;

    return {
      pixels: pixels,
      tracos: tracos,
      strands: strands,
      totais: {
        qtdPixels: pixels.length,
        metrosFita: metrosFita,
        qtdTracos: tracos.length,
        qtdCantos: tracos.reduce(function (a, tr) { return a + Math.max(0, tr.pts.length - 2); }, 0),
        potenciaMaxW: metrosFita * 15,          // WS2815 60 LED/m @ branco pleno
        potenciaOperacionalW: metrosFita * 15 * 0.40  // com limitador de brilho ativo
      }
    };
  }

  // Confere a regra 0/90/45 e reporta desvios (usado no build).
  function validarGeometria() {
    var erros = [];
    montarTracos().forEach(function (tr) {
      for (var i = 1; i < tr.pts.length; i++) {
        var dx = Math.abs(tr.pts[i][0] - tr.pts[i - 1][0]);
        var dy = Math.abs(tr.pts[i][1] - tr.pts[i - 1][1]);
        var ok = dx < 0.01 || dy < 0.01 || Math.abs(dx - dy) < 0.01;
        if (!ok) erros.push(tr.id + ' seg ' + i + ' dx=' + dx.toFixed(1) + ' dy=' + dy.toFixed(1));
      }
    });
    return erros;
  }

  var API = {
    CORREDOR: CORREDOR, TRACOS: TRACOS, COMPONENTES: COMPONENTES,
    MARCA: MARCA, SENSORES: SENSORES, PALETA: PALETA,
    gerarMapaPixels: gerarMapaPixels, validarGeometria: validarGeometria,
    haloDoComponente: haloDoComponente, comprimentoTraco: comprimentoTraco
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.LAYOUT = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
