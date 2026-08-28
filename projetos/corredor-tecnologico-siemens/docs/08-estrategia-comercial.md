# 08 — Estratégia comercial (uso interno)

> **Este documento não vai junto com a proposta.** É a preparação para a
> negociação com o parceiro que subcontrata a NexLayer3D.

## Com quem estamos falando

O interlocutor não é a Siemens. É um **integrador que já ganhou o serviço** e
vai terceirizar esta parte. Isso muda tudo:

| | Cliente final (Siemens) | Parceiro integrador |
|---|---|---|
| Quer ver | conceito, impacto, marca bem tratada | que dá para entregar sem dor de cabeça |
| Tem medo de | ficar feio, dar defeito na frente de visita | atraso, custo estourado, ter que resolver no lugar dele |
| Decide por | encantamento + aprovação interna | risco e margem |

Por isso a proposta ao parceiro abre por **prova de execução** (vídeo e
simulação) e vai direto para **fronteira de escopo**. Encantamento é problema
dele com o cliente dele — nosso trabalho é fazer ele parecer bem.

## Precificação

Custo direto apurado em `05-lista-de-materiais.md`:

| | |
|---|---|
| Materiais | R$ 30.650 – 47.900 |
| Mão de obra e serviços | R$ 28.000 – 43.500 |
| **Custo direto** | **R$ 58.650 – 91.400** |

O que empurra a margem para cima neste trabalho:

- **Não é catálogo.** O layout, o engine e a máquina de estados são projeto
  original. Está sendo vendida engenharia, não montagem.
- **Risco de obra em prédio corporativo:** janela de trabalho restrita,
  liberação de acesso, retrabalho se a medição divergir.
- **111 emendas** de mão de obra intensiva, com pouca margem para acelerar.
- **Câmbio:** fita e fontes importadas, e a compra acontece semanas depois do
  aceite.

Margem típica nesse tipo de fornecimento fica entre **40% e 70%** sobre o custo
direto, o que coloca o preço entre **R$ 82 mil e R$ 155 mil**. A faixa é larga
porque o custo ainda depende de cotação — fechar a cotação antes de mandar o
número reduz muito essa incerteza.

**Três regras para a conversa:**

1. **Mande um número, não uma faixa.** Faixa em proposta é convite para o
   parceiro negociar a partir do piso.
2. **Tenha o desconto preparado antes de precisar dele.** Se for ceder, ceda
   contra alguma coisa: prazo maior, pagamento melhor, ou a modalidade B.
3. **Prefira cortar escopo a cortar preço.** As alavancas prontas, em ordem de
   menor perda visual:
   - reduzir a densidade da malha da zona D (menos trilha, menos emenda);
   - trocar parte das peças impressas por relevo usinado no próprio MDF;
   - abrir mão do halo retroiluminado dos componentes menores.
   Cada uma delas tira custo real. Baixar o preço sem tirar escopo só tira
   margem.

## A decisão que vale mais que o preço

O parceiro vai perguntar se "entrega tudo". Vale separar o que está sendo
vendido:

- **A parte física** fica no prédio. Não tem como não entregar.
- **O motor de animação** — máquina de estados, fusão dos radares, comportamento
  — é o que faz a parede reagir. É o ativo.

Entregar o código-fonte junto com a obra, pelo preço da obra, significa que o
**próximo corredor ele faz sem a NexLayer3D**. E vai existir um próximo: esse
tipo de instalação vira padrão dentro da empresa depois que a primeira dá certo.

As três modalidades da proposta existem para tornar essa escolha explícita:

| | O que ele recebe | O que acontece depois |
|---|---|---|
| **A — chave na mão** | instalação funcionando, licença de uso perpétua para este corredor | o próximo corredor volta para nós |
| **B — A + manutenção** | idem, com contrato anual | receita recorrente, e o relacionamento fica |
| **C — transferência** | código-fonte, documentação, treinamento | ele repete sozinho. Só faz sentido por um valor que compense perder isso |

Recomendação: oferecer A como padrão, apresentar C com valor à parte e
claramente mais alto. Se ele insistir em C pelo preço de A, é sinal de que a
intenção é repetir o sistema — e aí o preço tem que refletir a venda do ativo,
não a da obra.

## Marca d'água: os dois arquivos

Existe uma tensão real aqui, e vale reconhecê-la:

- A NexLayer3D quer a marca no vídeo para o crédito não se perder no caminho.
- O parceiro pode não querer mostrar a marca de um subcontratado para a Siemens.

Resolver com **duas versões**:

1. **Versão marcada** — com o selo NexLayer3D e autoria nos metadados do
   arquivo. É a que vai para o parceiro agora, na fase de proposta.
2. **Versão limpa** — sem selo, para ele apresentar ao cliente final.
   **Entregue só depois do contrato assinado.**

Trocar entre as duas é um campo em `ferramentas/marca-dagua.json` e uma
remontagem de segundos — o render de 6 minutos não se repete.

Isso protege os dois lados: o crédito fica registrado desde a proposta, e o
parceiro não fica sem material para levar ao cliente dele.

## Sequência de envio sugerida

1. **Vídeo de 31 s** — primeiro, sozinho, sem texto longo. É o que abre a conversa.
2. **Link da simulação** — quando ele responder. Deixa ele mexer.
3. **Proposta** — depois que houver interesse demonstrado. Nunca junto com o
   vídeo: proposta antes do interesse vira comparação de preço.

## Antes de mandar a proposta

- [ ] Preencher o valor (o campo está marcado no documento)
- [ ] Fechar cotação de fita e fontes, para o número não nascer velho
- [ ] Decidir a política de modalidade C
- [ ] Conferir se o prazo de 8 semanas cabe no cronograma que ele já assumiu
      com a Siemens — se não couber, é melhor saber agora
