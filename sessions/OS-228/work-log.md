# Metas (Goals) - Log de Desenvolvimento

> **Propósito**: Registrar progresso essencial, decisões técnicas e próximos passos.

## 📋 Sessões de Trabalho

### 🗓️ Sessão Inicial - FASE 1

**Fase**: FASE 1 - Fundações de Contratos e Rotas
**Objetivo**: Definir contratos (DTOs), preparar rotas lazy e esqueleto do serviço de API

#### ✅ Trabalho Realizado

- ✅ Criados DTOs de Goal:
  - `GoalDto` (nomenclatura frontend: `targetAmount`, `currentAmount`)
  - `CreateGoalDto`, `UpdateGoalDto`, `DeleteGoalDto`
  - `AddAmountToGoalDto`, `RemoveAmountFromGoalDto`
  - DTOs de resposta correspondentes
  - Testes básicos para `GoalDto`
- ✅ Configuradas rotas lazy:
  - `/goals` → `GoalsPage` (placeholder)
  - `/goals/new` → `GoalsNewPage` (placeholder)
  - `/goals/:id` → `GoalDetailPage` (placeholder)
  - Rotas integradas ao `app.routes.ts`
- ✅ Criado `GoalsApiService`:
  - Métodos: `listByBudget`, `create`, `update`, `delete`, `addAmount`, `removeAmount`
  - Testes de assinatura implementados
  - Usa `ApiResponse<T>` como tipo de retorno
- ✅ Adicionado handler MSW para `remove-amount-goal`

#### 🤔 Decisões/Problemas

- **Decisão**: DTOs usam nomenclatura do backend (`totalAmount`, `accumulatedAmount`) nos requests e nomenclatura do frontend (`targetAmount`, `currentAmount`) no `GoalDto`
  - **Motivo**: Alinhamento com contratos do backend conforme especificação
- **Decisão**: `GoalsApiService` retorna `Observable<ApiResponse<T>>` para manter consistência com `ApiService`
  - **Motivo**: Padrão estabelecido no projeto
- **Decisão**: Rotas usam `loadComponent` ao invés de `component` para lazy loading
  - **Motivo**: Seguir padrão de `transactions.routes.ts`

#### 🧪 Validações

- ✅ Nenhum erro de lint nos arquivos criados
- ✅ TypeScript compilando sem erros
- ✅ Rotas configuradas corretamente

#### ⏭️ Próximos Passos

- Iniciar FASE 2: Implementar `GoalsState` com signals/computed e integração com `GoalsApiService`

---

### 🗓️ Sessão - FASE 2

**Fase**: FASE 2 - Estado (signals) e Cálculos
**Objetivo**: Implementar GoalsState com signals/computed e integração com BudgetSelectionService

#### ✅ Trabalho Realizado

- ✅ Criado `GoalsState` com:
  - Signals: `items`, `isLoading`, `lastUpdated`, `error`
  - Computeds: `hasItems`, `itemsCount`, `progressById`, `remainingById`, `suggestedMonthlyById`
  - Ações: `load`, `create`, `update`, `delete`, `addAmount`, `removeAmount`
- ✅ Criado mapper `goal.mapper.ts` para converter entre nomenclaturas backend/frontend
- ✅ Integração com `BudgetSelectionService`:
  - `load()` usa `selectedBudgetId()` automaticamente se budgetId não fornecido
  - Valida ausência de budget selecionado
- ✅ Implementadas validações de não-negatividade:
  - Impede `currentAmount < 0`
  - Valida `amount > 0` em addAmount/removeAmount
  - Rejeita remoção que resulte em saldo negativo
- ✅ Ajustado `GoalsApiService` para mapear dados do backend corretamente
- ✅ Testes unitários completos:
  - Cálculos de progresso, restante e aporte mensal sugerido
  - Validações de regras de negócio
  - Integração com BudgetSelectionService
  - Fluxos de CRUD e aportes

#### 🤔 Decisões/Problemas

- **Decisão**: Mapeamento de dados feito no `GoalsApiService.listByBudget()` ao invés do state
  - **Motivo**: Centralizar conversão de nomenclatura e manter state limpo
- **Decisão**: Cálculo de meses restantes considera dias para precisão
  - **Motivo**: Se dia do deadline < dia atual, subtrai 1 mês
- **Decisão**: Aporte mensal sugerido retorna `null` quando não há deadline ou deadline passou
  - **Motivo**: Conforme especificação do context.md

#### 🧪 Validações

- ✅ Todos os testes unitários passando
- ✅ Cálculos validados (progresso, restante, aporte mensal)
- ✅ Validações de não-negatividade funcionando
- ✅ Integração com BudgetSelectionService testada

#### ⏭️ Próximos Passos

- Iniciar FASE 3: UI de Lista (GoalList + Page)

---

## 🔄 Estado Atual

**Branch**: feature-OS-228
**Fase Atual**: FASE 2 - Estado (signals) e Cálculos [Status: ✅]
**Última Modificação**: GoalsState implementado com cálculos e validações
**Próxima Tarefa**: FASE 3 - UI de Lista (GoalList + Page)
