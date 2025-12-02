# Sistema de Categorias - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- **Categorias**:
  - Existem apenas **handlers MSW** em `categories.handlers.ts` com lista estática de categorias (income/expense/transfer).
  - O organismo `os-category-manager` fornece uma UI rica, porém **não integrada** a serviços reais nem a um estado global de categorias.
  - Não há DTOs em `src/dtos/category/` nem `CategoriesApiService`/`CategoryState` reais.
- **Transações**:
  - `TransactionFormComponent` já usa `categoryId` e recebe `categoryOptions` como input, porém ainda baseados em dados mockados.
- **Arquitetura**:
  - Padrões de DTO e state já estabelecidos para contas (`dtos/account`, `AccountState`) e budgets, servindo como referência.

### Mudanças Propostas

- Introduzir uma **vertical completa de categorias**:
  - DTOs de categoria em `src/dtos/category/`.
  - Serviços de API e estado em `src/app/core/services/category/`.
  - Nova feature `categories` em `src/app/features/categories/` com lista e formulário, integrada ao design system e (quando útil) ao organismo `os-category-manager`.
- Atualizar `TransactionFormComponent` para:
  - Deixar de depender de `categoryOptions` mockados.
  - Usar dados do `CategoryState`, filtrados por orçamento e, opcionalmente, por tipo de transação.
- Evoluir handlers MSW de categorias para **CRUD completo**, alinhado aos novos DTOs.
- Preparar `CategoryState` para alimentar o dashboard (gastos por categoria) e futuras features (envelopes).

### Impactos

- **Frontend**:
  - Novos serviços e estado em `core/services/category`.
  - Nova área `features/categories` com componentes e rotas.
  - Alterações em transações para consumir categorias reais.
- **Testes**:
  - Novos testes unitários para DTOs, serviços, state e componentes de categorias.
  - Ajustes em testes que hoje dependem dos mocks de categorias.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/core/mocks/handlers/categories.handlers.ts`

  - Evoluir de lista estática para handlers com **CRUD** (`GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`), respeitando DTOs reais.

- `src/app/features/transactions/components/transaction-form/transaction-form.component.ts`
  - Alterar forma de preenchimento de `categoryOptions` para usar `CategoryState`.
  - Garantir filtragem adequada de categorias (por orçamento e tipo de transação, conforme assunções).

### Novos Arquivos a Criar

- **DTOs de categoria (`src/dtos/category/`)**

  - `category-types.ts`
    - `CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER'`
    - Tipo para preset vs custom (ex.: `CategoryKind = 'PRESET' | 'CUSTOM'`).
  - `category-dto.ts`
    - `CategoryDto` com campos: `id`, `budgetId`, `name`, `description?`, `type`, `kind`, `color?`, `icon?`, `active`, `createdAt`, `updatedAt`, `order?`.
  - `create-category-request-dto.ts`
  - `update-category-request-dto.ts`
  - `delete-category-request-dto.ts`
  - `index.ts` expondo todos os tipos de categoria.

- **Serviços de categoria (`src/app/core/services/category/`)**

  - `categories-api.service.ts`
    - Métodos:
      - `listCategories(budgetId: string): Observable<CategoryDto[]>`
      - `createCategory(dto: CreateCategoryRequestDto): Observable<string | null>`
      - `updateCategory(dto: UpdateCategoryRequestDto): Observable<boolean>`
      - `deleteCategory(dto: DeleteCategoryRequestDto): Observable<boolean>` (soft delete).
    - Integração com `ApiService`/`AuthService`.
  - `category.state.ts`
    - Signals:
      - `_categories: CategoryDto[]`
      - `_loading: boolean`
      - `_error: string | null`
    - Readonly:
      - `categories`, `loading`, `error`.
    - Computeds:
      - `categoriesByBudgetId` (usa `BudgetSelectionService.selectedBudgetId()`).
      - `presetCategories`, `customCategories`.
      - `activeCategories`, `inactiveCategories`.
    - Actions:
      - `loadCategories(force = false)`
      - `createCategory(dto)`
      - `updateCategory(dto)`
      - `deleteCategory(dto)` (soft delete → recarregar ou atualizar localmente).
  - `preset-categories.service.ts`
    - Catálogo de presets por tipo (`INCOME`, `EXPENSE`, `TRANSFER`).
    - Função utilitária para gerar requests de criação de categorias preset para um dado `budgetId`.

- **Feature Categories (`src/app/features/categories/`)**

  - `categories.routes.ts`
    - Rotas:
      - `/categories` → página principal (lista/gerenciamento).
      - `/categories/new` → criação de categoria.
      - `/categories/:id` → edição de categoria.
  - `pages/categories-page/categories-page.component.ts`
    - Orquestra:
      - Carregamento de categorias via `CategoryState`.
      - Configuração e uso do organismo `os-category-manager` (ou equivalentemente lista + form dedicados).
      - Navegação para criação/edição.
  - (Opcional, se necessário além do organismo)
    - `components/category-list/category-list.component.ts`
    - `components/category-form/category-form.component.ts`

- **Integração com criação de orçamento**
  - Arquivo a depender de onde o orçamento é criado (ex.: `budget.state`, `budget.service` ou fluxo equivalente no projeto atual).
  - Lógica de hook pós-criação de orçamento:
    - Ao criar um orçamento, chamar `PresetCategoriesService` → gerar categorias preset → chamar `CategoriesApiService` para persistir.

### Estrutura de Diretórios

- **DTOs**
  - `src/dtos/category/`
- **Core Services**
  - `src/app/core/services/category/`
- **Feature**
  - `src/app/features/categories/` com `pages/`, `components/` (se necessário) e `categories.routes.ts`.

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Clean Architecture / DTO-First**:
  - DTOs explicitando contratos de API.
  - Serviços de API fazendo apenas chamadas HTTP + mapeamento de dados.
  - State encapsulando regras de carregamento, flags de loading/error e derivações.
- **Angular Modern Patterns**:
  - Standalone components.
  - Signals (`signal`, `computed`) no state.
  - `input()`/`output()` nos componentes.
  - `ChangeDetectionStrategy.OnPush`.
- **Feature-Based Architecture**:
  - Nova feature `categories` com estrutura previsível (pages, components, state/services no core).

### Decisões Arquiteturais

- **Tipo de Categoria**

  - **Decisão**: Usar `CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER'`, alinhando com mocks e `TransactionType`.
  - **Alternativas**: Modelos mais genéricos (tags, múltiplos tipos por categoria).
  - **Justificativa**: Simples, compatível com o que já existe, suficiente para MVP.

- **Seed por Orçamento**

  - **Decisão**: Seed de presets sempre que um novo orçamento é criado (segunda opção solicitada).
  - **Alternativas**: Seed global por usuário, ou criação on-demand.
  - **Justificativa**: Garante isolamento de categorias por orçamento, é coerente com meta specs que tratam “cada orçamento” com suas entidades.

- **Soft Delete com Flag**

  - **Decisão**: Implementar soft delete (campo `active` ou equivalente), nunca removendo categorias em uso.
  - **Alternativas**: Hard delete com remapeamento de transações.
  - **Justificativa**: Evita problemas de integridade e preserva histórico para relatórios.

- **Integração com TransactionForm**

  - **Decisão**: Centralizar categorias em `CategoryState`, e o formulário consumir `categoryOptions` derivados desse state.
  - **Alternativas**: Chamada direta de API a cada abertura do modal.
  - **Justificativa**: Reuso, performance, alinhado com padrão usado em `AccountState`/`CreditCardState`.

- **Uso do `os-category-manager`**
  - **Decisão**: Reutilizar o organismo existente como **núcleo de UI** da página de categorias, apenas plugando-o em `CategoryState`/serviços.
  - **Alternativas**: Criar novos componentes de lista/form.
  - **Justificativa**: Aproveita trabalho existente, mantém coerência visual e reduz esforço de UI (não há Figma de referência).

## 📦 Dependências e Integrações

### Dependências Existentes

- `ApiService` e `AuthService` para chamadas autenticadas.
- `BudgetSelectionService` para contexto de orçamento.
- `TransactionFormComponent` para uso de categorias em transações.
- `CreditCardState`, `AccountState` como referências de implementação de state.

### Novas Dependências

- `CategoryState`, `CategoriesApiService`, `PresetCategoriesService` (próprios da feature).

### Integrações

- **Transações ↔ Categorias**:
  - `TransactionFormComponent`:
    - Ao abrir, garantir que categorias estejam carregadas via `CategoryState`.
    - `categoryOptions` derivado de `CategoryState.categoriesByBudgetId` (filtrado por status ativo e, idealmente, por tipo de transação).
- **Orçamentos ↔ Presets**:
  - Ao criar orçamento, disparar seed via `PresetCategoriesService` + `CategoriesApiService`.
- **Dashboard ↔ Categorias**:
  - `CategoryState` deve expor dados suficientes (tipo, cor, ícone) para que o dashboard (OS-235) possa renderizar widgets de gasto por categoria.

## 🎨 UI Components and Layout

### Design System Integration

- Página de categorias baseada nos templates e organismos existentes:
  - `os-page` + `os-page-header` como contêiner de página.
  - `os-filter-bar`, `os-input`, `os-select` para filtros/busca.
  - `os-category-manager` como organismo principal de gestão de categorias.
  - `os-alert`, `os-button`, `os-icon`, `os-badge` para feedback e ações.
- Layout responsivo seguindo as diretrizes de `responsive-design.md` (mobile-first, breakpoints XS–XL).
- Acessibilidade alinhada a `accessibility.md` (foco visível, ARIA adequada, navegação por teclado).

### Novos Componentes de UI

- Não há necessidade de novos **atoms/molecules/organisms** de design system neste momento.
- Novos componentes de **feature**:
  - `CategoriesPage` (`features/categories/pages/categories-page/categories-page.component.ts`) para orquestrar layout e integração com `CategoryState`.

### Layout Architecture

- Rota `/categories` lazy-loaded apontando para `CategoriesPage`.
- `CategoriesPage`:
  - Estrutura: `os-page` → `os-page-header` → seção de filtros → `os-category-manager`.
  - Integração:
    - Lê categorias de `CategoryState`.
    - Mapeia eventos de `os-category-manager` (criar/editar/excluir/reordenar) para ações de state/API.
  - Responsividade:
    - Stack vertical em mobile.
    - Filtros em linha e layout mais amplo em tablet/desktop.

### Performance Considerations (UI)

- Todos os componentes de página com `ChangeDetectionStrategy.OnPush`.
- Rota `/categories` carregada sob demanda (lazy-load).
- Drag & drop ativado apenas quando necessário, evitando custo extra em dispositivos de baixa capacidade.
- Reutilização de componentes do design system reduz duplicidade de CSS e JS.

## 🔄 Fluxo de Dados

1. **Carregamento de Categorias**:

   - Usuário seleciona um orçamento (via `BudgetSelectionService`).
   - `CategoryState.loadCategories()` chama `CategoriesApiService.listCategories(budgetId)`.
   - Resposta é mapeada para `CategoryDto[]` e armazenada em `_categories`.

2. **Gerenciamento na Tela de Categorias**:

   - Página `/categories` consome `CategoryState`:
     - Passa `categoriesByBudgetId()` (ou subsets) para `os-category-manager`.
   - Ao criar/editar/excluir:
     - Componente dispara eventos para a página.
     - Página chama `CategoryState.createCategory/updateCategory/deleteCategory`.
     - State orquestra chamadas à API e refresh (ou atualizações locais).

3. **Uso em Transações**:

   - `TransactionFormComponent` acessa `CategoryState` (diretamente ou via injeção de opções pré-processadas).
   - Constrói `categoryOptions` com base em:
     - Orçamento atual.
     - `active = true`.
     - (Opcionalmente) tipo compatível com `TransactionType`.
   - Quando transação é salva, apenas envia `categoryId` (DTO de transação permanece como está).

4. **Soft Delete**:
   - Ao “excluir” uma categoria:
     - `deleteCategory` marca `active = false` via API.
     - `CategoryState` aplica atualização local ou recarrega lista.
     - Listas de seleção e telas de criação/edição de transações filtram `active = true`.

## 🧪 Considerações de Teste

### Testes Unitários

- **DTOs**:
  - Tipos simples, foco em garantir que mapeamentos no `CategoriesApiService` respeitam o contrato.
- **CategoriesApiService**:
  - Sucesso/erro em `list/create/update/delete`.
  - Montagem correta de URLs e payloads.
- **CategoryState**:
  - Comportamento de `loadCategories`, `createCategory`, `updateCategory`, `deleteCategory`.
  - Computeds (`categoriesByBudgetId`, `preset/custom`, `active/inactive`).
- **PresetCategoriesService**:
  - Geração correta de presets por `CategoryType`.

### Testes de Integração (frontend)

- **Página `/categories`**:
  - Integração entre `CategoryState` e `os-category-manager`.
  - Fluxo feliz de criar/editar/desativar categoria.
- **TransactionFormComponent**:
  - Verificar que, com categorias carregadas, o dropdown exibe opções corretas.
  - Garantir comportamento quando não há categorias (mensagem de “Configure categorias primeiro” permanece coerente).

### Mocks e Fixtures

- Atualizar MSW:
  - Simular CRUD real de categorias com flags `active`, tipos e kinds (preset/custom).
  - Garantir compatibilidade com DTOs.

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Assumir regra de tipo de categoria vs tipo de transação** sem especificação explícita nas Meta Specs:
  - Ajuda a entregar MVP coerente, mas pode precisar de ajustes futuros.
- **Reuso de `os-category-manager`** em vez de criar nova UI dirigida por specs visuais:
  - Reduz trabalho de UI, mas pode exigir ajustes futuros quando houver Figma/design dedicado.

### Riscos Identificados

- **Alinhamento com Backend**:
  - Se o backend de categorias tiver campos diferentes, haverá necessidade de remapeamento ou ajustes de DTO.
- **Complexidade de Seed**:
  - O momento exato do seed por orçamento precisa ser cuidadosamente integrado para evitar duplicidades.
- **Soft Delete**:
  - Se outros módulos consumirem categorias sem considerar `active`, podem exibir categorias inativas indevidamente.

## 📋 Lista de Implementação

- [ ] Criar DTOs de categoria em `src/dtos/category/` e atualizar `src/dtos/index.ts` se necessário.
- [ ] Implementar `CategoriesApiService` em `core/services/category/`.
- [ ] Implementar `CategoryState` com signals e computeds.
- [ ] Implementar `PresetCategoriesService` e integrar com fluxo de criação de orçamento.
- [ ] Criar feature `categories` com rotas (`/categories`, `/categories/new`, `/categories/:id`).
- [ ] Implementar `CategoriesPage` usando `os-page`, `os-page-header`, `os-filter-bar` e `os-category-manager`, conforme `layout-specification.md`.
- [ ] Integrar `os-category-manager` com `CategoryState` na página de categorias.
- [ ] Adicionar entrada de navegação/menu para a rota `/categories`.
- [ ] Atualizar `TransactionFormComponent` para usar categorias reais.
- [ ] Evoluir handlers MSW de categorias para CRUD completo.
- [ ] Implementar testes unitários e de integração, garantindo cobertura > 80%.

## 📚 Referências

- Meta Specs:
  - `technical/frontend-architecture/feature-examples.md`
  - `technical/frontend-architecture/implementation-guide.md`
  - `technical/code-standards/*`
  - `technical/frontend-architecture/angular-modern-patterns.md`
- Código de referência:
  - `AccountState` e `AccountsApiService`.
  - `TransactionFormComponent`.
  - `categories.handlers.ts`.
  - `os-category-manager` (organismo UI).
