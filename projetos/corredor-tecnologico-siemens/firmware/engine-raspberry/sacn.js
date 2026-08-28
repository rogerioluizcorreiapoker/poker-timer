/* Emissor sACN / E1.31 minimo (ANSI E1.31-2018), unicast.
 * So o necessario para empurrar quadros: sem descoberta, sem sincronismo
 * por pacote - a rede e dedicada e cabeada. */
'use strict';
const dgram = require('dgram');

const PORTA = 5568;
const TAM_PACOTE = 638;
const ID_ACN = Buffer.from('ASC-E1.17\0\0\0', 'ascii');

class EmissorSACN {
  constructor(opts) {
    this.cid = opts.cid || Buffer.from([
      0x6b, 0x2f, 0x41, 0x77, 0x9c, 0x11, 0x4e, 0x62,
      0xa8, 0x30, 0x51, 0x0d, 0x9c, 0x64, 0x1b, 0x77
    ]);
    this.nome = (opts.nome || 'Corredor Siemens').slice(0, 63);
    this.prioridade = opts.prioridade || 100;
    this.sock = dgram.createSocket('udp4');
    this.sequencias = new Map();
    this.pacote = this._molde();
  }

  _molde() {
    const p = Buffer.alloc(TAM_PACOTE);
    // --- camada raiz ---
    p.writeUInt16BE(0x0010, 0);          // tamanho do preambulo
    p.writeUInt16BE(0x0000, 2);          // pos-ambulo
    ID_ACN.copy(p, 4);                   // identificador do pacote ACN
    p.writeUInt16BE(0x7000 | (TAM_PACOTE - 16), 16);  // flags + comprimento
    p.writeUInt32BE(0x00000004, 18);     // vetor: E1.31 sobre UDP
    this.cid.copy(p, 22);
    // --- camada de enquadramento ---
    p.writeUInt16BE(0x7000 | (TAM_PACOTE - 38), 38);
    p.writeUInt32BE(0x00000002, 40);     // vetor: pacote de dados
    p.write(this.nome, 44, 64, 'ascii');
    p.writeUInt8(this.prioridade, 108);
    p.writeUInt16BE(0, 109);             // endereco de sincronismo (nao usado)
    p.writeUInt8(0, 111);                // sequencia (por universo, no envio)
    p.writeUInt8(0, 112);                // opcoes
    p.writeUInt16BE(0, 113);             // universo (no envio)
    // --- camada DMP ---
    p.writeUInt16BE(0x7000 | (TAM_PACOTE - 115), 115);
    p.writeUInt8(0x02, 117);             // vetor: definir propriedade
    p.writeUInt8(0xa1, 118);             // tipo de endereco e dado
    p.writeUInt16BE(0x0000, 119);        // primeiro endereco de propriedade
    p.writeUInt16BE(0x0001, 121);        // incremento
    p.writeUInt16BE(513, 123);           // 1 start code + 512 canais
    p.writeUInt8(0x00, 125);             // start code DMX
    return p;
  }

  /* dados: Buffer de ate 512 bytes */
  enviar(ip, universo, dados) {
    const p = this.pacote;
    const seq = ((this.sequencias.get(universo) || 0) + 1) & 0xff;
    this.sequencias.set(universo, seq);
    p.writeUInt8(seq, 111);
    p.writeUInt16BE(universo, 113);
    p.fill(0, 126);
    dados.copy(p, 126, 0, Math.min(512, dados.length));
    this.sock.send(p, 0, TAM_PACOTE, PORTA, ip);
  }

  fechar() { this.sock.close(); }
}

module.exports = { EmissorSACN, PORTA, TAM_PACOTE };
