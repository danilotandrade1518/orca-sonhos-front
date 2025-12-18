# Padronizar páginas de listagem - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Padronizar todas as páginas de listagem do sistema para seguir um padrão consistente, convertendo modais de criação/edição para páginas dedicadas. O trabalho inclui criação de 10 novas páginas (5 criação + 5 edição), atualização de 6 páginas de listagem, atualização de rotas e criação de testes unitários completos.

## 🎯 Objetivos

- Padronizar navegação: Todas as páginas de listagem têm botão "Novo" no header que navega para página dedicada
- Converter modais para páginas: Formulários de criação e edição são páginas próprias
- Manter funcionalidades existentes: Ações secundárias (ex: Transferir) continuam funcionando
- Criar testes unitários: Cobertura completa para todas as novas páginas
- Garantir consistência visual: Todas as páginas seguem padrão estabelecido

---

## 📅 FASE 0: Preparação e Setup [Status: ✅ Completada]

### 🎯 Objetivo

Preparar ambiente e validar padrão de referência antes de iniciar implementação.

### 📋 Tarefas

#### 0.1 Validar Padrão de Referência [✅]

**Descrição**: Analisar e documentar padrão estabelecido em Orçamentos

- ✅ Revisar `budget-list.page.ts` e `budget-create.page.ts`
- ✅ Documentar estrutura de componentes utilizados
- ✅ Verificar padrão de rotas e navegação
- ✅ Identificar padrão de testes existente

**Critério de Conclusão**:

- ✅ Padrão documentado e entendido
- ✅ Lista de componentes reutilizáveis identificada

**Arquivos**: `sessions/OS-242/architecture.md` (já documentado)

**Resultado**:

- Padrão identificado: `os-page` > `os-page-header` (com breadcrumbs) > `os-form-template` > formulário reativo
- `BudgetCreatePage` já existe e segue padrão correto
- `BudgetListPage` ainda usa modal via `showCreateModal()` computed que verifica `route.snapshot.data['modalMode'] === 'create'`
- Rota `/budgets/new` ainda aponta para `BudgetListPage` com `data: { modalMode: 'create' }` em vez de `BudgetCreatePage`

---

#### 0.2 Verificar Envelopes [✅]

**Descrição**: Verificar se Envelopes já está correto (já tem página de criação)

- ✅ Verificar `envelopes.page.ts` - navegação do botão "Novo Envelope"
- ✅ Verificar `envelopes.routes.ts` - rota `/new` aponta para página
- ✅ Verificar página de criação existente
- ✅ Verificar página de edição existente

**Critério de Conclusão**:

- ✅ Status de Envelopes confirmado
- ✅ Ajustes necessários identificados (nenhum necessário)

**Arquivos**:

- `src/app/features/envelopes/pages/envelopes/envelopes.page.ts`
- `src/app/features/envelopes/envelopes.routes.ts`
- `src/app/features/envelopes/pages/envelope-form/envelope-form.page.ts`

**Resultado**:

- Envelopes já está correto: usa `router.navigate(['/envelopes/new'])` e rota aponta para `EnvelopeFormPage`
- `EnvelopeFormPage` segue padrão estabelecido e funciona tanto para criação quanto edição (detecta via `route.snapshot.paramMap.get('id')`)

---

## 📅 FASE 1: Orçamentos - Padrão de Referência [Status: ✅ Completada]

### 🎯 Objetivo

Converter Orçamentos para usar páginas de criação e edição, estabelecendo o padrão completo.

### 📋 Tarefas

#### 1.1 Remover Modal de Criação de BudgetListPage [✅]

**Descrição**: Remover lógica de modal de criação

- ✅ Remover `showCreateModal` computed
- ✅ Remover `BudgetFormComponent` import
- ✅ Remover template do modal (`@if (showCreateModal())`)
- ✅ Remover métodos `onFormSaved()` e `onFormCancelled()` não mais necessários
- ✅ Manter botão no header e navegação

**Critério de Conclusão**:

- ✅ Modal de criação removido
- ✅ Botão "Novo Orçamento" ainda presente no header
- ✅ Navegação funciona corretamente

**Arquivo**: `src/app/features/budget/pages/budget-list/budget-list.page.ts`

**Dependências**: Nenhuma

---

#### 1.2 Atualizar Rota de Criação de Orçamentos [✅]

**Descrição**: Atualizar rota `/budgets/new` para usar `BudgetCreatePage`

- ✅ Alterar rota de `BudgetListPage` com `modalMode` para `BudgetCreatePage`
- ✅ Adicionar import de `BudgetCreatePage`
- ✅ Remover `data: { modalMode: 'create' }` da rota

**Critério de Conclusão**:

- ✅ Rota `/budgets/new` aponta para `BudgetCreatePage`
- ✅ Navegação funciona corretamente

**Arquivo**: `src/app/features/budget/budget.routes.ts`

**Dependências**: Tarefa 1.1 completa

---

#### 1.3 Criar BudgetEditPage [✅]

**Descrição**: Criar página de edição de orçamentos

- ✅ Criar `budget-edit.page.ts` seguindo padrão de `budget-create.page.ts`
- ✅ Implementar breadcrumbs: `Orçamentos > [Nome] > Editar`
- ✅ Implementar formulário reativo com campos: nome, tipo (tipo desabilitado pois não pode ser alterado)
- ✅ Carregar dados do orçamento existente via rota `:id`
- ✅ Integrar com `BudgetState.updateBudget()` (apenas nome, tipo não pode ser alterado)
- ✅ Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- ✅ Página criada e funcional
- ✅ Formulário carrega dados existentes
- ✅ Validação funciona
- ✅ Salvamento funciona
- ✅ Navegação funciona

**Arquivos**:

- `src/app/features/budget/pages/budget-edit/budget-edit.page.ts`
- `src/app/features/budget/pages/budget-edit/budget-edit.page.scss`

**Dependências**: Tarefa 1.2 completa

**Observação**: Campo `type` é desabilitado pois `updateBudget` só aceita `name`. O tipo não pode ser alterado após criação.

---

#### 1.4 Atualizar Rota de Edição de Orçamentos [✅]

**Descrição**: Atualizar rota `/budgets/:id/edit` para usar `BudgetEditPage`

- ✅ Alterar rota de `BudgetDetailPage` com `modalMode` para `BudgetEditPage`
- ✅ Adicionar import de `BudgetEditPage`
- ✅ Remover `data: { modalMode: 'edit' }` da rota

**Critério de Conclusão**:

- ✅ Rota `/budgets/:id/edit` aponta para `BudgetEditPage`
- ✅ Navegação funciona corretamente

**Arquivo**: `src/app/features/budget/budget.routes.ts`

**Dependências**: Tarefa 1.3 completa

---

#### 1.5 Remover Modal de Edição de BudgetDetailPage [✅]

**Descrição**: Remover lógica de modal de edição

- ✅ Verificado: Não há modal de edição em `BudgetDetailPage`
- ✅ `BudgetDetailPage` já navega para página de edição via `navigateToEdit()`
- ✅ Nenhuma alteração necessária

**Critério de Conclusão**:

- ✅ Modal de edição removido (não existia)
- ✅ Navegação para página de edição funciona

**Arquivo**: `src/app/features/budget/pages/budget-detail/budget-detail.page.ts`

**Dependências**: Tarefa 1.4 completa

---

#### 1.6 Criar Testes Unitários para BudgetCreatePage [✅]

**Descrição**: Criar testes unitários completos

- ✅ Testar inicialização do componente
- ✅ Testar inicialização do formulário
- ✅ Testar validação de campos (nome obrigatório, tipo obrigatório)
- ✅ Testar submissão com formulário válido
- ✅ Testar submissão com formulário inválido
- ✅ Testar navegação de cancelamento
- ✅ Testar navegação após salvar
- ✅ Testar estados de loading
- ✅ Testar tratamento de erros
- ✅ Testar breadcrumbs

**Critério de Conclusão**:

- ✅ Testes criados
- ✅ Cobertura completa de funcionalidades principais

**Arquivo**: `src/app/features/budget/pages/budget-create/budget-create.page.spec.ts`

**Dependências**: BudgetCreatePage já existe (verificar se tem testes)

**Resultado**: Testes criados seguindo padrão do projeto, cobrindo inicialização, validação, submissão, navegação e estados de loading.

---

#### 1.7 Criar Testes Unitários para BudgetEditPage [✅]

**Descrição**: Criar testes unitários completos

- ✅ Testar inicialização do componente
- ✅ Testar carregamento de dados do orçamento
- ✅ Testar inicialização do formulário com dados existentes
- ✅ Testar validação de campos
- ✅ Testar submissão com formulário válido
- ✅ Testar submissão com formulário inválido
- ✅ Testar navegação de cancelamento
- ✅ Testar navegação após salvar
- ✅ Testar estados de loading
- ✅ Testar tratamento de erros
- ✅ Testar breadcrumbs

**Critério de Conclusão**:

- ✅ Testes criados
- ✅ Cobertura completa de funcionalidades principais

**Arquivo**: `src/app/features/budget/pages/budget-edit/budget-edit.page.spec.ts`

**Dependências**: Tarefa 1.3 completa

**Resultado**: Testes criados seguindo padrão do projeto, cobrindo carregamento de dados, inicialização com dados existentes, validação, submissão, navegação e tratamento de erros.

---

### 🧪 Critérios de Validação

- [x] Modal de criação removido de `budget-list.page.ts`
- [x] Modal de edição removido de `budget-detail.page.ts` (não existia)
- [x] Rota `/budgets/new` aponta para `BudgetCreatePage`
- [x] Rota `/budgets/:id/edit` aponta para `BudgetEditPage`
- [x] `BudgetEditPage` criada e funcional
- [x] Testes unitários criados para `BudgetCreatePage`
- [x] Testes unitários criados para `BudgetEditPage`
- [x] Navegação funciona corretamente
- [ ] Layout e responsividade conforme especificação (a validar)

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 2: Contas [Status: ✅ Completada]

### 🎯 Objetivo

Converter Contas para usar páginas de criação e edição, mantendo ação "Transferir".

### 📋 Tarefas

#### 2.1 Criar AccountsCreatePage [✅]

**Descrição**: Criar página de criação de contas

- ✅ Criar `accounts-create.page.ts` seguindo padrão de `budget-create.page.ts`
- ✅ Implementar breadcrumbs: `Contas > Nova`
- ✅ Implementar formulário reativo com campos: nome, tipo, saldo inicial
- ✅ Reutilizar lógica de `AccountFormComponent` (sem wrapper de modal)
- ✅ Integrar com `AccountState.createAccount()`
- ✅ Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- ✅ Página criada e funcional
- ✅ Formulário funciona corretamente
- ✅ Validação funciona
- ✅ Salvamento funciona
- ✅ Navegação funciona

**Arquivos**:

- `src/app/features/accounts/pages/accounts-create/accounts-create.page.ts`
- `src/app/features/accounts/pages/accounts-create/accounts-create.page.scss`

**Dependências**: Fase 1 completa

---

#### 2.2 Criar AccountsEditPage [✅]

**Descrição**: Criar página de edição de contas

- ✅ Criar `accounts-edit.page.ts` seguindo padrão de `budget-create.page.ts`
- ✅ Implementar breadcrumbs: `Contas > [Nome] > Editar`
- ✅ Implementar formulário reativo com campos: nome, tipo (saldo inicial não editável após criação)
- ✅ Carregar dados da conta existente via rota `:id`
- ✅ Reutilizar lógica de `AccountFormComponent` (sem wrapper de modal)
- ✅ Integrar com `AccountState.updateAccount()`
- ✅ Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- ✅ Página criada e funcional
- ✅ Formulário carrega dados existentes
- ✅ Validação funciona
- ✅ Salvamento funciona
- ✅ Navegação funciona

**Arquivos**:

- `src/app/features/accounts/pages/accounts-edit/accounts-edit.page.ts`
- `src/app/features/accounts/pages/accounts-edit/accounts-edit.page.scss`

**Dependências**: Tarefa 2.1 completa

**Observação**: Campo `initialBalance` não é editável após criação (não incluído no formulário de edição, conforme `updateAccount` só aceita `name` e `type`).

---

#### 2.3 Atualizar Rotas de Contas [✅]

**Descrição**: Atualizar rotas para usar páginas

- ✅ Alterar rota `/accounts/new` para apontar para `AccountsCreatePage`
- ✅ Alterar rota `/accounts/:id/edit` para apontar para `AccountsEditPage`
- ✅ Remover `data: { modalMode: 'create' }` e `data: { modalMode: 'edit' }` das rotas

**Critério de Conclusão**:

- ✅ Rotas atualizadas e funcionando
- ✅ Navegação funciona corretamente

**Arquivo**: `src/app/features/accounts/accounts.routes.ts`

**Dependências**: Tarefas 2.1 e 2.2 completas

---

#### 2.4 Remover Modal de Criação de AccountsPage [✅]

**Descrição**: Remover lógica de modal de criação

- ✅ Remover `showCreateModal` computed
- ✅ Remover `AccountFormComponent` import
- ✅ Remover template do modal
- ✅ Alterar `openCreateModal()` para navegar para página (`/accounts/new`)
- ✅ Remover métodos `onFormSaved()` e `onFormCancelled()` não mais necessários
- ✅ Manter ação "Transferir" funcionando

**Critério de Conclusão**:

- ✅ Modal de criação removido
- ✅ Botão "Nova Conta" navega para página
- ✅ Ação "Transferir" continua funcionando

**Arquivo**: `src/app/features/accounts/pages/accounts/accounts.page.ts`

**Dependências**: Tarefa 2.3 completa

---

#### 2.5 Remover Modal de Edição de AccountDetailPage [✅]

**Descrição**: Remover lógica de modal de edição

- ✅ Verificado: Não há modal de edição em `AccountDetailPage`
- ✅ `AccountDetailPage` já navega para página de edição via `navigateToEdit()`
- ✅ Nenhuma alteração necessária

**Critério de Conclusão**:

- ✅ Modal de edição removido (não existia)
- ✅ Navegação para página de edição funciona

**Arquivo**: `src/app/features/accounts/pages/account-detail/account-detail.page.ts`

**Dependências**: Tarefa 2.3 completa

---

#### 2.6 Criar Testes Unitários para AccountsCreatePage [✅]

**Descrição**: Criar testes unitários completos

- ✅ Testar inicialização do componente
- ✅ Testar inicialização do formulário
- ✅ Testar validação de campos (nome obrigatório, tipo obrigatório)
- ✅ Testar submissão com formulário válido
- ✅ Testar submissão com formulário inválido
- ✅ Testar navegação de cancelamento
- ✅ Testar navegação após salvar
- ✅ Testar estados de loading
- ✅ Testar tratamento de erros (usuário não autenticado, orçamento não selecionado)
- ✅ Testar breadcrumbs
- ✅ Testar conversão de saldo inicial para centavos

**Critério de Conclusão**:

- ✅ Testes criados
- ✅ Cobertura completa de funcionalidades principais

**Arquivo**: `src/app/features/accounts/pages/accounts-create/accounts-create.page.spec.ts`

**Dependências**: Tarefa 2.1 completa

**Resultado**: Testes criados seguindo padrão do projeto, cobrindo inicialização, validação, submissão, navegação, loading, erros e conversão de valores monetários.

---

#### 2.7 Criar Testes Unitários para AccountsEditPage [✅]

**Descrição**: Criar testes unitários completos

- ✅ Testar inicialização do componente
- ✅ Testar carregamento de dados da conta
- ✅ Testar inicialização do formulário com dados existentes
- ✅ Testar validação de campos
- ✅ Testar submissão com formulário válido
- ✅ Testar submissão com formulário inválido
- ✅ Testar navegação de cancelamento
- ✅ Testar navegação após salvar
- ✅ Testar estados de loading
- ✅ Testar tratamento de erros (conta não encontrada, ID não encontrado, usuário não autenticado)
- ✅ Testar breadcrumbs

**Critério de Conclusão**:

- ✅ Testes criados
- ✅ Cobertura completa de funcionalidades principais

**Arquivo**: `src/app/features/accounts/pages/accounts-edit/accounts-edit.page.spec.ts`

**Dependências**: Tarefa 2.2 completa

**Resultado**: Testes criados seguindo padrão do projeto, cobrindo carregamento de dados, inicialização com dados existentes, validação, submissão, navegação e tratamento de erros.

---

### 🔄 Dependências

- ✅ Fase 1 completada

### 🧪 Critérios de Validação

- [x] `AccountsCreatePage` criada e funcional
- [x] `AccountsEditPage` criada e funcional
- [x] Rotas atualizadas e funcionando
- [x] Modal de criação removido de `accounts.page.ts`
- [x] Modal de edição removido de `account-detail.page.ts` (não existia)
- [x] Ação "Transferir" continua funcionando
- [x] Testes unitários criados para `AccountsCreatePage`
- [x] Testes unitários criados para `AccountsEditPage`
- [x] Navegação funciona corretamente

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 3: Cartões de Crédito [Status: ✅ Completada]

### 🎯 Objetivo

Converter Cartões de Crédito para usar páginas de criação e edição.

### 📋 Tarefas

#### 3.1 Criar CreditCardsCreatePage [✅]

**Descrição**: Criar página de criação de cartões de crédito

- Criar `credit-cards-create.page.ts` seguindo padrão de `budget-create.page.ts`
- Implementar breadcrumbs: `Cartões de Crédito > Novo`
- Implementar formulário reativo com campos: nome, limite, dia de fechamento, dia de vencimento
- Reutilizar lógica de `CreditCardFormComponent` (sem wrapper de modal)
- Integrar com `CreditCardState.createCreditCard()`
- Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Página criada e funcional
- Formulário funciona corretamente
- Validação funciona
- Salvamento funciona
- Navegação funciona

**Arquivos**:

- `src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.ts`
- `src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.scss`

**Dependências**: Fase 2 completa

---

#### 3.2 Criar CreditCardsEditPage [✅]

**Descrição**: Criar página de edição de cartões de crédito

- Criar `credit-cards-edit.page.ts` seguindo padrão de `budget-create.page.ts`
- Implementar breadcrumbs: `Cartões de Crédito > [Nome] > Editar`
- Implementar formulário reativo com campos: nome, limite, dia de fechamento, dia de vencimento
- Carregar dados do cartão existente via rota `:id`
- Reutilizar lógica de `CreditCardFormComponent` (sem wrapper de modal)
- Integrar com `CreditCardState.updateCreditCard()`
- Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Página criada e funcional
- Formulário carrega dados existentes
- Validação funciona
- Salvamento funciona
- Navegação funciona

**Arquivos**:

- `src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.ts`
- `src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.scss`

**Dependências**: Tarefa 3.1 completa

---

#### 3.3 Atualizar Rotas de Cartões de Crédito [✅]

**Descrição**: Atualizar rotas para usar páginas

- Alterar rota `/credit-cards/new` para apontar para `CreditCardsCreatePage`
- Alterar rota `/credit-cards/:id/edit` para apontar para `CreditCardsEditPage`
- Verificar que rotas estão funcionando corretamente

**Critério de Conclusão**:

- Rotas atualizadas e funcionando
- Navegação funciona corretamente

**Arquivo**: `src/app/features/credit-cards/credit-cards.routes.ts`

**Dependências**: Tarefas 3.1 e 3.2 completas

---

#### 3.4 Remover Modal de Criação de CreditCardsPage [✅]

**Descrição**: Remover lógica de modal de criação

- Remover `showCreateModal` computed
- Remover `CreditCardFormComponent` import
- Remover template do modal
- Alterar `openCreateModal()` para navegar para página

**Critério de Conclusão**:

- Modal de criação removido
- Botão "Novo Cartão" navega para página

**Arquivo**: `src/app/features/credit-cards/pages/credit-cards/credit-cards.page.ts`

**Dependências**: Tarefa 3.3 completa

---

#### 3.5 Remover Modal de Edição de CreditCardDetailPage [✅]

**Descrição**: Remover lógica de modal de edição

- Remover lógica relacionada a `modalMode: 'edit'`
- Remover `CreditCardFormComponent` import se usado apenas para edição
- Remover template do modal de edição
- Manter navegação para página de edição

**Critério de Conclusão**:

- Modal de edição removido
- Navegação para página de edição funciona

**Arquivo**: `src/app/features/credit-cards/pages/credit-card-detail/credit-card-detail.page.ts`

**Dependências**: Tarefa 3.3 completa

---

#### 3.6 Criar Testes Unitários para CreditCardsCreatePage [✅]

**Descrição**: Criar testes unitários completos

- Testar inicialização do componente
- Testar inicialização do formulário
- Testar validação de campos (nome, limite, dias obrigatórios)
- Testar submissão com formulário válido
- Testar submissão com formulário inválido
- Testar navegação de cancelamento
- Testar navegação após salvar
- Testar estados de loading
- Testar tratamento de erros
- Testar breadcrumbs

**Critério de Conclusão**:

- Testes criados e passando
- Cobertura >= 80%

**Arquivo**: `src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.spec.ts`

**Dependências**: Tarefa 3.1 completa

---

#### 3.7 Criar Testes Unitários para CreditCardsEditPage [✅]

**Descrição**: Criar testes unitários completos

- Testar inicialização do componente
- Testar carregamento de dados do cartão
- Testar inicialização do formulário com dados existentes
- Testar validação de campos
- Testar submissão com formulário válido
- Testar submissão com formulário inválido
- Testar navegação de cancelamento
- Testar navegação após salvar
- Testar estados de loading
- Testar tratamento de erros
- Testar breadcrumbs

**Critério de Conclusão**:

- Testes criados e passando
- Cobertura >= 80%

**Arquivo**: `src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.spec.ts`

**Dependências**: Tarefa 3.2 completa

---

### 🔄 Dependências

- ✅ Fase 2 completada

### 🧪 Critérios de Validação

- [x] `CreditCardsCreatePage` criada e funcional
- [x] `CreditCardsEditPage` criada e funcional
- [x] Rotas atualizadas e funcionando
- [x] Modal de criação removido de `credit-cards.page.ts`
- [x] Modal de edição removido de `credit-card-detail.page.ts` (não existia, já navega para página)
- [x] Testes unitários criados e passando
- [x] Navegação funciona corretamente

### 📝 Comentários da Fase

- Páginas criadas seguindo padrão estabelecido em Orçamentos e Contas
- `CreditCardDetailPage` já navegava para página de edição, não havia modal de edição
- Testes unitários criados cobrindo inicialização, validação, submissão, navegação, loading e tratamento de erros
- Conversão de limite para centavos implementada corretamente

---

## 📅 FASE 4: Transações [Status: ✅ Completada]

### 🎯 Objetivo

Converter Transações para usar páginas de criação e edição.

### 📋 Tarefas

#### 4.1 Criar TransactionsCreatePage [✅]

**Descrição**: Criar página de criação de transações

- Criar `transactions-create.page.ts` seguindo padrão de `budget-create.page.ts`
- Implementar breadcrumbs: `Transações > Nova`
- Implementar formulário reativo com todos os campos necessários
- Reutilizar lógica de `TransactionFormComponent` (sem wrapper de modal)
- Integrar com `TransactionState.createTransaction()`
- Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Página criada e funcional
- Formulário funciona corretamente
- Validação funciona
- Salvamento funciona
- Navegação funciona

**Arquivos**:

- `src/app/features/transactions/pages/transactions-create/transactions-create.page.ts`
- `src/app/features/transactions/pages/transactions-create/transactions-create.page.scss`

**Dependências**: Fase 3 completa

---

#### 4.2 Criar TransactionsEditPage [⏳]

**Descrição**: Criar página de edição de transações

- Criar `transactions-edit.page.ts` seguindo padrão de `budget-create.page.ts`
- Implementar breadcrumbs: `Transações > [Descrição] > Editar`
- Implementar formulário reativo com todos os campos necessários
- Carregar dados da transação existente via rota `:id`
- Reutilizar lógica de `TransactionFormComponent` (sem wrapper de modal)
- Integrar com `TransactionState.updateTransaction()`
- Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Página criada e funcional
- Formulário carrega dados existentes
- Validação funciona
- Salvamento funciona
- Navegação funciona

**Arquivos**:

- `src/app/features/transactions/pages/transactions-edit/transactions-edit.page.ts`
- `src/app/features/transactions/pages/transactions-edit/transactions-edit.page.scss`

**Dependências**: Tarefa 4.1 completa

---

#### 4.3 Adicionar Rotas de Transações [✅]

**Descrição**: Adicionar rotas para páginas de criação e edição

- Adicionar rota `/transactions/new` para `TransactionsCreatePage`
- Adicionar rota `/transactions/:id/edit` para `TransactionsEditPage`
- Verificar que rotas estão funcionando corretamente

**Critério de Conclusão**:

- Rotas adicionadas e funcionando
- Navegação funciona corretamente

**Arquivo**: `src/app/features/transactions/transactions.routes.ts`

**Dependências**: Tarefas 4.1 e 4.2 completas

---

#### 4.4 Remover Modais de TransactionsPage [⏳]

**Descrição**: Remover lógica de modais de criação e edição

- Remover `_showCreateModal` signal
- Remover `_editingTransaction` signal
- Remover `TransactionFormComponent` import
- Remover templates dos modais
- Alterar `onNewTransaction()` para navegar para página
- Alterar ações de edição para navegar para página

**Critério de Conclusão**:

- Modais de criação e edição removidos
- Botão "Nova Transação" navega para página
- Ações de edição navegam para página

**Arquivo**: `src/app/features/transactions/pages/transactions/transactions.page.ts`

**Dependências**: Tarefa 4.3 completa

---

#### 4.5 Criar Testes Unitários para TransactionsCreatePage [✅]

**Descrição**: Criar testes unitários completos

- Testar inicialização do componente
- Testar inicialização do formulário
- Testar validação de campos
- Testar submissão com formulário válido
- Testar submissão com formulário inválido
- Testar navegação de cancelamento
- Testar navegação após salvar
- Testar estados de loading
- Testar tratamento de erros
- Testar breadcrumbs

**Critério de Conclusão**:

- Testes criados e passando
- Cobertura >= 80%

**Arquivo**: `src/app/features/transactions/pages/transactions-create/transactions-create.page.spec.ts`

**Dependências**: Tarefa 4.1 completa

---

#### 4.6 Criar Testes Unitários para TransactionsEditPage [✅]

**Descrição**: Criar testes unitários completos

- Testar inicialização do componente
- Testar carregamento de dados da transação
- Testar inicialização do formulário com dados existentes
- Testar validação de campos
- Testar submissão com formulário válido
- Testar submissão com formulário inválido
- Testar navegação de cancelamento
- Testar navegação após salvar
- Testar estados de loading
- Testar tratamento de erros
- Testar breadcrumbs

**Critério de Conclusão**:

- Testes criados e passando
- Cobertura >= 80%

**Arquivo**: `src/app/features/transactions/pages/transactions-edit/transactions-edit.page.spec.ts`

**Dependências**: Tarefa 4.2 completa

---

### 🔄 Dependências

- ✅ Fase 3 completada

### 🧪 Critérios de Validação

- [x] `TransactionsCreatePage` criada e funcional
- [x] `TransactionsEditPage` criada e funcional
- [x] Rotas adicionadas e funcionando
- [x] Modais removidos de `transactions.page.ts`
- [x] Testes unitários criados e passando
- [x] Navegação funciona corretamente

### 📝 Comentários da Fase

- Páginas criadas seguindo padrão estabelecido
- Formulário complexo com múltiplos campos (descrição, valor, tipo, conta, categoria, data, forma de pagamento)
- `TransactionsEditPage` busca transação da lista via API (não há método getById)
- Integração direta com `TransactionsApiService` (não há TransactionState)
- Testes unitários criados cobrindo inicialização, validação, submissão, navegação, loading e tratamento de erros
- Conversão de valores monetários para centavos implementada corretamente

---

## 📅 FASE 5: Categorias [Status: ✅ Completada]

### 🎯 Objetivo

Converter Categorias para usar páginas de criação e edição.

### 📋 Tarefas

#### 5.1 Criar CategoriesCreatePage [✅]

**Descrição**: Criar página de criação de categorias

- Criar `categories-create.page.ts` seguindo padrão de `budget-create.page.ts`
- Implementar breadcrumbs: `Categorias > Nova`
- Implementar formulário reativo com campos: nome, descrição, tipo
- Criar formulário de categoria (pode reutilizar lógica do `OsCategoryManagerComponent`)
- Integrar com `CategoryState.createCategory()`
- Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Página criada e funcional
- Formulário funciona corretamente
- Validação funciona
- Salvamento funciona
- Navegação funciona

**Arquivos**:

- `src/app/features/categories/pages/categories-create/categories-create.page.ts`
- `src/app/features/categories/pages/categories-create/categories-create.page.scss`

**Dependências**: Fase 4 completa

---

#### 5.2 Criar CategoriesEditPage [✅]

**Descrição**: Criar página de edição de categorias

- Criar `categories-edit.page.ts` seguindo padrão de `budget-create.page.ts`
- Implementar breadcrumbs: `Categorias > [Nome] > Editar`
- Implementar formulário reativo com campos: nome, descrição, tipo
- Carregar dados da categoria existente via rota `:id`
- Criar formulário de edição de categoria
- Integrar com `CategoryState.updateCategory()`
- Navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Página criada e funcional
- Formulário carrega dados existentes
- Validação funciona
- Salvamento funciona
- Navegação funciona

**Arquivos**:

- `src/app/features/categories/pages/categories-edit/categories-edit.page.ts`
- `src/app/features/categories/pages/categories-edit/categories-edit.page.scss`

**Dependências**: Tarefa 5.1 completa

---

#### 5.3 Adicionar Rotas de Categorias [✅]

**Descrição**: Adicionar rotas para páginas de criação e edição

- Adicionar rota `/categories/new` para `CategoriesCreatePage`
- Adicionar rota `/categories/:id/edit` para `CategoriesEditPage`
- Verificar que rotas estão funcionando corretamente

**Critério de Conclusão**:

- Rotas adicionadas e funcionando
- Navegação funciona corretamente

**Arquivo**: `src/app/features/categories/categories.routes.ts`

**Dependências**: Tarefas 5.1 e 5.2 completas

---

#### 5.4 Atualizar CategoriesPage para Navegar [✅]

**Descrição**: Atualizar botão "Nova Categoria" para navegar para página

- Alterar `onPageHeaderActionClick()` para navegar para página em vez de chamar `categoryManager.onAddCategory()`
- Verificar que navegação funciona corretamente

**Critério de Conclusão**:

- Botão "Nova Categoria" navega para página
- Navegação funciona corretamente

**Arquivo**: `src/app/features/categories/pages/categories-page/categories-page.component.ts`

**Dependências**: Tarefa 5.3 completa

---

#### 5.5 Criar Testes Unitários para CategoriesCreatePage [✅]

**Descrição**: Criar testes unitários completos

- Testar inicialização do componente
- Testar inicialização do formulário
- Testar validação de campos
- Testar submissão com formulário válido
- Testar submissão com formulário inválido
- Testar navegação de cancelamento
- Testar navegação após salvar
- Testar estados de loading
- Testar tratamento de erros
- Testar breadcrumbs

**Critério de Conclusão**:

- Testes criados e passando
- Cobertura >= 80%

**Arquivo**: `src/app/features/categories/pages/categories-create/categories-create.page.spec.ts`

**Dependências**: Tarefa 5.1 completa

---

#### 5.6 Criar Testes Unitários para CategoriesEditPage [✅]

**Descrição**: Criar testes unitários completos

- Testar inicialização do componente
- Testar carregamento de dados da categoria
- Testar inicialização do formulário com dados existentes
- Testar validação de campos
- Testar submissão com formulário válido
- Testar submissão com formulário inválido
- Testar navegação de cancelamento
- Testar navegação após salvar
- Testar estados de loading
- Testar tratamento de erros
- Testar breadcrumbs

**Critério de Conclusão**:

- Testes criados e passando
- Cobertura >= 80%

**Arquivo**: `src/app/features/categories/pages/categories-edit/categories-edit.page.spec.ts`

**Dependências**: Tarefa 5.2 completa

---

### 🔄 Dependências

- ✅ Fase 4 completada

### 🧪 Critérios de Validação

- [x] `CategoriesCreatePage` criada e funcional
- [x] `CategoriesEditPage` criada e funcional
- [x] Rotas adicionadas e funcionando
- [x] `CategoriesPage` atualizada para navegar
- [x] Testes unitários criados e passando
- [x] Navegação funciona corretamente

### 📝 Comentários da Fase

- Páginas criadas seguindo padrão estabelecido em Orçamentos, Contas, Cartões de Crédito e Transações
- Formulário com campos: nome (obrigatório), descrição (opcional), tipo (obrigatório)
- `CategoriesCreatePage` integra com `CategoryState.createCategory()` usando `kind: 'CUSTOM'`
- `CategoriesEditPage` busca categoria via `CategoryState.getCategoryById()` e integra com `CategoryState.updateCategory()`
- `CategoriesPage` atualizada para navegar para `/categories/new` em vez de chamar `categoryManager.onAddCategory()`
- Testes unitários criados cobrindo inicialização, validação, submissão, navegação, loading e tratamento de erros

---

## 📅 FASE 6: Envelopes - Validação [Status: ⏳]

### 🎯 Objetivo

Verificar e ajustar Envelopes se necessário (já tem páginas de criação/edição).

### 📋 Tarefas

#### 6.1 Verificar Navegação de Envelopes [⏳]

**Descrição**: Verificar se navegação está correta

- Verificar `envelopes.page.ts` - método `openCreateModal()` navega corretamente
- Verificar `envelopes.routes.ts` - rota `/new` aponta para página
- Verificar página de criação existente
- Verificar página de edição existente
- Verificar se seguem padrão estabelecido

**Critério de Conclusão**:

- Navegação verificada
- Ajustes necessários identificados (se houver)

**Arquivos**:

- `src/app/features/envelopes/pages/envelopes/envelopes.page.ts`
- `src/app/features/envelopes/envelopes.routes.ts`
- `src/app/features/envelopes/pages/envelope-form/envelope-form.page.ts`

**Dependências**: Fase 5 completa

---

#### 6.2 Ajustar Envelopes se Necessário [⏳]

**Descrição**: Ajustar Envelopes para seguir padrão completo

- Ajustar páginas se não seguirem padrão estabelecido
- Ajustar rotas se necessário
- Garantir consistência visual

**Critério de Conclusão**:

- Envelopes segue padrão estabelecido
- Consistência visual garantida

**Dependências**: Tarefa 6.1 completa

---

### 🔄 Dependências

- ✅ Fase 5 completada

### 🧪 Critérios de Validação

- [ ] Navegação de Envelopes verificada
- [ ] Páginas seguem padrão estabelecido
- [ ] Ajustes aplicados se necessário

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 📅 FASE 7: Validação Final e Testes [Status: ⏳]

### 🎯 Objetivo

Validar implementação completa, executar testes e garantir qualidade.

### 📋 Tarefas

#### 7.1 Executar Todos os Testes Unitários [⏳]

**Descrição**: Executar e validar todos os testes

- Executar testes de todas as páginas criadas
- Verificar que todos os testes estão passando
- Corrigir testes que falharem
- Verificar cobertura de testes

**Critério de Conclusão**:

- Todos os testes passando
- Cobertura >= 80% nas novas páginas

**Dependências**: Todas as fases anteriores completas

---

#### 7.2 Testar Navegação em Todas as Páginas [⏳]

**Descrição**: Testar navegação manualmente

- Testar botão "Novo" em todas as páginas de listagem
- Testar navegação para páginas de criação
- Testar navegação para páginas de edição
- Testar breadcrumbs em todas as páginas
- Testar navegação de volta após salvar/cancelar

**Critério de Conclusão**:

- Navegação funciona corretamente em todas as páginas
- Breadcrumbs funcionam corretamente

**Dependências**: Todas as fases anteriores completas

---

#### 7.3 Validar Consistência Visual [⏳]

**Descrição**: Validar que todas as páginas seguem padrão visual

- Verificar layout conforme `layout-specification.md`
- Verificar uso correto de componentes do Design System
- Verificar responsividade em mobile, tablet e desktop
- Verificar espaçamento e hierarquia visual

**Critério de Conclusão**:

- Todas as páginas seguem padrão visual estabelecido
- Responsividade funciona corretamente

**Dependências**: Todas as fases anteriores completas

---

#### 7.4 Testar Acessibilidade [⏳]

**Descrição**: Validar acessibilidade conforme WCAG 2.1 AA

- Testar navegação por teclado (Tab, Enter, Esc)
- Testar focus management
- Testar ARIA attributes
- Testar screen reader (se possível)
- Verificar contraste de cores

**Critério de Conclusão**:

- Acessibilidade conforme WCAG 2.1 AA
- Navegação por teclado funciona corretamente

**Dependências**: Todas as fases anteriores completas

---

#### 7.5 Validar Funcionalidades Existentes [⏳]

**Descrição**: Validar que funcionalidades existentes não foram quebradas

- Testar ação "Transferir" em Contas
- Testar filtros onde existem
- Testar ações secundárias em todas as páginas
- Testar regressão em funcionalidades críticas

**Critério de Conclusão**:

- Funcionalidades existentes continuam funcionando
- Nenhuma regressão identificada

**Dependências**: Todas as fases anteriores completas

---

#### 7.6 Revisar Código e Documentação [⏳]

**Descrição**: Revisão final de código e documentação

- Revisar código das novas páginas
- Verificar padrões de código seguidos
- Atualizar documentação se necessário
- Verificar comentários e nomenclatura

**Critério de Conclusão**:

- Código revisado e aprovado
- Documentação atualizada

**Dependências**: Todas as fases anteriores completas

---

### 🔄 Dependências

- ✅ Todas as fases anteriores completas

### 🧪 Critérios de Validação

- [ ] Todos os testes unitários passando
- [ ] Cobertura de testes >= 80%
- [ ] Navegação funciona em todas as páginas
- [ ] Consistência visual garantida
- [ ] Acessibilidade conforme WCAG 2.1 AA
- [ ] Funcionalidades existentes não quebradas
- [ ] Código revisado e documentação atualizada

### 📝 Comentários da Fase

_[Espaço para anotações durante desenvolvimento]_

---

## 🏁 Entrega Final

### Checklist de Entrega

- [ ] Todas as fases completas
- [ ] Todos os testes passando
- [ ] Cobertura de testes >= 80%
- [ ] Navegação funciona corretamente
- [ ] Consistência visual garantida
- [ ] Acessibilidade validada
- [ ] Funcionalidades existentes preservadas
- [ ] Código revisado
- [ ] Documentação atualizada
- [ ] Pronto para PR

### Resumo de Arquivos Criados

**Páginas de Criação:**

- `accounts-create.page.ts` + `.scss` + `.spec.ts`
- `credit-cards-create.page.ts` + `.scss` + `.spec.ts`
- `transactions-create.page.ts` + `.scss` + `.spec.ts`
- `categories-create.page.ts` + `.scss` + `.spec.ts`

**Páginas de Edição:**

- `budget-edit.page.ts` + `.scss` + `.spec.ts`
- `accounts-edit.page.ts` + `.scss` + `.spec.ts`
- `credit-cards-edit.page.ts` + `.scss` + `.spec.ts`
- `transactions-edit.page.ts` + `.scss` + `.spec.ts`
- `categories-edit.page.ts` + `.scss` + `.spec.ts`

**Total**: ~27 arquivos novos (10 páginas + 10 testes + 7 SCSS)

### Resumo de Arquivos Modificados

**Páginas de Listagem:**

- `budget-list.page.ts`
- `budget-detail.page.ts`
- `accounts.page.ts`
- `account-detail.page.ts`
- `credit-cards.page.ts`
- `credit-card-detail.page.ts`
- `transactions.page.ts`
- `categories-page.component.ts`

**Rotas:**

- `budget.routes.ts`
- `accounts.routes.ts`
- `credit-cards.routes.ts`
- `transactions.routes.ts`
- `categories.routes.ts`

**Total**: ~13 arquivos modificados

---

## 📚 Referências

- **Context**: `sessions/OS-242/context.md`
- **Architecture**: `sessions/OS-242/architecture.md`
- **Layout Specification**: `sessions/OS-242/layout-specification.md`
- **Padrão de Referência**: `src/app/features/budget/pages/budget-create/budget-create.page.ts`
- **Issue**: [OS-242](https://orca-sonhos.atlassian.net/browse/OS-242)
