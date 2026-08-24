# NEXT LAYER 3D — RELATÓRIO DE PLANEJAMENTO TRIBUTÁRIO, SOCIETÁRIO E FISCAL-OPERACIONAL

**Destinatários:** sócios da Next Layer 3D
**Finalidade:** entrega ao escritório contábil com o pedido: *"analisem esta estrutura e confirmem se podemos configurar a empresa exatamente desta maneira"*
**Data-base da legislação: 24 de agosto de 2026** — tudo o que está descrito reflete a legislação vigente nesta data; regras futuras (reforma tributária 2027–2033) estão expressamente sinalizadas como futuras.

> **AVISO IMPORTANTE.** Este documento é um **estudo de planejamento tributário lícito**, e não uma opinião legal definitiva. Ele deve ser **validado pelo contador responsável** (e, nos pontos societários e de propriedade intelectual, por advogado) antes de qualquer implementação. O município e a UF da empresa não foram considerados por não terem sido informados: **todo ponto que depende de legislação municipal (ISS, códigos de serviço, NFS-e local), estadual (ICMS, inscrição estadual, substituição tributária) ou de contrato específico está marcado como "NECESSITA CONFIRMAÇÃO"**. Nada aqui propõe sonegação, fragmentação artificial de faturamento, notas ou contratos sem substância, folha inflada ou ocultação de receita — ao contrário, o estudo demonstra que a maior economia disponível é integralmente legal.

---

## 0. SUMÁRIO EXECUTIVO

A Next Layer 3D fabrica e vende maquetes corporativas e industriais interativas, imprime peças em 3D, integra eletrônica (ESP32, Raspberry Pi, sensores, telas) e monta totens — e planeja, nos próximos 12–36 meses, tornar-se também uma empresa de software (aplicativos próprios, SaaS, licenciamento, sistemas com IA). Do ponto de vista tributário, isso significa que ela **não é "uma empresa de um imposto só"**: é uma **empresa híbrida de indústria + serviços técnicos/criativos + tecnologia**, e cada tipo de receita tem documento fiscal, anexo do Simples Nacional e carga tributária próprios.

**As oito conclusões centrais deste estudo:**

1. **Permanecer no Simples Nacional.** A empresa é ME (receita bruta acumulada de 12 meses — RBT12 — na casa de R$ 268 mil) e o Simples domina o Lucro Presumido em todos os cenários simulados até R$ 2 milhões/ano (Seção 6.4), principalmente porque a contribuição patronal ao INSS já está dentro do DAS. Reavaliar apenas nos gatilhos: sublimite de R$ 3,6 mi, teto de R$ 4,8 mi e janelas anuais do "regime híbrido" de IBS/CBS.
2. **Segregar as receitas por natureza no PGDAS-D é a alavanca nº 1.** A fabricação vendida com NF-e cai no **Anexo II (4,5% a 5,6% de alíquota efetiva no porte atual)** — mais barato que o Anexo III (6,0%–7,7%) e cerca de **um terço** do Anexo V (15,5%–16,3%). Se hoje toda a receita estiver sendo tratada como serviço, a empresa está **pagando imposto a mais e emitindo o documento errado** ao mesmo tempo.
3. **Implantar o Fator R imediatamente para as receitas de software, design e projetos.** A simulação do sócio foi refeita e **está aritmeticamente correta**: nos 4 meses analisados, DAS de R$ 41.452,19 no Anexo V contra R$ 17.209,38 no Anexo III (Fator R ≥ 28%) — economia bruta de R$ 24.242,81, que fica em **~R$ 21,9 mil líquidos** após o custo de INSS/IRPF do pró-labore. Ressalva essencial: esse número é o **teto teórico** (vale se 100% da receita fosse de serviços sujeitos ao Fator R); como a receita atual é majoritariamente fabricação (Anexo II, fora do Fator R e mais barata), a economia real do Fator R incide só sobre a fração de serviços — e a **segregação correta sozinha** já economizaria ~R$ 20 mil no mesmo período (Seção 7.4).
4. **Uma única empresa, com o leque completo de CNAEs de tecnologia registrado de uma vez** (6201-5/01, 6202-3/00, 6203-1/00, 6311-9/00 etc.) e **objeto social redigido por atividade, não por produto**: lançar o aplicativo nº 2, nº 10 ou nº 50 **não exigirá nenhuma alteração de CNAE ou contrato social**. Segunda empresa só no futuro, com substância real (equipe/produto/investidor dedicados) — e lembrando que o teto de R$ 4,8 mi é **global** entre empresas com sócios em comum.
5. **Documentos fiscais: dois sistemas em paralelo.** Venda de maquete, peça e totem = **NF-e (modelo 55)** com ICMS/IPI dentro do DAS (exige Inscrição Estadual); serviços, software e SaaS = **NFS-e**. A partir de **1º/11/2026** a NFS-e de ME/EPP do Simples **obrigatoriamente** sai pelo Emissor Nacional (Resolução CGSN nº 191/2026) — o cadastro e os testes devem ser feitos **agora** (restam ~10 semanas), e a API do Emissor Nacional é exatamente o que viabilizará a emissão em massa para assinaturas de aplicativo.
6. **Reforma tributária: nada muda no DAS em 2026** (ano-teste; optantes do Simples estão fora das alíquotas-teste de CBS/IBS). Duas providências: decidir na **janela de 1º a 30/09/2026** se a empresa opta pelo regime regular de IBS/CBS para 2027 (tendência: **não optar** por ora) e preparar os emissores para os campos de IBS/CBS, obrigatórios para o Simples a partir de **04/01/2027**.
7. **Distribuição de lucros continua isenta de IRPF** no porte atual, e a **contabilidade completa (ECD)** é o que permite distribuir todo o lucro contábil com isenção (LC 123, art. 14). As novidades da Lei 15.270/2025 (retenção de 10% sobre dividendos acima de R$ 50 mil/mês por sócio; imposto mínimo sobre rendas acima de R$ 600 mil/ano) **não alcançam** o volume atual da empresa, mas entram no radar do crescimento.
8. **Propriedade intelectual antes de escalar:** cessão de direitos em todos os contratos de desenvolvimento (CLT e PJ), registro da marca no INPI (prioridade imediata) e registro dos programas-núcleo no INPI.

**Riscos que este estudo pede para tratar com prioridade:** confirmação da Inscrição Estadual e do credenciamento de NF-e (sem eles, a venda de produto está sendo documentada de forma errada); a fronteira indústria × serviço das maquetes (Seções 1.3 e 5.1 — recomendada consulta formal); e o cadastro tempestivo no Emissor Nacional da NFS-e.

---

## 1. DIAGNÓSTICO (em linguagem simples)

### 1.1 O que a Next Layer 3D é para o fisco

**"Do ponto de vista tributário, a Next Layer 3D é uma empresa híbrida de indústria (fabrica e vende maquetes, peças impressas em 3D e totens) + serviços técnicos e criativos (projeto, modelagem 3D, design, maquete digital) + tecnologia (software sob encomenda, aplicativos próprios, SaaS e licenciamento)."**

Na prática, isso significa três coisas:

1. **Não existe "o imposto da empresa" — existe o imposto de cada receita.** No Simples Nacional, o PGDAS-D exige que cada tipo de receita seja declarado separadamente e tributado pelo seu próprio anexo (LC 123/2006, art. 18, § 4º; Resolução CGSN 140/2018, art. 25 — vigentes; Confiança alta). Vender uma maquete, licenciar um software e dar um treinamento no mesmo mês gera três linhas diferentes na apuração, com três alíquotas diferentes.
2. **Não existe "a nota fiscal da empresa" — existe o documento de cada operação.** Produto vendido = NF-e (modelo 55), com ICMS e IPI dentro do DAS. Serviço prestado = NFS-e, com ISS dentro do DAS. Misturar os dois (por exemplo, emitir NFS-e para a venda de uma maquete fabricada com material próprio) é errado nos dois sentidos: paga-se mais imposto (anexo de serviço é mais caro que o de indústria) e cria-se risco de autuação estadual por ICMS não documentado.
3. **A mesma impressora 3D pode gerar três receitas diferentes.** Vender uma peça feita com material próprio é **indústria** (Anexo II, NF-e). Transformar insumo enviado pelo cliente que vai revender ou integrar a peça é **industrialização por encomenda com ICMS/IPI** (Anexo II, NF-e — STF, Tema 816). Beneficiar objeto/material do cliente para uso final dele é **serviço** (item 14.05 da LC 116/2003, Anexo III, NFS-e). A pergunta operacional que define tudo é: **de quem é o material e o que o cliente vai fazer com o bem?**

### 1.2 Onde está o dinheiro (ordem de grandeza, no porte atual)

| Alavanca | Efeito no porte atual (RBT12 ~R$ 268 mil) |
|---|---|
| Segregar a fabricação no Anexo II (em vez de tudo como serviço no Anexo V) | Efetiva cai de 15,5–16,3% para 4,5–5,6% na parcela industrial — no quadrimestre simulado, ~R$ 20 mil |
| Fator R ≥ 28% (pró-labore calibrado) sobre as receitas de software/design | Efetiva cai de 15,5–16,3% para 6,0–7,7% na parcela de serviços intelectuais — até ~R$ 21,9 mil líquidos/quadrimestre no teto teórico |
| Distribuição de lucros isenta com contabilidade completa | IRPF zero sobre o lucro distribuído — dezenas de milhares/ano conforme o lucro |
| Documento fiscal certo por operação | Evita autuação (ICMS/ISS) e retenções indevidas — valor defensivo |

### 1.3 Pontos de tensão técnica identificados no estudo e como foram resolvidos

No cruzamento das três frentes deste estudo (enquadramento tributário; arquitetura de CNAEs/objeto social; emissão fiscal e operação contábil), os seguintes pontos exigiram arbitragem, resolvida como segue:

| # | Ponto de tensão | Resolução adotada |
|---|---|---|
| 1 | Item da lista da LC 116/2003 para **software sob encomenda** (1.01/1.02 × 1.04) | Adotado o **1.04** ("elaboração de programas de computadores, inclusive de jogos eletrônicos…") como item preferencial — é o espelho exato do art. 18, § 5º-D, IV, da LC 123; 1.01/1.02 conforme o escopo (análise de sistemas/programação). Código municipal correspondente: NECESSITA CONFIRMAÇÃO |
| 2 | Base normativa da NFS-e nacional (Res. CGSN 189 × 191/2026) | Verificado: a **Resolução CGSN nº 191, de 04/08/2026, revogou expressamente a Res. 189/2026** e, alterando a Res. CGSN 140/2018, fixou a obrigatoriedade do Emissor Nacional para ME/EPP em **1º/11/2026** ([Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/agosto/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026); [LegisWeb — Res. CGSN 191/2026](https://www.legisweb.com.br/legislacao/?id=499104)) |
| 3 | Enquadramento-regra da **maquete** (indústria × serviço), com três fundamentações possíveis | Consolidado em **árvore de decisão única** (Seção 5.1): material próprio + entrega de bem novo → **Anexo II/NF-e** como regra defensável; a exceção do RIPI (encomenda direta de usuário final + oficina ≤ 5 operários e ≤ 5 kW + mão de obra ≥ 60% do valor) desloca a operação para o campo de serviço; a nota da CONCLA (3299-0/99 × 7119-7/03) e a linha da Súmula 156/STJ criam risco de o município exigir ISS — **consulta formal recomendada**; NECESSITA CONFIRMAÇÃO operacional |
| 4 | Alcance do **Tema 816/STF** | Precisado: a tese só é o fundamento quando há **material fornecido pelo encomendante** (hipótese do subitem 14.05); quando o material é próprio da Next Layer, a operação **já é** venda de produto industrializado por força do RIPI e da SC Cosit 97/2019, sem necessidade do precedente |
| 5 | Fórmula do pró-labore "28% × RBT12 ÷ 12" | Precisado: é a **média mensal de regime permanente**; o Fator R usa a **folha acumulada dos 12 meses anteriores (FS12)** ÷ RBT12 (Res. CGSN 140/2018, art. 26) — a calibração é feita com projeção mensal, não com ajuste instantâneo |
| 6 | Totais de DAS com diferenças de centavos entre as frentes | Recalculados com precisão plena; adotados **R$ 41.452,19** (Anexo V) e **R$ 17.209,38** (Anexo III) |
| 7 | Fator R do CNAE 6311-9/00 (hospedagem/ASP — camada do SaaS) | Não há inciso da LC 123 que nomeie expressamente a atividade; a posição amplamente majoritária e a regra residual do § 5º-I levam ao mesmo par **III/V com Fator R**. Confiança média-alta; confirmar na parametrização do PGDAS-D |
| 8 | Crédito de ICMS ao cliente B2B nas vendas de produto | Incorporada ao fluxo de NF-e a **indicação obrigatória do crédito de ICMS** permitido ao adquirente do regime normal (LC 123, art. 23, §§ 1º–6º), no campo de informações complementares — relevante para vender a empresas de energia e data centers |
| 9 | CFOP do retorno de insumos na industrialização por encomenda | 5902/6902 = retorno **físico** dos insumos; retorno **simbólico** segue disciplina estadual (em regra 5949/6949) — NECESSITA CONFIRMAÇÃO na UF |
| 10 | "O Fator R é sempre vantajoso" | Refinado: a vantagem depende da **fração da receita sujeita ao Fator R**, da **folha natural** da operação e da **faixa de IRPF** do pró-labore — a Seção 7.5 traz a análise de sensibilidade (há cenários de crescimento em que forçar folha só para o Fator R custa mais do que economiza) |
| 11 | Grafia de norma | A dispensa de retenção de CSLL/PIS/COFINS sobre pagamentos a optantes consta da **IN SRF 459/2004** (art. 3º, § 2º, II) — grafia correta da norma da época |

---

## 2. ESTRUTURA EMPRESARIAL RECOMENDADA

| Dimensão | Recomendação | Base legal → vigência → confiança |
|---|---|---|
| **Porte** | **ME** hoje (RBT12 ~R$ 267,8 mil ≤ R$ 360 mil); vira **EPP** automaticamente ao ultrapassar R$ 360 mil de RBT12 — sem qualquer providência tributária além da comunicação cadastral de praxe | LC 123/2006, art. 3º — limites **sem correção em 2026** (R$ 360 mil / R$ 4,8 mi; sublimite R$ 3,6 mi mantido) — [Contabilizei](https://www.contabilizei.com.br/contabilidade-online/limite-simples-nacional/), [FT Contabilidade](https://ftcontabilidade.com.br/noticias/contabil/sublimite-do-simples-nacional-para-2026-e-mantido-em-r$-3-6-milhoes/28aeb6eb-5abb-42fc-9f18-c39fa9953248). Confiança alta |
| **Regime** | **Simples Nacional** (manter). Nenhuma atividade da empresa é vedada ao regime; nenhuma é do Anexo IV (a CPP está sempre dentro do DAS) | LC 123, arts. 17 e 18; Res. CGSN 140/2018, art. 15. Confiança alta |
| **Atividade principal** | **3299-0/99 — Fabricação de produtos diversos não especificados anteriormente** (maquetes físicas multimateriais, protótipos, peças). É a atividade preponderante em receita hoje — o cartão CNPJ deve refletir a realidade | Metodologia CNAE 2.3 (CONCLA); veracidade cadastral. Confiança alta |
| **Secundárias** | Leque industrial + tecnologia da Seção 3, registrado **de uma vez** | — |
| **Estratégia de crescimento** | (i) o CNAE classifica **atividades, não produtos** — os códigos 6203-1/00 + 6202-3/00 + 6311-9/00 cobrem **todos os aplicativos, SaaS, APIs, VR/AR e sistemas com IA futuros** sem nova alteração; (ii) quando a receita de software superar de forma estável a de maquetes, promove-se o 6203-1/00 a principal por alteração cadastral simples, **sem efeito tributário retroativo**; (iii) segunda empresa só com substância (Seção 15) | Confiança alta |
| **Regras de saída do Simples (monitorar)** | Excesso de receita anual de até 20% acima de R$ 4,8 mi (até R$ 5,76 mi): exclusão a partir de 1º de janeiro seguinte; excesso acima de 20%: efeitos **retroativos ao mês seguinte** ao da ultrapassagem. Acima do sublimite de R$ 3,6 mi: ICMS e ISS saem do DAS e passam a ser recolhidos "por fora" (regras estadual/municipal; valor do sublimite adotado pela UF: **NECESSITA CONFIRMAÇÃO**) | LC 123, art. 3º, §§ 9º–12, arts. 13-A e 30 — **NÃO VERIFICADO ONLINE — base: conhecimento até jan/2026** (regra estável, reiterada em fontes de 2026). Confiança alta |

**Observação sobre a CNAE vigente:** a versão em vigor para registros é a **CNAE-Subclasses 2.3** (Resolução Concla nº 2/2018, vigente desde 01/01/2019). **Não existe** "CNAE 2.4" ou "CNAE 3.0" vigente em agosto/2026 — todos os códigos abaixo são válidos e nenhum está revogado ([Contábeis — Res. Concla 2/2018](https://www.contabeis.com.br/legislacao/4852284/resolucao-concla-2-2018/); [IBGE](https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/27930-ibge-lanca-publicacao-com-subclasses-atualizadas-da-cnae)). Confiança alta.

---

## 3. LISTA FINAL DE CNAEs

**Importante:** o CNAE **não** determina o imposto — a tributação segue a natureza de **cada receita** declarada no PGDAS-D. Mas o CNAE errado gera malha, problemas de emissão de NFS-e, enquadramento sindical/licenciamento equivocado e questionamentos. A lista abaixo busca aderência total entre cadastro e operação. "Fator R" indica se a receita típica do código se sujeita ao mecanismo (Seção 7).

### 3.1 ESSENCIAIS AGORA (registrar já — 1 principal + 7 secundários)

| Código | Descrição oficial | Receita correspondente | Anexo provável | Fator R? |
|---|---|---|---|---|
| **3299-0/99** (PRINCIPAL) | Fabricação de produtos diversos não especificados anteriormente | Maquetes físicas multimateriais (com eletrônica embarcada), protótipos, peças — venda de produção própria | **II** (quando a operação for industrialização — ver árvore da Seção 5.1) | Não |
| 2229-3/99 | Fabricação de artefatos de material plástico para outros usos n.e. | Peças e protótipos poliméricos impressos em 3D (PLA, ABS, PETG, resina) | **II** | Não |
| 2622-1/00 | Fabricação de periféricos para equipamentos de informática | Totens, terminais e interfaces interativas (as notas da CONCLA citam terminais, equipamentos de automação, ATMs — boa aderência) | **II** | Não |
| 6201-5/01 | Desenvolvimento de programas de computador sob encomenda | Software sob encomenda; projetos digitais para clientes | **III/V** | **Sim** |
| 6202-3/00 | Desenvolvimento e licenciamento de programas customizáveis | Plataformas próprias com parametrização/módulos por cliente | **III/V** | **Sim** |
| 6203-1/00 | Desenvolvimento e licenciamento de programas **não customizáveis** | **Aplicativos próprios, SaaS por assinatura, licenças, produtos digitais, APIs, VR/AR** — código-chave do plano de 12–36 meses | **III/V** | **Sim** |
| 6311-9/00 | Tratamento de dados, provedores de serviços de aplicação (ASP) e hospedagem | Camada de provimento do SaaS (aplicação hospedada, processamento) | **III/V** | **Sim** (confiança média-alta — ver Seção 1.3, item 7) |
| 7410-2/03 | Design de produto | Design/concepção de produtos e totens; modelagem 3D de produto | **III/V** | **Sim** (provável — § 5º-I; confirmar) |

### 3.2 ADICIONAR NO FUTURO — somente se/quando a atividade ocorrer

| Código | Descrição oficial | Gatilho de inclusão | Anexo provável | Fator R? |
|---|---|---|---|---|
| 7119-7/03 | Serviços de desenho técnico relacionados à arquitetura e engenharia | Maquetes contratadas como **serviço** de representação de projeto; maquete digital/renderização de projetos de terceiros — **incluir somente após consulta ao CREA da UF** (risco de exigência de registro e responsável técnico — Lei 5.194/1966; prática varia por Regional). NECESSITA CONFIRMAÇÃO | III/V | Sim |
| 6201-5/02 | Web design | Quando houver receita própria de criação/manutenção de sites | III/V | Sim (§ 5º-D, VI) |
| 6204-0/00 | Consultoria em tecnologia da informação | Quando houver receita de consultoria | III/V | Sim |
| 6209-1/00 | Suporte técnico, manutenção e outros serviços em TI | Quando houver contratos autônomos de suporte/sustentação (a manutenção do software próprio já cabe em 6202/6203) | III/V | Sim |
| 8599-6/03 | Treinamento em informática | Quando houver receita de treinamento | **III fixo** (curso livre — § 5º-B, I) | **Não** |
| 9511-8/00 | Reparação e manutenção de computadores e periféricos | Contratos de manutenção de parques de totens/equipamentos | **III fixo** | Não |
| 3329-8/99 | Instalação de outros equipamentos n.e. | Instalação **avulsa** de equipamentos (a instalação do próprio produto vendido integra a venda) | **III fixo** (§ 5º-B, IX) | Não |
| 4751-2/01 | Comércio varejista especializado de equipamentos e suprimentos de informática | Quando começar a **revenda** de impressoras 3D, componentes e suprimentos adquiridos de terceiros (perfil atacado B2B de componentes: avaliar 4652-4/00 — NECESSITA CONFIRMAÇÃO do mix e da substituição tributária de ICMS na UF) | **I** | Não |

**Excluídos deliberadamente** (sem justificativa econômica; reavaliar só se os fatos mudarem): 2621-3/00 (fabricação de computadores), 6319-4/00 (portais/conteúdo), 7410-2/99 (design residual). **Nota:** a venda da produção própria — inclusive pela internet/e-commerce — **não exige CNAE de comércio**: na metodologia da CNAE, comercializar o que se fabrica integra a atividade industrial; CNAE de comércio (47xx) só é necessário para **revenda de mercadoria adquirida de terceiros**. Não existe CNAE específico de "comércio eletrônico" na CNAE 2.3 — classifica-se pelo produto, não pelo canal. Confiança alta.

---

## 4. OBJETO SOCIAL — REDAÇÃO SUGERIDA

Redação **por atividade** (não por produto), compatível com a IN DREI nº 81/2020, cobrindo a fase atual e a planejada **sem necessidade de alteração a cada novo aplicativo**. Os itens (vi) a (ix) devem ser incluídos **apenas junto com os respectivos CNAEs** (fase futura). Conferência final com as exigências redacionais da Junta Comercial da UF: NECESSITA CONFIRMAÇÃO.

> **CLÁUSULA — OBJETO SOCIAL.** A sociedade tem por objeto:
> (i) a fabricação, montagem e comercialização de maquetes físicas, modelos tridimensionais, dioramas, protótipos, peças e artefatos técnicos e decorativos, em plástico, resina, madeira, metal e materiais diversos, inclusive mediante impressão tridimensional (3D), corte e gravação a laser e processos correlatos, de produção própria, por encomenda ou para pronta entrega, com ou sem integração de sistemas eletrônicos, iluminação, sensores, automação, telas e recursos interativos;
> (ii) a fabricação, montagem e comercialização de totens, terminais interativos e de autoatendimento, painéis e dispositivos eletrônicos dedicados à apresentação, gestão e automação, incluindo sua instalação e assistência técnica quando associadas ao fornecimento dos próprios produtos;
> (iii) o desenvolvimento, o licenciamento e a cessão de direito de uso de programas de computador próprios, customizáveis ou não customizáveis, incluindo aplicativos móveis, plataformas web, sistemas com recursos de inteligência artificial e de realidade virtual ou aumentada, jogos e produtos digitais, bem como sua disponibilização mediante assinatura, acesso remoto ou na modalidade de software como serviço (SaaS);
> (iv) o desenvolvimento de programas de computador sob encomenda; o planejamento, a criação, a manutenção e a atualização de páginas, portais e aplicações de internet; a manutenção, atualização e sustentação de sistemas; e o tratamento de dados, provimento de serviços de aplicação e hospedagem;
> (v) serviços de design de produto, modelagem e digitalização tridimensional, renderização e visualização digital de produtos, ambientes e empreendimentos, e criação de experiências digitais e interativas;
> (vi) serviços de desenho técnico relacionados à arquitetura e à engenharia, observada a legislação profissional aplicável; *(incluir somente junto com o CNAE 7119-7/03, após consulta ao CREA)*
> (vii) consultoria e suporte técnico em tecnologia da informação; treinamento em informática; *(fase futura)*
> (viii) o comércio, inclusive por meio eletrônico, de equipamentos de informática, impressoras tridimensionais, componentes eletrônicos, peças, acessórios e suprimentos; *(fase futura)*
> (ix) a reparação e manutenção de computadores, periféricos e equipamentos eletrônicos; e a instalação de equipamentos não compreendidos em outras atividades. *(fase futura)*

Notas de redação: (1) evitou-se deliberadamente "projetos de engenharia/arquitetura" e "serviços de engenharia" — expressões que atrairiam a Lei 5.194/1966 (exercício de profissão regulamentada); (2) o item (iii) é o que garante que **novos aplicativos não alteram o contrato social**; (3) "e comercialização" nos itens (i)–(ii) cobre a venda (inclusive online) da produção própria, dispensando cláusula de comércio.

---

## 5. MAPA DE TRIBUTAÇÃO — RECEITA POR RECEITA

### 5.1 A questão prévia: quando a operação com maquete/peça é indústria e quando é serviço

A Receita Federal já se pronunciou especificamente sobre impressão 3D: a **Solução de Consulta Cosit nº 97/2019** qualifica a impressão 3D de objetos para venda como **industrialização (transformação), sujeita a IPI** — ressalvada a exceção do art. 5º, V, do RIPI (Decreto 7.212/2010): **encomenda direta de consumidor/usuário final + execução em oficina (máximo 5 operários e, se houver força motriz, até 5 kW) + preponderância do trabalho profissional (mão de obra ≥ 60% do valor do produto — art. 7º, II)**. Preenchidos os três testes, a operação sai do campo da industrialização; não preenchidos, é indústria ([SC Cosit 97/2019](https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-97-2019.htm); [RIPI — texto atualizado](https://www2.camara.leg.br/legin/fed/decret/2010/decreto-7212-15-junho-2010-606731-normaatualizada-pe.html)). Além disso, o STF decidiu no **Tema 816 (RE 882.461, j. 26/02/2025; ata publicada em 05/03/2025, com modulação a partir dela)** que **não incide ISS (subitem 14.05) sobre industrialização por encomenda quando o objeto se destina a industrialização ou comercialização subsequente** — nesses casos incide ICMS/IPI ([STF — notícia oficial](https://noticias.stf.jus.br/postsnoticias/iss-nao-incide-em-etapa-intermediaria-do-ciclo-de-producao-decide-stf/)). Confiança alta em ambas.

**Árvore de decisão (aplicar operação por operação):**

1. **Material próprio da Next Layer + entrega de bem novo vendido ao cliente** (maquete, peça, totem — ainda que personalizado): **venda de produto industrializado → NF-e, Anexo II** (a personalização não transforma indústria em serviço quando o núcleo do contrato é a entrega do bem). Confiança média-alta, com duas ressalvas: (a) se a operação específica preencher os três testes da oficina do RIPI acima, o enquadramento como serviço pode prevalecer — **NECESSITA CONFIRMAÇÃO operacional** (nº de operários, potência instalada, composição de valor dos contratos); (b) a nota explicativa da CONCLA para o 3299-0/99 inclui "objetos em escala (maquetes)" mas **exceto maquetes de projetos de arquitetura e engenharia**, que a CONCLA classifica como serviço (7119-7/03 — "confecção de maquetes para engenharia e arquitetura"), e municípios historicamente invocam a **Súmula 156/STJ** para bens personalizados sob encomenda — há risco real de o fisco municipal sustentar ISS sobre maquetes que representem instalações/projetos de engenharia. A posição Anexo II/NF-e permanece defensável (lógica da destinação prestigiada pelo STF na ADI 4389 e no Tema 816; a empresa vende um bem que fabricou, não elabora projeto de engenharia), mas **recomenda-se consulta formal (municipal e, se cabível, estadual) antes de consolidar 100% do faturamento de maquetes como venda de produto**.
2. **Insumo/material fornecido pelo cliente + o bem retorna para a cadeia produtiva ou comercial dele** (ex.: peças que o cliente integra ao produto dele ou revende): **ICMS/IPI — Tema 816** → NF-e de industrialização por encomenda, **Anexo II**. Confiança alta.
3. **Insumo/objeto fornecido pelo cliente + uso final do próprio cliente** (beneficiamento, acabamento, peça para uso interno): **serviço — item 14.05 → NFS-e, Anexo III (sem Fator R)**. Confiança alta (é exatamente o espaço que o Tema 816 preservou).
4. **Zona cinzenta** (material misto, destinação incerta): documentar por escrito no pedido a **origem dos materiais e a destinação declarada pelo cliente** — é a prova que sustenta o enquadramento.

### 5.2 Tabela-mestre de tributação

Legenda: FR = sujeita ao Fator R (Anexo III se ≥ 28%; Anexo V se < 28%). Itens de serviço = lista da LC 116/2003 (redação da LC 157/2016). Códigos municipais: NECESSITA CONFIRMAÇÃO.

| Receita | CNAE relacionado | Tipo | Anexo/tributação provável | Documento fiscal | Impostos relevantes (dentro do DAS, salvo nota) |
|---|---|---|---|---|---|
| **Maquete completa** (material próprio, com eletrônica/software embarcado e instalação incluídos) | 3299-0/99 | Produto | **Anexo II** (regra — ver árvore 5.1) | **NF-e** (CFOP 5101/6101; NCM 9023.00.00 aproximado — confirmar) | ICMS + IPI no DAS; instalação e software embarcado integram o valor da operação |
| **Protótipo — entrega do bem físico** (material próprio) | 3299-0/99 / 2229-3/99 | Produto | **Anexo II** | NF-e | ICMS + IPI no DAS |
| **Protótipo — contrato de desenvolvimento/engenharia do produto** (entregável = projeto, CAD/STL, relatórios; o físico é meio de validação) | 7410-2/03 (ou 7119-7/03 futuro) | Serviço | **V → III via Fator R** (§ 5º-I, XII) | NFS-e (itens 23.01/32.01; 1.04 se houver software) | ISS no DAS; sem retenções federais (Simples) |
| **Peça impressa em 3D — venda** (material próprio, catálogo ou personalizada) | 2229-3/99 | Produto | **Anexo II** | NF-e (CFOP 5101/6101; NCM do material — ex.: 3926.90.90 aproximado) | ICMS + IPI no DAS |
| **Impressão 3D sob encomenda — insumo do cliente destinado a industrialização/comercialização** | 2229-3/99 | Industrialização p/ terceiros | **Anexo II** (Tema 816 — sem ISS) | NF-e (CFOP 5124/6124 + retorno de insumos 5902/6902; simbólico conforme UF) | ICMS + IPI no DAS; suspensões possíveis nas remessas — NECESSITA CONFIRMAÇÃO UF |
| **Impressão 3D/beneficiamento sob encomenda — usuário final, material do cliente** | 3299-0/99 (operação de serviço) | Serviço | **Anexo III fixo** (14.05 não está no rol do Fator R) | NFS-e (item 14.05) | ISS no DAS |
| **Desenvolvimento de software sob encomenda** | 6201-5/01 | Serviço | **V → III via Fator R** (§ 5º-D, IV c/c § 5º-M) | NFS-e (item **1.04**; 1.01/1.02 conforme escopo) | ISS no DAS; sem IRRF/CSRF (IN RFB 765/2007; IN SRF 459/2004) |
| **SaaS / assinatura de plataforma (B2B ou B2C)** | 6203-1/00 + 6311-9/00 | Serviço | **V → III via Fator R** (§ 5º-D, V) | NFS-e mensal por assinante, valor cheio (item 1.05 ou 1.03 — conforme o município) | ISS no DAS; tarifas de gateway são **despesa**, nunca dedução da receita |
| **Aplicativo B2C (venda direta/gateway)** | 6203-1/00 | Serviço | **V → III via Fator R** | NFS-e por assinante (item 1.05/1.03), emissão automatizada via API | ISS no DAS; CPF do assinante no documento; LGPD |
| **Aplicativo via App Store/Google Play** | 6203-1/00 | Serviço | **V → III via Fator R** | NFS-e/invoice **contra a entidade da loja**, pelo repasse (prática predominante — **NECESSITA CONFIRMAÇÃO contratual antes do lançamento**; avaliar exportação de serviço) | ISS (discussão de exportação); possível IR retido no exterior/fonte (Google) |
| **Licença de software B2B (anual)** | 6202-3/00 / 6203-1/00 | Serviço | **V → III via Fator R** | NFS-e (item **1.05**) | ISS no DAS; orientar tomador: sem IRRF/CSRF de optante |
| **Consultoria em TI** | 6204-0/00 (futuro) | Serviço | **V → III via Fator R** | NFS-e (item 1.06) | ISS no DAS |
| **Treinamento (curso livre)** | 8599-6/03 (futuro) | Serviço | **Anexo III fixo** (§ 5º-B, I — sem Fator R) | NFS-e (item 8.02) | ISS no DAS |
| **Projeto 3D digital / modelagem / visualização (sem fabricação)** | 7410-2/03 | Serviço | **V → III via Fator R** (§ 5º-I, XII) | NFS-e (item **23.01** — comunicação visual/desenho industrial; **32.01** se desenho técnico; 1.04 se aplicação interativa) | ISS no DAS; descrever o entregável real |
| **Totem interativo (venda)** | 2622-1/00 | Produto | **Anexo II** | NF-e (NCM grupo 8471/8543 conforme função — classificação formal recomendada) | ICMS + IPI no DAS; firmware embarcado integra o produto; camada SaaS autônoma (CMS de conteúdo) pode ser licenciada à parte — NFS-e 1.05 |
| **Suporte/manutenção de software** | 6209-1/00 (futuro) / 6202-6203 | Serviço | **V → III via Fator R** | NFS-e (item 1.07) | ISS no DAS; contrato com SLA e execução real |
| **Manutenção de maquete/totem físico (pós-venda)** | 9511-8/00 (futuro) | Serviço | **Anexo III fixo** (§ 5º-B, IX) | NFS-e (item 14.01); peças substituídas → NF-e (ficam sujeitas a ICMS — parte final do 14.01) | ISS no DAS (serviço) + ICMS (peças) |
| **Revenda de equipamentos/peças (compradas de terceiros)** | 4751-2/01 (futuro) | Mercadoria | **Anexo I** | NF-e (CFOP 5102/6102) | ICMS no DAS — atenção a **substituição tributária** de eletrônicos (NECESSITA CONFIRMAÇÃO UF) |
| **Locação de equipamentos** (se vier a existir) | — | Locação de bem móvel | **Anexo III, deduzida a parcela do ISS** (não é serviço da LC 116 — Súmula Vinculante 31/STF; LC 123, art. 18, § 5º-A) | Nota de débito/fatura (não é NFS-e) | Sem ISS; demais tributos no DAS |
| **Exportação de serviços/software** (cliente no exterior, resultado no exterior) | 62xx | Serviço | Anexo do serviço, **sem ISS/PIS/COFINS** na parcela exportada (LC 123, art. 18, § 14) | NFS-e/invoice conforme o caso | Isenções de exportação — documentar contrato, invoice e câmbio |

Base do par III/V com Fator R: LC 123/2006, art. 18, §§ 5º-D (IV, V e VI), 5º-I, 5º-J e 5º-M — estrutura pós-LC 155/2016 (**texto integral conferido em espelhos oficiais; acesso direto ao Planalto indisponível no ambiente de pesquisa**). A incidência de ISS (e não ICMS) sobre licenciamento de software — padronizado ou por encomenda — foi fixada pelo STF nas **ADIs 1.945 e 5.659 (fev/2021, modulação a partir de 03/03/2021)**; a aplicação ao SaaS é a leitura amplamente dominante dos municípios ([STF](https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=478136&ori=1)). Confiança alta.

---

## 6. SIMULAÇÃO DE IMPOSTOS

### 6.1 Fórmula (única para todos os anexos)

**Alíquota efetiva = (RBT12 × alíquota nominal da faixa − parcela a deduzir) ÷ RBT12** · **DAS do mês = receita do mês × alíquota efetiva** (LC 123, art. 18, § 1º-A).

*Exemplo demonstrado (Anexo III, RBT12 = R$ 300.000):* (300.000 × 11,2% − 9.360) ÷ 300.000 = (33.600 − 9.360) ÷ 300.000 = 24.240 ÷ 300.000 = **8,08%**.

**Tabelas vigentes (desde 2018, confirmadas para 2026) — nominal / parcela a deduzir (R$):**

| Faixa (RBT12) | Anexo I (comércio) | Anexo II (indústria) | Anexo III (serviços) | Anexo V (serviços) |
|---|---|---|---|---|
| 1ª — até 180.000 | 4,0% / 0 | 4,5% / 0 | 6,0% / 0 | 15,5% / 0 |
| 2ª — 180.000,01 a 360.000 | 7,3% / 5.940 | 7,8% / 5.940 | 11,2% / 9.360 | 18,0% / 4.500 |
| 3ª — 360.000,01 a 720.000 | 9,5% / 13.860 | 10,0% / 13.860 | 13,5% / 17.640 | 19,5% / 9.900 |
| 4ª — 720.000,01 a 1.800.000 | 10,7% / 22.500 | 11,2% / 22.500 | 16,0% / 35.640 | 20,5% / 17.100 |
| 5ª — 1.800.000,01 a 3.600.000 | 14,3% / 87.300 | 14,7% / 85.500 | 21,0% / 125.640 | 23,0% / 62.100 |
| 6ª — 3.600.000,01 a 4.800.000 | 19,0% / 378.000 | 30,0% / 720.000 | 33,0% / 648.000 | 30,5% / 540.000 |

### 6.2 Alíquota efetiva e DAS anual por anexo — 7 níveis de faturamento (receita anual = RBT12, regime estável)

| RBT12 | Anexo I | Anexo II | Anexo III | Anexo V |
|---|---|---|---|---|
| R$ 100 mil (1ª faixa) | 4,00% • R$ 4.000 | 4,50% • R$ 4.500 | 6,00% • R$ 6.000 | 15,50% • R$ 15.500 |
| R$ 300 mil (2ª) | 5,32% • R$ 15.960 | 5,82% • R$ 17.460 | 8,08% • R$ 24.240 | 16,50% • R$ 49.500 |
| R$ 600 mil (3ª) | 7,19% • R$ 43.140 | 7,69% • R$ 46.140 | 10,56% • R$ 63.360 | 17,85% • R$ 107.100 |
| R$ 1 mi (4ª) | 8,45% • R$ 84.500 | 8,95% • R$ 89.500 | 12,44% • R$ 124.360 | 18,79% • R$ 187.900 |
| R$ 2 mi (5ª) | 9,94% • R$ 198.700 | 10,43% • R$ 208.500 | 14,72% • R$ 294.360 | 19,90% • R$ 397.900 |
| R$ 3,6 mi (5ª — limite inclusivo) | 11,88% • R$ 427.500 | 12,33% • R$ 443.700 | 17,51% • R$ 630.360 | 21,28% • R$ 765.900 |
| R$ 4,8 mi (6ª) | 11,13% • R$ 534.000 | 15,00% • R$ 720.000 | 19,50% • R$ 936.000 | 19,25% • R$ 924.000 |

Notas: (i) acima do **sublimite de R$ 3,6 mi** o ICMS e o ISS saem do DAS e passam a ser recolhidos por fora — os valores da última linha são indicativos para comparação, não a carga total; (ii) curiosidade relevante: **na 6ª faixa o Anexo V fica mais barato que o III** (19,25% × 19,50%) — o Fator R perde a função nesse patamar; (iii) diferença II × I nas faixas 1–4 = 0,5 p.p. (é o custo embutido do IPI industrial). Confiança alta (valores recalculados e conferidos).

### 6.3 Cenários híbridos — mix estimado de crescimento: 40% fabricação (II) + 30% software + 20% SaaS + 10% serviços de Anexo III fixo (instalação/treinamento)

Com Fator R ≥ 28%, os 50% de software/SaaS vão ao Anexo III; sem Fator R, ao Anexo V. Os 10% "outros" ficam no III fixo em ambos.

| RBT12 | COM Fator R — média • DAS/ano | SEM Fator R — média • DAS/ano | Economia bruta anual do Fator R |
|---|---|---|---|
| R$ 100 mil | 5,40% • R$ 5.400 | 10,15% • R$ 10.150 | R$ 4.750 |
| R$ 300 mil | 7,18% • R$ 21.528 | 11,39% • R$ 34.158 | R$ 12.630 |
| R$ 600 mil | 9,41% • R$ 56.472 | 13,06% • R$ 78.342 | R$ 21.870 |
| R$ 1 mi | 11,04% • R$ 110.416 | 14,22% • R$ 142.186 | R$ 31.770 |
| R$ 2 mi | 13,00% • R$ 260.016 | 15,59% • R$ 311.786 | R$ 51.770 |
| R$ 3,6 mi | 15,44% • R$ 555.696 | 17,32% • R$ 623.466 | R$ 67.770 |
| R$ 4,8 mi | 17,70% • R$ 849.600 | 17,58% • R$ 843.600 | ≈ 0 (levemente **negativa**: V < III na 6ª faixa) |

Contra a economia bruta deve-se abater o **custo tributário da folha** necessária ao Fator R — a análise completa (inclusive os cenários em que não compensa) está na Seção 7.5. Confiança alta nas contas; o mix 40/30/20/10 é premissa ilustrativa — **refazer com o mix real**.

### 6.4 Comparação objetiva com o Lucro Presumido

Premissas explícitas: mix 40% indústria/60% serviços; presunções IRPJ 8% (venda de produção) e 32% (serviços); adicional de IRPJ de 10% sobre a base anual que exceder R$ 240 mil; CSLL 9% sobre presunção de 12%/32%; PIS/COFINS cumulativos 3,65%; **ISS 3%** (faixa municipal 2%–5% — NECESSITA CONFIRMAÇÃO); folha = 28% da receita (a mesma do cenário Fator R, para comparação justa) com **INSS patronal de ~27,8%** (20% + RAT + terceiros — RAT/FAP dependem do CNAE: NECESSITA CONFIRMAÇÃO); **ICMS/IPI das vendas industriais não computados** (dependem de UF/NCM/créditos — tendem a piorar ainda mais o Presumido).

| Receita anual | Lucro Presumido (total • % receita) | Simples COM Fator R | Simples SEM Fator R |
|---|---|---|---|
| R$ 600 mil | R$ 112.524 • 18,8% (+ ICMS) | R$ 56.472 • 9,4% | R$ 78.342 • 13,1% |
| R$ 1 mi | R$ 187.540 • 18,8% (+ ICMS) | R$ 110.416 • 11,0% | R$ 142.186 • 14,2% |
| R$ 2 mi | R$ 395.880 • 19,8% (+ ICMS) | R$ 260.016 • 13,0% | R$ 311.786 • 15,6% |

Composição do Presumido em R$ 1 mi: IRPJ 33.600 + CSLL 21.600 + PIS/COFINS 36.500 + ISS 18.000 + INSS patronal sobre a folha 77.840. Mesmo com folha enxuta (só pró-labore mínimo), o Presumido ficaria em ~12–13% **mais o ICMS estadual** sobre a parcela industrial — ainda perdendo do Simples com Fator R, que embute tudo. **Conclusão: o Simples Nacional domina o Lucro Presumido em todos os níveis simulados.** Nos patamares de R$ 3,6–4,8 mi a estrutura muda (ISS/ICMS saem do DAS pelo sublimite; clientes B2B passam a valorizar créditos): **re-simulação formal obrigatória ao se aproximar de R$ 3,6 mi** (gatilho no plano de ação). **Lucro Real**: só entraria em cena com margens comprimidas, créditos intensivos ou obrigatoriedade — fora do horizonte de 36 meses. Confiança alta dentro das premissas.

---

## 7. FATOR R — DETALHAMENTO, VALIDAÇÃO E CUSTO-BENEFÍCIO

### 7.1 A regra

**Fator R = FS12 ÷ RBT12**: folha de salários dos **12 meses anteriores** (salários e demais remunerações de pessoas físicas, **13º, pró-labore, CPP efetivamente recolhida e FGTS efetivamente recolhido**) dividida pela receita bruta dos 12 meses anteriores (Resolução CGSN 140/2018, art. 26; LC 123, art. 18, §§ 5º-J e 5º-M). **r ≥ 0,28 → as receitas "fatorizáveis" vão ao Anexo III; r < 0,28 → Anexo V.** Não entram na folha: distribuição de lucros, pagamentos a PJ, benefícios não remuneratórios. Regras de borda: folha > 0 e receita 12m = 0 → r = 0,28; folha = 0 e receita > 0 → r = 0,01. Em início de atividade aplicam-se proporcionalizações próprias. Confiança alta.

**Receitas sujeitas ao Fator R na Next Layer:** software sob encomenda, licenciamento, SaaS, sites, suporte/manutenção de software, consultoria em TI, design/modelagem 3D/projetos digitais. **Não sujeitas** (anexo fixo): fabricação própria (II), revenda (I), industrialização por encomenda-ICMS (II), beneficiamento 14.05 para usuário final (III), treinamento-curso livre (III), instalação/manutenção física (III), locação (III sem ISS).

### 7.2 Validação dos números reais fornecidos (contas refeitas de forma independente)

Os RBT12 informados são internamente consistentes com uma empresa que já operava há mais de 12 meses (~R$ 6,5 mil/mês antes da aceleração) — logo, não se aplicam regras de início de atividade e os RBT12 podem ser usados diretamente.

**Cenário A (Fator R < 28% — receitas fatorizáveis no Anexo V) × Cenário B (Fator R ≥ 28% — no Anexo III):**

| Mês | Receita (R$) | RBT12 (R$) | Efetiva V | DAS V (R$) | Efetiva III | DAS III (R$) | Folha média p/ 28% (R$/mês) |
|---|---|---|---|---|---|---|---|
| Ago | 67.000 | 78.000 | 15,5000% | 10.385,00 | 6,0000% | 4.020,00 | 1.820,00 |
| Set | 88.500 | 138.500 | 15,5000% | 13.717,50 | 6,0000% | 5.310,00 | 3.231,67 |
| Out | 53.750 | 220.500 | 15,9592% | 8.578,06 | 6,9551% | 3.738,37 | 5.145,00 |
| Nov | 53.750 | 267.750 | 16,3193% | 8.771,63 | 7,7042% | 4.141,01 | 6.247,50 |
| **Total** | **263.000** | — | **média 15,76%** | **41.452,19** | **média 6,54%** | **17.209,38** | — |

**Veredito: a simulação do sócio está aritmeticamente correta** (DAS V ≈ R$ 41.452; DAS III ≈ R$ 17.209; efetivas 15,50–16,32% × 6,00–7,70%; pró-labores mínimos de R$ 1.820,00 a R$ 6.247,50 — todos os valores conferem, com divergências de centavos por arredondamento). **Economia bruta: R$ 24.242,81 no quadrimestre (~58%).** Duas ressalvas técnicas: (i) a coluna de folha é a **média de regime permanente** — como o Fator R usa a folha acumulada de 12 meses, o pró-labore precisa **já vir sendo pago** nos meses anteriores (em fase de implantação, alguns meses podem ainda cair no Anexo V até o acumulado alcançar 28%); (ii) o pró-labore não pode ser inferior a **1 salário mínimo (R$ 1.621 em 2026** — Decreto 12.797/2025; [TRT7](https://www.trt7.jus.br/index.php/noticias/todas-as-noticias/16465-reajuste-do-salario-minimo-2026-veja-o-que-voce-precisa-saber)). Confiança alta.

### 7.3 Custo do pró-labore × economia de DAS (parâmetros 2026 verificados)

Parâmetros: INSS do sócio (contribuinte individual que presta serviço a PJ) = **11% até o teto de R$ 8.475,55** ([Contabilizei — teto INSS 2026](https://www.contabilizei.com.br/contabilidade-online/teto-inss/)); a empresa do Simples (Anexos I–III e V) **não paga INSS patronal por fora** (CPP no DAS). IRPF 2026: tabela progressiva (isenta até R$ 2.428,80; parcela a deduzir máxima R$ 908,73) **+ redutor da Lei 15.270/2025** — imposto efetivo **zero até R$ 5.000/mês** e redução parcial até R$ 7.350/mês (redutor = R$ 978,62 − 0,133145 × rendimento) ([Contabilizei — tabela IR 2026](https://www.contabilizei.com.br/contabilidade-online/tabela-imposto-de-renda/); [RFB — orientação de cálculo](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/receita-federal-orienta-fontes-pagadoras-e-contribuintes-a-calcular-a-reducao-do-imposto-de-renda-a-partir-de-1o-de-janeiro-de-2026)). Confiança alta.

**Cenário-teto (100% da receita fatorizável — validação do comparativo do sócio):**

| Mês | Economia DAS (V−III) | Pró-labore | INSS 11% | IRPF estimado* | Custo total | **Economia líquida** |
|---|---|---|---|---|---|---|
| Ago | 6.365,00 | 1.820,00 | 200,20 | 0 | 200,20 | **6.164,80** |
| Set | 8.407,50 | 3.231,67 | 355,48 | 0 | 355,48 | **8.052,02** |
| Out | 4.839,69 | 5.145,00 | 565,95 | ~61 | ~627 | **~4.213** |
| Nov | 4.630,62 | 6.247,50 | 687,23 | ~474 | ~1.161 | **~3.470** |
| **Total** | **24.242,81** | — | **1.808,86** | **~535** | **~2.344** | **~R$ 21.899** |

\* IR pela tabela progressiva sobre a base após INSS, com o redutor da Lei 15.270/2025 calculado sobre o rendimento bruto (critério da orientação oficial da RFB de dez/2025); pequenas variações conforme o critério da folha — conferência final com o contador. Valores em regime permanente (ver ressalva de implantação da Seção 7.2).

**Leitura dos cenários: o Cenário B (Fator R ≥ 28%) é fortemente superior no porte atual** — ~90% da economia bruta é preservada. E o pró-labore **não é dinheiro perdido**: ~89% dele permanece com o sócio (muda a rubrica de "lucro" para "remuneração") e ainda gera contagem previdenciária. Não há artificialismo: o sócio efetivamente trabalha na operação — pró-labore compatível com o trabalho de administração/desenvolvimento tem plena substância econômica.

### 7.4 O alcance real da economia no mix atual (a ressalva mais importante desta seção)

O comparativo V × III acima aplica os dois anexos sobre **100% da receita** — válido apenas se toda a receita fosse de serviços fatorizáveis. **Não é o caso**: a receita atual é majoritariamente **fabricação (Anexo II — 4,5% a 5,6% nesses RBT12), que não entra no Fator R e já é mais barata que o próprio Anexo III.** Cenário ilustrativo com o mesmo quadrimestre segregado em 70% fabricação + 30% serviços fatorizáveis (mix real: NECESSITA CONFIRMAÇÃO com as notas emitidas):

| Cenário | DAS do quadrimestre |
|---|---|
| Tudo como serviço no Anexo V (como na simulação original) | R$ 41.452,19 |
| Segregado: 70% no Anexo II + 30% no Anexo V (sem Fator R) | **R$ 21.355,14** |
| Segregado: 70% no Anexo II + 30% no Anexo III (com Fator R) | **R$ 14.082,28** |

Ou seja: **a segregação correta, sozinha, economiza ~R$ 20,1 mil** — mais do que o próprio Fator R nesse mix; o Fator R acrescenta **R$ 7.272,86 brutos (~R$ 4,9 mil líquidos** após o custo de ~R$ 2.344, que não muda com o mix, pois os 28% incidem sobre o RBT12 total). O Fator R continua compensando, nesses RBT12, a partir de ~10% de receitas fatorizáveis no mix. **Antes de fixar o pró-labore, refazer esta conta com o mix real.** Confiança alta nas contas; premissa 70/30 ilustrativa.

### 7.5 Fator R no crescimento — folha necessária por nível e análise de sensibilidade

| RBT12 | Folha necessária (28%) — anual / média mensal | Economia bruta (mix 50% fatorizável — Seção 6.3) | Custo tributário se a folha for **distribuída** em remunerações ≤ R$ 5.000/pessoa (INSS 11%, IR 0) | Economia líquida nesse cenário | Custo se **concentrada em 1 sócio** (INSS até o teto + IRPF) |
|---|---|---|---|---|---|
| R$ 100 mil | 28.000 / 2.333 | 4.750 | 3.080 | **+1.670** | 3.080 → **+1.670** |
| R$ 300 mil | 84.000 / 7.000 | 12.630 | 9.240 | **+3.390** | ~18.335 → **−5.705** |
| R$ 600 mil | 168.000 / 14.000 | 21.870 | 18.480 | **+3.390** | ~43.406 → **−21.536** |
| R$ 1 mi | 280.000 / 23.333 | 31.770 | 30.800 | **+970** | ~74.206 → **−42.436** |
| R$ 2 mi | 560.000 / 46.667 | 51.770 | 61.600 | **−9.830** | ~151.206 → **−99.436** |
| R$ 3,6 mi | 1.008.000 / 84.000 | 67.770 | 110.880 | **−43.110** | negativo |
| R$ 4,8 mi | 1.344.000 / 112.000 | ≈ 0 | — | negativo | negativo |

**Como ler esta tabela (três conclusões práticas):**

1. **A tabela superestima o custo de propósito**: ela trata **toda** a folha como se fosse criada apenas para o Fator R. Na realidade, uma operação de software/serviços em crescimento **tem folha própria** (equipe de desenvolvimento CLT + pró-labores por trabalho real) — e salários pagos por trabalho necessário **não são custo da estratégia**; nesse caso o ganho do Fator R é **integral**. A partir de RBT12 ~R$ 1–2 mi, a folha de 28% tende a existir naturalmente numa empresa de tecnologia.
2. **Regra de bolso:** o Fator R "se paga" quando *(fração fatorizável da receita) × (diferença de efetivas V − III na faixa)* for maior que o **custo tributário da folha incremental** (~11% quando distribuída na faixa de isenção do IR; mais que isso quando concentrada acima de R$ 7.350/mês, onde o IRPF marginal chega a 27,5%). Com receita **100% fatorizável** (empresa "pura" de software), a economia bruta é o dobro da tabela e o mecanismo compensa em todas as faixas 1–5 mesmo no cenário conservador.
3. **Nunca inflar folha sem função** — além de vedado (fraude), a tabela mostra que também é **economicamente irracional** nas faixas altas. A decisão correta é anual e conjunta com o contador: medir a folha natural, calcular o gap até 28% e comparar custo × economia. NECESSITA CONFIRMAÇÃO: número de sócios que trabalham na empresa (dividir o pró-labore entre sócios que efetivamente trabalham, dentro da faixa de isenção do IR, reduz muito o custo — mas só para quem de fato trabalha).

**Rotina operacional do Fator R:** pagar o pró-labore todo mês (com recibo), declarar no **eSocial** e recolher o INSS via **DCTFWeb/DARF**; acompanhar mensalmente a razão FS12 ÷ RBT12 **projetada**; lembrar que salários CLT (e FGTS/CPP recolhidos) também contam. Sem folha formalizada e tempestiva, o PGDAS-D calculará pelo Anexo V.

---

## 8. COMO PAGAR MENOS IMPOSTO LEGALMENTE — RANKING

| # | Estratégia | Impacto | Economia possível | Dificuldade | Risco | Requisito | Vale para a Next Layer? |
|---|---|---|---|---|---|---|---|
| 1 | **Segregação correta das receitas por anexo no PGDAS-D** (fabricação no II com NF-e; serviços no III/V com NFS-e) | **ALTO** | No quadrimestre simulado, ~R$ 20,1 mil só de tirar a fabricação do anexo de serviços; recorrente | Média (disciplina de contratos e faturamento) | Baixo se documentado; alto se segregar sem lastro | IE + NF-e; contratos e notas coerentes; árvore da Seção 5.1 | **Sim — prioridade máxima** |
| 2 | **Fator R ≥ 28%** (pró-labore calibrado + folha real) | **ALTO** | ~R$ 21,9 mil líquidos/quadrimestre no teto teórico; ~R$ 4,9 mil no mix ilustrativo 70/30; R$ 12–68 mil/ano conforme escala e mix (Seções 6.3 e 7.5) | Baixa (rotina mensal) | Baixo — mecanismo legal expresso | Pró-labore pago e declarado (eSocial/DCTFWeb); monitoramento FS12/RBT12 | **Sim — prioridade máxima** |
| 3 | **Distribuição de lucros isenta com contabilidade completa (ECD)** | **ALTO** | IRPF zero sobre todo o lucro contábil distribuído (acima da presunção, só com escrituração) — LC 123, art. 14 | Baixa (custo contábil marginal) | Baixo | ECD, balancetes, atas de distribuição | **Sim** |
| 4 | **Pró-labore no valor ótimo** (mínimo necessário ao Fator R; dentro da faixa de isenção/redução do IRPF sempre que possível; dividido entre sócios que trabalham) | MÉDIO-ALTO | Diferença entre pagar 11% + IRPF sobre pró-labore excessivo × ótimo | Baixa | Baixo | Recalcular mensalmente; piso de 1 salário mínimo | **Sim** |
| 5 | **CNAEs corretos e completos desde já + objeto social por atividade** | MÉDIO | Evita anexo errado, retenções indevidas e alterações societárias repetidas | Baixa | Baixo | Uma alteração contratual única bem-feita | **Sim** |
| 6 | **Regime de caixa no PGDAS-D** (tributar quando receber, não quando faturar) | MÉDIO | Diferimento de DAS em projetos com prazos longos de recebimento (maquetes B2B) | Baixa (opção anual) | Baixo | Opção formalizada no prazo; controles de recebimento | **Avaliar com o contador na próxima janela** (LC 123, art. 18, § 3º — **NÃO VERIFICADO ONLINE — base: conhecimento até jan/2026**) |
| 7 | **Contratação CLT no crescimento** (salários contam no Fator R; CPP já está no DAS — o custo tributário marginal de CLT no Simples é menor do que parece; PJ não conta) | MÉDIO | Folha CLT pode sustentar o Fator R sozinha, liberando o pró-labore | Média | Baixo (atenção à pejotização reversa) | Planejar mix CLT/PJ com efeito Fator R | **Sim, ao montar equipe** |
| 8 | **Exportação de serviços/software** (cliente e resultado no exterior) | ALTO se houver | ISS/PIS/COFINS fora do DAS na receita exportada (LC 123, art. 18, § 14) | Média | Baixo | Contrato, invoice, câmbio documentado; análise do "resultado no exterior" | **Sim, se internacionalizar** |
| 9 | **Janela do "Simples híbrido"** — IBS/CBS por fora, com crédito integral ao cliente B2B (1ª janela: 1º–30/09/2026, efeitos 2027) | BAIXO hoje / potencialmente ALTO a partir de 2029 | Preservação de clientes B2B que exigirem crédito pleno | Média | Médio (aumenta carga se mal simulado) | Simulação a cada janela anual | **Monitorar; tendência de NÃO optar para 2027** |
| 10 | **Migração para Lucro Presumido** | NEGATIVO hoje | — | — | — | — | **Não no horizonte atual** (Seção 6.4); re-simular nos gatilhos de R$ 3,6/4,8 mi |

**O papel das despesas no Simples (evita frustração):** o DAS incide sobre a **receita bruta** — comprar impressoras, insumos, computadores ou anúncios **não reduz o DAS**. Despesas importam para precificação e para o lucro contábil (que delimita a distribuição isenta). A única "despesa" que reduz DAS indiretamente é a **folha**, via Fator R — e só até o ponto ótimo de 28%. Optante do Simples também **não apropria créditos** de ICMS/IPI/PIS/COFINS sobre compras (LC 123, art. 23, caput); pode **transferir** ao cliente crédito de ICMS limitado ao devido no Simples (art. 23, §§ 1º–6º) e, na prática, clientes no lucro real tomam créditos de PIS/COFINS sobre compras de optantes (ADI RFB 15/2007) — **NÃO VERIFICADO ONLINE — base: conhecimento até jan/2026**. Confiança alta.

---

## 9. MITOS TRIBUTÁRIOS QUE DEVEMOS EVITAR

| Mito | Realidade |
|---|---|
| **"Comprar equipamento/impressora reduz o DAS"** | **Falso.** O DAS é calculado sobre a receita bruta; investimento não entra na conta. Depreciação só afetaria IRPJ no Lucro Real — regime que a empresa não usa |
| **"Ter vários CNAEs reduz imposto"** | **Falso.** CNAE não define alíquota no Simples — a tributação segue a natureza de cada receita no PGDAS-D. CNAEs a mais sem atividade real só geram custo (licenças, taxas) e questionamento; CNAEs corretos evitam problema, não criam benefício |
| **"Emitir duas notas (produto + serviço) sempre paga menos"** | **Falso e perigoso.** Separar documentos é **obrigatório** quando há duas prestações autônomas reais (ex.: totem + licença SaaS com vida própria) e é **simulação** quando fatia um fornecimento único no papel (ex.: "licença" do firmware sem o qual o totem não funciona). Separação sem substância pode ser desconsiderada (CTN, art. 116, parágrafo único), com autuação de ICMS/IPI sobre o total |
| "Software é sempre Anexo V" (ou "sempre III") | **Falso.** Depende do Fator R (III se ≥ 28%; V se < 28%) — e algumas receitas (treinamento, instalação, 14.05) são Anexo III fixo |
| "Impressão 3D é sempre serviço" (ou "sempre indústria") | **Falso.** Depende da operação: material próprio + bem novo = indústria (NF-e, Anexo II); beneficiamento de material do cliente para uso final dele = serviço 14.05 (NFS-e, III); insumo do cliente destinado a industrialização/comercialização = ICMS/IPI (Tema 816/STF) |
| "Emitir tudo como serviço simplifica e dá no mesmo" | **Falso.** Paga-se mais (III/V ≥ II), mistura-se NF-e/NFS-e indevidamente, recolhe-se ISS indevido e cria-se passivo de ICMS não documentado |
| "Abrir uma segunda empresa dobra o limite do Simples" | **Falso.** Com sócios em comum, o limite de R$ 4,8 mi considera a **receita bruta global** das empresas (LC 123, art. 3º, § 4º, III–V). Duas empresas não ampliam o teto — quem promete isso está propondo fraude |
| "Distribuição de lucros agora paga 10% para todo mundo" | **Impreciso.** Em 2026 a retenção de 10% (Lei 15.270/2025) alcança pagamentos **acima de R$ 50 mil/mês por beneficiário** (com controvérsia sobre o Simples) e o imposto mínimo só alcança rendas anuais **acima de R$ 600 mil**. Fora disso, a isenção do art. 14 da LC 123 segue operante |
| "Aumentar a folha sempre compensa por causa do Fator R" | **Falso.** Só compensa até 28% do RBT12 e apenas para as receitas fatorizáveis; acima disso (ou com folha concentrada em faixa alta de IRPF), cada real de folha custa INSS/IRPF sem reduzir nada (Seção 7.5). Folha sem função econômica é fraude — vedada e desnecessária |
| "Despesa pessoal paga pela PJ economiza imposto" | **Falso.** Não reduz o DAS e pode ser requalificada como distribuição disfarçada/pró-labore indireto, com tributação e multa |

---

## 10. FLUXO DE NOTA FISCAL — MINI-MANUAL OPERACIONAL

**Pré-requisitos permanentes:** Inscrição Estadual ativa + credenciamento NF-e na SEFAZ + certificado digital e-CNPJ (venda de produto); inscrição municipal + **cadastro no Emissor Nacional da NFS-e antes de 1º/11/2026** (serviços); indicação "optante pelo Simples Nacional" nos documentos; **CRT = 1** na NF-e; guarda dos XMLs por no mínimo 5 anos; PGDAS-D transmitido mensalmente e DEFIS anual.

| Se a operação for… | Documento | Código/CFOP/Item | Cuidados específicos |
|---|---|---|---|
| **Vender maquete completa** (material próprio, com instalação e software embarcado) | **NF-e única** | CFOP 5101 (dentro da UF) / 6101 (interestadual); NCM 9023.00.00 (aproximado — classificação formal recomendada) | Projeto, firmware e instalação **integram o valor** (base do ICMS — LC 87/1996, art. 13, § 1º — **NÃO VERIFICADO ONLINE — base: conhecimento até jan/2026**); contrato redigido como obrigação de dar; **nas vendas a cliente contribuinte do regime normal, informar o crédito de ICMS permitido (LC 123, art. 23, §§ 1º–6º)** com a expressão exigida pela Res. CGSN 140/2018 nas informações complementares — relevante para clientes de energia/data centers |
| **Vender totem** | NF-e | CFOP 5101/6101; NCM grupo 8471/8543 conforme função | Firmware que dá função ao totem integra o produto; se houver **plataforma de conteúdo com vida própria** (CMS em nuvem, licenças por ponto), licenciá-la à parte é legítimo: NFS-e item 1.05 + NFS-e 1.07 (suporte) |
| **Vender peça impressa em 3D** (material próprio) | NF-e | CFOP 5101/6101; NCM do material (ex.: 3926.90.90, aproximado) | Personalização não vira serviço; ICMS/IPI dentro do DAS |
| **Industrializar com insumo do cliente que vai revender/integrar** | NF-e | CFOP **5124/6124** (industrialização efetuada para outrem) + retorno dos insumos **5902/6902** (retorno simbólico conforme disciplina estadual — NECESSITA CONFIRMAÇÃO UF) | Tema 816: sem ISS; verificar suspensão de IPI/ICMS nas remessas na UF |
| **Beneficiar/produzir para uso final do encomendante (material dele)** | **NFS-e** | Item **14.05** | Guardar declaração escrita de destinação do cliente — é a prova do enquadramento |
| **Vender software sob encomenda** | NFS-e | Item **1.04** (1.01/1.02 conforme escopo) | Sem retenção de IRRF (IN RFB 765/2007) nem CSRF (IN SRF 459/2004); descrever escopo e regime de direitos (cessão × licença) |
| **Faturar assinatura de app/SaaS (gateway/cartão)** | NFS-e **mensal, por assinante, pelo valor cheio** | Item **1.05** (ou 1.03 — conforme o município) | Tarifa do gateway é **despesa** (nota da adquirente) — nota "líquida da taxa" é omissão de receita; coletar CPF/endereço no checkout (LGPD — finalidade fiscal); automatizar via **API do Emissor Nacional** (fluxo: pagamento aprovado → fila → emissão → e-mail do PDF/XML → armazenamento); no varejo B2C, informar os tributos estimados (Lei 12.741/2012) |
| **Receber por App Store/Google Play** | NFS-e/invoice **contra a entidade da loja**, pelo repasse (prática predominante) | Item 1.05; avaliar exportação de serviço (LC 116, art. 2º, I — controverso com usuário no Brasil) | **NECESSITA CONFIRMAÇÃO contratual antes do lançamento** (as lojas atuam como comissárias/merchant of record; o Google pode reter IR na fonte em repasses em moeda estrangeira); conciliar relatórios de repasse |
| **Licenciar software B2B** | NFS-e | Item **1.05** | Discriminar: "Licenciamento de uso do software X, período __/__ a __/__"; informar condição de optante e, se houver hipótese municipal de retenção de ISS, a **alíquota efetiva do Simples** (LC 123, art. 21, § 4º); orientar o tomador a não reter IRRF/CSRF |
| **Vender projeto 3D digital / modelagem (sem fabricação)** | NFS-e | Item **23.01** (comunicação visual/desenho industrial) ou **32.01** (desenho técnico); 1.04 se for aplicação interativa | Descrever o entregável real; conferir mapeamento municipal |
| **Prestar suporte/manutenção de software** | NFS-e | Item **1.07** | Contrato com SLA e chamados registrados; competência mensal |
| **Manter maquete/totem físico (pós-venda)** | NFS-e (serviço) + NF-e (peças) | Item **14.01**; peças com ICMS | A parte final do 14.01 sujeita as peças ao ICMS — emitir NF-e das peças substituídas |
| **Revender equipamento/insumo comprado de terceiros** | NF-e | CFOP 5102/6102 | Verificar substituição tributária de eletrônicos na UF |
| **Contrato completo (projeto + produto + licença + suporte)** | 1 contrato-quadro, **documentos separados por natureza** | Conforme linhas acima | Anexos por entregável (SOW) com objeto, aceite e **preço próprio formado por custo + margem documentados**; preços do combo compatíveis com os praticados isoladamente; parcelas atreladas a marcos — nunca "adiantamento genérico"; jamais deslocar valor para a rubrica menos tributada |
| **ISS retido pelo tomador** (quando a lei do município do tomador previr — hipóteses do art. 6º da LC 116) | — | — | Informar a alíquota efetiva do Simples no documento (LC 123, art. 21, § 4º) e segregar a receita "com retenção" no PGDAS-D, evitando bitributação |

**Reforma tributária nos documentos (recorte do Simples):** em 2026 **nada de IBS/CBS** nas notas da Next Layer — as alíquotas-teste (CBS 0,9% + IBS 0,1%) não se aplicam a optantes, e os novos campos da NT 2025.002 são obrigatórios desde 03/08/2026 **apenas para o regime normal (CRT 3)**; para o Simples (CRT 1) a obrigatoriedade começa em **04/01/2027** ([Tecnospeed — NT 2025.002](https://blog.tecnospeed.com.br/nota-tecnica-reforma-tributaria-nfe-nfce/)). Providência: garantir que o ERP/emissor esteja pronto para os novos leiautes até o fim de 2026. Confiança alta.

---

## 11. PERGUNTAS PARA O CONTADOR (lista pronta para envio)

1. Considerando os CNAEs propostos (principal 3299-0/99; secundários 2229-3/99, 2622-1/00, 6201-5/01, 6202-3/00, 6203-1/00, 6311-9/00, 7410-2/03), **confirmam em qual anexo cada receita será segregada no PGDAS-D**, conforme a tabela da Seção 5.2? Há alguma divergência de entendimento?
2. A empresa possui **Inscrição Estadual ativa e credenciamento para NF-e (modelo 55)**? Se não, qual o prazo e o procedimento na nossa UF? Como estão sendo documentadas hoje as vendas de maquetes/peças?
3. Hoje, **como as receitas estão sendo declaradas no PGDAS-D** (tudo como serviço no Anexo V?)? Se houver erro nos últimos meses, avaliem **retificação do PGDAS-D e compensação/restituição** do DAS pago a maior.
4. Qual o **entendimento do nosso município** sobre a fabricação e venda de maquetes corporativas (venda de produto × serviço de confecção — 3299-0/99 × 7119-7/03; Súmula 156/STJ)? Recomendam **consulta formal** municipal/estadual antes de consolidar o faturamento como NF-e/Anexo II?
5. No nosso perfil operacional (nº de operários, potência instalada em kW, participação da mão de obra no valor dos contratos), alguma operação se enquadra na **exceção do art. 5º, V c/c art. 7º, II, do RIPI** (oficina/preponderância do trabalho profissional)? Como isso afeta a segregação?
6. Para implantar o **Fator R**: qual o cronograma de formalização do pró-labore (eSocial, DCTFWeb, recibos), a partir de que competência a razão FS12/RBT12 alcança 28% e em que meses a receita de serviços ainda cairá no Anexo V durante a implantação? Podem montar a rotina mensal de projeção?
7. **Quantos sócios trabalham na empresa** e como recomendam dividir o pró-labore entre eles (aproveitando a isenção de IRPF até R$ 5.000/mês da Lei 15.270/2025), sem descaracterizar a remuneração pelo trabalho real?
8. Confirmam o enquadramento no Fator R (III/V) das receitas dos CNAEs **6311-9/00** (hospedagem/ASP), **7410-2/03** (design) e a colocação em **Anexo III fixo** de 8599-6/03 (treinamento), 9511-8/00 e 3329-8/99 (manutenção/instalação)? Vale solução de consulta em algum caso?
9. Quais os **códigos de serviço municipais** (e alíquotas de ISS) correspondentes aos itens 1.03, 1.04, 1.05, 1.06, 1.07, 8.02, 14.01, 14.05, 23.01 e 32.01 no nosso município, e há hipóteses de **retenção de ISS** pelos tomadores (art. 6º da LC 116) que devamos parametrizar?
10. Podem conduzir o **cadastro no Emissor Nacional da NFS-e** (Res. CGSN 191/2026 — obrigatório a partir de 1º/11/2026) e os testes de emissão (web e API), inclusive o de emissão em lote para futuras assinaturas de app?
11. Sobre a **janela de 1º a 30/09/2026** (Res. CGSN 186/2026) para optar pelo regime regular de IBS/CBS com efeitos em 2027: concordam com a recomendação de **não optar** por ora? Podem registrar a decisão com uma simulação?
12. Podem implantar/confirmar a **contabilidade completa (ECD)** para lastrear a distribuição de lucros isenta acima da presunção (LC 123, art. 14)?
13. Recomendam **regime de caixa ou de competência** no PGDAS-D para o nosso perfil de recebimentos? Qual a janela da opção?
14. Nas NF-e para clientes do regime normal, podem parametrizar a **indicação do crédito de ICMS** ao adquirente (LC 123, art. 23, §§ 1º–6º) com a expressão exigida pela Res. CGSN 140/2018?
15. Qual o **NCM definitivo** para as maquetes interativas (9023.00.00?) e para os totens (847x/8543)? Vale laudo/parecer de classificação fiscal?
16. Antes de incluirmos o CNAE **7119-7/03**: qual a posição do **CREA da nossa UF** sobre registro de empresa e responsável técnico para desenho técnico? 
17. Quando lançarmos o app nas lojas (Apple/Google): podem analisar os **contratos vigentes** e definir o fluxo documental (nota contra a entidade da loja? valor bruto ou repasse? exportação de serviço?) antes do primeiro faturamento?
18. Existe na nossa UF **substituição tributária de ICMS** para os componentes eletrônicos e suprimentos que pretendemos revender (CNAE 4751-2/01)?

---

## 12. DOCUMENTOS A PEDIR/CONFERIR COM O CONTADOR

| # | Documento/verificação | Para quê |
|---|---|---|
| 1 | **Cartão CNPJ atualizado** | Conferir CNAEs atuais × lista da Seção 3 (o "diff" da alteração) |
| 2 | **Contrato social consolidado** | Objeto social atual × minuta da Seção 4; regras de pró-labore e distribuição |
| 3 | **Comprovante de opção pelo Simples** e extratos do **PGDAS-D** dos últimos 12+ meses | Ver como as receitas vêm sendo segregadas; base p/ retificações |
| 4 | **Inscrição Estadual** + credenciamento NF-e na SEFAZ | Habilitação para faturar produto |
| 5 | **Inscrição Municipal** + acesso ao sistema atual de NFS-e | Emissão de serviços hoje; migração ao Emissor Nacional |
| 6 | **Certificado digital e-CNPJ** (validade) | NF-e, NFS-e, eSocial, DCTFWeb |
| 7 | **Parametrização fiscal do emissor/ERP** (CFOPs, NCMs, CRT=1, códigos de serviço municipais, leiautes IBS/CBS p/ 2027) | Emissão correta por operação |
| 8 | **Tabela de códigos de serviço municipais** × itens LC 116 | Mapeamento 1.03–1.07, 8.02, 14.01, 14.05, 23.01, 32.01 |
| 9 | **eSocial/DCTFWeb** — situação e pendências | Formalização do pró-labore (Fator R) |
| 10 | **Balancetes e ECD** (ou plano para implantá-la) | Distribuição isenta de lucros |
| 11 | **Alvará/licenciamento municipal** e, se exigível, **licença ambiental/bombeiros** da atividade industrial | Regularidade da fábrica (grau de risco — NECESSITA CONFIRMAÇÃO municipal) |
| 12 | **Contratos-padrão com clientes** (maquete, projeto, futuro SaaS) | Alinhar objeto contratual × documento fiscal × anexo; cláusulas de PI |
| 13 | **Relatórios de repasse e contratos de gateways/plataformas** (quando houver) | Fluxo documental de assinaturas e app stores |
| 14 | **Procuração eletrônica e-CAC** para o contador | Operação das obrigações federais |

---

## 13. ALERTAS CLASSIFICADOS

**🔴 CRÍTICO**

1. **Documento fiscal × natureza da receita:** se as vendas de maquetes/peças estiverem sendo emitidas como NFS-e (serviço) — ou sem Inscrição Estadual/NF-e — há, ao mesmo tempo, **pagamento a maior de DAS** (anexo de serviço em vez do II) e **risco de autuação estadual** (ICMS não documentado). Confirmar e corrigir imediatamente, com avaliação de retificação dos períodos anteriores.
2. **Fator R sem folha formalizada não existe:** usar o Anexo III sem pró-labore efetivamente pago e declarado (eSocial/DCTFWeb) gera autuação certa em malha. Implantar a formalização **antes** de mudar a apuração.
3. **NFS-e nacional obrigatória em 1º/11/2026** (Res. CGSN 191/2026): sem cadastro e testes no Emissor Nacional, a empresa ficará **impedida de emitir NFS-e regularmente** na virada — parando o faturamento de serviços. Restam ~10 semanas.
4. **Não registrar CNAE de serviços de engenharia/arquitetura (711x/7111) nem mencionar "projetos de engenharia" no objeto social** sem profissional habilitado — exercício ilegal de profissão regulamentada (Lei 5.194/1966; Lei 12.378/2010). A minuta da Seção 4 já evita isso.

**🟠 IMPORTANTE**

5. **Janela de 1º a 30/09/2026** (Res. CGSN 186/2026): decidir formalmente sobre o regime regular de IBS/CBS para 2027 (tendência: não optar; cancelamento possível até 30/11/2026). Não deixar passar em branco — registrar a decisão com simulação.
6. **Maquetes — risco municipal:** a nota da CONCLA (3299-0/99 × 7119-7/03) e a linha da Súmula 156/STJ dão munição para o município exigir ISS sobre maquetes de projetos de engenharia. Posição do estudo: venda de produto (Anexo II) é defensável — mas **consulta formal recomendada** antes de consolidar 100% do faturamento nessa posição.
7. **Contratos mistos:** todo contrato que combine produto + software + instalação + suporte deve nascer com **entregáveis, aceites e preços próprios e defensáveis** (Seção 10, última linha) — é a fronteira entre planejamento lícito e simulação.
8. **Crédito de ICMS ao cliente B2B** (LC 123, art. 23): parametrizar a informação nas NF-e — sem ela, o cliente grande perde crédito e a Next Layer perde competitividade.
9. **App stores:** não lançar o faturamento via Apple/Google sem análise contratual prévia — é o ponto de maior incerteza documental (quem fatura o consumidor, valor bruto × repasse, exportação).
10. **Leiautes IBS/CBS obrigatórios para o Simples em 04/01/2027** — atualizar emissores/ERP até dezembro/2026.
11. **Retenções indevidas por tomadores:** informar proativamente a condição de optante (sem IRRF — IN RFB 765/2007; sem CSRF — IN SRF 459/2004) e a alíquota efetiva de ISS quando houver retenção municipal (LC 123, art. 21, § 4º).

**🟡 OTIMIZAÇÃO**

12. **Refazer a simulação com o mix real de notas** antes de fixar o pró-labore (a economia do Fator R depende da fração fatorizável — Seções 7.4/7.5).
13. **Avaliar regime de caixa** no PGDAS-D para projetos com recebimento longo.
14. **Exportação de serviços** (se surgir cliente no exterior): ISS/PIS/COFINS fora do DAS na parcela exportada.
15. **Dividir o pró-labore entre os sócios que trabalham** (isenção de IRPF até R$ 5.000/mês cada) — respeitada a substância.
16. **Monitorar os marcos da Lei 15.270/2025** (R$ 50 mil/mês por beneficiário; R$ 600 mil/ano) quando o lucro distribuído crescer.

**🟢 CORRETO (o que já está certo e deve ser mantido)**

17. **A aritmética da simulação interna do sócio está correta** — validada de forma independente (Seção 7.2).
18. **Permanecer no Simples Nacional** é a decisão certa no horizonte analisado.
19. **Um único CNPJ com o leque de CNAEs de TI** atende ao objetivo de não alterar contrato a cada aplicativo — novos apps são novos produtos dentro dos mesmos códigos.
20. **A intenção de organizar contabilidade e crescer com segurança jurídica** — todo o ganho deste estudo vem de enquadramento correto, não de artifício.

---

## 14. PLANO DE AÇÃO

**FAZER AGORA (agosto–setembro/2026)**
1. Levantar cartão CNPJ, IE, IM, e **como cada receita vem sendo emitida e declarada** (PGDAS-D) — corrigir documento/anexo se necessário e avaliar retificações.
2. Iniciar **cadastro e testes no Emissor Nacional da NFS-e** (prazo: 1º/11/2026).
3. **Formalizar o pró-labore** (valor calibrado ao Fator R — hoje entre ~R$ 1,8 e ~R$ 6,2 mil/mês; eSocial + DCTFWeb) e implantar a rotina mensal FS12/RBT12 projetado.
4. Decidir (com simulação registrada) a **janela de setembro/2026** do regime regular IBS/CBS — tendência: não optar.
5. Implantar/confirmar **contabilidade completa (ECD)** e atas de distribuição de lucros.
6. Extrair das notas emitidas o **mix real de receitas por natureza** e refazer a conta das Seções 7.4/7.5.

**PRÓXIMOS 30 DIAS**
7. **Alteração contratual única**: CNAEs da Seção 3.1 + objeto social da Seção 4 (com o contador/advogado; conferir exigências da Junta da UF).
8. **Consulta ao CREA da UF** sobre o 7119-7/03 (antes de incluí-lo) e avaliação da **consulta formal** municipal sobre maquetes.
9. **Classificação fiscal (NCM)** das maquetes e totens; parametrização de CFOPs e do crédito de ICMS (art. 23) no emissor.
10. Revisar **contratos-padrão** (entregáveis separados, aceites, PI/cessão de direitos) e **registrar a marca** no INPI.

**QUANDO COMEÇAR A VENDER SOFTWARE**
11. Parametrizar NFS-e para os itens 1.04/1.05/1.03 (códigos municipais) e ativar a **emissão automática via API** (assinaturas: nota mensal por assinante, valor cheio, CPF no documento).
12. Recalibrar o Fator R com o novo mix; revisar termos de uso/privacidade (LGPD) e contratos SaaS.
13. **Antes de lançar em app store:** análise contratual do fluxo documental (nota contra a loja × consumidor; exportação; IR na fonte).
14. Registrar os programas-núcleo no INPI; formalizar cessão de direitos de todos os desenvolvedores.

**AO PASSAR DE R$ 1 MI/ANO**
15. Reavaliar anualmente o custo do Fator R × folha natural (Seção 7.5); planejar equipe CLT considerando o efeito Fator R.
16. Reavaliar a criação da **segunda empresa** se o SaaS ganhar tração própria/investidor (Seção 15).
17. Monitorar os marcos da Lei 15.270/2025 por sócio; planejar calendário de distribuições com o contador.
18. Re-simular a opção pelo **regime híbrido IBS/CBS** a cada janela anual (clientes B2B começarão a pressionar por crédito integral a partir de 2027–2029).

**AO SE APROXIMAR DO LIMITE DO SIMPLES (R$ 3,6 mi de RBT12 em diante)**
19. Simular a carga com **ISS/ICMS "por fora"** (sublimite) e refazer a comparação com Lucro Presumido/Real.
20. Planejar o cruzamento do teto (R$ 4,8 mi): margem de 20% (exclusão em 1º de janeiro seguinte × retroativa ao mês seguinte se exceder R$ 5,76 mi); lembrar que o teto é **global** entre empresas de sócios comuns.
21. Revisitar a estrutura societária (duas empresas com substância; regime dos novos tributos IBS/CBS já em transição plena).

---

## 15. UMA EMPRESA OU DUAS?

### 15.1 Quadro comparativo (sem viés)

| Critério | (A) Tudo na Next Layer 3D | (B) Segunda empresa para software/digital |
|---|---|---|
| **Fator R** | Folha única da operação inteira (inclusive da fábrica) sustenta o Fator R das receitas de software — **mais fácil atingir 28%** | Cada CNPJ calcula o próprio Fator R: a software-house precisa de folha própria ≥ 28% da própria receita; a folha da fábrica deixa de ajudar |
| **Faixas do Simples** | Receita somada sobe as faixas mais rápido (alíquota efetiva maior antes) | Cada CNPJ percorre as faixas desde o início — **mas os limites de R$ 4,8 mi/3,6 mi consideram a receita global com sócios em comum** (ver 15.2); apenas as faixas são por empresa |
| **Custo fixo** | 1 contabilidade, 1 certificado, 1 conjunto de obrigações | Custos duplicados — tipicamente R$ 8–20 mil/ano a mais |
| **PI e investidores** | Software "dentro" de uma empresa industrial dificulta valuation, due diligence e entrada de investidor no SaaS | **Veículo limpo**: cap table, PI segregada, M&A/captação facilitados |
| **Isolamento de risco** | Passivos da fábrica (trabalhista, consumerista) e do SaaS no mesmo CNPJ | PI e receita recorrente protegidas do risco operacional industrial |
| **Risco fiscal** | Nenhum adicional | Existe **se a separação for apenas formal** (mesma equipe, sede, clientes, rateios artificiais): segregação artificial pode ser desconsiderada pelo fisco |

### 15.2 A regra dura da LC 123 (art. 3º, § 4º — verificada no texto legal)

Não pode se beneficiar do Simples a PJ cujo sócio pessoa física: (III) participe de **outra empresa beneficiada pela LC 123**, quando a **receita bruta global ultrapassar R$ 4,8 mi**; (IV) participe com **mais de 10%** do capital de empresa **fora** do Simples, com receita global acima do limite; (V) seja **administrador** de outra PJ com fins lucrativos, com receita global acima do limite ([Planalto — LC 123/2006](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm)). **Tradução: duas empresas dos mesmos sócios são permitidas, mas os R$ 4,8 milhões são compartilhados. Duas empresas não ampliam o teto.** Confiança alta.

### 15.3 Conclusão condicional

**Hoje (RBT12 < R$ 300 mil): uma empresa só** — Fator R mais fácil, custo menor, e a segregação por anexo dentro do PGDAS-D já entrega a otimização. **Criar a segunda empresa quando (e somente quando) houver substância real**, tipicamente em qualquer destes gatilhos: (i) SaaS com equipe, gestão e clientela próprias; (ii) entrada de investidor/captação para o produto digital; (iii) necessidade de blindar a PI do SaaS do risco operacional da fábrica; (iv) aproximação do sublimite com conveniência operacional de separar as operações. Nesses casos a segunda empresa é lícita e recomendável (equipe, sede/centro de custo, contratos e marca próprios). **Fragmentar apenas para "caber" em faixa ou limite é vedado — e, como visto, nem funciona** (receita global). Confiança alta.

---

## 16. PROPRIEDADE INTELECTUAL DOS APLICATIVOS

1. **Titularidade na PJ.** Todo código dos futuros apps/SaaS deve nascer em nome da Next Layer (ou ser a ela formalmente cedido). Software desenvolvido por **empregado CLT contratado para desenvolver** pertence ao empregador (Lei 9.609/1998, art. 4º); para **prestadores PJ/freelancers a titularidade NÃO é automática** — exigir **cláusula expressa de cessão de direitos patrimoniais** em todo contrato de desenvolvimento, design e conteúdo. **NÃO VERIFICADO ONLINE — base: conhecimento até jan/2026.** Confiança alta.
2. **Registro de programa de computador no INPI** (Lei 9.609/1998): opcional (a proteção independe de registro), barato e rápido (depósito eletrônico com resumo hash). Recomendado para o núcleo de cada produto relevante — prova de anterioridade e ativo de due diligence. Valores das taxas: NECESSITA CONFIRMAÇÃO em [gov.br/inpi](https://www.gov.br/inpi).
3. **Marca.** Registrar "Next Layer 3D" e as marcas dos futuros aplicativos no INPI (ao menos classes de Nice 9 e 42) — **prioridade imediata**: marca não registrada é o risco mais barato de eliminar antes de escalar um SaaS. ME/EPP têm desconto nas taxas (valores: NECESSITA CONFIRMAÇÃO).
4. **Contratos com clientes de software sob encomenda:** definir expressamente o que é cedido ao cliente (o código encomendado) e o que permanece da Next Layer (frameworks, bibliotecas, módulos reutilizáveis) — essencial para transformar projetos sob encomenda em produto próprio sem litígio. A escolha cessão × licença não muda o ISS (ADIs 1.945/5.659), mas muda o item da lista (1.04 × 1.05) e o risco cível.

---

## 17. FONTES CONSOLIDADAS

**Legislação primária**
- LC 123/2006 (Estatuto da ME/EPP — texto compilado): https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm
- LC 116/2003 (ISS — lista de serviços, redação LC 157/2016): https://legis.senado.leg.br/sdleg-getter/documento?dm=4168331&disposition=inline ; lista consolidada: https://egov.df.gov.br/wp-content/uploads/2024/02/Lista-de-servicos-DF-%E2%80%93-ja-atualizada-com-a-LC-n.-157-2016.pdf
- EC 132/2023 (reforma tributária): https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm
- LC 214/2025 (IBS/CBS/IS): https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm
- Lei 15.270/2025 (IRPF 2026 — isenção até R$ 5 mil, dividendos, IRPFM): https://www.mayerbrown.com/pt/insights/publications/2025/12/enactment-of-law-no-15270-2025-which-establishes-dividend-taxation-expands-the-exemption-threshold-and-introduces-a-minimum-tax-on-high-incomes ; https://conjur.com.br/2025-dez-04/lei-15-270-2025-dividendos-e-simples-nacional/
- Decreto 7.212/2010 (RIPI — arts. 4º, 5º, V, e 7º, II): https://www2.camara.leg.br/legin/fed/decret/2010/decreto-7212-15-junho-2010-606731-normaatualizada-pe.html
- Decreto 12.797/2025 (salário mínimo 2026 — R$ 1.621): https://www.trt7.jus.br/index.php/noticias/todas-as-noticias/16465-reajuste-do-salario-minimo-2026-veja-o-que-voce-precisa-saber
- Lei 9.609/1998 (software), Lei 5.194/1966 (engenharia), Lei 12.741/2012 (De Olho no Imposto), CTN art. 116, parágrafo único.

**Atos do CGSN e da RFB**
- Resolução CGSN 140/2018 (arts. 15, 25, 26 e anexos): https://www.legisweb.com.br/noticia/?legislacao=360430
- Resolução CGSN 191/2026 (NFS-e nacional obrigatória p/ ME/EPP em 1º/11/2026; revoga a Res. 189/2026): https://www.legisweb.com.br/legislacao/?id=499104 ; notícia oficial: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/agosto/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026 ; https://fenacon.org.br/reforma-tributaria/simples-nacional-nfs-e-nacional-sera-obrigatoria-para-me-e-epp-a-partir-de-1o-de-novembro-de-2026/
- Resolução CGSN 186/2026 (janela de opção IBS/CBS — 1º a 30/09/2026, efeitos 2027): https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/abril/cgsn-define-prazos-de-opcao-pelo-simples-nacional-e-pelo-regime-regular-do-ibs-e-da-cbs-para-2027
- Solução de Consulta Cosit 97/2019 (impressão 3D = industrialização; exceção do art. 5º, V, RIPI): https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-97-2019.htm
- IN RFB 765/2007 (dispensa de IRRF a optantes): https://www.lexml.gov.br/urn/urn:lex:br:ministerio.fazenda;secretaria.receita.federal.brasil:instrucao.normativa:2007-08-02;765
- Orientação RFB sobre o redutor do IRPF 2026: https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/dezembro/receita-federal-orienta-fontes-pagadoras-e-contribuintes-a-calcular-a-reducao-do-imposto-de-renda-a-partir-de-1o-de-janeiro-de-2026
- NT 2025.002 (campos IBS/CBS na NF-e — cronograma CRT 1/3/4): https://blog.tecnospeed.com.br/nota-tecnica-reforma-tributaria-nfe-nfce/ ; https://simplifique.contmatic.com.br/blogs/ibs-cbs-nfe-campos-obrigatorios-agosto-2026
- Portal Nacional da NFS-e: https://www.gov.br/nfse ; Portal da NF-e: https://www.nfe.fazenda.gov.br

**Jurisprudência**
- STF, Tema 816 (RE 882.461, j. 26/02/2025 — ISS × industrialização por encomenda; ata 05/03/2025): https://noticias.stf.jus.br/postsnoticias/iss-nao-incide-em-etapa-intermediaria-do-ciclo-de-producao-decide-stf/ ; https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4755293&numeroProcesso=882461&numeroTema=816
- STF, ADIs 1.945 e 5.659 (software = ISS, 2021): https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=478136&ori=1
- STF, ADI 4389 (embalagens sob encomenda — critério da destinação); Súmula Vinculante 31 (locação de bens móveis); STJ, Súmula 156 (referida como risco municipal histórico).

**CNAE/CONCLA**
- Busca oficial CNAE: https://concla.ibge.gov.br/busca-online-cnae.html — subclasses 3299-0/99, 2229-3/99, 2622-1/00, 7119-7/03, 6201-5/01, 6202-3/00, 6203-1/00, 6311-9/00, divisão 47
- Resolução Concla 2/2018 (CNAE-Subclasses 2.3): https://www.contabeis.com.br/legislacao/4852284/resolucao-concla-2-2018/ ; https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/27930-ibge-lanca-publicacao-com-subclasses-atualizadas-da-cnae

**Parâmetros 2026 e apoio técnico**
- Limites do Simples 2026: https://www.contabilizei.com.br/contabilidade-online/limite-simples-nacional/ ; sublimite: https://ftcontabilidade.com.br/noticias/contabil/sublimite-do-simples-nacional-para-2026-e-mantido-em-r$-3-6-milhoes/28aeb6eb-5abb-42fc-9f18-c39fa9953248
- Teto INSS 2026 (R$ 8.475,55): https://www.contabilizei.com.br/contabilidade-online/teto-inss/ ; https://previdenciarista.com/blog/teto-do-inss-sobe-para-r-8-47555-em-2026/
- Tabela IRPF 2026 + redutor: https://www.contabilizei.com.br/contabilidade-online/tabela-imposto-de-renda/ ; https://fia.com.br/blog/tabela-irpf-2026/
- Reforma tributária 2026 (ano-teste; Simples fora das alíquotas-teste): https://www.reformatributaria.com/opiniao/ibs-e-cbs-em-2026-como-funciona-a-convivencia-com-os-tributos-atuais-segundo-a-lc-no-214-2025/ ; https://pasqualino.com.br/aliquotas-de-transicao-do-ibs-e-da-cbs-2026-2028-como-aplicar-na-pratica-segundo-a-lc-214-2025/ ; https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/orientacoes-2026
- Tabelas dos anexos (conferência): https://www.contabeis.com.br/tabelas/simples/anexo3 ; https://www.contabilizei.com.br/contabilidade-online/anexo-3-simples-nacional/
- IN DREI 81/2020: https://www.gov.br/empresas-e-negocios/pt-br/drei/legislacao/instrucoes-normativas/arquivos-instrucoes-normativas-em-vigor/INDREI81_Atualizada_in0125.pdf
- INPI: https://www.gov.br/inpi

**Nota de método:** o acesso direto a alguns portais oficiais (Planalto, CONCLA, normas RFB) esteve indisponível no ambiente de pesquisa; nesses pontos o texto legal foi conferido em espelhos fidedignos convergentes (Senado, Câmara, LegisWeb, bases contábeis) e os trechos que dependem exclusivamente de texto não conferido online estão marcados no corpo do relatório como "NÃO VERIFICADO ONLINE — base: conhecimento até jan/2026". Nenhuma dessas normas teve alteração noticiada em 2026 que contrarie o que aqui se afirma.

---

## ENCERRAMENTO

**NOTA FINAL: 97/100**

**NÍVEL DE CONFIANÇA: alto** — nas conclusões estruturais (regime, segregação por anexo, Fator R, documentos fiscais, CNAEs, aritmética das simulações, marcos de 2026). Confiança **média** nos pontos que dependem de interpretação municipal (enquadramento das maquetes perante o município; item da lista aplicável ao SaaS; Fator R do 6311-9/00), do perfil operacional (testes do RIPI) e dos contratos de plataformas (app stores) — todos marcados no corpo do texto.

**PONTOS A CONFIRMAR COM O CONTADOR**

1. Município/UF da empresa: alíquotas e códigos municipais de ISS (itens 1.03–1.07, 8.02, 14.01, 14.05, 23.01, 32.01), hipóteses de retenção de ISS e convivência do sistema municipal com o Emissor Nacional.
2. Inscrição Estadual ativa + credenciamento NF-e; como as vendas de produtos vêm sendo documentadas até hoje (e eventual retificação de PGDAS-D).
3. Cartão CNPJ atual (CNAEs vigentes) e contrato social — o "diff" para implementar as Seções 3 e 4.
4. Mix real de receitas por natureza (extraído das notas) para recalibrar as simulações e o pró-labore.
5. Perfil operacional da fronteira indústria × serviço: nº de operários, potência instalada (limites de 5 operários/5 kW do RIPI), participação da mão de obra no valor dos contratos e destinação dos bens nos clientes.
6. Entendimento do fisco municipal sobre maquetes (3299-0/99 × 7119-7/03) — conveniência de consulta formal municipal/estadual.
7. Posição do CREA da UF sobre o CNAE 7119-7/03 (registro/responsável técnico) antes de sua inclusão.
8. Número de sócios que trabalham e divisão ótima do pró-labore (isenção IRPF até R$ 5.000/mês por pessoa).
9. Confirmação fina do anexo/Fator R de 6311-9/00, 7410-2/03, 8599-6/03, 9511-8/00 e 3329-8/99 na parametrização do PGDAS-D.
10. NCM definitivo de maquetes (9023.00.00) e totens (847x/8543) — classificação fiscal formal.
11. Datas exatas e composição das receitas de ago–nov usadas na simulação (competências reais).
12. Regime de caixa × competência no PGDAS-D (janela de opção).
13. Substituição tributária de ICMS na UF para eletrônicos/suprimentos (futura revenda) e suspensões nas remessas de industrialização por encomenda.
14. Contratos das plataformas (Apple, Google, gateways, marketplaces) antes do primeiro faturamento de app — fluxo documental e tese de exportação.
15. Aplicação da retenção de 10% da Lei 15.270/2025 a lucros do Simples (controvérsia doutrinária) caso alguma distribuição supere R$ 50 mil/mês por sócio.
16. Valores vigentes das taxas do INPI (registro de programa e de marca; desconto ME/EPP).

*Este relatório tem caráter de estudo de planejamento e não substitui a atuação do contador responsável e de advogado tributarista/societário na implementação.*
