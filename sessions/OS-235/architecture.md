# Dashboard Centrado em Progresso - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

- O `DashboardPage` já existe e utiliza `DashboardWidgetsComponent` (`os-dashboard-widgets-container`) para renderizar widgets configurados via `WidgetConfiguration` e o organismo compartilhado `OsDashboardWidgetsComponent`.
- O `DashboardDataService` provê:
  - Lista de orçamentos (`budgets`).
  - `budgetOverview` com totais de saldo, renda, despesa e contas.
  - Lista de metas (`goals`).
- `GoalsState` e `BudgetState` já modelam estados reativos de metas e orçamentos.
- Não há ainda:
  - Widget de indicadores de saúde financeira.
  - Widget de próximas ações.
  - Widget estruturado de gastos por categoria com envelopes.
  - Widget de conquistas recentes.
  - Serviço especializado para consolidar os indicadores definidos em `business/financial-health.md`.

### Mudanças Propostas

- Reorganizar o layout do `DashboardPage` para tornar o **progresso de metas** o elemento central (primeira dobra).
- Criar novos widgets especializados:
  - `GoalsProgressWidgetComponent`.
  - `FinancialHealthIndicatorComponent`.
  - `SuggestedActionsComponent`.
  - `CategorySpendingWidgetComponent`.
  - `RecentAchievementsComponent`.
- Introduzir um serviço de domínio de dashboard para consolidar cálculos:
  - `DashboardInsightsService` (ou nome similar) no contexto de `features/dashboard`, responsável por:
    - Calcular indicadores de saúde financeira com base em `business/financial-health.md`.
    - Gerar próximas ações sugeridas.
    - Detectar conquistas recentes.
- Atualizar `DashboardWidgetsComponent` / `OsDashboardWidgetsComponent` para suportar os novos tipos de widget e receber dados ricos para cada um.

### Impactos

- Impacta diretamente:
  - UX do dashboard (hierarquia visual, responsividade e acessibilidade).
  - Consumo de estados (`GoalsState`, `BudgetState`, `AccountState`, no futuro `CategoryState` e `EnvelopeState`).
  - Organização de serviços de cálculo dentro de `features/dashboard`.

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/app/features/dashboard/pages/dashboard/dashboard.page.ts`:

  - Reorganizar a lista de `WidgetConfiguration` para:
    - Manter `goal-progress` como bloco principal (primeira linha, tamanho grande/full-width).
    - Adicionar configurações para novos tipos de widget (`financial-health`, `suggested-actions`, `category-spending`, `recent-achievements`).
  - Garantir que o container de widgets receba as novas configurações mantendo o comportamento atual de navegação.

- `src/app/features/dashboard/components/dashboard-widgets/dashboard-widgets.component.ts`:

  - Estender o mapeamento de `WidgetConfiguration` → `DashboardWidget` para:
    - Incluir dados provenientes de `DashboardInsightsService` para os novos tipos.
  - Manter a integração atual com `BudgetSelectionService`, `DashboardDataService` e `AccountState`.

- `src/app/features/dashboard/services/dashboard-data.service.ts`:
  - Avaliar se parte dos dados necessários para insights (ex.: uso de orçamento, fluxo de caixa) já pode ser exposta de forma estruturada.
  - Evitar duplicação de responsabilidades com o novo serviço de insights.

### Novos Arquivos a Criar

- `src/app/features/dashboard/services/dashboard-insights.service.ts`:

  - Responsável por consolidar dados de:
    - `DashboardDataService` (overview de orçamento, renda, despesas).
    - `GoalsState` / `GoalsApiService`.
    - Em versões futuras: `CategoryState`, `EnvelopeState`, possivelmente `TransactionService` para fluxo de caixa mais detalhado.
  - Expor signals/computed para:
    - `budgetUsageIndicator` (uso de orçamento/envelopes).
    - `cashFlowIndicator` (receitas vs despesas).
    - `goalsOnTrackIndicator`.
    - `emergencyReserveIndicator`.
    - `overallFinancialHealthScore` (opcional, interno).
    - `suggestedActions`.
    - `recentAchievements`.

- `src/app/features/dashboard/components/goals-progress-widget/goals-progress-widget.component.ts`:

  - Componente de apresentação que recebe dados de metas (lista de metas, percentuais, valores restantes e aportes sugeridos) via `input()` e renderiza:
    - Lista/principal de metas com barras de progresso.
    - Destaques para metas prioritárias/atrasadas.

- `src/app/features/dashboard/components/financial-health-indicator/financial-health-indicator.component.ts`:

  - Recebe via `input()` um modelo consolidado de indicadores:
    - Uso de orçamento.
    - Fluxo de caixa.
    - Metas on-track.
    - Reserva de emergência.
  - Renderiza cards/badges com:
    - Valor numérico/percentual.
    - Faixa (verde/amarelo/vermelho).
    - Tooltips explicando o significado, conforme `financial-health.md`.

- `src/app/features/dashboard/components/suggested-actions-widget/suggested-actions-widget.component.ts`:

  - Recebe via `input()` uma lista de ações sugeridas (tipo, texto, destino de navegação).
  - Dispara `output()` ao clicar para que `DashboardPage`/roteador decidam a navegação.

- `src/app/features/dashboard/components/category-spending-widget/category-spending-widget.component.ts`:

  - Versão inicial:
    - Recebe via `input()` uma lista de categorias com gasto atual e percentual vs total de gastos.
  - Versão futura:
    - Passar a receber também `% do planejado` via envelopes.

- `src/app/features/dashboard/components/recent-achievements-widget/recent-achievements-widget.component.ts`:
  - Recebe achievements normalizados (tipo, mensagem, data, ênfase visual).
  - Pode exibir microanimações quando o componente entra na tela ou quando um novo achievement aparece.

### Estrutura de Diretórios

- `src/app/features/dashboard/`
  - `pages/dashboard/dashboard.page.ts` (já existente).
  - `components/`
    - `dashboard-widgets/` (já existente).
    - `goals-progress-widget/`
    - `financial-health-indicator/`
    - `suggested-actions-widget/`
    - `category-spending-widget/`
    - `recent-achievements-widget/`
  - `services/`
    - `dashboard-data.service.ts` (já existente).
    - `dashboard-insights.service.ts` (novo).
  - `types/dashboard.types.ts`:
    - Estender tipagens para incluir os novos tipos de widget e modelos de dados agregados se necessário.

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Feature-first**: serviços e componentes de dashboard ficam dentro de `features/dashboard`.
- **Clean Architecture**:
  - Serviços de insights (`DashboardInsightsService`) fazem a orquestração de dados de múltiplos estados/serviços.
  - Componentes de widget são focados em apresentação e interação com o usuário.
- **Angular moderno**:
  - Standalone components, signals, `computed`, controle de fluxo nativo.
  - `ChangeDetectionStrategy.OnPush` em todos os widgets.

### Decisões Arquiteturais

- **Decisão**: Centralizar cálculos de saúde financeira e insights em `DashboardInsightsService`.

  - **Alternativas**: Colocar lógica de cálculo diretamente em `DashboardDataService` ou espalhar pelos componentes.
  - **Justificativa**: Mantém `DashboardDataService` focado em **fetch/cache de dados** de API, enquanto `DashboardInsightsService` aplica as regras de negócio definidas em `business/financial-health.md`, facilitando testes e evolução.

- **Decisão**: Representar cada bloco do dashboard como um widget especializado com `input()`s bem tipados.

  - **Alternativas**: Estender apenas `OsDashboardWidgetsComponent` sem componentes especializados.
  - **Justificativa**: Maior encapsulamento, reutilização futura e alinhamento com o design system/documentação do projeto.

- **Decisão**: Implementar inicialmente apenas uma **versão simplificada** de `SuggestedActionsComponent` e `CategorySpendingWidgetComponent`.
  - **Alternativas**: Implementar toda a complexidade de uma vez (incluindo envelopes, 50-30-20, histórico profundo).
  - **Justificativa**: Entregar rapidamente a experiência principal do dashboard, mantendo espaço para evoluções quando Categorias/Envelopes estiverem completos.

## 📦 Dependências e Integrações

### Dependências Existentes

- `DashboardDataService` (dados de overview e metas).
- `GoalsState` / `GoalsApiService`.
- `BudgetState` / `BudgetService` / `BudgetSelectionService`.
- `AccountState` / serviços de contas.
- Design system via `OsDashboardWidgetsComponent` e componentes `os-*`.

## 🎨 UI Components and Layout

### Design System Integration

- O layout do dashboard reutiliza:
  - `OsPageComponent` / `OsPageHeaderComponent` como template de página.
  - `OsDashboardWidgetsComponent` como organismo responsável pelo grid de widgets (`os-dashboard-widgets__grid`), tamanhos (`small`, `medium`, `large`, `full`) e estados (`loading`, `empty`, `error`, `success`).
  - Atoms/molecules do Design System (`os-button`, `os-icon`, `os-label`, `os-card`, etc.) para construir o conteúdo interno de cada widget.
- Tokens de tema e responsividade (cores, spacing, tipografia, breakpoints) são usados conforme definido em `theme/_tokens.scss` e `responsive-design.md`.

### New Components Required

- Widgets específicos de dashboard (implementados como componentes standalone na feature):
  - `GoalsProgressWidgetComponent`: hero do dashboard com lista de metas e barras de progresso.
  - `FinancialHealthIndicatorComponent`: mostra os indicadores definidos em `business/financial-health.md`.
  - `SuggestedActionsComponent`: cards de ações sugeridas com CTA e navegação.
  - `CategorySpendingWidgetComponent`: versão inicial baseada em gastos vs total, evoluindo para envelopes.
  - `RecentAchievementsComponent`: cards de conquistas recentes com microanimações leves.

### Layout Architecture

- A hierarquia visual segue:
  - `GoalsProgressWidgetComponent` como primeiro widget, ocupando mais colunas/linhas no grid.
  - Demais widgets organizados em linhas subsequentes, respeitando a ordem de importância UX: saúde financeira → ações sugeridas → gastos por categoria → conquistas.
- O comportamento responsivo e detalhes de grid, espaçamento e wireframes textuais estão detalhados em `layout-specification.md`.

### Performance Considerations

- Evitar bibliotecas de gráficos pesadas na primeira versão; priorizar representações com HTML/CSS e componentes existentes.
- Garantir que todos os widgets usem `OnPush`, signals/computed e que a orquestração esteja centralizada no `DashboardInsightsService` para minimizar recomputações.
- Respeitar `prefers-reduced-motion` nas animações internas dos widgets.

### Novas Dependências

- (Opcional / futuro próximo) Um serviço dedicado a fluxo de caixa se a lógica extrapolar o escopo de dashboard:
  - Ex.: `CashFlowService` consumindo `TransactionService`.

### Integrações

- **Componente `DashboardWidgetsComponent`**:

  - Deve consumir `DashboardInsightsService` para montar `DashboardWidget.data` dos tipos:
    - `financial-health`.
    - `suggested-actions`.
    - `category-spending`.
    - `recent-achievements`.

- **Navegação**:

  - `SuggestedActionsComponent` emitirá eventos (ex.: `navigateToGoal`, `navigateToTransactions`, etc.) tratados por `DashboardPage`/router.

- **Futuro com Categorias/Envelopes**:
  - `CategorySpendingWidgetComponent` e `DashboardInsightsService` passarão a:
    - Ler `CategoryState` e `EnvelopeState`.
    - Calcular `% do planejado` por envelope categoria.

## 🔄 Fluxo de Dados

1. `DashboardPage` é carregado → `DashboardDataService` busca orçamentos, overview e metas (já implementado).
2. `BudgetSelectionService` define o orçamento selecionado.
3. `DashboardInsightsService` observa:
   - `dashboardDataService.budgetOverview()`.
   - `dashboardDataService.goals()`.
   - Em versões futuras: estados de categorias, envelopes e transações.
4. `DashboardInsightsService`:
   - Calcula indicadores de saúde financeira conforme fórmulas de `financial-health.md`.
   - Gera ações sugeridas com base em:
     - Metas atrasadas/próximas do prazo.
     - Fluxo de caixa negativo/risco.
     - Reserva de emergência insuficiente.
   - Detecta conquistas (metas concluídas, reservas atingindo limiares, etc.).
5. `DashboardWidgetsComponent`:
   - Lê dados de `DashboardInsightsService` e monta `DashboardWidget` com `data` apropriado para cada tipo.
6. `OsDashboardWidgetsComponent`:
   - Renderiza cada widget usando os componentes especializados (`GoalsProgressWidgetComponent`, `FinancialHealthIndicatorComponent`, etc.).

## 🧪 Considerações de Teste

### Testes Unitários

- `DashboardInsightsService`:
  - Testar cada indicador de saúde financeira com cenários:
    - Orçamento abaixo, dentro e acima do limite.
    - Fluxo de caixa negativo, equilibrado, positivo.
    - Metas on-track, atrasadas, adiantadas.
    - Diferentes níveis de reserva de emergência.
- Componentes de widget:
  - Renderização condicional com base em estados de loading/empty/error.
  - Interpretação correta das faixas (cores, ícones, mensagens).
  - Emissão de eventos de navegação a partir de ações sugeridas.

### Testes de Integração

- Dashboard end-to-end com MSW:
  - Simular orçamentos/metas diferentes e validar:
    - Indicadores exibidos.
    - Ações sugeridas coerentes com os dados.
    - Conquistas sendo detectadas.

### Mocks e Fixtures

- Fixtures para:
  - `budgetOverview` com diferentes níveis de uso e fluxo de caixa.
  - Listas de metas (on-track, atrasadas, adiantadas).
  - Estados de reserva (baixa/média/alta).

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- Criar um serviço adicional (`DashboardInsightsService`) aumenta a quantidade de peças, mas separa claramente **fetch de dados** de **cálculo de insights**.
- Manter uma versão inicial simplificada dos widgets de ações e gastos por categoria significa que parte da visão de saúde financeira ficará incompleta até que Categorias/Envelopes estejam 100% implementados.

### Riscos Identificados

- **Risco de divergência com `financial-health.md`**:

  - Mitigado com mapeamento explícito de cada indicador no código e testes direcionados.

- **Risco de complexidade de UI**:
  - Mitigado ao manter o widget de progresso de metas como elemento dominante e tratar outros widgets como suporte.

## 📋 Lista de Implementação

- [ ] Atualizar `DashboardPage` para configurar novos widgets e reforçar o protagonismo do widget de progresso de metas.
- [ ] Criar `DashboardInsightsService` consolidando cálculos de indicadores, ações sugeridas e conquistas.
- [ ] Criar componentes de widget (`GoalsProgressWidgetComponent`, `FinancialHealthIndicatorComponent`, `SuggestedActionsComponent`, `CategorySpendingWidgetComponent`, `RecentAchievementsComponent`).
- [ ] Integrar `DashboardInsightsService` e novos widgets em `DashboardWidgetsComponent` / `OsDashboardWidgetsComponent`.
- [ ] Implementar estados de loading/empty/error e responsividade dos novos widgets.
- [ ] Especificar e implementar testes unitários e de integração conforme descrito.

## 📚 Referências

- **Meta Specs**:
  - `business/financial-health.md`.
  - `business/03_funcionalidades_core.md` (Dashboard Centrado em Progresso).
  - `technical/frontend-architecture/*` (padrões de feature-first e state management).
- **Código**:
  - `DashboardPage`, `DashboardWidgetsComponent`, `DashboardDataService`.
  - `GoalsState`, `BudgetState`, `AccountState` e serviços relacionados.
