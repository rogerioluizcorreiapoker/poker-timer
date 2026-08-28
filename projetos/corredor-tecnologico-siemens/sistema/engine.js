/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - ENGINE DE ANIMACAO
 * -----------------------------------------------------------------------------
 * Codigo unico, dois destinos:
 *   - simulador/index.html : o que o cliente aprova
 *   - Raspberry Pi (Node)  : o que roda na parede
 * O que for aprovado na simulacao e literalmente o que vai instalado. Sem
 * "na obra fica diferente".
 *
 * ENTRADA : posicoes das pessoas em mm ao longo do corredor (0..12000),
 *           vindas da fusao dos dois radares mmWave.
 * SAIDA   : Uint8Array RGB, 3 bytes por pixel, na ordem do mapa de pixels.
 * ========================================================================== */

(function (raiz) {
  'use strict';

  var LAYOUT = (typeof module !== 'undefined' && module.exports)
    ? require('./layout.js') : raiz.LAYOUT;

  // ==========================================================================
  // MAQUINA DE ESTADOS
  // --------------------------------------------------------------------------
  //                    alguem entra
  //      REPOUSO  ---------------------->  DESPERTAR
  //         ^                                  | frente varre o corredor
  //         | decaimento                       v
  //     ADORMECER  <---- corredor vazio ---  ACOMPANHAR <--+
  //         |             por 12 s              |          | volta a andar
  //         | alguem                            | parou    |
  //         | reentra                           v          |
  //         +--> DESPERTAR                  PERMANENCIA ---+
  // ==========================================================================
  var ESTADOS = {
    REPOUSO:     'REPOUSO',      // ninguem no corredor - parede viva, quase parada
    DESPERTAR:   'DESPERTAR',    // frente de energia varre a partir da entrada usada
    ACOMPANHAR:  'ACOMPANHAR',   // a luz anda junto com a pessoa
    PERMANENCIA: 'PERMANENCIA',  // pessoa parada - a parede "processa" ali
    ADORMECER:   'ADORMECER',    // esvaziou - energia escoa para as pontas
    SHOW:        'SHOW'          // coreografia manual, para visitas e eventos
  };

  var PADRAO = {
    nivelRepouso:      0.075,  // brilho de standby das trilhas
    respiracaoRepouso: 0.045,  // amplitude do "respiro" lento no repouso
    ganhoOnda:         1.00,
    velocidadeOnda:    6500,   // mm/s da frente de despertar
    larguraOnda:       900,    // mm - meia largura da gaussiana da frente
    raioPessoa:        1500,   // mm - alcance do halo que segue a pessoa
    ganhoPessoa:       0.55,
    avancoPessoa:      700,    // mm - a luz anda ligeiramente A FRENTE da pessoa
    tempoParaVazio:    12000,  // ms sem ninguem antes de adormecer
    tempoParaParado:   2200,   // ms quase imóvel antes de entrar em permanencia
    limiarParadoMmS:  250,     // mm/s abaixo disso considera-se parado
    duracaoAdormecer:  4500,   // ms do escoamento ate o repouso
    pacotesPorSegundo: 26,     // taxa de emissao em regime acompanhando
    brilhoGlobal:      1.00,
    // Multiplicador mestre da agenda de funcionamento. O repouso e o maior
    // consumidor do sistema (fica ligado o dia inteiro), entao fora do horario
    // comercial este valor cai e a parede praticamente desliga.
    brilhoMestre:      1.00
  };

  // --------------------------------------------------------------------------
  // Rampa de cor: intensidade 0..1 -> RGB. Precalculada em LUT de 256 passos.
  // A curva nao e linear: o trecho de baixo e alongado para que o repouso tenha
  // presenca sem estourar, e o topo satura rapido para dar "estalo" no pulso.
  // --------------------------------------------------------------------------
  function hexParaRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function montarLut(paleta) {
    var paradas = [
      [0.00, hexParaRgb(paleta.fundoPainel === undefined ? '#000000' : '#000000')],
      [0.06, hexParaRgb(paleta.repouso)],
      [0.38, hexParaRgb(paleta.trilha)],
      [0.72, hexParaRgb(paleta.energia)],
      [1.00, hexParaRgb(paleta.pico)]
    ];
    var lut = new Uint8Array(256 * 3);
    for (var i = 0; i < 256; i++) {
      var v = i / 255, k = 0;
      while (k < paradas.length - 2 && v > paradas[k + 1][0]) k++;
      var a = paradas[k], b = paradas[k + 1];
      var f = (v - a[0]) / (b[0] - a[0]);
      f = Math.max(0, Math.min(1, f));
      lut[i * 3]     = a[1][0] + (b[1][0] - a[1][0]) * f;
      lut[i * 3 + 1] = a[1][1] + (b[1][1] - a[1][1]) * f;
      lut[i * 3 + 2] = a[1][2] + (b[1][2] - a[1][2]) * f;
    }
    return lut;
  }

  // Ruido de valor deterministico - o cintilar do repouso precisa ser identico
  // na simulacao e na parede, senao o cliente aprova uma coisa e recebe outra.
  function ruido1d(x, semente) {
    var i = Math.floor(x), f = x - i;
    function h(n) {
      n = (n << 13) ^ n; n = n + semente | 0;
      return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741823.0 - 1;
    }
    var a = h(i), b = h(i + 1);
    var s = f * f * (3 - 2 * f);
    return a + (b - a) * s;
  }

  // ==========================================================================
  function Engine(opts) {
    opts = opts || {};
    this.mapa = opts.mapa || LAYOUT.gerarMapaPixels();
    this.cfg = Object.assign({}, PADRAO, opts.cfg || {});
    this.paleta = opts.paleta || LAYOUT.PALETA;
    this.lut = montarLut(this.paleta);

    var n = this.mapa.pixels.length;
    this.n = n;
    this.intensidade = new Float32Array(n);
    this.saida = new Uint8Array(n * 3);

    // Cache plano dos atributos usados no laco quente (evita acesso a objeto)
    this.px = new Float32Array(n);
    this.pTraco = new Int32Array(n);
    this.pPos = new Int32Array(n);
    this.pHalo = new Uint8Array(n);
    for (var i = 0; i < n; i++) {
      var p = this.mapa.pixels[i];
      this.px[i] = p.x; this.pTraco[i] = p.traco;
      this.pPos[i] = p.posNoTraco; this.pHalo[i] = p.halo ? 1 : 0;
    }

    // Indice: primeiro pixel de cada traco, para converter (traco,pos) -> indice
    this.baseTraco = this.mapa.tracos.map(function (t) { return t.indicePrimeiroPixel; });
    this.tamTraco = this.mapa.tracos.map(function (t) { return t.qtdPixels; });

    // Estado de boot de cada componente impresso (0 apagado .. 1 aceso)
    var self = this;
    this.componentes = LAYOUT.COMPONENTES.map(function (c) {
      return { id: c.id, xCentro: c.x + c.l / 2, boot: 0, cintila: 0 };
    });
    void self;

    this.estado = ESTADOS.REPOUSO;
    this.tempo = 0;
    this.tempoNoEstado = 0;
    this.energia = 0;          // 0..1 - quanta energia o painel tem acumulada
    this.frenteOnda = null;    // {x, dir, forca}
    this.rastro = 0;           // memoria do rastro deixado pela frente de onda
    this.pacotes = [];
    this.pessoas = [];
    this.msVazio = 0;
    this.msParado = 0;
    this.ladoEntrada = 1;      // +1 entrou pela esquerda, -1 pela direita
    this.consumoEstimadoW = 0;
    this.escalaAbl = 1;
  }

  // --------------------------------------------------------------------------
  // Entrada dos sensores. Cada pessoa: {id, x(mm), v(mm/s)}
  // A fusao dos dois radares acontece antes daqui (ver firmware/engine-raspberry).
  // --------------------------------------------------------------------------
  Engine.prototype.setPessoas = function (lista) {
    var anterior = this.pessoas;
    this.pessoas = (lista || []).map(function (p) {
      var ant = anterior.filter(function (a) { return a.id === p.id; })[0];
      return { id: p.id, x: p.x, v: p.v !== undefined ? p.v : (ant ? p.x - ant.x : 0) };
    });
    // Primeira pessoa a aparecer define de que ponta a onda parte.
    if (anterior.length === 0 && this.pessoas.length > 0) {
      this.ladoEntrada = this.pessoas[0].x < 6000 ? 1 : -1;
    }
  };

  Engine.prototype.irPara = function (novo) {
    if (this.estado === novo) return;
    this.estado = novo;
    this.tempoNoEstado = 0;
    if (novo === ESTADOS.DESPERTAR) {
      this.frenteOnda = { x: this.ladoEntrada > 0 ? -600 : 12600, dir: this.ladoEntrada, forca: 1 };
      this.rastro = 1;
      this.componentes.forEach(function (c) { c.boot = 0; });
    }
    if (novo === ESTADOS.REPOUSO) { this.pacotes.length = 0; this.energia = 0; }
  };

  // --------------------------------------------------------------------------
  // Transicoes
  // --------------------------------------------------------------------------
  Engine.prototype.atualizarEstado = function (dt) {
    var cfg = this.cfg;
    var temGente = this.pessoas.length > 0;

    if (temGente) this.msVazio = 0; else this.msVazio += dt;

    var vMax = 0;
    this.pessoas.forEach(function (p) { vMax = Math.max(vMax, Math.abs(p.v)); });
    if (temGente && vMax < cfg.limiarParadoMmS) this.msParado += dt; else this.msParado = 0;

    switch (this.estado) {
      case ESTADOS.REPOUSO:
        if (temGente) this.irPara(ESTADOS.DESPERTAR);
        break;

      case ESTADOS.DESPERTAR:
        // a frente terminou de varrer os 12 m -> passa a acompanhar
        if (!this.frenteOnda ||
            (this.frenteOnda.dir > 0 && this.frenteOnda.x > 13200) ||
            (this.frenteOnda.dir < 0 && this.frenteOnda.x < -1200)) {
          this.frenteOnda = null;
          this.irPara(temGente ? ESTADOS.ACOMPANHAR : ESTADOS.ADORMECER);
        }
        break;

      case ESTADOS.ACOMPANHAR:
        if (!temGente && this.msVazio > cfg.tempoParaVazio) this.irPara(ESTADOS.ADORMECER);
        else if (this.msParado > cfg.tempoParaParado) this.irPara(ESTADOS.PERMANENCIA);
        break;

      case ESTADOS.PERMANENCIA:
        if (!temGente && this.msVazio > cfg.tempoParaVazio) this.irPara(ESTADOS.ADORMECER);
        else if (this.msParado === 0) this.irPara(ESTADOS.ACOMPANHAR);
        break;

      case ESTADOS.ADORMECER:
        // reentrada interrompe o adormecer na hora - nada de esperar terminar
        if (temGente) this.irPara(ESTADOS.DESPERTAR);
        else if (this.tempoNoEstado > cfg.duracaoAdormecer) this.irPara(ESTADOS.REPOUSO);
        break;
    }
  };

  // --------------------------------------------------------------------------
  // Pacotes de dados: os "bits" que correm pelas trilhas.
  // --------------------------------------------------------------------------
  Engine.prototype.emitirPacote = function (tracoIdx, sentido, brilho, velocidade) {
    if (this.pacotes.length > 260) return;   // teto de custo por quadro
    var tam = this.tamTraco[tracoIdx];
    this.pacotes.push({
      traco: tracoIdx,
      pos: sentido > 0 ? -6 : tam + 6,
      vel: (velocidade || 90) * sentido,
      comp: 7 + Math.random() * 16,
      brilho: brilho === undefined ? 1 : brilho
    });
  };

  Engine.prototype.moverPacotes = function (dt) {
    var s = dt / 1000, vivos = [];
    for (var i = 0; i < this.pacotes.length; i++) {
      var k = this.pacotes[i];
      k.pos += k.vel * s;
      var tam = this.tamTraco[k.traco];
      if (k.pos > -40 && k.pos < tam + 40) vivos.push(k);
    }
    this.pacotes = vivos;
  };

  // Escolhe uma trilha que passe perto de um X do corredor.
  Engine.prototype.tracoPerto = function (xAlvo, tolerancia) {
    var tol = tolerancia || 1400, cand = [];
    var tr = this.mapa.tracos;
    for (var i = 0; i < tr.length; i++) {
      var pts = tr[i].pts, achou = false;
      for (var j = 0; j < pts.length && !achou; j++) {
        if (Math.abs(pts[j][0] - xAlvo) < tol) achou = true;
      }
      if (achou) cand.push(i);
    }
    return cand.length ? cand[(Math.random() * cand.length) | 0] : -1;
  };

  // --------------------------------------------------------------------------
  // PASSO PRINCIPAL
  // --------------------------------------------------------------------------
  Engine.prototype.passo = function (dt) {
    dt = Math.min(dt, 80);           // protege contra travada de aba/GC
    this.tempo += dt;
    this.tempoNoEstado += dt;
    var cfg = this.cfg, s = dt / 1000;

    this.atualizarEstado(dt);

    // --- energia global ---
    var alvoEnergia =
      this.estado === ESTADOS.REPOUSO     ? 0.00 :
      this.estado === ESTADOS.DESPERTAR   ? 0.85 :
      this.estado === ESTADOS.ACOMPANHAR  ? 0.70 :
      this.estado === ESTADOS.PERMANENCIA ? 0.80 :
      this.estado === ESTADOS.SHOW        ? 0.90 : 0.0;
    var taxa = this.estado === ESTADOS.ADORMECER ? 0.9 : 4.0;
    this.energia += (alvoEnergia - this.energia) * Math.min(1, taxa * s);

    // --- frente de despertar ---
    if (this.frenteOnda) this.frenteOnda.x += cfg.velocidadeOnda * this.frenteOnda.dir * s;
    // O rastro nao pode sumir junto com a frente: sem esta memoria, o instante
    // em que a frente sai do corredor derruba ~200 W de uma vez e a parede
    // "pisca" na passagem para o modo acompanhar.
    if (!this.frenteOnda) this.rastro += (0 - this.rastro) * Math.min(1, 1.4 * s);

    // --- boot dos componentes: acende quando a frente passa por cima ---
    var fr = this.frenteOnda;
    for (var ci = 0; ci < this.componentes.length; ci++) {
      var c = this.componentes[ci];
      var deveAcender = false;
      if (fr) {
        deveAcender = fr.dir > 0 ? (fr.x > c.xCentro) : (fr.x < c.xCentro);
      } else if (this.estado === ESTADOS.ACOMPANHAR || this.estado === ESTADOS.PERMANENCIA) {
        deveAcender = true;
      }
      var alvo = deveAcender ? 1 : 0;
      var vel = this.estado === ESTADOS.ADORMECER ? 1.2 : 6.0;
      c.boot += (alvo - c.boot) * Math.min(1, vel * s);
      // pisca-pisca de partida, como equipamento energizando
      if (deveAcender && c.boot < 0.85) c.cintila = Math.random() < 0.35 ? 1 : 0.4;
      else c.cintila += (1 - c.cintila) * Math.min(1, 8 * s);
    }

    // --- emissao de pacotes ---
    this.emitirConformeEstado(dt);
    this.moverPacotes(dt);

    // --- composicao por pixel ---
    this.compor();

    // --- limitador de brilho / estimativa de consumo ---
    this.aplicarAbl();

    return this.saida;
  };

  Engine.prototype.emitirConformeEstado = function (dt) {
    var cfg = this.cfg, self = this;
    var esperado = 0, sentidoPadrao = this.ladoEntrada;

    if (this.estado === ESTADOS.REPOUSO) {
      esperado = 0.35;   // um pacote solitario a cada ~3 s: a parede respira
    } else if (this.estado === ESTADOS.DESPERTAR) {
      esperado = cfg.pacotesPorSegundo * 1.6;
    } else if (this.estado === ESTADOS.ACOMPANHAR) {
      // sem ninguem detectado, a emissao ja comeca a ceder antes de adormecer
      esperado = cfg.pacotesPorSegundo * (this.pessoas.length ? 1 : 0.25);
    } else if (this.estado === ESTADOS.PERMANENCIA) {
      esperado = cfg.pacotesPorSegundo * 0.8;
    } else if (this.estado === ESTADOS.ADORMECER) {
      esperado = 2;
    } else if (this.estado === ESTADOS.SHOW) {
      esperado = cfg.pacotesPorSegundo * 1.8;
    }

    var qtd = esperado * (dt / 1000);
    var inteiros = Math.floor(qtd) + (Math.random() < (qtd % 1) ? 1 : 0);

    for (var i = 0; i < inteiros; i++) {
      var alvoX, sentido = sentidoPadrao, brilho = 1, vel = 90;

      if (this.estado === ESTADOS.DESPERTAR && this.frenteOnda) {
        // pacotes nascem colados na frente de onda
        alvoX = this.frenteOnda.x;
        vel = 150;
      } else if (this.pessoas.length && this.estado !== ESTADOS.REPOUSO) {
        var p = this.pessoas[(Math.random() * this.pessoas.length) | 0];
        alvoX = p.x + (Math.random() - 0.5) * 2600;
        sentido = p.v > 60 ? 1 : (p.v < -60 ? -1 : (Math.random() < 0.5 ? 1 : -1));
        // andando rapido, os dados correm mais rapido junto
        vel = 70 + Math.min(180, Math.abs(p.v) / 8);
        if (this.estado === ESTADOS.PERMANENCIA) {
          // parado: os dados convergem para o processador
          alvoX = 4400 + (Math.random() - 0.5) * 3000;
          sentido = alvoX > 4400 ? -1 : 1;
          vel = 110;
        }
      } else {
        alvoX = Math.random() * 12000;
        brilho = 0.45;
        vel = 45;
      }

      var ti = self.tracoPerto(alvoX, this.estado === ESTADOS.REPOUSO ? 6000 : 1600);
      if (ti >= 0) self.emitirPacote(ti, sentido, brilho, vel);
    }
  };

  // --------------------------------------------------------------------------
  // Composicao: um valor de intensidade por pixel, depois LUT -> RGB.
  // --------------------------------------------------------------------------
  Engine.prototype.compor = function () {
    var n = this.n, cfg = this.cfg, I = this.intensidade;
    var t = this.tempo / 1000;
    var base = cfg.nivelRepouso;
    var fr = this.frenteOnda;
    var pess = this.pessoas;
    var energia = this.energia;

    // escoamento no adormecer: a energia esvazia do centro para as pontas
    var rastro = this.rastro; void rastro;
    var escoando = this.estado === ESTADOS.ADORMECER
      ? Math.min(1, this.tempoNoEstado / cfg.duracaoAdormecer) : 0;

    for (var i = 0; i < n; i++) {
      var x = this.px[i];

      // 1. PISO de repouso, com respiro lento e cintilar deterministico.
      //    Este termo nunca escoa: e o que garante que o corredor volte ao
      //    repouso por transicao suave e nao com um apagao seguido de reacender.
      var piso = base * (1 + cfg.respiracaoRepouso *
        (Math.sin(t * 0.55 + x * 0.0006) + ruido1d(x * 0.004 + t * 0.35, 7) * 0.8));

      // 2. EXTRA: tudo que e reacao a presenca. So este termo escoa.
      var extra = energia * 0.22;

      // 3. frente de despertar
      if (fr) {
        var d = (x - fr.x) / cfg.larguraOnda;
        extra += Math.exp(-d * d) * cfg.ganhoOnda * fr.forca;
        // rastro atras da frente: a trilha fica energizada depois que passa
        if ((fr.dir > 0 && x < fr.x) || (fr.dir < 0 && x > fr.x)) extra += 0.18 * this.rastro;
      } else if (this.rastro > 0.001) {
        // frente ja saiu: o corredor inteiro esta varrido, o rastro decai por igual
        extra += 0.18 * this.rastro;
      }

      // 4. halo que acompanha cada pessoa, ligeiramente adiantado no sentido
      //    da caminhada - a luz "convida" em vez de perseguir
      for (var k = 0; k < pess.length; k++) {
        var p = pess[k];
        var alvo = p.x + (p.v > 0 ? cfg.avancoPessoa : (p.v < 0 ? -cfg.avancoPessoa : 0));
        var dp = (x - alvo) / cfg.raioPessoa;
        extra += Math.exp(-dp * dp) * cfg.ganhoPessoa;
      }

      // 5. escoamento: a energia esvazia primeiro no centro e sai pelas pontas
      if (escoando > 0) {
        var distDaPonta = Math.min(x, 12000 - x) / 6000;   // 0 na ponta, 1 no centro
        extra *= Math.max(0, 1 - escoando * (0.35 + 0.9 * distDaPonta));
      }

      I[i] = piso + extra;
    }

    // 6. pacotes - so tocam os pixels da propria trilha
    var fadePacote = 1 - escoando * 0.95;
    for (var q = 0; q < this.pacotes.length; q++) {
      var pk = this.pacotes[q];
      var b0 = this.baseTraco[pk.traco], tam = this.tamTraco[pk.traco];
      var ini = Math.max(0, Math.floor(pk.vel > 0 ? pk.pos - pk.comp : pk.pos));
      var fim = Math.min(tam - 1, Math.ceil(pk.vel > 0 ? pk.pos : pk.pos + pk.comp));
      for (var j = ini; j <= fim; j++) {
        var dist = Math.abs(pk.pos - j) / pk.comp;
        if (dist > 1) continue;
        var f = (1 - dist); f = f * f;
        I[b0 + j] += f * pk.brilho * 0.95 * fadePacote;
      }
    }

    // 7. halos dos componentes seguem o boot da peca correspondente
    var tracos = this.mapa.tracos;
    for (var ti = 0; ti < tracos.length; ti++) {
      var tr = tracos[ti];
      if (!tr.halo || !tr.componente) continue;
      var comp = null;
      for (var z = 0; z < this.componentes.length; z++) {
        if (this.componentes[z].id === tr.componente) { comp = this.componentes[z]; break; }
      }
      if (!comp) continue;
      var g = comp.boot * comp.cintila;
      var b = tr.indicePrimeiroPixel;
      for (var w = 0; w < tr.qtdPixels; w++) I[b + w] = I[b + w] * (1 - 0.45 * g) + g * 0.52;
    }

    // 8. LUT -> RGB
    var out = this.saida, lut = this.lut, bg = cfg.brilhoGlobal * cfg.brilhoMestre;
    for (var m = 0; m < n; m++) {
      var val = I[m] * bg;
      val = val < 0 ? 0 : (val > 1 ? 1 : val);
      var idx = (val * 255) | 0;
      out[m * 3]     = lut[idx * 3];
      out[m * 3 + 1] = lut[idx * 3 + 1];
      out[m * 3 + 2] = lut[idx * 3 + 2];
    }
  };

  // --------------------------------------------------------------------------
  // ABL - limitador automatico de brilho.
  // Estima a corrente do quadro e, se passar do teto, escala o quadro inteiro.
  // Escalar tudo junto preserva a composicao: melhor a cena inteira 8% mais
  // fraca do que uma zona clipando e "chapando" o desenho.
  // --------------------------------------------------------------------------
  Engine.prototype.aplicarAbl = function (limiteA) {
    var out = this.saida, n = this.n;
    var soma = 0;
    for (var i = 0; i < n * 3; i++) soma += out[i];
    // WS2815 12 V: 0,25 W por LED em branco pleno -> 20,8 mA por LED -> 6,94 mA
    // por canal. (Usar os 20 mA/canal da familia 5 V superestima em 3x.)
    var correnteA = (soma / 255) * 0.00694;
    var teto = limiteA === undefined ? 120 : limiteA;   // 4 zonas x 30 A

    this.escalaAbl = 1;
    if (correnteA > teto) {
      this.escalaAbl = teto / correnteA;
      for (var j = 0; j < n * 3; j++) out[j] = (out[j] * this.escalaAbl) | 0;
      correnteA = teto;
    }
    this.consumoEstimadoW = correnteA * 12;
    this.correnteEstimadaA = correnteA;
  };

  Engine.prototype.telemetria = function () {
    return {
      estado: this.estado,
      energia: this.energia,
      pacotes: this.pacotes.length,
      pessoas: this.pessoas.length,
      consumoW: this.consumoEstimadoW,
      correnteA: this.correnteEstimadaA || 0,
      abl: this.escalaAbl,
      msVazio: this.msVazio
    };
  };

  var API = { Engine: Engine, ESTADOS: ESTADOS, PADRAO: PADRAO, montarLut: montarLut };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.ENGINE = API;

})(typeof globalThis !== 'undefined' ? globalThis : this);
