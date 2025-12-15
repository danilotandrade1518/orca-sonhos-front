# Sistema de Categorias - Contexto de Desenvolvimento

# OS-236

## 🎯 Objetivo

Implementar um **sistema completo de categorias** para organização de transações, substituindo mocks atuais por uma implementação real integrada ao backend, estados reativos e UI existente. O objetivo é permitir que cada orçamento tenha suas próprias categorias (preset + customizadas), usadas em transações e preparadas para uso em dashboard e futuros envelopes, garantindo uma experiência consistente, performática e alinhada aos padrões do projeto.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **CRUD de Categorias**: Criar, listar, editar, desativar e (quando permitido) excluir categorias.
- **Categorias Preset e Customizadas**:
  - Categorias **preset** fornecidas pelo sistema (ex.: alimentação, transporte, saúde, etc.).
  - Categorias **customizadas** criadas pelo usuário conforme necessidades específicas.
- **Escopo por Orçamento**:
  - Cada **orçamento** possui suas próprias categorias, transações e metas.
  - Seed automático de categorias preset sempre que um **novo orçamento** é criado (segunda opção indicada).
- **Integração com Transações**:
  - Seleção obrigatória de categoria ao criar/editar transações.
  - Uso de categorias “reais” (estado + API), substituindo opções mockadas.
- **Preparação para Dashboard e Relatórios**:
  - Expor metadados de categoria (tipo, cor, ícone, ativo/inativo) para widgets de gasto por categoria e análises futuras.
- **Gerenciamento via UI Dedicada**:
  - Página de gerenciamento de categorias (`/categories`) com lista, filtros (preset/custom, status, tipo) e busca.
  - Flow de criação/edição de categoria em formulário dedicado.

### Comportamentos Esperados

- **Seed de Categorias Preset**:
  - Ao criar um novo orçamento, o sistema cria automaticamente um conjunto padrão de categorias preset para aquele orçamento.
  - Categorias preset são reutilizadas como modelo, mas o seed gera registros próprios por orçamento.
- **Validação de Nome**:
  - Nome de categoria é **obrigatório**.
  - Nome deve ser **único por orçamento**, com regras:
    - Comparação **case-insensitive** (ex.: `Alimentação` = `ALIMENTAÇÃO` = `alimentação`).
    - Não ignorar espaços/sinais (acentos e espaços diferenciam nomes).
    - Unicidade considerada em conjunto para **preset + custom** dentro do mesmo orçamento.
- **Soft Delete / Desativação**:
  - Categorias já utilizadas em transações **não são removidas fisicamente**.
  - Operação de “exclusão” deve atuar como **soft delete** com flag (ex.: `active = false` ou campo equivalente).
  - Categorias inativas:
    - Continuam aparecendo em transações históricas e relatórios.
    - Não podem ser selecionadas em novas transações.
- **Filtragem por Tipo**:
  - Categorias possuem tipo (`income`, `expense`, `transfer`), alinhado aos mocks e ao `os-category-manager`.
  - Requisito de negócio/UX de vincular estritamente tipo de categoria ao tipo de transação **não está totalmente definido nas Meta Specs**; a solução assumirá a regra padrão:
    - Transações de **receita** usam categorias de tipo **income**.
    - Transações de **despesa** usam categorias de tipo **expense**.
    - Transações de **transferência** usam categorias de tipo **transfer**.
  - Esta associação será tratada como **assunção de arquitetura** e destacada na documentação técnica para validação.
- **UI Responsiva e Acessível**:
  - Telas de categorias seguem padrões de responsividade e acessibilidade do design system (WCAG 2.1 AA).

## 🏗️ Considerações Técnicas

### Arquitetura

- **DTO-First + Clean Architecture**:
  - Criação de DTOs específicos de categoria em `src/dtos/category/`, alinhados aos contratos do backend.
  - Uso consistente dos padrões já existentes em `dtos/account` como referência.
- **Camada de Serviços Core**:
  - Implementação de `CategoriesApiService` em `core/services/category/` para operações de lista, criação, atualização e soft delete.
  - Integração com `ApiService` e `AuthService`, seguindo o padrão de tratamento de erro (Either/monad) definido em `@either` e nos serviços existentes.
- **Estado Reativo com Signals**:
  - Implementação de `CategoryState` em `core/services/category/` com:
    - Signals básicos: `categories`, `loading`, `error`.
    - Computeds: `categoriesByBudgetId`, `presetCategories`, `customCategories`, `activeCategories`, `inactiveCategories`.
  - Integração com `BudgetSelectionService` para contextualizar categorias por orçamento selecionado.
- **PresetCategoriesService**:
  - Serviço responsável por:
    - Definir catálogo de categorias preset por tipo (`INCOME`, `EXPENSE`, `TRANSFER`).
    - Orquestrar o seed de categorias ao criar um novo orçamento.
- **Feature Categories**:
  - Nova feature `categories` em `src/app/features/categories/` para encapsular:
    - `CategoryListComponent` (lista, filtros, busca).
    - `CategoryFormComponent` (criação/edição de categoria).
    - Rotas e orquestração da navegação.
- **Integração com TransactionFormComponent**:
  - Atualização de `TransactionFormComponent` para deixar de depender de `categoryOptions` mockados.
  - Passar a consumir categorias a partir de `CategoryState`/serviços, filtradas por orçamento e possivelmente por tipo de transação.
- **MSW (Mock Service Worker)**:
  - Ampliação dos handlers existentes em `categories.handlers.ts` para suportar CRUD completo, alinhado aos DTOs reais de categoria.

### Tecnologias e Dependências

- **Angular 20+** com:
  - Standalone components.
  - Signals para estado local.
  - Reactive Forms para formulários.
- **Infra existente**:
  - `ApiService` para chamadas HTTP.
  - `AuthService` para autenticação e headers.
  - `BudgetSelectionService` para contexto de orçamento.
  - `NotificationService` para feedback ao usuário.
  - MSW para mocks em ambiente de desenvolvimento/testes.

### Padrões a Seguir

- Seguir Meta Specs de **frontend architecture**, **code-standards** e **angular-modern-patterns**:
  - Uso de signals para state.
  - DTOs tipados e separados em `/dtos/category`.
  - Separação de concerns: API service vs state vs UI.
  - Rotas lazy-loaded para a feature `categories`.
- Seguir padrões de **nomenclatura** e estrutura de features (`features/{feature-name}/components|pages|services|state|types|...`), adaptados ao setup atual do projeto.
- Garantir:
  - `ChangeDetectionStrategy.OnPush` nos componentes novos.
  - Inputs/outputs via `input()`/`output()` (Angular moderno).

## 🧪 Estratégia de Testes

### Testes Necessários

- **DTOs e Serviços**:
  - Testes unitários para `CategoriesApiService` (sucesso, erro, mapeamento de DTOs).
  - Testes unitários para `CategoryState` (carregamento, criação, atualização, soft delete, computed signals).
- **UI e Fluxos de Uso**:
  - Testes de componentes `CategoryListComponent` e `CategoryFormComponent`:
    - Renderização básica.
    - Validações de formulário (nome obrigatório, unicidade simulada).
    - Interações de filtros e busca.
  - Testes de integração leve com `TransactionFormComponent` para garantir uso correto de categorias reais.
- **MSW**:
  - Atualizar e testar handlers de categorias com CRUD completo.

### Critérios de Aceitação

- [ ] DTOs de categoria criados em `src/dtos/category/` alinhados com backend.
- [ ] `CategoriesApiService` implementado com métodos CRUD completos.
- [ ] `CategoryState` implementado com signals e computeds conforme descrição.
- [ ] `PresetCategoriesService` definido e seed automático funcionando para novos orçamentos.
- [ ] Página `/categories` com lista, filtros, busca e ações básicas (editar, desativar/excluir, duplicar).
- [ ] `TransactionFormComponent` integrado com categorias reais e mensagens adequadas quando não houver categorias.
- [ ] Handlers MSW atualizados para CRUD completo de categorias.
- [ ] Validações de formulário implementadas (nome obrigatório, unicidade por orçamento).
- [ ] Cobertura de testes unitários > 80% nos artefatos novos/alterados.
- [ ] UI responsiva e acessível, alinhada ao design system e às Meta Specs.

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Frontend**:
  - Feature de transações (`TransactionFormComponent` e serviços associados).
  - Dashboard (consumo futuro de categorias para widgets de gasto por categoria).
  - Fluxo de criação de orçamento (seed de categorias preset).
- **Backend**:
  - Endpoints de categorias (CRUD e possivelmente filtros por orçamento/tipo).

### Integrações Necessárias

- Integração entre `CategoryState` e `BudgetSelectionService` para filtrar categorias por orçamento.
- Integração entre `TransactionFormComponent` e `CategoryState` para seleção de categorias.
- Integração entre handlers MSW e os contratos dos endpoints reais de categorias.

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Não há ainda **referência de UI Figma**; a UI será baseada:
  - Nos componentes existentes do design system (e no organismo genérico `os-category-manager`).
  - Nas convenções de layout e responsividade já aplicadas em outras features.
- O backend deve estar alinhado aos DTOs definidos; caso haja divergência, será necessário ajuste fino posterior.

### Riscos

- **Associação tipo de categoria ↔ tipo de transação**:
  - As Meta Specs não trazem regra explícita; a solução inicial usará a associação natural (INCOME/EXPENSE/TRANSFER), mas isso pode precisar de ajuste se o produto decidir flexibilizar.
- **Seed de categorias por orçamento**:
  - É necessário coordenar com o fluxo de criação de orçamento para evitar seeds duplicados ou inconsistentes.
- **Soft delete**:
  - Requer atenção para não quebrar consultas e filtros (ex.: excluir de listas de seleção, mas manter em relatórios).

## 📚 Referências

- Issue/Card Jira: OS-236 - “Sistema de Categorias”.
- Meta Specs:
  - `business/03_funcionalidades_core.md` (conceito de orçamentos, categorias e gastos por categoria).
  - `technical/frontend-architecture/feature-examples.md` (padrões de state e tipos).
  - `technical/code-standards/*` e `technical/frontend-architecture/angular-modern-patterns.md`.
- Código existente:
  - `src/app/core/mocks/handlers/categories.handlers.ts` (mocks atuais de categorias).
  - `src/app/shared/ui-components/organisms/os-category-manager/os-category-manager.component.ts` (organismo de UI genérico).
  - `src/app/features/transactions/components/transaction-form/transaction-form.component.ts` (uso atual de categorias em transações).
  - `src/dtos/account/*` e `AccountState` (padrões de DTOs e estado).







