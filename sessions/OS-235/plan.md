# Dashboard Centrado em Progresso - Plano de Implementação

> **Instruções**: Mantenha este arquivo atualizado conforme o progresso. Marque tarefas como concluídas ✅, em progresso ⏰ ou não iniciadas ⏳.

## 📋 Resumo Executivo

Implementar um **dashboard centrado em progresso** que coloca o avanço das metas e a saúde financeira no centro da experiência, usando os estados e serviços já existentes (`GoalsState`, `BudgetState`, `DashboardDataService`) e um novo serviço de insights de dashboard, com widgets especializados e layout responsivo/alinhado ao Design System.

## 🎯 Objetivos

- Tornar o **progresso das metas** o elemento visual e conceitual principal do dashboard.
- Exibir **indicadores de saúde financeira** alinhados ao documento `business/financial-health.md`.
- Oferecer **próximas ações sugeridas**, visão de **gastos por categoria** (parcial) e **conquistas recentes**.
- Garantir layout **responsivo**, **acessível (WCAG 2.1 AA)** e integrado ao **Design System OrçaSonhos**.

Critérios de sucesso (alto nível):

- Progresso das metas visível na primeira dobra em mobile e desktop.
- Indicadores de saúde financeira corretos e coerentes com `financial-health.md`.
- Widgets de ações, gastos por categoria (parcial) e conquistas integrados ao layout.
- Testes unitários/comportamentais com cobertura ≥ 80% para as partes novas do dashboard.

---

## 📅 FASE 1: Serviço de Insights e Integração de Dados [Status: ⏳]

### 🎯 Objetivo

Criar a base de **cálculo de insights do dashboard** em um serviço dedicado (`DashboardInsightsService`), consolidando dados de overview de orçamento e metas, sem ainda alterar significativamente o layout visual.

### 📋 Tarefas

#### 1.1 Criar `DashboardInsightsService` [⏳]

**Descrição**:  
Implementar um serviço em `features/dashboard/services` que:
- Consuma `DashboardDataService` (`budgetOverview`, `goals`) e, se necessário, `GoalsState`/`BudgetState`.
- Exponha signals/computed para:
  - `budgetUsageIndicator`.
  - `cashFlowIndicator`.
  - `goalsOnTrackIndicator`.
  - `emergencyReserveIndicator`.
  - `suggestedActions` (versão simplificada stub inicial).
  - `recentAchievements` (versão simplificada stub inicial).

**Critério de Conclusão**:
- Serviço criado com API estável (signals/computed públicos).
- Fórmulas alinhadas com `business/financial-health.md` implementadas para os quatro indicadores principais.
- Testes unitários cobrindo casos principais (verde/amarelo/vermelho / ranges).

#### 1.2 Integrar `DashboardInsightsService` ao `DashboardWidgetsComponent` [⏳]

**Descrição**:  
Injetar `DashboardInsightsService` em `DashboardWidgetsComponent` e garantir que:
- Já seja possível obter indicadores e listas (mesmo que ainda não sejam exibidos em novos widgets).
- Preparar `DashboardWidget.data` para acomodar os novos tipos (`financial-health`, `suggested-actions`, `category-spending`, `recent-achievements`) sem quebrar o comportamento atual.

**Critério de Conclusão**:
- `DashboardWidgetsComponent` compila e testes existentes continuam passando.
- Dados de insights podem ser inspecionados em testes (ex.: via spies/mocks).

### 🧪 Critérios de Validação

- [ ] Testes unitários do `DashboardInsightsService` cobrindo cenários principais.
- [ ] Nenhuma regressão no carregamento atual do dashboard (orçamentos, overview, metas).
- [ ] Build e suite de testes existentes passam.

### 📝 Comentários da Fase

_[Preencher durante o desenvolvimento]_  

---

## 📅 FASE 2: Hero de Progresso das Metas [Status: ⏳]

### 🎯 Objetivo

Transformar o widget de progresso de metas em **hero** do dashboard, com layout alinhado à `layout-specification.md` e dados reativos de metas.

### 📋 Tarefas

#### 2.1 Criar `GoalsProgressWidgetComponent` [⏳]

**Descrição**:  
Criar componente standalone em `features/dashboard/components/goals-progress-widget` que:
- Receba via `input()`:
  - Lista de metas (DTO/estrutura específica).
  - Dados agregados (percentual de metas on-track, etc.), se necessário.
- Renderize:
  - Título + subtítulo.
  - Lista de 3–5 metas principais com barras de progresso, valores atual/objetivo e badges de status.
  - Ação “Ver todas as metas” via `os-button`.

**Critério de Conclusão**:
- Componente com layout básico finalizado, usando tokens de tema e componentes `os-*`.
- Testes unitários de renderização (várias listas, metas vazias).

#### 2.2 Integrar hero de metas ao `OsDashboardWidgetsComponent` [⏳]

**Descrição**:  
Atualizar o fluxo `DashboardPage` → `DashboardWidgetsComponent` → `OsDashboardWidgetsComponent` para:
- Mapear `widget.type === 'goal-progress'` para usar `GoalsProgressWidgetComponent` como conteúdo principal.
- Ajustar `size`/`position` para que o widget seja hero:
  - Span maior (ex.: `large`/`full`) e, se necessário, grid-row extendido.

**Critério de Conclusão**:
- Ao acessar `/dashboard`, o primeiro widget visível é o hero de metas, ocupando visualmente a primeira dobra em desktop e mobile.
- Click em “Ver todas as metas” navega corretamente para `/goals`.

### 🧪 Critérios de Validação

- [ ] Hero de metas aparece em destaque em todas as larguras.
- [ ] Estados de loading/empty/error do hero integrados com o estado atual de metas.
- [ ] Navegação para tela de metas funcionando via CTA do widget.

### 📝 Comentários da Fase

_[Preencher durante o desenvolvimento]_  

---

## 📅 FASE 3: Indicadores de Saúde Financeira [Status: ⏳]

### 🎯 Objetivo

Exibir os **indicadores de saúde financeira** definidos em `financial-health.md` em um widget dedicado, integrado ao serviço de insights.

### 📋 Tarefas

#### 3.1 Criar `FinancialHealthIndicatorComponent` [⏳]

**Descrição**:  
Componente standalone em `features/dashboard/components/financial-health-indicator` que:
- Recebe via `input()` um modelo consolidado com:
  - Uso de orçamento/envelopes.
  - Relação receitas vs despesas.
  - % metas on-track.
  - Meses de reserva de emergência.
- Renderiza 3–4 cards com:
  - Título, valor, faixa (verde/amarelo/vermelho).
  - Ícones e textos explicativos (não depender apenas de cor).

**Critério de Conclusão**:
- Layout alinhado à `layout-specification.md`.
- Estados adequados para falta de dados (ex.: mensagem explicando ausência de reserve).

#### 3.2 Conectar indicadores ao `DashboardInsightsService` e widgets [⏳]

**Descrição**:  
Adaptar `DashboardWidgetsComponent`/`OsDashboardWidgetsComponent` para:
- Criar um widget do tipo `financial-health` que injeta `FinancialHealthIndicatorComponent` com dados do `DashboardInsightsService`.

**Critério de Conclusão**:
- Indicadores exibidos corretamente a partir de dados reais de overview/transactions/metas disponíveis.
- Cores e textos dos estados batendo com ranges de `financial-health.md`.

### 🧪 Critérios de Validação

- [ ] Cenários de uso saudável, atenção e crítico renderizados corretamente em testes.
- [ ] Widget se comporta bem em mobile, tablet e desktop.
- [ ] Acessibilidade básica verificada (leitores de tela entendem textos de status).

### 📝 Comentários da Fase

_[Preencher durante o desenvolvimento]_  

---

## 📅 FASE 4: Próximas Ações e Conquistas Recentes [Status: ⏳]

### 🎯 Objetivo

Fornecer **orientação próxima ação** e **reforço positivo** por meio de widgets de ações sugeridas e conquistas recentes.

### 📋 Tarefas

#### 4.1 Implementar `SuggestedActionsComponent` (versão simplificada) [⏳]

**Descrição**:  
Componente standalone em `features/dashboard/components/suggested-actions-widget` que:
- Recebe lista de ações (tipo, título, descrição, ícone, rota).
- Exibe 3–5 cards clicáveis.
- Emite eventos para navegação (`output` simples).

**Critério de Conclusão**:
- Layout alinhado à `layout-specification.md`.
- Testes unitários garantindo renderização e emissão de eventos.

#### 4.2 Implementar `RecentAchievementsComponent` [⏳]

**Descrição**:  
Componente standalone em `features/dashboard/components/recent-achievements-widget` que:
- Recebe conquistas (tipo, mensagem, data).
- Exibe cards compactos com ícones e texto.
- Aplica microanimações de entrada respeitando `prefers-reduced-motion`.

**Critério de Conclusão**:
- Componente animado, mas acessível (sem exageros, impactado por reduced-motion).
- Testes unitários básicos para estados com/sem conquistas.

#### 4.3 Integrar ações e conquistas ao `DashboardInsightsService` [⏳]

**Descrição**:  
Definir lógica simplificada para:
- Sugerir ações com base em:
  - Metas atrasadas/próximas do prazo.
  - Fluxo de caixa negativo.
  - Reserva de emergência insuficiente.
- Detectar conquistas:
  - Metas concluídas recentemente.
  - Reserva atingindo limiares (3 ou 6 meses).

**Critério de Conclusão**:
- Para conjuntos de dados mockados, as ações e conquistas são geradas de forma previsível.
- Integração visual feita via widgets no dashboard.

### 🧪 Critérios de Validação

- [ ] Ao simular metas atrasadas, aparecem ações de aporte/ajuste.
- [ ] Ao simular reserva baixa/adequada, conquistas/alertas coerentes.
- [ ] Navegação a partir de ações sugeridas leva às telas corretas.

### 📝 Comentários da Fase

_[Preencher durante o desenvolvimento]_  

---

## 📅 FASE 5: Gastos por Categoria (Parcial) e Polimento de Layout/Acessibilidade [Status: ⏳]

### 🎯 Objetivo

Entregar a visão parcial de **gastos por categoria**, preparar o widget para integração futura com envelopes e polir layout, responsividade e acessibilidade de todo o dashboard.

### 📋 Tarefas

#### 5.1 Implementar `CategorySpendingWidgetComponent` (versão parcial) [⏳]

**Descrição**:  
Componente standalone em `features/dashboard/components/category-spending-widget` que:
- Recebe lista de categorias com:
  - Nome.
  - Valor gasto no período.
  - Percentual em relação ao total gasto.
- Exibe lista/barras horizontais simples conforme `layout-specification.md`.
- Inclui mensagem contextual explicando que visão completa de `% do planejado` dependerá de envelopes.

**Critério de Conclusão**:
- Widget funcional com dados parciais.
- Preparado para, futuramente, receber também `% do planejado` sem refactor pesado.

#### 5.2 Refinar layout responsivo e hierarquia visual do dashboard [⏳]

**Descrição**:  
Aplicar ajustes finos em:
- Tamanhos (`size`) e posições (`position`) dos widgets.
- Comportamento do grid (`OsDashboardWidgetsComponent`) em breakpoints.
- Spacing interno/externo dos widgets para alinhar com design system (`_tokens.scss`, `responsive-design.md`, `ui-system.md`).

**Critério de Conclusão**:
- Em mobile, os widgets seguem a ordem e empilhamento especificados.
- Em desktop, hero + grid se comportam conforme wireframes textuais do `layout-specification.md`.

#### 5.3 Acessibilidade e estados globais [⏳]

**Descrição**:  
Garantir que todos os widgets e o dashboard como um todo:
- Usem landmarks, labels e ARIA adequados (`accessibility.md`).
- Tenham estados de loading/empty/error consistentes e acessíveis.
- Respeitem foco por teclado e contrastes mínimos.

**Critério de Conclusão**:
- Checklist de A11y do design system (ou `accessibility.md`) atendido para o dashboard.
- Pelo menos uma bateria de testes de acessibilidade automatizados básicos executada (quando aplicável).

### 🧪 Critérios de Validação

- [ ] Layout sem scroll horizontal em todas as resoluções suportadas.
- [ ] Progresso de metas sempre visível na primeira dobra em mobile/desktop.
- [ ] Navegação por teclado completa sobre todos os elementos interativos.
- [ ] Indicadores e estados (sucesso/erro/atenção) compreensíveis por leitores de tela.

### 📝 Comentários da Fase

_[Preencher durante o desenvolvimento]_  

---

## 🏁 Entrega Final

- [ ] Todas as fases concluídas e marcadas como ✅.
- [ ] Testes unitários e de integração passando com cobertura ≥ 80% nas partes novas.
- [ ] `context.md`, `architecture.md` e `layout-specification.md` revisados e, se necessário, ajustados para refletir decisões finais.
- [ ] Dashboard `/dashboard` claramente centrado em progresso de metas e saúde financeira, conforme Meta Specs e requisitos da OS-235.
- [ ] Pronto para `/work` (implementação detalhada) e, posteriormente, `/pre-pr` e `/pr`.


