/* =============================================================================
 * CENARIOS DE ESCOPO - QUANTO CUSTA CADA VERSAO DO CORREDOR
 * -----------------------------------------------------------------------------
 * O cliente final tem teto de R$ 20 mil. O projeto desenhado nao cabe: so o
 * material, no piso da faixa, ja passa disso. Este modulo responde a pergunta
 * certa - "o que cabe em R$ 20 mil?" - derivando o custo de cada versao a
 * partir de TAXAS UNITARIAS, nao de numeros redondos inventados.
 *
 * Todas as taxas saem de docs/05, divididas pela quantidade correspondente do
 * projeto completo. Assim, mudar o tamanho do escopo recalcula tudo junto:
 * fita, canaleta, fonte, emenda, cabo e mao de obra.
 * ========================================================================== */

(function (raiz) {
  'use strict';

  var AREA_FAIXA = 12.0 * 1.85;        // m² da faixa grafica
  var TRILHA_COMPLETA = 114.7;         // m de linha de luz no projeto completo
  var PECAS_COMPLETO = 17;

  /* --------------------------------------------------------------- TAXAS
   * [min, max] em R$. A origem de cada uma esta no comentario. */
  var TAXA = {
    // fita: R$ 200 o rolo de 5 m, preco informado pela equipe
    fitaMetro:        [40, 40],
    // docs/05: difusor acrilico 2.000-3.200 para 114,7 m
    difusorEmbutido:  [17, 28],
    // perfil de aluminio de superficie com difusor integrado (cotacao de mercado)
    perfilSuperficie: [26, 42],
    // docs/05: usinagem CNC 3.500-5.500 para 114,7 m de canaleta
    usinagemMetro:    [30, 48],
    // docs/05: MDF 3.200-4.500 + estrutura 900-1.500, para 22,2 m²
    mdfEstruturaM2:   [185, 270],
    // docs/05: tinta 1.800-3.000 para 22,2 m²
    pinturaM2:        [81, 135],
    // docs/05: cabeamento e insumos 1.800-3.100 para 114,7 m
    cabeamentoMetro:  [16, 27],
    // docs/05: filamento 900-1.600 para 17 pecas
    filamentoPeca:    [53, 94],
    fonteGrande:      [400, 550],      // 450 W
    fontePequena:     [180, 280],      // 200 W
    // docs/05: bloco de controle completo (2 controladores + processamento + 2 radares)
    controleCompleto: [2850, 4800],
    // 1 controlador + placa de saida + 2 sensores de presenca simples
    controleSimples:  [700, 1200],
    /* 1 controlador + placa + 2 sensores de POSICAO. E o item que preserva o
     * efeito que vende o projeto: sem posicao, a parede acende quando alguem
     * entra, mas a luz nao acompanha quem caminha. */
    controlePosicao:  [1400, 2200],
    // docs/05: quadro 700-1.200 + protecoes 500-900 + cabo de forca 400-700, 4 zonas
    quadroPorZona:    [400, 700],
    letreiroAcrilico: [1200, 2500],
    letreiroVinil:    [250, 500],

    // --- mao de obra, tambem derivada de docs/05 ---
    // marcenaria 6.000-9.000 para 22,2 m² de painel
    marcenariaM2:     [270, 405],
    // impressao 2.000-3.500 para 17 pecas
    impressaoPeca:    [118, 206],
    // eletrica 5.000-8.000 + instalacao 4.000-6.000, para 114,7 m de trilha
    eletricaMetro:    [78, 122],
    // pintura de parede sem painel (preparo + fundo + acabamento)
    pinturaParedeM2:  [90, 140]
  };

  /* Projeto e programacao NAO escala com metro: o engine ja existe. Reduzir o
   * escopo e reconfiguracao, nao desenvolvimento novo. */
  var PROJETO = {
    completo:  [11000, 17000],
    reduzido:  [5000, 8000],
    essencial: [3000, 5000]
  };

  var CENARIOS = [
    {
      id: 'completo',
      nome: 'Completo',
      resumo: 'O projeto desenhado e simulado. Trilha embutida em canaleta usinada, painéis de MDF, 17 peças em relevo e sensoriamento de posição nas duas entradas.',
      trilha: 114.7, pecas: 17, paineis: true, canaletaUsinada: true,
      controle: 'completo', letreiro: 'acrilico', projeto: 'completo', zonas: 4, semanas: 8,
      fonte: 'grande', qtdFontes: 4
    },
    {
      id: 'reduzido',
      nome: 'Reduzido',
      resumo: 'Mantém o núcleo, o rodapé e o barramento principal. A malha densa do fim do corredor sai, a trilha passa a perfil de superfície e as peças caem para 8.',
      trilha: 60, pecas: 8, paineis: false, canaletaUsinada: false,
      controle: 'posicao', letreiro: 'acrilico', projeto: 'reduzido', zonas: 2, semanas: 5,
      fonte: 'grande', qtdFontes: 2
    },
    {
      id: 'essencial',
      nome: 'Essencial',
      resumo: 'Rodapé luminoso corrido de 12 m que acompanha quem caminha, mais um barramento curto e duas peças em relevo. Parede preparada e pintada no lugar dos painéis, letreiro em vinil.',
      trilha: 16, pecas: 2, paineis: false, canaletaUsinada: false, semanas: 3,
      controle: 'posicao', letreiro: 'vinil', projeto: 'essencial', zonas: 1,
      fonte: 'pequena', qtdFontes: 2
    }
  ];

  function faixa(taxa, qtd) { return [taxa[0] * qtd, taxa[1] * qtd]; }
  function soma(lista) {
    return lista.reduce(function (a, f) { return [a[0] + f[0], a[1] + f[1]]; }, [0, 0]);
  }
  var meio = function (f) { return (f[0] + f[1]) / 2; };

  function calcular(margem) {
    margem = margem || { material: 0.15, servico: 0.45 };

    return CENARIOS.map(function (c) {
      var m = [];   // material
      var s = [];   // servico

      m.push(faixa(TAXA.fitaMetro, c.trilha * 1.13));               // +13% corte e reserva
      m.push(faixa(c.canaletaUsinada ? TAXA.difusorEmbutido : TAXA.perfilSuperficie, c.trilha));
      if (c.canaletaUsinada) m.push(faixa(TAXA.usinagemMetro, c.trilha));
      if (c.paineis) {
        m.push(faixa(TAXA.mdfEstruturaM2, AREA_FAIXA));
        m.push(faixa(TAXA.pinturaM2, AREA_FAIXA));
      } else {
        m.push(faixa(TAXA.pinturaM2, AREA_FAIXA * 0.55));           // só tinta da parede
      }
      m.push(faixa(TAXA.cabeamentoMetro, c.trilha));
      m.push(faixa(TAXA.filamentoPeca, c.pecas));
      m.push(faixa(c.fonte === 'grande' ? TAXA.fonteGrande : TAXA.fontePequena, c.qtdFontes));
      m.push(faixa(TAXA.quadroPorZona, c.zonas));
      m.push(TAXA['controle' + c.controle.charAt(0).toUpperCase() + c.controle.slice(1)]);
      m.push(TAXA[c.letreiro === 'acrilico' ? 'letreiroAcrilico' : 'letreiroVinil']);

      s.push(PROJETO[c.projeto]);
      if (c.paineis) s.push(faixa(TAXA.marcenariaM2, AREA_FAIXA));
      else s.push(faixa(TAXA.pinturaParedeM2, AREA_FAIXA));
      s.push(faixa(TAXA.impressaoPeca, c.pecas));
      s.push(faixa(TAXA.eletricaMetro, c.trilha));

      var fm = soma(m), fs = soma(s);
      var custoMat = meio(fm), custoSer = meio(fs);
      var preco = Math.round((custoMat * (1 + margem.material) +
                              custoSer * (1 + margem.servico)) / 250) * 250;

      return {
        id: c.id, nome: c.nome, resumo: c.resumo, semanas: c.semanas,
        trilha: c.trilha, pecas: c.pecas, paineis: c.paineis,
        canaletaUsinada: c.canaletaUsinada, controle: c.controle, letreiro: c.letreiro,
        material: custoMat, servico: custoSer,
        custo: custoMat + custoSer,
        faixaCusto: [fm[0] + fs[0], fm[1] + fs[1]],
        preco: preco,
        // quanto do desenho original sobra
        proporcaoTrilha: c.trilha / TRILHA_COMPLETA,
        proporcaoPecas: c.pecas / PECAS_COMPLETO
      };
    });
  }

  /* O cenario completo tem orcamento detalhado item a item em sistema/orcamento.js.
   * O modelo de taxas unitarias chega a 2,5% dele, o que valida as taxas - mas
   * quem manda no numero publicado e o orcamento detalhado. */
  function calcularComDetalhado(margem) {
    var lista = calcular(margem);
    if (typeof module !== 'undefined' && module.exports) {
      var det = require('./orcamento.js').calcular();
      var c = lista.filter(function (x) { return x.id === 'completo'; })[0];
      if (c) {
        c.precoModelo = c.preco;
        c.preco = det.preco;
        c.custo = det.custo;
        c.material = det.material.reduce(function (a, b) { return a + b.custo; }, 0);
        c.servico = det.servico.reduce(function (a, b) { return a + b.custo; }, 0);
      }
    }
    return lista;
  }

  var API = { TAXA: TAXA, CENARIOS: CENARIOS, calcular: calcularComDetalhado,
              calcularPorTaxas: calcular, AREA_FAIXA: AREA_FAIXA };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.CENARIOS = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
