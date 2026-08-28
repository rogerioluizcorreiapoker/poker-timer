/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - RENDERIZADOR DE VIDEO
 * -----------------------------------------------------------------------------
 * Camera 3D percorrendo o corredor, com a parede rodando o engine de verdade.
 *
 * Raytracer de planos em JS puro: para cada pixel da tela, lanca um raio e
 * cruza com parede / piso / teto / parede oposta / fundo. Quatro planos e uma
 * reflexao - barato, e a perspectiva sai exata sem truque de CSS.
 *
 *   node render-video.js --em 8.5 > quadro.raw     um quadro para inspecao
 *   node render-video.js --mp4 saida.mp4           video completo
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const LAYOUT = require('../sistema/layout.js');
const ENGINE = require('../sistema/engine.js');
const { decodificar } = require('./png.js');

// --------------------------------------------------------------------- saida
const LARG = 1600, ALT = 900, FPS = 30;       // render
const SAIDA_LARG = 1280, SAIDA_ALT = 720;    // entrega
const DURACAO = 31;                                   // segundos
const raiz = path.join(__dirname, '..');

// ------------------------------------------------------------------ cenario
// Corredor em mm. A parede de LED e o plano z=0; a camera anda dentro.
const CENA = {
  larguraCorredor: 2400,     // z do plano da parede ate a parede oposta
  peDireito: 2700,
  fimCorredor: 12800,        // parede de fundo
  inicioCorredor: -6500      // trecho de corredor antes de a parede comecar
};

// ------------------------------------------------------------------ texturas
const mat = decodificar(fs.readFileSync(path.join(raiz, 'desenhos/material.png')));
const MAT_ESC = 0.35;                                  // px/mm da textura
const ALT_MM = LAYOUT.CORREDOR.faixaBase + LAYOUT.CORREDOR.faixaAltura;  // 2050

const EMI_ESC = 0.12;
const EW = Math.round(LAYOUT.CORREDOR.comprimento * EMI_ESC);
const EH = Math.round(ALT_MM * EMI_ESC);
const emi = new Float32Array(EW * EH * 3);

const BW = EW >> 2, BH = EH >> 2;                      // brilho amplo
const bloom = new Float32Array(BW * BH * 3);
const bloomTmp = new Float32Array(BW * BH * 3);

// ------------------------------------------------------------------- engine
const mapa = LAYOUT.gerarMapaPixels();
const motor = new ENGINE.Engine({ mapa });
// No projeto sao 12 s de corredor vazio antes de adormecer. Num video de 30 s
// isso seriam 12 s de nada - encurtado aqui, e a legenda avisa.
motor.cfg.tempoParaVazio = 2500;

const ex = new Int16Array(mapa.pixels.length);
const ey = new Int16Array(mapa.pixels.length);
mapa.pixels.forEach((p, i) => {
  ex[i] = Math.round(p.x * EMI_ESC);
  ey[i] = Math.round((LAYOUT.CORREDOR.faixaAltura - p.y) * EMI_ESC);
});

function pintarEmissivo(rgb) {
  emi.fill(0);
  for (let i = 0, n = ex.length; i < n; i++) {
    const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
    if (r + g + b < 6) continue;
    const x = ex[i], y = ey[i];
    for (let dy = 0; dy < 2; dy++) {
      const yy = y + dy; if (yy < 0 || yy >= EH) continue;
      for (let dx = 0; dx < 2; dx++) {
        const xx = x + dx; if (xx < 0 || xx >= EW) continue;
        const o = (yy * EW + xx) * 3;
        emi[o] += r; emi[o + 1] += g; emi[o + 2] += b;
      }
    }
  }
}

/* Brilho amplo: reduz 4x e passa duas caixas separaveis. E o que um difusor
 * faz - a luz nao para na borda da canaleta. */
function calcularBloom() {
  bloom.fill(0);
  for (let y = 0; y < BH; y++) {
    for (let x = 0; x < BW; x++) {
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          const o = ((y * 4 + j) * EW + (x * 4 + i)) * 3;
          r += emi[o]; g += emi[o + 1]; b += emi[o + 2];
        }
      }
      const o = (y * BW + x) * 3;
      bloom[o] = r / 16; bloom[o + 1] = g / 16; bloom[o + 2] = b / 16;
    }
  }
  for (let passe = 0; passe < 2; passe++) {
    const R = 3;
    for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = -R; i <= R; i++) {
        const xx = x + i; if (xx < 0 || xx >= BW) continue;
        const o = (y * BW + xx) * 3; r += bloom[o]; g += bloom[o + 1]; b += bloom[o + 2]; n++;
      }
      const o = (y * BW + x) * 3;
      bloomTmp[o] = r / n; bloomTmp[o + 1] = g / n; bloomTmp[o + 2] = b / n;
    }
    for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let j = -R; j <= R; j++) {
        const yy = y + j; if (yy < 0 || yy >= BH) continue;
        const o = (yy * BW + x) * 3; r += bloomTmp[o]; g += bloomTmp[o + 1]; b += bloomTmp[o + 2]; n++;
      }
      const o = (y * BW + x) * 3;
      bloom[o] = r / n; bloom[o + 1] = g / n; bloom[o + 2] = b / n;
    }
  }
}

// ------------------------------------------------------------- amostragem
const amostra = [0, 0, 0];

function amostrarParede(x, yMundo, ganhoEmi) {
  // material (bilinear)
  const u = x * MAT_ESC, v = (ALT_MM - yMundo) * MAT_ESC;
  let mr = 12, mg = 16, mb = 19;
  if (u >= 0 && u < mat.largura - 1 && v >= 0 && v < mat.altura - 1) {
    const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0;
    const c = mat.canais, p = mat.dados;
    const o00 = (y0 * mat.largura + x0) * c, o10 = o00 + c;
    const o01 = o00 + mat.largura * c, o11 = o01 + c;
    const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
    mr = p[o00] * w00 + p[o10] * w10 + p[o01] * w01 + p[o11] * w11;
    mg = p[o00 + 1] * w00 + p[o10 + 1] * w10 + p[o01 + 1] * w01 + p[o11 + 1] * w11;
    mb = p[o00 + 2] * w00 + p[o10 + 2] * w10 + p[o01 + 2] * w01 + p[o11 + 2] * w11;
  }

  // emissivo nitido
  const eu = x * EMI_ESC, ev = (ALT_MM - yMundo) * EMI_ESC;
  let er = 0, eg = 0, eb = 0;
  if (eu >= 0 && eu < EW - 1 && ev >= 0 && ev < EH - 1) {
    const x0 = eu | 0, y0 = ev | 0, fx = eu - x0, fy = ev - y0;
    const o00 = (y0 * EW + x0) * 3, o10 = o00 + 3;
    const o01 = o00 + EW * 3, o11 = o01 + 3;
    const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
    er = emi[o00] * w00 + emi[o10] * w10 + emi[o01] * w01 + emi[o11] * w11;
    eg = emi[o00 + 1] * w00 + emi[o10 + 1] * w10 + emi[o01 + 1] * w01 + emi[o11 + 1] * w11;
    eb = emi[o00 + 2] * w00 + emi[o10 + 2] * w10 + emi[o01 + 2] * w01 + emi[o11 + 2] * w11;
  }

  amostrarBloom(x, yMundo);
  amostra[0] = mr + curva(er * 1.05 + bl[0] * 2.3) * ganhoEmi;
  amostra[1] = mg + curva(eg * 1.05 + bl[1] * 2.3) * ganhoEmi;
  amostra[2] = mb + curva(eb * 1.05 + bl[2] * 2.3) * ganhoEmi;
}

/* Expoente > 1 derruba os valores baixos e preserva os altos: o repouso fica
 * nitidamente mais escuro que o desperto, que e a leitura que o video precisa
 * entregar. Sem isso os dois estados parecem iguais. */
function curva(v) {
  if (v <= 0) return 0;
  const n = v / 255;
  return 255 * Math.pow(n > 1 ? 1 : n, 1.38);
}

const bl = [0, 0, 0];
function amostrarBloom(x, yMundo) {
  const u = x * EMI_ESC / 4, v = (ALT_MM - yMundo) * EMI_ESC / 4;
  if (u < 0 || u >= BW - 1 || v < 0 || v >= BH - 1) { bl[0] = bl[1] = bl[2] = 0; return; }
  const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0;
  const o00 = (y0 * BW + x0) * 3, o10 = o00 + 3, o01 = o00 + BW * 3, o11 = o01 + 3;
  const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
  bl[0] = bloom[o00] * w00 + bloom[o10] * w10 + bloom[o01] * w01 + bloom[o11] * w11;
  bl[1] = bloom[o00 + 1] * w00 + bloom[o10 + 1] * w10 + bloom[o01 + 1] * w01 + bloom[o11 + 1] * w11;
  bl[2] = bloom[o00 + 2] * w00 + bloom[o10 + 2] * w10 + bloom[o01 + 2] * w01 + bloom[o11 + 2] * w11;
}


// ==========================================================================
// CAMERA
// ==========================================================================
const GRAU = Math.PI / 180;
const FOV_H = 66 * GRAU;
const tanH = Math.tan(FOV_H / 2);
const tanV = tanH * ALT / LARG;

/* TRES TOMADAS, com corte entre elas.
 *
 *   A (0 - 5 s)     corredor vazio, camera rente a parede. O repouso.
 *   B (5 - 18,5 s)  camera segue 5,6 m atras da pessoa. A onda varre, a luz
 *                   caminha junto, a pessoa para na marca.
 *   C (18,5 - 31 s) camera junto da marca. A pessoa sai e a energia escoa.
 *
 * A distancia de 5,6 m na tomada B nao e estetica, e otica: com lente de 66
 * graus, uma pessoa a menos de 4,5 m ocupa mais de 70% da altura do quadro e
 * tapa justamente a parede que o video existe para mostrar.
 */
function suave(a) { return a * a * (3 - 2 * a); }
function interp(a, b, f) { return a + (b - a) * suave(Math.max(0, Math.min(1, f))); }

function camEm(t) {
  let c;
  if (t < 5.5) {
    // A - rente a parede, quase perpendicular. Pega o repouso e a onda de
    // despertar cruzando o quadro. Encerra antes de a pessoa alcancar a
    // camera: a 87 cm ela viraria um vulto tapando a parede inteira.
    const f = t / 5.5;
    c = { x: interp(1000, 1450, f), y: 1600, z: 1150,
          yaw: interp(-54, -50, f), pitch: -2.0 };
  } else if (t < 10) {
    // B - contraplano. Camera parada la na frente, olhando para tras: a pessoa
    // vem em nossa direcao com o halo em volta e a parede corre a direita.
    const f = (t - 5.5) / 4.5;
    c = { x: 11200, y: 1640, z: 1450,
          yaw: interp(196, 199, f), pitch: -1.2 };
  } else if (t < 19.5) {
    // C - 5,4 m atras da pessoa, ate ela parar na marca.
    const p = pessoaEm(t);
    const f = (t - 10) / 9.5;
    c = { x: (p ? p.x : X_MARCA) - 5400, y: 1620,
          z: interp(1400, 1250, f), yaw: interp(-16, -21, f), pitch: -1.5 };
  } else {
    // D - junto da marca. A pessoa sai de quadro e a energia escoa.
    const f = (t - 19.5) / 11.5;
    c = { x: interp(3800, 5200, f), y: 1620,
          z: interp(1350, 1620, f), yaw: interp(-28, -20, f), pitch: -1.2 };
  }
  c.y += Math.sin(t * 1.15) * 7 + Math.sin(t * 0.47) * 4;
  c.yaw += Math.sin(t * 0.63) * 0.22;
  return c;
}

function baseCamera(c) {
  const cy = Math.cos(c.yaw * GRAU), sy = Math.sin(c.yaw * GRAU);
  const cp = Math.cos(c.pitch * GRAU), sp = Math.sin(c.pitch * GRAU);
  const F = [cp * cy, sp, cp * sy];
  const R = [-sy, 0, cy];
  const U = [R[1] * F[2] - R[2] * F[1], R[2] * F[0] - R[0] * F[2], R[0] * F[1] - R[1] * F[0]];
  return { F, R, U };
}

// ==========================================================================
// ROTEIRO — quem esta no corredor a cada instante
// ==========================================================================
const ENTRA = 4.0, VEL = 950, X_INICIAL = -900;   // mm/s - passo de corredor
const X_MARCA = LAYOUT.MARCA.x + LAYOUT.MARCA.largura / 2;
const T_CHEGA = ENTRA + (X_MARCA - X_INICIAL) / VEL;
const T_RETOMA = T_CHEGA + 6.6;

/* Entra pela soleira em t=4 e caminha os 12 m. A onda de despertar cruza o
 * corredor em 1,85 s enquanto a pessoa leva 13 s - por isso a tomada A pega a
 * onda passando, e a tomada B pega o halo acompanhando. */
function pessoaEm(t) {
  if (t < ENTRA) return null;
  if (t < T_CHEGA) return { id: 1, x: X_INICIAL + VEL * (t - ENTRA), v: VEL };
  if (t < T_RETOMA) return { id: 1, x: X_MARCA, v: 0 };
  const x = X_MARCA + VEL * (t - T_RETOMA);
  return x > 13200 ? null : { id: 1, x, v: VEL };
}

// ==========================================================================
// RASTERIZACAO
// ==========================================================================
const quadro = Buffer.alloc(LARG * ALT * 3);
const prof = new Float32Array(LARG * ALT);

function corDeFundo(t) { return [5, 7, 9]; }

function renderizarQuadro(tempo) {
  const c = camEm(tempo);
  const { F, R, U } = baseCamera(c);
  const ganho = 1 / 255;

  for (let py = 0; py < ALT; py++) {
    const sy = -((py + 0.5) / ALT * 2 - 1) * tanV;
    for (let px = 0; px < LARG; px++) {
      const sx = ((px + 0.5) / LARG * 2 - 1) * tanH;
      const dx = F[0] + sx * R[0] + sy * U[0];
      const dy = F[1] + sx * R[1] + sy * U[1];
      const dz = F[2] + sx * R[2] + sy * U[2];
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
      const rx = dx * inv, ry = dy * inv, rz = dz * inv;

      let melhor = 1e9, cr = 5, cg = 7, cb = 9;

      // ------------------------------------------------ parede de LED (z=0)
      if (rz < -1e-6) {
        const t = -c.z / rz;
        if (t > 1 && t < melhor) {
          const wx = c.x + rx * t, wy = c.y + ry * t;
          if (wy >= 0 && wy <= CENA.peDireito && wx >= CENA.inicioCorredor && wx <= CENA.fimCorredor) {
            melhor = t;
            if (wy <= ALT_MM && wx >= 0 && wx <= LAYOUT.CORREDOR.comprimento) {
              amostrarParede(wx, wy, 1);
              cr = amostra[0]; cg = amostra[1]; cb = amostra[2];
            } else {
              // parede acima da faixa: pega o derrame de luz do painel
              amostrarBloom(wx, ALT_MM - 30);
              const queda = Math.exp(-Math.max(0, wy - ALT_MM) / 420);
              cr = 19 + bl[0] * 1.6 * queda; cg = 23 + bl[1] * 1.6 * queda; cb = 27 + bl[2] * 1.6 * queda;
            }
          }
        }
      }

      // ------------------------------------------------------- piso (y=0)
      if (ry < -1e-6) {
        const t = -c.y / ry;
        if (t > 1 && t < melhor) {
          const wx = c.x + rx * t, wz = c.z + rz * t;
          if (wz >= -50 && wz <= CENA.larguraCorredor && wx <= CENA.fimCorredor) {
            melhor = t;
            cr = 30; cg = 33; cb = 37;
            // reflexo: espelha o raio no piso e busca a parede
            if (rz < -1e-6) {
              const t2 = -wz / rz;
              const bx = wx + rx * t2, by = ry * -1 * t2;
              if (t2 > 0 && by >= 0 && by <= ALT_MM && bx >= 0 && bx <= LAYOUT.CORREDOR.comprimento) {
                amostrarParede(bx, by, 1);
                // piso polido, nao espelho: reflexo esmaece com a distancia
                const k = 0.38 * Math.exp(-t2 / 2800);
                cr += amostra[0] * k; cg += amostra[1] * k; cb += amostra[2] * k;
              }
            }
          }
        }
      }

      // ------------------------------------------------------ teto (y=2700)
      if (ry > 1e-6) {
        const t = (CENA.peDireito - c.y) / ry;
        if (t > 1 && t < melhor) {
          const wx = c.x + rx * t, wz = c.z + rz * t;
          if (wz >= -50 && wz <= CENA.larguraCorredor && wx <= CENA.fimCorredor) {
            melhor = t;
            cr = 22; cg = 24; cb = 27;
            // luminaria linear quente, como na referencia
            const d = Math.abs(wz - 640);
            if (d < 130) {
              const k = Math.pow(1 - d / 130, 1.6);
              cr += 150 * k; cg += 134 * k; cb += 107 * k;
            }
            amostrarBloom(wx, ALT_MM - 200);
            cr += bl[0] * 0.35; cg += bl[1] * 0.35; cb += bl[2] * 0.35;
          }
        }
      }

      // --------------------------------------- parede oposta (z=larguraCorredor)
      if (rz > 1e-6) {
        const t = (CENA.larguraCorredor - c.z) / rz;
        if (t > 1 && t < melhor) {
          const wx = c.x + rx * t, wy = c.y + ry * t;
          if (wy >= 0 && wy <= CENA.peDireito && wx <= CENA.fimCorredor) {
            melhor = t;
            amostrarBloom(wx, wy > ALT_MM ? ALT_MM - 30 : wy);
            cr = 41 + bl[0] * 0.88; cg = 47 + bl[1] * 0.88; cb = 53 + bl[2] * 0.88;
          }
        }
      }

      // ------------------------------------ fundo do corredor (as duas pontas)
      if (rx > 1e-6 || rx < -1e-6) {
        const limite = rx > 0 ? CENA.fimCorredor : CENA.inicioCorredor;
        const t = (limite - c.x) / rx;
        if (t > 1 && t < melhor) {
          melhor = t;
          amostrarBloom(rx > 0 ? LAYOUT.CORREDOR.comprimento - 60 : 60, ALT_MM * 0.5);
          cr = 23 + bl[0] * 0.5; cg = 28 + bl[1] * 0.5; cb = 33 + bl[2] * 0.5;
        }
      }

      // ------------------------------------------------------------- névoa
      if (melhor < 1e9) {
        const n = 1 - Math.exp(-melhor / 11000);
        cr = cr * (1 - n) + 6 * n; cg = cg * (1 - n) + 8 * n; cb = cb * (1 - n) + 11 * n;
      }

      const o = (py * LARG + px) * 3;
      quadro[o]     = cr > 255 ? 255 : (cr < 0 ? 0 : cr);
      quadro[o + 1] = cg > 255 ? 255 : (cg < 0 ? 0 : cg);
      quadro[o + 2] = cb > 255 ? 255 : (cb < 0 ? 0 : cb);
      prof[py * LARG + px] = melhor;
    }
  }
  void ganho; void corDeFundo;
  return c;
}

// ==========================================================================
// PESSOA — silhueta projetada no mesmo espaco 3D da cena
// ==========================================================================
function projetar(P, c, base) {
  const dx = P[0] - c.x, dy = P[1] - c.y, dz = P[2] - c.z;
  const { F, R, U } = base;
  const zc = dx * F[0] + dy * F[1] + dz * F[2];
  if (zc <= 60) return null;
  const xc = dx * R[0] + dy * R[1] + dz * R[2];
  const yc = dx * U[0] + dy * U[1] + dz * U[2];
  return {
    sx: (xc / zc) / tanH * (LARG / 2) + LARG / 2,
    sy: -(yc / zc) / tanV * (ALT / 2) + ALT / 2,
    z: zc
  };
}

/* u em [-0,5 ; 0,5] na largura, v em [0;1] dos pes ao topo da cabeca */
function dentroSilhueta(u, v, fase) {
  if (v < 0 || v > 1) return false;
  if (v > 0.845) {                                  // cabeca
    const du = u / 0.105, dv = (v - 0.925) / 0.078;
    return du * du + dv * dv <= 1;
  }
  if (v >= 0.45) {                                  // tronco e bracos
    const f = Math.min(1, (v - 0.45) / 0.316);
    const w = 0.112 + 0.078 * suave(f);
    if (Math.abs(u) <= w) return true;
    const bu = Math.abs(u) - (w + 0.030);
    return (bu >= 0 && bu <= 0.046 && v <= 0.80);
  }
  const balanco = Math.sin(fase) * 0.080 * (1 - v / 0.45);   // pernas
  return Math.abs(u - (0.058 + balanco)) <= 0.058 ||
         Math.abs(u + 0.058 - balanco) <= 0.058;
}

const Z_PESSOA = 700;          // mm a frente da parede

function desenharPessoa(pessoa, c, base, distanciaAndada) {
  /* De que lado da tela fica a parede? Um deslocamento de -z no mundo (rumo a
   * parede) projeta em -R[2] na horizontal da tela. No contraplano o sinal
   * inverte, e a luz tem de trocar de lado junto - senao a pessoa aparece
   * iluminada pelo lado escuro do corredor. */
  const luzNaDireita = -base.R[2] > 0;
  if (!pessoa) return;
  const pes = projetar([pessoa.x, 0, Z_PESSOA], c, base);
  const topo = projetar([pessoa.x, 1750, Z_PESSOA], c, base);
  if (!pes || !topo) return;

  const alturaPx = pes.sy - topo.sy;
  if (alturaPx < 6) return;
  const largPx = alturaPx * 0.30;                   // 520 mm de largura / 1750 de altura
  const fase = (distanciaAndada / 680) * Math.PI;

  // sombra de contato: sem ela a pessoa parece flutuando
  const sombraRx = largPx * 0.95, sombraRy = alturaPx * 0.030;
  for (let py = Math.max(0, (pes.sy - sombraRy) | 0); py < Math.min(ALT, pes.sy + sombraRy); py++) {
    for (let px = Math.max(0, (pes.sx - sombraRx) | 0); px < Math.min(LARG, pes.sx + sombraRx); px++) {
      const a = (px - pes.sx) / sombraRx, b = (py - pes.sy) / sombraRy;
      const d = a * a + b * b;
      if (d > 1) continue;
      const k = 1 - Math.sqrt(d);
      const o = (py * LARG + px) * 3;
      quadro[o] *= 1 - 0.62 * k; quadro[o + 1] *= 1 - 0.62 * k; quadro[o + 2] *= 1 - 0.62 * k;
    }
  }

  const x0 = Math.max(0, (pes.sx - largPx / 2 - 2) | 0);
  const x1 = Math.min(LARG, (pes.sx + largPx / 2 + 2) | 0);
  const y0 = Math.max(0, (topo.sy - 2) | 0);
  const y1 = Math.min(ALT, (pes.sy + 2) | 0);

  for (let py = y0; py < y1; py++) {
    const v = (pes.sy - py) / alturaPx;
    for (let px = x0; px < x1; px++) {
      const u = (px - pes.sx) / largPx;
      if (!dentroSilhueta(u, v, fase)) continue;
      const o = (py * LARG + px) * 3;
      // a parede fica a esquerda da camera, entao a borda esquerda recebe a luz
      const borda = !dentroSilhueta(u + (luzNaDireita ? 0.024 : -0.024), v, fase);
      // A parede acesa fica a esquerda, entao a pessoa e iluminada de um lado
      // so. Preenchimento chapado de preto sumiria contra o corredor escuro e
      // sobraria so o contorno, com cara de desenho vetorial.
      const lado = Math.max(0, Math.min(1, luzNaDireita ? 0.5 + u : 0.5 - u));
      const k = lado * lado;
      if (borda) { quadro[o] = 40; quadro[o + 1] = 196; quadro[o + 2] = 176; }
      else {
        // Silhueta le por ser MAIS ESCURA que o fundo, nao por ser iluminada.
        // Com preenchimento na luminancia do corredor, o miolo do corpo some e
        // sobra so o contorno - a figura vira desenho vetorial.
        quadro[o]     = 2 + 12 * k;
        quadro[o + 1] = 3 + 30 * k;
        quadro[o + 2] = 4 + 29 * k;
      }
    }
  }
}

// ==========================================================================
// LACO PRINCIPAL
// ==========================================================================
const args = process.argv.slice(2);
const iEm = args.indexOf('--em');
const iMp4 = args.indexOf('--mp4');
const umQuadroEm = iEm >= 0 ? parseFloat(args[iEm + 1]) : null;
const destinoMp4 = iMp4 >= 0 ? args[iMp4 + 1] : null;

const passoMs = 1000 / FPS;

function avancarAte(tAlvo, aoQuadro) {
  let andada = 0, anterior = null;
  const total = Math.round(tAlvo * FPS);
  for (let f = 0; f <= total; f++) {
    const t = f / FPS;
    const p = pessoaEm(t);
    if (p && anterior) andada += Math.abs(p.x - anterior.x);
    anterior = p;
    motor.setPessoas(p ? [p] : []);
    const rgb = motor.passo(passoMs);
    if (aoQuadro) aoQuadro(f, t, p, rgb, andada);
  }
}

function comporQuadro(t, p, rgb, andada) {
  pintarEmissivo(rgb);
  calcularBloom();
  const c = renderizarQuadro(t);
  desenharPessoa(p, c, baseCamera(c), andada);
}

if (umQuadroEm !== null) {
  // reproduz o estado ate o instante pedido e emite um unico quadro cru
  avancarAte(umQuadroEm, (f, t, p, rgb, andada) => {
    if (Math.abs(t - umQuadroEm) < 1e-6 || f === Math.round(umQuadroEm * FPS)) {
      comporQuadro(t, p, rgb, andada);
    }
  });
  process.stdout.write(quadro);
} else if (destinoMp4) {
  const ffmpeg = process.env.FFMPEG || 'ffmpeg';
  const proc = spawn(ffmpeg, [
    '-y', '-loglevel', 'error',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', LARG + 'x' + ALT, '-r', String(FPS), '-i', '-',
    '-vf', 'scale=' + SAIDA_LARG + ':' + SAIDA_ALT + ':flags=lanczos',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    destinoMp4
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = Math.round(DURACAO * FPS);
  let f = 0, andada = 0, anterior = null;
  const t0 = Date.now();

  function proximo() {
    while (f <= total) {
      const t = f / FPS;
      const p = pessoaEm(t);
      if (p && anterior) andada += Math.abs(p.x - anterior.x);
      anterior = p;
      motor.setPessoas(p ? [p] : []);
      const rgb = motor.passo(passoMs);
      comporQuadro(t, p, rgb, andada);
      f++;
      if (f % 30 === 0) {
        const dec = (Date.now() - t0) / 1000;
        process.stderr.write('\r  quadro ' + f + '/' + total +
          '  (' + (f / total * 100).toFixed(0) + '%)  ' +
          (f / dec).toFixed(1) + ' q/s  restam ' + ((total - f) / (f / dec)).toFixed(0) + 's   ');
      }
      if (!proc.stdin.write(quadro)) { proc.stdin.once('drain', proximo); return; }
    }
    proc.stdin.end();
    process.stderr.write('\n');
  }
  proximo();

  proc.on('close', (cod) => {
    if (cod !== 0) { console.error('ffmpeg saiu com', cod); process.exit(1); }
    const kb = fs.statSync(destinoMp4).size / 1024;
    console.log('OK ->', destinoMp4, '|', (kb / 1024).toFixed(1), 'MB |',
                DURACAO + 's @ ' + FPS + 'fps | ' + SAIDA_LARG + 'x' + SAIDA_ALT);
  });
} else {
  console.error('uso: --em <segundos>  |  --mp4 <arquivo>');
  process.exit(1);
}
