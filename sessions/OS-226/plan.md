# Budgets (OS-226) - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar o domínio de Budgets no frontend com DTOs, serviço, estado e UI (lista, detalhe, modal de criação/edição), integrando com Dashboard e AppBar. Responsividade mobile-first, acessibilidade WCAG 2.1 AA e reuso do Design System.

## 🎯 Objetivos

- Consolidar CRUD básico de Budgets (client-side filters) e navegação contextual
- Cumprir critérios de aceitação e cobertura de testes definida na sessão

---

## 📅 FASE 1: Fundamentos de Dados (DTOs, Serviço e Estado) [Status: ✅]

### 🎯 Objetivo

Estabelecer contratos, serviço e estado reativos com seleção automática do primeiro orçamento.

### 📋 Tarefas

#### DTOs de Budget [✅]

**Descrição**: Finalizar `BudgetDto`, `CreateBudgetDto`, `UpdateBudgetDto` conforme swagger/backend e mocks.
**Critério de Conclusão**: Tipos publicados em `src/dtos/budget/*` e usados no serviço/estado.
**Implementado**: 
- `DeleteBudgetRequestDto` e `DeleteBudgetResponseDto` criados
- `UpdateBudgetRequestDto` corrigido (userId, budgetId, name)
- Todos os DTOs exportados no `index.ts`

#### BudgetService (get/create/update/delete) [✅]

**Descrição**: Implementar chamadas via `ApiService` com headers/erros e typings.
**Critério de Conclusão**: Métodos funcionando contra MSW; testes unitários 100%.
**Implementado**:
- `getBudgets()`, `getBudgetOverview()`, `createBudget()`, `updateBudget()`, `deleteBudget()`
- Signals para loading/error com readonly getters
- Integração com ApiService e AuthService
- Arquivo: `src/app/core/services/budget/budget.service.ts`

#### BudgetState com signals/computed [✅]

**Descrição**: `budgets`, `loading`, `error`, seleção automática do primeiro item; helpers de seleção.
**Critério de Conclusão**: Testes 100% cobrindo transições.
**Implementado**:
- Signals: `_budgets`, `_loading`, `_error` com readonly getters
- Computed: `hasBudgets`, `budgetsCount`
- `loadBudgets()` com seleção automática do primeiro
- `selectBudget()`, `selectFirstBudget()`, CRUD completo
- Integração com `BudgetSelectionService`
- Arquivo: `src/app/core/services/budget/budget.state.ts`

### 🧪 Critérios de Validação

- [⚠️] Testes criados mas precisam ajuste para vitest (remover done(), usar async/await)
- [✅] Seleção inicial automática implementada e verificada
- [✅] Integração com BudgetSelectionService
- [✅] Tratamento de erros e estados de loading

### 📝 Comentários da Fase

**Decisões**: Observables (RxJS) mantendo consistência com ApiService; Signals privados seguindo padrão AuthService; Seleção automática em loadBudgets().

**Arquivos Criados**: `delete-budget-*-dto.ts`, `budget.service.ts`, `budget.state.ts` e specs.

**Pendências**: Testes precisam refatoração para vitest (async/await)

---

## 📅 FASE 2: Rotas e Páginas Base (List e Detail) [Status: ⏳]

### 🎯 Objetivo

Configurar rotas lazy e páginas base com integração ao estado.

### 📋 Tarefas

#### Rotas `features/budget/budget.routes.ts` [⏳]

**Descrição**: Definir `/budgets`, `/budgets/:id`, `/budgets/new`, `/budgets/:id/edit` (modal secundário).
**Dependências**: Fase 1 concluída.

#### BudgetListPage (lista + filtros client-side) [⏳]

**Descrição**: Consumir `BudgetState`; toolbar de filtros (texto, período, status) e grid responsivo.
**Critério de Conclusão**: Filtros client-side funcionando; empty/error/loading states.

#### BudgetDetailPage (layout base) [⏳]

**Descrição**: Header com título/ações; placeholders para overview/participants.
**Critério de Conclusão**: Rota abre e exibe orçamento selecionado.

### 🧪 Critérios de Validação

- [ ] Navegação direta para `/budgets` e `/budgets/:id` funcional
- [ ] Filtros client-side operacionais

### 📝 Comentários da Fase

\_

---

## 📅 FASE 3: Componentes UI (Card e Form Modal) [Status: ⏳]

### 🎯 Objetivo

Construir os componentes reutilizáveis conforme DS e a11y.

### 📋 Tarefas

#### BudgetCardComponent [⏳]

**Descrição**: Card com ações (abrir, editar, excluir). A11y (role, aria-label, focus ring).
**Critério de Conclusão**: Responsivo e integrado na lista.

#### BudgetFormComponent (modal) [⏳]

**Descrição**: Formulário com `os-form-template`; campos `name`, `type (PERSONAL|SHARED)`; validações.
**Critério de Conclusão**: Create/Update via serviço, feedback loading/erro/sucesso.

### 🧪 Critérios de Validação

- [ ] Testes de componentes ≥ 80% cobertura
- [ ] Acessibilidade básica (tab order, focus, aria) validada

### 📝 Comentários da Fase

\_

---

## 📅 FASE 4: Integrações (Dashboard e AppBar) [Status: ⏳]

### 🎯 Objetivo

Conectar navegação contextual e criação via AppBar.

### 📋 Tarefas

#### DashboardWidgetsComponent.onWidgetClick [⏳]

**Descrição**: Ao `type === 'budget-summary'`, obter `selectedBudgetId` e navegar para `/budgets/:id`.
**Dependências**: Fases 1 e 2.

#### AppLayoutComponent (createBudgetRequested) [⏳]

**Descrição**: Tratar evento do seletor para abrir `/budgets/new` (modal).
**Critério de Conclusão**: Fluxos navegáveis a partir do Dashboard e AppBar.

### 🧪 Critérios de Validação

- [ ] Clique no widget abre detalhe do orçamento selecionado
- [ ] Botão criar do seletor abre modal de criação

### 📝 Comentários da Fase

\_

---

## 📅 FASE 5: Polimento, A11y e Testes Finais [Status: ⏳]

### 🎯 Objetivo

Garantir qualidade visual, responsividade e acessibilidade; concluir cobertura de testes.

### 📋 Tarefas

#### Responsividade e a11y pass [⏳]

**Descrição**: Ajustes de spacing, breakpoints, focus management, aria-live em erros.

#### Confirmação de Exclusão [⏳]

**Descrição**: Modal de confirmação para delete; manter seleção consistente (selecionar primeiro restante).

#### Cobertura e qualidade [⏳]

**Descrição**: Serviço/estado 100% cobertura; componentes ≥ 80%; lint sem erros.

### 🧪 Critérios de Validação

- [ ] Critérios de aceitação do OS-226 atendidos
- [ ] Coberturas de teste e lint OK

### 📝 Comentários da Fase

\_

---

## 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Documentação atualizada (`context.md`, `architecture.md`, `layout-specification.md`, `plan.md`)
- [ ] Pronto para `/work` e posterior `/pre-pr`/`/pr`
