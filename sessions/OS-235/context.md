# Dashboard Centrado em Progresso - Contexto de Desenvolvimento

# OS-235

## 🎯 Objetivo

Transformar o dashboard atual em um **Dashboard Centrado em Progresso**, onde o **progresso das metas financeiras** é o elemento visual e conceitual principal da interface, servindo como “painel de controle” do usuário para acompanhar avanço das metas, saúde financeira e próximas ações relevantes.  
Esta funcionalidade consolida dados de orçamento, metas e (futuramente) envelopes em uma visão unificada, guiando o usuário a tomar decisões de aporte e controle de gastos de forma simples e motivadora.

## 📋 Requisitos Funcionais

### Funcionalidades Principais

- **Progresso das Metas como elemento central**:

  - Grande bloco principal de progresso de metas ocupando a primeira dobra do dashboard, com destaque visual superior aos demais widgets (decisão 1-A).
  - Foco em barras de progresso por meta e visão resumida do progresso geral.

- **Widget de Progresso das Metas (`GoalsProgressWidgetComponent`)**:

  - Exibir lista de metas com:
    - Percentual de conclusão.
    - Valor restante para atingir a meta.
    - Aporte mensal sugerido por meta (apoiado pela lógica já iniciada em `GoalsState` e, futuramente, pelas Meta Specs de Metas SMART).
  - Integrar reativamente com `GoalsState` / `GoalsApiService`.

- **Indicadores de Saúde Financeira (`FinancialHealthIndicatorComponent`)**:

  - Calcular e exibir, alinhado ao documento `business/financial-health.md`, pelo menos:
    - **Uso de orçamento/envelopes**: `% do orçamento usado no período atual` (`usage_percentage`), com faixas verde/amarelo/vermelho.
    - **Relação receitas vs despesas (fluxo de caixa)**: índice de `total_receitas` vs `total_despesas`, incluindo indicação de superávit, equilíbrio ou déficit.
    - **Progresso das metas on-track**: `% de metas ativas consideradas “on-track”` conforme critérios de progresso esperado/contribuição ideal.
    - **Nível de reserva de emergência**: `meses cobertos pela reserva`, com faixas de risco (<3, 3–6, >6 meses).
  - Opcionalmente, em versões futuras:
    - Considerar **distribuição 50-30-20 real vs ideal** por categorias.
    - Expor ou utilizar internamente um **score agregado de saúde financeira** (0–100) para alimentar recomendações.
  - A implementação seguirá o **modelo de saúde financeira definido nas Meta Specs**, garantindo que os indicadores exibidos no dashboard reflitam fielmente essas definições.

- **Próximas Ações Sugeridas (`SuggestedActionsComponent`)** – **versão simplificada inicial (decisão 3)**:

  - Exibir um conjunto pequeno de ações prioritárias, por exemplo:
    - Metas próximas do prazo ou atrasadas.
    - Aportes pendentes ou recomendados.
    - Transações agendadas importantes.
  - Versão inicial focada em **poucas regras claras e úteis**, sem sistema complexo de priorização ainda.

- **Gastos por Categoria como % do Planejado (`CategorySpendingWidgetComponent`)**:

  - Integração plena dependerá do **Sistema de Envelopes (Card 3)** e do **Sistema de Categorias (Card 2)**.
  - **Enquanto envelopes não existirem, implementar versão parcial (decisão 4-B)**:
    - Usar os dados já disponíveis (orçamento e categorias) para exibir pelo menos:
      - Distribuição de gastos por categoria.
      - Percentual de cada categoria em relação ao total gasto no período.
    - Quando envelopes forem implementados, evoluir este widget para mostrar **% do planejado por envelope**, atendendo totalmente ao critério “gastos por categoria como % do planejado”.

- **Resumo de Conquistas Recentes (`RecentAchievementsComponent`)**:

  - Detectar e exibir conquistas como:
    - Metas alcançadas.
    - Aportes relevantes/recorrentes.
    - Categorias dentro do limite (quando envelopes e categorias estiverem integrados).
  - Exibir cards de conquistas com feedback visual positivo.

- **Integração com Dashboard Existente**:
  - Refatorar `DashboardPage` para:
    - Tornar o widget de progresso de metas o **primeiro e maior bloco** do layout.
    - Reorganizar os widgets existentes (resumo de orçamento, transações recentes, saldo de contas) como elementos de suporte.
    - Manter navegações já existentes (goals, budgets, transactions, accounts).

### Comportamentos Esperados

- **Ao acessar `/dashboard`**:

  - Usuário visualiza imediatamente o bloco principal de **progresso das metas**, com informações suficientes para entender seu status geral.
  - Indicadores de saúde financeira são exibidos de forma clara, com cores semânticas (verde/amarelo/vermelho) e tooltips explicativos.
  - Usuário vê uma lista concisa de **próximas ações sugeridas** e consegue navegar para as telas relevantes a partir desses cards.
  - Usuário pode acompanhar **gastos por categoria** com o melhor nível de precisão possível dado o estágio atual das funcionalidades (parcial agora, completo após envelopes).
  - Usuário é exposto a **conquistas recentes** com feedback visual positivo (microanimações, destaque visual).

- **Responsividade e acessibilidade**:
  - Layout **mobile-first**, fluindo bem em mobile, tablet e desktop.
  - Cumprir **WCAG 2.1 AA** no que diz respeito a contraste, foco, navegação por teclado e leitores de tela.

## 🏗️ Considerações Técnicas

### Arquitetura

- Reaproveitar o `DashboardPage` existente, que hoje:
  - Usa `DashboardWidgetsComponent` / `os-dashboard-widgets-container` com uma configuração de widgets baseada em `WidgetConfiguration`.
  - Já possui widget `goal-progress` e widgets de resumo (`budget-summary`, `transaction-list`, `account-balance`).
- Evoluir a configuração de widgets e, se necessário, o próprio container de widgets para:
  - Suportar um layout onde **o widget de progresso das metas é o principal**, e demais widgets são secundários, possivelmente em seções abaixo ou laterais (dependendo do viewport).
  - Continuar usando a abordagem declarativa de configuração (lista de `WidgetConfiguration`) para manter flexibilidade futura.
- Integrar com estados já existentes:
  - `GoalsState` (metas): fonte primária para progresso, valores acumulados, valores restantes e aportes sugeridos.
  - `BudgetState` (orçamentos) e `DashboardDataService`: fonte para orçamentos, visão de overview e dados de base para indicadores de saúde financeira.

### Tecnologias e Dependências

- **Angular 20+** com:
  - Standalone components.
  - Signals (`signal`, `computed`) para estado local e derivado.
  - Controle de fluxo nativo em templates (`@if`, `@for`, etc.).
  - `ChangeDetectionStrategy.OnPush` em todos os componentes de widget.
- **Estados existentes**:
  - `GoalsState`, `GoalsApiService`.
  - `BudgetState`, `BudgetService`, `BudgetSelectionService`.
  - `DashboardDataService` para carregamento consolidado do dashboard.
- **Animações**:
  - Uso dos recursos mais modernos de animação do Angular (por exemplo, `@angular/animations` com `animate`, `transition`, `:enter`, APIs como `animateChild` e eventuais utilitários recentes como `animate.enter` quando aplicável).
  - Se necessário para transmitir melhor o feedback ao usuário, poderá ser avaliada a adoção de uma **biblioteca de animação de terceiros**, isolada em um módulo/serviço de UI próprio (similar à abordagem com Angular Material), mantendo acoplamento baixo.
  - Esta decisão e eventual biblioteca serão detalhadas e justificadas em `architecture.md` para posterior inclusão nas Meta Specs.

### Padrões a Seguir

- Seguir os princípios do backlog de finalização de MVP (`temp/backlog-finalizacao-mvp.md`):
  - **Feature-first**: entregar um dashboard funcional e utilizável de ponta a ponta.
  - **Clean Architecture** e separação de responsabilidades (cálculos e regras de negócios em serviços/estados, componentes focados em UI).
  - **Angular moderno**: standalone, signals, reactive patterns, controle de fluxo novo.
  - **Responsividade mobile-first** e **WCAG 2.1 AA** obrigatórios.
- Manter o padrão de:
  - Estados reativos centralizados (`GoalsState`, `BudgetState` etc.).
  - Components pequenos e focados (cada widget com responsabilidade única).
  - Tratamento de loading/empty/error states em cada widget.

## 🧪 Estratégia de Testes

### Testes Necessários

- **Testes unitários de componentes de widget**:

  - `GoalsProgressWidgetComponent`: cálculos de percentuais, exibição de valores restantes e aportes sugeridos, estados de loading/empty.
  - `FinancialHealthIndicatorComponent`: cálculo e exibição dos indicadores de saúde, cores semânticas e tooltips.
  - `SuggestedActionsComponent`: geração de sugestões a partir de estados de metas/orçamentos, navegação ao clicar.
  - `CategorySpendingWidgetComponent`: visualização parcial de gastos por categoria com os dados atuais.
  - `RecentAchievementsComponent`: detecção de conquistas e rendering dos cards.

- **Testes unitários de lógica de cálculo** (quando extraída para serviços/helpers):
  - Funções que calculam progresso agregado de metas.
  - Funções que definem indicadores de saúde financeira.
  - Funções que geram sugestões de ação com base em critérios de prazo/progresso/aportes.

### Critérios de Aceitação

- [ ] Progresso das metas é o elemento visual mais proeminente no dashboard (layout e hierarquia visual).
- [ ] Barras de progresso visuais e informações de metas (percentual, valor restante, aporte sugerido) funcionam corretamente.
- [ ] Indicadores de saúde financeira são calculados e exibidos com cores e tooltips adequados.
- [ ] Próximas ações sugeridas são relevantes, acionáveis e navegam para as telas corretas.
- [ ] Gastos por categoria são exibidos com a melhor precisão possível no estágio atual e evoluem para **% do planejado** quando envelopes forem implementados.
- [ ] Conquistas recentes são detectadas e exibidas com feedback visual claro.
- [ ] Dashboard é responsivo em mobile, tablet e desktop.
- [ ] Acessibilidade WCAG 2.1 AA validada na tela do dashboard.
- [ ] Testes unitários com cobertura > 80% para a funcionalidade relacionada ao dashboard.

## 🔗 Dependências e Impactos

### Sistemas Afetados

- **Dashboard**:
  - `DashboardPage` e `DashboardWidgetsComponent` / `os-dashboard-widgets-container`.
- **Metas**:
  - `GoalsState`, `GoalsApiService`, componentes de metas existentes (para navegação e possivelmente para reaproveitar UI).
- **Orçamentos**:
  - `BudgetState`, `BudgetService`, `BudgetSelectionService`, `DashboardDataService`.
- **Notificações e feedback**:
  - `NotificationService` para mensagens de sucesso/erro relacionadas a ações do dashboard (quando aplicável).

### Integrações Necessárias

- Integração de leitura com:
  - `GoalsState` para dados de metas.
  - `BudgetState` / `DashboardDataService` para dados de orçamento, overview e gastos.
- Navegação para:
  - `/goals`, `/budgets/:id`, `/transactions`, `/accounts` a partir de cards/widgets de ações sugeridas e elementos do dashboard.
- Futuras integrações:
  - `CategoryState` e `EnvelopeState` (Cards 2 e 3 do backlog) para enriquecer `CategorySpendingWidgetComponent` e os indicadores de saúde financeira.

## 🚧 Restrições e Considerações

### Limitações Técnicas

- Sistema de **Categorias** (Card 2) e **Envelopes** (Card 3) ainda não implementados ou podem estar em evolução, o que limita, na primeira versão, a fidelidade dos cálculos de gastos por categoria como **% do planejado**.
- O produto só será lançado após a conclusão do backlog de finalização do MVP (`@backlog-finalizacao-mvp.md`), o que significa que:
  - Versão inicial do dashboard pode operar de forma parcial em alguns widgets.
  - A versão final da feature deve estar alinhada com o estado completo do backlog (principalmente Cards 2, 3 e 4).

### Riscos

- **Risco de divergência de métricas**:

  - Existe risco de a implementação de front-end não ser mantida em sincronia com as definições oficiais de saúde financeira nas Meta Specs (`financial-health.md`).
  - Mitigação: documentar claramente, em `architecture.md`, como cada indicador exibido no dashboard mapeia para as definições de `financial-health.md`, facilitando revisões e garantindo alinhamento contínuo.

- **Risco de complexidade visual**:

  - Muitos widgets no dashboard podem gerar sobrecarga visual.
  - Mitigação: manter foco forte no bloco central de progresso de metas e tratar os demais widgets como suporte, com hierarquia visual clara.

- **Dependência de features futuras**:
  - Parte do valor completo do dashboard (ex.: % do planejado por categoria) depende de categorias/envelopes.
  - Mitigação: projetar os widgets de forma a suportar dados parciais agora e enriquecer depois sem grandes refactors.

## 📚 Referências

- **Issue/Card**: OS-235 – Dashboard Centrado em Progresso (Jira).
- **Backlog MVP**: `temp/backlog-finalizacao-mvp.md` – Card 1.
- **Código existente**:
  - `DashboardPage` (`src/app/features/dashboard/pages/dashboard/dashboard.page.ts`).
  - `GoalsState` (`src/app/features/goals/state/goals-state/goals.state.ts`).
  - `BudgetState` (`src/app/core/services/budget/budget.state.ts`).
- **Meta Specs**:
  - Documento `financial-health.md` (conceito e indicadores de saúde financeira do Orça Sonhos).
  - Demais documentos de Meta Specs relacionados a metas, orçamento e envelopes, que contextualizam os indicadores utilizados no dashboard.
