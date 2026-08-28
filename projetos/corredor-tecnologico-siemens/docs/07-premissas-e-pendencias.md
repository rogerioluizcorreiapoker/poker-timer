# 07 — Premissas e pendências

Este projeto foi desenvolvido a partir da imagem de referência e do briefing
verbal. Onde faltou informação, assumimos um valor **e seguimos** — as premissas
estão listadas abaixo para conferência. Nenhuma delas impede o avanço do
projeto, mas várias mexem em custo ou prazo se estiverem erradas.

## Premissas adotadas

| # | Premissa | Impacto se estiver errada |
|---|---|---|
| 1 | Corredor de **12,00 m exatos**, uma parede tratada | Muda o número de painéis e o comprimento de fita |
| 2 | Pé-direito de 2,70 m; faixa gráfica de +0,20 a +2,05 | A altura da faixa é ajustável sem mexer no conceito |
| 3 | Parede em alvenaria, aprumada, sem instalações embutidas no caminho | Estrutura pode precisar de calço ou reforço |
| 4 | Ponto de energia 220 V disponível a menos de 10 m do quadro | Custo de infraestrutura elétrica adicional |
| 5 | Instalação em horário comercial, sem necessidade de trabalho noturno | Custo de mão de obra em regime especial |
| 6 | Altura de trabalho atendida por escada/andaime leve | Plataforma elevatória é custo não previsto |
| 7 | Sem exigência de nível de ruído (as fontes são fanless de qualquer forma) | — |
| 8 | Sem integração com sistema predial (BMS, automação, alarme) | Escopo adicional de integração |
| 9 | Paleta ciano/petrol conforme referência | Cor final sai do brand book |

## Pendências — precisam de resposta do cliente

### Bloqueiam a compra de material

**1. Reação ao fogo do acabamento.**
MDF em circulação de edificação corporativa costuma exigir classificação de
reação ao fogo compatível com a instrução técnica do Corpo de Bombeiros do
estado. Saídas: tinta intumescente, verniz retardante certificado, ou trocar o
substrato por ACM/placa mineral. **Muda substrato, tinta, custo e prazo.**
→ *Precisa da área de segurança/facilities do cliente.*

**2. Arte oficial da marca.**
O letreiro deve ser aplicado a partir do brand book — não redesenhado. Precisamos
do arquivo vetorial oficial, da paleta homologada e da regra de zona de proteção.
Nosso layout já reserva 300 mm em volta; se a norma do cliente pedir mais, o
desenho da zona C se ajusta.
→ *Precisa do time de marca/comunicação do cliente.*

### Bloqueiam o comissionamento

**3. Aprovação de privacidade do sensoriamento.**
O radar mmWave **não é câmera e não capta imagem** — devolve apenas coordenadas.
Ainda assim, ambiente corporativo costuma exigir registro formal do sensoriamento.
→ *Precisa de ciência da área de compliance/TI.*

**4. Rede e alimentação do engine.**
O engine e os controladores usam uma rede cabeada **isolada**, sem necessidade
de acesso à rede corporativa. Confirmar se o cliente prefere assim (recomendado)
ou quer o sistema em VLAN própria, e se haverá acesso remoto para suporte.
→ *Precisa da TI do cliente.*

### Decisões de projeto em aberto

**5. Comportamento em repouso: estático ou respirando.**
O briefing pediu "estático quando não tem ninguém". Implementamos um repouso que
respira devagar (7,5% de brilho, oscilação lenta, um pacote a cada ~3 s) porque
parede totalmente parada faz a chegada de alguém virar susto em vez de resposta.
**As duas versões estão no código** — basta zerar `respiracaoRepouso`. Vale
decidir vendo a simulação.

**6. Som.**
Não previsto. Um desenho sonoro discreto acompanhando o despertar reforçaria
bastante a instalação, mas exige avaliação acústica do corredor e aprovação —
corredor com som é decisão de facilities, não de projeto luminotécnico.
→ *Proposta separada, se houver interesse.*

**7. Horário de funcionamento.**
A agenda proposta (comercial 100%, ronda 45%, madrugada 12%) é sugestão.
Depende do uso real do corredor e de haver visitação fora do horário.

**8. Segunda parede.**
A referência mostra uma parede. Se o corredor tiver a parede oposta livre, um
espelhamento simplificado (só o rodapé e um barramento) dobraria a sensação de
imersão a um custo bem menor que o dobro. → *Vale colocar na mesa.*

## Riscos técnicos e como estão tratados

| Risco | Tratamento |
|---|---|
| LED queimado apaga a trilha inteira | WS2815 tem linha de dados de backup |
| Emenda fria em uma das 111 juntas | Teste painel a painel na bancada; painel removível por cleat |
| Dessincronização entre os dois controladores | Rede cabeada + sACN, sem Wi-Fi |
| Piscada aleatória por referência de terra | Barramento de 0 V único, verificado no checklist |
| Fonte sobrecarregada | Duas travas: fonte de 450 W + ABL limitando a 360 W por zona |
| Diferença de tom entre lotes de fita | Comprar os 132 m em lote único |
| Radar com alvo fantasma | Calibração no local; barreira IR como redundância |
| Zona cega de ~45 cm na soleira | Barreira IR dá o gatilho instantâneo; radar assume a partir de 0,5 m |
| Nível lógico de dados marginal | Conversor 74AHCT125 em todas as 13 saídas |
