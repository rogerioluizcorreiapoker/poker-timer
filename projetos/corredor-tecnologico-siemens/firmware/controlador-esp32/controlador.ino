/* =============================================================================
 * CORREDOR TECNOLOGICO SIEMENS - CONTROLADOR DE PIXEL
 * ESP32 + Ethernet (WT32-ETH01 / Olimex ESP32-POE-ISO)
 *
 * Este firmware NAO decide nada. Recebe sACN e empurra bytes para a fita.
 * Toda a inteligencia - maquina de estados, fusao dos radares, ABL - vive no
 * engine. Manter o controlador burro e o que permite trocar o comportamento
 * inteiro sem reprogramar nada que esteja dentro da parede.
 *
 * Placa: ESP32 Dev Module | Particao: Minimal SPIFFS (app grande)
 * Bibliotecas: FastLED 3.6+
 * ========================================================================== */

#include <ETH.h>
#include <WiFiUdp.h>
#include <FastLED.h>

// --------------------------------------------------------------- identidade
// Trocar para CT-2 na segunda placa: muda IP e o bloco de saidas.
#define CONTROLADOR_1

#ifdef CONTROLADOR_1
  const char* NOME = "CT-1";
  IPAddress IP_FIXO(10, 20, 0, 11);
  const uint16_t UNIVERSO_BASE = 1;
  const uint8_t  N_SAIDAS = 7;
  const uint8_t  PINOS[N_SAIDAS]   = {  2,  4, 12, 14, 15, 16, 17 };
  const uint16_t TAMANHOS[N_SAIDAS]= {545,576,650,554,552,469,361};
#else
  const char* NOME = "CT-2";
  IPAddress IP_FIXO(10, 20, 0, 12);
  const uint16_t UNIVERSO_BASE = 24;
  const uint8_t  N_SAIDAS = 6;
  const uint8_t  PINOS[N_SAIDAS]   = {  2,  4, 12, 14, 15, 16 };
  const uint16_t TAMANHOS[N_SAIDAS]= {664,705,569,630,361,291};
#endif

IPAddress GATEWAY(10, 20, 0, 1);
IPAddress MASCARA(255, 255, 255, 0);

const uint16_t PORTA_SACN = 5568;
const uint16_t MAX_PIXELS = 705;          // maior saida do projeto
const uint32_t TIMEOUT_MS = 2500;         // sem quadro -> apaga

CRGB tiras[N_SAIDAS][MAX_PIXELS];
WiFiUDP udp;
uint8_t pacote[640];
uint32_t ultimoQuadro = 0;
uint32_t contaQuadros = 0;
bool ethPronta = false;

// ---------------------------------------------------------------------------
void aoEventoEth(WiFiEvent_t evento) {
  if (evento == ARDUINO_EVENT_ETH_GOT_IP) {
    ethPronta = true;
    Serial.printf("[%s] ethernet: %s\n", NOME, ETH.localIP().toString().c_str());
  } else if (evento == ARDUINO_EVENT_ETH_DISCONNECTED) {
    ethPronta = false;
    Serial.printf("[%s] ethernet caiu\n", NOME);
  }
}

// ---------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.printf("\n[%s] iniciando - %u saidas\n", NOME, N_SAIDAS);

  /* FastLED exige o pino como constante de compilacao, entao a lista de
   * saidas e explicita. WS2815 usa o protocolo do WS2812B; o que muda e a
   * tensao e a linha de dados de backup, que e fiacao, nao firmware. */
  FastLED.addLeds<WS2812B, 2,  GRB>(tiras[0], TAMANHOS[0]);
  FastLED.addLeds<WS2812B, 4,  GRB>(tiras[1], TAMANHOS[1]);
  FastLED.addLeds<WS2812B, 12, GRB>(tiras[2], TAMANHOS[2]);
  FastLED.addLeds<WS2812B, 14, GRB>(tiras[3], TAMANHOS[3]);
  FastLED.addLeds<WS2812B, 15, GRB>(tiras[4], TAMANHOS[4]);
  FastLED.addLeds<WS2812B, 16, GRB>(tiras[5], TAMANHOS[5]);
#ifdef CONTROLADOR_1
  FastLED.addLeds<WS2812B, 17, GRB>(tiras[6], TAMANHOS[6]);
#endif

  /* O ABL ja roda no engine, que conhece a topologia das 4 zonas.
   * Este limite e a ultima rede de protecao: se o engine travar mandando
   * branco pleno, a fonte nao vai junto. */
  FastLED.setMaxPowerInVoltsAndMilliamps(12, 30000);
  FastLED.clear(true);

  WiFi.onEvent(aoEventoEth);
  ETH.begin();
  ETH.config(IP_FIXO, GATEWAY, MASCARA);
  udp.begin(PORTA_SACN);
}

// ---------------------------------------------------------------------------
// Descobre a qual saida e a qual posicao pertence um universo recebido.
bool localizar(uint16_t universo, uint8_t &saida, uint16_t &primeiroPixel) {
  uint16_t u = UNIVERSO_BASE;
  for (uint8_t s = 0; s < N_SAIDAS; s++) {
    uint16_t qtd = (TAMANHOS[s] * 3 + 511) / 512;
    if (universo >= u && universo < u + qtd) {
      saida = s;
      primeiroPixel = (universo - u) * (512 / 3);
      return true;
    }
    u += qtd;
  }
  return false;
}

void loop() {
  int tam = udp.parsePacket();
  if (tam > 0 && tam <= (int)sizeof(pacote)) {
    udp.read(pacote, tam);

    // valida cabecalho ACN e vetor de dados antes de confiar no conteudo
    if (tam >= 126 && memcmp(pacote + 4, "ASC-E1.17", 9) == 0 && pacote[117] == 0x02) {
      uint16_t universo = (pacote[113] << 8) | pacote[114];
      uint8_t saida; uint16_t primeiro;
      if (localizar(universo, saida, primeiro)) {
        uint16_t canais = ((pacote[123] << 8) | pacote[124]) - 1;   // tira o start code
        if (canais > 512) canais = 512;
        uint16_t n = canais / 3;
        for (uint16_t i = 0; i < n; i++) {
          uint16_t alvo = primeiro + i;
          if (alvo >= TAMANHOS[saida]) break;
          tiras[saida][alvo].setRGB(pacote[126 + i*3], pacote[127 + i*3], pacote[128 + i*3]);
        }
        ultimoQuadro = millis();
      }
    }
  }

  // Escreve na fita a taxa fixa. Escrever a cada pacote recebido faria a saida
  // competir com a recepcao e o ESP32 comecaria a perder universos.
  static uint32_t proximoShow = 0;
  if (millis() >= proximoShow) {
    proximoShow = millis() + 25;                 // 40 fps

    if (millis() - ultimoQuadro > TIMEOUT_MS && ultimoQuadro != 0) {
      // engine mudo: apaga em vez de congelar o ultimo quadro na parede
      FastLED.clear();
      ultimoQuadro = 0;
      Serial.printf("[%s] sem sACN - apagando\n", NOME);
    }
    FastLED.show();

    if (++contaQuadros % 400 == 0) {
      Serial.printf("[%s] %lu quadros | eth=%s | fps saida=%d\n",
                    NOME, (unsigned long)contaQuadros, ethPronta ? "ok" : "off",
                    FastLED.getFPS());
    }
  }
}
