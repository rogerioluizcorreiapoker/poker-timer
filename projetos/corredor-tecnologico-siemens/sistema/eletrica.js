/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - TOPOLOGIA ELETRICA
 * -----------------------------------------------------------------------------
 * Deriva a carga real de cada zona a partir da geometria em layout.js.
 * Nada aqui e chutado: metros de fita por zona vem da contagem de pixels.
 * ========================================================================== */

(function (raiz) {
  'use strict';
  var LAYOUT = (typeof module !== 'undefined' && module.exports)
    ? require('./layout.js') : raiz.LAYOUT;

  // Fita adotada: WS2815 12 V, 60 LED/m, IP30.
  // Escolhida pelo 12 V (menos queda em 12 m) e pela linha de dados de BACKUP:
  // um LED queimado nao derruba o restante da trilha - decisivo num painel
  // fechado onde trocar um trecho significa desmontar acabamento.
  var FITA = {
    modelo: 'WS2815',
    tensao: 12,
    ledsPorMetro: 60,
    wattsPorMetroMax: 15,      // branco pleno, 100% brilho
    correnteMaxPorMetro: 1.25  // A @ 12 V
  };

  // Limitador de brilho por software (ABL). O engine estima a corrente do frame
  // e escala o quadro inteiro antes de enviar. Mesmo com fontes dimensionadas
  // para o pior caso, o limite fica ativo por temperatura e vida util.
  var ABL = { fatorGlobal: 0.60, correnteMaxPorFonteA: 30 };

  // Fonte por zona. Duas travas independentes:
  //   trava de hardware = 450 W da fonte
  //   trava de software = 30 A (360 W) aplicada pelo ABL por zona
  // Operacao real fica entre 190 W e 310 W por zona. A fonte nunca passa de 70%.
  var FONTES = {
    modelo: 'Mean Well LRS-450-12',
    potenciaW: 450,
    correnteA: 37.5,
    quantidade: 4,
    resfriamento: 'conveccao natural - prever ventilacao cruzada no quadro',
    // 4 fontes chaveadas em paralelo somam corrente de partida alta.
    // Disjuntor curva B abre no ligamento. Curva C e obrigatoria aqui.
    partida: 'Disjuntor curva C 16 A. Avaliar partida escalonada por rele de retardo.'
  };

  // Quatro zonas de forca de 3 m. Cada zona = 1 fonte + 1 bloco de distribuicao.
  var ZONAS = [
    { id: 'Z1', x0: 0,    x1: 3000,  paineis: 'P1-P2', fonte: 'F1', controlador: 'CT-1' },
    { id: 'Z2', x0: 3000, x1: 6000,  paineis: 'P3-P4', fonte: 'F2', controlador: 'CT-1' },
    { id: 'Z3', x0: 6000, x1: 9000,  paineis: 'P5-P6', fonte: 'F3', controlador: 'CT-2' },
    { id: 'Z4', x0: 9000, x1: 12100, paineis: 'P7-P8', fonte: 'F4', controlador: 'CT-2' }
  ];

  var CONTROLADORES = [
    { id: 'CT-1', modelo: 'ESP32 + LAN8720 (WT32-ETH01)', xMontagem: 3000,
      strands: [0, 1, 2, 3, 4, 5, 10],
      nota: 'Quadro QE-1, atras do painel P3. Alimentado por F2.' },
    { id: 'CT-2', modelo: 'ESP32 + LAN8720 (WT32-ETH01)', xMontagem: 9000,
      strands: [6, 7, 8, 9, 11, 12],
      nota: 'Quadro QE-2, atras do painel P7. Alimentado por F3.' }
  ];

  // Cerebro: roda a maquina de estados, funde os dois radares e emite sACN.
  var ENGINE = {
    hardware: 'Raspberry Pi 4 (4 GB) ou mini-PC x86 fanless',
    saida: 'sACN / E1.31 unicast sobre Ethernet cabeada',
    taxaQuadros: 40,
    nota: 'Ethernet cabeada, nao Wi-Fi: 6.927 px x 3 B x 40 fps = 831 kB/s e ' +
          'a sincronia entre CT-1 e CT-2 precisa ser deterministica - qualquer ' +
          'jitter aparece como rasgo no pulso que atravessa os 12 m.'
  };

  // Todo controlador e toda fonte compartilham a MESMA referencia de 0 V.
  // Sem isso, a linha de dados de um controlador flutua em relacao ao terra do
  // pixel que ele comanda e o sintoma e piscada aleatoria - o defeito mais caro
  // de diagnosticar depois que o painel esta fechado.
  var REGRA_TERRA = 'Barramento de 0 V unico interligando F1..F4, CT-1, CT-2 e o engine.';

  function calcular() {
    var mapa = LAYOUT.gerarMapaPixels();
    var passo = LAYOUT.CORREDOR.passoLed / 1000; // m por pixel

    var zonas = ZONAS.map(function (z) {
      var px = mapa.pixels.filter(function (p) { return p.x >= z.x0 && p.x < z.x1; }).length;
      var metros = px * passo;
      var wMax = metros * FITA.wattsPorMetroMax;
      return Object.assign({}, z, {
        qtdPixels: px,
        metrosFita: metros,
        potenciaMaxW: wMax,
        correnteMaxA: wMax / FITA.tensao,
        potenciaComABL_W: wMax * ABL.fatorGlobal,
        correnteComABL_A: (wMax * ABL.fatorGlobal) / FITA.tensao
      });
    });

    var totalMax = zonas.reduce(function (a, z) { return a + z.potenciaMaxW; }, 0);
    return {
      zonas: zonas,
      total: {
        qtdPixels: mapa.totais.qtdPixels,
        metrosFita: mapa.totais.metrosFita,
        potenciaMaxW: totalMax,
        potenciaComABL_W: totalMax * ABL.fatorGlobal,
        // rendimento tipico da familia LRS em carga parcial
        consumoRedeW: (totalMax * ABL.fatorGlobal) / 0.87,
        correnteRede220A: ((totalMax * ABL.fatorGlobal) / 0.87) / 220
      }
    };
  }

  var API = { FITA: FITA, ABL: ABL, FONTES: FONTES, ZONAS: ZONAS, CONTROLADORES: CONTROLADORES,
              ENGINE: ENGINE, REGRA_TERRA: REGRA_TERRA, calcular: calcular };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.ELETRICA = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
