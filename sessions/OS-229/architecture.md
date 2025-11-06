# Accounts - Gestão de Contas (CRUD, tipos, saldo, transfer e reconcile) - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- Padrões estabelecidos no projeto:
  - DTOs centralizados em `dtos/*` (budget, goal, transaction já existem).
  - Serviços centrais em `src/app/core/services/*` com signals para estado (ex.: `BudgetService`, `BudgetState`).
  - Serviços por feature em `src/app/features/<feature>/services/*` (ex.: `TransactionsApiService`).
  - Seleção de orçamento global via `BudgetSelectionService`.
  - MSW Handlers existentes para `accounts` em `src/app/core/mocks/handlers/accounts.handlers.ts`.

### Mudanças Propostas

- Criar DTOs de Accounts em `dtos/account/*` alinhados ao backend.
- Implementar `AccountsApiService` (chamadas HTTP) e `AccountState` (estado reativo com signals):
  - Listar contas por orçamento atual.
  - Criar, atualizar, excluir (com manejo de erro para bloqueio quando houver transações).
  - Transferir entre contas e reconciliar (valor final em centavos; backend calcula o ajuste).
- Criar a feature `features/accounts` com páginas/rotas e componentes:
  - Listagem `/accounts`, criação `/accounts/new`, edição `/accounts/:id/edit` (modal sobre a lista).
  - Formulários reativos com validações.
- Integrações:
  - Dashboard: card “Contas” + ações rápidas “Nova Conta” e “Transferir entre contas”.
  - Budgets: seção “Contas do orçamento” com CTA para criar com `budgetId` atual.
  - Transactions: filtro por conta e campo “Conta” obrigatório no formulário (usar `AccountState`).
  - Goals: links de navegação para `/accounts` quando relevante.
  - Menu/side-nav: adicionar rota `/accounts`.

### Impactos

- `features/dashboard`, `features/budget`, `features/transactions`, `features/goals`, `app.routes.ts`/layout.
- Estado global para fornecer `accountOptions` em múltiplas features.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/app.routes.ts`: adicionar rotas lazy para `/accounts`.
- `src/app/core/layout/app-layout.component.ts`: incluir item de navegação para `/accounts` (menu/side-nav).
- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`: integrar card “Contas” (navegar para `/accounts`) e ações rápidas.
- `src/app/features/transactions/pages/transactions/transactions.page.ts`: consumir `AccountState` para opções de filtro/seleção.

### Novos Arquivos a Criar

- DTOs (contratos front-back):

  - `dtos/account/index.ts`
  - `dtos/account/account-types.ts` (enum/tipos de conta)
  - `dtos/account/list-accounts-response-dto.ts`
  - `dtos/account/create-account-request-dto.ts`
  - `dtos/account/create-account-response-dto.ts`
  - `dtos/account/update-account-request-dto.ts`
  - `dtos/account/update-account-response-dto.ts`
  - `dtos/account/delete-account-request-dto.ts`
  - `dtos/account/delete-account-response-dto.ts`
  - `dtos/account/reconcile-account-request-dto.ts` (valor final em centavos)
  - `dtos/account/reconcile-account-response-dto.ts`
  - `dtos/account/transfer-between-accounts-request-dto.ts`
  - `dtos/account/transfer-between-accounts-response-dto.ts`

- Core services e estado:

  - `src/app/core/services/account/accounts-api/accounts-api.service.ts` (GET/POST endpoints do backend)
  - `src/app/core/services/account/accounts-api/accounts-api.service.spec.ts`
  - `src/app/core/services/account/account-state/account.state.ts` (signals: lista, loading, error; métodos: load/create/update/delete/transfer/reconcile)
  - `src/app/core/services/account/account-state/account.state.spec.ts`

- Feature Accounts (UI/rotas):

  - `src/app/features/accounts/accounts.routes.ts`
  - `src/app/features/accounts/pages/accounts/accounts.page.ts` (lista)
  - `src/app/features/accounts/components/account-form/account-form.component.ts` (criar/editar)
  - `src/app/features/accounts/components/transfer-form/transfer-form.component.ts`
  - `src/app/features/accounts/components/reconcile-form/reconcile-form.component.ts`

- Testes:
  - `*.spec.ts` cobrindo serviços, estado e componentes (≥ 80%).

### Estrutura de Diretórios

- `dtos/account/*`
- `src/app/core/services/account/accounts-api/` (service + spec)
- `src/app/core/services/account/account-state/` (state + spec)
- `src/app/features/accounts/{pages,components,services?}`

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- Clean Architecture: contratos (DTOs), serviços de API, estado reativo, UI desacoplada.
- Signals para estado e `computed()` para derivados.
- Standalone Components com `ChangeDetectionStrategy.OnPush`.
- Inputs/outputs via `input()`/`output()`; bindings no `host`.

### Decisões Arquiteturais

- **Estado global de contas**: `AccountState` em `core/services` para reuso em Transactions, Goals e Dashboard.
  - **Alternativas**: serviço local na feature com injeção cruzada.
  - **Justificativa**: contas são consumidas por múltiplas features; estado compartilhado minimiza duplicação e latência.
- **Serviço de API dedicado**: `AccountsApiService` para isolar contratos HTTP do estado.
  - **Alternativas**: mesclar API + estado em um serviço único.
  - **Justificativa**: separação de responsabilidades e testabilidade.

## 📦 Dependências e Integrações

### Dependências Existentes

- `ApiService`, `AuthService`, `BudgetSelectionService`, mocks MSW em `core/mocks/handlers`.

### Novas Dependências

- Nenhuma.

### Integrações

- Endpoints backend (alinhados ao ticket OS-229):
  - GET `/accounts?budgetId=...`
  - POST `/account/create-account`
  - POST `/account/update-account`
  - POST `/account/delete-account`
  - POST `/account/reconcile-account` (front envia valor final em centavos)
  - POST `/account/transfer-between-accounts`

## 🔄 Fluxo de Dados

1. `AccountState.loadAccounts()` obtém `budgetId` do `BudgetSelectionService` e chama `AccountsApiService.list`.
2. UI consome `AccountState.accounts()` e derivados para renderização.
3. Mutations (create/update/delete/transfer/reconcile) chamam `AccountsApiService.*` e atualizam estado (ou recarregam lista, conforme retorno do backend).
4. Transactions consome `AccountState` para popular `accountOptions` (filtro e formulário), garantindo consistência `budgetId` ↔ `accountId`.

## 🧪 Considerações de Teste

### Testes Unitários

- `AccountsApiService`: chamadas e tratamento de erros (bloqueio de exclusão, validações 4xx/5xx).
- `AccountState`: transições de estado, `computed()` e atualização após mutations.

### Testes de Integração

- Páginas/Componentes: lista, forms (account/transfer/reconcile), rotas profundas e interações (dashboard/budgets/transactions/goals).
- Mocks MSW: validar caminhos dos endpoints e contratos.

### Mocks e Fixtures

- Fixtures para listagem de contas por `budgetId` e respostas de mutation.

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- Atualização por recarga da lista após mutations (simplicidade > otimização prematura de write-through no estado).

### Riscos Identificados

- Concorrência com transações alterando saldos durante transfer/reconcile (sincronização via recarga após operação).
- UX em bloqueio de exclusão (mensagem clara e CTAs auxiliares).

## 🎨 UI Components and Layout

### Design System Integration

**Reutilização Máxima de Componentes Existentes:**

- **Atoms**: `os-button`, `os-icon`, `os-input`, `os-select`, `os-money-input`, `os-label`, `os-badge`, `os-spinner`
- **Molecules**: `os-form-field`, `os-form-group`, `os-card`, `os-money-display`, `os-filter-bar`
- **Organisms**: `os-page-header`, `os-data-grid` (via `os-list-template`), `os-modal`
- **Templates**: `os-list-template` (adaptado para cards), `os-form-template` (formulários), `os-modal-template` (modais)

**Componentes Reutilizados:**

- `os-list-template` para estrutura principal da lista
- `os-form-field` e `os-form-group` para todos os formulários
- `os-card` como base para cards de conta (customização via slot)
- `os-page-header` para header com ações
- `os-modal-template` para modais de ações secundárias

### New Components Required

**Novos Componentes do Design System:**

1. **AccountCard** (Molecule)

   - Card individual para exibir conta na lista
   - Props: `account` (DTO), `actions` (editar, excluir)
   - Slots: `header`, `content`, `actions`
   - Responsivo: 1 col (mobile) → 2 cols (tablet) → 3-4 cols (desktop)

2. **AccountTypeBadge** (Atom)

   - Badge com ícone e cor específica por tipo de conta
   - Props: `type` (CORRENTE, POUPANCA, etc.), `icon`, `color`
   - Variants: Cores por tipo (primary, success, warning, secondary, neutral)

3. **TransferForm** (Molecule)

   - Formulário específico para transferência entre contas
   - Validações: mesmo orçamento, saldo suficiente, origem != destino
   - Feedback: Mensagens de erro claras e específicas

4. **ReconcileForm** (Molecule)
   - Formulário para reconciliação de saldo
   - Campo: Valor final esperado (money-input)
   - Helper text: Explicação sobre processo automático de ajuste

**Componentes de Feature:**

5. **AccountFormComponent** (Component)
   - Formulário de criação/edição de conta
   - Usa `os-form-template` ou `os-modal-template`
   - Campos: Nome (obrigatório), Tipo (obrigatório), Saldo Inicial (>= 0)

**Detalhes completos em:** `layout-specification.md`

### Layout Architecture

**Estrutura Principal:**

- **Página de Listagem** (`AccountsPage`):

  - Usa `os-list-template` como base
  - Layout de cards via `os-data-grid` (variant: cards)
  - Header com ações: Nova Conta, Transferir, Reconciliar
  - Empty state com CTA para criar primeira conta
  - Loading states com skeleton screens

- **Modais de Formulário**:
  - `AccountFormModal`: Criação/edição via `os-modal-template`
  - `TransferModal`: Transferência via `os-modal-template` + `TransferForm`
  - `ReconcileModal`: Reconciliação via `os-modal-template` + `ReconcileForm`
  - `ConfirmModal`: Confirmação de exclusão via `os-modal-template`

**Responsividade:**

- **Mobile-first**: Stack vertical, cards full width, modais quase full screen
- **Tablet**: Grid 2 colunas, modais centralizados (600px)
- **Desktop**: Grid 3-4 colunas, modais centralizados (700px), hover states

**Integração com Estado:**

- Consumo de `AccountState.accounts()` para lista
- Métodos `create()`, `update()`, `delete()`, `transfer()`, `reconcile()` para mutations
- Atualização reativa de saldos após operações (signals)

### Performance Considerations

**Otimizações de UI:**

- **Lazy Loading**: Feature `accounts` lazy loaded via rotas
- **OnPush Change Detection**: Todos os componentes com `ChangeDetectionStrategy.OnPush`
- **Computed Signals**: Filtros, ordenação e derivações via `computed()`
- **Skeleton Screens**: Loading states otimizados para perceived performance
- **Bundle Size**: ~15KB adicional (componentes novos)

**Critical Rendering Path:**

- Estilos críticos inline ou no bundle inicial
- Componentes não críticos (modais) carregados sob demanda
- Imagens/ícones otimizados (SVG ou font icons)

### Acessibilidade (WCAG 2.1 AA)

**Implementação:**

- **Keyboard Navigation**: Tab order lógico, Enter/Space para ações, Esc fecha modais
- **ARIA**: Labels, live regions, landmarks, form associations
- **Screen Reader**: Estrutura semântica, headings hierárquicos, alt text
- **Visual**: Contraste >= 4.5:1, focus visible, zoom até 200%
- **Motion**: Respeita `prefers-reduced-motion`

**Detalhes completos em:** `layout-specification.md` (seção ♿ Accessibility Specifications)

### Alinhamento com Funcionalidades Core

**Sistema Dual: Orçamentos + Contas:**

- **Seletor de Orçamento**: Visível no header (via `BudgetSelectionService`)
- **Filtro Automático**: Lista apenas contas do orçamento atual
- **Separação Visual**: Cards destacam tipo de conta e saldo atual

**Múltiplos Orçamentos:**

- Contas filtradas automaticamente por `budgetId` atual
- Criação de conta já vinculada ao orçamento atual

**Compartilhamento Familiar:**

- Interface clara para múltiplos usuários
- Ações colaborativas (transferências, reconciliações) visíveis para todos

**Detalhes completos em:** `layout-specification.md`

## 📋 Lista de Implementação

### DTOs e Contratos

- [ ] Criar DTOs em `dtos/account/*` e exportar em `index.ts`.
- [ ] Criar `account-types.ts` com enum de tipos de conta.

### Core Services

- [ ] Implementar `AccountsApiService` em `src/app/core/services/account/accounts-api/` com endpoints do backend.
- [ ] Implementar `AccountState` em `src/app/core/services/account/account-state/` com signals e integrações com `BudgetSelectionService`.

### UI Components - Design System

- [ ] Criar `AccountCard` (Molecule) em `src/app/shared/ui-components/molecules/account-card/`.
- [ ] Criar `AccountTypeBadge` (Atom) em `src/app/shared/ui-components/atoms/account-type-badge/`.
- [ ] Criar `TransferForm` (Molecule) em `src/app/shared/ui-components/molecules/transfer-form/`.
- [ ] Criar `ReconcileForm` (Molecule) em `src/app/shared/ui-components/molecules/reconcile-form/`.

### Feature Components

- [ ] Criar rotas `features/accounts/accounts.routes.ts` para `/accounts`.
- [ ] Criar `AccountsPage` (lista) usando `os-list-template` com layout de cards.
- [ ] Criar `AccountFormComponent` para criação/edição (usa `os-modal-template`).
- [ ] Criar componentes de modal: `TransferModal`, `ReconcileModal`, `ConfirmModal`.

### Integrações

- [ ] Integrar menu/side-nav (adicionar rota `/accounts`).
- [ ] Integrar Dashboard (card "Contas" + ações rápidas "Nova Conta" e "Transferir").
- [ ] Integrar Budgets (seção "Contas do orçamento" com CTA).
- [ ] Integrar Transactions (filtros e formulário obrigando conta do orçamento atual).
- [ ] Integrar Goals (links de navegação quando relevante).

### Acessibilidade e Responsividade

- [ ] Implementar keyboard navigation completa.
- [ ] Adicionar ARIA attributes (labels, live regions, landmarks).
- [ ] Testar screen reader (NVDA/JAWS).
- [ ] Validar contraste (>= 4.5:1).
- [ ] Implementar estados responsivos (mobile, tablet, desktop).
- [ ] Validar touch targets (>= 44px em mobile).

### Testes

- [ ] Cobertura de testes ≥ 80% (serviços/estado/componentes).
- [ ] Testes unitários de componentes de UI.
- [ ] Testes de integração de formulários e modais.
- [ ] Testes de acessibilidade (keyboard, screen reader).

## 📚 Referências

- [Meta Specs]: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- [Documentação]: `ApiService`, `AuthService`, `BudgetSelectionService`, MSW handlers
- [Exemplos]: `BudgetService`/`BudgetState`, `TransactionsApiService`, `transactions.page.ts`
- [Layout Specification]: `sessions/OS-229/layout-specification.md` - Especificação detalhada de UI/UX e acessibilidade
