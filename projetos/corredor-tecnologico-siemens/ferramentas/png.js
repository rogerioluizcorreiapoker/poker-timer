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
