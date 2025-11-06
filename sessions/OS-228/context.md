# Metas (Goals) - Contexto de Desenvolvimento

# OS-228

## 🎯 Objetivo

Implementar a funcionalidade de Metas (Goals) ponta a ponta no frontend: DTOs alinhados ao backend, serviços (CRUD + adicionar/remover aporte + listagem por orçamento), estado com signals/computed (progresso, restante, aporte mensal linear), e UI completa (lista, formulário, detalhe e cartões) com indicadores de progresso e validações SMART básicas. Integração com Budget apenas para validações. Rota base `/goals` com subrotas (ex.: `/goals/new`, `/goals/:id`).

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- Criar meta
- Atualizar meta
- Excluir meta
- Adicionar aporte
- Remover aporte
- Listar metas por orçamento

### Comportamentos Esperados

- Progresso: `currentAmount / targetAmount` em %, arredondado para 2 casas decimais (exibição).
- Restante: `max(targetAmount - currentAmount, 0)`.
- Aporte mensal sugerido (exibição apenas): `valorRestante / mesesRestantes` com 2 casas decimais; se não houver `deadline`, exibir `—`.
- Validações SMART básicas no formulário (título obrigatório, valor alvo > 0, data-alvo opcional ≥ hoje).
- Impedir `currentAmount` negativo; não permitir remoção de aporte que resulte em acumulado < 0.

## 🏗️ Considerações Técnicas

### Arquitetura

- Angular 20+ (standalone), `signals` e `computed`, `ChangeDetectionStrategy.OnPush`, lazy routing.
- Clean Architecture e DTO-first no frontend (alinhado às Meta Specs).
- Navegação: rota `/goals` com subrotas (`/goals/new`, `/goals/:id`). Breadcrumbs não utilizados atualmente.
- Padrão de página segue `transactions.page.ts` (estado local, carregamento incremental quando aplicável, acessibilidade, notificações, integração com seleção de orçamento).

### Tecnologias e Dependências

- `BudgetSelectionService`: seleção/validação de orçamento (seguir padrão de transações).
- `NotificationService`: feedback de sucesso/erro.
- `AuthService`: acesso ao usuário atual quando necessário.
- `GoalsApiService` (novo): CRUD e operações de aporte.
- `GoalsState` (novo): estado reativo com signals/computed (progresso, restante, aporte sugerido).
- `MSW`/mocks para `sourceAccountId` (lista de contas ainda não existe).

### DTOs (frontend)

- `GoalDto`: `{ id: string; name: string; targetAmount: number; currentAmount: number; dueDate: string | null; budgetId: string; sourceAccountId: string; }`
- `CreateGoalDto`: `{ name: string; totalAmount: number; accumulatedAmount?: number; deadline?: string; budgetId: string; sourceAccountId: string; }`
- `UpdateGoalDto`: `{ id: string; name: string; totalAmount: number; deadline?: string; }`
- `DeleteGoalDto`: `{ id: string; }`
- `AddAmountToGoalDto`: `{ id: string; amount: number; }`
- `RemoveAmountFromGoalDto`: `{ id: string; amount: number; }`

Obs.: nomes e campos alinhados ao issue OS-228; mapear `totalAmount -> targetAmount` e `accumulatedAmount -> currentAmount` quando necessário.

### Padrões a Seguir

- Standalone components, `signals` e `computed` para derivar progresso/valores.
- Padrões de acessibilidade: aria-live (status/alert), foco visível, navegação por teclado.
- Reutilizar componentes de DS existentes (headers, listas, templates de modal, skeletons, estados vazios).
- Regras do repositório (CLAUDE.md): OnPush, inputs/outputs modernos, roteamento lazy, evitar `@HostListener`/`@HostBinding` (usar `host` em decorators quando cabível).

## 🧪 Estratégia de Testes

### Testes Necessários

- Serviços/estado: unit tests (alvo ~100%) cobrindo cálculos (progresso, restante, aporte sugerido) e regras de não-negatividade.
- Componentes: unit tests ≥ 80% (renderização de progresso, thresholds, formulários com validação, ações de aporte/remoção, exclusão).
- Roteamento: teste de navegação básica (`/goals`, `/goals/new`, `/goals/:id`).

### Critérios de Aceitação

- [ ] DTOs definidos (GoalDto, CreateGoalDto, UpdateGoalDto, DeleteGoalDto, AddAmountToGoalDto, RemoveAmountFromGoalDto)
- [ ] `GoalsApiService` com métodos: `create`, `update`, `delete`, `addAmount`, `removeAmount`, `listByBudget`
- [ ] `GoalsState` com `signals`/`computed`: progresso (%), restante, aporte mensal (linear)
- [ ] Integração com `BudgetSelectionService` para validações (ex.: budgetId válido)
- [ ] UI: `GoalList`, `GoalForm`, `GoalCard`, `GoalDetail`
- [ ] Ações na UI: adicionar aporte (números positivos), remover aporte (sem saldo negativo), editar meta, excluir meta (confirmação)
- [ ] Roteamento `/goals` + subrotas (`/goals/new`, `/goals/:id`)
- [ ] Validações SMART básicas no formulário
- [ ] Testes unitários (componentes ≥80%; serviços/estado mirando 100%)
- [ ] Acessibilidade (teclado/ARIA) e responsividade

## 🔗 Dependências e Impactos

### Sistemas Afetados

- Navegação (inclusão do item “Metas” na sidebar; rotas novas `/goals/...`).
- Integração com seleção de orçamento (uso de `BudgetSelectionService`).

### Integrações Necessárias

- Endpoints Goals no backend (CRUD e aporte); alinhamento de contratos conforme OS-228.
- Lista de contas (para `sourceAccountId`): provisoriamente via MSW/mocks até existir serviço real.

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Sem breadcrumbs atualmente.
- `sourceAccountId`: ausência de serviço real — usar mocks.
- SSR-ready; i18n pt-BR; moeda BRL (formatters consistentes com o projeto).

### Riscos

- Divergência de nomenclatura/contratos (ex.: `totalAmount` ↔ `targetAmount`). Mitigar com mappers centralizados e testes.
- Cálculo de meses restantes quando `deadline` é inválida/ausente. Mitigar com fallback (exibir `—`).

## 🎨 Diretrizes de Layout/UX (thresholds)

- Barra linear na lista + opcional gráfico circular no card/detalhe.
- Thresholds por progresso: <33% (erro), 33–66% (aviso), >66% (sucesso).
- Proposta de tokens (pode ajustar aos tokens do DS):
  - erro: `--os-status-danger` (barra/anel e texto auxiliares)
  - aviso: `--os-status-warning`
  - sucesso: `--os-status-success`
- Skeletons, estados vazios e mensagens de erro consistentes com DS.

## 📚 Referências

- Issue: OS-228 (Jira)
- Meta Specs: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- Padrão de página: `src/app/features/transactions/pages/transactions/transactions.page.ts`
- CLAUDE.md (convenções do projeto)


