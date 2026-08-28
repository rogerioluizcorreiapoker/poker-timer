/* Leitor do radar HLK-LD2450.
 * Entrega ate 3 alvos com coordenadas em mm, ja convertidos para a coordenada
 * unica do corredor (0..12000). */
'use strict';

const CABECALHO = Buffer.from([0xAA, 0xFF, 0x03, 0x00]);
const RODAPE    = Buffer.from([0x55, 0xCC]);
const TAM_QUADRO = 30;   // 4 cabecalho + 3 alvos x 8 bytes + 2 rodape

/* Convencao de sinal do LD2450: o bit 15 NAO e complemento de dois.
 * Bit 15 ligado  -> valor positivo, magnitude nos 15 bits baixos
 * Bit 15 desligado -> valor negativo
 * Conferir contra a revisao do datasheet do lote recebido antes de subir. */
function decodificar(bruto) {
  const mag = bruto & 0x7FFF;
  return (bruto & 0x8000) ? mag : -mag;
}

class RadarLD2450 {
  /* @param cfg {id, xMontagem, sentido}  sentido +1 olha para x crescente */
  constructor(cfg) {
    this.cfg = cfg;
    this.buf = Buffer.alloc(0);
    this.alvos = [];
    this.ultimoQuadro = 0;
  }

  /* Alimenta com bytes crus da serial; devolve os alvos do ultimo quadro. */
  alimentar(chunk) {
    this.buf = Buffer.concat([this.buf, chunk]);
    let i;
    while ((i = this.buf.indexOf(CABECALHO)) !== -1) {
      if (this.buf.length < i + TAM_QUADRO) break;
      const q = this.buf.subarray(i, i + TAM_QUADRO);
      if (q.subarray(TAM_QUADRO - 2).equals(RODAPE)) {
        this.alvos = this._extrair(q);
        this.ultimoQuadro = Date.now();
      }
      this.buf = this.buf.subarray(i + TAM_QUADRO);
    }
    // nao deixa lixo acumular se a serial estiver fora de sincronia
    if (this.buf.length > TAM_QUADRO * 8) this.buf = this.buf.subarray(this.buf.length - TAM_QUADRO);
    return this.alvos;
  }

  _extrair(q) {
    const saida = [];
    for (let k = 0; k < 3; k++) {
      const o = 4 + k * 8;
      const x = decodificar(q.readUInt16LE(o));      // lateral, mm
      const y = decodificar(q.readUInt16LE(o + 2));  // distancia no eixo, mm
      const v = decodificar(q.readUInt16LE(o + 4));  // velocidade, cm/s
      if (x === 0 && y === 0) continue;              // slot vazio
      if (y <= 0 || y > this.cfg.alcance) continue;  // fora da cobertura util

      saida.push({
        sensor: this.cfg.id,
        slot: k,
        // projeta a distancia do radar na coordenada do corredor
        x: this.cfg.xMontagem + this.cfg.sentido * y,
        lateral: x,
        v: this.cfg.sentido * v * 10,               // cm/s -> mm/s
        // leitura perto do radar e mais confiavel que no limite do alcance
        confianca: Math.max(0.05, 1 - y / this.cfg.alcance)
      });
    }
    return saida;
  }

  get vivo() { return Date.now() - this.ultimoQuadro < 1500; }
}

/* Funde os alvos dos dois radares numa lista unica de pessoas.
 * Tres problemas resolvidos aqui:
 *   1. na faixa de sobreposicao (~5 a 7 m) o mesmo alvo aparece nos dois
 *      radares - vence o de maior confianca;
 *   2. o id da pessoa nao pode trocar entre quadros, senao a luz "pula" -
 *      por isso o casamento por proximidade com o quadro anterior;
 *   3. duas pessoas caminhando lado a lado tem quase o mesmo X e sao unidas
 *      num alvo so. Isso e proposital: a parede e unidimensional, e dois halos
 *      sobrepostos a 40 cm de distancia so produzem um borrao mais claro. */
class Fusao {
  constructor(opts) {
    this.raioUniao = (opts && opts.raioUniao) || 900;     // mm
    this.raioRastro = (opts && opts.raioRastro) || 1200;  // mm
    this.anteriores = [];
    this.proxId = 1;
  }

  processar(listas) {
    // 1. junta tudo e elimina duplicatas entre sensores
    const brutos = [].concat.apply([], listas)
      .sort((a, b) => b.confianca - a.confianca);
    const unicos = [];
    brutos.forEach((a) => {
      if (!unicos.some((u) => Math.abs(u.x - a.x) < this.raioUniao)) unicos.push(a);
    });

    // 2. casa com o quadro anterior para manter o id estavel
    const livres = this.anteriores.slice();
    const saida = unicos.map((a) => {
      let melhor = -1, dist = this.raioRastro;
      livres.forEach((p, i) => {
        const d = Math.abs(p.x - a.x);
        if (d < dist) { dist = d; melhor = i; }
      });
      const id = melhor >= 0 ? livres.splice(melhor, 1)[0].id : this.proxId++;
      return { id, x: a.x, v: a.v, confianca: a.confianca };
    });

    this.anteriores = saida;
    return saida;
  }
}

module.exports = { RadarLD2450, Fusao, decodificar };
