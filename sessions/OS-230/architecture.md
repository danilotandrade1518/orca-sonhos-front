# Credit Cards - Gestão de Cartões de Crédito e Faturas - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- **Padrões estabelecidos no projeto**:

  - DTOs centralizados em `dtos/*` (account, budget, goal, transaction já existem)
  - Serviços centrais em `src/app/core/services/*` com signals para estado (ex.: `AccountState`, `BudgetState`)
  - Serviços por feature em `src/app/features/<feature>/services/*` (ex.: `TransactionsApiService`)
  - Seleção de orçamento global via `BudgetSelectionService`
  - MSW Handlers existentes para mutations de `credit-cards` em `src/app/core/mocks/handlers/credit-cards.handlers.ts`
  - Feature Accounts implementada como padrão de referência (`src/app/features/accounts/`)

- **Estrutura de UI Components**:
  - Design System com Atomic Design (atoms, molecules, organisms, templates)
  - Componente `account-card` existente como referência para `credit-card-card`
  - Templates reutilizáveis: `os-modal-template`, `os-form-template`, `os-list-template`

### Mudanças Propostas

- **Criar DTOs de Credit Cards** em `dtos/credit-card/*` alinhados ao backend:

  - `credit-card-types.ts`: DTOs de cartão (CreditCardDto, CreateCreditCardRequestDto, etc.)
  - `credit-card-bill-types.ts`: DTOs de fatura (CreditCardBillDto, CreateCreditCardBillRequestDto, etc.)
  - `index.ts`: exports centralizados

- **Implementar serviços de API e estado**:

  - `CreditCardApiService` (chamadas HTTP) em `src/app/core/services/credit-card/credit-card-api/`
  - `CreditCardState` (estado reativo com signals) em `src/app/core/services/credit-card/credit-card-state/`
  - Listar cartões e faturas por orçamento atual
  - CRUD completo de cartões e faturas
  - Pagamento e reabertura de faturas

- **Criar a feature `features/credit-cards`** com páginas/rotas e componentes:

  - Listagem `/credit-cards`, criação `/credit-cards/new`, edição `/credit-cards/:id/edit` (modal sobre a lista)
  - Formulários reativos com validações
  - Modais para pagamento e reabertura de faturas

- **Adicionar queries GET aos handlers MSW**:

  - `GET /credit-cards?budgetId=...` - Listar cartões por orçamento
  - `GET /credit-card-bills?creditCardId=...&budgetId=...` - Listar faturas

- **Integrações**:
  - Menu/side-nav: adicionar rota `/credit-cards`
  - Transactions: campo "Forma de Pagamento" com opção de cartão
  - Dashboard: widget opcional com resumo de cartões (futuro)
  - Budgets: seção "Cartões do Orçamento" (futuro)

### Impactos

- `features/dashboard`, `features/budget`, `features/transactions`, `app.routes.ts`/layout
- Estado global para fornecer `creditCardOptions` em múltiplas features
- MSW handlers atualizados com queries GET

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/app.routes.ts`: adicionar rotas lazy para `/credit-cards`
- `src/app/core/layout/app-layout.component.ts` (ou componente de menu): adicionar item "Cartões de Crédito"
- `src/app/core/mocks/handlers/credit-cards.handlers.ts`: adicionar queries GET
- `src/app/features/transactions/`: adicionar campo "Forma de Pagamento" com opção de cartão

### Novos Arquivos a Criar

#### DTOs (`src/dtos/credit-card/`)

- `credit-card-types.ts`:

  - `CreditCardDto` (id, name, limit, closingDay, dueDay, budgetId)
  - `CreateCreditCardRequestDto`
  - `UpdateCreditCardRequestDto`
  - `DeleteCreditCardRequestDto`
  - `CreateCreditCardResponseDto`
  - `UpdateCreditCardResponseDto`
  - `DeleteCreditCardResponseDto`
  - `ListCreditCardsResponseDto`

- `credit-card-bill-types.ts`:

  - `CreditCardBillDto` (id, creditCardId, closingDate, dueDate, amount, paid)
  - `CreateCreditCardBillRequestDto`
  - `UpdateCreditCardBillRequestDto`
  - `DeleteCreditCardBillRequestDto`
  - `PayCreditCardBillRequestDto` (creditCardBillId, accountId, userId, budgetId, amount, paymentCategoryId)
  - `ReopenCreditCardBillRequestDto` (creditCardBillId, userId, budgetId, justification)
  - Response DTOs correspondentes
  - `ListCreditCardBillsResponseDto`

- `index.ts`: exports

#### Serviços (`src/app/core/services/credit-card/`)

- `credit-card-api/credit-card-api.service.ts`:

  - `listCreditCards(budgetId)`: Observable<CreditCardDto[]>
  - `createCreditCard(dto)`: Observable<string | null>
  - `updateCreditCard(dto)`: Observable<boolean>
  - `deleteCreditCard(dto)`: Observable<boolean>
  - Signals: `loading`, `error`

- `credit-card-api/credit-card-api.service.spec.ts`: testes unitários

- `credit-card-state/credit-card.state.ts`:

  - Signals privados: `_creditCards`, `_bills`, `_loading`, `_error`
  - Readonly getters: `creditCards()`, `bills()`, `loading()`, `error()`
  - Computed signals: `hasCreditCards()`, `creditCardsByBudgetId()`, `billsByCreditCardId()`
  - Métodos:
    - `loadCreditCards()`: Obtém `budgetId` e chama API
    - `loadCreditCardBills(creditCardId?, budgetId?)`: Carrega faturas
    - `createCreditCard(dto)`: Cria e recarrega
    - `updateCreditCard(dto)`: Atualiza e recarrega
    - `deleteCreditCard(dto)`: Exclui e recarrega
    - `createCreditCardBill(dto)`: Cria fatura e recarrega
    - `updateCreditCardBill(dto)`: Atualiza fatura e recarrega
    - `deleteCreditCardBill(dto)`: Exclui fatura e recarrega
    - `payCreditCardBill(dto)`: Paga fatura e recarrega
    - `reopenCreditCardBill(dto)`: Reabre fatura e recarrega

- `credit-card-state/credit-card.state.spec.ts`: testes unitários

#### Feature (`src/app/features/credit-cards/`)

- `credit-cards.routes.ts`: Rotas lazy loading

  - `''`: Página principal
  - `'new'`: Modal de criação (via data)
  - `':id/edit'`: Modal de edição (via data)

- `pages/credit-cards/credit-cards.page.ts`: Página principal

  - Listagem de cartões em grid
  - Botões: "Novo Cartão", "Nova Fatura"
  - Modais condicionais baseados em route data
  - Estados: loading, error, empty, success

- `pages/credit-cards/credit-cards.page.spec.ts`: testes

- `components/credit-card-form/credit-card-form.component.ts`: Formulário de cartão

  - Campos: nome, limite, dia fechamento, dia vencimento
  - Validações: required, limites numéricos (1-31 para dias, > 0 para limite)
  - Usa `os-modal-template` e `os-form-template`

- `components/credit-card-form/credit-card-form.component.spec.ts`: testes

- `components/credit-card-bill-form/credit-card-bill-form.component.ts`: Formulário de fatura

  - Campos: cartão (select), data fechamento, data vencimento, valor
  - Validações: required, valor > 0

- `components/credit-card-bill-form/credit-card-bill-form.component.spec.ts`: testes

- `components/pay-bill-modal/pay-bill-modal.component.ts`: Modal de pagamento

  - Campos: conta (select), categoria de pagamento (select), valor (readonly)
  - Integração com `TransactionService` para criar transação

- `components/pay-bill-modal/pay-bill-modal.component.spec.ts`: testes

- `components/reopen-bill-modal/reopen-bill-modal.component.ts`: Modal de reabertura

  - Campo: justificativa (textarea, required)

- `components/reopen-bill-modal/reopen-bill-modal.component.spec.ts`: testes

- `components/confirm-delete-modal/confirm-delete-modal.component.ts`: Modal de confirmação

  - Reutilizar padrão de Accounts

- `components/confirm-delete-modal/confirm-delete-modal.component.spec.ts`: testes

#### UI Components (`src/app/shared/ui-components/molecules/credit-card-card/`)

- `credit-card-card.component.ts`: Card de cartão

  - Similar a `account-card`, exibe: nome, limite, dias de fechamento/vencimento
  - Ações: editar, excluir
  - Lista de faturas associadas (expandível)

- `credit-card-card.component.scss`: estilos

- `credit-card-card.component.spec.ts`: testes

- `index.ts`: exports

### Estrutura de Diretórios

```
dtos/credit-card/
├── credit-card-types.ts
├── credit-card-bill-types.ts
└── index.ts

src/app/core/services/credit-card/
├── credit-card-api/
│   ├── credit-card-api.service.ts
│   └── credit-card-api.service.spec.ts
└── credit-card-state/
    ├── credit-card.state.ts
    └── credit-card.state.spec.ts

src/app/features/credit-cards/
├── credit-cards.routes.ts
├── pages/
│   └── credit-cards/
│       ├── credit-cards.page.ts
│       ├── credit-cards.page.scss
│       └── credit-cards.page.spec.ts
└── components/
    ├── credit-card-form/
    ├── credit-card-bill-form/
    ├── pay-bill-modal/
    ├── reopen-bill-modal/
    └── confirm-delete-modal/

src/app/shared/ui-components/molecules/credit-card-card/
├── credit-card-card.component.ts
├── credit-card-card.component.scss
├── credit-card-card.component.spec.ts
└── index.ts
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Clean Architecture**: Contratos (DTOs), serviços de API, estado reativo, UI desacoplada
- **Signals para estado**: `signal()`, `computed()`, `effect()` para reatividade
- **Standalone Components**: Sem NgModules, componentes standalone
- **Change Detection OnPush**: Para otimização de performance
- **Input/Output Functions**: Usar `input()` e `output()` ao invés de decorators
- **Reactive Forms**: Formulários com validação reativa
- **Padrão Accounts**: Estrutura idêntica para consistência

### Decisões Arquiteturais

- **Estado global de cartões**: `CreditCardState` em `core/services` para reuso em Transactions e Dashboard

  - **Alternativas**: Serviço local na feature com injeção cruzada
  - **Justificativa**: Cartões são consumidos por múltiplas features; estado compartilhado minimiza duplicação

- **Separação API/Estado**: `CreditCardApiService` isolado do estado

  - **Alternativas**: Mesclar API + estado em um serviço único
  - **Justificativa**: Separação de responsabilidades e testabilidade

- **Queries GET no MSW**: Adicionar handlers para desenvolvimento/testes

  - **Alternativas**: Aguardar implementação no backend
  - **Justificativa**: Permite desenvolvimento completo do frontend sem depender do backend

- **Componente de Card reutilizável**: `credit-card-card` como molecule
  - **Alternativas**: Card inline na página
  - **Justificativa**: Reutilização e consistência visual

## 📦 Dependências e Integrações

### Dependências Existentes

- `ApiService`: Para chamadas HTTP
- `AuthService`: Para autenticação
- `BudgetSelectionService`: Para seleção de orçamento
- `AccountState`: Para seleção de conta no pagamento
- `TransactionService`: Para criação de transação no pagamento
- MSW em `core/mocks/handlers`

### Novas Dependências

- Nenhuma. Todas as dependências necessárias já estão no projeto.

### Integrações

- **Endpoints backend** (mutations já implementados):

  - `POST /api/credit-card/create-credit-card`
  - `POST /api/credit-card/update-credit-card`
  - `POST /api/credit-card/delete-credit-card`
  - `POST /api/credit-card-bill/create-credit-card-bill`
  - `POST /api/credit-card-bill/update-credit-card-bill`
  - `POST /api/credit-card-bill/delete-credit-card-bill`
  - `POST /api/credit-card-bill/pay-credit-card-bill`
  - `POST /api/credit-card-bill/reopen-credit-card-bill`

- **Queries GET (MSW - adicionar nesta demanda)**:

  - `GET /api/credit-cards?budgetId=...`
  - `GET /api/credit-card-bills?creditCardId=...&budgetId=...`

- **Integrações com features**:
  - **Transactions**: Campo "Forma de Pagamento" com select de cartões
  - **Menu/Sidebar**: Item de navegação "Cartões de Crédito"
  - **Dashboard**: Widget opcional (futuro)
  - **Budgets**: Seção "Cartões do Orçamento" (futuro)

## 🔄 Fluxo de Dados

### Listagem de Cartões

1. Usuário acessa `/credit-cards`
2. `CreditCardsPage` injeta `CreditCardState` e `BudgetSelectionService`
3. `effect()` observa mudanças em `selectedBudgetId`
4. Quando `budgetId` muda, chama `creditCardState.loadCreditCards()`
5. `CreditCardState` chama `CreditCardApiService.listCreditCards(budgetId)`
6. API retorna lista de cartões
7. Estado atualiza signal `_creditCards`
8. Página reage e renderiza cards via `@for`

### Criação de Cartão

1. Usuário clica "Novo Cartão"
2. Rota `/credit-cards/new` com `data: { modalMode: 'create' }`
3. `CreditCardsPage` detecta `modalMode === 'create'` e mostra `CreditCardFormComponent`
4. Usuário preenche formulário e submete
5. `CreditCardFormComponent` chama `creditCardState.createCreditCard(dto)`
6. `CreditCardState` chama `CreditCardApiService.createCreditCard(dto)`
7. API retorna ID do cartão criado
8. `CreditCardState` recarrega lista automaticamente
9. Modal fecha e lista atualiza

### Pagamento de Fatura

1. Usuário clica "Pagar" em uma fatura
2. `PayBillModalComponent` abre com dados da fatura
3. Usuário seleciona conta e categoria de pagamento
4. Ao submeter, `PayBillModalComponent` chama `creditCardState.payCreditCardBill(dto)`
5. `CreditCardState` chama `CreditCardApiService.payCreditCardBill(dto)`
6. Backend processa pagamento e cria transação automaticamente
7. API retorna sucesso
8. `CreditCardState` recarrega faturas
9. Fatura aparece como "paga"

## 🧪 Considerações de Teste

### Testes Unitários

- **CreditCardApiService**:

  - Todos os métodos HTTP (list, create, update, delete para cartões e faturas)
  - Tratamento de erros (401, 400, 500)
  - Signals de loading e error

- **CreditCardState**:

  - Signals e computed values
  - Métodos de mutation (create, update, delete, pay, reopen)
  - Integração com `BudgetSelectionService`
  - Recarregamento automático após mutations

- **Componentes**:
  - Formulários: validações, submissão, cancelamento
  - Modais: abertura, fechamento, confirmação
  - Página: estados (loading, error, empty, success), ações de botões

### Testes de Integração

- Fluxo completo: criar cartão → criar fatura → pagar fatura → reabrir fatura
- Integração com `BudgetSelectionService`: filtragem automática
- Integração com `AccountState`: seleção de conta no pagamento
- Integração com `TransactionService`: criação de transação no pagamento

### Mocks e Fixtures

- Dados mockados em MSW handlers
- Fixtures de teste para DTOs
- Mocks de serviços (BudgetSelectionService, AccountState, TransactionService)

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Queries GET no MSW**: Desenvolvimento pode prosseguir sem backend, mas requer sincronização quando backend implementar
- **Estado global**: Maior acoplamento, mas facilita reuso e consistência
- **Separação API/Estado**: Mais arquivos, mas melhor testabilidade e manutenibilidade

### Riscos Identificados

- **Sincronização com Backend**: Queries GET mockadas podem divergir da implementação real

  - **Mitigação**: Documentar contratos esperados e validar quando backend implementar

- **Performance com muitas faturas**: Listagem pode ficar lenta

  - **Mitigação**: Considerar paginação futura se necessário

- **Integração com Transações**: Garantir que pagamento cria transação corretamente

  - **Mitigação**: Testes de integração e validação com backend

- **Validações de Negócio**: Frontend apenas validações básicas
  - **Mitigação**: Backend processa regras; frontend mostra erros do backend claramente

## 🎨 UI Components and Layout

### Design System Integration

A feature Credit Cards utiliza extensivamente os componentes do Design System OrçaSonhos, seguindo o padrão Atomic Design:

**Atoms Reutilizados:**

- `os-button` - Ações principais e secundárias
- `os-input` - Campos de texto e número
- `os-select` - Seleção de cartão e conta
- `os-label` - Labels de formulários
- `os-icon` - Ícones decorativos e de ação
- `os-badge` - Status de faturas
- `os-money-display` - Exibição de valores monetários
- `os-money-input` - Campos de valor
- `os-date-input` - Datas de fechamento e vencimento
- `os-spinner` - Estados de loading

**Molecules Reutilizadas:**

- `os-card` - Container para cards de cartões
- `os-form-field` - Campos de formulário com validação
- `os-form-group` - Agrupamento de campos

**Organisms Reutilizados:**

- `os-modal` - Modais de formulários e confirmações
- `os-page-header` - Cabeçalho da página

**Templates Reutilizados:**

- `os-modal-template` - Template para todos os modais (formulários, pagamento, reabertura, confirmação)

### New Components Required

**credit-card-card** (Molecule)

- Similar ao `account-card`, exibe informações do cartão
- Suporta expansão para mostrar faturas associadas
- Ações: editar, excluir
- Responsivo: 1 coluna mobile, 2 tablet, 3-4 desktop
- Acessível: ARIA labels, keyboard navigation, focus management

**credit-card-bill-item** (Molecule - dentro do card)

- Item de fatura dentro do card expandido
- Mostra informações resumidas: valor, vencimento, status
- Ações: pagar (se aberta), reabrir (se paga)

**Componentes de Feature:**

- `CreditCardFormComponent` - Formulário de cartão (criar/editar)
- `CreditCardBillFormComponent` - Formulário de fatura (criar/editar)
- `PayBillModalComponent` - Modal de pagamento de fatura
- `ReopenBillModalComponent` - Modal de reabertura de fatura
- `ConfirmDeleteModalComponent` - Modal de confirmação de exclusão

**Detalhes completos em:** `layout-specification.md`

### Layout Architecture

**Estrutura da Página:**

- Header com título, subtítulo e ações (Novo Cartão, Nova Fatura)
- Main content com grid responsivo de cards
- Estados: loading, error, empty, success

**Responsividade:**

- Mobile-first approach
- Breakpoints: < 576px (mobile), 576-991px (tablet), >= 992px (desktop)
- Grid: 1 coluna mobile, 2 tablet, 3-4 desktop (máx 4)

**Modais:**

- Todos os modais usam `os-modal-template`
- Full screen ou quase full screen em mobile
- Tamanho médio/grande em tablet/desktop
- Focus trap e return focus implementados

### Performance Considerations

**Lazy Loading:**

- Feature completa em lazy loading (`/credit-cards`)
- Componentes de modal carregados sob demanda

**Change Detection:**

- OnPush em todos os componentes
- Signals para estado reativo
- Computed signals para derivações

**Bundle Size:**

- Estimativa: ~15-20KB adicional
- Mitigação: Lazy loading e tree-shaking

**Critical CSS:**

- Estilos críticos para first paint: Header e grid básico
- Cards podem ser carregados progressivamente

**Detalhes completos em:** `layout-specification.md`

## 📋 Lista de Implementação

### Backend/API

- [ ] Criar DTOs em `dtos/credit-card/`
- [ ] Implementar `CreditCardApiService` com todos os métodos
- [ ] Implementar `CreditCardState` com signals e mutations
- [ ] Adicionar queries GET aos handlers MSW

### UI Components

- [ ] Criar `credit-card-card` component (molecule) conforme layout-specification
- [ ] Criar `credit-card-bill-item` component (molecule) para faturas dentro do card
- [ ] Criar `CreditCardsPage` com listagem responsiva (mobile/tablet/desktop)
- [ ] Implementar estados da página (loading, error, empty, success)
- [ ] Criar `CreditCardFormComponent` (criar/editar) usando `os-modal-template`
- [ ] Criar `CreditCardBillFormComponent` (criar/editar) usando `os-modal-template`
- [ ] Criar `PayBillModalComponent` usando `os-modal-template`
- [ ] Criar `ReopenBillModalComponent` usando `os-modal-template`
- [ ] Criar `ConfirmDeleteModalComponent` usando `os-modal-template`
- [ ] Implementar responsividade (mobile-first, breakpoints)
- [ ] Implementar acessibilidade (ARIA, keyboard navigation, screen reader)
- [ ] Aplicar design tokens (`--os-*`) consistentemente

### Integração e Configuração

- [ ] Configurar rotas lazy loading
- [ ] Adicionar item no menu/sidebar
- [ ] Integrar com Transactions (campo "Forma de Pagamento")

### Testes e Validação

- [ ] Testes unitários (cobertura > 80%)
- [ ] Testes de integração
- [ ] Validação de lint/type-check

## 📚 Referências

- **Meta Specs**: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- **Padrão de Referência**: Feature Accounts (`src/app/features/accounts/`)
- **MSW Handlers**: `src/app/core/mocks/handlers/credit-cards.handlers.ts`
- **Account Card**: `src/app/shared/ui-components/molecules/account-card/`
- **Layout Specification**: `sessions/OS-230/layout-specification.md` - Especificação completa de UI/UX
- **Backlog**: `temp/backlog-features-incremental.md` - Card 12
- **Jira Issue**: [OS-230](https://orca-sonhos.atlassian.net/browse/OS-230)
