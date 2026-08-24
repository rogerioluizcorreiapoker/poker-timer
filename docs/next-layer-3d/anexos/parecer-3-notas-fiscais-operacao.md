# NEXT LAYER 3D — Parecer Técnico de Notas Fiscais e Operação Contábil

**Agente 3 — Especialista em NFS-e, NF-e, Simples Nacional, software, indústria e serviços digitais**
**Data de referência: 24 de agosto de 2026** — toda a análise reflete a legislação vigente nesta data; regras futuras estão expressamente sinalizadas como tal.

> **Advertência de escopo:** Município e UF da empresa **não foram informados**. Tudo que depende de legislação municipal (alíquota de ISS, código de serviço municipal, retenção na fonte, regime especial de emissão) ou estadual (Inscrição Estadual, regras de ICMS, benefícios) está marcado **NECESSITA CONFIRMAÇÃO**. Este parecer não propõe qualquer forma de sonegação, fragmentação artificial de receitas ou documentos sem substância econômica — apenas organização lícita da operação.

---

## 1. Sumário executivo

1. A Next Layer 3D é, na prática, **três negócios em um**: (i) **indústria** (fabricação de maquetes, peças e totens — NF-e, ICMS/IPI, Anexo I/II do Simples); (ii) **serviços técnicos e criativos** (projetos, modelagem 3D, beneficiamento — NFS-e, ISS, Anexo III ou V); (iii) **software/digital** (desenvolvimento, licenciamento, SaaS — NFS-e, ISS, Anexo V ou Anexo III com Fator R ≥ 28%). Cada receita precisa ser **segregada por natureza no PGDAS-D** (Resolução CGSN 140/2018, art. 25).
2. **Software é ISS, nunca ICMS**, inclusive SaaS e software "de prateleira" — STF, ADIs 1945 e 5659 (julgadas em 18-24/02/2021). Isso dá segurança para todo o plano digital da empresa ser faturado por NFS-e.
3. **Industrialização por encomenda em etapa intermediária da cadeia é ICMS/IPI, não ISS** — STF, Tema 816 (RE 882.461, julgado em 26/02/2025, trânsito em julgado em 2025). O item 14.05 da LC 116/2003 só sobrevive quando o encomendante é **usuário final** do objeto. Para impressão 3D sob encomenda, a pergunta decisiva passou a ser: **"o que o cliente vai fazer com a peça?"**
4. **NFS-e de padrão nacional**: em agosto/2026 a emissão pelo Emissor Nacional ainda **não** é obrigatória para ME/EPP, mas **será a partir de 1º/11/2026** (Resolução CGSN 191/2026, que prorrogou o prazo de 1º/09/2026 da Resolução CGSN 189/2026). A empresa deve migrar/integrar-se ao Emissor Nacional (web ou API) **agora** — isso resolve, de quebra, a emissão em massa para assinaturas de app (Cenário 4).
5. **Reforma tributária em 2026**: para optante do Simples, os novos campos de IBS/CBS na NF-e são de preenchimento **facultativo até 04/01/2027** (NT 2025.002); as alíquotas-teste de 2026 (CBS 0,9% + IBS 0,1%) **não se aplicam** a optantes do Simples. Nada de destaque de IBS/CBS em 2026 para a Next Layer — mas o ERP/emissor precisa estar pronto para 2027.
6. Os números simulados pelo sócio foram **refeitos e conferem**: Anexo V = R$ 41.452 (efetivas 15,50%–16,32%); Anexo III com Fator R = R$ 17.209 (efetivas 6,00%–7,70%); pró-labore mínimo para o Fator R entre R$ 1.820 e R$ 6.247,50/mês nos RBT12 informados. A arbitragem Fator R só vale para as **receitas de serviço/software**; a receita industrial vai ao Anexo II independentemente de folha.
7. Risco central a governar: **contratos mistos** (maquete + software + instalação + suporte). A separação de documentos é legítima quando cada parcela tem objeto, preço e utilidade autônomos e com preços defensáveis; é artificial quando desloca valor de um produto único para a rubrica menos tributada. A seção de cada cenário define a fronteira.

---

## 2. Fundamentos verificados

### 2.1 NF-e × NFS-e e o estágio da NFS-e nacional em agosto/2026

| Documento | Natureza | Exigências | Situação ago/2026 |
|---|---|---|---|
| **NF-e (modelo 55)** | Nacional, para **circulação de mercadorias** (venda de produto, industrialização, remessas) | Exige **Inscrição Estadual (IE)** e credenciamento na SEFAZ da UF; certificado digital | Plenamente vigente; leiaute em atualização pela NT 2025.002 (IBS/CBS) |
| **NFS-e** | Municipal, para **serviços** (ISS) | Inscrição municipal; até hoje cada município tinha seu sistema | Em transição para o **padrão nacional** |

Estágio da **NFS-e de padrão nacional** em agosto/2026:

- **MEI**: já obrigado a emitir NFS-e pelo Emissor Nacional desde 01/09/2023 (Resolução CGSN 169/2022). *NÃO VERIFICADO ONLINE nesta sessão o texto da resolução — base: conhecimento até jan/2026; fato notório e incontroverso.* **Confiança alta.**
- **ME/EPP do Simples Nacional prestadoras de serviço**: a Resolução CGSN 189/2026 (abril/2026) tornou obrigatória a emissão pelo **Emissor Nacional da NFS-e** a partir de **1º/09/2026**; foi **revogada e substituída pela Resolução CGSN 191/2026**, que **prorrogou a obrigatoriedade para 1º/11/2026**. A emissão poderá ser feita pelo **emissor web** ou por **API**. Fontes: [Receita Federal — NFS-e de padrão nacional será obrigatória para optantes do Simples Nacional](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/abril/nfs-e-de-padrao-nacional-sera-obrigatoria-para-optantes-do-simples-nacional); [Portal NFS-e — CGSN prorroga a obrigatoriedade de emissão pelo Emissor Nacional](https://www.gov.br/nfse/pt-br/noticias/comite-gestor-do-simples-nacional-prorroga-a-obrigatoriedade-de-emissao-de-notas-fiscais-de-servico-pelo-emissor-nacional-da-nfs-e); [CRC-CE — Nota Técnica sobre a Resolução CGSN 189/2026](https://www.crc-ce.org.br/2026/05/nota-tecnica-sobre-a-resolucao-cgsn-no-189-2026-e-a-obrigatoriedade-da-nfs-e-de-padrao-nacional-para-optantes-do-simples-nacional/). **Confiança alta.**
- **Consequência prática imediata**: em ago/2026 a Next Layer ainda emite NFS-e pelo sistema do seu município (**NECESSITA CONFIRMAÇÃO** de qual é), mas tem ~10 semanas para se cadastrar no Emissor Nacional, parametrizar os códigos de tributação nacional (NBS/itens LC 116) e, se for automatizar (Cenário 4), desenvolver a integração via API.

**Vigência → interpretação → confiança:** base legal Res. CGSN 189 e 191/2026; vigente a obrigação a partir de 01/11/2026; até lá, regime municipal. **Confiança alta.**

### 2.2 Tributação de software — STF, ADIs 1945 e 5659

O STF, no julgamento conjunto das **ADIs 1945 (rel. Min. Cármen Lúcia) e 5659 (rel. Min. Dias Toffoli)**, concluído em fevereiro/2021, decidiu que sobre o **licenciamento ou cessão de direito de uso de programas de computador — padronizados ("de prateleira") ou por encomenda — incide ISS (item 1.05 da lista da LC 116/2003), e não ICMS**. Houve modulação de efeitos a partir de 03/03/2021. Fontes: [STF — notícia oficial do julgamento](https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=478136&ori=1); [Conjur — STF confirma ISS sobre licenciamento de software](https://www.conjur.com.br/2021-fev-23/costa-stf-confirma-iss-licenciamento-software/). A mesma lógica é aplicada pelos municípios ao **SaaS** (enquadrado conforme o caso nos itens 1.05 ou 1.03). **Confiança alta** quanto à incidência de ISS; **confiança média** quanto ao item exato aplicável ao SaaS em cada município (varia a interpretação municipal — **NECESSITA CONFIRMAÇÃO** no município da empresa).

**Itens da lista da LC 116/2003 relevantes (grupo 1 — informática), redação vigente (LC 157/2016):**

| Item | Texto (redação vigente) |
|---|---|
| **1.01** | Análise e desenvolvimento de sistemas |
| **1.02** | Programação |
| **1.03** | Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos, páginas eletrônicas, aplicativos e sistemas de informação, entre outros formatos, e congêneres |
| **1.04** | Elaboração de programas de computadores, inclusive de jogos eletrônicos, independentemente da arquitetura construtiva da máquina em que o programa será executado, incluindo tablets, smartphones e congêneres |
| **1.05** | Licenciamento ou cessão de direito de uso de programas de computação |
| **1.06** | Assessoria e consultoria em informática |
| **1.07** | Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados |
| **1.08** | Planejamento, confecção, manutenção e atualização de páginas eletrônicas |
| **1.09** | Disponibilização, sem cessão definitiva, de conteúdos de áudio, vídeo, imagem e texto por meio da internet (streaming), respeitada a imunidade de livros, jornais e periódicos |

Fontes de conferência: [Lista LC 116/2003 atualizada com LC 157/2016 (GDF, PDF)](https://egov.df.gov.br/wp-content/uploads/2024/02/Lista-de-servicos-DF-%E2%80%93-ja-atualizada-com-a-LC-n.-157-2016.pdf); [Senado — LC 116/2003](https://legis.senado.leg.br/sdleg-getter/documento?dm=4168331&disposition=inline). O acesso direto ao Planalto foi bloqueado pela rede nesta sessão; os textos acima foram conferidos nas fontes alternativas citadas e correspondem à redação consolidada. **Confiança alta** (para 1.03, 1.04 e 1.09 o texto integral tem redação da LC 157/2016; a transcrição de 1.09 acima é resumida na parte final — conferir literalidade se for usada em contrato).

### 2.3 Industrialização por encomenda — STF, Tema 816

**Tese fixada (RE 882.461, Plenário, julgado em 26/02/2025, rel. Min. Dias Toffoli):**
1. *"É inconstitucional a incidência do ISS a que se refere o subitem 14.05 da Lista anexa à LC nº 116/03 se o objeto é destinado à industrialização ou à comercialização"*;
2. Multas moratórias limitadas a 20% do débito.

**Modulação:** eficácia **ex nunc a partir da publicação da ata do julgamento de mérito (2025)** — vedada a repetição do ISS recolhido até a véspera e vedada a cobrança de ISS pelos municípios sobre fatos anteriores; ressalvadas ações em curso. Trânsito em julgado noticiado em 2025. Fontes: [STF — notícia oficial "ISS não incide em etapa intermediária do ciclo de produção"](https://noticias.stf.jus.br/postsnoticias/iss-nao-incide-em-etapa-intermediaria-do-ciclo-de-producao-decide-stf/); [STF — Tema 816, andamento](https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4755293&numeroProcesso=882461&numeroTema=816); [TJPE/NUGEP — Tema 816](https://portal.tjpe.jus.br/web/vice-presidencia/nugep/noticias/-/asset_publisher/ycFvOoAr1XZ2/content/tema-816-stf-incid%C3%AAncia-do-issqn-em-opera%C3%A7%C3%A3o-de-industrializa%C3%A7%C3%A3o-por-encomenda-realizada-em-materiais-fornecidos-pelo-contratante-quando-referida-opera%C3%A7%C3%A3o-configura-etapa-intermedi%C3%A1ria-do-ciclo-produtivo-de-mercad-1). **Confiança alta** na tese e data; **confiança média** nos detalhes finos da modulação (ler o acórdão antes de litigar).

**O que isso significa para impressão 3D sob encomenda:**

| Situação | Destino do objeto | Tributo | Documento |
|---|---|---|---|
| Cliente industrial encomenda peças que **integrarão produto dele** ou serão **revendidas** | Etapa intermediária | **ICMS/IPI** (ISS afastado pelo Tema 816) | **NF-e** |
| Cliente encomenda peça/maquete para **uso próprio final** (decoração, showroom, P&D interno, reposição em máquina própria) | Usuário final | **ISS** possível (14.05, se material do encomendante) ou operação de venda de produto (se material próprio) | NFS-e ou NF-e conforme o caso |

### 2.4 Itens 14.05, 14.06, 23.01 e 32.01 da LC 116/2003 — textos

| Item | Texto (redação vigente) |
|---|---|
| **14.05** | Restauração, recondicionamento, acondicionamento, pintura, beneficiamento, lavagem, secagem, tingimento, galvanoplastia, anodização, corte, recorte, plastificação, costura, acabamento, polimento e congêneres **de objetos quaisquer** (redação da LC 157/2016) |
| **14.06** | Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, **exclusivamente com material por ele fornecido** |
| **23.01** | Serviços de programação e comunicação visual, desenho industrial e congêneres |
| **32.01** | Serviços de desenho técnico |

Fonte de conferência: [Lista LC 116 atualizada (GDF, PDF)](https://egov.df.gov.br/wp-content/uploads/2024/02/Lista-de-servicos-DF-%E2%80%93-ja-atualizada-com-a-LC-n.-157-2016.pdf). **Confiança alta** (14.05 conferido literalmente em fonte online; 14.06/23.01/32.01 conferidos na mesma lista consolidada).

### 2.5 Reforma tributária nos documentos fiscais em 2026 — o que vale para optante do Simples

- **NT 2025.002 (NF-e/NFC-e)** criou os grupos de IBS/CBS/IS no XML. Cronograma: preenchimento **facultativo** desde o início de 2026; **obrigatório em produção a partir de 03/08/2026 para empresas do regime normal** (CRT 3); para **Simples Nacional (CRT 1), excesso de sublimite (CRT 2) e MEI (CRT 4), a obrigatoriedade só começa em 04/01/2027**. Fontes: [Blog Simplifique/Contmatic — IBS e CBS na NF-e: campos obrigatórios em 03/08/2026](https://simplifique.contmatic.com.br/blogs/ibs-cbs-nfe-campos-obrigatorios-agosto-2026); [Tecnospeed — NT 2025.002 IBS/CBS/IS](https://blog.tecnospeed.com.br/nota-tecnica-reforma-tributaria-nfe-nfce/); [CRCBA — Fisco adia preenchimento do IBS e CBS como fator de rejeição](https://www.crcba.org.br/fisco-adia-preenchimento-do-ibs-e-cbs-nas-notas-fiscais-como-fator-de-rejeicao-mas-obrigacao-legal-permanece-a-partir-de-janeiro-de-2026/). **Confiança alta** quanto ao marco de jan/2027 para CRT 1/4 (afirmado em múltiplas fontes técnicas convergentes; a NT em si está no Portal da NF-e, cujo acesso direto foi bloqueado nesta sessão).
- **Alíquotas-teste 2026** (IBS 0,1% — art. 343; CBS 0,9% — art. 346 da LC 214/2025) **não se aplicam a optantes do Simples Nacional**; para os contribuintes do regime regular, o recolhimento de 2026 é dispensado se cumpridas as obrigações acessórias (art. 348, §§ 1º e 2º). Fontes: [LC 214/2025 — Planalto](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm) (acesso direto bloqueado nesta sessão; conteúdo confirmado em fontes secundárias); [reformatributaria.com — IBS e CBS em 2026 segundo a LC 214/2025](https://www.reformatributaria.com/opiniao/ibs-e-cbs-em-2026-como-funciona-a-convivencia-com-os-tributos-atuais-segundo-a-lc-no-214-2025/); [Pasqualino — alíquotas de transição 2026-2028](https://pasqualino.com.br/aliquotas-de-transicao-do-ibs-e-da-cbs-2026-2028-como-aplicar-na-pratica-segundo-a-lc-214-2025/). **Confiança alta.**
- **Síntese operacional para a Next Layer em 2026**: nenhum destaque de IBS/CBS é exigido em suas NF-e e NFS-e em 2026; o dever é de **preparação de sistemas** para jan/2027 e de migração ao Emissor Nacional da NFS-e (cujo leiaute nacional já contempla os grupos da reforma) até 01/11/2026.

### 2.6 Regras transversais do Simples Nacional aplicáveis à emissão

- **Segregação de receitas por natureza no PGDAS-D** (Resolução CGSN 140/2018, arts. 25 e seguintes): receita industrial → **Anexo II**; revenda de mercadorias → **Anexo I**; serviços de instalação/manutenção/beneficiamento → **Anexo III**; serviços intelectuais/técnicos e software → **Anexo V**, deslocando-se para o **Anexo III quando Fator R ≥ 28%** (LC 123/2006, art. 18, §§ 5º-D, 5º-I, 5º-J e 5º-M). *Base: LC 123/2006 (Planalto inacessível nesta sessão; regra estável desde a LC 155/2016).* **Confiança alta.**
- **Retenções sobre pagamentos a optante do Simples**: em regra **não** há retenção de IRRF (IN RFB 765/2007) nem de CSLL/PIS/COFINS — CSRF (IN RFB 459/2004, art. 3º, § 2º, II) sobre serviços pagos a optantes; a exceção relevante é o **ISS retido na fonte** quando a legislação do município do tomador assim prever nos casos do art. 6º da LC 116/2003 — nesse caso a retenção usa a **alíquota efetiva do Simples informada no corpo da nota** (LC 123/2006, art. 21, § 4º). *NÃO VERIFICADO ONLINE nesta sessão os textos das INs — base: conhecimento até jan/2026; regras estáveis.* **Confiança alta** (IRRF/CSRF), **alta** (mecânica do ISS retido), **NECESSITA CONFIRMAÇÃO** para cada município de tomador relevante.
- **INSS retido (11%)**: só em cessão de mão de obra/empreitada de atividades específicas — não é o caso das operações analisadas. **Confiança média-alta.**
- **Documentos**: a NF-e/NFS-e de optante deve conter a indicação de ME/EPP optante do Simples e não destaca ICMS/ISS "por dentro" para crédito do cliente (salvo ICMS-ST e hipóteses próprias); no campo CRT da NF-e usar **CRT = 1**.
- **Pré-requisitos cadastrais**: para emitir NF-e a empresa precisa de **Inscrição Estadual** ativa com CNAE industrial/comercial; para NFS-e, **inscrição municipal**. **NECESSITA CONFIRMAÇÃO** se a Next Layer já possui IE — sem ela, hoje, qualquer venda de maquete/peça como "produto" está sendo documentada de forma errada.

---

## 3. Os 10 cenários

### CENÁRIO 1 — Maquete industrial completa por R$ 120.000 (projeto + fabricação + impressão 3D + eletrônica + software + instalação)

**Qualificação jurídica.** O cliente contrata um **resultado**: a maquete funcionando instalada. Quando a Next Layer fabrica com **material próprio** e entrega coisa nova, a obrigação é **de dar** (venda de produto industrializado por ela), ainda que sob especificações do cliente — a personalização não transforma indústria em serviço quando o núcleo do contrato é a entrega do bem. O projeto, a eletrônica embarcada, o software embarcado e a instalação são, em regra, **etapas ou acessórios** da fabricação.

**Tratamento recomendado (regra geral):**
- **Documento**: **NF-e única de venda de produção do estabelecimento** — CFOP **5101** (dentro da UF) / **6101** (interestadual); NCM aproximado **9023.00.00** ("instrumentos, aparelhos e modelos concebidos para demonstração, não suscetíveis de outros usos" — enquadramento típico de maquetes de demonstração; **confirmar com classificação fiscal formal**). Valor: R$ 120.000, incluindo projeto, software embarcado e instalação, que **compõem a base do ICMS** quando cobrados pelo vendedor na mesma operação (LC 87/1996, art. 13, § 1º — importâncias cobradas do adquirente, inclusive frete e instalação; *NÃO VERIFICADO ONLINE nesta sessão — base: conhecimento até jan/2026*).
- **Simples**: receita no **Anexo II** (indústria), com ICMS e IPI dentro do DAS.
- **Retenções**: nenhuma retenção federal típica (tomador não retém IRRF/CSRF de optante); sem ISS porque não há serviço autônomo.

**Quando a separação é OBRIGATÓRIA:** quando existir prestação **autônoma e juridicamente distinta**, com utilidade própria destacada no contrato — ex.: o cliente contrata **também** uma **licença de uso de software** que funciona independentemente da maquete (dashboard web de monitoramento, atualizável, com licença renovável) ou **suporte/manutenção continuados** pós-entrega. Serviço autônomo é fato gerador de ISS e **não pode** ser embutido em NF-e de mercadoria (misturar NF-e com serviço puro é erro): emite-se **NFS-e própria** (1.05 para a licença; 1.07 para suporte; 14.01/14.06 para manutenção/instalação avulsa posterior).

**Quando é PERMITIDA:** quando o contrato, desde a origem, estrutura entregáveis separáveis com preços com substância (ex.: fase 1 — projeto executivo e maquete digital aprovada, que o cliente recebe e pode usar mesmo sem encomendar a fabricação → NFS-e 23.01/32.01; fase 2 — fabricação e fornecimento → NF-e). Isso é legítimo se os preços de cada fase forem compatíveis com custos e mercado e se o cliente de fato receber cada entregável.

**Quando seria ARTIFICIAL:** rotular como "licença de software" ou "projeto" uma fatia desproporcional do preço de um produto único e indivisível (ex.: maquete de R$ 120.000 faturada como R$ 30.000 de produto + R$ 90.000 de "software embarcado") apenas para deslocar receita do Anexo II para rubricas de serviço, ou para reduzir base de ICMS/IPI. O firmware/sistema embarcado **sem utilidade autônoma integra o produto**. A separação sem correspondência com a realidade contratual e econômica é simulação (CTN, art. 116, parágrafo único) e pode ser desconsiderada, com autuação de ICMS/IPI sobre o total.

**Como redigir o contrato:** objeto como "fornecimento de maquete interativa, fabricada pela contratada, conforme especificações do Anexo A, incluindo projeto, integração eletrônica, software embarcado necessário ao seu funcionamento, entrega e instalação" (obrigação de dar). Se houver licença/suporte autônomos, cláusulas separadas com objeto, prazo, SLA e preço próprios.

**Riscos:** falta de IE/habilitação de NF-e; classificação NCM; município tentar exigir ISS sobre a instalação (defesa: instalação de produto próprio pelo fabricante é acessória à venda; 14.06 pressupõe material fornecido pelo usuário). **Confiança alta** na estrutura geral; **média** no NCM (exige laudo de classificação).

### CENÁRIO 2 — Software sob encomenda, R$ 30.000

- **Documento**: **NFS-e** (municipal hoje; Emissor Nacional a partir de 01/11/2026).
- **Item da lista**: **1.04** (elaboração de programas de computadores) — se o escopo for análise + desenvolvimento, cabe também 1.01; o município mapeia o CNAE 62.01-5 para o código local. ISS municipal de 2% a 5% — recolhido **dentro do DAS** (a alíquota municipal em si não se aplica; vale a partilha do Simples).
- **ISS devido no município do estabelecimento prestador** (LC 116/2003, art. 3º, caput — itens do grupo 1 não estão nas exceções). Retenção pelo tomador só se o município do prestador/tomador previr hipótese válida — em regra **não há** para o grupo 1 quando prestador e tomador estão em municípios distintos; **NECESSITA CONFIRMAÇÃO** local.
- **Retenções federais**: dispensadas (optante do Simples — IN RFB 765/2007 e IN RFB 459/2004).
- **Simples**: **Anexo V**; com **Fator R ≥ 28%**, **Anexo III** (LC 123, art. 18, §§ 5º-D e 5º-M) — é exatamente aqui que a estratégia de pró-labore validada na seção 5 atua.
- **Propriedade intelectual**: definir no contrato se há cessão de direitos patrimoniais (desenvolvimento com cessão) ou licença — não muda o ISS (ADIs 1945/5659), mas muda o item (1.04 vs 1.05) e o risco cível.
- **Risco**: baixo. **Confiança alta.**

### CENÁRIO 3 — Assinatura de app R$ 29,90/mês: gateways, plataformas e app stores

Premissa comum: SaaS/assinatura de aplicativo = **ISS** (ADIs 1945/5659), item **1.05** (licenciamento/cessão de uso) ou **1.03** (processamento/hospedagem/aplicativos), conforme a interpretação do município — **NECESSITA CONFIRMAÇÃO** do código municipal. Emissão **mensal, por competência, para cada assinante**, pelo valor da assinatura.

**(a) Recebimento via intermediadora de pagamento (Stripe, Mercado Pago, Pagar.me, cartão):**
A intermediadora apenas **processa o pagamento em nome da Next Layer**; a relação de consumo é direta entre Next Layer e assinante. **A Next Layer emite NFS-e ao assinante pelo valor cheio (R$ 29,90)**; a tarifa do gateway é **despesa financeira/operacional**, jamais dedução da receita bruta (LC 123, art. 3º, § 1º — receita bruta sem dedução de despesas). Emitir nota "líquida da taxa" é omissão de receita. **Confiança alta.**

**(b) Plataformas tipo Hotmart/Eduzz (intermediação de negócios/marketplace):**
Nesses modelos a plataforma intermedeia a oferta, processa o pagamento e cobra comissão, mas **o fornecedor do produto digital continua sendo o produtor**. Regra geral: **Next Layer emite NFS-e ao comprador final pelo valor cheio**; a plataforma emite nota **de comissão contra a Next Layer** (despesa). Algumas plataformas operam módulos de "corresponsabilidade" ou faturamento próprio em condições específicas — **o contrato de cada plataforma deve ser lido antes de definir o fluxo** (**NECESSITA CONFIRMAÇÃO** por plataforma). **Confiança média** (modelos contratuais variam e mudam).

**(c) App Store / Google Play:**
Aqui o modelo é diferente: as lojas atuam, conforme seus contratos, como **comissárias/agentes do desenvolvedor ou como merchant of record**, e **quem fatura o consumidor é a loja (ou sua afiliada local)** — o desenvolvedor não emite documento ao usuário final.
- **Google Play**: o Contrato de Distribuição do Desenvolvedor prevê que o Google ou o processador determina e recolhe os "Transaction Taxes" cabíveis e que, onde o Google recolhe e remete tributos, "você reconhecerá um fornecimento presumido seu para o Google, se exigido pela legislação aplicável"; para desenvolvedores brasileiros recebendo em moeda estrangeira sobre vendas a clientes no Brasil, o Google/processadores **deduzem IRF (imposto retido na fonte) brasileiro** dos repasses. Fontes: [Google Play — Contrato de Distribuição do Desenvolvedor](https://play.google.com/intl/ALL_br/about/developer-distribution-agreement.html); [Ajuda do Play Console — real brasileiro e tributos](https://support.google.com/googleplay/android-developer/answer/6106161?hl=pt-BR); [Ajuda do Play Console — imposto de retenção na fonte](https://support.google.com/googleplay/android-developer/answer/9384608?hl=pt). **Confiança média** — o enquadramento exato (quem é o vendedor perante o consumidor brasileiro, e sobre qual valor) depende da versão vigente do contrato e da configuração da conta (moeda BRL vs estrangeira): **NECESSITA CONFIRMAÇÃO** contratual.
- **App Store (Apple)**: no Paid Applications Agreement a Apple atua como **comissária/agente** do desenvolvedor perante o usuário e é ela (ou afiliada regional) quem processa a venda, recolhe tributos do consumidor onde aplicável e repassa o valor **líquido da comissão (15%–30%)**. *NÃO VERIFICADO ONLINE nesta sessão o texto do contrato Apple — base: conhecimento até jan/2026.* **Confiança média.**
- **Documento que a Next Layer emite nas lojas**: a prática contábil predominante é emitir **NFS-e (ou invoice, quando a contratante é entidade estrangeira do grupo Apple/Google) contra a entidade da loja indicada nos relatórios de repasse**, pelo **valor do repasse recebido**, a título de licenciamento/distribuição de software (item 1.05) — e, quando a contratante é estrangeira e o resultado se verifica no exterior, avaliar a **não incidência de ISS por exportação de serviços** (LC 116/2003, art. 2º, I — controverso quando o usuário está no Brasil). **Este é um dos pontos de maior incerteza do parecer**: o correto tratamento (nota ao consumidor? nota à loja? valor bruto ou líquido? exportação?) depende do contrato vigente de cada loja e da posição do município — **NECESSITA CONFIRMAÇÃO com análise contratual específica antes do lançamento do app**. **Confiança baixa-média**, sinalizada de propósito.

**Diferenciação jurídica pedida:**

| Figura | Quem vende ao consumidor | Quem fatura o consumidor | Documento da Next Layer | Comissão/tarifa |
|---|---|---|---|---|
| **Intermediadora de pagamento** (Stripe, MP) | Next Layer | Next Layer (NFS-e valor cheio) | NFS-e ao assinante | Despesa (nota/fatura da adquirente) |
| **Marketplace/intermediadora de negócios** (Hotmart, Eduzz) | Next Layer (regra geral) | Next Layer (regra geral) | NFS-e ao comprador, valor cheio | NF de comissão da plataforma contra a Next Layer |
| **Revendedora/distribuidora** | A revendedora, em nome próprio | A revendedora | NFS-e/invoice da Next Layer **contra a revendedora** (licença para distribuição) | Margem da revendedora |
| **Merchant of Record / comissária** (App Store; Google Play conforme contrato) | A loja, em nome próprio ou por conta do dev | A loja | NFS-e/invoice contra a entidade da loja, pelo repasse (regra prática; confirmar) | Retida no repasse; IRF possível (Google, pagamentos em moeda estrangeira) |

### CENÁRIO 4 — App vendido a milhares de consumidores PF: emissão em massa

- **Obrigatoriedade**: cada prestação de serviço tributada pelo ISS exige documento fiscal, salvo regime especial municipal (raro para SaaS). Vender a 5.000 assinantes = **5.000 NFS-e/mês**. Não existe "nota consolidada mensal" válida como regra geral — **NECESSITA CONFIRMAÇÃO** se o município oferece regime especial; a partir de 01/11/2026, o padrão passa a ser o nacional.
- **Como estruturar**:
  1. **Emissão automática via API**: hoje, API do sistema municipal (padrões ABRASF/RPS em lote na maioria dos municípios); a partir de 01/11/2026, **API do Emissor Nacional da NFS-e** (Res. CGSN 191/2026 prevê expressamente emissor web ou API — fonte na seção 2.1). Construir a integração já no padrão nacional (DPS → NFS-e) evita retrabalho.
  2. **Categorias de ferramentas** (sem promover marcas): ERPs com módulo fiscal, plataformas especializadas em emissão de NFS-e em lote com API, e middlewares que conectam o gateway de cobrança (webhook de pagamento aprovado) ao emissor. O fluxo típico: cobrança aprovada → fila → emissão da NFS-e com CPF do assinante → e-mail do PDF/XML → armazenamento dos XMLs por 5+ anos.
  3. **Cadastro do tomador**: coletar CPF e endereço/município no checkout (necessário ao leiaute; atenção à LGPD — finalidade fiscal).
  4. **Contingência**: reprocessamento de rejeições, monitoramento de indisponibilidade, numeração/lote.
- **Simples**: receita de assinaturas → Anexo V/III (Fator R), segregada no PGDAS-D.
- **Risco**: operacional (volume), não conceitual. **Confiança alta.**

### CENÁRIO 5 — Licença anual de software B2B, R$ 50.000

- **Documento**: **NFS-e**, item **1.05**, emitida na competência da disponibilização da licença (ou por parcela, se o contrato previr pagamento fracionado com vigência mensal — alinhar faturamento ao regime de reconhecimento adotado; no Simples, tributação por regime de competência ou caixa conforme opção no PGDAS-D).
- **Discriminação recomendada**: "Licenciamento de uso de software [nome], modalidade anual, período __/__ a __/__ — item 1.05 da LC 116/2003", com a indicação "optante pelo Simples Nacional" e, se houver hipótese municipal de retenção, a **alíquota efetiva do Simples** para eventual retenção (LC 123, art. 21, § 4º).
- **Retenções do tomador**: IRRF — **não** (IN RFB 765/2007); CSRF 4,65% — **não** (IN RFB 459/2004); ISS — em regra **não** (grupo 1 segue o art. 3º, caput, da LC 116: ISS no município do prestador), salvo previsão municipal específica válida (**NECESSITA CONFIRMAÇÃO**). Informar isso proativamente ao tomador evita retenções indevidas (grandes tomadores retêm "por padrão").
- **Destaque de tributos**: nenhum destaque de ISS "para crédito"; em 2026, nenhum campo IBS/CBS (seção 2.5). Informar os tributos estimados da Lei 12.741/2012 (De Olho no Imposto) no documento é exigível no varejo a consumidor; em B2B é boa prática.
- **Simples**: Anexo V/III (Fator R). **Confiança alta.**

### CENÁRIO 6 — Peça física impressa em 3D

**Árvore de decisão (pós-Tema 816):**

1. **Material próprio da Next Layer, peça vendida (de catálogo ou personalizada)** → **industrialização própria + venda de produto**: **NF-e**, CFOP 5101/6101, NCM conforme material/função (ex.: peças plásticas 3926.90.90 — aproximado), **ICMS e IPI dentro do DAS**, **Anexo II**. A personalização exclusiva **não** converte a venda em serviço quando a empresa emprega material próprio e entrega bem novo — a obrigação é de dar. **Confiança alta.**
2. **Material (insumo) fornecido pelo encomendante, e a peça retorna para a cadeia produtiva/comercial dele** (ex.: cliente industrial manda filamento/resina ou componentes e revende ou incorpora a peça) → **industrialização por encomenda em etapa intermediária**: ISS **afastado** (Tema 816); operação de **ICMS/IPI**: NF-e de retorno de industrialização — CFOP **5124/6124** (industrialização efetuada para outrem, cobrando valor agregado), com remessas do cliente em 5901/6901 e retornos simbólicos 5902/6902; possibilidade de **suspensão de IPI/ICMS** nas remessas conforme RIPI e regulamento estadual (**NECESSITA CONFIRMAÇÃO** UF). No Simples, receita de industrialização → **Anexo II**. **Confiança alta** na incidência; **média** na malha exata de CFOPs/suspensões por UF.
3. **Encomendante é usuário final do objeto** (peça para uso próprio, reposição em equipamento do próprio cliente, acabamento/beneficiamento de objeto do cliente sem destinação comercial) **e o material relevante é dele** → **ISS, item 14.05**: **NFS-e**, **Anexo III**, sem ICMS/IPI. **Confiança alta** (é exatamente o espaço que o Tema 816 preservou para o 14.05).
4. **Zona cinzenta** (material parte próprio, parte do cliente; destinação incerta): documentar por escrito, no pedido, **a destinação declarada pelo cliente** e a origem dos materiais — é a prova que sustenta o enquadramento. Na dúvida com material próprio preponderante, tratar como venda de produto (posição mais conservadora perante Estado e União).

### CENÁRIO 7 — Protótipo desenvolvido especificamente para um cliente

Classificação depende do **objeto contratado**:

- **Contrato de entrega do bem** (cliente quer o protótipo físico, feito com material da Next Layer): venda de produto de fabricação própria → **NF-e**, Anexo II, ICMS/IPI no DAS — ainda que seja peça única. **Confiança alta.**
- **Contrato de desenvolvimento** (cliente quer o **projeto/engenharia** do protótipo — desenhos, arquivos CAD/STL, relatórios de teste — e o objeto físico é meio de validação): serviço técnico → **NFS-e**; itens candidatos: **32.01** (desenho técnico), **23.01** (desenho industrial) ou, se envolver ensaios/análises, 17.01/17.09 conforme o caso; se o protótipo incluir software, o módulo de software vai em 1.04. No Simples, serviços de natureza intelectual/técnica caem na regra do **Fator R** (LC 123, art. 18, § 5º-I, XII — atividades de natureza intelectual/técnica → Anexo V; Anexo III se Fator R ≥ 28%, § 5º-J). **Confiança média** no item exato (depende do escopo e do mapeamento municipal).
- **Se o cliente fornece o material e o protótipo é etapa do desenvolvimento de produto que ele industrializará**: atenção — o protótipo em si normalmente **não** é destinado a comercialização (é consumido no P&D do cliente, usuário final), o que mantém espaço para o 14.05/ISS; mas se a operação for de produção de **lote piloto que será vendido**, aplica-se o Tema 816 (ICMS/IPI). Documentar a destinação. **Confiança média.**
- **P&D com incentivos** (Lei do Bem etc.) não se aplica a optante do Simples — sem efeito aqui.
- **Recomendação prática**: contratos de prototipagem devem separar "serviços de desenvolvimento e engenharia" (NFS-e) de "fornecimento de unidades físicas adicionais" (NF-e), quando ambos existirem — separação legítima porque os objetos são realmente distintos.

### CENÁRIO 8 — Totem interativo (estrutura + tela + eletrônica + software)

- **Regra geral — produto único**: totem montado com materiais próprios e software embarcado necessário ao funcionamento = **produto industrializado**: **NF-e** (CFOP 5101/6101; NCM aproximado do grupo 8471/8543 conforme a função — **classificação fiscal formal recomendada**), Anexo II, ICMS/IPI no DAS. O **software embarcado (firmware/aplicação que dá função ao totem) integra o valor do produto** — é o hardware com sua inteligência, não uma licença autônoma. Cobrar "licença" à parte do software sem o qual o totem é inútil, para o mesmo cliente, no mesmo fornecimento, tende à **artificialidade**.
- **Venda + instalação**: instalação feita pelo próprio fabricante como condição da venda → integra o valor da operação (base do ICMS). Se a instalação for contratada **depois**, avulsa, em equipamento já do cliente, é serviço (14.06 exige material fornecido pelo usuário final; instalação/montagem com material próprio do instalador em regra acompanha a venda).
- **Quando licenciar software à parte é correto**: quando existe **camada de software com vida própria** — ex.: plataforma de gestão de conteúdo (CMS) em nuvem que o cliente assina para atualizar os totens, licenças por ponto adicionais, atualizações evolutivas contratadas. Aí: NF-e do totem + **NFS-e 1.05 (licença/assinatura)** + NFS-e 1.07 (suporte). Isso é planejamento lícito porque cada parcela tem utilidade e preço autônomos — e é, inclusive, o desenho comercial que prepara a empresa para o modelo SaaS.
- **Confiança alta** na estrutura; **média** no NCM.

### CENÁRIO 9 — Projeto digital sem fabricação (modelagem 3D, visualização, apresentação)

- **Documento**: **NFS-e** (ISS), sem NF-e — não há circulação de mercadoria; a entrega de arquivos digitais não é "mercadoria".
- **Item da lista — escolher pelo conteúdo real**:
  - **23.01 — programação e comunicação visual, desenho industrial e congêneres**: o melhor enquadramento para **modelagem 3D para apresentação, visualização arquitetônica/institucional, projetos visuais de maquetes digitais** (natureza criativa/comunicacional). Item preferencial no caso típico da Next Layer.
  - **32.01 — desenho técnico**: quando o entregável for **desenho/documentação técnica** (plantas, cortes, detalhamentos, arquivos técnicos para execução).
  - **Grupo 1 (1.04/1.03)**: somente se o entregável for um **software/aplicação interativa** (ex.: visualizador 3D navegável, experiência VR/AR desenvolvida) — aí é elaboração de programa (1.04).
- **Anexo do Simples**: atividade de natureza intelectual → regra do **Fator R** (Anexo V; Anexo III se ≥ 28%) — LC 123, art. 18, § 5º-I, XII e § 5º-J. Observação: alguns fiscos municipais mapeiam design/desenho para códigos vinculados a engenharia — o **mapeamento CNAE × código municipal NECESSITA CONFIRMAÇÃO**.
- **Retenções**: as gerais da seção 2.6. **Confiança média-alta** (a fronteira 23.01 × 32.01 × 1.04 é o único ponto sensível e se resolve pela descrição fiel do entregável na nota e no contrato).

### CENÁRIO 10 — Contrato completo: projeto + fabricação + instalação + software + suporte anual

**Estrutura recomendada (lícita e defensável):**

1. **Contrato-quadro com anexos por entregável (SOW)**, cada um com objeto, escopo, critérios de aceite, prazo e **preço próprio formado a partir de custos + margem documentados** (planilha interna arquivada — é a prova da substância):
   - SOW-1 Projeto/engenharia e maquete digital → **NFS-e 23.01/32.01** na aprovação (Fator R);
   - SOW-2 Fabricação e fornecimento da maquete/totem, incl. software embarcado e instalação → **NF-e** na entrega (Anexo II);
   - SOW-3 Licença anual da plataforma de conteúdo/monitoramento (se houver camada autônoma) → **NFS-e 1.05** (Fator R);
   - SOW-4 Suporte e manutenção anual → **NFS-e 1.07/14.01** por competência (1.07 → Fator R; manutenção de bem físico 14.01 → Anexo III).
2. **Parcelas atreladas a marcos** (aceite do projeto, entrega, ativação da licença), cada uma documentada pelo documento fiscal da sua natureza — nunca "adiantamento genérico" sem vínculo.
3. **Coerência comercial**: os preços relativos devem ser os mesmos que a empresa pratica quando vende cada item isoladamente (o preço da licença no combo ≈ preço da licença avulsa). Divergências grandes são o principal indício de artificialidade.

**Onde termina o lícito e começa o artificial:**

| Lícito | Artificial |
|---|---|
| Separar o que o cliente contrata e recebe separadamente, com utilidade autônoma | Fatiar um fornecimento único apenas no papel |
| Preços por entregável compatíveis com custo/mercado | Inflar a rubrica menos tributada (ex.: supervalorar "licença" do firmware) |
| Suporte anual com SLA, chamados registrados, execução real | "Suporte" sem prestação efetiva para converter preço do produto em serviço |
| Escolher, entre formas negociais reais, a menos onerosa | Simular forma que não corresponde ao negócio (CTN, art. 116, § único) |

**Confiança alta** no framework.

---

## 4. Reforma tributária na emissão — vigente × futuro

**JÁ VIGENTE / CERTO EM 2026 (para optante do Simples):**

| Tema | Situação em ago/2026 | Fonte |
|---|---|---|
| Campos IBS/CBS/IS na NF-e (NT 2025.002) | **Facultativos para CRT 1 (Simples) e CRT 4 (MEI) até 04/01/2027**; obrigatórios desde 03/08/2026 apenas para o regime normal (CRT 3) | [Simplifique/Contmatic](https://simplifique.contmatic.com.br/blogs/ibs-cbs-nfe-campos-obrigatorios-agosto-2026); [Tecnospeed](https://blog.tecnospeed.com.br/nota-tecnica-reforma-tributaria-nfe-nfce/) |
| Alíquotas-teste IBS 0,1% / CBS 0,9% (LC 214/2025, arts. 343/346/348) | **Não se aplicam a optantes do Simples**; para o regime regular, recolhimento 2026 dispensado mediante cumprimento das obrigações acessórias | [reformatributaria.com](https://www.reformatributaria.com/opiniao/ibs-e-cbs-em-2026-como-funciona-a-convivencia-com-os-tributos-atuais-segundo-a-lc-no-214-2025/) |
| NFS-e nacional | Leiaute nacional (DPS) já contempla os grupos da reforma; obrigatoriedade do Emissor Nacional para ME/EPP em **01/11/2026** | [Portal NFS-e](https://www.gov.br/nfse/pt-br/noticias/comite-gestor-do-simples-nacional-prorroga-a-obrigatoriedade-de-emissao-de-notas-fiscais-de-servico-pelo-emissor-nacional-da-nfs-e) |

**FUTURO (sinalizado como futuro — não aplicar hoje):**

- **04/01/2027**: preenchimento dos grupos IBS/CBS torna-se obrigatório também para Simples/MEI nos documentos eletrônicos (NT 2025.002).
- **2027**: **CBS em alíquota cheia + extinção de PIS/COFINS**; IPI zerado para a maior parte dos produtos (mantido para concorrentes da ZFM) — relevante para a operação industrial da Next Layer. Optantes do Simples continuam no DAS, mas surge a decisão anual do **regime híbrido** (LC 214/2025, arts. 41 e seguintes): recolher IBS/CBS "por fora" do Simples, no regime regular, para **transferir crédito integral aos clientes B2B** — decisão potencialmente valiosa para maquetes e SaaS vendidos a grandes empresas (clientes de energia/data centers tomarão crédito de IBS/CBS e passarão a pressionar fornecedores). *Base: LC 214/2025; leitura secundária [e-Auditoria — LC 214 e Simples](https://www.e-auditoria.com.br/blog/lc-214-simples-nacional-como-orientar-seus-clientes/).* **Confiança média** nos detalhes operacionais (regulamentação em curso).
- **2029–2032**: transição do ICMS/ISS para o **IBS** (redução gradual das alíquotas antigas); extinção de ICMS e ISS em 2033. A distinção ISS × ICMS que estrutura metade deste parecer **perderá relevância progressivamente** — mas rege integralmente o período 2026–2028.
- **Split payment**: previsto na LC 214/2025 como mecanismo de recolhimento na liquidação financeira; implantação gradual a partir da transição — **não exigível da Next Layer em 2026**; acompanhar regulamentação, pois afetará gateways e recebíveis de assinaturas.

---

## 5. Validação dos números do sócio (conferência independente)

Recalculado com as tabelas dos Anexos III e V da LC 123/2006 (fórmula da alíquota efetiva: [(RBT12 × Alq) − PD] / RBT12):

| Mês | Receita (R$) | RBT12 (R$) | Efetiva Anexo V | DAS V (R$) | Efetiva Anexo III (Fator R ≥ 28%) | DAS III (R$) | Pró-labore mín. p/ Fator R (28% × RBT12/12) |
|---|---|---|---|---|---|---|---|
| Ago | 67.000 | 78.000 | 15,50% | 10.385,00 | 6,00% | 4.020,00 | 1.820,00 |
| Set | 88.500 | 138.500 | 15,50% | 13.717,50 | 6,00% | 5.310,00 | 3.231,67 |
| Out | 53.750 | 220.500 | 15,96% | 8.578,20 | 6,955% | 3.738,26 | 5.145,00 |
| Nov | 53.750 | 267.750 | 16,32% | 8.771,58 | 7,704% | 4.140,86 | 6.247,50 |
| **Total** | **263.000** | — | **média 15,76%** | **41.452,28** | **média 6,54%** | **17.209,12** | — |

**Conclusão: os números do sócio estão corretos** (diferenças de centavos por arredondamento). Ressalvas técnicas: (i) o Fator R usa **folha dos 12 meses anteriores / RBT12** (Resolução CGSN 140/2018, art. 26), então o pró-labore precisa ser mantido de forma consistente, não pontual; (ii) o custo do pró-labore (INSS 11% do sócio + IRPF progressivo) reduz o ganho líquido — análise de otimização pertence ao Agente 2; (iii) **a comparação III × V só vale para as receitas de serviço sujeitas ao Fator R** — se parte relevante do faturamento for industrial (maquetes vendidas com NF-e), essa parte vai ao **Anexo II** (alíquota inicial 4,5% + IPI incluso), o que **pode ser ainda melhor** que o Anexo III e independe de folha. A segregação correta por natureza é, portanto, também uma alavanca de economia lícita. **Confiança alta.**

---

## 6. Mini-manual operacional de faturamento

| Se a operação for... | Documento | Código/CFOP/Item | Anexo | Cuidados |
|---|---|---|---|---|
| **Vender maquete/totem fabricado (material próprio), com entrega/instalação** | **NF-e** única | CFOP 5101/6101; NCM 9023.00.00 (maquete, aproximado) / 8471-8543 (totem, aproximado) | **II** | Exige IE; software embarcado e instalação integram o valor; contrato como obrigação de dar |
| **Vender software sob encomenda** | **NFS-e** | Item **1.04** (ou 1.01) | **V** (III se Fator R ≥ 28%) | Sem retenção IRRF/CSRF (Simples); descrever escopo e cessão de direitos |
| **Receber assinatura de app (gateway/cartão)** | **NFS-e mensal por assinante, valor cheio** | Item **1.05** (ou 1.03 — conforme município) | **V/III (Fator R)** | Tarifa do gateway é despesa; automatizar via API; CPF do assinante; migrar ao Emissor Nacional até 01/11/2026 |
| **Receber por App Store/Google Play** | NFS-e/invoice **contra a entidade da loja**, pelo repasse (regra prática) | Item 1.05; avaliar exportação de serviço | V/III | **NECESSITA CONFIRMAÇÃO contratual**; conciliar relatórios de repasse; IRF possível (Google) |
| **Licenciar software B2B (anual)** | **NFS-e** | Item **1.05** | V/III | Informar "optante Simples"; orientar tomador a não reter IRRF/CSRF; ISS no município do prestador |
| **Vender peça impressa 3D (material próprio)** | **NF-e** | CFOP 5101/6101; NCM do material (ex.: 3926.90.90, aproximado) | **II** | ICMS/IPI dentro do DAS; personalização não vira serviço |
| **Industrializar peça com insumo do cliente que vai revender/industrializar** | **NF-e** (retorno de industrialização) | CFOP **5124/6124** (+ 5902/6902) | **II** | Tema 816: sem ISS; conferir suspensões IPI/ICMS na UF |
| **Beneficiar/produzir objeto para uso final do encomendante (material dele)** | **NFS-e** | Item **14.05** | **III** | Guardar declaração de destinação do cliente |
| **Vender projeto digital/modelagem 3D (sem fabricação)** | **NFS-e** | **23.01** (visual/design) ou **32.01** (desenho técnico); 1.04 se for aplicação interativa | V/III (Fator R) | Descrever o entregável real; conferir mapeamento municipal |
| **Suporte/manutenção de software** | **NFS-e** | Item **1.07** | V/III (Fator R) | Contrato com SLA; competência mensal |
| **Manutenção de maquete/totem físico (pós-venda)** | **NFS-e** | Item **14.01** | **III** | Peças substituídas ficam sujeitas a ICMS (14.01, parte final) — emitir NF-e das peças |
| **Contrato completo (projeto+produto+licença+suporte)** | 1 contrato, **documentos separados por natureza** | Conforme linhas acima | Misto | Preços por entregável com substância; marcos de aceite; nunca deslocar valor entre rubricas |

**Checklist permanente:** (1) IE ativa + credenciamento NF-e e certificado digital; (2) inscrição municipal e cadastro no **Emissor Nacional NFS-e antes de 01/11/2026**; (3) CNAEs cobrindo indústria (ex.: 32.99-0/99), serviços de design/desenho (74.10/71.19) e software (62.01/62.02/62.03/63.11) — a inclusão de CNAEs de software **agora**, de forma ampla, atende ao desejo do sócio de não alterar o contrato social a cada app (CNAE descreve atividade, não produto; um CNAE 62.03/62.01 cobre todos os aplicativos futuros); (4) segregação de receitas por anexo no PGDAS-D todo mês; (5) arquivamento de XMLs, contratos e planilhas de formação de preço por entregável; (6) preparação do ERP para os grupos IBS/CBS (obrigatórios para o Simples em 04/01/2027).

---

## 7. Pendências que dependem de dados não fornecidos

1. **Município/UF** → alíquotas e códigos municipais de ISS, hipóteses de retenção, regime especial de emissão, regras estaduais de ICMS/industrialização por encomenda, benefícios locais.
2. **Existência de Inscrição Estadual e credenciamento de NF-e** → sem isso não há como faturar corretamente a operação industrial.
3. **CNAEs atuais no CNPJ e contrato social** → conferir cobertura de indústria + design + software.
4. **Contratos vigentes das plataformas** (Apple, Google, Hotmart, gateways) → definem o fluxo documental exato do Cenário 3.
5. **Datas exatas das receitas simuladas** → afetam RBT12 e a janela de opção caixa/competência.
