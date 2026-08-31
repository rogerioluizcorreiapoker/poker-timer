/* =============================================================================
 * ORCAMENTO - MATERIAL, EXECUCAO E PRECO
 * -----------------------------------------------------------------------------
 * Reagrupa a lista de materiais (docs/05) em blocos que descrevem FUNCAO, nao
 * componente. O documento que sai daqui vai para um parceiro que subcontrata:
 * ele precisa do preco para fechar a conta dele, nao do caminho para refazer o
 * sistema sem nos.
 *
 * Regra de redacao dos itens: dizer O QUE FAZ, nunca QUAL E.
 *   "sensores de detecao de presenca"  sim
 *   "radar mmWave LD2450"              nao
 *
 * MARGEM: as duas taxas abaixo sao a unica alavanca de preco. Elas entram
 * embutidas no valor de cada bloco - o documento mostra PRECO, nunca custo mais
 * margem separados.
 * ========================================================================== */

(function (raiz) {
  'use strict';

  /* --------------------------------------------------------------- ALAVANCAS
   * Material tem margem baixa DE PROPOSITO: o parceiro trabalha com LED e sabe
   * quanto custa um rolo de fita. Material inflado queima credibilidade no
   * unico item que ele consegue conferir. A margem mora na execucao e na
   * engenharia, que ele nao tem como comparar. */
  var MARGEM = { material: 0.15, servico: 0.45 };

  /* Fita: preco de mercado informado pela equipe, por rolo de 5 m. */
  var FITA = { rolos: 26, precoRolo: 200 };

  var MATERIAL = [
    {
      id: 'luz',
      nome: 'Iluminação endereçável e difusão',
      descricao: 'Fita LED endereçável (26 rolos), difusores e perfil do rodapé — 115 m de linha de luz',
      fixos: [FITA.rolos * FITA.precoRolo],
      itens: [[2000, 3200], [700, 1200]]
    },
    {
      id: 'energia',
      nome: 'Energia, quadros e proteção',
      descricao: 'Fontes, quadros elétricos, disjuntores, dispositivos de proteção e cabeamento de força',
      itens: [[1600, 2200], [700, 1200], [500, 900], [400, 700], [600, 1000]]
    },
    {
      id: 'controle',
      nome: 'Controle e sensoriamento',
      descricao: 'Controladores, placas de saída, processamento e sensores de presença nas duas entradas',
      itens: [[400, 700], [500, 800], [900, 1400], [300, 500], [300, 500], [150, 300], [300, 600]]
    },
    {
      id: 'montagem',
      nome: 'Cabeamento de dados e insumos',
      descricao: 'Cabos de sinal, conectores, terminais e insumos de instalação interna',
      itens: [[700, 1200], [200, 400], [900, 1500]]
    },
    {
      id: 'paineis',
      nome: 'Painéis, substrato e usinagem',
      descricao: 'Chapas, estrutura de fixação e usinagem das canaletas que embutem a linha de luz',
      itens: [[3200, 4500], [900, 1500], [3500, 5500]]
    },
    {
      id: 'pecas',
      nome: 'Peças impressas e acabamento',
      descricao: 'Insumo das 17 peças em relevo, pintura, verniz e acrílico do letreiro',
      itens: [[900, 1600], [1800, 3000], [1200, 2500]]
    }
  ];

  var SERVICOS = [
    {
      id: 'projeto',
      nome: 'Projeto executivo e programação',
      descricao: 'Detalhamento, desenho de fabricação, programação e comissionamento',
      itens: [[5000, 8000], [6000, 9000]]
    },
    {
      id: 'marcenaria',
      nome: 'Marcenaria, montagem e acabamento',
      descricao: 'Corte, furação, pintura dos painéis e montagem em bancada',
      itens: [[6000, 9000]]
    },
    {
      id: 'impressao',
      nome: 'Produção das peças em 3D',
      descricao: '130 a 160 horas de máquina, pós-processamento e pintura das peças',
      itens: [[2000, 3500]]
    },
    {
      id: 'instalacao',
      nome: 'Montagem elétrica e instalação',
      descricao: 'Emendas, cabeamento, quadros, instalação e ajuste fino no local',
      itens: [[5000, 8000], [4000, 6000]]
    }
  ];

  var PRAZO = [
    ['Projeto executivo, medição no local e compras', 1],
    ['Produção: painéis usinados e peças impressas', 3],
    ['Pré-montagem e testes em bancada', 1],
    ['Instalação, elétrica e comissionamento', 3]
  ];

  var FORA = [
    'Obra civil, forro, piso e pintura do entorno',
    'Ponto de energia 220 V até o quadro — circuito exclusivo',
    'Andaimes, plataforma elevatória e taxas de acesso ao prédio',
    'ART e projeto elétrico assinado, se a edificação exigir',
    'Impostos sobre o faturamento'
  ];

  // Custo apurado em docs/05. A soma tem que bater - se divergir, o build falha.
  var CONFERENCIA = { material: [27850, 42100], servico: [28000, 43500] };

  function arredondar(v) { return Math.round(v / 250) * 250; }

  function somar(bloco) {
    var min = (bloco.fixos || []).reduce(function (a, v) { return a + v; }, 0);
    var max = min;
    (bloco.itens || []).forEach(function (i) { min += i[0]; max += i[1]; });
    return { min: min, max: max, custo: (min + max) / 2 };
  }

  function preparar(lista, margem) {
    return lista.map(function (b) {
      var s = somar(b);
      return {
        id: b.id, nome: b.nome, descricao: b.descricao,
        min: s.min, max: s.max, custo: s.custo,
        preco: arredondar(s.custo * (1 + margem))
      };
    });
  }

  function calcular() {
    var material = preparar(MATERIAL, MARGEM.material);
    var servico = preparar(SERVICOS, MARGEM.servico);

    function total(l, campo) {
      return l.reduce(function (a, b) { return a + b[campo]; }, 0);
    }

    var conf = [
      ['material', material, CONFERENCIA.material],
      ['servico', servico, CONFERENCIA.servico]
    ];
    conf.forEach(function (c) {
      var min = total(c[1], 'min'), max = total(c[1], 'max');
      if (min !== c[2][0] || max !== c[2][1]) {
        throw new Error('soma de ' + c[0] + ' nao bate com docs/05: ' +
                        min + '-' + max + ' (esperado ' + c[2][0] + '-' + c[2][1] + ')');
      }
    });

    var custoTotal = total(material, 'custo') + total(servico, 'custo');
    var precoTotal = total(material, 'preco') + total(servico, 'preco');

    return {
      material: material,
      servico: servico,
      subtotalMaterial: total(material, 'preco'),
      subtotalServico: total(servico, 'preco'),
      preco: precoTotal,
      custo: custoTotal,
      margemEfetiva: Math.round((precoTotal / custoTotal - 1) * 100),
      faixaCusto: {
        min: total(material, 'min') + total(servico, 'min'),
        max: total(material, 'max') + total(servico, 'max')
      },
      fita: FITA,
      margem: MARGEM,
      prazo: PRAZO,
      semanas: PRAZO.reduce(function (a, p) { return a + p[1]; }, 0),
      fora: FORA
    };
  }

  var API = { MATERIAL: MATERIAL, SERVICOS: SERVICOS, MARGEM: MARGEM, FITA: FITA, calcular: calcular };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.ORCAMENTO = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
