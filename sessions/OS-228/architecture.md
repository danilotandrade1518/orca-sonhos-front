# Metas (Goals) - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- Não há feature de Metas implementada.
- Padrões de página e estado existentes na aplicação (referência):
  - `src/app/features/transactions/pages/transactions/transactions.page.ts` (estado com signals, OnPush, integração com `BudgetSelectionService`, `NotificationService`, modais, ações, carregamento paginado).
- Navegação: não existe rota `/goals` ainda.

### Mudanças Propostas

- Nova feature `goals` com rota base `/goals` e subrotas:
  - `/goals` (lista)
  - `/goals/new` (criação)
  - `/goals/:id` (detalhe/edição)
- Camadas previstas:
  - DTOs (`src/dtos/goal/`)
  - Serviço de API (`features/goals/services/goals-api/goals-api.service.ts`)
  - Estado (`features/goals/state/goals-state/goals.state.ts`)
  - Páginas e componentes de UI (lista, formulário, card, detalhe)
- A11y e responsividade desde o início; tokens visuais de progresso por threshold.

### Impactos

- Inclusão de rotas no roteamento principal (lazy load das páginas de Goals).
- Integração com `BudgetSelectionService` (validação/seleção de orçamento).
- Uso de mocks/MSW para `sourceAccountId` até existir serviço real de contas.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/app.routes.ts`: adicionar rotas lazy da feature Goals.
  - `path: 'goals'` → `loadComponent` para página de lista.
  - Subrotas `new` e `:id` para páginas dedicadas.

### Novos Arquivos a Criar

- DTOs

  - `src/dtos/goal/goal-types/goal-types.ts` e `goal-types.spec.ts`: tipos `GoalDto`, `CreateGoalDto`, `UpdateGoalDto`, `DeleteGoalDto`, `AddAmountToGoalDto`, `RemoveAmountFromGoalDto`.

- Serviço de API

  - `src/app/features/goals/services/goals-api/goals-api.service.ts` e `goals-api.service.spec.ts`:
    - Métodos: `create`, `update`, `delete`, `addAmount`, `removeAmount`, `listByBudget`.
    - Integração com `HttpClient`; endpoints a alinhar com o backend (ex.: `/api/goals`).

- Estado

  - `src/app/features/goals/state/goals-state/goals.state.ts` e `goals.state.spec.ts`:
    - Signals: `items`, `isLoading`, `lastUpdated`.
    - Computeds: `progressById`, `remainingById`, `suggestedMonthlyById`.
    - Ações: `load(budgetId)`, `create`, `update`, `delete`, `addAmount`, `removeAmount` (delegando ao service e atualizando `items`).

- Páginas (standalone, OnPush)

  - `src/app/features/goals/pages/goals/goals.page.ts` e `goals.page.spec.ts` (lista)
  - `src/app/features/goals/pages/goals-new/goals-new.page.ts` e `goals-new.page.spec.ts` (criação)
  - `src/app/features/goals/pages/goal-detail/goal-detail.page.ts` e `goal-detail.page.spec.ts` (detalhe/edição)

- Componentes (feature)

  - `src/app/features/goals/components/goal-list/goal-list.component.ts` e `goal-list.component.spec.ts`
    - Lista com barra de progresso linear, thresholds visuais, estados vazios/skeletons.
  - `src/app/features/goals/components/goal-card/goal-card.component.ts` e `goal-card.component.spec.ts`
    - Card com resumo (acumulado, restante, aporte sugerido). Gráfico circular opcional (posterior).
  - `src/app/features/goals/components/goal-form/goal-form.component.ts` e `goal-form.component.spec.ts`
    - Formulário com validações SMART básicas; campos: título, valor alvo, data-alvo (opcional), orçamento, conta de origem; mostra aporte sugerido dinamicamente (somente exibição).

- Mocks (enquanto não houver serviço de contas)
  - `src/mocks/accounts/accounts.mock.ts` e `accounts.mock.spec.ts` (shape mínimo): `{ id: string; name: string }[]`
  - Integração com MSW conforme documentação do projeto (sem bloquear a feature).

### Estrutura de Diretórios

- `src/dtos/goal/goal-types/`

  - `goal-types.ts`
  - `goal-types.spec.ts`

- `src/app/features/goals/`

  - `pages/goals/`
    - `goals.page.ts`
    - `goals.page.spec.ts`
  - `pages/goals-new/`
    - `goals-new.page.ts`
    - `goals-new.page.spec.ts`
  - `pages/goal-detail/`
    - `goal-detail.page.ts`
    - `goal-detail.page.spec.ts`
  - `components/goal-list/`
    - `goal-list.component.ts`
    - `goal-list.component.spec.ts`
  - `components/goal-card/`
    - `goal-card.component.ts`
    - `goal-card.component.spec.ts`
  - `components/goal-form/`
    - `goal-form.component.ts`
    - `goal-form.component.spec.ts`
  - `services/goals-api/`
    - `goals-api.service.ts`
    - `goals-api.service.spec.ts`
  - `state/goals-state/`
    - `goals.state.ts`
    - `goals.state.spec.ts`

- `src/mocks/accounts/`
  - `accounts.mock.ts`
  - `accounts.mock.spec.ts`

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- Angular 20+ standalone (não setar `standalone: true`), `signals`/`computed`, `ChangeDetectionStrategy.OnPush`.
- Clean Architecture com DTO-first no frontend.
- Inputs/Outputs com `input()`/`output()`; evitar `@HostBinding`/`@HostListener` (usar `host` no decorator quando necessário).
- A11y (aria-live, foco visível, navegação por teclado) e responsividade.
- Lazy routing e separação clara de páginas x componentes.

### Decisões Arquiteturais

- Decisão: Subrotas dedicadas (`/goals/new`, `/goals/:id`) para páginas próprias.
  - Alternativas: usar modais na lista como em transações; escolhido páginas para alinhamento com diretriz fornecida.
- Decisão: Estado local por feature (`GoalsState`) com `signals` e computeds derivados.
  - Alternativas: serviço global; escolhido estado local para isolamento e testabilidade.
- Decisão: MSW/mocks temporários para contas.
  - Justificativa: não bloquear fluxo; substituível sem impacto na UI/estado.

## 📦 Dependências e Integrações

### Dependências Existentes

- `BudgetSelectionService`, `NotificationService`, `AuthService`.
- Angular Material/DS já em uso.

### Novas Dependências

- Nenhuma obrigatória além do uso do `HttpClient` e `Router` já disponíveis.

### Integrações

- Backend Goals (CRUD e aportes). Endpoints a confirmar; mapear diferenças de nomenclatura:
  - `totalAmount` ↔ `targetAmount`
  - `accumulatedAmount` ↔ `currentAmount`

## 🔄 Fluxo de Dados

- Lista: ao entrar em `/goals`, obter `budgetId` do `BudgetSelectionService`; carregar metas via `GoalsApiService.listByBudget` → normalizar DTO → armazenar em `GoalsState.items`.
- Cálculos derivam de `items`:
  - `progress = currentAmount / targetAmount` (0–1) e apresentação em % (2 casas).
  - `remaining = max(targetAmount - currentAmount, 0)`.
  - `suggestedMonthly = remaining / monthsUntil(dueDate)`; se sem `dueDate`, exibir `—`.
- Operações (`create`, `update`, `delete`, `addAmount`, `removeAmount`) chamam API; em sucesso, atualizam `items` e notificam usuário.

## 🧪 Considerações de Teste

### Testes Unitários

- `GoalsState`: cálculos (progress/remaining/suggestedMonthly), regras de não-negatividade, atualizações de coleção.
- `GoalsApiService`: chamadas com parâmetros corretos e mapeamento DTO.
- Componentes: render de progresso e thresholds; form com validações; ações de aporte/remoção.

### Testes de Integração

- Fluxos principais de navegação (`/goals`, `/goals/new`, `/goals/:id`).
- Integração com `BudgetSelectionService` (quando `budgetId` ausente/presente).

### Mocks e Fixtures

- MSW para contas (`sourceAccountId`) e, se necessário, endpoints de goals durante desenvolvimento.

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- Páginas dedicadas aumentam número de arquivos, mas melhoram acessibilidade e deep linking.
- Estado local por feature evita dependência global, com pequeno custo de boilerplate.

### Riscos Identificados

- Divergência de contratos backend ↔ frontend (nomes/campos). Mitigação: mappers e testes.
- Cálculo de meses restantes com datas inválidas. Mitigação: validação e fallback exibindo `—`.

## 📋 Lista de Implementação

- [ ] Definir tipos em `src/dtos/goal/goal-types.ts`
- [ ] Criar `GoalsApiService` com métodos CRUD + aportes
- [ ] Implementar `GoalsState` com signals/computed
- [ ] Páginas: `goals.page.ts`, `goals-new.page.ts`, `goal-detail.page.ts`
- [ ] Componentes: `goal-list`, `goal-card`, `goal-form`
- [ ] Rotas: adicionar `/goals`, `/goals/new`, `/goals/:id`
- [ ] Mocks MSW para contas (`sourceAccountId`)
- [ ] Testes de serviços/estado (meta ~100%) e componentes (≥80%)
- [ ] A11y (aria-live, foco, teclado) e responsividade
- [ ] Tokens/estilos de thresholds (erro/aviso/sucesso) alinhados ao DS

## 📚 Referências

- Meta Specs: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- Padrão de página: `src/app/features/transactions/pages/transactions/transactions.page.ts`
- OS-228 (Jira): “Metas (Goals): DTOs, serviços, estado e UI com progresso visual”
- CLAUDE.md (padrões do projeto)

## 🎨 UI Components and Layout

### Design System Integration

- Reutilização de templates e organisms: `os-form-template`, `os-detail-template`, `os-dashboard-template`
- Atoms/Molecules: `os-button`, `os-label`, `os-input`, `os-badge`, `os-form-field`, `os-icon`
- Tokens `--os-*` para status de progresso (success/warning/error) conforme thresholds

### New Components Required

- `GoalCard` (feature) e `GoalList` (feature) — componentes de apresentação na feature, sobre `os-card` e barras de progresso do DS
- Sem novos componentes no DS para V1; considerar `GoalProgress` organism no DS futuramente

### Layout Architecture

- Lista: grid responsivo (mobile 1 col; tablet 2 col; desktop 3–4 col)
- Formulário: `os-form-template` com ações (Salvar/Cancelar) e progress opcional
- Detalhe: `os-detail-template` com seções (Resumo, Aportes, Informações) e sidebar opcional em desktop
- Acessibilidade: landmarks, live regions, focus management seguindo `transactions.page`

### Performance Considerations

- `ChangeDetectionStrategy.OnPush` em páginas e componentes
- Rotas lazy para `/goals`, `/goals/new`, `/goals/:id`
- `computed()` para derivar progresso, restante e aporte sugerido

Detalhes completos em: `sessions/OS-228/layout-specification.md`

## 📋 Lista de Implementação (UI)

- [ ] Implementar `GoalCard` e `GoalList` conforme layout-specification
- [ ] Configurar `os-form-template` no formulário de metas
- [ ] Implementar responsividade (mobile/tablet/desktop) nos cards e grids
- [ ] Implementar acessibilidade (ARIA, teclado, live regions)
