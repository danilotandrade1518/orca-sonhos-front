# Padronizar páginas de listagem - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

Atualmente, as páginas de listagem têm implementações inconsistentes:

1. **Orçamentos**: Tem botão no header e filtros, mas ainda usa modal para criação (rota `/budgets/new` com `data: { modalMode: 'create' }`)
2. **Contas**: Tem botão no header, usa modal para criação, sem filtros
3. **Cartões de Crédito**: Tem botão no header, usa modal para criação, sem filtros
4. **Transações**: Tem botão no header e filtros, mas usa signal para controlar modal (`_showCreateModal`)
5. **Categorias**: Tem botão no header, mas usa componente interno (`categoryManager.onAddCategory()`)
6. **Envelopes**: Tem botão no header, já tem página de criação, mas precisa verificar navegação

### Mudanças Propostas

1. **Converter modais para páginas**: Criar páginas dedicadas de criação e edição seguindo o padrão de `budget-create.page.ts`
2. **Criar componentes sem modal**: Criar versões sem wrapper de modal dos componentes de formulário para uso em páginas
3. **Atualizar rotas**: Modificar rotas para apontar para páginas de criação e edição em vez de modais
4. **Remover lógica de modal**: Remover código relacionado a modais de criação e edição das páginas de listagem
5. **Padronizar navegação**: Garantir que todos os botões "Novo" e ações de edição naveguem corretamente para páginas
6. **Criar testes**: Criar testes unitários completos para todas as novas páginas

### Impactos

- **Páginas de Listagem**: Remoção de lógica de modal, simplificação do código
- **Rotas**: Adição de novas rotas para páginas de criação e edição
- **Componentes de Formulário**: Criação de versões sem wrapper de modal para uso em páginas
- **Páginas de Criação e Edição**: Criação de novas páginas seguindo padrão estabelecido
- **Testes**: Criação de testes unitários para todas as novas páginas
- **UX**: Melhoria na experiência do usuário com URLs compartilháveis e navegação mais clara

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

#### 1. Orçamentos

- **`src/app/features/budget/pages/budget-list/budget-list.page.ts`**

  - Remover: `showCreateModal` computed, `BudgetFormComponent` import, template do modal
  - Manter: Botão no header, filtros, navegação

- **`src/app/features/budget/budget.routes.ts`**

  - Alterar: Rota `/new` para apontar para `BudgetCreatePage` em vez de `BudgetListPage` com `modalMode`
  - Alterar: Rota `/:id/edit` para apontar para `BudgetEditPage` em vez de `BudgetDetailPage` com `modalMode`

- **Novo**: `src/app/features/budget/pages/budget-edit/budget-edit.page.ts`
  - Criar página de edição seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `BudgetFormComponent` (sem wrapper de modal)

#### 2. Contas

- **`src/app/features/accounts/pages/accounts/accounts.page.ts`**

  - Remover: `showCreateModal` computed, `AccountFormComponent` import, template do modal
  - Alterar: `openCreateModal()` para navegar para página
  - Manter: Ação "Transferir"

- **`src/app/features/accounts/accounts.routes.ts`**

  - Alterar: Rota `/new` para apontar para nova página `AccountsCreatePage`

- **Novo**: `src/app/features/accounts/pages/accounts-create/accounts-create.page.ts`

  - Criar página seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `AccountFormComponent` (sem wrapper de modal)

- **Novo**: `src/app/features/accounts/pages/accounts-edit/accounts-edit.page.ts`

  - Criar página de edição seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `AccountFormComponent` (sem wrapper de modal)

- **`src/app/features/accounts/accounts.routes.ts`**
  - Alterar: Rota `/:id/edit` para apontar para nova página `AccountsEditPage`

#### 3. Cartões de Crédito

- **`src/app/features/credit-cards/pages/credit-cards/credit-cards.page.ts`**

  - Remover: `showCreateModal` computed, `CreditCardFormComponent` import, template do modal
  - Alterar: `openCreateModal()` para navegar para página

- **`src/app/features/credit-cards/credit-cards.routes.ts`**

  - Alterar: Rota `/new` para apontar para nova página `CreditCardsCreatePage`

- **Novo**: `src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.ts`

  - Criar página seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `CreditCardFormComponent` (sem wrapper de modal)

- **Novo**: `src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.ts`

  - Criar página de edição seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `CreditCardFormComponent` (sem wrapper de modal)

- **`src/app/features/credit-cards/credit-cards.routes.ts`**
  - Alterar: Rota `/:id/edit` para apontar para nova página `CreditCardsEditPage`

#### 4. Transações

- **`src/app/features/transactions/pages/transactions/transactions.page.ts`**

  - Remover: `_showCreateModal` signal, `TransactionFormComponent` import, template do modal
  - Alterar: `onNewTransaction()` para navegar para página

- **`src/app/features/transactions/transactions.routes.ts`**

  - Adicionar: Rota `/new` para nova página `TransactionsCreatePage`

- **Novo**: `src/app/features/transactions/pages/transactions-create/transactions-create.page.ts`

  - Criar página seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `TransactionFormComponent` (sem wrapper de modal)

- **Novo**: `src/app/features/transactions/pages/transactions-edit/transactions-edit.page.ts`

  - Criar página de edição seguindo padrão de `budget-create.page.ts`
  - Reutilizar lógica de `TransactionFormComponent` (sem wrapper de modal)

- **`src/app/features/transactions/transactions.routes.ts`**
  - Adicionar: Rota `/:id/edit` para nova página `TransactionsEditPage`

#### 5. Categorias

- **`src/app/features/categories/pages/categories-page/categories-page.component.ts`**

  - Alterar: `onPageHeaderActionClick()` para navegar para página em vez de chamar `categoryManager.onAddCategory()`

- **`src/app/features/categories/categories.routes.ts`**

  - Adicionar: Rota `/new` para nova página `CategoriesCreatePage`

- **Novo**: `src/app/features/categories/pages/categories-create/categories-create.page.ts`

  - Criar página seguindo padrão de `budget-create.page.ts`
  - Criar formulário de categoria (pode reutilizar lógica do `OsCategoryManagerComponent`)

- **Novo**: `src/app/features/categories/pages/categories-edit/categories-edit.page.ts`

  - Criar página de edição seguindo padrão de `budget-create.page.ts`
  - Criar formulário de edição de categoria

- **`src/app/features/categories/categories.routes.ts`**
  - Adicionar: Rota `/:id/edit` para nova página `CategoriesEditPage`

#### 6. Envelopes

- **`src/app/features/envelopes/pages/envelopes/envelopes.page.ts`**

  - Verificar: Se `openCreateModal()` já navega corretamente (parece que sim: `router.navigate(['/envelopes/new'])`)

- **`src/app/features/envelopes/envelopes.routes.ts`**
  - Verificar: Se rota `/new` já aponta para página (parece que sim)

### Novos Arquivos a Criar

#### Páginas de Criação

1. **`src/app/features/accounts/pages/accounts-create/accounts-create.page.ts`**

   - Página de criação de contas
   - Reutilizar lógica de `AccountFormComponent`

2. **`src/app/features/accounts/pages/accounts-create/accounts-create.page.scss`**

   - Estilos da página (se necessário)

3. **`src/app/features/accounts/pages/accounts-create/accounts-create.page.spec.ts`**

   - Testes unitários da página de criação

4. **`src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.ts`**

   - Página de criação de cartões de crédito
   - Reutilizar lógica de `CreditCardFormComponent`

5. **`src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.scss`**

   - Estilos da página (se necessário)

6. **`src/app/features/credit-cards/pages/credit-cards-create/credit-cards-create.page.spec.ts`**

   - Testes unitários da página de criação

7. **`src/app/features/transactions/pages/transactions-create/transactions-create.page.ts`**

   - Página de criação de transações
   - Reutilizar lógica de `TransactionFormComponent`

8. **`src/app/features/transactions/pages/transactions-create/transactions-create.page.scss`**

   - Estilos da página (se necessário)

9. **`src/app/features/transactions/pages/transactions-create/transactions-create.page.spec.ts`**

   - Testes unitários da página de criação

10. **`src/app/features/categories/pages/categories-create/categories-create.page.ts`**

    - Página de criação de categorias
    - Criar formulário de categoria

11. **`src/app/features/categories/pages/categories-create/categories-create.page.scss`**

    - Estilos da página (se necessário)

12. **`src/app/features/categories/pages/categories-create/categories-create.page.spec.ts`**
    - Testes unitários da página de criação

#### Páginas de Edição

13. **`src/app/features/budget/pages/budget-edit/budget-edit.page.ts`**

    - Página de edição de orçamentos
    - Reutilizar lógica de `BudgetFormComponent`

14. **`src/app/features/budget/pages/budget-edit/budget-edit.page.scss`**

    - Estilos da página (se necessário)

15. **`src/app/features/budget/pages/budget-edit/budget-edit.page.spec.ts`**

    - Testes unitários da página de edição

16. **`src/app/features/accounts/pages/accounts-edit/accounts-edit.page.ts`**

    - Página de edição de contas
    - Reutilizar lógica de `AccountFormComponent`

17. **`src/app/features/accounts/pages/accounts-edit/accounts-edit.page.scss`**

    - Estilos da página (se necessário)

18. **`src/app/features/accounts/pages/accounts-edit/accounts-edit.page.spec.ts`**

    - Testes unitários da página de edição

19. **`src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.ts`**

    - Página de edição de cartões de crédito
    - Reutilizar lógica de `CreditCardFormComponent`

20. **`src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.scss`**

    - Estilos da página (se necessário)

21. **`src/app/features/credit-cards/pages/credit-cards-edit/credit-cards-edit.page.spec.ts`**

    - Testes unitários da página de edição

22. **`src/app/features/transactions/pages/transactions-edit/transactions-edit.page.ts`**

    - Página de edição de transações
    - Reutilizar lógica de `TransactionFormComponent`

23. **`src/app/features/transactions/pages/transactions-edit/transactions-edit.page.scss`**

    - Estilos da página (se necessário)

24. **`src/app/features/transactions/pages/transactions-edit/transactions-edit.page.spec.ts`**

    - Testes unitários da página de edição

25. **`src/app/features/categories/pages/categories-edit/categories-edit.page.ts`**

    - Página de edição de categorias
    - Criar formulário de edição

26. **`src/app/features/categories/pages/categories-edit/categories-edit.page.scss`**

    - Estilos da página (se necessário)

27. **`src/app/features/categories/pages/categories-edit/categories-edit.page.spec.ts`**
    - Testes unitários da página de edição

### Estrutura de Diretórios

```
src/app/features/
├── accounts/
│   └── pages/
│       ├── accounts/ (existente)
│       └── accounts-create/ (novo)
│           ├── accounts-create.page.ts
│           └── accounts-create.page.scss
├── credit-cards/
│   └── pages/
│       ├── credit-cards/ (existente)
│       └── credit-cards-create/ (novo)
│           ├── credit-cards-create.page.ts
│           └── credit-cards-create.page.scss
├── transactions/
│   └── pages/
│       ├── transactions/ (existente)
│       └── transactions-create/ (novo)
│           ├── transactions-create.page.ts
│           └── transactions-create.page.scss
└── categories/
    └── pages/
        ├── categories-page/ (existente)
        └── categories-create/ (novo)
            ├── categories-create.page.ts
            └── categories-create.page.scss
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

1. **Standalone Components**: Todas as páginas são standalone components
2. **Signals**: Uso de signals para estado reativo
3. **Change Detection OnPush**: Otimização de performance
4. **Reactive Forms**: Formulários reativos com validação
5. **Dependency Injection**: Uso de `inject()` function

### Decisões Arquiteturais

- **Decisão**: Criar páginas dedicadas em vez de adaptar componentes modais
- **Alternativas**:
  1. Adaptar componentes modais para funcionar como páginas (mais complexo)
  2. Criar componentes de formulário reutilizáveis sem wrapper de modal (requer refatoração maior)
- **Justificativa**: Criar páginas dedicadas é mais simples, mantém separação de responsabilidades e segue o padrão já estabelecido em `budget-create.page.ts`

- **Decisão**: Criar versões sem wrapper de modal dos componentes de formulário para uso em páginas
- **Alternativas**:
  1. Extrair apenas a lógica do formulário para páginas (duplicação de código)
  2. Refatorar componentes de formulário para serem reutilizáveis sem modal (escopo maior)
- **Justificativa**: Criar versões sem modal mantém componentes modais existentes funcionando e permite reutilização em páginas

- **Decisão**: Converter edição também para páginas nesta demanda
- **Alternativas**:
  1. Converter apenas criação, deixar edição para depois
  2. Manter edição em modais
- **Justificativa**: Padronização completa garante consistência e melhor UX

- **Decisão**: Manter filtros existentes e não adicionar onde não existem
- **Alternativas**: Adicionar filtros em todas as páginas para padronização completa
- **Justificativa**: Evita mudanças desnecessárias e mantém funcionalidades existentes

## 🎨 UI Components and Layout

### Design System Integration

**Componentes Reutilizados:**

- **Atoms**: `os-button`, `os-input`, `os-select`, `os-icon`, `os-label`, `os-money-input`
- **Molecules**: `os-form-field`, `os-filter-bar`, `os-card`, `os-alert`
- **Organisms**: `os-page-header`, `os-page`, `os-entity-list`
- **Templates**: `os-form-template`

Todos os componentes necessários já existem no Design System. Nenhum novo componente precisa ser criado.

### Layout Architecture

**Páginas de Listagem:**

```
os-page (container)
  └─ os-page-header (title, subtitle, actions)
  └─ os-filter-bar (onde existem)
  └─ os-entity-list (conteúdo da lista)
```

**Páginas de Criação/Edição:**

```
os-page (container)
  └─ os-page-header (title, subtitle, breadcrumbs)
  └─ os-form-template (formulário)
      └─ os-form-field (campos do formulário)
```

### Responsive Strategy

- **Mobile-first**: Estilos base para mobile, progressive enhancement
- **Breakpoints**:
  - Mobile: < 576px (stack vertical)
  - Tablet: 576-991px (grid 2 colunas)
  - Desktop: >= 992px (grid completo, max-width 1200px)
- **Touch Targets**: >= 44px em mobile (WCAG compliance)

### Accessibility Implementation

- **WCAG 2.1 AA**: Compliance completo
- **Keyboard Navigation**: Tab order lógico, focus management
- **ARIA**: Landmarks, labels, live regions implementados
- **Screen Reader**: Suporte completo via componentes do Design System

**Detalhes completos em:** `layout-specification.md`

### Performance Considerations

- **OnPush Change Detection**: Todos componentes já usam OnPush
- **Lazy Loading**: Páginas de criação/edição lazy loaded via rotas
- **Bundle Size**: Mínimo impacto - apenas reutilização de componentes existentes

## 📦 Dependências e Integrações

### Dependências Existentes

- `@angular/router`: Para navegação
- `@angular/forms`: Para formulários reativos
- `@angular/cdk/layout`: Para BreakpointObserver (responsividade)
- `@shared/ui-components`: Componentes UI compartilhados
- Estados: `AccountState`, `CreditCardState`, `TransactionState`, `CategoryState`

### Novas Dependências

- Nenhuma nova dependência necessária

### Integrações

- **Estados**: Integração com estados existentes para criação de entidades
- **NotificationService**: Para feedback ao usuário após criação
- **Router**: Para navegação entre páginas
- **AuthService**: Para obter usuário atual quando necessário
- **BreakpointObserver**: Para responsividade (já usado em componentes existentes)

## 🔄 Fluxo de Dados

### Fluxo de Criação

1. **Usuário clica em "Novo [Entidade]"** no header da página de listagem
2. **Navegação**: Router navega para `/[feature]/new`
3. **Página de Criação**: Componente de página de criação é carregado
4. **Formulário**: Formulário reativo é inicializado
5. **Validação**: Validação ocorre ao tentar salvar
6. **Criação**: Estado correspondente cria a entidade
7. **Feedback**: NotificationService mostra mensagem de sucesso
8. **Navegação**: Router navega de volta para página de listagem
9. **Atualização**: Lista é atualizada automaticamente via signals

### Exemplo: Criação de Conta

```
AccountsPage (listagem)
  └─> onPageHeaderActionClick('Nova Conta')
      └─> router.navigate(['new'], { relativeTo: route })
          └─> AccountsCreatePage carregada
              └─> FormGroup inicializado
                  └─> Usuário preenche formulário
                      └─> onSave()
                          └─> accountState.createAccount()
                              └─> notificationService.showSuccess()
                                  └─> router.navigate(['/accounts'])
                                      └─> AccountsPage atualizada (via signals)
```

## 🧪 Considerações de Teste

### Testes Unitários

- **Páginas de Criação**: Testar inicialização de formulário, validação, submissão, navegação, tratamento de erros
- **Páginas de Edição**: Testar carregamento de dados, inicialização de formulário, validação, submissão, navegação, tratamento de erros
- **Páginas de Listagem**: Testar navegação do botão "Novo" e "Editar", remoção de lógica de modal
- **Componentes de Formulário**: Testar versões sem modal dos componentes

### Testes de Integração

- **Rotas**: Verificar que rotas de criação estão configuradas corretamente
- **Navegação**: Testar fluxo completo de criação e retorno à listagem
- **Estados**: Verificar que estados são atualizados corretamente após criação

### Mocks e Fixtures

- Mockar estados para testes
- Mockar Router para testes de navegação
- Mockar NotificationService para testes de feedback

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Duplicação de Código**: Alguma duplicação ao criar versões sem modal dos componentes, mas mantém separação clara e permite manter componentes modais funcionando
- **Escopo Expandido**: Incluir edição nesta demanda aumenta o escopo, mas garante padronização completa

### Riscos Identificados

1. **Risco**: Quebrar funcionalidade de edição ao converter para páginas

   - **Mitigação**: Criar versões sem modal dos componentes, manter componentes modais funcionando durante transição, testar extensivamente

2. **Risco**: Escopo muito grande pode aumentar tempo de desenvolvimento

   - **Mitigação**: Seguir ordem proposta, testar incrementalmente, focar em qualidade

3. **Risco**: Regressão em funcionalidades existentes
   - **Mitigação**: Testar cada página individualmente após mudanças

## 📋 Lista de Implementação

### UI Components

- [ ] Verificar uso correto de componentes do Design System em todas as páginas
- [ ] Garantir responsividade mobile-first em todas as páginas
- [ ] Implementar acessibilidade (ARIA, keyboard navigation) conforme layout-specification
- [ ] Validar consistência visual entre todas as páginas

### Fase 1: Orçamentos (Padrão de Referência)

- [ ] Remover lógica de modal de criação de `budget-list.page.ts`
- [ ] Remover lógica de modal de edição de `budget-detail.page.ts`
- [ ] Atualizar rota `/budgets/new` para usar `BudgetCreatePage`
- [ ] Criar `budget-edit.page.ts`
- [ ] Atualizar rota `/budgets/:id/edit` para usar `BudgetEditPage`
- [ ] Criar testes unitários para `budget-create.page.ts` e `budget-edit.page.ts`
- [ ] Verificar navegação do botão "Novo Orçamento" e ações de edição
- [ ] Validar layout e responsividade conforme layout-specification

### Fase 2: Contas

- [ ] Criar `accounts-create.page.ts`
- [ ] Criar `accounts-edit.page.ts`
- [ ] Atualizar `accounts.page.ts` para remover modal de criação
- [ ] Atualizar `account-detail.page.ts` para remover modal de edição
- [ ] Atualizar rotas `/accounts/new` e `/accounts/:id/edit`
- [ ] Criar testes unitários para páginas de criação e edição
- [ ] Testar criação, edição e navegação

### Fase 3: Cartões de Crédito

- [ ] Criar `credit-cards-create.page.ts`
- [ ] Criar `credit-cards-edit.page.ts`
- [ ] Atualizar `credit-cards.page.ts` para remover modal de criação
- [ ] Atualizar `credit-card-detail.page.ts` para remover modal de edição
- [ ] Atualizar rotas `/credit-cards/new` e `/credit-cards/:id/edit`
- [ ] Criar testes unitários para páginas de criação e edição
- [ ] Testar criação, edição e navegação

### Fase 4: Transações

- [ ] Criar `transactions-create.page.ts`
- [ ] Criar `transactions-edit.page.ts`
- [ ] Atualizar `transactions.page.ts` para remover modais de criação e edição
- [ ] Adicionar rotas `/transactions/new` e `/transactions/:id/edit`
- [ ] Criar testes unitários para páginas de criação e edição
- [ ] Testar criação, edição e navegação

### Fase 5: Categorias

- [ ] Criar `categories-create.page.ts`
- [ ] Criar `categories-edit.page.ts`
- [ ] Atualizar `categories-page.component.ts` para navegar para páginas
- [ ] Adicionar rotas `/categories/new` e `/categories/:id/edit`
- [ ] Criar testes unitários para páginas de criação e edição
- [ ] Testar criação, edição e navegação

### Fase 6: Envelopes

- [ ] Verificar navegação do botão "Novo Envelope"
- [ ] Verificar se página de criação está correta
- [ ] Ajustar se necessário

### Fase 7: Validação Final

- [ ] Executar todos os testes unitários
- [ ] Testar todas as páginas de listagem, criação e edição
- [ ] Verificar consistência visual conforme layout-specification
- [ ] Validar responsividade em mobile, tablet e desktop
- [ ] Testar acessibilidade (keyboard navigation, screen reader)
- [ ] Validar que funcionalidades existentes não foram quebradas
- [ ] Verificar cobertura de testes
- [ ] Revisar código e documentação

## 📚 Referências

- Padrão de Listagem: `src/app/features/budget/pages/budget-list/budget-list.page.ts`
- Padrão de Criação: `src/app/features/budget/pages/budget-create/budget-create.page.ts`
- Componentes de Formulário:
  - `src/app/features/accounts/components/account-form/account-form.component.ts`
  - `src/app/features/credit-cards/components/credit-card-form/credit-card-form.component.ts`
  - `src/app/features/transactions/components/transaction-form/transaction-form.component.ts`
- Componentes UI: `src/app/shared/ui-components/`
- Issue: [OS-242](https://orca-sonhos.atlassian.net/browse/OS-242)
