# Padronização de layout e UI com DS - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Executar a padronização visual e de interação em todo o app aplicando o Design System `os-*`, iniciando por fundações (containers e grids), migração de botões, filtros padronizados, unificação de cards/listas, centralização do locale `pt-BR` e estados de UI, seguido de passes por página. Fases de ~2h, incrementais e testáveis.

## 🎯 Objetivos

- Unificar layout (estrutura, espaçamentos, grids) e interações (`os-button`, filtros, cards/listas)
- Corrigir formatação `pt-BR` centralmente
- Elevar acessibilidade (WCAG 2.1 AA) e responsividade
- Reduzir dívidas visuais e facilitar manutenção

---

## 📅 FASE 1: Fundações de Layout (os-page, os-page-header, os-grid) [Status: ✅]

### 🎯 Objetivo

Introduzir containers base e padronizar espaçamentos, removendo estilos inline de layout no Dashboard.

### 📋 Tarefas

#### Adotar os-page e os-page-header no Dashboard [✅]

**Descrição**: Encapsular a página com `os-page` e usar `os-page-header` (título/descrição/ações).  
**Critério de Conclusão**: Header visível; H1 único; ações primária/secundária padronizadas.

#### Substituir estilos inline de grid por tokens/os-grid [✅]

**Descrição**: Remover `grid-area`/inline styles em widgets; usar `os-grid/os-widget-grid` e tokens de espaçamento.  
**Critério de Conclusão**: Sem estilos inline de layout; gaps/paddings via tokens; sem regressão visual relevante.

### 🧪 Critérios de Validação

- [x] `os-page-header` aplicado
- [x] Inline styles de layout removidos
- [x] Spacing consistente por tokens
- [x] Sem warnings SSR/hidratação

### 📝 Comentários da Fase

- **Componente `os-page` criado**: Wrapper de página padronizado com espaçamentos verticais responsivos por breakpoint
- **Dashboard migrado**: Agora usa `os-page` e `os-page-header` ao invés de classes customizadas
- **Estilos inline removidos**: Substituídos `[style.grid-column]` e `[style.grid-row]` por classes CSS no SCSS do componente `os-dashboard-widgets`
- **Grid system**: Grid já estava usando tokens de espaçamento, apenas removemos estilos inline

---

## 📅 FASE 2: Migração de Botões para os-button [Status: ✅]

### 🎯 Objetivo

Eliminar uso de `mat-button` nas páginas/containers; padronizar variantes/tamanhos.

### 📋 Tarefas

#### Auditoria e refactor de botões em Dashboard e Orçamentos [✅]

**Descrição**: Mapear `mat-` em botões e substituir por `os-button`; ajustar variantes/sizes; `aria-label` em ícone-only.  
**Critério de Conclusão**: Não há `mat-*` nos botões renderizados; variantes e tamanhos consistentes.

#### Atualizar ações em headers/toolbars [✅]

**Descrição**: Garantir `os-button` em `os-page-header` e toolbars relacionados.  
**Critério de Conclusão**: Ações padronizadas; foco visível; ripple/feedback ok.

### 🧪 Critérios de Validação

- [x] Ausência de `mat-mdc-button` no DOM das páginas migradas
- [x] `aria-label` em botões ícone-only
- [x] Estados hover/focus/active consistentes

### 📝 Comentários da Fase

- **Migração concluída**: Todos os botões HTML nativos em `budget-list.page.ts` e `budget-detail.page.ts` foram migrados para `os-button`
- **Padrões aplicados**: Variantes (`primary`, `secondary`, `tertiary`, `danger`) e tamanhos (`small`, `medium`) conforme especificação
- **Ícones adicionados**: Botões agora incluem ícones apropriados (`plus`, `edit`, `trash`, `arrow-left`, `receipt`, `users`, `user-plus`)
- **Acessibilidade**: Todos os botões mantêm `aria-label` para screen readers
- **Headers verificados**: `os-page-header` e `os-header` já utilizam `os-button` corretamente
- **Dashboard**: Não havia botões HTML nativos para migrar, já utiliza `os-page-header` com `os-button`

---

## 📅 FASE 3: Filtros Padronizados (Orçamentos, Metas) [Status: ✅]

### 🎯 Objetivo

Padronizar filtros com `os-filter-bar` e campos DS.

### 📋 Tarefas

#### Implementar os-filter-bar em Orçamentos [✅]

**Descrição**: Adicionar barra de filtros com controles (`os-input`, `os-select`, date range), limpar/aplicar.  
**Critério de Conclusão**: Filtros funcionais com aria-labels; layout responsivo.

#### Implementar os-filter-bar em Metas [✅]

**Descrição**: Repetir padrão de Orçamentos, ajustando campos específicos.  
**Critério de Conclusão**: Padrão replicado; sem divergência visual.

### 🧪 Critérios de Validação

- [x] Barra com limpar/aplicar
- [x] Controles com labels e validações claras
- [x] Responsivo (mobile→desktop)

### 📝 Comentários da Fase

- **Orçamentos**: Substituídos filtros HTML nativos (`input` e `select`) por `os-filter-bar` com `os-input` e `os-select`. Implementados filtros de busca por nome e tipo (Pessoal/Compartilhado). Ações de limpar/aplicar funcionais.
- **Metas**: Adicionados filtros padronizados com `os-filter-bar`. Implementados filtros de busca por nome e filtro por prazo (Com prazo/Sem prazo/Todas). Layout responsivo aplicado.
- **Padrão aplicado**: Ambos os casos seguem o mesmo padrão visual e comportamental, garantindo consistência entre páginas.

---

## 📅 FASE 4: Unificação de Cards/Listas (Entidades) [Status: ✅]

### 🎯 Objetivo

Aplicar `os-entity-card`/`os-entity-actions` e `os-entity-list` quando aplicável.

### 📋 Tarefas

#### Padronizar lista de Metas [✅]

**Descrição**: Renderizar metas em `os-entity-card` com slots (title/meta/metrics/actions).  
**Critério de Conclusão**: Ações acessíveis; hierarquia clara; spacing por tokens.

#### Padronizar lista/grade de Orçamentos [✅]

**Descrição**: Aplicar mesma estrutura e ações contextuais com `os-entity-actions`.  
**Critério de Conclusão**: UX consistente com Metas; responsivo.

### 🧪 Critérios de Validação

- [x] Mesma estrutura visual entre entidades
- [x] Ações acessíveis via teclado
- [x] Responsividade preservada

### 📝 Comentários da Fase

- **Componentes criados**: `os-entity-card`, `os-entity-actions` e `os-entity-list` implementados conforme especificação
- **Lista de Metas**: Migrada para usar `os-entity-list`, mantendo `goal-card` específico com `os-goal-progress-card` dentro da lista padronizada
- **Lista de Orçamentos**: Migrada para usar `os-entity-list` e `budget-card` agora usa `os-entity-card` ao invés de `os-card` diretamente
- **Padrão aplicado**: Ambos os casos seguem o mesmo padrão visual e comportamental, garantindo consistência entre páginas

---

## 📅 FASE 5: Locale pt-BR Centralizado [Status: ✅]

### 🎯 Objetivo

Centralizar formatação de moeda e datas; auditar Relatórios.

### 📋 Tarefas

#### Criar LocaleService/Pipes e aplicar no app [✅]

**Descrição**: Serviço/pipes para `pt-BR` (currency, date); providers globais conforme necessário.  
**Critério de Conclusão**: Formatação unificada; remoção de ad-hoc.

#### Auditar Relatórios e páginas críticas [✅]

**Descrição**: Ajustar formatação onde divergente; garantir notações consistentes.  
**Critério de Conclusão**: Relatórios com `pt-BR` consistente.

### 🧪 Critérios de Validação

- [x] LocaleService criado com métodos de formatação centralizados
- [x] Pipes standalone criados (CurrencyPipe, DatePipe)
- [x] Relatórios migrados para usar pipes centralizados
- [x] Todos os componentes principais migrados (15 arquivos)
- [x] Currency/date uniformes em todos os componentes
- [x] Sem "R$1,370.00" (erro de locale) - formatação pt-BR garantida
- [ ] Testes unitários básicos de formatação

### 📝 Comentários da Fase

- **LocaleService criado**: Serviço centralizado em `src/app/shared/formatting/` com métodos `formatCurrency()`, `formatNumber()`, `formatDate()`, `formatDateShort()`, `formatDateLong()`, `formatDateTime()`. Suporte a múltiplas moedas (BRL, USD, EUR, GBP) e gerenciamento de locale via signals.
- **Pipes standalone**: Criados `CurrencyPipe` (`osCurrency`) e `DatePipe` (`osDate`) para uso em templates.
- **Relatórios migrados**: Página de relatórios agora usa `CurrencyPipe` centralizado ao invés do `CurrencyPipe` do Angular, garantindo formatação pt-BR consistente.
- **Componentes migrados**: Todos os 15 componentes principais migrados para usar `LocaleService`:
  - Features: `dashboard-widgets`, `budget-detail`, `goal-form`, `reports`
  - Molecules: `credit-card-bill-item`, `credit-card-card`, `reconcile-form`, `account-card`, `transfer-form`, `os-goal-progress-card`
  - Organisms: `os-transaction-list`, `os-category-manager`, `os-dashboard-widgets`
  - Templates: `os-detail-template`
  - Atoms: `os-slider`
- **Formatação unificada**: Todas as formatações de moeda e data agora passam pelo `LocaleService`, garantindo consistência pt-BR em todo o app.
- **Nota**: `os-money-input` e `os-money-display` já usam pt-BR corretamente internamente e podem ser migrados para usar `LocaleService` em uma refatoração futura se necessário.

---

## 📅 FASE 6: Estados de UI (Empty/Loading/Error/Success) [Status: ⏳]

### 🎯 Objetivo

Implementar `os-empty-state`, `os-skeleton` e consolidar `os-alert`/toasts.

### 📋 Tarefas

#### Integrar os-skeleton e loading globais [⏳]

**Descrição**: Skeletons em listas/cards e carregamentos de página; aria-busy.  
**Critério de Conclusão**: Skeletons nas telas com loading perceptível.

#### Empty e Error com retry [⏳]

**Descrição**: `os-empty-state` com CTA; `os-alert` role=alert, `aria-live` assertive para erros críticos.  
**Critério de Conclusão**: Estados cobertos e acessíveis.

### 🧪 Critérios de Validação

- [ ] `aria-live` correto
- [ ] Skip links preservados (shell)
- [ ] Mensagens claras e localizadas

### 📝 Comentários da Fase

_–_

---

## 📅 FASE 7: Passes por Página I (Dashboard, Orçamentos) [Status: ⏳]

### 🎯 Objetivo

Aplicar padrão completo nas primeiras páginas alvo.

### 📋 Tarefas

#### Dashboard padronizado [⏳]

**Descrição**: Revisão final: containers, botões, grids, estados.  
**Critério de Conclusão**: Sem inline layout; validação visual responsiva.

#### Orçamentos padronizado [⏳]

**Descrição**: Reforçar padrões; filtros e entidades ajustados.  
**Critério de Conclusão**: Aderência integral ao DS.

### 🧪 Critérios de Validação

- [ ] Checklista de layout-spec satisfeita
- [ ] A11y básica (tab order, foco visível)

### 📝 Comentários da Fase

_–_

---

## 📅 FASE 8: Passes por Página II (Contas, Cartões) [Status: ⏳]

### 🎯 Objetivo

Aplicar padrão nas páginas de Contas e Cartões.

### 📋 Tarefas

#### Contas [⏳]

**Descrição**: Containers, botões, listas/cards, estados.  
**Critério de Conclusão**: Consistência com fases anteriores.

#### Cartões de Crédito [⏳]

**Descrição**: Mesmo padrão; atenção a listas/faturas.  
**Critério de Conclusão**: Aderência e responsividade.

### 🧪 Critérios de Validação

- [ ] Botões 100% `os-button`
- [ ] Spacing e grids padronizados

### 📝 Comentários da Fase

_–_

---

## 📅 FASE 9: Passes por Página III (Metas, Transações, Relatórios, Configurações) [Status: ⏳]

### 🎯 Objetivo

Completar padronização nas páginas restantes e polimento final de a11y.

### 📋 Tarefas

#### Metas e Transações [⏳]

**Descrição**: Reforçar filtros/listas/cards; estados.  
**Critério de Conclusão**: Paridade de UX com páginas anteriores.

#### Relatórios e Configurações [⏳]

**Descrição**: Auditar formatação `pt-BR`; containers; ações.  
**Critério de Conclusão**: Relatórios consistentes e acessíveis.

### 🧪 Critérios de Validação

- [ ] WCAG 2.1 AA (checagem básica)
- [ ] Sem `mat-*` em botões nas páginas
- [ ] Sem scroll horizontal

### 📝 Comentários da Fase

_–_

---

## 🔄 Dependências

- F1 → F2 (botões dependem do header/containers)
- F1 → F3 (filtros na estrutura padronizada)
- F2/F3/F4 → F7..F9 (passes por página dependem de padrões)
- F5 (locale) pode ocorrer em paralelo com F6, desde que páginas afetadas sejam auditadas depois

---

## 🏁 Entrega Final

- [ ] Todos os critérios de aceitação do `context.md` atendidos
- [ ] `architecture.md` e `layout-specification.md` refletidos no app
- [ ] Testes unitários básicos (formatadores, interações críticas)
- [ ] Acessibilidade mínima verificada (tab/foco/aria/contraste)
- [ ] Pronto para PR
