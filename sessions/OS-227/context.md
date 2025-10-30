# OS-227 - Contexto de Desenvolvimento

# [OS-227](https://orca-sonhos.atlassian.net/browse/OS-227)

## 🎯 Objetivo

Implementar a feature de Transações (Transactions) com DTOs alinhados ao backend, serviço de API localizado na própria feature (seguindo o padrão da Dashboard), estado com signals/computed e UI baseada em cards com listagem, filtros e formulário reativo, integrando a navegação com Dashboard e Budget. O objetivo é permitir que usuários registrem, consultem e gerenciem transações (receitas, despesas e transferências) por orçamento, com status temporal correto e filtros úteis.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- DTOs: `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionDto` (alinhados ao backend).
- Serviço de API (na feature) para transações: listar, criar, atualizar, excluir, cancelar agendada, marcar como atrasada.
- Estado: signals + computed (totais, contagens, derivação por status).
- UI em cards: listagem com filtros, formulário reativo com validações, card e detalhes.
- Roteamento: rota lazy `/transactions`; breadcrumbs apenas se já houver padrão implementado; links a partir de Dashboard e Budget Detail.
- Integrações de navegação: item na sidebar, atalhos no Dashboard, link em Budget Detail.

### Comportamentos Esperados

- Criação exige: `userId`, `description`, `amount`, `type`, `accountId`, `categoryId`, `budgetId`; `transactionDate` opcional.
- Status inicial determinado pelo backend via `transactionDate`:
  - Futuro: Scheduled
  - Passado: Overdue
  - Hoje: Scheduled
- Mutações: `mark-transaction-late`, `cancel-scheduled-transaction`, `delete-transaction`.
- Listagem paginada (GET `/transactions`) com `meta.hasNext`; ordenação por data desc (servidor).
- Filtros server-side: `budgetId` (obrigatório), `accountId`, `categoryId`, `dateFrom`, `dateTo`.
- Filtros client-side: `type`, `amount`.
- Paginação padrão: `page=1`, `pageSize=20` (alinhado com MSW/backend; limite 100).

## 🏗️ Considerações Técnicas

### Arquitetura

- Clean Architecture (Models, Application, Shared Core, Adapters/Infra) com Either para erros.
- Angular 20+ com componentes standalone, signals e `ChangeDetectionStrategy.OnPush`.
- Entidades/VOs imutáveis com factories (`create`, `fromJSON`).

### Tecnologias e Dependências

- Angular (standalone, signals, `@if`, `@for`, `@switch`).
- Angular Material conforme necessidade da UI.
- Either (`@either`).

### Padrões a Seguir

- Sem `@HostBinding`/`@HostListener`; usar `host` no decorator.
- Sem `ngClass`/`ngStyle`; usar `class`/`style` bindings.
- `NgOptimizedImage` quando aplicável.
- TypeScript estrito.

## 🧪 Estratégia de Testes

### Testes Necessários

- Serviços de API (feature): cobertura alta (sucesso/erro, paginação e filtros).
- Estado: computed de totais/contagens/status e transições.
- Componentes em cards: listagem, filtros, formulário (validações/interações) e acessibilidade.

### Critérios de Aceitação

- [ ] CRUD funcional com validações e tratamento de erros
- [ ] Filtros server-side e client-side (type, amount) operacionais
- [ ] Cobertura de testes: serviços 100%, componentes > 80%
- [ ] Acessibilidade básica e UI responsiva
- [ ] MSW em dev consistente com endpoints do backend

## 🔗 Dependências e Impactos

### Sistemas Afetados

- Dashboard (atalhos), Budget Detail (link com `budgetId`), Sidebar (nova entrada), camada de serviços da própria feature e possivelmente modelos relacionados.

### Integrações Necessárias

- Endpoints backend:
  - GET `/transactions` (params: `budgetId`, `page`, `pageSize`, `accountId`, `categoryId`, `dateFrom`, `dateTo`)
  - POST `/transaction/create-transaction`
  - POST `/transaction/update-transaction`
  - POST `/transaction/delete-transaction`
  - POST `/transaction/cancel-scheduled-transaction`
  - POST `/transaction/mark-transaction-late`
- Referência MSW: `src/app/core/mocks/handlers/transactions.handlers.ts`

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Sem feature flag.
- Categorias/Contas na UI ainda não implementadas: consumir endpoints do backend para selects; fallback com mensagem se indisponíveis.

### Riscos

- Dependência de endpoints de categorias/contas para selects; mitigar com fallback e follow-up.
- Paginação e ordenação devem respeitar `meta.hasNext` e ordenação desc por data.

## 📚 Referências

- Issue/Card: [OS-227](https://orca-sonhos.atlassian.net/browse/OS-227)
- Especificação técnica: `sessions/OS-227/architecture.md`
- Arquitetura do projeto: `CLAUDE.md`
- Meta Specs: `/home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs`
