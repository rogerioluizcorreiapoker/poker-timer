/* Prepara a marca NexLayer3D para uso sobre fundo escuro.
 *
 * O arquivo original e tinta escura sobre branco. Sobre o video, o wordmark
 * preto sumiria. Aqui o fundo branco vira transparencia e a tinta neutra vira
 * clara, preservando o teal do simbolo — que e o elemento de marca.
 *
 *   node preparar-logo.js <entrada.png> <saida.png>
 */
'use strict';
const fs = require('fs');
const { decodificar, codificar } = require('./png.js');

const args = process.argv.slice(2);
const escuro = args.includes('--escuro');   // mantem a tinta escura (para papel)
const [ent, sai] = args.filter((a) => !a.startsWith('--'));
if (!ent || !sai) {
  console.error('uso: preparar-logo.js [--escuro] <entrada.png> <saida.png>');
  process.exit(1);
}

const img = decodificar(fs.readFileSync(ent));
const { largura: W, altura: H, canais: C, dados: D } = img;

/* O original e JPEG: tem fundo off-white (~250, nao 255) e ruido de croma.
 * Dois cuidados nascem disso:
 *   - alfa so comeca a subir bem abaixo do branco, senao o fundo inteiro vira
 *     um veu semitransparente;
 *   - um pixel so conta como cor de marca se for cromatico E claro; sem a
 *     segunda condicao, o ruido dentro das letras pretas passa por teal e
 *     aparece como furo escuro no wordmark. */
const BRANCO_ATE = 226;     // acima disso: transparente
const TINTA_DE = 158;       // abaixo disso: opaco
const LIMIAR_CROMA = 20;
const LUM_MIN_MARCA = 90;   // cor de marca tem luminancia media; tinta preta nao
const CLARO = [236, 244, 246];
const ESCURO = [14, 22, 27];

// 1. caixa delimitadora: o original vem com margem branca larga
let x0 = W, y0 = H, x1 = 0, y1 = 0;
const BORDA = 6;   // a imagem enviada traz moldura fina; ignorar ao medir
for (let y = BORDA; y < H - BORDA; y++) for (let x = BORDA; x < W - BORDA; x++) {
  const o = (y * W + x) * C;
  const min = Math.min(D[o], D[o + 1], D[o + 2]);
  if (255 - min > 60) {
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
}
const margem = 6;
x0 = Math.max(0, x0 - margem); y0 = Math.max(0, y0 - margem);
x1 = Math.min(W - 1, x1 + margem); y1 = Math.min(H - 1, y1 + margem);
const LW = x1 - x0 + 1, LH = y1 - y0 + 1;

// 2. recorte do fundo e recoloracao
const saida = Buffer.alloc(LW * LH * 4);
let teal = 0, tinta = 0;
for (let y = 0; y < LH; y++) {
  for (let x = 0; x < LW; x++) {
    const o = ((y + y0) * W + (x + x0)) * C;
    const r = D[o], g = D[o + 1], b = D[o + 2];
    const min = Math.min(r, g, b), max = Math.max(r, g, b);

    /* Alfa pela distancia ao branco, nao pela luminancia: o simbolo teal tem
     * luminancia media e ficaria semitransparente se o alfa saisse do brilho. */
    let a = (BRANCO_ATE - min) / (BRANCO_ATE - TINTA_DE);
    a = a < 0 ? 0 : (a > 1 ? 1 : a);

    const d = (y * LW + x) * 4;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (max - min > LIMIAR_CROMA && lum > LUM_MIN_MARCA) {
      // simbolo: preserva a cor, so levanta um pouco para o fundo escuro
      const ganho = escuro ? 1.0 : 1.16;
      saida[d]     = Math.min(255, r * ganho);
      saida[d + 1] = Math.min(255, g * ganho);
      saida[d + 2] = Math.min(255, b * ganho);
      teal++;
    } else {
      const cor = escuro ? ESCURO : CLARO;
      saida[d] = cor[0]; saida[d + 1] = cor[1]; saida[d + 2] = cor[2];
      if (a > 0.08) tinta++;
    }
    saida[d + 3] = Math.round(a * 255);
  }
}

fs.writeFileSync(sai, codificar(LW, LH, saida));
console.log('OK ->', sai);
console.log('   ', W + 'x' + H, '->', LW + 'x' + LH, '(recortado)');
console.log('    pixels de símbolo:', teal, '| de wordmark:', tinta);
