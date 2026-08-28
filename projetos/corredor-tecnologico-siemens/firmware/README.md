# Firmware

Dois pedaços, com uma divisão de responsabilidade deliberada:

```
engine-raspberry/     toda a inteligência
controlador-esp32/    nenhuma inteligência
```

O controlador dentro da parede é burro de propósito: recebe sACN e empurra bytes
para a fita. Todo o comportamento — máquina de estados, fusão dos radares,
limitador de brilho, agenda — vive no engine, num rack acessível.

**Por quê:** ajustar o comportamento depois da inauguração é certo, não
possibilidade. Se a lógica morasse no ESP32, cada ajuste exigiria acesso físico
a um quadro atrás de um painel parafusado. Com a lógica no engine, o ajuste é
`ssh`, editar parâmetro, reiniciar serviço.

## engine-raspberry

```bash
npm install serialport
node index.js                 # operação normal
node index.js --simular       # sem radar, pessoa fantasma indo e voltando
node index.js --varredura     # 1 pixel por vez — caça emenda fria na bancada
```

`--varredura` é a ferramenta da semana 5: acende um pixel de cada vez em
sequência e imprime o índice, a saída e a posição em mm. Emenda fria aparece
como um salto na contagem.

| Arquivo | Função |
|---|---|
| `index.js` | Laço de 40 fps, mapa de universos, agenda de brilho, telemetria |
| `radar-ld2450.js` | Protocolo do radar e fusão dos dois sensores |
| `sacn.js` | Emissor E1.31 mínimo, unicast |
| `config.json` | IPs, portas seriais, agenda — o que muda em obra |

O engine importa `sistema/engine.js` e `sistema/layout.js` diretamente. **É o
mesmo código que roda no simulador**, sem porte e sem reescrita.

### Serviço

```ini
# /etc/systemd/system/corredor.service
[Unit]
Description=Corredor Tecnologico Siemens
After=network-online.target

[Service]
ExecStart=/usr/bin/node /opt/corredor/firmware/engine-raspberry/index.js
WorkingDirectory=/opt/corredor/firmware/engine-raspberry
Restart=always
RestartSec=3
User=corredor

[Install]
WantedBy=multi-user.target
```

`Restart=always` cobre o requisito de checklist: volta sozinho depois de queda
de energia, sem intervenção.

## controlador-esp32

Uma sketch para as duas placas; trocar `#define CONTROLADOR_1` na segunda.

| | CT-1 | CT-2 |
|---|---|---|
| IP | 10.20.0.11 | 10.20.0.12 |
| Saídas | 7 | 6 |
| Universo base | 1 | 24 |

Detalhes que importam:

- **Conversor de nível 74AHCT125 em toda saída.** O ESP32 entrega 3,3 V; o
  WS2815 fica no limite do que aceita como nível alto. Funciona na bancada,
  falha na parede.
- **Escrita a taxa fixa (40 fps), não a cada pacote.** Chamar `FastLED.show()`
  a cada universo recebido faz a saída competir com a recepção e o ESP32 começa
  a perder universos.
- **Timeout de 2,5 s apaga a fita.** Se o engine ficar mudo, a parede apaga em
  vez de congelar o último quadro — congelado é pior: parece que funciona.
- **`setMaxPowerInVoltsAndMilliamps(12, 30000)`** é a última rede de proteção,
  não o limitador principal. O ABL de verdade roda no engine, que conhece a
  topologia das quatro zonas.
