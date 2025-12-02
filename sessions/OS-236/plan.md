# Sistema de Categorias - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar um **sistema completo de categorias** (preset + custom) por orçamento, com DTOs alinhados ao backend, serviços de API, estado reativo com signals, página de gerenciamento `/categories` integrada ao design system e ao `os-category-manager`, integração com `TransactionFormComponent`, handlers MSW com CRUD completo e preparação para uso em dashboard e envelopes.

## 🎯 Objetivos

- Garantir que o frontend tenha um **módulo de categorias completo e testável**, substituindo mocks atuais.
- Assegurar que **transações** utilizem categorias reais, filtradas por orçamento e tipo, com **soft delete** e unicidade de nome por orçamento.
- Entregar uma **página de categorias** responsiva, acessível e alinhada ao design system, pronta para alimentar o **Dashboard Centrado em Progresso**.

---

## 📅 FASE 1: DTOs, Contratos e API de Categorias [Status: Completada ✅]

### 🎯 Objetivo

Estabelecer a base de dados de categorias no frontend: DTOs, tipos e serviço de API, alinhados com o backend e com suporte mínimo em MSW (GET).

### 📋 Tarefas

#### 1. Criar DTOs de Categoria [✅]

**Descrição**:  
Criar pasta `src/dtos/category/` com:

- `category-types.ts`: `CategoryType`, `CategoryKind` e outros enums/tipos necessários.
- `category-dto.ts`: `CategoryDto` com campos: `id`, `budgetId`, `name`, `description?`, `type`, `kind`, `color?`, `icon?`, `active`, `createdAt`, `updatedAt`, `order?`.
- `create-category-request-dto.ts`, `update-category-request-dto.ts`, `delete-category-request-dto.ts`.
- `index.ts` exportando todos os tipos de categoria.
  Atualizar `src/dtos/index.ts` se necessário para incluir o módulo de categorias.

**Critério de Conclusão**:

- Tipos compilando sem erros.
- Estrutura consistente com padrões de `src/dtos/account/`.

#### 2. Implementar CategoriesApiService (CRUD base) [✅]

**Descrição**:  
Criar `CategoriesApiService` em `src/app/core/services/category/categories-api.service.ts`:

- Métodos:
  - `listCategories(budgetId: string): Observable<CategoryDto[]>`
  - `createCategory(dto: CreateCategoryRequestDto): Observable<string | null>`
  - `updateCategory(dto: UpdateCategoryRequestDto): Observable<boolean>`
  - `deleteCategory(dto: DeleteCategoryRequestDto): Observable<boolean>` (soft delete).
- Integrar com `ApiService`/`AuthService`, seguindo padrão de outros serviços core.

**Critério de Conclusão**:

- Serviço injetável (`providedIn: 'root'`), tipado, sem `any`.
- Chamadas HTTP montadas com as rotas/contratos definidos pelo backend.

#### 3. Ajustar Handlers MSW para Listagem de Categorias [✅]

**Descrição**:  
Atualizar `src/app/core/mocks/handlers/categories.handlers.ts` para:

- Retornar payload no formato esperado de `CategoryDto[]` (ao menos para GET `/categories`).
- Suportar query param `budgetId` (mesmo que, inicialmente, apenas ignore e retorne mock global).

**Critério de Conclusão**:

- Chamadas `listCategories` usam MSW em ambiente de dev/test sem erro.

### 🧪 Critérios de Validação

- [x] Projeto compila com DTOs novos.
- [x] `CategoriesApiService` coberto por testes unitários básicos (sucesso/erro de cada método).
- [x] Chamada simulada de `listCategories` contra MSW funciona e retorna dados tipados.

### 📝 Comentários da Fase

- **DTOs**: Criados DTOs de categoria em `src/dtos/category/` (`CategoryDto`, `CategoryType`, `CategoryKind`, requests/responses e `ListCategoriesResponseDto`) seguindo o padrão de `dtos/account`.
- **API Service**: Implementado `CategoriesApiService` com methods `list/create/update/delete`, estado interno com signals (`loading`, `error`) e integração com `ApiService`/`AuthService`, espelhando `AccountsApiService`.
- **MSW**: Atualizado `categories.handlers.ts` para devolver objetos no shape de `CategoryDto` (incluindo `budgetId`, `kind`, `active`, `createdAt`, `updatedAt`, `order`) e `meta.count`, respeitando o contrato de `ListCategoriesResponseDto`.
- **Testes**: Adicionados testes unitários dedicados para `CategoriesApiService` cobrindo cenários de sucesso, usuário não autenticado, parâmetros inválidos e erros de API (executados com sucesso via Vitest).

---

## 📅 FASE 2: CategoryState, Signals e Integração com BudgetSelection [Status: Completada ✅]

### 🎯 Objetivo

Introduzir um estado reativo de categorias no core (`CategoryState`), integrado ao orçamento selecionado e ao serviço de API, com signals e computeds prontos para uso nas telas.

### 📋 Tarefas

#### 1. Implementar CategoryState [✅]

**Descrição**:  
Criar `CategoryState` em `src/app/core/services/category/category.state.ts` com:

- Signals privados: `_categories`, `_loading`, `_error`.
- Readonly signals: `categories`, `loading`, `error`.
- Computeds:
  - `categoriesByBudgetId` (usa `BudgetSelectionService.selectedBudgetId()`).
  - `presetCategories`, `customCategories`.
  - `activeCategories`, `inactiveCategories`.
- Métodos:
  - `loadCategories(force = false)`.
  - `createCategory(dto)`.
  - `updateCategory(dto)`.
  - `deleteCategory(dto)` (aplica soft delete via API).

**Critério de Conclusão**:

- State compilando, integrado ao `CategoriesApiService`.
- Não há loops ou efeitos colaterais indevidos.

#### 2. Integração com BudgetSelectionService [✅]

**Descrição**:  
Conectar `CategoryState` ao `BudgetSelectionService`:

- `loadCategories` deve falhar graciosamente se não houver orçamento selecionado.
- Computeds devem refletir sempre o orçamento atual.

**Critério de Conclusão**:

- Mudança de orçamento resulta em recarregamento adequado (ou estado consistente) das categorias.

#### 3. Testes Unitários de CategoryState [✅]

**Descrição**:  
Escrever testes unitários para:

- Carregamento de categorias (sucesso/erro).
- Criação/atualização/exclusão (soft delete) reafetando os signals.
- Computeds (por orçamento, preset/custom, active/inactive).

**Critério de Conclusão**:

- Cobertura significativa para `CategoryState` (idealmente alinhada à meta > 80% da feature).

### 🧪 Critérios de Validação

- [x] `CategoryState` responde corretamente ao orçamento selecionado.
- [x] Métodos de mutate (`create/update/delete`) atualizam a lista (via reload com `loadCategories(true)`).
- [x] Erros de API refletem-se em `error` e `loading` retorna a `false`.

### 📝 Comentários da Fase

- **State**: Implementado `CategoryState` em `core/services/category/category.state.ts` com signals (`_categories`, `_loading`, `_error`) e readonly signals expostos (`categories`, `loading`, `error`), espelhando o padrão de `AccountState`.
- **Integração com orçamento**: `CategoryState` injeta `BudgetSelectionService` e expõe `selectedBudgetId`; os computed `categoriesByBudgetId`, `presetCategories`, `customCategories`, `activeCategories` e `inactiveCategories` filtram sempre pelo orçamento selecionado.
- **Carregamento e mutations**: `loadCategories` usa `CategoriesApiService.listCategories(budgetId)` e trata ausência de orçamento; `createCategory`, `updateCategory` e `deleteCategory` orquestram as operações e fazem reload com `loadCategories(true)` em caso de sucesso.
- **Testes**: Criado `category.state.spec.ts` com cenários para carregamento (sucesso/erro/sem orçamento), computed por orçamento/kind/status e fluxo de `create/update/delete`, garantindo que `loading`/`error` sejam atualizados corretamente.

---

## 📅 FASE 3: Página de Categorias e Integração com os-category-manager [Status: Completada ✅]

### 🎯 Objetivo

Entregar a página `/categories` com layout definido em `layout-specification.md`, conectada a `CategoryState` e reutilizando o organismo `os-category-manager`.

### 📋 Tarefas

#### 1. Criar CategoriesPage e Rotas [✅]

**Descrição**:  
Criar `CategoriesPage` em `src/app/features/categories/pages/categories-page/categories-page.component.ts` e configurar:

- `categories.routes.ts` com rotas:
  - `/categories` → `CategoriesPage`.
  - (Opcional) `/categories/new`, `/categories/:id` se decididos necessários para deep links.
- Lazy-loading da rota no `app.routes.ts`.

**Critério de Conclusão**:

- Navegar para `/categories` carrega a página de categorias.

#### 2. Layout da Página com Design System [✅]

**Descrição**:  
Montar layout conforme `layout-specification.md`:

- `os-page` + `os-page-header` (título, subtítulo, botão “Nova Categoria”).
- Seção de filtros (`os-filter-bar` + `os-input` + `os-select`).
- Conteúdo principal com `os-category-manager`.
- Estados:
  - Loading (skeleton/spinner).
  - Empty (mensagem + CTA).
  - Error (`os-alert`).

**Critério de Conclusão**:

- Layout responsivo (mobile/tablet/desktop) conforme wireframes textuais.

#### 3. Conectar CategoriesPage ao CategoryState e os-category-manager [✅]

**Descrição**:  
Integrar:

- `CategoriesPage` injeta `CategoryState` e:
  - Chama `loadCategories` ao entrar.
  - Passa `categories`, `loading` e event handlers para `os-category-manager`.
- Mapear outputs de `os-category-manager` (`categoryAdded`, `categoryUpdated`, `categoryDeleted`, `categoryReordered`) para chamadas em `CategoryState`.
- Implementar filtros/busca em nível de página (ou usando signals no próprio organismo).

**Critério de Conclusão**:

- Criar/editar/desativar categorias na UI dispara as ações reais no estado/API.

### 🧪 Critérios de Validação

- [x] Navegar até `/categories` carrega e exibe categorias do orçamento atual.
- [x] Criar/editar/excluir (soft delete) categoria funciona do ponto de vista de usuário (via integração `CategoriesPage` → `CategoryState` → `CategoriesApiService`).
- [x] Layout segue especificação (header, filtros embutidos no `os-category-manager`, lista, estados de erro/empty).
- [ ] Testes básicos de renderização de `CategoriesPage` e integração com `CategoryState` (a serem cobertos em fase posterior junto com ajustes globais de testes de páginas e resolução de estilos).

### 📝 Comentários da Fase

- **Rotas**: Criado `CATEGORIES_ROUTES` em `features/categories/categories.routes.ts` e registrada rota lazy em `app.routes.ts` (`/categories`), seguindo o padrão das demais features.
- **Página**: Implementada `CategoriesPage` como componente standalone que usa `os-page` + `os-page-header` + `os-category-manager` e `os-alert` para estados de erro/nenhum orçamento selecionado.
- **Integração com estado**: `CategoriesPage` injeta `CategoryState` e `BudgetSelectionService`, chama `loadCategories()` reagindo ao orçamento selecionado e mapeia eventos de `os-category-manager` (`categoryAdded`, `categoryUpdated`, `categoryDeleted`) para `createCategory`, `updateCategory` e `deleteCategory`.
- **Mapeamento de tipos**: Implementado mapeamento entre `CategoryDto` (`INCOME`/`EXPENSE`/`TRANSFER`) e os tipos de UI do `os-category-manager` (`income`/`expense`/`transfer`), garantindo consistência entre backend/domínio e camada visual.

---

## 📅 FASE 4: Integração com Transações, Presets, MSW CRUD e Polimento [Status: ⏳]

### 🎯 Objetivo

Conectar o sistema de categorias às transações, implementar categorias preset por orçamento, completar CRUD no MSW e refinar validações, acessibilidade e testes.

### 📋 Tarefas

#### 1. Integração com TransactionFormComponent [⏳]

**Descrição**:  
Atualizar `TransactionFormComponent` para:

- Deixar de depender de `categoryOptions` mockados.
- Consumir categorias a partir de `CategoryState`/serviço:
  - Apenas categorias **ativas** do orçamento atual.
  - Opcionalmente filtradas por tipo (`TransactionType` ↔ `CategoryType`).

**Critério de Conclusão**:

- Dropdown de categoria no formulário mostra apenas categorias reais e ativas.
- Mensagem “Nenhuma categoria disponível. Configure categorias primeiro.” continua coerente.

#### 2. Implementar PresetCategoriesService e Seed por Orçamento [⏳]

**Descrição**:  
Criar `PresetCategoriesService` e integrar com fluxo de criação de orçamento:

- Definir catálogo de categorias preset (INCOME/EXPENSE/TRANSFER).
- Ao criar um novo orçamento, chamar service + API para criar categorias preset para aquele `budgetId`.

**Dependências**:

- `CategoryState` e `CategoriesApiService` prontos (Fases 1–2).

**Critério de Conclusão**:

- Ao criar novo orçamento, usuário vê categorias preset automaticamente criadas.

#### 3. Completar CRUD MSW para Categorias [⏳]

**Descrição**:  
Atualizar `categories.handlers.ts` para:

- Suportar `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`.
- Persistir dados em memória (array mock) respeitando `active`, `type`, `kind`, `budgetId`.

**Critério de Conclusão**:

- Fluxos de criar/editar/desativar categoria funcionam em ambiente com MSW.

#### 4. Validações de Formulário e Regras de Negócio [⏳]

**Descrição**:  
Implementar:

- Nome obrigatório (mínimo de caracteres, se aplicável).
- Unicidade de nome por orçamento:
  - Case-insensitive.
  - Não ignorar espaços/sinais.
  - Considerando preset + custom.
- Tratamento de soft delete:
  - Categorias inativas não aparecem nas listas de seleção de novas transações.
  - Mantidas em relatórios/históricos (onde implementado).

**Critério de Conclusão**:

- Formulário de categorias impede duplicidades conforme regra.
- Estado de categoria inativa reflete corretamente na UI.

#### 5. Acessibilidade, Responsividade e Testes Finais [⏳]

**Descrição**:  
Revisar:

- Navegação por teclado em `/categories`.
- ARIA em botões e listas principais.
- Comportamento responsivo (sem scroll horizontal).
- Testes:
  - Aumentar cobertura em `CategoriesPage`, `CategoryState`, `CategoriesApiService`.
  - Se possível, adicionar testes de acessibilidade básicos.

**Critério de Conclusão**:

- Critérios de UI/A11y de `layout-specification.md` atendidos.
- Cobertura de testes da feature próxima ou acima de 80%.

### 🔄 Dependências

- ✅ Fase 1 completada.
- ✅ Fase 2 completada.
- ✅ Fase 3 completada.

### 📝 Comentários da Fase

_[Observações sobre decisões tomadas]_

---

## 📅 FASE 5 (Opcional / Extensões Futuras): Integração com Dashboard e Relatórios [Status: ⏳]

### 🎯 Objetivo

Preparar e/ou conectar o sistema de categorias a dashboards, relatórios e envelopes (quando esses cards forem trabalhados), reaproveitando `CategoryState`.

### 📋 Tarefas

#### 1. Expor Dados de Categoria para Dashboard [⏳]

**Descrição**:  
Garantir que `CategoryState` ofereça shape adequado (tipo, cor, ícone, agrupamentos) para widgets de gasto por categoria.

#### 2. Hooks para Relatórios e Envelopes [⏳]

**Descrição**:  
Adicionar APIs/métodos auxiliares que facilitem:

- Agrupamento de transações por categoria.
- Uso de categorias para envelopes (limites de gastos).

### 🏁 Entrega Final

- [ ] Todos os testes passando (incluindo novos de categorias).
- [ ] Documentação da sessão (`context.md`, `architecture.md`, `layout-specification.md`, `plan.md`) atualizada em caso de ajustes.
- [ ] Pronto para PR conforme critérios de aceitação da issue OS-236.
