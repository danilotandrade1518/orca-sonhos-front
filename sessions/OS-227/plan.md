# Transações (OS-227) - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar a feature de Transações com DTOs alinhados ao backend, serviço de API na feature, estado com signals/computed, listagem em cards com filtros (server-side + client-side), formulário reativo em modal e integrações de navegação, seguindo o Design System e especificações de layout e acessibilidade.

## 🎯 Objetivos

- Entregar uma página `/transactions` funcional, responsiva e acessível
- Garantir consistência com DS (os-\*) e padrões de arquitetura
- Cobertura de testes: serviços 100%, componentes > 80%

---

## 📅 FASE 1: Fundamentos e Infra da Feature [Status: Completada ✅]

### 🎯 Objetivo

Criar estrutura base da feature (rotas, DTOs, serviço de API) e preparar mocks/contratos.

### 📋 Tarefas

#### Criar DTOs e contratos [✅]

**Descrição**: `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionDto`, `ListTransactionsResponseDto` em `src/dtos/transaction/`.
**Critério de Conclusão**: Tipos exportados, alinhados ao backend, usados no serviço.

#### Criar serviço de API da feature [✅]

**Descrição**: `services/transactions-api.service.ts` injetando `ApiService` com endpoints: list, create, update, delete, cancel scheduled, mark late.
**Critério de Conclusão**: Métodos implementados, tipados com DTOs, tratamento via Either.

#### Adicionar rota lazy e página base [✅]

**Descrição**: Adicionar rota `/transactions` (lazy) e `pages/transactions/transactions.page.ts` com template mínimo e header.
**Critério de Conclusão**: Navegação para a página funciona; lazy confirmada.

#### MSW/Contrato e fixtures [✅]

**Descrição**: Validar/ajustar handlers MSW para transações; fixtures mínimas para lista/paginação.
**Critério de Conclusão**: Dev server retorna dados coerentes com DTOs e paginação.

### 🧪 Critérios de Validação

- [ ] Build ok e rota `/transactions` acessível
- [ ] Serviço de API responde com tipos corretos (tipagem estrita)
- [ ] MSW alinha com paginação (`meta.hasNext`) e filtros

### 📝 Comentários da Fase

- DTOs criados em `src/dtos/transaction/` com barrel exportado em `src/dtos/index.ts`.
- Serviço `TransactionsApiService` implementado na feature com endpoints list/create/update/delete/cancel/markLate.
- Rota lazy `/transactions` adicionada em `app.routes.ts` e `TransactionsPage` criada.
- Build validado com sucesso (`ng build`), gerando chunks lazy da página/rotas.

---

## 📅 FASE 2: Estado e Listagem (Cards) [Status: ⏳]

### 🎯 Objetivo

Implementar estado com signals/computed e listagem em cards reutilizando `os-transaction-list`.

### 📋 Tarefas

#### Implementar estado da feature [⏳]

**Descrição**: Signals para dados, loading, error; computed para totais/contagens/status; persistência leve de filtros na sessão.
**Critério de Conclusão**: Derivações corretas, sem mutações diretas, `OnPush` pronto.

#### Listagem com paginação/infinite [⏳]

**Descrição**: Integrar `os-transaction-list` com dados e paginação do backend; fallback de "Carregar mais"; estados loading/empty/error.
**Critério de Conclusão**: Lista carrega, paginação funciona, estados exibidos conforme spec.

#### Filtros server-side + client-side [⏳]

**Descrição**: Campos: `budgetId` (obrigatório), `accountId`, `categoryId`, `dateFrom`, `dateTo`; client-side: `type`, `amount`.
**Critério de Conclusão**: Query string correta; filtros locais aplicados sem re-fetch desnecessário.

### 🧪 Critérios de Validação

- [ ] `os-transaction-list` renderiza e responde a paginação
- [ ] Filtros server-side e client-side operacionais
- [ ] Estados loading/empty/error conforme layout-spec

### 📝 Comentários da Fase

\_

---

## 📅 FASE 3: Formulário Reativo (Modal) [Status: ⏳]

### 🎯 Objetivo

Implementar criação/edição com formulário reativo acessível em modal (`os-form-template`).

### 📋 Tarefas

#### Componentizar `transaction-form` [⏳]

**Descrição**: Reactive Forms, validações, mensagens de erro, máscaras/formatadores de `amount`.
**Critério de Conclusão**: Validações e mensagens acessíveis, integração com DS.

#### Fluxos de criar/editar [⏳]

**Descrição**: Abrir modal, salvar/cancelar, atualizar lista/estado, toasts de sucesso/erro.
**Critério de Conclusão**: CRUD de create/update funcional e testável.

### 🧪 Critérios de Validação

- [ ] Form acessível (labels, aria, foco, `aria-live` para erros)
- [ ] Estados de loading em botão/ação
- [ ] Atualização da lista/estado após salvar

### 📝 Comentários da Fase

\_

---

## 📅 FASE 4: Ações de Mutações e UX [Status: ⏳]

### 🎯 Objetivo

Implementar ações rápidas: marcar atrasada, cancelar agendada, excluir; confirmações e feedback.

### 📋 Tarefas

#### Ações rápidas nos cards [⏳]

**Descrição**: Menu de contexto/ações no `os-transaction-list`; confirmações com `os-modal-template`.
**Critério de Conclusão**: Ações executam chamadas, atualizam estado, feedbacks visíveis.

#### Otimizações de estado/performance [⏳]

**Descrição**: Evitar re-renders; memoização/computed; evitar over-fetch; debounce em filtros.
**Critério de Conclusão**: Perf fluida em listas com muitos itens.

### 🧪 Critérios de Validação

- [ ] Ações executadas com confirmações e feedback
- [ ] Estado consistente após sucesso/erro

### 📝 Comentários da Fase

\_

---

## 📅 FASE 5: Responsividade, A11y e Integrações [Status: ⏳]

### 🎯 Objetivo

Refinar responsividade, acessibilidade e integrações de navegação.

### 📋 Tarefas

#### Responsividade por breakpoint [⏳]

**Descrição**: Aplicar ajustes mobile/tablet/desktop conforme `layout-specification.md` (gaps, colunas, filtros visíveis/colapsáveis).
**Critério de Conclusão**: Sem scroll horizontal; touch targets >= 44px; grid por breakpoint.

#### Acessibilidade avançada [⏳]

**Descrição**: Landmarks, foco visível, ordem de tab, `aria-live` para loading/erros, atalhos (Esc, `/`).
**Critério de Conclusão**: WCAG 2.1 AA atendido nos principais fluxos.

#### Integrações de navegação [⏳]

**Descrição**: Link/atalho no Dashboard e Budget Detail; item na Sidebar.
**Critério de Conclusão**: Navegação contextual funcionando com `budgetId`.

### 🧪 Critérios de Validação

- [ ] Mobile-first e breakpoints validados
- [ ] Navegação e atalhos funcionais
- [ ] Checagem de contraste e foco

### 📝 Comentários da Fase

\_

---

## 📅 FASE 6: Testes, Cobertura e Hardening [Status: ⏳]

### 🎯 Objetivo

Consolidar qualidade com testes, ajustes finais e documentação.

### 📋 Tarefas

#### Testes de serviços (100%) [⏳]

**Descrição**: Sucesso/erro/paginação/filtros e mutações.
**Critério de Conclusão**: 100% coverage em serviços.

#### Testes de componentes (>80%) [⏳]

**Descrição**: Estado, listagem, filtros, formulário e interações; MSW em dev.
**Critério de Conclusão**: >80% coverage e cenários críticos cobertos.

#### Documentação e clean-ups [⏳]

**Descrição**: Atualizar README/guia de navegação; revisar acessibilidade e performance.
**Critério de Conclusão**: Sem lints; docs atualizadas; pronto para PR.

### 🏁 Entrega Final

- [ ] Todos os testes passando (CI local)
- [ ] Documentação atualizada
- [ ] Pronto para PR
