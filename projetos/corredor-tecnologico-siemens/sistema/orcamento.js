/* =============================================================================
 * ORCAMENTO DE MATERIAL - AGRUPADO POR SISTEMA
 * -----------------------------------------------------------------------------
 * Reagrupa a lista de materiais (docs/05) em blocos que descrevem FUNCAO, nao
 * componente. O documento que sai daqui vai para um parceiro que subcontrata:
 * ele precisa do custo para fechar a conta dele, nao do caminho para refazer o
 * sistema sem nos.
 *
 * Regra de redacao dos itens: dizer O QUE FAZ, nunca QUAL E.
 *   "sensores de detecao de presenca"  sim
 *   "radar mmWave LD2450"              nao
 *
 * Os intervalos por item vem de docs/05-lista-de-materiais.md e a soma e
 * conferida contra o total de material daquele documento.
 * ========================================================================== */

(function (raiz) {
  'use strict';

  var GRUPOS = [
    {
      id: 'luz',
      nome: 'Sistema de iluminação endereçável',
      descricao: 'Linha de luz contínua de 115 m embutida no painel, com difusores e perfil do rodapé',
      itens: [[8000, 11000], [2000, 3200], [700, 1200]]
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
      descricao: 'Controladores, unidade de processamento e sensores de detecção de presença nas duas entradas',
      itens: [[400, 700], [500, 800], [900, 1400], [300, 500], [300, 500], [150, 300], [300, 600]]
    },
    {
      id: 'montagem',
      nome: 'Cabeamento de dados e insumos de montagem',
      descricao: 'Cabos de sinal, conectores, fixação e insumos de instalação interna',
      itens: [[700, 1200], [200, 400], [900, 1500]]
    },
    {
      id: 'paineis',
      nome: 'Painéis e substrato',
      descricao: 'Chapas, estrutura de fixação e usinagem das canaletas que embutem a linha de luz',
      itens: [[3200, 4500], [900, 1500], [3500, 5500]]
    },
    {
      id: 'impressao',
      nome: 'Peças impressas em 3D',
      descricao: 'Insumo de impressão e acabamento das 17 peças de componentes em relevo',
      itens: [[900, 1600]]
    },
    {
      id: 'acabamento',
      nome: 'Acabamento e letreiro',
      descricao: 'Fundo, pintura, verniz e acrílico do letreiro',
      itens: [[1800, 3000], [1200, 2500]]
    }
  ];

  var PRAZO = [
    ['Projeto executivo, medição no local e compras', 1],
    ['Produção: painéis usinados e peças impressas', 3],
    ['Pré-montagem e testes em bancada', 1],
    ['Instalação, elétrica e comissionamento', 3]
  ];

  var FORA = [
    'Mão de obra de marcenaria, elétrica, montagem e instalação',
    'Engenharia, projeto executivo e programação do sistema',
    'Obra civil, ponto de energia, andaimes e taxas de acesso ao prédio',
    'ART e projeto elétrico assinado, se a edificação exigir',
    'Impostos sobre o faturamento'
  ];

  // Total de material apurado em docs/05. A soma aqui tem que bater com ele.
  var CONFERENCIA = { min: 30650, max: 47900 };

  function arredondar(v) { return Math.round(v / 250) * 250; }

  function calcular() {
    var grupos = GRUPOS.map(function (g) {
      var min = 0, max = 0;
      g.itens.forEach(function (i) { min += i[0]; max += i[1]; });
      return {
        id: g.id, nome: g.nome, descricao: g.descricao,
        min: min, max: max, valor: arredondar((min + max) / 2)
      };
    });

    var min = grupos.reduce(function (a, g) { return a + g.min; }, 0);
    var max = grupos.reduce(function (a, g) { return a + g.max; }, 0);
    var total = grupos.reduce(function (a, g) { return a + g.valor; }, 0);

    if (min !== CONFERENCIA.min || max !== CONFERENCIA.max) {
      throw new Error('soma nao bate com docs/05: ' + min + '-' + max +
                      ' (esperado ' + CONFERENCIA.min + '-' + CONFERENCIA.max + ')');
    }

    return {
      grupos: grupos,
      total: total,
      faixa: { min: min, max: max },
      // margem declarada no documento, para o parceiro saber o que esperar
      tolerancia: Math.round(Math.max(total - min, max - total) / total * 100),
      prazo: PRAZO,
      semanas: PRAZO.reduce(function (a, p) { return a + p[1]; }, 0),
      fora: FORA
    };
  }

  var API = { GRUPOS: GRUPOS, calcular: calcular };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.ORCAMENTO = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
