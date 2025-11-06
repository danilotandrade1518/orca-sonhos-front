# Credit Cards - Gestão de Cartões de Crédito e Faturas - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementação completa da gestão de cartões de crédito e faturas no frontend, seguindo o padrão arquitetural estabelecido pela feature Accounts. A funcionalidade permitirá aos usuários gerenciar seus cartões de crédito, criar e gerenciar faturas, realizar pagamentos de faturas e reabrir faturas pagas quando necessário.

**Escopo**: CRUD completo de cartões e faturas, pagamento e reabertura de faturas, integração com transações, rotas lazy loading, componentes de UI responsivos e acessíveis.

**Estimativa Total**: ~12-14 horas de trabalho divididas em 6 fases incrementais.

## 🎯 Objetivos

- Implementar CRUD completo de cartões de crédito
- Implementar CRUD completo de faturas de cartão
- Permitir pagamento de faturas com criação automática de transação
- Permitir reabertura de faturas pagas
- Integrar com sistema de transações (campo "Forma de Pagamento")
- Seguir padrão arquitetural de Accounts para consistência
- Garantir responsividade mobile-first e acessibilidade WCAG 2.1 AA

---

## 📅 FASE 1: DTOs e Contratos de Dados [Status: ✅ Completada]

### 🎯 Objetivo

Criar todos os DTOs (Data Transfer Objects) necessários para comunicação entre camadas, alinhados com os contratos do backend e handlers MSW existentes.

### 📋 Tarefas

#### Criar estrutura de diretórios para DTOs [✅]

**Descrição**: Criar pasta `src/dtos/credit-card/` e arquivos base
**Arquivos**:

- `src/dtos/credit-card/credit-card-types.ts`
- `src/dtos/credit-card/credit-card-bill-types.ts`
- `src/dtos/credit-card/index.ts`

**Critério de Conclusão**: Estrutura de diretórios criada, arquivos base criados

**Dependências**: Nenhuma

#### Implementar DTOs de Cartão de Crédito [✅]

**Descrição**: Criar tipos TypeScript em `credit-card-types.ts`:

- `CreditCardDto`: id, name, limit (number em centavos), closingDay (1-31), dueDay (1-31), budgetId
- `CreateCreditCardRequestDto`: name, limit, closingDay, dueDay, budgetId
- `UpdateCreditCardRequestDto`: id, name, limit, closingDay, dueDay
- `DeleteCreditCardRequestDto`: id
- `CreateCreditCardResponseDto`: id
- `UpdateCreditCardResponseDto`: success (boolean)
- `DeleteCreditCardResponseDto`: success (boolean)
- `ListCreditCardsResponseDto`: data (CreditCardDto[])

**Critério de Conclusão**: Todos os tipos criados, exportados, sem erros de TypeScript

**Dependências**: Estrutura de diretórios criada

**Referências**:

- `src/dtos/account/account-types.ts` para padrão
- `src/app/core/mocks/handlers/credit-cards.handlers.ts` para contratos esperados

#### Implementar DTOs de Fatura de Cartão [✅]

**Descrição**: Criar tipos TypeScript em `credit-card-bill-types.ts`:

- `CreditCardBillDto`: id, creditCardId, closingDate (ISO string), dueDate (ISO string), amount (number em centavos), paid (boolean)
- `CreateCreditCardBillRequestDto`: creditCardId, closingDate, dueDate, amount
- `UpdateCreditCardBillRequestDto`: id, closingDate, dueDate, amount
- `DeleteCreditCardBillRequestDto`: id
- `PayCreditCardBillRequestDto`: creditCardBillId, accountId, userId, budgetId, amount, paymentCategoryId
- `ReopenCreditCardBillRequestDto`: creditCardBillId, userId, budgetId, justification
- Response DTOs correspondentes (Create, Update, Delete, Pay, Reopen)
- `ListCreditCardBillsResponseDto`: data (CreditCardBillDto[])

**Critério de Conclusão**: Todos os tipos criados, exportados, sem erros de TypeScript

**Dependências**: Estrutura de diretórios criada

**Referências**:

- `src/dtos/account/account-types.ts` para padrão
- `src/app/core/mocks/handlers/credit-cards.handlers.ts` para contratos esperados

#### Configurar exports centralizados [✅]

**Descrição**: Criar `index.ts` exportando todos os tipos de forma organizada
**Arquivos**: `src/dtos/credit-card/index.ts`

**Critério de Conclusão**: Todos os tipos exportados, imports funcionando corretamente

**Dependências**: DTOs de cartão e fatura criados

### 🧪 Critérios de Validação

- [x] Todos os DTOs criados com tipos corretos
- [x] Tipos exportados em `index.ts`
- [x] Alinhados com contratos do backend (handlers MSW)
- [x] Valores monetários sempre em centavos (number)
- [x] Datas sempre em formato ISO string
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguimos o padrão de DTOs de account, separando tipos principais de Request/Response DTOs em arquivos distintos
- **Decisão**: Valores monetários sempre em centavos (number), não decimais, conforme especificação
- **Decisão**: Datas sempre em formato ISO string (string) para comunicação com backend
- **Implementação**: Todos os DTOs criados seguindo padrão estabelecido:
  - `credit-card-types.ts`: CreditCardDto
  - `credit-card-bill-types.ts`: CreditCardBillDto
  - Request/Response DTOs separados por operação (create, update, delete, pay, reopen)
  - Exports centralizados em `index.ts`
- **Validação**: TypeScript e lint validados sem erros

---

## 📅 FASE 2: Core Services (API Service e State) [Status: ✅ Completada]

### 🎯 Objetivo

Implementar serviços de API e estado reativo com signals, seguindo padrões de `AccountsApiService` e `AccountState`.

### 📋 Tarefas

#### Criar estrutura de diretórios para serviços [✅]

**Descrição**: Criar pastas para serviços de API e estado
**Arquivos**:

- `src/app/core/services/credit-card/credit-card-api/`
- `src/app/core/services/credit-card/credit-card-state/`

**Critério de Conclusão**: Estrutura de diretórios criada

**Dependências**: FASE 1 completa

#### Implementar `CreditCardApiService` [✅]

**Descrição**: Criar serviço em `credit-card-api.service.ts` com:

- `listCreditCards(budgetId: string): Observable<CreditCardDto[]>`
- `createCreditCard(dto: CreateCreditCardRequestDto): Observable<string | null>`
- `updateCreditCard(dto: UpdateCreditCardRequestDto): Observable<boolean>`
- `deleteCreditCard(dto: DeleteCreditCardRequestDto): Observable<boolean>`
- `listCreditCardBills(creditCardId?: string, budgetId?: string): Observable<CreditCardBillDto[]>`
- `createCreditCardBill(dto: CreateCreditCardBillRequestDto): Observable<string | null>`
- `updateCreditCardBill(dto: UpdateCreditCardBillRequestDto): Observable<boolean>`
- `deleteCreditCardBill(dto: DeleteCreditCardBillRequestDto): Observable<boolean>`
- `payCreditCardBill(dto: PayCreditCardBillRequestDto): Observable<boolean>`
- `reopenCreditCardBill(dto: ReopenCreditCardBillRequestDto): Observable<boolean>`
- Signals: `loading`, `error` (readonly)
- Integração com `ApiService` e `AuthService`
- Tratamento de erros com `catchError` e `ApiError`

**Critério de Conclusão**:

- Todos os métodos implementados
- Signals funcionando (loading/error)
- Integração com MSW funcionando
- Testes unitários básicos criados

**Dependências**: FASE 1 completa

**Referências**:

- `src/app/core/services/account/accounts-api/accounts-api.service.ts` para padrão

#### Implementar `CreditCardState` [✅]

**Descrição**: Criar estado em `credit-card.state.ts` com:

- Signals privados: `_creditCards`, `_bills`, `_loading`, `_error`
- Readonly getters: `creditCards()`, `bills()`, `loading()`, `error()`
- Computed signals:
  - `hasCreditCards()`
  - `creditCardsByBudgetId()` (filtra por orçamento atual)
  - `billsByCreditCardId(creditCardId: string)`
- Métodos:
  - `loadCreditCards()`: Obtém `budgetId` de `BudgetSelectionService` e chama API
  - `loadCreditCardBills(creditCardId?, budgetId?)`: Carrega faturas
  - `createCreditCard(dto)`: Cria e recarrega lista
  - `updateCreditCard(dto)`: Atualiza e recarrega lista
  - `deleteCreditCard(dto)`: Exclui e recarrega lista
  - `createCreditCardBill(dto)`: Cria fatura e recarrega
  - `updateCreditCardBill(dto)`: Atualiza fatura e recarrega
  - `deleteCreditCardBill(dto)`: Exclui fatura e recarrega
  - `payCreditCardBill(dto)`: Paga fatura e recarrega
  - `reopenCreditCardBill(dto)`: Reabre fatura e recarrega
- Integração com `BudgetSelectionService` para filtro automático
- Atualização reativa após mutations (via reload da lista)

**Critério de Conclusão**:

- Signals e computed funcionando
- Integração com `BudgetSelectionService`
- Métodos de mutation implementados
- Testes unitários básicos criados

**Dependências**: FASE 2.1 completa

**Referências**:

- `src/app/core/services/account/account-state/account.state.ts` para padrão

#### Adicionar queries GET aos handlers MSW [✅]

**Descrição**: Adicionar handlers GET em `credit-cards.handlers.ts`:

- `GET /api/credit-cards?budgetId=...` - Listar cartões por orçamento
- `GET /api/credit-card-bills?creditCardId=...&budgetId=...` - Listar faturas

**Critério de Conclusão**:

- Handlers GET implementados
- Retornam dados mockados consistentes
- Suportam filtros por budgetId e creditCardId

**Dependências**: FASE 2.1 completa

**Referências**:

- `src/app/core/mocks/handlers/credit-cards.handlers.ts`
- `src/app/core/mocks/handlers/accounts.handlers.ts` para padrão de queries GET

### 🧪 Critérios de Validação

- [x] `CreditCardApiService` com todos os métodos funcionando
- [x] `CreditCardState` com signals reativos
- [x] Integração com `BudgetSelectionService` funcionando
- [x] Queries GET adicionadas aos handlers MSW
- [ ] Testes unitários criados (estrutura básica)
- [x] Sem erros de lint/type-check

### 📝 Comentários da Fase

- **Decisão**: Seguimos o padrão de `AccountsApiService` e `AccountState` para consistência
- **Decisão**: `billsByCreditCardId` implementado como método ao invés de computed signal (mais flexível)
- **Decisão**: `payCreditCardBill` e `reopenCreditCardBill` obtêm `userId` automaticamente do `AuthService`
- **Implementação**: Todos os métodos HTTP implementados (list, create, update, delete para cartões e faturas, pay, reopen)
- **Implementação**: Signals reativos com computed values (`hasCreditCards`, `creditCardsByBudgetId`)
- **Implementação**: Queries GET adicionadas aos handlers MSW com filtros por `budgetId` e `creditCardId`
- **Validação**: TypeScript e lint validados sem erros

---

## 📅 FASE 3: UI Components - Credit Card Card [Status: ⏳]

### 🎯 Objetivo

Criar componente reutilizável `credit-card-card` (molecule) para exibir informações de cartões de crédito, similar ao `account-card`.

### 📋 Tarefas

#### Criar estrutura do componente [⏳]

**Descrição**: Criar arquivos base do componente
**Arquivos**:

- `src/app/shared/ui-components/molecules/credit-card-card/credit-card-card.component.ts`
- `src/app/shared/ui-components/molecules/credit-card-card/credit-card-card.component.scss`
- `src/app/shared/ui-components/molecules/credit-card-card/credit-card-card.component.spec.ts`
- `src/app/shared/ui-components/molecules/credit-card-card/index.ts`

**Critério de Conclusão**: Estrutura criada, imports básicos configurados

**Dependências**: FASE 1 completa (DTOs)

#### Implementar template e lógica do card [⏳]

**Descrição**: Implementar componente com:

- Input: `creditCard: CreditCardDto` (required)
- Input: `actions?: { edit: boolean; delete: boolean }`
- Output: `edit: CreditCardDto`
- Output: `delete: CreditCardDto`
- Exibe: nome, limite, dias de fechamento/vencimento
- Botões de ação: editar, excluir (condicionais)
- Usa `os-card` como base
- Usa `os-money-display` para valores
- Acessibilidade: ARIA labels, roles, keyboard navigation
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Componente renderiza corretamente
- Ações funcionando (edit/delete)
- Acessibilidade implementada
- Estilos básicos aplicados

**Dependências**: Estrutura criada

**Referências**:

- `src/app/shared/ui-components/molecules/account-card/account-card.component.ts` para padrão

#### Implementar estilos responsivos [⏳]

**Descrição**: Criar estilos SCSS seguindo design system:

- Mobile-first approach
- Padding: 16px horizontal, 20px vertical
- Border-radius: 8px
- Hover states para desktop
- Focus states para acessibilidade
- Design tokens (`--os-*`)

**Critério de Conclusão**:

- Estilos responsivos funcionando
- Design tokens aplicados
- Hover/focus states implementados

**Dependências**: Template implementado

#### Criar testes unitários [⏳]

**Descrição**: Testes para:

- Renderização do componente
- Inputs/outputs funcionando
- Ações de editar/excluir
- Acessibilidade (ARIA, keyboard)

**Critério de Conclusão**: Testes criados, cobertura > 80%

**Dependências**: Componente implementado

### 🧪 Critérios de Validação

- [ ] Componente renderiza corretamente
- [ ] Inputs/outputs funcionando
- [ ] Estilos responsivos aplicados
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Testes unitários com cobertura > 80%
- [ ] Sem erros de lint/type-check

### 📝 Comentários da Fase

_[Observações sobre implementação]_

---

## 📅 FASE 4: Feature Credit Cards - Página e Rotas [Status: ⏳]

### 🎯 Objetivo

Criar a feature completa com página de listagem, rotas lazy loading e integração com estado reativo.

### 📋 Tarefas

#### Criar estrutura da feature [⏳]

**Descrição**: Criar estrutura de diretórios
**Arquivos**:

- `src/app/features/credit-cards/credit-cards.routes.ts`
- `src/app/features/credit-cards/pages/credit-cards/credit-cards.page.ts`
- `src/app/features/credit-cards/pages/credit-cards/credit-cards.page.scss`
- `src/app/features/credit-cards/pages/credit-cards/credit-cards.page.spec.ts`

**Critério de Conclusão**: Estrutura criada

**Dependências**: FASE 2 e FASE 3 completas

#### Implementar rotas lazy loading [⏳]

**Descrição**: Criar `credit-cards.routes.ts` com:

- Rota `''`: Página principal
- Rota `'new'`: Modal de criação (via data)
- Rota `':id/edit'`: Modal de edição (via data)

**Critério de Conclusão**: Rotas configuradas, lazy loading funcionando

**Dependências**: Estrutura criada

**Referências**:

- `src/app/features/accounts/accounts.routes.ts` para padrão

#### Implementar página principal [⏳]

**Descrição**: Criar `CreditCardsPage` com:

- Header com título, subtítulo e ações (Novo Cartão, Nova Fatura)
- Grid responsivo de cards (1 col mobile, 2 tablet, 3-4 desktop)
- Estados: loading, error, empty, success
- Integração com `CreditCardState` e `BudgetSelectionService`
- Effect para recarregar quando orçamento muda
- Modais condicionais baseados em route data
- Acessibilidade: ARIA, live regions, keyboard navigation
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Página renderiza corretamente
- Estados funcionando
- Integração com estado reativo
- Grid responsivo funcionando

**Dependências**: Rotas configuradas

**Referências**:

- `src/app/features/accounts/pages/accounts/accounts.page.ts` para padrão

#### Adicionar rota no app.routes.ts [⏳]

**Descrição**: Adicionar rota lazy para `/credit-cards` em `app.routes.ts`

**Critério de Conclusão**: Rota adicionada, navegação funcionando

**Dependências**: Rotas da feature criadas

**Referências**:

- `src/app/app.routes.ts` para padrão

#### Adicionar item no menu/sidebar [⏳]

**Descrição**: Adicionar item "Cartões de Crédito" no menu de navegação
**Arquivos**: `src/app/core/layout/app-layout.component.ts` (ou componente de menu)

**Critério de Conclusão**: Item adicionado, navegação funcionando

**Dependências**: Rota configurada

### 🧪 Critérios de Validação

- [ ] Rotas lazy loading funcionando
- [ ] Página renderiza corretamente
- [ ] Estados (loading, error, empty, success) implementados
- [ ] Grid responsivo funcionando
- [ ] Integração com `CreditCardState` funcionando
- [ ] Filtragem automática por orçamento funcionando
- [ ] Item no menu adicionado
- [ ] Sem erros de lint/type-check

### 📝 Comentários da Fase

_[Observações sobre implementação]_

---

## 📅 FASE 5: Formulários e Modais [Status: ⏳]

### 🎯 Objetivo

Implementar todos os formulários e modais necessários para CRUD de cartões e faturas, pagamento e reabertura.

### 📋 Tarefas

#### Criar componente CreditCardFormComponent [⏳]

**Descrição**: Formulário de cartão (criar/editar) com:

- Campos: nome (required), limite (required, > 0), dia fechamento (required, 1-31), dia vencimento (required, 1-31)
- Validações: required, min/max para dias, positivo para limite
- Usa `os-modal-template` como base
- Usa `os-form-field` para campos
- Integração com `CreditCardState`
- Modo: 'create' ou 'edit'
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Formulário funcionando
- Validações implementadas
- Integração com estado funcionando

**Dependências**: FASE 4 completa

**Referências**:

- `src/app/features/accounts/components/account-form/account-form.component.ts` para padrão

#### Criar componente CreditCardBillFormComponent [⏳]

**Descrição**: Formulário de fatura (criar/editar) com:

- Campos: cartão (select, required), data fechamento (required), data vencimento (required), valor (required, > 0)
- Validações: required, valor positivo
- Usa `os-modal-template` como base
- Integração com `CreditCardState` para lista de cartões
- Modo: 'create' ou 'edit'
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Formulário funcionando
- Validações implementadas
- Select de cartões funcionando

**Dependências**: FASE 4 completa

#### Criar componente PayBillModalComponent [⏳]

**Descrição**: Modal de pagamento de fatura com:

- Campos: conta (select, required), categoria de pagamento (select, required), valor (readonly)
- Integração com `AccountState` para lista de contas
- Integração com `TransactionService` (se necessário para categorias)
- Usa `os-modal-template` como base
- Integração com `CreditCardState.payCreditCardBill()`
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Modal funcionando
- Integração com AccountState funcionando
- Pagamento criando transação automaticamente

**Dependências**: FASE 4 completa

#### Criar componente ReopenBillModalComponent [⏳]

**Descrição**: Modal de reabertura de fatura com:

- Campo: justificativa (textarea, required)
- Usa `os-modal-template` como base
- Integração com `CreditCardState.reopenCreditCardBill()`
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Modal funcionando
- Reabertura funcionando

**Dependências**: FASE 4 completa

#### Criar componente ConfirmDeleteModalComponent [⏳]

**Descrição**: Modal de confirmação de exclusão (reutilizar padrão de Accounts)

- Usa `os-modal-template` como base
- Suporta exclusão de cartão ou fatura
- Integração com `CreditCardState`
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Modal funcionando
- Exclusão funcionando

**Dependências**: FASE 4 completa

**Referências**:

- `src/app/features/accounts/components/confirm-delete-modal/confirm-delete-modal.component.ts` para padrão

#### Integrar modais na página principal [⏳]

**Descrição**: Adicionar lógica na `CreditCardsPage` para:

- Abrir/fechar modais baseado em rotas e ações
- Gerenciar estado dos modais (create, edit, delete, pay, reopen)
- Atualizar lista após mutations

**Critério de Conclusão**:

- Modais integrados na página
- Fluxo completo funcionando

**Dependências**: Todos os componentes de modal criados

### 🧪 Critérios de Validação

- [ ] Todos os formulários funcionando
- [ ] Validações implementadas
- [ ] Modais integrados na página
- [ ] Integração com `CreditCardState` funcionando
- [ ] Pagamento de fatura criando transação automaticamente
- [ ] Reabertura de fatura funcionando
- [ ] Testes unitários básicos criados
- [ ] Sem erros de lint/type-check

### 📝 Comentários da Fase

_[Observações sobre implementação]_

---

## 📅 FASE 6: Integrações e Finalização [Status: ⏳]

### 🎯 Objetivo

Finalizar integrações com outras features, melhorar UX, adicionar testes e validar funcionalidade completa.

### 📋 Tarefas

#### Integrar com Transactions (campo "Forma de Pagamento") [⏳]

**Descrição**: Adicionar campo "Forma de Pagamento" em formulário de transações com opção de selecionar cartão de crédito
**Arquivos**: `src/app/features/transactions/` (componente de formulário)

**Critério de Conclusão**:

- Campo adicionado
- Select de cartões funcionando
- Integração com `CreditCardState` funcionando

**Dependências**: FASE 2 completa

#### Melhorar componente credit-card-card com faturas [⏳]

**Descrição**: Adicionar funcionalidade de expansão no card para mostrar faturas associadas:

- Lista de faturas dentro do card (expandível)
- Item de fatura (`credit-card-bill-item`) mostrando: valor, vencimento, status
- Ações: pagar (se aberta), reabrir (se paga)
- Integração com modais de pagamento/reabertura

**Critério de Conclusão**:

- Expansão funcionando
- Lista de faturas exibida
- Ações funcionando

**Dependências**: FASE 3 e FASE 5 completas

#### Criar componente credit-card-bill-item [⏳]

**Descrição**: Item de fatura dentro do card expandido:

- Exibe: valor, vencimento, status (badge)
- Ações: pagar, reabrir (condicionais)
- Acessibilidade: ARIA labels, keyboard navigation
- ChangeDetection: OnPush

**Critério de Conclusão**:

- Componente criado
- Integrado no card
- Ações funcionando

**Dependências**: FASE 3 completa

#### Adicionar testes de integração [⏳]

**Descrição**: Testes para:

- Fluxo completo: criar cartão → criar fatura → pagar fatura → reabrir fatura
- Integração com `BudgetSelectionService`
- Integração com `AccountState`
- Integração com `TransactionService`

**Critério de Conclusão**: Testes de integração criados, passando

**Dependências**: Todas as fases anteriores completas

#### Validar responsividade e acessibilidade [⏳]

**Descrição**:

- Testar em diferentes tamanhos de tela (mobile, tablet, desktop)
- Validar acessibilidade WCAG 2.1 AA (keyboard, screen reader, contraste)
- Corrigir problemas encontrados

**Critério de Conclusão**:

- Responsividade validada
- Acessibilidade validada
- Problemas corrigidos

**Dependências**: Todas as fases anteriores completas

#### Revisar e otimizar código [⏳]

**Descrição**:

- Revisar código para seguir padrões do projeto
- Otimizar performance (OnPush, computed signals)
- Melhorar tratamento de erros
- Adicionar comentários quando necessário

**Critério de Conclusão**:

- Código revisado
- Performance otimizada
- Sem erros de lint/type-check

**Dependências**: Todas as fases anteriores completas

### 🧪 Critérios de Validação

- [ ] Integração com Transactions funcionando
- [ ] Card com expansão de faturas funcionando
- [ ] Componente bill-item criado e integrado
- [ ] Testes de integração passando
- [ ] Responsividade validada em todos os breakpoints
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Código revisado e otimizado
- [ ] Cobertura de testes > 80%
- [ ] Sem erros de lint/type-check

### 📝 Comentários da Fase

_[Observações sobre finalização]_

---

## 🏁 Entrega Final

### Checklist de Validação

- [ ] CRUD completo de cartões de crédito funcionando
- [ ] CRUD completo de faturas de cartão funcionando
- [ ] Pagamento de fatura cria transação automaticamente
- [ ] Reabertura de fatura paga funcionando
- [ ] Queries GET adicionadas aos handlers do MSW
- [ ] Integração com menu/sidebar (item "Cartões de Crédito")
- [ ] Integração com Transactions (campo "Forma de Pagamento")
- [ ] Validações básicas de formulários (campos required)
- [ ] Estado reativo com signals (similar a Accounts)
- [ ] Testes unitários com cobertura > 80%
- [ ] Testes de integração passando
- [ ] Sem erros de lint/type-check
- [ ] Responsividade em diferentes tamanhos de tela
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Documentação atualizada (se necessário)

### Próximos Passos Após Conclusão

1. **Revisão de Código** (`/pre-pr`) - Validações de qualidade
2. **Pull Request** (`/pr`) - Submissão final
3. **Testes de Aceitação** - Validação com usuários/stakeholders

---

## 📚 Referências

- **Issue/Card**: [OS-230](https://orca-sonhos.atlassian.net/browse/OS-230)
- **Padrão de Referência**: Feature Accounts (`src/app/features/accounts/`)
- **MSW Handlers**: `src/app/core/mocks/handlers/credit-cards.handlers.ts`
- **Account Card**: `src/app/shared/ui-components/molecules/account-card/`
- **Accounts Page**: `src/app/features/accounts/pages/accounts/accounts.page.ts`
- **Layout Specification**: `sessions/OS-230/layout-specification.md`
- **Architecture**: `sessions/OS-230/architecture.md`
- **Context**: `sessions/OS-230/context.md`
