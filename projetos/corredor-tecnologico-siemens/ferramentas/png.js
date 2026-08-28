/* Decodificador PNG minimo (8 bits, RGB ou RGBA, sem entrelacamento).
 * So o suficiente para ler as capturas do Chromium sem dependencia externa. */
'use strict';
const zlib = require('zlib');

function decodificar(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('nao e PNG');
  let pos = 8, larg = 0, alt = 0, prof = 0, tipo = 0;
  const idat = [];

  while (pos < buf.length) {
    const tam = buf.readUInt32BE(pos);
    const nome = buf.toString('ascii', pos + 4, pos + 8);
    const dados = buf.subarray(pos + 8, pos + 8 + tam);
    if (nome === 'IHDR') {
      larg = dados.readUInt32BE(0); alt = dados.readUInt32BE(4);
      prof = dados[8]; tipo = dados[9];
      if (dados[12] !== 0) throw new Error('PNG entrelacado nao suportado');
    } else if (nome === 'IDAT') idat.push(dados);
    else if (nome === 'IEND') break;
    pos += 12 + tam;
  }
  if (prof !== 8) throw new Error('profundidade ' + prof + ' nao suportada');
  const canais = tipo === 6 ? 4 : tipo === 2 ? 3 : 0;
  if (!canais) throw new Error('tipo de cor ' + tipo + ' nao suportado');

  const bruto = zlib.inflateSync(Buffer.concat(idat));
  const passo = larg * canais;
  const saida = Buffer.alloc(alt * passo);

  // desfaz os filtros por linha (spec PNG, secao 9)
  for (let y = 0; y < alt; y++) {
    const filtro = bruto[y * (passo + 1)];
    const linha = bruto.subarray(y * (passo + 1) + 1, (y + 1) * (passo + 1));
    const destino = saida.subarray(y * passo, (y + 1) * passo);
    const anterior = y > 0 ? saida.subarray((y - 1) * passo, y * passo) : null;

    for (let i = 0; i < passo; i++) {
      const a = i >= canais ? destino[i - canais] : 0;
      const b = anterior ? anterior[i] : 0;
      const c = (anterior && i >= canais) ? anterior[i - canais] : 0;
      let v = linha[i];
      switch (filtro) {
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
          break;
        }
      }
      destino[i] = v & 0xff;
    }
  }
  return { largura: larg, altura: alt, canais, dados: saida };
}

module.exports = { decodificar };

/* ---------------------------------------------------------------------------
 * Codificador PNG (RGBA, 8 bits, sem filtro). O suficiente para gravar os
 * recortes de marca sem trazer dependencia de imagem para o projeto.
 * ------------------------------------------------------------------------- */
const TABELA_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABELA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloco(nome, dados) {
  const cab = Buffer.alloc(8);
  cab.writeUInt32BE(dados.length, 0);
  cab.write(nome, 4, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(nome, 'ascii'), dados])), 0);
  return Buffer.concat([cab, dados, crc]);
}

/* rgba: Buffer com largura*altura*4 bytes */
function codificar(largura, altura, rgba) {
  const passo = largura * 4;
  const bruto = Buffer.alloc(altura * (passo + 1));
  for (let y = 0; y < altura; y++) {
    bruto[y * (passo + 1)] = 0;                       // filtro None
    rgba.copy(bruto, y * (passo + 1) + 1, y * passo, (y + 1) * passo);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8;    // profundidade
  ihdr[9] = 6;    // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloco('IHDR', ihdr),
    bloco('IDAT', zlib.deflateSync(bruto, { level: 9 })),
    bloco('IEND', Buffer.alloc(0))
  ]);
}

module.exports.codificar = codificar;
