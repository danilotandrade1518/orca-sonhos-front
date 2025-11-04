# Metas (Goals) - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar a feature de Metas (Goals) ponta a ponta com DTOs alinhados ao backend, serviço de API, estado com signals/computed e UI completa (lista, formulário e detalhe), seguindo Clean Architecture, Design System OrçaSonhos e requisitos de acessibilidade e responsividade.

## 🎯 Objetivos

- Disponibilizar CRUD + aportes (add/remove) de metas por orçamento
- Exibir progresso, restante e aporte mensal sugerido
- Garantir UX acessível (WCAG 2.1 AA), mobile-first e performática (OnPush)

---

## 📅 FASE 1: Fundações de Contratos e Rotas [Status: ⏳]

### 🎯 Objetivo

Definir contratos (DTOs), preparar rotas lazy e esqueleto do serviço de API.

### 📋 Tarefas

#### Definir DTOs de Goal [⏳]

**Descrição**: Criar `src/dtos/goal/goal-types/goal-types.ts` com os tipos `GoalDto`, `CreateGoalDto`, `UpdateGoalDto`, `DeleteGoalDto`, `AddAmountToGoalDto`, `RemoveAmountFromGoalDto` e testes básicos.
**Critério de Conclusão**: Tipos exportados, testes passando, mapeamentos `totalAmount↔targetAmount` e `accumulatedAmount↔currentAmount` documentados.

#### Preparar rotas lazy de Goals [⏳]

**Descrição**: Ajustar `app.routes.ts` adicionando `path: 'goals'` e subrotas `new` e `:id` com `loadComponent` (páginas placeholder).
**Critério de Conclusão**: Navegação funcional entre `'/goals'`, `'/goals/new'` e `'/goals/:id'` com placeholders.

#### Esqueleto do GoalsApiService [⏳]

**Descrição**: Criar `features/goals/services/goals-api/goals-api.service.ts` com métodos assinaturas `create`, `update`, `delete`, `addAmount`, `removeAmount`, `listByBudget` e testes de assinatura.
**Critério de Conclusão**: Serviço disponível via `inject()`, testes de assinatura compilam.

### 🧪 Critérios de Validação

- [ ] Tipos e testes criados
- [ ] Rotas lazy carregam componentes placeholder
- [ ] Service compila com assinaturas corretas

### 📝 Comentários da Fase

_Reservado para anotações._

---

## 📅 FASE 2: Estado (signals) e Cálculos [Status: ⏳]

### 🎯 Objetivo

Implementar `GoalsState` com signals/computed e integração inicial com `GoalsApiService`.

### 📋 Tarefas

#### Implementar GoalsState [⏳]

**Descrição**: Criar `features/goals/state/goals-state/goals.state.ts` com `items`, `isLoading`, `lastUpdated`, computeds `progressById`, `remainingById`, `suggestedMonthlyById` e ações `load/create/update/delete/addAmount/removeAmount`.
**Critério de Conclusão**: Testes unitários cobrindo cálculos e regras de não-negatividade.

#### Integração com BudgetSelectionService [⏳]

**Descrição**: Em `load(budgetId)`, obter `budgetId` do `BudgetSelectionService` e usar no `listByBudget`.
**Critério de Conclusão**: `listByBudget` chamado com `budgetId` válido; testes validam ausência/presença de budget.

### 🧪 Critérios de Validação

- [ ] Cobertura de testes para cálculos e fluxo básico
- [ ] Integração com `BudgetSelectionService` validada

### 📝 Comentários da Fase

_Reservado para anotações._

---

## 📅 FASE 3: UI de Lista (GoalList + Page) [Status: ⏳]

### 🎯 Objetivo

Entregar a página de listagem `/goals` com estados de loading/empty/error e grid responsivo.

### 📋 Tarefas

#### Criar `GoalCard` e `GoalList` (feature) [⏳]

**Descrição**: Componentes de apresentação com barra de progresso, valores (restante, sugerido) e ações (aportar, editar, excluir). Aplicar thresholds (success/warning/error).
**Critério de Conclusão**: Visual conforme `layout-specification.md`, testes ≥ 80%.

#### Implementar `goals.page.ts` [⏳]

**Descrição**: Lista reativa alimentada por `GoalsState`; live regions, skip link, toolbar mínima.
**Critério de Conclusão**: Acessibilidade validada; responsividade sem scroll horizontal.

### 🧪 Critérios de Validação

- [ ] Grid mobile (1 col), tablet (2 col), desktop (3–4 col)
- [ ] Estados loading/empty/error funcionando
- [ ] Ações acionam callbacks

### 📝 Comentários da Fase

_Reservado para anotações._

---

## 📅 FASE 4: Formulário de Criação/Edição [Status: ⏳]

### 🎯 Objetivo

Construir `/goals/new` e fluxo de edição com `os-form-template` e validações SMART básicas.

### 📋 Tarefas

#### Criar `goal-form.component.ts` [⏳]

**Descrição**: Campos: nome, valor alvo, data-alvo (opcional), orçamento, conta origem; dica de aporte sugerido (apenas exibição); validações.
**Critério de Conclusão**: Form acessível (labels, aria), testes de validação.

#### Página `/goals/new` [⏳]

**Descrição**: Usar `os-form-template` (Salvar/Cancelar), chamar `GoalsState.create` e navegar para lista/detalhe.
**Critério de Conclusão**: Criação funcional com feedback visual.

### 🧪 Critérios de Validação

- [ ] Validações SMART básicas
- [ ] Teclado completo e focus visível

### 📝 Comentários da Fase

_Reservado para anotações._

---

## 📅 FASE 5: Detalhe da Meta [Status: ⏳]

### 🎯 Objetivo

Entregar `/goals/:id` com `os-detail-template`, seções e sidebar opcional.

### 📋 Tarefas

#### Página `goal-detail.page.ts` [⏳]

**Descrição**: Seções Resumo (progresso e valores), Aportes (histórico), Informações (prazo, orçamento, conta). Ações editar/excluir.
**Critério de Conclusão**: Navegação por abas/sections acessível, testes de renderização.

### 🧪 Critérios de Validação

- [ ] Leitura clara dos dados e progresso
- [ ] Acessibilidade de regiões e headings

### 📝 Comentários da Fase

_Reservado para anotações._

---

## 📅 FASE 6: Aportes (Adicionar/Remover) [Status: ⏳]

### 🎯 Objetivo

Implementar fluxos de aporte positivo e remoção com validações de não-negatividade.

### 📋 Tarefas

#### Ações de aporte nos componentes [⏳]

**Descrição**: Em `GoalCard`/detalhe, abrir modal/inline para inserir valor; chamar `addAmount`/`removeAmount` do estado, atualizar UI e notificar.
**Critério de Conclusão**: Regras evitam `currentAmount < 0`; testes cobrem erros.

### 🧪 Critérios de Validação

- [ ] Regras de negócio aplicadas
- [ ] Mensagens de erro anunciadas (aria-live assertive)

### 📝 Comentários da Fase

_Reservado para anotações._

---

## 📅 FASE 7: Mocks de Contas e Notificações [Status: ⏳]

### 🎯 Objetivo

Viabilizar `sourceAccountId` com MSW/mocks e padronizar feedback ao usuário.

### 📋 Tarefas

#### MSW para contas [⏳]

**Descrição**: Criar `src/mocks/accounts/*` com shape mínimo; integrar no dev.
**Critério de Conclusão**: Formulário lista contas; testes de fallback.

#### NotificationService [⏳]

**Descrição**: Sucesso/erro em operações CRUD/aportes.
**Critério de Conclusão**: Mensagens consistentes, testáveis.

### 🧪 Critérios de Validação

- [ ] Lista de contas aparece e seleciona
- [ ] Notificações exibidas e acessíveis

### 📝 Comentários da Fase

_Reservado para anotações._

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

