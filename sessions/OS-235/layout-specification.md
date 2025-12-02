# Dashboard Centrado em Progresso - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Colocar **progresso das metas** e **saúde financeira** no centro da experiência, transmitindo:

- Clareza imediata do **estado financeiro atual** (progresso de metas + indicadores-chave).
- **Motivação visual** (barras de progresso, conquistas, cores semânticas).
+- **Próximos passos claros** (ações sugeridas que orientam o usuário).

### Tipo de Layout

- **Tipo**: Dashboard motivacional com múltiplos widgets.
- **Estrutura base**: Header da página + grid de widgets (`OsPageComponent` + `OsPageHeaderComponent` + `OsDashboardWidgetsComponent`).

### Público-Alvo

- **Universal**, com forte ênfase em:
  - Usuários **mobile-first** (uso recorrente em smartphone).
  - Usuários em estágio de **Engajamento** e **Adoção** (ver customer-journey).

### Persona Primária

- **Principal**: **Ana – A Organizadora Familiar**
  - Gerencia finanças da casa, usa planilhas hoje.
  - Precisa enxergar **progresso de metas familiares** e **saúde financeira** de forma simples.
  - Provável acesso em desktop e mobile, com leve preferência por desktop/tablet para momentos de planejamento.
- **Secundária**: **Carlos – Jovem Planejador**
  - Usa mais **mobile**, precisa de clareza rápida (“quanto falta para meu objetivo?”).

**Características relevantes para o layout:**

- **Necessidade de clareza visual**: poucos elementos muito bem hierarquizados.
- **Baixa tolerância a ruído visual**: evitar excesso de texto e gráficos complexos.
- **Motivação por progresso**: destacar conquistas e avanços.
- **Contexto de uso**:
  - Consultas rápidas diárias/semanais (mobile).
  - Sessões mais longas de planejamento (desktop/tablet).

### Contexto de Uso

- **Tela principal após login** (para usuários já onboardados).
- Estágio de jornada: principalmente **Engajamento Inicial** e **Adoção**:
  - Exploração do dashboard.
  - Acompanhamento recorrente de metas.
  - Geração de confiança no sistema.

### Funcionalidades Core Relacionadas

- `03_funcionalidades_core.md`:
  - **Sistema de Metas SMART**.
  - **Múltiplos Orçamentos**.
  - **Dashboard Centrado em Progresso** (feature foco deste layout).
  - **Sistema Dual Orçamentos + Contas** (para contexto).
  - **Transações Temporalmente Flexíveis** (para indicadores de fluxo de caixa).
  - **Compartilhamento Familiar** (influencia quem vê os dados).

### Considerações da Jornada do Usuário

- **Estágio alvo**: **Engajamento Inicial** → **Adoção**.
- Objetivos do usuário neste estágio:
  - Entender **para onde vai o dinheiro**.
  - Ver **progresso das metas** com clareza.
  - Ver **se está “bem” ou “em risco”** (saúde financeira).
  - Saber **o que fazer em seguida** (próximas ações).
- Touchpoints críticos:
  - **Primeiro acesso ao dashboard** após onboarding.
  - **Primeira visualização de metas com progresso significativo**.
  - **Primeira conquista exibida** (meta alcançada, reserva em patamar saudável).

## 📱 Responsive Strategy

### Breakpoints Definidos (alinhado a `responsive-design.md`)

- **Mobile (≤ 575px)**:
  - **Layout**: `single column`, widgets empilhados verticalmente.
  - **Ordem**:
    1. Progresso de Metas (full-width, ocupa primeira dobra).
    2. Indicadores de Saúde Financeira.
    3. Próximas Ações.
    4. Gastos por Categoria.
    5. Conquistas Recentes.
  - **Comportamento**:
    - Títulos e métricas maiores, cards tocáveis.
    - Scrolling vertical apenas; **sem scroll horizontal**.
    - Touch targets ≥ 44px.

- **Tablet (576–991px)**:
  - **Layout**: grid de 2–3 colunas usando `OsDashboardWidgetsComponent` com 8-col grid (vide SCSS).
  - **Comportamento**:
    - Progresso de Metas ocupando **largura maior** (span 8 colunas ou full).
    - Demais widgets organizados em 2 colunas abaixo, mantendo Progresso sempre no topo.

- **Desktop (≥ 992px)**:
  - **Layout**: grid 12-col (`os-dashboard-widgets__grid`).
  - **Sugestão de distribuição**:
    - Linha 1:
      - `goal-progress`: **span 8–12 colunas** (preferencialmente full-width nas primeiras versões).
      - Opcionalmente `financial-health` ao lado (span 4) em telas > 1200px.
    - Linhas subsequentes:
      - `financial-health`, `suggested-actions`, `category-spending`, `recent-achievements` distribuídos em blocos de 4–6 colunas cada, mantendo leitura em “Z”.

### Mobile-First Approach

- Estilos base considerando **mobile** como default (1 coluna, ordem de leitura clara).
- Uso de mixins definidos em `responsive-design.md` para escalar para tablet e desktop:
  - `@include tablet-up { ... }`
  - `@include desktop-up { ... }`

### Touch Interactions

- Cards de widgets e itens clicáveis:
  - Min-height ≥ `var(--os-touch-target-ideal)` (≈ 48px).
  - Padding horizontal generoso em mobile.
  - Estados `hover` apenas enriquecem, **não** são únicos indicadores.
- Considerar uso parcial de padrões como `os-swipe-card` apenas se fizer sentido para listas internas (ex.: conquistas recentes) em versões futuras; **não obrigatório na primeira versão**.

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

- **Templates / Organisms**
  - `OsPageComponent` + `OsPageHeaderComponent`:
    - Já usados em `DashboardPage`, mantidos como container principal.
  - `OsDashboardWidgetsComponent`:
    - Mantido como organismo que controla:
      - Grid responsivo de widgets.
      - Estados de loading/empty/error (`DashboardState`).
      - Interação base (click em widgets).

- **Atoms/Molecules relevantes**
  - `os-button`: ações dentro de widgets (ver detalhes, navegar).
  - `os-icon`: ícones de status (sucesso, aviso, erro, dinheiro, gráfico).
  - `os-label` / `os-badge`: rótulos e badges para status (ex.: “On-track”, “Atrasada”, “Saudável”).
  - `os-spinner`: estados de loading dentro de widgets se necessário.
  - `os-card`: estrutura interna para cards (conquistas, ações sugeridas).
  - `os-money-display` (se já existente) ou padrão de exibição monetária centralizado.

### Novos Componentes (Especificação de Layout – alto nível)

> Implementação detalhada (inputs, outputs) ficará na fase `/plan` + `/work`, aqui focamos nas **características visuais e de UX**.

- **`GoalsProgressWidgetComponent` (Organism local de feature)**
  - **Propósito**: Ser o **hero widget** do dashboard.
  - **Layout**:
    - Header com título (“Progresso das Metas”) e subtítulo curto.
    - Seção principal com:
      - Visão agregada (ex.: total de metas, % on-track).
      - Lista de metas (3–5 principais) com:
        - Barra de progresso horizontal.
        - Nome da meta.
        - Valor acumulado vs alvo.
        - Badge indicando status (on-track/atrasada/adiantada).
    - Link/ação “Ver todas as metas” (`os-button` texto + ícone).
  - **Responsividade**:
    - Mobile: lista vertical simples.
    - Desktop: duas colunas internas (metas principais + resumo rápido).

- **`FinancialHealthIndicatorComponent` (Organism local de feature)**
  - **Propósito**: Mostrar os 3–4 indicadores definidos em `financial-health.md` de forma compacta.
  - **Layout**:
    - Header com título (“Saúde Financeira”).
    - Grid interno de 2×2 cards:
      - `Uso de orçamento` (barra + status).
      - `Receitas vs Despesas` (ícone de tendência + legenda).
      - `% Metas on-track` (badge + barra circular/opcional).
      - `Reserva de emergência (meses)` (chip com cor por faixa).
  - **Cores**:
    - Usar tokens semânticos:
      - Verde: `--os-color-success-*`.
      - Amarelo: `--os-color-warning-*`.
      - Vermelho: `--os-color-error`.
  - **Acessibilidade**:
    - Nunca depender **só de cor** para status: incluir ícones e texto (“Saudável”, “Atenção”, “Crítico”).

- **`SuggestedActionsComponent`**
  - **Propósito**: Listar **3–5 ações** de alto impacto, cada uma como card clicável.
  - **Layout**:
    - Stack de cards com:
      - Ícone contextual (ex.: `trending-down`, `warning`, `money`).
      - Título curto (ex.: “Aporte sugerido para meta X”).
      - Descrição de 1 linha.
      - CTA discreta (ex.: “Ver detalhes”).
  - **Interação**:
    - Clique em toda a área do card.
    - Foco por teclado com `outline` visível.

- **`CategorySpendingWidgetComponent`**
  - **Propósito**: Mostrar em versão simplificada:
    - Distribuição de gastos por categoria vs total.
  - **Layout**:
    - Lista ou gráfico simplificado (ex.: barras horizontais) com:
      - Nome da categoria.
      - Percentual do total.
      - Valor gasto.
    - Mensagem explicando que visão completa de `% do planejado` virá com envelopes (enquanto não implementado).

- **`RecentAchievementsComponent`**
  - **Propósito**: Celebrar conquistas recentes.
  - **Layout**:
    - Pequenos cards horizontais com:
      - Ícone de sucesso (`success`, `trophy`, etc.).
      - Título (“Meta X alcançada”, “Reserva chegou a 3 meses”).
      - Data.
  - **Animações**:
    - Entrada suave (ex.: fade/slide curto).
    - Respeitar `prefers-reduced-motion`.

## 🏗️ Layout Structure

### Grid System (baseado em `os-dashboard-widgets`)

- **Desktop**:
  - Grid 12-col (`grid-template-columns: repeat(12, 1fr)`).
  - Gaps:
    - Desktop: `var(--os-dashboard-widgets-gap-desktop)`.
    - Tablet: `var(--os-dashboard-widgets-gap-tablet)`.
    - Mobile: `var(--os-dashboard-widgets-gap-mobile)`.
- **Mapeamento de tamanhos**:
  - `small` → span 3–4 colunas (dependendo do breakpoint).
  - `medium` → span 6.
  - `large` → span 8.
  - `full` → span 12.
- **Aplicação no dashboard**:
  - `goal-progress`: `size = 'large'` ou `'full'`, `type` com classe extra para ocupar 2 linhas se necessário (já suportado no SCSS).
  - Demais widgets: `medium`/`small` conforme importância visual.

### Seções

- **Header da Página (`OsPageHeaderComponent`)**
  - Título: “Dashboard”.
  - Subtítulo: “Visão geral do seu orçamento e metas”.
  - Ações futuras possíveis: seleção de orçamento, filtros de período (não obrigatório na primeira versão).

- **Main / Conteúdo**
  - Wrapper: `<main class="dashboard-page__main" role="main" aria-label="Conteúdo do dashboard">`.
  - Conteúdo:
    - `os-dashboard-widgets-container` usando `OsDashboardWidgetsComponent` internamente.
  - **Ordem visual** controlada via `WidgetConfiguration.position` + grid do organismo.

### Spacing Strategy

- Basear-se em tokens de spacing:
  - Entre widgets: `var(--os-dashboard-widgets-gap-*)`.
  - Dentro dos widgets:
    - Padding: `var(--os-spacing-4)` desktop, `var(--os-spacing-3)` mobile.
    - Espaço entre header e conteúdo interno: `var(--os-spacing-3/4)`.

### Visual Hierarchy

1. **Hero**: `GoalsProgressWidgetComponent` (título + barras de progresso).
2. **Segundo nível**:
   - `FinancialHealthIndicatorComponent`.
   - `SuggestedActionsComponent`.
3. **Terceiro nível**:
   - `CategorySpendingWidgetComponent`.
   - `RecentAchievementsComponent`.

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**
  - Ordem lógica: skip link (padrão global) → header → seleção de orçamento (se houver) → **hero widget** → demais widgets.
  - Widgets:
    - Cada card/action deve ser um elemento interativo (`button`/`a`) com `os-focusable` e `outline` consistente.

- **ARIA Landmarks**
  - `header` já tratado pelo template base.
  - `main role="main"` na área de widgets.
  - Cada widget pode usar:
    - `role="region"` com `aria-labelledby` apontando para o título do widget, para navegação de leitores de tela.

- **Labels e Descriptions**
  - Indicadores de status (`Saudável`, `Atenção`, `Crítico`) sempre em texto legível, não apenas cor.
  - Tooltips informativos via `matTooltip`/equivalente, com textos claros.

- **Contraste e Tipografia**
  - Usar cores semânticas da paleta (`--os-color-success`, `--os-color-warning`, `--os-color-error`) com contraste mínimo 4.5:1 para textos.
  - Font-size mínimo 14px (`--os-font-size-sm`), preferir 16px para textos principais.

- **Motion**
  - Todas as animações dos widgets devem:
    - Ser ≤ 300ms.
    - Desativar suavemente sob `prefers-reduced-motion` (conforme snippet em `responsive-design.md`).

## 🎭 States and Interactions

### Global States por Widget (via `DashboardState` e dados internos)

- **Loading**:
  - `OsDashboardWidgetsComponent` já possui estado; para cada widget:
    - Skeleton simples ou spinner com texto “Carregando …”.
- **Empty**:
  - Mensagem contextual:
    - Metas: “Você ainda não tem metas. Comece criando sua primeira meta.”
    - Ações sugeridas: “Nenhuma ação sugerida no momento. Continue acompanhando suas metas.”
- **Error**:
  - Texto claro: “Não foi possível carregar [metas/dados de saúde financeira].”
  - Botão `os-button` secundário “Tentar novamente”.

### Micro-interactions

- Hover:
  - Elevação leve (`box-shadow`), sutil mudança de borda (`--os-color-primary-300`).
- Focus:
  - `outline` 2px (`--os-focus-ring`), offset consistente.
- Animações:
  - Entrada dos widgets (slide/fade pequeno) pode usar APIs de animação modernas do Angular; sem “sacudir” a tela, foco em suavidade.

## 📐 Visual Specifications (Wireframes Textuais)

### Mobile (< 576px)

```
Header
┌──────────────────────────────┐
│ Título: Dashboard            │
│ Sub: Visão geral...          │
└──────────────────────────────┘

Main (scroll vertical)
┌──────────────────────────────┐
│ Widget: Progresso de Metas   │
│ - Resumo + lista             │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Widget: Saúde Financeira     │
│ - 2x2 cards empilhados       │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Widget: Próximas Ações       │
│ - Lista de 3-5 cards         │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Widget: Gastos por Categoria │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Widget: Conquistas Recentes  │
└──────────────────────────────┘
```

### Tablet (576–991px)

```
Header (full width)

Grid 2 colunas
┌──────────────────────────────┐
│ Progresso Metas (full/2 col) │
└──────────────────────────────┘
┌───────────────┬──────────────┐
│ Saúde Fin.    │ Próx. Ações  │
└───────────────┴──────────────┘
┌───────────────┬──────────────┐
│ Gastos Cat.   │ Conquistas   │
└───────────────┴──────────────┘
```

### Desktop (≥ 992px)

```
Header

Grid 12 colunas
┌──────────────────────────────────────────────┐
│ Progresso Metas (span 12 ou 8 + health 4)   │
└──────────────────────────────────────────────┘
┌──────────────────────────────┬──────────────┐
│ Saúde Financeira (span 6)    │ Próx. Ações  │
└──────────────────────────────┴──────────────┘
┌──────────────────────────────┬──────────────┐
│ Gastos por Categoria (6)     │ Conquistas   │
└──────────────────────────────┴──────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar (resumo)

- **Novos (feature dashboard)**:
  - `GoalsProgressWidgetComponent`.
  - `FinancialHealthIndicatorComponent`.
  - `SuggestedActionsComponent`.
  - `CategorySpendingWidgetComponent`.
  - `RecentAchievementsComponent`.
- **Modificações**:
  - `DashboardPage`: reconfiguração de widgets e posições para refletir hero + grid descritos.
  - `DashboardWidgetsComponent` / `OsDashboardWidgetsComponent`: garantir suporte a novos tipos de widget e mapear `size`/`position` corretamente.

### Impacto em Performance

- Mantém:
  - `ChangeDetectionStrategy.OnPush` em todos os widgets.
  - Uso de signals/computed para dados derivados.
- Evitar:
  - Gráficos pesados ou libs extras na primeira versão; usar estruturas baseadas em CSS/HTML sempre que possível.

### Integration Points

- `DashboardInsightsService` fornece:
  - Dados de indicadores de saúde.
  - Lista de ações sugeridas.
  - Lista de conquistas recentes.
  - Dados agregados para gastos por categoria.
- `DashboardWidgetsComponent` repassa esses dados via `DashboardWidget.data` para cada componente de widget.

## 🧪 Layout Validation Criteria (para fase /work)

- **Design System Compliance**
  - [ ] Uso consistente de `os-*` para UI.
  - [ ] Tokens de cor/spacing/tipografia usados no SCSS dos widgets.

- **Responsiveness**
  - [ ] Sem scroll horizontal em nenhuma resolução suportada.
  - [ ] Progresso de metas sempre visível “acima da dobra” em mobile e desktop.
  - [ ] Grid se ajusta corretamente entre mobile / tablet / desktop.

- **Accessibility**
  - [ ] Todos os widgets com `role="region"` e `aria-labelledby`.
  - [ ] Foco visível em todos os elementos interativos.
  - [ ] Indicadores não dependem apenas de cor para expressar estado.

- **Performance**
  - [ ] Nenhuma lib gráfica pesada extra sem necessidade.
  - [ ] Uso de OnPush e signals para minimização de renders.

- **Visual Quality**
  - [ ] Hierarquia visual clara (hero > indicadores > suporte).
  - [ ] Espaçamentos consistentes entre widgets e dentro deles.
  - [ ] Estados de loading/empty/error implementados.


