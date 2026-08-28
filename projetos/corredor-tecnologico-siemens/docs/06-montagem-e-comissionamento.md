# 06 — Montagem e comissionamento

## Princípio: a parede é montada duas vezes

Cada painel é montado, ligado e **testado na bancada** antes de subir na parede.
Nenhum painel vai para o corredor sem ter acendido inteiro na oficina.

Achar uma emenda fria com o painel na bancada custa cinco minutos. Achar a mesma
emenda com o painel instalado a 2 m de altura, com acabamento pronto, custa um
dia e um retoque de pintura. São 111 emendas: a estatística não perdoa.

## Sequência

### 1. Levantamento (antes de comprar qualquer coisa)
- Medir os 12 m reais e o pé-direito. **O projeto assume 12,00 m exatos**;
  divergência muda o número de painéis.
- Verificar prumo e planeza da parede — parede fora de prumo exige calço no
  montante, e isso aparece na junta entre painéis.
- Confirmar substrato (alvenaria / drywall / estrutura metálica) e onde chega o
  ponto de energia.
- Confirmar a exigência de reação ao fogo do acabamento.

### 2. Produção (marcenaria e impressão em paralelo)
- Usinar canaletas e furar os 111 vértices.
- Imprimir as 17 peças — é o caminho mais longo (130–160 h de máquina), começa
  no dia 1.
- Pintar painéis e peças. **Pintura antes da fita, sempre.**

### 3. Bancada
- Colar fita, soldar jumpers, identificar cada trilha.
- Energizar painel por painel: varredura de pixel único de ponta a ponta
  (`ferramentas` → modo de teste do engine) para achar emenda fria e pixel
  invertido.
- Registrar a contagem real de pixels de cada saída. Se divergir do modelo,
  corrigir o modelo — não o contrário.

### 4. Instalação
- Montantes, plenum e cleat francês.
- Painéis de baixo para cima, começando por P1.
- Quadros QE-1 e QE-2, fontes, aterramento comum.
- Rodapé de alumínio corrido, por último (é a peça que dá o alinhamento visual
  dos 12 m — instalar antes significa refazer).

### 5. Comissionamento
- Endereçamento e mapeamento: confirmar que a saída 0 é a saída 0.
- Calibrar os dois radares no corredor **com pessoas andando de verdade**.
- Ajustar `nivelRepouso`, `raioPessoa` e `avancoPessoa` no local, com a
  iluminação ambiente do corredor ligada.
- Medir corrente por zona com alicate e conferir contra a estimativa do ABL.
- Configurar a agenda de brilho.
- Gravar preset de "modo evento" e ensinar o acionamento.

## Cronograma

| Semana | Frente |
|---|---|
| 1 | Levantamento, aprovação da simulação, cotação e compra |
| 2 | Chegada de material · início da impressão 3D · usinagem CNC |
| 3 | Usinagem, furação, pintura dos painéis |
| 4 | Acabamento das peças impressas · início da bancada |
| 5 | Bancada: fita, 111 emendas, teste painel a painel |
| 6 | Instalação: estrutura, painéis, quadros |
| 7 | Elétrica, rede, comissionamento, calibração dos radares |
| 8 | Ajuste fino, agenda, entrega e treinamento |

Caminho crítico: **impressão 3D** (semanas 2–4) e **bancada** (semana 5).
Atraso na compra da fita empurra tudo.

## Checklist de entrega

- [ ] Os 6.927 pixels acendem — varredura completa sem falha
- [ ] Nenhuma emenda visível na face dos painéis
- [ ] Corrente medida por zona abaixo de 30 A
- [ ] Terra comum verificado entre as 4 fontes, os 2 controladores e o engine
- [ ] Os dois radares detectam da entrada até o meio do corredor
- [ ] Fusão sem troca de id no cruzamento das coberturas (5–7 m)
- [ ] Transição adormecer → repouso sem piscada perceptível
- [ ] Agenda de brilho configurada e testada nas três faixas
- [ ] Modo evento gravado e demonstrado
- [ ] Reinício automático após queda de energia, sem intervenção
- [ ] Manual de operação entregue e equipe treinada
- [ ] Reserva entregue: fita, 1 controlador, 1 radar, 1 fonte

## Manutenção

| Quando | O quê |
|---|---|
| Trimestral | Limpeza dos difusores (pano seco; solvente ataca acrílico) |
| Semestral | Conferir aperto dos bornes; medir corrente por zona |
| Anual | Limpar ventilação dos quadros; revisar calibração dos radares |

Falha mais provável em campo: **emenda fria de jumper**, por fadiga térmica.
O backup de dados do WS2815 protege contra LED queimado, mas não contra emenda
solta. Por isso todo painel é removível pelo cleat.
