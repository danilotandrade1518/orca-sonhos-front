# OS-227 - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- Projeto Angular 20+ com Clean Architecture (Models, Application, Shared Core), componentes standalone, SSR configurado, Material disponível, testes com vitest.
- Tratamento de erros via Either; entidades/VOs imutáveis com factories (`create`/`fromJSON`).
- Features existentes de Dashboard e Budget com navegação e guards de Auth.

### Mudanças Propostas

- DTOs de transações (request/response) alinhados ao backend.
- Serviço de API para transações criado dentro da própria feature (padrão Dashboard), usando `ApiService`.
- Estado local com signals e computed para totais/contagens/status.
- UI de transações: listagem em cards com filtros (server-side + client-side), formulário reativo, card e detalhes.
- Rota lazy `/transactions`, breadcrumbs condicionais (usar apenas se já houver padrão implementado), integrações de navegação (sidebar, Dashboard, Budget Detail com `budgetId`).

### Impactos

- Nova feature `transactions` (rotas, componentes, estado) e extensão da camada de API em nível de feature.
- Integrações de navegação com Dashboard e Budget; possível atualização da Sidebar.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/app.routes.ts` (adição de rota lazy para `/transactions`).
- `src/app/features/dashboard/...` e `src/app/features/budget/...` (links/atalhos quando aplicável).

### Novos Arquivos a Criar

- DTOs (novo diretório):
  - `src/dtos/transaction/create-transaction.dto.ts`
  - `src/dtos/transaction/update-transaction.dto.ts`
  - `src/dtos/transaction/transaction.dto.ts`
  - `src/dtos/transaction/list-transactions.response.dto.ts` (lista + meta)
- Serviço de API (na feature, seguindo padrão do Dashboard):
  - `src/app/features/transactions/services/transactions-api.service.ts`
- Estado e Feature UI (cada page/component no seu próprio diretório):
  - `src/app/features/transactions/transactions.routes.ts`
  - `src/app/features/transactions/pages/transactions/transactions.page.ts`
  - `src/app/features/transactions/components/transactions-filters/transactions-filters.component.ts`
  - `src/app/features/transactions/components/transactions-cards/transactions-cards.component.ts`
  - `src/app/features/transactions/components/transaction-form/transaction-form.component.ts`
  - `src/app/features/transactions/components/transaction-card/transaction-card.component.ts`
  - `src/app/features/transactions/components/transaction-detail/transaction-detail.component.ts`

### Estrutura de Diretórios

- `src/dtos/transaction/` para DTOs e contratos de lista.
- `src/app/features/transactions/services/` para serviço de transações.
- `src/app/features/transactions/` para rotas, páginas e componentes.
- Padrão: cada page/component em diretório próprio (kebab-case) com arquivo principal homônimo.

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- Clean Architecture com separação de camadas e uso de ports/adapters quando necessário.
- Either para controle de erro ao invés de exceções.
- Componentes standalone, signals, `OnPush`, controle de fluxo nativo (`@if/@for/@switch`).

### Decisões Arquiteturais

- **Decisão**: Serviço de API localizado na feature, injetando `ApiService` (mesmo padrão do Dashboard).
- **Alternativas**: Serviço centralizado em `core/services/api`.
- **Justificativa**: Alta coesão por domínio e melhor encapsulamento da feature.

## 📦 Dependências e Integrações

### Dependências Existentes

- Angular, Angular Material, MSW em dev, SSR, Either, Auth/guards, Budget.

### Novas Dependências

- Não previstas.

### Integrações

- Endpoints backend:
  - GET `/transactions` (params: `budgetId`, `page`, `pageSize`, `accountId`, `categoryId`, `dateFrom`, `dateTo`)
  - POST `/transaction/create-transaction`
  - POST `/transaction/update-transaction`
  - POST `/transaction/delete-transaction`
  - POST `/transaction/cancel-scheduled-transaction`
  - POST `/transaction/mark-transaction-late`
- Referência MSW: `src/app/core/mocks/handlers/transactions.handlers.ts` (default `page=1`, `pageSize=20`, limite 100).

## 🔄 Fluxo de Dados

- UI (cards) → Estado (signals/computed) → Serviço de API da feature → Backend.
- Responses → DTOs → Either (success/failure) → Estado/UI.
- Filtros server-side na query string; filtros client-side (type/amount) aplicados no estado/UI.
- Paginação padrão: `page=1`, `pageSize=20` (alinhar com MSW/backend).

## 🧪 Considerações de Teste

### Testes Unitários

- Serviços de API (todos endpoints, cenários de sucesso/erro, paginação/meta).
- Estado (signals/computed) com cenários de filtros e agregações.

### Testes de Integração

- Fluxos de UI com MSW simulando backend e navegabilidade.

### Mocks e Fixtures

- Fixtures de DTOs (create/update/transaction/list) e responses com `meta.hasNext`.
- Mocks de erros e timeouts para robustez.

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- Filtros client-side (type/amount) implementados localmente até extensão no backend.

### Riscos Identificados

- Dependência de endpoints de categorias/contas para selects; mitigar com fallback e mensagens claras.
- Possível desalinhamento de paginação/ordenção; garantir contrato e testes com MSW.

## 📋 Lista de Implementação

- [ ] Criar DTOs em `src/dtos/transaction/`
- [ ] Criar `services/transactions-api.service.ts` na feature
- [ ] Implementar estado (signals/computed) da feature
- [ ] Criar rota lazy `/transactions` e página principal
- [ ] Integrar navegação (sidebar, Dashboard, Budget Detail)
- [ ] Adicionar testes (serviços 100%, componentes > 80%) e MSW
- [ ] Ativar breadcrumbs apenas se já houver padrão implementado

### UI Components

- [ ] Implementar `pages/transactions/transactions.page.ts` conforme layout-specification
- [ ] Implementar `components/transactions-filters/transactions-filters.component.ts`
- [ ] Implementar `components/transaction-form/transaction-form.component.ts`
- [ ] Reutilizar `os-transaction-list` para cards ou criar `transactions-cards`
- [ ] Aplicar responsividade (mobile/tablet/desktop) e estados (loading/empty/error)
- [ ] Implementar acessibilidade (ARIA, teclado, foco visível)

## 🎨 UI Components and Layout

### Design System Integration

Reuso de `os-page-header`, `os-filter-bar`, `os-transaction-list`, `os-form-template`, `os-modal-template`, além de átomos (`os-button`, `os-icon`, `os-badge`, `os-label`, `os-spinner`). Layout mobile-first em cards com filtros, formulário reativo em modal e paginação/infinite scroll.

### New Components Required

Sem novos componentes de Design System nesta fase. Novos componentes permanecem escopados à feature (filters/form/cards) conforme `layout-specification.md`.

### Layout Architecture

Página `/transactions` com header, filtros (collapsible em mobile), lista de cards e footer com paginação/infinite. Integra `BudgetSelectionService` para contexto de orçamento. Estados e interações seguindo DS e WCAG 2.1 AA.

### Performance Considerations

Rota lazy, `OnPush`, signals/computed, reuso de DS para minimizar bundle. CSS crítico enxuto e sem reflows visíveis.

Detalhes completos em: `sessions/OS-227/layout-specification.md`

## 📚 Referências

- Meta Specs: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
- Documentação Angular (20+)
- Padrões do repositório: `CLAUDE.md`
- Issue: [OS-227](https://orca-sonhos.atlassian.net/browse/OS-227)
