# Metas (Goals) - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar a feature de Metas (Goals) ponta a ponta com DTOs alinhados ao backend, serviço de API, estado com signals/computed e UI completa (lista, formulário e detalhe), seguindo Clean Architecture, Design System OrçaSonhos e requisitos de acessibilidade e responsividade.

## 🎯 Objetivos

- Disponibilizar CRUD + aportes (add/remove) de metas por orçamento
- Exibir progresso, restante e aporte mensal sugerido
- Garantir UX acessível (WCAG 2.1 AA), mobile-first e performática (OnPush)

---

## 📅 FASE 1: Fundações de Contratos e Rotas [Status: ✅]

### 🎯 Objetivo

Definir contratos (DTOs), preparar rotas lazy e esqueleto do serviço de API.

### 📋 Tarefas

#### Definir DTOs de Goal [✅]

**Descrição**: Criar `src/dtos/goal/goal-types/goal-types.ts` com os tipos `GoalDto`, `CreateGoalDto`, `UpdateGoalDto`, `DeleteGoalDto`, `AddAmountToGoalDto`, `RemoveAmountFromGoalDto` e testes básicos.
**Critério de Conclusão**: Tipos exportados, testes passando, mapeamentos `totalAmount↔targetAmount` e `accumulatedAmount↔currentAmount` documentados.

#### Preparar rotas lazy de Goals [✅]

**Descrição**: Ajustar `app.routes.ts` adicionando `path: 'goals'` e subrotas `new` e `:id` com `loadComponent` (páginas placeholder).
**Critério de Conclusão**: Navegação funcional entre `'/goals'`, `'/goals/new'` e `'/goals/:id'` com placeholders.

#### Esqueleto do GoalsApiService [✅]

**Descrição**: Criar `features/goals/services/goals-api/goals-api.service.ts` com métodos assinaturas `create`, `update`, `delete`, `addAmount`, `removeAmount`, `listByBudget` e testes de assinatura.
**Critério de Conclusão**: Serviço disponível via `inject()`, testes de assinatura compilam.

### 🧪 Critérios de Validação

- [x] Tipos e testes criados
- [x] Rotas lazy carregam componentes placeholder
- [x] Service compila com assinaturas corretas

### 📝 Comentários da Fase

- **Decisão**: DTOs criados com mapeamento entre nomenclatura do backend (`totalAmount`, `accumulatedAmount`) e frontend (`targetAmount`, `currentAmount`)
- **Decisão**: Rotas lazy configuradas seguindo padrão de `transactions.routes.ts` e `budget.routes.ts`
- **Decisão**: GoalsApiService usa `ApiResponse<T>` como tipo de retorno para manter consistência com ApiService
- **Implementação**: Páginas placeholder criadas para `/goals`, `/goals/new` e `/goals/:id`
- **Testes**: Testes básicos de assinatura criados para GoalsApiService e GoalDto
- **Correção**: Adicionado handler MSW para endpoint `remove-amount-goal` que estava faltando

---

## 📅 FASE 2: Estado (signals) e Cálculos [Status: ✅]

### 🎯 Objetivo

Implementar `GoalsState` com signals/computed e integração inicial com `GoalsApiService`.

### 📋 Tarefas

#### Implementar GoalsState [✅]

**Descrição**: Criar `features/goals/state/goals-state/goals.state.ts` com `items`, `isLoading`, `lastUpdated`, computeds `progressById`, `remainingById`, `suggestedMonthlyById` e ações `load/create/update/delete/addAmount/removeAmount`.
**Critério de Conclusão**: Testes unitários cobrindo cálculos e regras de não-negatividade.

#### Integração com BudgetSelectionService [✅]

**Descrição**: Em `load(budgetId)`, obter `budgetId` do `BudgetSelectionService` e usar no `listByBudget`.
**Critério de Conclusão**: `listByBudget` chamado com `budgetId` válido; testes validam ausência/presença de budget.

### 🧪 Critérios de Validação

- [x] Cobertura de testes para cálculos e fluxo básico
- [x] Integração com `BudgetSelectionService` validada

### 📝 Comentários da Fase

- **Implementação**: GoalsState criado com signals/computed seguindo padrão do BudgetState
- **Cálculos**: Implementados progressById (%), remainingById (max(target - current, 0)), suggestedMonthlyById (remaining / months)
- **Validações**: Regras de não-negatividade implementadas (impedir currentAmount < 0, validar amount > 0)
- **Integração**: GoalsState integrado com BudgetSelectionService para obter budgetId automaticamente
- **Mapper**: Criado mapper para converter entre nomenclaturas backend (totalAmount, accumulatedAmount) e frontend (targetAmount, currentAmount)
- **Testes**: Cobertura completa de testes unitários incluindo cálculos, validações e integração

---

## 📅 FASE 3: UI de Lista (GoalList + Page) [Status: ✅]

### 🎯 Objetivo

Entregar a página de listagem `/goals` com estados de loading/empty/error e grid responsivo.

### 📋 Tarefas

#### Criar `GoalCard` e `GoalList` (feature) [✅]

**Descrição**: Componentes de apresentação com barra de progresso, valores (restante, sugerido) e ações (aportar, editar, excluir). Aplicar thresholds (success/warning/error).
**Critério de Conclusão**: Visual conforme `layout-specification.md`, testes ≥ 80%.

#### Implementar `goals.page.ts` [✅]

**Descrição**: Lista reativa alimentada por `GoalsState`; live regions, skip link, toolbar mínima.
**Critério de Conclusão**: Acessibilidade validada; responsividade sem scroll horizontal.

### 🧪 Critérios de Validação

- [x] Grid mobile (1 col), tablet (2 col), desktop (3–4 col)
- [x] Estados loading/empty/error funcionando
- [x] Ações acionam callbacks

### 📝 Comentários da Fase

- **Implementação**: Criados `GoalCard` e `GoalList` com progresso, restante e aporte sugerido
- **Página**: `goals.page.ts` integra `GoalsState`, skip link e live regions (status/erro)
- **Responsividade**: Grid 1/2/3 col conforme breakpoints; sem scroll horizontal
- **A11y**: Landmarks e ARIA aplicados; callbacks conectados às ações

---

## 📅 FASE 4: Formulário de Criação/Edição [Status: ✅]

### 🎯 Objetivo

Construir `/goals/new` e fluxo de edição com `os-form-template` e validações SMART básicas.

### 📋 Tarefas

#### Criar `goal-form.component.ts` [✅]

**Descrição**: Campos: nome, valor alvo, data-alvo (opcional), orçamento, conta origem; dica de aporte sugerido (apenas exibição); validações.
**Critério de Conclusão**: Form acessível (labels, aria), testes de validação.

#### Página `/goals/new` [✅]

**Descrição**: Usar `os-form-template` (Salvar/Cancelar), chamar `GoalsState.create` e navegar para lista/detalhe.
**Critério de Conclusão**: Criação funcional com feedback visual.

### 🧪 Critérios de Validação

- [x] Validações SMART básicas
- [x] Teclado completo e focus visível

### 📝 Comentários da Fase

- **Implementação**: `os-goal-form` criado com Reactive Forms + `os-form-template`
- **Validações**: obrigatoriedade, mínimo > 0, `deadline` não passada
- **UX/A11y**: dica de aporte sugerido, labels e foco visível; botões Salvar/Cancelar
- **Fluxo**: `goals-new.page.ts` chama `GoalsState.create` e retorna à lista

---

## 📅 FASE 5: Detalhe da Meta [Status: ✅]

### 🎯 Objetivo

Entregar `/goals/:id` com `os-detail-template`, seções e sidebar opcional.

### 📋 Tarefas

#### Página `goal-detail.page.ts` [✅]

**Descrição**: Seções Resumo (progresso e valores), Aportes (histórico), Informações (prazo, orçamento, conta). Ações editar/excluir.
**Critério de Conclusão**: Navegação por abas/sections acessível, testes de renderização.

### 🧪 Critérios de Validação

- [x] Leitura clara dos dados e progresso
- [x] Acessibilidade de regiões e headings

### 📝 Comentários da Fase

- **Implementação**: `goal-detail.page.ts` usa `os-detail-template` com seções Resumo e Informações
- **Seções**: Resumo (progresso, acumulado, restante, aporte sugerido) e Informações (campos da meta)
- **Sidebar**: exibe orçamento e conta origem
- **Ações**: Editar navega para `../:id`; Excluir chama `GoalsState.delete` e retorna à lista

---

## 📅 FASE 6: Aportes (Adicionar/Remover) [Status: ✅]

### 🎯 Objetivo

Implementar fluxos de aporte positivo e remoção com validações de não-negatividade.

### 📋 Tarefas

#### Ações de aporte nos componentes [✅]

**Descrição**: Em `GoalCard`/detalhe, abrir modal/inline para inserir valor; chamar `addAmount`/`removeAmount` do estado, atualizar UI e notificar.
**Critério de Conclusão**: Regras evitam `currentAmount < 0`; testes cobrem erros.

### 🧪 Critérios de Validação

- [x] Regras de negócio aplicadas
- [x] Mensagens de erro anunciadas (aria-live assertive)

### 📝 Comentários da Fase

- **Implementação**: Criado `goal-amount-modal` com modo add/remove e validações de não-negatividade
- **Validações**: Impede saldo negativo ao remover; valida valor mínimo > 0; exibe valor após remoção em tempo real
- **Integração**: Modal integrado em `goals.page.ts` e `goal-detail.page.ts`; ações adicionadas no template de detalhe
- **A11y**: Mensagens de erro em aria-live assertive; feedback visual de validação
- **Notificações**: Sucesso exibido após operações via `NotificationService.showSuccess`

---

## 📅 FASE 7: Mocks de Contas e Notificações [Status: ✅]

### 🎯 Objetivo

Viabilizar `sourceAccountId` com MSW/mocks e padronizar feedback ao usuário.

### 📋 Tarefas

#### MSW para contas [✅]

**Descrição**: Criar `src/app/features/goals/services/accounts-helper/accounts-helper.service.ts` com shape mínimo; integrar no dev.
**Critério de Conclusão**: Formulário lista contas; testes de fallback.

#### NotificationService [✅]

**Descrição**: Sucesso/erro em operações CRUD/aportes.
**Critério de Conclusão**: Mensagens consistentes, testáveis.

### 🧪 Critérios de Validação

- [x] Lista de contas aparece e seleciona
- [x] Notificações exibidas e acessíveis

### 📝 Comentários da Fase

- **Implementação**: Criado `AccountsHelperService` para buscar contas via endpoint `/accounts` do MSW
- **Integração**: Formulário de metas (`goal-form.component.ts`) atualizado para usar `os-select` ao invés de input texto
- **Notificações**: Adicionadas notificações em todas as operações CRUD do `GoalsState` (create, update, delete, addAmount, removeAmount)
- **Consistência**: Notificações centralizadas no `GoalsState`, removidas duplicações nas páginas
- **Testes**: Criados testes básicos para `AccountsHelperService` cobrindo carregamento, erros e busca por ID

---

## 📅 FASE 8: Performance, A11y e Polimento [Status: ⏳]

### 🎯 Objetivo

Garantir OnPush, responsividade fina, tokens/thresholds, e cobertura de testes.

### 📋 Tarefas

#### OnPush e sinais derivados [⏳]

**Descrição**: Confirmar `ChangeDetectionStrategy.OnPush`, `computed()` para derivações.
**Critério de Conclusão**: Sem detecção desnecessária; checagem manual.

#### Acessibilidade e tokens [⏳]

**Descrição**: Landmarks, skip link, aria-live, foco visível, contraste, thresholds visuais.
**Critério de Conclusão**: Checklist WCAG 2.1 AA atendido.

#### Cobertura de testes [⏳]

**Descrição**: Serviços/estado ~100%, componentes ≥80%.
**Critério de Conclusão**: Relatórios de cobertura atingidos.

### 🏁 Entrega Final

- [ ] Todos os testes passando
- [ ] Documentação atualizada (READMEs, comentários essenciais)
- [ ] Pronto para PR
