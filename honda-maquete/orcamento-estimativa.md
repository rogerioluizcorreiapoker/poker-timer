# Maquete Honda Energy — estimativa de preço (uso interno)

> Não vai para o cliente. Estimativa antes das plantas e dos dados da Honda:
> itens marcados como **estimado** precisam de cotação real antes de fechar.

## Escopo considerado

- Base 2,00 × 1,00 m em MDF com moldura laqueada preta, LED na borda e placa com a frase
- 10 aerogeradores comprados prontos (9 de 9 cm + 1 de 11 cm), rotores girando e luz de sinalização
- 2 subestações (elevadora e distribuidora), torre de transmissão e linha da rede em impressão 3D
- 3 unidades Honda (Itirapina, HSA, Sumaré) com fachadas, telhados solares, estacionamentos, carros e caminhões
- Paisagismo: gramado, estrada de serviço, ~2.000 árvores, sebes, postes
- Fluxo de energia em LED endereçável nas 3 cores (azul 34,5 kV → laranja 69 kV → verde 13,8 kV), janelas acendendo
- Controlador (ESP32) com modo apresentação por botão
- Cúpula de acrílico (opcional, ver abaixo)

## Custo direto estimado

| Item | Faixa (R$) |
|---|---:|
| Base MDF, moldura, pés, placa e LED de borda | 1.500 – 2.500 |
| 10 aerogeradores prontos, motorizados (**estimado**, cotar) | 1.500 – 4.000 |
| Impressão 3D: subestações, torres, prédios, carros, caminhões | 1.200 – 2.500 |
| Paisagismo (árvores, gramado estático, flocagem, sebes) | 1.500 – 3.000 |
| Eletrônica: fitas endereçáveis, ESP32, fontes, botoeira, fiação | 2.000 – 4.000 |
| Pintura, adesivos, placas, acabamento | 800 – 1.500 |
| **Material sem cúpula** | **8.500 – 17.500** |
| Cúpula acrílico cristal 4 mm, 200 × 100 × 25 cm (**estimado**, cotar) | 3.500 – 5.500 |
| Mão de obra: ~240 a 360 h × R$ 75/h (projeto, impressão, montagem, paisagismo, programação, testes) | 18.000 – 27.000 |
| **Custo direto total (com cúpula)** | **30.000 – 50.000** |

## Preço sugerido

Mesma regra do projeto Siemens: **15% sobre material** (o cliente consegue conferir) e **45% sobre execução** (onde está o trabalho), mais o Simples (~5,6% na 2ª faixa, Anexo II).

Ponto médio: material + cúpula ≈ R$ 17.500 → R$ 20.100 · execução ≈ R$ 22.500 → R$ 32.600 → **R$ 52.700 + imposto ≈ R$ 55.800**.

| Versão | O que muda | Preço sugerido |
|---|---|---:|
| Essencial | Sem cúpula, prédios mais simples, fluxo com LED fixo piscando (sem endereçável) | **R$ 38.000** |
| **Completa (recomendada)** | Tudo do escopo acima, com cúpula | **R$ 58.000** |
| Premium | + tablet/totem com a maquete digital sincronizada, narração, case de transporte | **R$ 72.000** |

Regras para a conversa (de `08-estrategia-comercial.md`): mandar **um número**, não faixa; se ceder, ceder contra prazo ou pagamento; preferir cortar escopo a cortar preço.

## Referências de mercado

- Maquete física de alto padrão: R$ 50 mil a R$ 4 milhões; em acrílico, R$ 80 a 150 mil ([Sienge](https://sienge.com.br/blog/maquete/), [Skyline](https://www.skylineip.com.br/blog/preco-de-maquete-3d))
- Maquete digital interativa: a partir de R$ 15 mil ([R2U](https://r2u.io/quanto-custa-maquete-interativa/))
- Empresas de maquete industrial para cotação comparativa: [Mega Maquetes](https://megamaquetes.com.br/maquetes/maquetes-industriais/), [Usina Maquetes](https://usinamaquetes.com.br/), [Bustamante](https://www.bustamantemaquetes.com.br/maquetes/industrias.html), [Lançar](https://lancarmaquetes.com.br/maquete-de-industria/)
- Cúpula/acrílico sob medida: [Officina do Acrílico](https://www.officinadoacrilico.com.br/cupula-de-acrilico-sob-medida), [Acrildestac](https://www.acrildestac.com.br/cupulas-de-acrilico); chapa 2 × 1 m 4 mm: [Leroy Merlin](https://www.leroymerlin.com.br/chapa-de-acrilico-cristal-1m-x-2m-4mm_1567787516), [Plastolândia](https://www.plastolandia.com.br/chapa-acrilico-cristal-2000-x-1000-x-4-mm)
- Histórico próprio (Energy, 2026): maquete de geração de energia R$ 8.000; maquete cidade R$ 8.500; miniatura de subestação R$ 600/un. — escopos bem menores que este.
