# Credit Cards - Gestão de Cartões de Crédito e Faturas - Contexto de Desenvolvimento

# OS-230

## 🎯 Objetivo

Implementar a gestão completa de cartões de crédito e faturas no frontend, seguindo o padrão arquitetural estabelecido pela feature Accounts. A funcionalidade permitirá aos usuários gerenciar seus cartões de crédito, criar e gerenciar faturas, realizar pagamentos de faturas e reabrir faturas pagas quando necessário.

**Por que esta funcionalidade está sendo desenvolvida?**

- Necessidade de rastrear e gerenciar cartões de crédito e suas faturas dentro do sistema de orçamento
- Integração com o sistema de transações para registrar pagamentos de faturas
- Fornecer visibilidade completa do ciclo de vida das faturas (aberta → paga → reaberta)
- Permitir planejamento financeiro considerando limites de crédito e vencimentos

**Valor esperado:**

- Controle completo sobre cartões de crédito e faturas
- Integração transparente com transações e orçamentos
- Interface consistente seguindo padrões já estabelecidos
- Base sólida para funcionalidades futuras relacionadas a crédito

## 📋 Requisitos Funcionais

### Funcionalidades Principais

#### 1. CRUD de Cartões de Crédito

- **Criar cartão**: Nome, limite (em centavos), dia de fechamento (1-31), dia de vencimento (1-31), orçamento
- **Listar cartões**: Por orçamento selecionado
- **Editar cartão**: Atualizar nome, limite, dias de fechamento/vencimento
- **Excluir cartão**: Com validação de bloqueio se houver faturas associadas

#### 2. CRUD de Faturas de Cartão

- **Criar fatura**: Associada a um cartão, com data de fechamento, data de vencimento e valor (em centavos)
- **Listar faturas**: Por cartão e/ou orçamento
- **Editar fatura**: Atualizar datas e valor
- **Excluir fatura**: Com validações apropriadas

#### 3. Pagamento de Fatura

- **Pagar fatura**: Cria transação automaticamente no sistema
- **Campos necessários**: ID da fatura, conta de pagamento, usuário, orçamento, valor, categoria de pagamento
- **Estado**: Fatura marcada como paga após pagamento bem-sucedido

#### 4. Reabertura de Fatura

- **Reabrir fatura paga**: Permite reabrir uma fatura que foi paga
- **Campos necessários**: ID da fatura, usuário, orçamento, justificativa
- **Estado**: Fatura volta ao estado "não paga"

### Comportamentos Esperados

- **Filtragem automática**: Cartões e faturas filtrados pelo orçamento selecionado globalmente
- **Validações de formulário**: Campos obrigatórios validados antes de submissão
- **Feedback visual**: Estados de loading, erro e sucesso claramente comunicados
- **Integração com transações**: Pagamento de fatura cria transação automaticamente
- **Estado reativo**: Atualizações refletidas imediatamente via signals
- **Tratamento de erros**: Mensagens de erro claras e específicas

## 🏗️ Considerações Técnicas

### Arquitetura

A implementação seguirá o padrão Clean Architecture estabelecido no projeto:

- **DTOs** (`src/dtos/credit-card/`): Contratos de dados entre camadas
- **Serviços de API** (`src/app/core/services/credit-card/credit-card-api/`): Chamadas HTTP isoladas
- **Estado Reativo** (`src/app/core/services/credit-card/credit-card-state/`): Gerenciamento de estado com signals
- **Feature Module** (`src/app/features/credit-cards/`): Componentes e páginas da UI
- **UI Components** (`src/app/shared/ui-components/molecules/credit-card-card/`): Componentes reutilizáveis

### Tecnologias e Dependências

- **Angular 20+**: Framework base com standalone components
- **Signals**: Para estado reativo e computed values
- **Reactive Forms**: Para formulários com validação
- **Angular Material**: Componentes de UI base
- **MSW (Mock Service Worker)**: Para mocks de API durante desenvolvimento
- **RxJS**: Para operações assíncronas (via serviços de API)

### Padrões a Seguir

- **Padrão Accounts**: Estrutura idêntica à feature Accounts como referência
- **Standalone Components**: Sem NgModules, componentes standalone
- **Change Detection OnPush**: Para otimização de performance
- **Input/Output Functions**: Usar `input()` e `output()` ao invés de decorators
- **Signals para Estado**: Estado local e global via signals
- **Either Pattern**: Para tratamento de erros (se aplicável)
- **Valores Monetários**: Sempre em centavos (number)
- **Datas**: Formato ISO string

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes Unitários de Serviços**:
  - `CreditCardApiService`: Todas as chamadas HTTP
  - `CreditCardState`: Gerenciamento de estado e mutations
- **Testes Unitários de Componentes**:
  - Formulários de cartão e fatura
  - Modais de pagamento e reabertura
  - Página principal de listagem
- **Testes de Integração**:
  - Fluxo completo de criação → listagem → edição → exclusão
  - Integração com BudgetSelectionService
  - Integração com sistema de transações

### Critérios de Aceitação

- [ ] CRUD completo de cartões de crédito funcionando
- [ ] CRUD completo de faturas de cartão funcionando
- [ ] Pagamento de fatura cria transação automaticamente
- [ ] Reabertura de fatura paga funcionando
- [ ] Queries GET adicionadas aos handlers do MSW
- [ ] Integração com menu/sidebar (item "Cartões de Crédito")
- [ ] Integração com Transactions (campo "Forma de Pagamento")
- [ ] Validações básicas de formulários (campos required)
- [ ] Estado reativo com signals (similar a Accounts)
- [ ] Testes unitários com cobertura > 80%
- [ ] Sem erros de lint/type-check
- [ ] Responsividade em diferentes tamanhos de tela

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Dashboard**: Widget opcional com resumo de cartões (futuro)
- **Transactions**: Campo "Forma de Pagamento" com opção de cartão
- **Budgets**: Seção "Cartões do Orçamento" (futuro)
- **Menu/Sidebar**: Novo item de navegação "Cartões de Crédito"
- **App Routes**: Nova rota lazy loading `/credit-cards`

### Integrações Necessárias

- **Backend API**: Endpoints de mutations já implementados
  - `POST /credit-card/create-credit-card`
  - `POST /credit-card/update-credit-card`
  - `POST /credit-card/delete-credit-card`
  - `POST /credit-card-bill/create-credit-card-bill`
  - `POST /credit-card-bill/update-credit-card-bill`
  - `POST /credit-card-bill/delete-credit-card-bill`
  - `POST /credit-card-bill/pay-credit-card-bill`
  - `POST /credit-card-bill/reopen-credit-card-bill`
- **MSW Handlers**: Adicionar queries GET
  - `GET /credit-cards?budgetId=...`
  - `GET /credit-card-bills?creditCardId=...&budgetId=...`
- **BudgetSelectionService**: Para filtragem automática por orçamento
- **AccountState**: Para seleção de conta no pagamento de fatura
- **TransactionService**: Para criação automática de transação no pagamento

## 🚧 Restrições e Considerações

### Limitações Técnicas

- **Backend**: Apenas mutations implementadas; queries GET serão mockadas no MSW
- **Valores Monetários**: Sempre em centavos (number), não usar decimais
- **Datas**: Formato ISO string para comunicação com backend
- **Validações**: Frontend apenas validações básicas; regras de negócio no backend

### Riscos

- **Integração com Transações**: Garantir que pagamento de fatura crie transação corretamente
- **Estado Reativo**: Manter sincronização entre cartões, faturas e orçamentos
- **Validações de Negócio**: Backend processa regras; frontend apenas validações de formulário
- **Performance**: Listagem de faturas pode crescer; considerar paginação futura

### Decisões Arquiteturais

- **Estado Global**: `CreditCardState` em `core/services` para reuso em múltiplas features
- **Separação API/Estado**: `CreditCardApiService` isolado do estado para testabilidade
- **Padrão Accounts**: Seguir estrutura idêntica para consistência e manutenibilidade

## 📚 Referências

- **Issue/Card**: [OS-230](https://orca-sonhos.atlassian.net/browse/OS-230)
- **Padrão de Referência**: Feature Accounts (`src/app/features/accounts/`)
- **MSW Handlers**: `src/app/core/mocks/handlers/credit-cards.handlers.ts`
- **Backlog**: `temp/backlog-features-incremental.md` - Card 12
- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`


