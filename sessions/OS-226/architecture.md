# Budgets - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- Existem mocks MSW para budgets: listagem, overview e mutações (create/update/delete).
- `BudgetSelectionService` provê sinais de seleção/lista, porém sem integração completa com serviço remoto.
- `DashboardWidgetsComponent` possui `onWidgetClick` a implementar para navegação ao detalhe do orçamento.
- `AppLayoutComponent` renderiza o seletor de orçamento no header, sem ação de criação.

### Mudanças Propostas

- Criar DTOs em `src/dtos/budget/` (já existe estrutura base) complementando tipos conforme backend.
- Implementar `BudgetService` para consumir endpoints via `ApiService`.
- Implementar `BudgetState` (signals) para gerenciar `budgets`, `loading`, `error` e seleção inicial.
- Criar componentes:
  - `BudgetListComponent`: listagem com filtros client-side (mês/ano, status, texto).
  - `BudgetCardComponent`: card resumido para uso em listagem.
  - `BudgetFormComponent`: modal de criação/edição com validações.
  - `BudgetDetailComponent`: detalhes do orçamento (página dedicada).
- Rotas:
  - `/budgets` (listagem)
  - `/budgets/new` (abre modal de criação sobre a listagem)
  - `/budgets/:id` (detalhe)
  - `/budgets/:id/edit` (abre modal de edição sobre o detalhe)
- Integrações:
  - `Dashboard`: `onWidgetClick` quando `type === 'budget-summary'` → navegar para `/budgets/:selectedId`.
  - `AppBar`: habilitar criação via seletor com `(createBudgetRequested)` → abrir modal `/budgets/new`.
- Seleção automática do primeiro orçamento carregado.

### Impactos

- `features/dashboard` (navegação e integração com seleção de orçamento)
- `core/layout` (header: ação de criar orçamento)
- `core/services` (novo serviço/state de budgets)

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`: implementar `onWidgetClick` para navegação.
- `src/app/core/layout/app-layout.component.ts`: conectar `(createBudgetRequested)` do seletor para abrir modal de criação.
- `src/app/core/services/budget-selection/budget-selection.service.ts`: garantir API para set/list e seleção automática.

### Novos Arquivos a Criar

- `src/app/core/services/budget/budget.service.ts`: consumo de API budgets.
- `src/app/core/services/budget/budget.state.ts`: signals/computed e orquestração com `BudgetService`.
- `src/app/features/budget/pages/budget-list.page.ts`: listagem e host do modal.
- `src/app/features/budget/components/budget-card/budget-card.component.ts`: card de orçamento.
- `src/app/features/budget/components/budget-form/budget-form.component.ts`: formulário de criação/edição (modal).
- `src/app/features/budget/pages/budget-detail.page.ts`: detalhe do orçamento.
- `src/app/features/budget/budget.routes.ts`: rotas do módulo budgets (lazy-loaded).
- Testes: specs para serviço, estado e componentes.

### Estrutura de Diretórios

- `src/app/features/budget/`
  - `components/`
  - `pages/`
  - `budget.routes.ts`
- `src/app/core/services/budget/`

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- Standalone components, signals, OnPush
- `ApiService` para IO, `ConfigService` para URLs
- Either para tratamento de erros (retorno do `ApiService` + adaptação no serviço)

### Decisões Arquiteturais

- **Decisão**: Modal para criação/edição usando rota secundária (/budgets/new, /budgets/:id/edit) sobre páginas base.
  - **Alternativas**: Páginas dedicadas; diálogo imperativo sem rota
  - **Justificativa**: Melhor refletir estado na URL, alinhado à preferência do PO/UX
- **Decisão**: Filtros client-side
  - **Alternativas**: Filtros server-side
  - **Justificativa**: Iteração inicial, backend ainda não expõe filtros em `/budgets`

## 📦 Dependências e Integrações

### Dependências Existentes

- `ApiService`, `ConfigService`, `NotificationService`
- MSW handlers para budgets

### Novas Dependências

- Nenhuma

### Integrações

- Endpoints (mock/back):
  - GET `/api/budget` (lista)
  - GET `/api/budget/:budgetId/overview` (overview)
  - POST `/api/budget/create-budget` (name, ownerId, type)
  - POST `/api/budget/update-budget` (userId, budgetId, name)
  - POST `/api/budget/delete-budget` (userId, budgetId)

## 🔄 Fluxo de Dados

1. `BudgetState.loadBudgets()` → `BudgetService.getBudgets()` → atualiza `budgets`, `loading`, `error`; seleciona primeiro orçamento disponível.
2. Create/Edit/Delete via `BudgetService` → atualiza estado (recarrega lista e mantém/atualiza seleção).
3. Dashboard `onWidgetClick('budget-summary')` → consulta `BudgetSelectionService.selectedBudgetId()` → navega para `/budgets/:id`.
4. AppBar seletor `(createBudgetRequested)` → `router.navigate(['/budgets/new'])` abrindo modal.

## 🎨 UI Components and Layout

### Design System Integration

- Reuso de `os-modal`, `os-form-template`, `os-card`, `os-button`, `os-input`, `os-form-field`, `os-dropdown`, `os-page-header`, `os-icon`.

### New Components Required

- `BudgetCardComponent` (molecule/organism leve): card de orçamento reutilizável.
- `BudgetFormComponent` (modal): criação/edição com validações e a11y.

### Layout Architecture

- List page com toolbar de filtros e grid responsivo de cards.
- Detail page com page header e ações contextuais.
- Modal via rota secundária para new/edit.

### Performance Considerations

- Lazy load das rotas de budgets; OnPush em todos componentes; sinais/computed para derivações.

**Detalhes completos em:** `sessions/OS-226/layout-specification.md`

## 🧪 Considerações de Teste

### Testes Unitários

- `BudgetService`: sucesso/erro para cada método; headers e payloads
- `BudgetState`: transições (loading/error), seleção automática, sincronização com seleção global

### Testes de Integração

- Rotas de budgets (list/detail/new/edit) com modal
- Integração Dashboard ↔ seleção ↔ navegação

### Mocks e Fixtures

- MSW já cobre endpoints; adicionar fixtures de lista para múltiplos estados (vazio, 1 item, n itens)

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- Filtro client-side pode divergir depois (necessitar refator para server-side)
- Modal por rota secundária aumenta complexidade de roteamento

### Riscos Identificados

- Divergência contrato mock/back (validar com swagger em CI local)
- Estado de seleção após exclusão (corrigido selecionando primeiro item restante)

## 📋 Lista de Implementação

### UI Components

- [ ] Implementar `BudgetCardComponent` conforme layout-specification
- [ ] Implementar `BudgetFormComponent` (modal) conforme layout-specification
- [ ] Implementar responsividade (mobile/tablet/desktop)
- [ ] Implementar acessibilidade (ARIA, keyboard, focus management)

### Backlog Técnico

- [ ] Adicionar DTOs finais em `src/dtos/budget/*` conforme swagger
- [ ] Criar `BudgetService` (get/create/update/delete)
- [ ] Criar `BudgetState` com signals/computed e seleção inicial
- [ ] Implementar rotas em `features/budget/budget.routes.ts`
- [ ] Criar `BudgetListComponent` com filtros client-side
- [ ] Criar `BudgetDetailComponent`
- [ ] Integrar Dashboard `onWidgetClick` → `/budgets/:id`
- [ ] Integrar AppBar `(createBudgetRequested)` → `/budgets/new`
- [ ] Testes: serviço/estado 100%; componentes ≥ 80%

## 📚 Referências

- Meta Specs: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- Documentação: backend `swagger.json`
- Exemplos: handlers MSW em `src/app/core/mocks/handlers/budgets.handlers.ts`
