# 📘 Visão de Negócio – Or### 💡 Orçamento (Budget)

- Representa um agrupamento de finanças com um objetivo ou perfil comum.
- Pode ser **compartilhado** (ex: "Casa") ou **pessoal** (ex: "Viagem solo").
- O usuário pode alternar entre diferentes orçamentos.
- Cada orçamento tem:
  - Categorias próprias (ou herdadas de presets)
  - Transações
  - Metas vinculadas
  - Saldo e controle por envelope

#### 👥 Compartilhamento Simplificado

- **Orçamentos compartilhados** permitem colaboração entre usuários.
- **Adição direta**: Qualquer participante pode adicionar outros usuários ao orçamento sem necessidade de convites ou aprovações.
- **Acesso total**: Todo usuário adicionado tem acesso completo ao orçamento (sem níveis de permissão).
- **Remoção**: Participantes podem ser removidos do orçamento (exceto o criador).

### 💸 Transações (Receitas e Despesas) Ferramenta de gestão financeira familiar simples, prática e com foco em metas reais.

---

## 🎯 Propósito da Ferramenta

O **OrçaSonhos** é uma plataforma de gestão financeira voltada para pessoas físicas (indivíduos e famílias) que desejam **tomar o controle das suas finanças** e **transformar sonhos em metas alcançáveis**.  
A proposta é unir **simplicidade, clareza e efetividade**, permitindo desde o controle básico de gastos até o planejamento de metas complexas com envolvimento familiar.

---

## 🧱 Princípios do Produto

- **Descomplicado por padrão:** Sem jargões financeiros ou telas complexas.
- **Multi-orçamento:** Usuário pode criar orçamentos distintos (ex: orçamento pessoal, familiar, metas específicas).
- **Foco em metas:** Tudo gira em torno de ajudar o usuário a atingir seus objetivos.
- **Controle visual:** O usuário precisa ver claramente para onde vai seu dinheiro.
- **Compartilhável:** Casais e famílias podem cooperar em orçamentos comuns através de adição direta de usuários.
- **Evolutivo:** Começa simples e pode crescer com o usuário.

---

## 🧭 Conceitos Centrais

### 💡 Orçamento (Budget)

- Representa um agrupamento de finanças com um objetivo ou perfil comum.
- Pode ser **compartilhado** (ex: “Casa”) ou **pessoal** (ex: “Viagem solo”).
- O usuário pode alternar entre diferentes orçamentos.
- Cada orçamento tem:
  - Categorias próprias (ou herdadas de presets)
  - Transações
  - Metas vinculadas
  - Saldo e controle por envelope

### 💸 Transações (Receitas e Despesas)

- São os lançamentos manuais ou importados que alimentam o sistema.
- Associadas a uma **categoria**, um **orçamento** e uma **data**.
- **Flexibilidade temporal**: O sistema permite transações com **data passada, presente ou futura** para máximo controle financeiro.
- Tipos:
  - Receita (entrada)
  - Despesa (saída)
  - Transferência (entre orçamentos)
- Status:
  - **Agendada**: Transação futura que ainda não foi efetivada
  - **Realizada**: Transação que já aconteceu e impacta o saldo atual
  - **Atrasada**: Transação com data passada que ainda não foi concluída
  - **Cancelada**: Transação agendada que foi cancelada
- **Controle de pagamento**: Ao cadastrar, o usuário define se a transação já foi paga/recebida ou se ainda está pendente.
- Cada transação possui uma **forma de pagamento**, que pode incluir cartões de crédito.

#### 💡 Impacto no Saldo:

- **Transações Realizadas**: Afetam imediatamente o saldo atual, independente da data
- **Transações Agendadas**: Não afetam o saldo atual, apenas aparecem nas projeções
- **Transações Atrasadas**: Não afetam o saldo atual, mas são identificadas pelo sistema como pendentes

### 🗂️ Categorias

- Organizam os lançamentos para permitir análise.
- Baseadas no modelo 50-30-20:
  - **50%**: Necessidades (moradia, alimentação, transporte)
  - **30%**: Estilo de vida (lazer, assinaturas)
  - **20%**: Prioridades financeiras (reserva, investimento, dívidas)
- Usuários podem criar suas próprias categorias conforme necessidade.

### 🎯 Metas (Objetivos Financeiros)

- São o coração do OrçaSonhos: **transformar sonhos em planos de ação financeiros.**
- Cada meta é vinculada a um orçamento.
- Parâmetros:
  - Nome
  - Valor total necessário
  - Valor acumulado
  - Prazo desejado
  - Aportes manuais

### 💰 Envelopes (Orçamento Mensal por Categoria)

- Definem limites de gastos por categoria.
- Ajudam o usuário a **controlar o que pode gastar** em cada área.
- Funcionam como subcontas dentro de um orçamento.

### 🏦 Contas (Accounts)

- Representam **onde o dinheiro está fisicamente armazenado** antes de ser gasto ou após ser recebido.
- **Dimensão complementar** aos orçamentos: orçamentos definem "para que uso", contas definem "onde está".
- Cada conta mantém seu **saldo próprio** e histórico de movimentações.
- Tipos de conta:
  - **Conta Corrente**: Conta bancária para movimentações do dia a dia
  - **Conta Poupança**: Conta bancária para reservas e economias
  - **Carteira Física**: Dinheiro em espécie que o usuário carrega
  - **Carteira Digital**: Saldo em apps como PIX, PayPal, cartões pré-pagos
  - **Conta Investimento**: Recursos aplicados em investimentos líquidos
  - **Outros**: Tipos personalizados conforme necessidade

#### Como funciona na prática:

- **Toda transação** deve indicar de qual conta o dinheiro saiu/entrou
- **Transferências** podem mover dinheiro entre contas (ex: saque no caixa)
- **Reconciliação**: Saldos das contas devem bater com extratos reais
- **Controle total**: Usuário sabe exatamente onde cada centavo está guardado

### 💳 Gestão de Cartões de Crédito

O OrçaSonhos permite **gerenciar cartões de crédito de forma integrada ao controle de despesas**, seguindo o modelo:

#### Como funciona:

- Ao lançar uma **despesa**, o usuário seleciona a **forma de pagamento** como sendo um cartão (ex: “Cartão Nubank”).
- O gasto é tratado como uma despesa comum, com sua **categoria normal** (ex: mercado, transporte), e entra no orçamento e relatórios normalmente.
- Existe uma **área específica** para cada cartão, que mostra:
  - Limite total e limite disponível
  - Fatura atual (total acumulado da fatura aberta)
  - Data de fechamento e vencimento
  - Listagem das transações dessa fatura
- O pagamento da fatura é **registrado como uma nova transação**, com categoria "Pagamento de Fatura" e origem em uma conta bancária ou orçamento.

#### Benefícios:

- Mantém a consistência nos relatórios por categoria
- Permite controle real de limite e fatura
- Não fragmenta a experiência de lançamento
- Permite visão clara da fatura e pagamento

### 💳 Fatura de Cartão (CreditCardBill)

- Agregado que representa uma fatura específica de um cartão de crédito.
- Cada fatura tem:
  - Data de fechamento e vencimento
  - Valor total da fatura
  - Status (OPEN, CLOSED, PAID, OVERDUE) - Enum type-safe
  - Referência ao cartão de crédito
- **Regras de negócio**:
  - Data de fechamento deve ser anterior à data de vencimento
  - Fatura em atraso quando passou do vencimento e não foi paga
  - Pode ser marcada como paga, alterando o status e registrando data do pagamento
  - Calcula automaticamente dias restantes até o vencimento
  - Status controlado por enum para garantir type-safety

---

## 📊 Relatórios e Painéis

- Painel de controle por orçamento:
  - Saldo atual
  - Evolução das metas
  - Gastos por categoria
  - Status dos envelopes
- Visão consolidada (para quem participa de múltiplos orçamentos)
- Fatura atual de cada cartão, com detalhamento
- Progresso das metas SMART

---

## 🧩 Casos de Uso Prioritários

### 👥 Gestão Familiar

- Criar um orçamento compartilhado com parceiro(a)
- Adicionar parceiro(a) diretamente ao orçamento (sem convites)
- Definir metas comuns (ex: reforma da casa)
- Controlar contas da casa, supermercado, etc.
- Ambos participantes têm acesso total para lançar transações e gerenciar o orçamento

### 👤 Gestão Individual

- Orçamento pessoal separado (ex: hobbies, presentes, cursos)
- Meta pessoal (ex: comprar um notebook)
- Controle de gastos pessoais sem impactar o casal

### 🔁 Planejamento Contínuo

- Revisar gastos semanais/mensais
- Ajustar envelopes e metas
- Realocar valores entre orçamentos
- Acompanhar faturas de cartão e programar quitação
- **Agendar transações futuras**: Lançar salários, contas fixas e gastos programados
- **Projetar fluxo de caixa**: Visualizar entradas e saídas futuras para melhor planejamento

### 📅 Transações Futuras - Casos de Uso

- **Receitas recorrentes**: Agendar salário do próximo mês
- **Despesas fixas**: Contas de luz, água, internet com vencimento futuro
- **Planejamento de gastos**: Aniversários, viagens, compras planejadas
- **Parcelas e financiamentos**: Controlar prestações futuras
- **Gestão de metas**: Calcular quando objetivos serão atingidos com aportes manuais

### 📅 Transações Passadas - Casos de Uso

- **Lançamento retroativo**: Cadastrar gastos esquecidos com data correta
- **Conciliação bancária**: Registrar transações já realizadas no banco
- **Controle de pendências**: Marcar contas vencidas que ainda não foram pagas
- **Histórico completo**: Manter registro fiel da movimentação financeira
- **Identificação de atrasos**: Sistema identifica automaticamente transações em atraso

---

## 📚 Termos importantes para a IA Assistente

| Termo                   | Significado                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Orçamento**           | Espaço virtual com categorias, transações, metas e envelopes. Pode ser compartilhado ou individual.                                         |
| **Categoria**           | Tipo de gasto/receita (ex: alimentação, transporte, investimento). Organiza as transações.                                                  |
| **Meta**                | Objetivo financeiro (ex: comprar carro, fazer intercâmbio), com valor-alvo e prazo.                                                         |
| **Envelope**            | Limite de gastos por categoria dentro de um orçamento mensal.                                                                               |
| **Transação**           | Registro de entrada ou saída de dinheiro. Pode ter data passada, presente ou futura. Deve sempre ter um valor, data, categoria e orçamento. |
| **Transação Agendada**  | Transação com data futura que ainda não foi efetivada. Útil para planejamento.                                                              |
| **Transação Realizada** | Transação que já aconteceu e impacta o saldo atual. Pode ter qualquer data.                                                                 |
| **Transação Atrasada**  | Transação com data passada que ainda não foi concluída/paga.                                                                                |
| **Conta**               | Local físico onde o dinheiro está armazenado (conta bancária, carteira, etc.). Pode ter saldo negativo.                                     |
| **Cartão de Crédito**   | Meio de pagamento com controle de limite e fatura. Não é tratado como conta bancária.                                                       |
| **Fatura**              | Conjunto de despesas em um cartão com data de fechamento e vencimento.                                                                      |
| **Pagamento de fatura** | Despesa pontual que representa a quitação da fatura do cartão.                                                                              |
| **Dashboard**           | Tela com resumo financeiro de um orçamento ou da visão geral do usuário.                                                                    |
| **Usuário**             | Pessoa que acessa a plataforma. Pode ter acesso a múltiplos orçamentos e metas.                                                             |

---

## 🔐 Visão de Confiança

- Todos os dados são privados por padrão.
- Usuários têm controle sobre quem acessa seus orçamentos.
- Toda transação é auditável com histórico de alterações.

---

## ✅ Resumo

OrçaSonhos não é apenas um app de finanças — é um **organizador de vida financeira com propósito.**  
Permite que cada usuário, sozinho ou em família, **controle seus gastos, visualize seu futuro e alcance seus sonhos** com planejamento realista.

---
