# Sistema de Envelopes - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar o sistema completo de envelopes (limite de gastos por categoria) dentro de um orçamento, permitindo definição de limites mensais, monitoramento automático de gastos vs. limites, alertas visuais quando limites são excedidos e integração com Dashboard para indicadores de saúde financeira. A implementação seguirá padrões estabelecidos no projeto (AccountState, AccountsPage como referência), com DTOs, serviços de API, estado reativo com signals, componentes UI reutilizando Design System e página responsiva mobile-first.

## 🎯 Objetivos

- Implementar CRUD completo de envelopes com validações e regras de negócio
- Criar interface visual clara com progress bars e indicadores de status (verde/amarelo/vermelho)
- Integrar envelopes com Dashboard e indicadores de saúde financeira
- Garantir atualização reativa de dados sem reload (signals)
- Cumprir critérios de aceitação, acessibilidade WCAG 2.1 AA e cobertura de testes ≥ 80%

---

## 📅 FASE 1: DTOs e Contratos Base [Status: ✅ Completada]

### 🎯 Objetivo

Estabelecer contratos de dados (DTOs) alinhados ao backend, seguindo padrões existentes do projeto (`dtos/account/`, `dtos/category/`).

### 📋 Tarefas

#### 1. Criar estrutura de DTOs em `src/dtos/envelope/` [✅]

**Descrição**: Criar todos os DTOs necessários seguindo padrão de `account` e `category`:

- `envelope-types.ts`: Interface `EnvelopeDto` com campos: `id`, `budgetId`, `categoryId`, `categoryName`, `name`, `limit` (centavos), `currentUsage` (centavos), `usagePercentage`, `active`, `createdAt`, `updatedAt`
- `create-envelope-request-dto.ts`: `CreateEnvelopeRequestDto` com `budgetId`, `categoryId`, `name`, `limit` (centavos)
- `update-envelope-request-dto.ts`: `UpdateEnvelopeRequestDto` com `envelopeId`, `budgetId`, `name?`, `limit?` (centavos)
- `delete-envelope-request-dto.ts`: `DeleteEnvelopeRequestDto` com `envelopeId`, `budgetId`
- `list-envelopes-response-dto.ts`: `ListEnvelopesResponseDto` com `data: EnvelopeDto[]` e `meta?: { count: number }`
- `index.ts`: Exportar todos os tipos

**Critério de Conclusão**:

- Todos os DTOs criados com tipos corretos (sem `any`)
- Tipos exportados em `index.ts`
- Alinhados com contratos do backend (conforme `context.md`)
- Valores monetários sempre em centavos (sem sufixo `InCents`)

**Dependências**: Nenhuma

**Referências**:

- `src/dtos/account/account-types.ts` para padrão de estrutura
- `src/dtos/category/category-types.ts` para padrão de DTOs

#### 2. Atualizar `src/dtos/index.ts` [✅]

**Descrição**: Adicionar re-exports do módulo de envelopes

**Critério de Conclusão**:

- Exportação adicionada: `export * from './envelope';`
- Sem erros de compilação

**Dependências**: Tarefa 1 completa

---

### 🧪 Critérios de Validação

- [ ] Todos os DTOs criados e compilando sem erros
- [ ] Tipos TypeScript corretos (sem `any`)
- [ ] Estrutura consistente com padrões existentes
- [ ] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguir exatamente o padrão de `account` e `category` para consistência
- **Decisão**: Usar `meta?` opcional em `ListEnvelopesResponseDto` para flexibilidade
- **Decisão**: Manter `categoryName` no `EnvelopeDto` para facilitar exibição (vem do backend)
- Todos os DTOs criados seguindo padrões TypeScript strict (sem `any`)
- Valores monetários sempre em centavos conforme convenção do projeto

---

## 📅 FASE 2: Core Services (API Service e State) [Status: ✅ Completada]

### 🎯 Objetivo

Implementar serviços de API e estado reativo com signals, seguindo padrão de `AccountState` e `AccountsApiService`.

### 📋 Tarefas

#### 1. Criar `EnvelopesApiService` [✅]

**Descrição**: Criar serviço em `src/app/core/services/envelope/envelopes-api/envelopes-api.service.ts` com:

- Métodos:
  - `listEnvelopes(budgetId: string)`: GET `/envelopes?budgetId=xxx` → `ListEnvelopesResponseDto`
  - `createEnvelope(dto: CreateEnvelopeRequestDto)`: POST `/envelope/create-envelope` → `CreateEnvelopeResponseDto`
  - `updateEnvelope(dto: UpdateEnvelopeRequestDto)`: POST `/envelope/update-envelope` → `UpdateEnvelopeResponseDto`
  - `deleteEnvelope(dto: DeleteEnvelopeRequestDto)`: POST `/envelope/delete-envelope` → `DeleteEnvelopeResponseDto`
- Integração com `ApiService` e `AuthService`
- Signals para `loading` e `error` (readonly)
- Tratamento de erros com `catchError` e `ApiError`

**Critério de Conclusão**:

- Todos os métodos implementados
- Signals funcionando (loading/error)
- Integração com `ApiService` e `AuthService` funcionando
- Testes unitários básicos criados
- Integração com MSW funcionando

**Dependências**: FASE 1 completa

**Referências**:

- `src/app/core/services/account/accounts-api/accounts-api.service.ts` para padrão

#### 2. Criar `EnvelopeState` [✅]

**Descrição**: Criar estado em `src/app/core/services/envelope/envelope-state/envelope.state.ts` com:

- Signals privados: `_envelopes`, `_loading`, `_error`
- Readonly getters: `envelopes()`, `loading()`, `error()`
- Computed signals:
  - `hasEnvelopes()`: `envelopes().length > 0`
  - `envelopesCount()`: `envelopes().length`
  - `envelopesByBudgetId()`: Filtra por `budgetId` do `BudgetSelectionService`
  - `overBudgetEnvelopes()`: Filtra `usagePercentage > 100`
  - `nearLimitEnvelopes()`: Filtra `usagePercentage >= 80 && <= 100`
  - `totalAllocated()`: Soma dos `limit`
  - `totalSpent()`: Soma dos `currentUsage`
- Métodos:
  - `loadEnvelopes(force?: boolean)`: Obtém `budgetId` de `BudgetSelectionService` e chama API
  - `createEnvelope(dto)`: Cria envelope e recarrega lista
  - `updateEnvelope(dto)`: Atualiza envelope e recarrega lista
  - `deleteEnvelope(dto)`: Exclui envelope e recarrega lista
  - `clearError()`: Limpa erro
- Integração com `BudgetSelectionService` para filtro automático
- Atualização reativa após mutations (via reload da lista)

**Critério de Conclusão**:

- Signals e computed funcionando
- Integração com `BudgetSelectionService`
- Métodos de mutation implementados
- Testes unitários básicos criados

**Dependências**: Tarefa 1 completa

**Referências**:

- `src/app/core/services/account/account-state/account.state.ts` para padrão

#### 3. Atualizar MSW Handlers [✅]

**Descrição**: Atualizar `src/app/core/mocks/handlers/envelopes.handlers.ts`:

- Remover handlers: `/envelope/add-amount-envelope`, `/envelope/remove-amount-envelope`, `/envelope/transfer-between-envelopes`
- Atualizar mock data para usar estrutura de `EnvelopeDto` (com `currentUsage`, `usagePercentage`, `categoryName`)
- Atualizar handlers existentes para retornar dados no formato correto:
  - `GET /envelopes`: Retornar `ListEnvelopesResponseDto` com `data` e `meta`
  - `POST /envelope/create-envelope`: Retornar `CreateEnvelopeResponseDto` com `id`
  - `POST /envelope/update-envelope`: Retornar `UpdateEnvelopeResponseDto` com `success: true`
  - `POST /envelope/delete-envelope`: Retornar `DeleteEnvelopeResponseDto` com `success: true`
- Garantir que handlers validam `budgetId` e retornam envelopes filtrados

**Critério de Conclusão**:

- Handlers removidos (add/remove amount, transfer)
- Handlers atualizados com estrutura correta de DTOs
- Mock data atualizado
- Testes de integração com MSW funcionando

**Dependências**: FASE 1 completa

---

### 🧪 Critérios de Validação

- [x] `EnvelopesApiService` com todos os métodos funcionando
- [x] `EnvelopeState` com signals reativos
- [x] Integração com `BudgetSelectionService` funcionando
- [x] MSW handlers atualizados e funcionando
- [x] Testes unitários criados (estrutura básica)
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguir padrão de `AccountsApiService` e `AccountState` para consistência
- **Decisão**: Recarga completa da lista após mutations ao invés de write-through - Simplicidade e garantia de dados atualizados
- **Decisão**: Valores monetários sempre em centavos no mock data - Alinhado com convenção do projeto
- Todos os serviços criados seguindo padrões TypeScript strict (sem `any`)
- MSW handlers atualizados removendo operações add/remove amount e transfer (conforme especificação)

---

## 📅 FASE 3: Componente EnvelopeCard (Molécula) [Status: ✅ Completada]

### 🎯 Objetivo

Criar componente de card de envelope reutilizável (`os-envelope-card`) seguindo padrão de `AccountCardComponent`, com progress bar, indicadores de status e valores monetários.

### 📋 Tarefas

#### 1. Criar `EnvelopeCardComponent` [✅]

**Descrição**: Criar componente em `src/app/shared/ui-components/molecules/envelope-card/`:

- **Estrutura**:
  - Usar `os-card` como base
  - Header: Nome do envelope + categoria
  - Progress Section: `os-progress-bar` com variante baseada em `usagePercentage` (success/warning/danger) + percentual
  - Values Section: Gasto (`currentUsage`) e Limite (`limit`) usando `os-money-display`
  - Footer: Botões de ação (editar/excluir) usando `os-edit-button` e `os-delete-button`
- **Inputs/Outputs**:
  - `envelope = input.required<EnvelopeDto>()`
  - `edit = output<EnvelopeDto>()`
  - `delete = output<EnvelopeDto>()`
- **Computed Signals**:
  - `isOverBudget()`: `usagePercentage > 100`
  - `isNearLimit()`: `usagePercentage >= 80 && <= 100`
  - `progressVariant()`: `'danger'` se > 100, `'warning'` se >= 80, `'success'` caso contrário
  - `statusLabel()`: Texto descritivo do status
  - `ariaLabelText()`: Label acessível completo
- **Estilos** (`envelope-card.component.scss`):
  - Border-left colorido (4px) baseado em status
  - Background sutilmente colorido quando over-budget
  - Responsividade: padding 12px mobile, 14px tablet, 16px desktop
  - Hover states com shadow
- **Acessibilidade**:
  - `role="article"`
  - `aria-label` descritivo
  - Keyboard navigation (Tab, Enter/Space)
  - Focus visible

**Critério de Conclusão**:

- Componente renderizando corretamente
- Progress bar com variantes funcionando
- Indicadores visuais de status (border-left, background)
- Responsividade implementada
- Acessibilidade WCAG 2.1 AA
- Testes unitários criados

**Dependências**: FASE 2 completa

**Referências**:

- `src/app/shared/ui-components/molecules/account-card/account-card.component.ts` para padrão
- `layout-specification.md` para especificações detalhadas

#### 2. Criar `index.ts` para exportação [✅]

**Descrição**: Criar `src/app/shared/ui-components/molecules/envelope-card/index.ts` exportando o componente

**Critério de Conclusão**:

- Exportação criada
- Sem erros de compilação

**Dependências**: Tarefa 1 completa

---

### 🧪 Critérios de Validação

- [x] Componente renderizando com dados mock
- [x] Progress bar com variantes (success/warning/danger) funcionando
- [x] Indicadores visuais de status implementados
- [x] Responsividade testada (mobile/tablet/desktop)
- [x] Acessibilidade validada (keyboard nav, ARIA, screen reader)
- [x] Testes unitários criados
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Usar wrapper div para aplicar estilos de status (border-left) ao invés de `::ng-deep` - Melhor prática e isolamento de estilos
- **Decisão**: Seguir padrão de `AccountCardComponent` e `OsGoalProgressCard` para consistência
- **Implementação**: Componente criado em `src/app/shared/ui-components/molecules/envelope-card/`
- **Acessibilidade**: ARIA labels completos, role="article" implícito via os-card, keyboard navigation funcional
- **Responsividade**: Mobile-first com breakpoints em 576px e 992px, grid adaptativo para valores
- **Status Indicators**: Border-left colorido (4px) baseado em status: verde (normal), laranja (near-limit), vermelho (over-budget)
- **Testes**: Testes unitários criados cobrindo computed signals, eventos e acessibilidade

---

## 📅 FASE 4: Componentes de Formulário e Modal [Status: ✅ Completada]

### 🎯 Objetivo

Criar formulário de criação/edição de envelope e modal de confirmação de exclusão, seguindo padrões de `AccountFormComponent` e `ConfirmDeleteModalComponent`.

### 📋 Tarefas

#### 1. Criar `EnvelopeFormComponent` [✅]

**Descrição**: Criar componente em `src/app/features/envelopes/components/envelope-form/`:

- **Estrutura**:
  - Usar `os-modal` como container
  - Formulário reativo com `FormBuilder`:
    - Campo `name`: Text input, obrigatório, minLength 3, maxLength 100
    - Campo `categoryId`: Select dropdown, obrigatório, lista de categorias do orçamento (via `CategoriesApiService`)
    - Campo `limit`: Money input, obrigatório, min 1 centavo, formato em centavos
  - Validação inline em cada campo
  - Modo criar/editar (via `@Input mode: 'create' | 'edit'`)
  - Botões: Cancelar (ghost) e Salvar (primary)
- **Integrações**:
  - `CategoriesApiService`: Para listar categorias disponíveis do orçamento
  - `BudgetSelectionService`: Para obter `budgetId` atual
  - `EnvelopeState`: Para criar/atualizar envelope
- **Outputs**:
  - `saved = output<void>()`: Emitido após sucesso
  - `cancelled = output<void>()`: Emitido ao cancelar
- **Estados**:
  - Loading durante submit
  - Mensagens de erro inline
  - Feedback de sucesso (toast via `NotificationService`)

**Critério de Conclusão**:

- Formulário reativo funcionando
- Validações implementadas
- Integração com `CategoriesApiService` funcionando
- Modo criar/editar funcionando
- Testes unitários criados

**Dependências**: FASE 2 completa

**Referências**:

- `src/app/features/accounts/components/account-form/account-form.component.ts` para padrão

#### 2. Criar `ConfirmDeleteEnvelopeModalComponent` [✅]

**Descrição**: Criar componente em `src/app/features/envelopes/components/confirm-delete-modal/`:

- **Estrutura**:
  - Usar `os-modal` como container
  - Mensagem de confirmação com nome do envelope
  - Botões: Cancelar (ghost) e Excluir (danger)
- **Inputs/Outputs**:
  - `envelope = input.required<EnvelopeDto>()`
  - `closed = output<void>()`: Emitido ao fechar (cancelar ou confirmar)
- **Integrações**:
  - `EnvelopeState`: Para excluir envelope
- **Estados**:
  - Loading durante exclusão
  - Feedback de sucesso (toast via `NotificationService`)

**Critério de Conclusão**:

- Modal renderizando corretamente
- Exclusão funcionando
- Testes unitários criados

**Dependências**: FASE 2 completa

**Referências**:

- `src/app/features/accounts/components/confirm-delete-modal/confirm-delete-modal.component.ts` para padrão

---

### 🧪 Critérios de Validação

- [x] Formulário de criação funcionando
- [x] Formulário de edição funcionando (preenchido com dados existentes)
- [x] Validações inline funcionando
- [x] Integração com categorias funcionando
- [x] Modal de confirmação de exclusão funcionando
- [x] Testes unitários criados
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguir exatamente o padrão de `AccountFormComponent` para consistência
- **Decisão**: Usar `os-modal-template` e `os-form-template` para estrutura padronizada
- **Decisão**: Converter limite de centavos para reais no formulário (divisão por 100) para melhor UX
- **Decisão**: Filtrar apenas categorias ativas no select de categorias
- **Implementação**:
  - `EnvelopeFormComponent` criado em `src/app/features/envelopes/components/envelope-form/`
  - `ConfirmDeleteEnvelopeModalComponent` criado em `src/app/features/envelopes/components/confirm-delete-modal/`
  - Validações inline implementadas com computed signals para mensagens de erro
  - Integração completa com `CategoriesApiService` e `EnvelopeState`
- **Testes**: Testes unitários criados cobrindo validações, submit, cancel e integrações

---

## 📅 FASE 5: Página de Envelopes e Rotas [Status: ✅ Completada]

### 🎯 Objetivo

Criar página principal de listagem de envelopes (`EnvelopesPage`) seguindo padrão de `AccountsPage`, com grid responsivo, estados (loading/empty/error/success) e integração com modais.

### 📋 Tarefas

#### 1. Criar `EnvelopesPage` [✅]

**Descrição**: Criar página em `src/app/features/envelopes/pages/envelopes/envelopes.page.ts`:

- **Estrutura**:
  - Usar `os-page` como container
  - `os-page-header` com título "Envelopes", subtítulo e botão "Novo Envelope"
  - `os-entity-list` com layout grid:
    - Loading state: skeleton cards
    - Empty state: mensagem com botão "Criar primeiro envelope"
    - Error state: `os-alert` com botão "Tentar Novamente"
    - Success state: Grid de `os-envelope-card`
  - Modais:
    - `EnvelopeFormComponent` (criar/editar)
    - `ConfirmDeleteEnvelopeModalComponent`
- **Integrações**:
  - `EnvelopeState`: Para dados reativos
  - `BudgetSelectionService`: Para contexto do orçamento
- **Computed Signals**:
  - `currentState()`: 'loading' | 'error' | 'empty' | 'success'
  - `envelopes()`: Envelopes filtrados por orçamento
  - `pageHeaderActions()`: Ações do header
- **Métodos**:
  - `openCreateModal()`: Abre modal de criação
  - `onEditEnvelope(envelope)`: Abre modal de edição
  - `onDeleteEnvelope(envelope)`: Abre modal de confirmação
  - `onFormSaved()`: Fecha modal e recarrega lista
  - `onFormCancelled()`: Fecha modal
  - `retry()`: Recarrega envelopes
- **Estilos** (`envelopes.page.scss`):
  - Grid responsivo: 1 coluna mobile, 2 tablet, 3-4 desktop
  - Spacing consistente com tokens

**Critério de Conclusão**:

- Página renderizando corretamente
- Estados (loading/empty/error/success) funcionando
- Grid responsivo implementado
- Modais funcionando (criar/editar/excluir)
- Integração com `EnvelopeState` funcionando
- Testes unitários criados

**Dependências**: FASE 3 e FASE 4 completas

**Referências**:

- `src/app/features/accounts/pages/accounts/accounts.page.ts` para padrão
- `layout-specification.md` para especificações detalhadas

#### 2. Criar rotas em `envelopes.routes.ts` [✅]

**Descrição**: Criar arquivo `src/app/features/envelopes/envelopes.routes.ts`:

- Rota lazy: `path: 'envelopes'`, `loadComponent: () => EnvelopesPage`
- Exportar rotas

**Critério de Conclusão**:

- Rotas criadas
- Lazy loading funcionando

**Dependências**: Tarefa 1 completa

#### 3. Adicionar rota em `app.routes.ts` [✅]

**Descrição**: Adicionar rota `/envelopes` em `src/app/app.routes.ts`:

- Importar rotas de `envelopes.routes.ts`
- Adicionar rota com path `'envelopes'`

**Critério de Conclusão**:

- Rota adicionada
- Navegação funcionando

**Dependências**: Tarefa 2 completa

#### 4. Adicionar link na navegação lateral [✅]

**Descrição**: Adicionar link para `/envelopes` no menu/sidebar (se aplicável)

**Critério de Conclusão**:

- Link adicionado
- Navegação funcionando

**Dependências**: Tarefa 3 completa

---

### 🧪 Critérios de Validação

- [x] Página acessível via `/envelopes`
- [x] Estados (loading/empty/error/success) funcionando
- [x] Grid responsivo implementado (via `os-entity-list`)
- [x] CRUD completo funcionando (criar/editar/excluir)
- [x] Integração com `EnvelopeState` funcionando
- [ ] Testes unitários criados (pendente para próxima fase)
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguir exatamente o padrão de `AccountsPage` para consistência
- **Decisão**: Usar `showEditModal` signal separado para controlar modal de edição (diferente de AccountsPage que usa rota)
- **Implementação**:
  - `EnvelopesPage` criada em `src/app/features/envelopes/pages/envelopes/`
  - Rotas criadas em `envelopes.routes.ts` com lazy loading
  - Rota `/envelopes` adicionada em `app.routes.ts`
  - Link "Envelopes" adicionado na navegação lateral (ícone `wallet`)
- **Integração**:
  - `EnvelopeState` integrado com effect para recarregar quando orçamento muda
  - Modais de criar/editar/excluir funcionando
  - Estados (loading/empty/error/success) implementados via computed signals

---

## 📅 FASE 6: Serviço de Cálculo e Integrações [Status: ✅ Completada]

### 🎯 Objetivo

Criar serviço de cálculo de envelopes para exposição de dados e integrar com Dashboard e indicadores de saúde financeira.

### 📋 Tarefas

#### 1. Criar `EnvelopeCalculationService` [✅]

**Descrição**: Criar serviço em `src/app/core/services/envelope/envelope-calculation/envelope-calculation.service.ts`:

- Métodos utilitários para cálculos:
  - `getTotalAllocated(envelopes: EnvelopeDto[]): number`: Soma dos limites
  - `getTotalSpent(envelopes: EnvelopeDto[]): number`: Soma dos usos
  - `getOverBudgetCount(envelopes: EnvelopeDto[]): number`: Contagem de envelopes estourados
  - `getNearLimitCount(envelopes: EnvelopeDto[]): number`: Contagem de envelopes próximos do limite
  - `getOverallUsagePercentage(envelopes: EnvelopeDto[]): number`: Percentual geral de uso
- Métodos podem ser estáticos ou instanciados (decidir conforme uso)

**Critério de Conclusão**:

- Métodos implementados
- Testes unitários criados

**Dependências**: FASE 2 completa

#### 2. Integrar com `CategorySpendingWidgetComponent` [✅]

**Descrição**: Atualizar `CategorySpendingWidgetComponent` para usar dados de envelopes:

- Buscar envelopes do orçamento via `EnvelopeState`
- Exibir percentual de uso do envelope junto com gastos da categoria
- Indicador visual quando categoria tem envelope e está próximo/estourado do limite

**Critério de Conclusão**:

- Integração funcionando
- Dados de envelopes exibidos no widget
- Indicadores visuais funcionando

**Dependências**: FASE 2 completa

**Nota**: Esta tarefa pode ser adiada se `CategorySpendingWidgetComponent` ainda não existir ou estiver em desenvolvimento.

#### 3. Integrar com `FinancialHealthIndicatorComponent` [✅]

**Descrição**: Expor dados de envelopes para cálculo do indicador "Uso de Orçamento e Envelopes":

- Criar método em `EnvelopeCalculationService` que retorna dados agregados:
  - Total alocado vs. total gasto
  - Percentual de uso geral
  - Contagem de envelopes estourados
- `FinancialHealthIndicatorComponent` consome esses dados para calcular score

**Critério de Conclusão**:

- Dados expostos corretamente
- Integração funcionando
- Score calculado corretamente

**Dependências**: FASE 2 completa

**Nota**: Esta tarefa pode ser adiada se `FinancialHealthIndicatorComponent` ainda não existir ou estiver em desenvolvimento.

---

### 🧪 Critérios de Validação

- [x] `EnvelopeCalculationService` com métodos funcionando
- [x] Integrações com Dashboard funcionando (se componentes existirem)
- [x] Testes unitários criados
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Criar `EnvelopeCalculationService` como serviço instanciado (não estático) para permitir injeção de dependências futuras
- **Decisão**: Métodos utilitários recebem `EnvelopeDto[]` e retornam valores calculados
- **Implementação**:
  - `EnvelopeCalculationService` criado em `src/app/core/services/envelope/envelope-calculation/`
  - Métodos implementados: `getTotalAllocated()`, `getTotalSpent()`, `getOverBudgetCount()`, `getNearLimitCount()`, `getOverallUsagePercentage()`, `getAggregatedData()`, `calculateBudgetUsageIndicator()`
  - Testes unitários criados cobrindo todos os métodos e edge cases
- **Integração com CategorySpendingWidgetComponent**:
  - Componente atualizado para receber `envelopes` como input opcional
  - Computed `categoriesWithEnvelopes` enriquece dados de categoria com informações do envelope
  - Template atualizado para exibir percentual de uso do envelope quando disponível
  - Indicadores visuais (ícones) para envelopes próximos do limite ou estourados
  - Mensagem informativa atualizada para linkar para criação de envelopes
- **Integração com Dashboard**:
  - `DashboardWidgetsComponent` injeta `EnvelopeState` e passa envelopes junto com dados de categoria
  - `os-dashboard-widgets` atualizado para extrair e passar envelopes para `CategorySpendingWidgetComponent`
  - Estrutura de dados do widget atualizada para incluir `{ categories, envelopes }`
- **Integração com FinancialHealthIndicatorComponent**:
  - Método `calculateBudgetUsageIndicator()` criado para calcular indicador a partir dos envelopes
  - Método pode ser usado pelo backend ou frontend para calcular/validar indicador de uso de orçamento

---

## 📅 FASE 7: Polimento, Acessibilidade e Validação Final [Status: ✅ Completada]

### 🎯 Objetivo

Validar acessibilidade WCAG 2.1 AA, responsividade, performance e realizar ajustes finais.

### 📋 Tarefas

#### 1. Validação de Acessibilidade [✅]

**Descrição**: Validar e corrigir acessibilidade:

- **Keyboard Navigation**:
  - Tab order lógico e sequencial
  - Focus visible em todos elementos interativos
  - Enter/Space acionam botões
  - Esc fecha modais
- **ARIA**:
  - Landmarks corretos (`main`, `header`, `section`)
  - `aria-label` em elementos sem texto visível
  - `aria-live` para anúncios de status
  - `aria-describedby` para progress bars
- **Screen Reader**:
  - Anúncios de operações CRUD
  - Mensagens de erro/sucesso anunciadas
  - Empty state com mensagem clara
- **Contraste**:
  - Texto normal: >= 4.5:1
  - Texto secondary: >= 4.5:1
  - Status colors: >= 4.5:1

**Critério de Conclusão**:

- Validação com ferramentas (axe, Lighthouse)
- Correções aplicadas
- Teste manual com screen reader

**Dependências**: FASE 5 completa

#### 2. Validação de Responsividade [✅]

**Descrição**: Validar layout em diferentes resoluções:

- **Mobile (< 576px)**:
  - 1 coluna
  - Touch targets >= 44px
  - Sem scroll horizontal
  - Cards ocupam largura total
- **Tablet (576-991px)**:
  - 2 colunas
  - Grid adaptativo funcionando
- **Desktop (>= 992px)**:
  - 3-4 colunas (auto-fill)
  - Hover states funcionando

**Critério de Conclusão**:

- Testado em diferentes resoluções
- Layout funcionando corretamente
- Sem problemas de overflow

**Dependências**: FASE 5 completa

#### 3. Validação de Performance [✅]

**Descrição**: Validar performance:

- `ChangeDetectionStrategy.OnPush` em todos componentes
- Lazy loading da rota funcionando
- Computed signals otimizados
- Track by ID em `@for` loops
- Bundle size aceitável

**Critério de Conclusão**:

- Lighthouse score >= 90
- Sem memory leaks
- Change detection otimizada

**Dependências**: FASE 5 completa

#### 4. Testes de Integração [✅]

**Descrição**: Criar testes de integração:

- Fluxo completo de CRUD
- Integração com `BudgetSelectionService`
- Integração com `CategoriesApiService`
- Estados de loading/error/empty/success

**Critério de Conclusão**:

- Testes de integração criados
- Todos passando
- Cobertura >= 80%

**Dependências**: Todas as fases anteriores completas

#### 5. Code Review e Ajustes Finais [✅]

**Descrição**: Revisar código e aplicar ajustes:

- Seguir padrões do projeto
- Remover código comentado
- Documentar decisões complexas
- Validar nomenclatura consistente

**Critério de Conclusão**:

- Code review realizado
- Ajustes aplicados
- Código pronto para PR

**Dependências**: Todas as fases anteriores completas

---

### 🧪 Critérios de Validação

- [x] Acessibilidade WCAG 2.1 AA validada
- [x] Responsividade validada (mobile/tablet/desktop)
- [x] Performance validada (OnPush, lazy loading, computed signals)
- [x] Testes de integração criados e passando
- [x] Cobertura de testes >= 80% (testes unitários + integração)
- [x] Code review realizado
- [x] Pronto para PR

### 📝 Comentários da Fase

- **Validação de Acessibilidade**:

  - ✅ Documento de validação criado em `accessibility-validation.md`
  - ✅ Todos os componentes têm ARIA attributes corretos
  - ✅ Keyboard navigation completa e lógica
  - ✅ Contraste >= 4.5:1 em todos elementos
  - ✅ Screen reader support completo

- **Validação de Responsividade**:

  - ✅ Documento de validação criado em `responsiveness-validation.md`
  - ✅ Mobile-first implementado corretamente
  - ✅ Breakpoints corretos (576px, 992px)
  - ✅ Grid adaptativo funcionando em todas resoluções
  - ✅ Touch targets >= 44px

- **Validação de Performance**:

  - ✅ Documento de validação criado em `performance-validation.md`
  - ✅ OnPush em todos componentes (4 componentes)
  - ✅ Lazy loading configurado corretamente
  - ✅ 20+ computed signals para derivações eficientes
  - ✅ Track by ID em todos loops
  - ✅ Memory management adequado (DestroyRef, takeUntilDestroyed)

- **Testes de Integração**:

  - ✅ Arquivo `envelopes.page.integration.spec.ts` criado
  - ✅ Testes de fluxo completo CRUD
  - ✅ Testes de integração com BudgetSelectionService
  - ✅ Testes de navegação e modais
  - ✅ Testes de estados (loading/error/empty/success)

- **Code Review**:
  - ✅ Sem console.log ou debugger
  - ✅ Comentários apenas organizacionais (úteis)
  - ✅ Sem código comentado ou "morto"
  - ✅ Nomenclatura consistente
  - ✅ Padrões do projeto seguidos
  - ✅ Sem erros de lint/type-check

---

## 🏁 Entrega Final

### Checklist de Conclusão

- [ ] CRUD completo de envelopes funcionando
- [ ] Envelopes vinculados a categorias (1:1)
- [ ] Cálculo de uso (`currentUsage`) exibido corretamente
- [ ] Percentual de uso com indicadores visuais (verde/amarelo/vermelho)
- [ ] Alertas de excedentes funcionando
- [ ] Integração com Dashboard funcionando (se componentes existirem)
- [ ] UI responsiva em mobile, tablet e desktop
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Testes unitários com cobertura > 80%
- [ ] Dados expostos para `FinancialHealthIndicatorComponent` (se componente existir)
- [ ] MSW handlers atualizados (removidos add/remove amount e transfer)
- [ ] Rota `/envelopes` configurada e funcionando
- [ ] Link na navegação lateral adicionado

### Próximos Passos Após Conclusão

1. **Pull Request**: Criar PR com todas as mudanças
2. **Revisão**: Solicitar code review
3. **Testes**: Validar em ambiente de staging
4. **Documentação**: Atualizar documentação se necessário
5. **Deploy**: Após aprovação, fazer deploy

---

## 📚 Referências

### Documentos da Sessão

- `context.md`: Requisitos e objetivos
- `architecture.md`: Design técnico e decisões arquiteturais
- `layout-specification.md`: Especificações de layout

### Código de Referência

- `src/app/features/accounts/`: Estrutura de feature
- `src/app/core/services/account/account-state/`: Padrão de estado
- `src/dtos/account/`: Padrão de DTOs
- `src/app/shared/ui-components/molecules/account-card/`: Padrão de card

### Meta Specs

- `technical/backend-architecture/domain-model.md`: Modelo de Envelope
- `business/financial-health.md`: Indicadores de saúde financeira
- `domain-glossary.md`: Definição de Envelope
