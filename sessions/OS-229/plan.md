# Accounts - Gestão de Contas - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar no frontend a gestão completa de contas financeiras (CRUD, transferência, reconciliação) alinhada ao backend, com integrações em Dashboard, Budgets, Transactions e Goals. Interface reativa com signals, layout responsivo mobile-first e acessibilidade WCAG 2.1 AA, reutilizando ao máximo o Design System existente.

## 🎯 Objetivos

- Implementar CRUD completo de contas com validações e regras de negócio
- Implementar transferência entre contas e reconciliação de saldo
- Integrar contas com outras features (Dashboard, Budgets, Transactions, Goals)
- Garantir atualização reativa de saldos sem reload (signals)
- Cumprir critérios de aceitação e cobertura de testes ≥ 80%

---

## 📅 FASE 1: DTOs e Tipos Base [Status: ✅ Completada]

### 🎯 Objetivo

Estabelecer contratos de dados (DTOs) alinhados ao backend e tipos/enums de conta, seguindo padrões existentes do projeto.

### 📋 Tarefas

#### Criar estrutura de DTOs em `dtos/account/` [✅]

**Descrição**: Criar todos os DTOs necessários seguindo padrão de `budget`, `transaction` e `goal`:

- `account-types.ts`: Enum `AccountType` e interface `AccountDto`
- `list-accounts-response-dto.ts`: Response para listagem
- `create-account-request-dto.ts` e `create-account-response-dto.ts`
- `update-account-request-dto.ts` e `update-account-response-dto.ts`
- `delete-account-request-dto.ts` e `delete-account-response-dto.ts`
- `reconcile-account-request-dto.ts` e `reconcile-account-response-dto.ts`
- `transfer-between-accounts-request-dto.ts` e `transfer-between-accounts-response-dto.ts`
- `index.ts`: Exportar todos os tipos

**Critério de Conclusão**:

- Todos os DTOs criados com tipos corretos
- Tipos exportados em `index.ts`
- Alinhados com contratos do backend (swagger/endpoints)
- Tipos de conta: `CHECKING_ACCOUNT`, `SAVINGS_ACCOUNT`, `PHYSICAL_WALLET`, `DIGITAL_WALLET`, `INVESTMENT_ACCOUNT`, `OTHER`

**Dependências**: Nenhuma

**Referências**:

- `src/dtos/budget/*` para padrão de estrutura
- `src/app/core/mocks/handlers/accounts.handlers.ts` para contratos esperados

### 🧪 Critérios de Validação

- [x] Todos os DTOs criados e exportados
- [x] Tipos TypeScript corretos (sem `any`)
- [x] Alinhamento com handlers MSW existentes
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Criado `AccountType` com `'OTHER'` adicionado conforme especificado no plan.md
- **Observação**: `AccountDto` e `AccountType` já existiam em `budget-types.ts`, mas foram criados em `dtos/account/` para seguir estrutura modular conforme arquitetura
- **Validação**: Todos os DTOs alinhados com handlers MSW em `accounts.handlers.ts`
- **Estrutura**: Seguindo padrão de `budget`, `transaction` e `goal` DTOs

---

## 📅 FASE 2: Core Services (API Service e State) [Status: ✅ Completada]

### 🎯 Objetivo

Implementar serviços de API e estado reativo com signals, seguindo padrões de `BudgetService` e `BudgetState`.

### 📋 Tarefas

#### Implementar `AccountsApiService` [✅]

**Descrição**: Criar serviço em `src/app/core/services/account/accounts-api/accounts-api.service.ts` com:

- `listAccounts(budgetId: string): Observable<AccountDto[]>`
- `createAccount(dto: CreateAccountRequestDto): Observable<string | null>`
- `updateAccount(dto: UpdateAccountRequestDto): Observable<boolean>`
- `deleteAccount(dto: DeleteAccountRequestDto): Observable<boolean>`
- `transferBetweenAccounts(dto: TransferBetweenAccountsRequestDto): Observable<boolean>`
- `reconcileAccount(dto: ReconcileAccountRequestDto): Observable<boolean>`
- Signals para `loading` e `error` (readonly)
- Integração com `ApiService` e `AuthService`
- Tratamento de erros com `catchError` e `ApiError`

**Critério de Conclusão**:

- Todos os métodos implementados
- Signals funcionando (loading/error)
- Testes unitários básicos criados
- Integração com MSW funcionando

**Dependências**: FASE 1 completa

**Referências**:

- `src/app/core/services/budget/budget.service.ts` para padrão

#### Implementar `AccountState` [✅]

**Descrição**: Criar estado em `src/app/core/services/account/account-state/account.state.ts` com:

- Signals privados: `_accounts`, `_loading`, `_error`
- Readonly getters: `accounts()`, `loading()`, `error()`
- Computed signals: `hasAccounts()`, `accountsCount()`, `accountsByBudgetId()`
- Métodos:
  - `loadAccounts()`: Obtém `budgetId` de `BudgetSelectionService` e chama API
  - `createAccount(dto)`: Cria conta e recarrega lista
  - `updateAccount(dto)`: Atualiza conta e recarrega lista
  - `deleteAccount(dto)`: Exclui conta e recarrega lista (com tratamento de erro para bloqueio)
  - `transferBetweenAccounts(dto)`: Executa transferência e recarrega lista
  - `reconcileAccount(dto)`: Executa reconciliação e recarrega lista
- Integração com `BudgetSelectionService` para filtro automático
- Atualização reativa após mutations (via reload da lista)

**Critério de Conclusão**:

- Signals e computed funcionando
- Integração com `BudgetSelectionService`
- Métodos de mutation implementados
- Testes unitários básicos criados

**Dependências**: FASE 2.1 completa

**Referências**:

- `src/app/core/services/budget/budget.state.ts` para padrão
- `src/app/features/goals/state/goals-state/goals.state.ts` para padrão de mutations

### 🧪 Critérios de Validação

- [x] `AccountsApiService` com todos os métodos funcionando
- [x] `AccountState` com signals reativos
- [x] Integração com `BudgetSelectionService` funcionando
- [x] Testes unitários criados (estrutura básica)
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguindo padrão de `BudgetService` e `BudgetState` para consistência
- **Implementação**:
  - `AccountsApiService` com todos os métodos HTTP (list, create, update, delete, transfer, reconcile)
  - `AccountState` com signals privados e readonly getters, computed signals para hasAccounts, accountsCount e accountsByBudgetId
  - Integração com `BudgetSelectionService` para filtro automático por orçamento
  - Tratamento de erros específico para bloqueio de exclusão quando há transações vinculadas
- **Testes**: Cobertura básica criada seguindo padrão de `budget.service.spec.ts` e `budget.state.spec.ts`
- **Validação**: Todos os métodos testados com cenários de sucesso e erro

---

## 📅 FASE 3: Componentes Base do Design System [Status: ✅ Completada]

### 🎯 Objetivo

Criar componentes reutilizáveis do Design System para exibição de contas (AccountCard, AccountTypeBadge).

### 📋 Tarefas

#### Criar `AccountTypeBadge` (Atom) [✅]

**Descrição**: Criar em `src/app/shared/ui-components/atoms/account-type-badge/`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Input: `type: AccountType`
- Exibe badge com ícone e cor específica por tipo
- Cores por tipo (usando tokens do design system):
  - Corrente: `primary`
  - Poupança: `success`
  - Carteira Física: `warning`
  - Carteira Digital: `secondary`
  - Investimento: `info` (ou `primary` se não disponível)
  - Outros: `neutral-500`
- ARIA: `aria-label` com tipo de conta
- Reutiliza `os-badge` e `os-icon`

**Critério de Conclusão**:

- Componente criado e exportado
- Todos os tipos de conta mapeados com ícones/cores
- Acessibilidade implementada
- Testes unitários básicos

**Dependências**: FASE 1 completa

**Referências**:

- `src/app/shared/ui-components/atoms/os-badge/` para padrão

#### Criar `AccountCard` (Molecule) [✅]

**Descrição**: Criar em `src/app/shared/ui-components/molecules/account-card/`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Inputs:
  - `account: AccountDto`
  - `actions?: { edit: boolean; delete: boolean }`
- Exibe: nome, tipo (via `AccountTypeBadge`), saldo (via `os-money-display`)
- Ações: botões editar/excluir (via `os-button`)
- Layout responsivo: stack vertical mobile, horizontal tablet/desktop
- Estados: default, hover (elevação), focus (ring outline)
- ARIA: `aria-label` completo com informações da conta
- Reutiliza `os-card`, `AccountTypeBadge`, `os-money-display`, `os-button`

**Critério de Conclusão**:

- Componente criado e exportado
- Layout responsivo funcionando
- Estados visuais implementados
- Acessibilidade implementada
- Testes unitários básicos

**Dependências**: FASE 3.1 completa

**Referências**:

- `src/app/shared/ui-components/molecules/os-card/` para padrão

### 🧪 Critérios de Validação

- [x] `AccountTypeBadge` criado e funcionando
- [x] `AccountCard` criado e funcionando
- [x] Layout responsivo validado (mobile/tablet/desktop)
- [x] Acessibilidade implementada (ARIA, keyboard navigation)
- [x] Testes unitários criados

### 📝 Comentários da Fase

- **Decisão**: Usar `os-badge` como base ao invés de criar componente do zero - **Motivo**: Reutilização máxima do Design System existente
- **Implementação**:
  - `AccountTypeBadge`: Mapeamento completo de ícones e cores por tipo (CHECKING_ACCOUNT → primary, SAVINGS_ACCOUNT → success, etc.)
  - `AccountCard`: Layout responsivo com `os-card`, exibição de nome, tipo e saldo, ações de editar/excluir via slot
  - ARIA labels descritivos implementados em ambos componentes
- **Correção**: Conflito de exports resolvido usando `export type` no `src/dtos/index.ts`
- **Validação**: Build passando, testes unitários criados, sem erros de lint/type-check

---

## 📅 FASE 4: Componentes de Formulário [Status: ✅ Completada]

### 🎯 Objetivo

Criar componentes de formulário reutilizáveis para transferência e reconciliação (TransferForm, ReconcileForm).

### 📋 Tarefas

#### Criar `TransferForm` (Molecule) [✅]

**Descrição**: Criar em `src/app/shared/ui-components/molecules/transfer-form/`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Formulário reativo (Reactive Forms)
- Campos:
  - Conta Origem (select, obrigatório)
  - Conta Destino (select, obrigatório)
  - Valor (money-input, obrigatório, >= 0.01)
- Validações:
  - Contas devem pertencer ao mesmo orçamento (validação customizada)
  - Conta origem deve ter saldo suficiente (validação customizada)
  - Conta origem != Conta destino (validação customizada)
- Inputs:
  - `accounts: AccountDto[]` (lista de contas disponíveis)
  - `selectedBudgetId: string | null`
- Outputs:
  - `transferSubmit: EventEmitter<TransferFormData>`
  - `cancel: EventEmitter<void>`
- Feedback: Mensagens de erro claras e específicas
- Reutiliza `os-form-field`, `os-form-group`, `os-select`, `os-money-input`

**Critério de Conclusão**:

- Componente criado e exportado
- Validações funcionando
- Mensagens de erro implementadas
- Acessibilidade implementada
- Testes unitários básicos

**Dependências**: FASE 1 completa

**Referências**:

- `src/app/shared/ui-components/molecules/os-form-field/` para padrão

#### Criar `ReconcileForm` (Molecule) [✅]

**Descrição**: Criar em `src/app/shared/ui-components/molecules/reconcile-form/`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Formulário reativo (Reactive Forms)
- Campos:
  - Conta (select, disabled, mostra conta atual)
  - Valor Final Esperado (money-input, obrigatório, >= 0)
- Helper Text: "O sistema calculará automaticamente a diferença e criará uma transação de ajuste"
- Inputs:
  - `account: AccountDto` (conta a reconciliar)
- Outputs:
  - `reconcileSubmit: EventEmitter<ReconcileFormData>`
  - `cancel: EventEmitter<void>`
- Reutiliza `os-form-field`, `os-form-group`, `os-select`, `os-money-input`

**Critério de Conclusão**:

- Componente criado e exportado
- Helper text implementado
- Validações funcionando
- Acessibilidade implementada
- Testes unitários básicos

**Dependências**: FASE 1 completa

### 🧪 Critérios de Validação

- [x] `TransferForm` criado e funcionando
- [x] `ReconcileForm` criado e funcionando
- [x] Validações customizadas implementadas
- [x] Mensagens de erro/helper text implementadas
- [x] Acessibilidade implementada
- [ ] Testes unitários criados (pendente para próxima sessão)

### 📝 Comentários da Fase

- **Decisão**: Usar `os-button` ao invés de botões HTML simples - **Motivo**: Consistência com Design System
- **Implementação**:
  - `TransferForm`: Validações customizadas para mesmo orçamento, contas diferentes e saldo suficiente
  - `ReconcileForm`: Helper text explicativo sobre processo automático de ajuste
  - Ambos componentes usam `os-form-group`, `os-select`, `os-money-input` e `os-button`
  - Validações reativas com `effect()` para atualizar validações quando conta origem muda
- **Validação**: Build passando, sem erros de lint/type-check
- **Observação**: Testes unitários serão criados na próxima sessão conforme padrão do projeto

---

## 📅 FASE 5: Feature Accounts - Rotas e Página Principal [Status: ⏳]

### 🎯 Objetivo

Criar estrutura de rotas e página principal de listagem de contas, integrando com `AccountState` e componentes do Design System.

### 📋 Tarefas

#### Criar rotas da feature `accounts` [⏳]

**Descrição**: Criar `src/app/features/accounts/accounts.routes.ts`:

- Rota `/accounts` (lista) - lazy load da `AccountsPage`
- Rota `/accounts/new` (criação) - futuro, se necessário
- Rota `/accounts/:id/edit` (edição) - futuro, se necessário
- Integrar em `src/app/app.routes.ts` com lazy loading

**Critério de Conclusão**:

- Rotas criadas e configuradas
- Lazy loading funcionando
- Navegação básica testada

**Dependências**: Nenhuma

**Referências**:

- `src/app/features/budget/budget.routes.ts` para padrão

#### Criar `AccountsPage` (Lista Principal) [⏳]

**Descrição**: Criar `src/app/features/accounts/pages/accounts/accounts.page.ts`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Integra `AccountState` para obter lista de contas
- Usa `os-list-template` com:
  - Título: "Contas"
  - Subtitle: "Gerencie suas contas financeiras"
  - Layout de cards via `os-data-grid` (variant: cards)
  - Header actions: "Nova Conta" (primary), "Transferir" (secondary), "Reconciliar" (secondary)
  - Empty state com CTA "Criar primeira conta"
  - Loading skeleton screens
- Renderiza `AccountCard` para cada conta
- Ações: Abrir modais de criação/edição/exclusão/transferência/reconciliação
- Estados: loading, empty, error, success
- Integração com `BudgetSelectionService` para filtro automático

**Critério de Conclusão**:

- Página criada e funcionando
- Lista de contas exibida corretamente
- Estados (loading/empty/error) implementados
- Integração com `AccountState` funcionando
- Navegação testada

**Dependências**: FASE 2 e FASE 3 completas

**Referências**:

- `src/app/features/budget/pages/budget-list/budget-list.page.ts` para padrão
- `src/app/shared/ui-components/templates/os-list-template/` para uso do template

#### Criar `AccountFormComponent` [⏳]

**Descrição**: Criar `src/app/features/accounts/components/account-form/account-form.component.ts`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Formulário reativo (Reactive Forms)
- Campos:
  - Nome (text, obrigatório)
  - Tipo (select, obrigatório)
  - Saldo Inicial (money-input, >= 0)
- Validações: nome obrigatório, tipo obrigatório, saldo >= 0
- Inputs:
  - `account?: AccountDto` (para edição, undefined para criação)
  - `budgetId: string` (orçamento atual)
- Outputs:
  - `save: EventEmitter<AccountFormData>`
  - `cancel: EventEmitter<void>`
- Reutiliza `os-form-template` ou `os-modal-template` (se usado em modal)
- Usa `os-form-field`, `os-form-group`, `os-input`, `os-select`, `os-money-input`

**Critério de Conclusão**:

- Componente criado e funcionando
- Formulário com validações
- Suporte a criação e edição
- Acessibilidade implementada
- Testes unitários básicos

**Dependências**: FASE 1 completa

### 🧪 Critérios de Validação

- [ ] Rotas criadas e funcionando
- [ ] `AccountsPage` exibindo lista de contas
- [ ] `AccountFormComponent` funcionando (criação/edição)
- [ ] Estados (loading/empty/error) implementados
- [ ] Integração com `AccountState` funcionando
- [ ] Navegação básica testada

### 📝 Comentários da Fase

_[Observações sobre estrutura e UX da página]_

---

## 📅 FASE 6: Modais e Ações [Status: ⏳]

### 🎯 Objetivo

Implementar modais para ações secundárias (transferência, reconciliação, confirmação de exclusão) e integrar com `AccountState`.

### 📋 Tarefas

#### Criar `TransferModal` [⏳]

**Descrição**: Criar `src/app/features/accounts/components/transfer-modal/transfer-modal.component.ts`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Usa `os-modal-template` como base
- Integra `TransferForm` (molecule)
- Integra `AccountState` para obter lista de contas
- Lógica:
  - Filtra contas do orçamento atual
  - Chama `AccountState.transferBetweenAccounts()` ao submeter
  - Exibe loading durante operação
  - Exibe toast de sucesso/erro
  - Fecha modal após sucesso
- Validações: Mesmo orçamento, saldo suficiente, origem != destino
- Acessibilidade: Focus management, ARIA labels

**Critério de Conclusão**:

- Modal criado e funcionando
- Integração com `AccountState` funcionando
- Validações funcionando
- Feedback visual (loading/success/error) implementado
- Acessibilidade implementada

**Dependências**: FASE 2, FASE 4.1 completas

**Referências**:

- `src/app/shared/ui-components/templates/os-modal-template/` para padrão

#### Criar `ReconcileModal` [⏳]

**Descrição**: Criar `src/app/features/accounts/components/reconcile-modal/reconcile-modal.component.ts`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Usa `os-modal-template` como base
- Integra `ReconcileForm` (molecule)
- Integra `AccountState` para reconciliar
- Lógica:
  - Recebe `accountId` como input
  - Obtém conta do `AccountState`
  - Chama `AccountState.reconcileAccount()` ao submeter
  - Exibe loading durante operação
  - Exibe toast de sucesso/erro
  - Fecha modal após sucesso
- Helper text explicativo sobre processo de ajuste
- Acessibilidade: Focus management, ARIA labels

**Critério de Conclusão**:

- Modal criado e funcionando
- Integração com `AccountState` funcionando
- Feedback visual (loading/success/error) implementado
- Acessibilidade implementada

**Dependências**: FASE 2, FASE 4.2 completas

#### Criar `ConfirmDeleteModal` [⏳]

**Descrição**: Criar `src/app/features/accounts/components/confirm-delete-modal/confirm-delete-modal.component.ts`:

- Componente standalone com `ChangeDetectionStrategy.OnPush`
- Usa `os-modal-template` como base (variant: compact)
- Lógica:
  - Recebe `account` como input
  - Exibe mensagem explicativa sobre exclusão
  - Mensagem especial se houver transações vinculadas (bloqueio)
  - Chama `AccountState.deleteAccount()` ao confirmar
  - Trata erro de bloqueio (exibe mensagem clara)
  - Exibe loading durante operação
  - Fecha modal após sucesso
- Acessibilidade: Focus management, ARIA labels

**Critério de Conclusão**:

- Modal criado e funcionando
- Integração com `AccountState` funcionando
- Tratamento de erro de bloqueio implementado
- Feedback visual (loading/success/error) implementado
- Acessibilidade implementada

**Dependências**: FASE 2 completa

#### Integrar modais em `AccountsPage` [⏳]

**Descrição**:

- Adicionar controles de abertura/fechamento de modais
- Integrar `AccountFormModal` (criação/edição via modal)
- Integrar `TransferModal`, `ReconcileModal`, `ConfirmDeleteModal`
- Gerenciar estado de modais abertos (signals)
- Focus management ao abrir/fechar modais

**Critério de Conclusão**:

- Todos os modais integrados
- Abertura/fechamento funcionando
- Focus management implementado
- Navegação por teclado funcionando (Esc fecha modais)

**Dependências**: FASE 6.1, FASE 6.2, FASE 6.3 completas

### 🧪 Critérios de Validação

- [ ] `TransferModal` criado e funcionando
- [ ] `ReconcileModal` criado e funcionando
- [ ] `ConfirmDeleteModal` criado e funcionando
- [ ] Integração com `AccountState` funcionando
- [ ] Validações funcionando
- [ ] Feedback visual (loading/success/error) implementado
- [ ] Focus management implementado
- [ ] Acessibilidade implementada

### 📝 Comentários da Fase

_[Observações sobre UX de modais e validações]_

---

## 📅 FASE 7: Integrações [Status: ⏳]

### 🎯 Objetivo

Integrar contas com outras features (Dashboard, Budgets, Transactions, Goals) e menu/side-nav.

### 📋 Tarefas

#### Integrar menu/side-nav [⏳]

**Descrição**:

- Adicionar rota `/accounts` no menu/side-nav em `src/app/core/layout/app-layout.component.ts`
- Ícone: `account_balance` ou similar
- Label: "Contas"
- Posição: Após "Orçamentos" ou "Transações"

**Critério de Conclusão**:

- Rota adicionada no menu
- Navegação funcionando
- Ícone e label corretos

**Dependências**: FASE 5.1 completa

**Referências**:

- `src/app/core/layout/app-layout.component.ts` para estrutura do menu

#### Integrar Dashboard [⏳]

**Descrição**:

- Adicionar card "Contas" em `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`
- Exibe: Número de contas, saldo total (ou resumo)
- Ações rápidas: "Nova Conta" (primary), "Transferir" (secondary)
- Link para `/accounts` ao clicar no card
- Consome `AccountState` para dados
- Loading/empty states

**Critério de Conclusão**:

- Card "Contas" criado e funcionando
- Ações rápidas funcionando
- Navegação para `/accounts` funcionando
- Integração com `AccountState` funcionando

**Dependências**: FASE 2, FASE 5 completas

**Referências**:

- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts` para padrão

#### Integrar Budgets [⏳]

**Descrição**:

- Adicionar seção "Contas do orçamento" em `src/app/features/budget/pages/budget-detail/budget-detail.page.ts` (ou similar)
- Exibe lista de contas do orçamento atual (via `AccountState`)
- CTA: "Criar nova conta" (com `budgetId` pré-preenchido)
- Links para `/accounts` quando relevante

**Critério de Conclusão**:

- Seção "Contas" adicionada
- Lista de contas exibida
- CTA funcionando
- Integração com `AccountState` funcionando

**Dependências**: FASE 2, FASE 5 completas

**Referências**:

- `src/app/features/budget/pages/budget-list/budget-list.page.ts` para padrão

#### Integrar Transactions [⏳]

**Descrição**:

- Adicionar campo "Conta" obrigatório em formulários de criação/edição de transação
- Usar `AccountState` para obter opções de conta
- Filtrar contas do orçamento atual
- Adicionar filtro por conta na lista de transações
- Validação: `accountId` deve pertencer ao `budgetId` atual

**Critério de Conclusão**:

- Campo "Conta" adicionado e obrigatório
- Filtro por conta implementado
- Validação de consistência implementada
- Integração com `AccountState` funcionando

**Dependências**: FASE 2 completa

**Referências**:

- `src/app/features/transactions/pages/transactions/transactions.page.ts` para estrutura

#### Integrar Goals [⏳]

**Descrição**:

- Adicionar links de navegação para `/accounts` quando relevante (ex: em detalhes de meta)
- Consumir `AccountState` para opções de conta em formulários de meta (se houver campo de conta)

**Critério de Conclusão**:

- Links de navegação adicionados
- Integração com `AccountState` funcionando (se aplicável)

**Dependências**: FASE 2 completa

### 🧪 Critérios de Validação

- [ ] Menu/side-nav atualizado
- [ ] Dashboard integrado (card "Contas")
- [ ] Budgets integrado (seção "Contas")
- [ ] Transactions integrado (campo obrigatório e filtro)
- [ ] Goals integrado (links de navegação)
- [ ] Todas as integrações funcionando
- [ ] Navegação entre features funcionando

### 📝 Comentários da Fase

_[Observações sobre integrações e UX]_

---

## 📅 FASE 8: Testes e Acessibilidade [Status: ⏳]

### 🎯 Objetivo

Garantir cobertura de testes ≥ 80%, acessibilidade WCAG 2.1 AA e validação final de funcionalidades.

### 📋 Tarefas

#### Testes unitários de serviços [⏳]

**Descrição**:

- Completar testes de `AccountsApiService`:
  - Cenários de sucesso (list, create, update, delete, transfer, reconcile)
  - Cenários de erro (401, 400, 500)
  - Validações de contratos
- Completar testes de `AccountState`:
  - Transições de estado (loading, success, error)
  - Computed signals
  - Mutations (create, update, delete, transfer, reconcile)
  - Integração com `BudgetSelectionService`
  - Tratamento de erro de bloqueio de exclusão

**Critério de Conclusão**:

- Cobertura ≥ 80% em serviços
- Todos os cenários críticos cobertos
- Testes passando

**Dependências**: FASE 2 completa

#### Testes unitários de componentes [⏳]

**Descrição**:

- Testes de `AccountTypeBadge`: Renderização por tipo, cores, ARIA
- Testes de `AccountCard`: Renderização, ações, estados, ARIA
- Testes de `TransferForm`: Validações, submissão, erros
- Testes de `ReconcileForm`: Validações, submissão, helper text
- Testes de `AccountFormComponent`: Criação/edição, validações
- Testes de `AccountsPage`: Lista, estados, ações, integração com state
- Testes de modais: Abertura/fechamento, submissão, erros

**Critério de Conclusão**:

- Cobertura ≥ 80% em componentes
- Interações principais cobertas
- Testes passando

**Dependências**: FASE 3, FASE 4, FASE 5, FASE 6 completas

#### Testes de integração [⏳]

**Descrição**:

- Testes de fluxo completo: Criar conta → Editar → Transferir → Reconciliar → Excluir
- Testes de integração com Dashboard, Budgets, Transactions, Goals
- Testes de navegação entre rotas
- Testes de MSW handlers (validar contratos)

**Critério de Conclusão**:

- Fluxos principais testados
- Integrações testadas
- Testes passando

**Dependências**: Todas as fases anteriores completas

#### Acessibilidade (WCAG 2.1 AA) [⏳]

**Descrição**:

- Validar keyboard navigation (Tab, Enter, Esc)
- Validar ARIA attributes (labels, live regions, landmarks)
- Validar contraste de cores (>= 4.5:1)
- Validar focus visible em elementos interativos
- Validar screen reader (testar com NVDA/JAWS se possível)
- Validar skip links
- Validar zoom até 200% sem quebra de layout

**Critério de Conclusão**:

- Todas as validações de acessibilidade passando
- Documentação de acessibilidade atualizada

**Dependências**: Todas as fases anteriores completas

#### Validação final de funcionalidades [⏳]

**Descrição**:

- Validar todos os critérios de aceitação do `context.md`:
  - [ ] Lista contas do orçamento atual com id, nome, tipo e saldo
  - [ ] Cria/edita/exclui contas, com bloqueio de exclusão quando houver transações
  - [ ] Executa transferência entre contas com validações (mesmo orçamento; saldo suficiente)
  - [ ] Executa reconciliação com cálculo de diferença e geração de transação de ajuste
  - [ ] Atualiza saldos visíveis após transfer/reconcile sem reload (signals)
  - [ ] Integrações de navegação adicionadas (Dashboard, Budgets, Transactions, Goals, menu)
  - [ ] Cobertura de testes > 80% e mensagens de erro/empty states adequadas

**Critério de Conclusão**:

- Todos os critérios de aceitação validados
- Documentação atualizada

**Dependências**: Todas as fases anteriores completas

### 🧪 Critérios de Validação

- [ ] Cobertura de testes ≥ 80%
- [ ] Testes unitários completos (serviços e componentes)
- [ ] Testes de integração completos
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Todos os critérios de aceitação validados
- [ ] Documentação atualizada

### 📝 Comentários da Fase

_[Observações sobre testes e validações]_

---

## 🏁 Entrega Final

### Checklist de Conclusão

- [ ] Todas as fases completas
- [ ] Cobertura de testes ≥ 80%
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Todos os critérios de aceitação validados
- [ ] Documentação atualizada
- [ ] Código revisado (sem erros de lint/type-check)
- [ ] Pronto para PR

### 📊 Métricas de Qualidade

- **Cobertura de Testes**: ≥ 80%
- **Acessibilidade**: WCAG 2.1 AA
- **Performance**: Lazy loading, OnPush change detection
- **Bundle Size**: ~15KB adicional (estimativa)

### 📚 Referências

- **Contexto**: `sessions/OS-229/context.md`
- **Arquitetura**: `sessions/OS-229/architecture.md`
- **Layout**: `sessions/OS-229/layout-specification.md`
- **Padrões**: `src/app/core/services/budget/`, `src/app/features/budget/`
- **Design System**: `src/app/shared/ui-components/`

---

## 📝 Notas de Implementação

### Decisões Técnicas

1. **Estado Global**: `AccountState` em `core/services` para reuso em múltiplas features
2. **Atualização Reativa**: Recarga de lista após mutations (simplicidade > otimização prematura)
3. **Layout de Cards**: Grid responsivo (1 col → 2 cols → 3-4 cols) em vez de tabela
4. **Validações**: Customizadas no frontend (mesmo orçamento, saldo suficiente) + backend

### Riscos e Mitigações

1. **Concorrência**: Transações alterando saldos durante transfer/reconcile
   - **Mitigação**: Recarga de lista após operação
2. **UX de Bloqueio**: Exclusão bloqueada quando houver transações
   - **Mitigação**: Mensagem clara e CTAs auxiliares
3. **Performance**: Bundle size adicional
   - **Mitigação**: Lazy loading de feature, modais sob demanda

### Melhorias Futuras

- Otimização de write-through no estado (em vez de recarga)
- Histórico de transações por conta
- Filtros avançados na lista de contas
- Exportação de dados de contas

---

**Última Atualização**: [Data da última atualização]
**Status Geral**: ⏳ Não iniciado
