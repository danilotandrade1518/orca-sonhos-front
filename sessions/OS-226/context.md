# Budgets - Contexto de Desenvolvimento

# OS-226

## 🎯 Objetivo

Implementar o domínio de Budgets no frontend com DTOs, serviço, estado e UI, e integrar com Dashboard e AppBar, permitindo lista, criação, edição, exclusão e navegação ao detalhe, alinhado aos contratos do backend e mocks atuais.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- Lista de orçamentos do usuário autenticado
- Criação, edição e exclusão de orçamento
- Estado com signals e computed para loading/erro/lista/seleção
- Integração com Dashboard (widget “Resumo do Orçamento”) e AppBar (seletor)

### Comportamentos Esperados

- Filtros básicos client-side na listagem: período (mês/ano), status (ativo/arquivado), texto (nome)
- Clique no widget “Resumo do Orçamento” navega para `/budgets/:id` do orçamento selecionado
- Botão “Adicionar Orçamento” no seletor da AppBar abre `/budgets/new` (via modal)
- Selecionar automaticamente o primeiro orçamento da lista quando disponível

## 🏗️ Considerações Técnicas

### Arquitetura

- Angular 20+, componentes standalone, signals, ChangeDetectionStrategy.OnPush
- Clean Architecture (DTOs, serviços, estado, UI, rotas)
- Erros tratados com padrão Either associado ao `ApiService`

### Tecnologias e Dependências

- ApiService/ConfigService existentes
- MSW para mocks de endpoints
- Design System: `os-button`, `os-card`, `os-input`, `os-form-field`, `os-budget-selector`

### Padrões a Seguir

- Standalone components, inputs/outputs com `input()`/`output()`
- Signals para estado local, `computed()` para derivação
- Sem `@HostBinding`/`@HostListener`; bindings no objeto `host`
- OnPush em componentes

## 🧪 Estratégia de Testes

### Testes Necessários

- Serviço BudgetService: 100% cobertura (métodos happy path e erros)
- Estado BudgetState: 100% cobertura (transições e computed)
- Componentes: ≥ 80% cobertura (lista, form, card, detail, rotas e modal)

### Critérios de Aceitação

- [ ] Lista orçamentos via serviço/estado
- [ ] Cria orçamento com validação de obrigatórios
- [ ] Edita orçamento existente
- [ ] Exclui orçamento com confirmação
- [ ] Filtros básicos funcionam (período, status, texto) client-side
- [ ] Clique em “Resumo do Orçamento” abre `/budgets/:id` do selecionado
- [ ] Botão “Adicionar Orçamento” no seletor abre modal de criação (`/budgets/new` via modal)
- [ ] Loading e erro visíveis e consistentes
- [ ] Cobertura de testes: serviço/estado 100%, componentes ≥ 80%

## 🔗 Dependências e Impactos

### Sistemas Afetados

- `DashboardWidgetsComponent` (onWidgetClick)
- `AppLayoutComponent` (seletor no header)
- `BudgetSelectionService` (seleção e lista disponíveis)

### Integrações Necessárias

- Endpoints (mocks/back):
  - GET `/api/budget` (lista) [mock]
  - GET `/api/budget/:budgetId/overview` (overview) [mock]
  - POST `/api/budget/create-budget` [mock/back]
  - POST `/api/budget/update-budget` [mock/back]
  - POST `/api/budget/delete-budget` [mock/back]
- Backend swagger disponível em `orca-sonhos-back/src/swagger.json`

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Filtros client-side nesta fase
- Modal preferido para criação/edição (sem navegação dedicada da AppBar)

### Riscos

- Divergência entre mocks e contratos backend (validar sempre contra swagger)
- Estados de seleção vs exclusão (evitar inconsistência; re-selecionar primeiro item quando necessário)

## 📚 Referências

- Issue/Card: OS-226 (Jira)
- Especificação: descrição no ticket OS-226
- Arquitetura: meta specs em `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- Backend Swagger: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-back/src/swagger.json`
