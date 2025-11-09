# Relatórios Financeiros Simples - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

O layout de relatórios financeiros deve comunicar **clareza e insights visuais** sobre os gastos e receitas do usuário. A interface deve ser **limpa, informativa e motivacional**, permitindo que o usuário entenda rapidamente para onde vai seu dinheiro e como está progredindo em relação às suas metas.

### Tipo de Layout

**Dashboard/Reports Page** - Página dedicada com visualizações gráficas e filtros

### Público-Alvo

**Mobile-first | Universal** - Funciona bem em mobile, tablet e desktop

### Persona Primária

**Roberto & Maria (Casal Experiente)** - Identificada como persona primária para relatórios financeiros

**Características da Persona:**

- 45 e 42 anos, casados, 3 filhos adolescentes
- Classe B, renda familiar R$ 15.000
- Usam app do banco para controle básico
- Têm várias metas simultâneas
- Precisam de controle detalhado
- Querem preparar aposentadoria
- Experiência financeira intermediária

**Necessidades Específicas:**

- Muitas metas competindo por recursos
- Dificuldade para priorizar objetivos
- Controle fragmentado em várias ferramentas
- Falta visão consolidada do progresso
- Necessidade de planejamento de longo prazo
- Querem relatórios consolidados para análise

**Contexto de Uso:**

- Desktop principalmente (análise mais detalhada)
- Mobile para consultas rápidas
- Uso regular (semanal/mensal) para revisão financeira
- Compartilhamento com parceiro para tomada de decisão

### Contexto de Uso

A página de relatórios será acessada:

- Via menu principal (nova rota `/reports`)
- Após análise de transações no dashboard
- Quando usuário quer entender distribuição de gastos
- Para revisão mensal de finanças
- Antes de tomar decisões financeiras importantes

### Funcionalidades Core Relacionadas

**Extraídas dinamicamente de 03_funcionalidades_core.md:**

1. **Dashboard Centrado em Progresso** - Relatórios complementam o dashboard com análises mais profundas
2. **Sistema de Metas SMART** - Relatórios mostram impacto dos gastos nas metas
3. **Múltiplos Orçamentos** - Filtro por orçamento permite análise específica
4. **Transações Temporalmente Flexíveis** - Filtros de período aproveitam transações passadas, presentes e futuras

### Considerações da Jornada do Usuário

**Estágio da Jornada:**

- **Adoção (D+7 a D+30)** - Usuários que já estão usando regularmente e querem insights mais profundos

**Objetivos do Usuário neste Estágio:**

- Entender para onde vai o dinheiro de forma visual
- Identificar categorias com maior gasto
- Comparar receitas vs despesas
- Ver progresso em relação às metas
- Tomar decisões informadas sobre gastos futuros
- Priorizar objetivos financeiros

**Valor Percebido Esperado:**

- "Agora entendo onde está indo meu dinheiro"
- "Posso ver claramente quais categorias preciso controlar"
- "Os gráficos me ajudam a visualizar melhor minha situação financeira"
- "Consigo comparar períodos e ver evolução"

**Touchpoints Críticos:**

- **Primeiro acesso**: Interface deve impressionar com visualizações claras
- **Filtro por período**: Deve ser intuitivo e rápido
- **Interpretação dos gráficos**: Deve ser autoexplicativo
- **Ação após análise**: Deve sugerir próximos passos quando aplicável

**Friction Points a Evitar:**

- Gráficos muito complexos ou difíceis de interpretar
- Filtros confusos ou lentos
- Falta de contexto (valores absolutos vs percentuais)
- Informações demais sem hierarquia clara

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column
  - Touch targets: >= 44px
  - Gráficos: Altura reduzida mas legível (min 250px)
  - Filtros: Stack vertical completo
  - Cards: Full width com padding reduzido
  - Scroll: Vertical apenas, sem scroll horizontal

- **Tablet (576-991px)**:

  - Layout: Grid 2 colunas para gráficos quando possível
  - Navegação: Filtros em linha horizontal compacta
  - Gráficos: Altura média (300-350px)
  - Cards: Grid 2 colunas para resumos numéricos
  - Espaçamento: Padding médio (16px)

- **Desktop (992px+)**:
  - Layout: Grid flexível (12 colunas)
  - Gráficos: Altura maior (400px+) para melhor visualização
  - Filtros: Barra horizontal no topo
  - Cards: Grid 3-4 colunas para métricas
  - Hover states: Ativos em elementos interativos
  - Side-by-side: Gráficos podem ficar lado a lado

### Mobile-First Approach

**Estratégia de Progressive Enhancement:**

1. **Base Mobile**: Layout vertical simples, gráficos empilhados
2. **Tablet**: Adiciona grid 2 colunas, otimiza espaçamento
3. **Desktop**: Expande para grid completo, gráficos maiores, hover states

**Prioridades Mobile:**

- Filtros sempre visíveis e acessíveis
- Gráficos legíveis mesmo em telas pequenas
- Valores numéricos destacados e fáceis de ler
- Ações principais sempre acessíveis (sem scroll excessivo)

### Touch Interactions

- **Swipe**: Não necessário (gráficos são estáticos no MVP)
- **Tap**: Seleção de filtros, interação com gráficos (tooltips)
- **Long Press**: Futuro - detalhes adicionais
- **Pinch/Zoom**: Futuro - zoom em gráficos

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: `secondary` para ações secundárias
  - Size: `medium` para filtros, `small` para ações inline
  - Usage: Botões de ação nos filtros, refresh de dados

- **os-icon**:

  - Names: `chart`, `filter`, `refresh`, `trending-up`, `trending-down`, `money`
  - Usage: Ícones decorativos em cards, botões de ação

- **os-label**:

  - Size: `medium` para títulos de seções, `small` para labels de filtros
  - Weight: `semibold` para títulos, `medium` para labels
  - Usage: Labels de filtros, títulos de gráficos

- **os-input**:

  - Type: Não usado diretamente (filtros usam os-select)
  - Usage: Não aplicável para esta feature

- **os-select**:

  - Size: `medium` para filtros principais
  - Options: Período (mês atual, mês anterior, últimos 3 meses), Orçamento
  - Usage: Filtros de período e orçamento

- **os-progress-bar**:
  - Variant: `primary` para indicadores de progresso
  - Usage: Não usado diretamente nos gráficos, mas pode ser usado em resumos

#### Molecules

- **os-card**:

  - Variant: `default` para containers de gráficos, `elevated` para cards de resumo
  - Size: `medium` para cards padrão
  - Usage: Container para cada gráfico, cards de resumo numérico

- **os-budget-selector**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Filtro de orçamento quando usuário tem múltiplos

#### Organisms

- **os-page-header**:

  - Variant: `default`
  - Size: `medium`
  - Usage: Cabeçalho da página com título "Relatórios Financeiros"

- **os-filter-bar** (se disponível):
  - Variant: `compact` para barra de filtros
  - Usage: Container para filtros de período e orçamento

#### Templates

- **os-dashboard-template** (referência):
  - Não usado diretamente, mas layout similar ao dashboard
  - Estrutura de grid e widgets pode ser referência

### Novos Componentes (Especificação Detalhada)

#### os-chart-container (Molecule)

**Propósito:**
Container padronizado para gráficos da camada de abstração (PieChartComponent/BarChartComponent) com título, legenda e estados (loading, error, empty). Não depende diretamente do ng2-charts, mas sim dos componentes da camada de abstração.

**Design Specs:**

- **Padding**: 24px horizontal, 20px vertical (desktop), 16px mobile
- **Border**: 1px solid --os-color-border
- **Border-radius**: 8px (--os-border-radius-md)
- **Background**: --os-color-background-primary
- **Typography**:
  - Título: --os-font-size-lg, --os-font-weight-semibold
  - Subtítulo: --os-font-size-sm, --os-font-weight-normal, --os-color-text-secondary

**States:**

- **Default**: Card com gráfico renderizado
- **Loading**: Skeleton do gráfico ou spinner centralizado
- **Error**: Ícone de erro + mensagem + botão retry
- **Empty**: Ícone ilustrativo + mensagem "Nenhum dado disponível"

**Responsiveness:**

- Mobile: Padding reduzido (16px), altura mínima do gráfico 250px
- Tablet: Padding médio (20px), altura mínima 300px
- Desktop: Padding completo (24px), altura mínima 400px

**Accessibility:**

- **Role**: `region`
- **ARIA**:
  - `aria-label`: "Gráfico de [tipo], [descrição]"
  - `aria-describedby`: ID do título do gráfico
- **Keyboard**: Tab para focar no container, Enter para interagir (se aplicável)

**Variants:**

- `default`: Card padrão
- `compact`: Versão reduzida para mobile

#### os-report-summary-card (Molecule)

**Propósito:**
Card de resumo numérico (ex: Total de gastos, Total de receitas, Diferença)

**Design Specs:**

- **Padding**: 20px (desktop), 16px (mobile)
- **Border**: 1px solid --os-color-border
- **Border-radius**: 8px
- **Background**: --os-color-background-primary
- **Typography**:
  - Label: --os-font-size-sm, --os-font-weight-medium, --os-color-text-secondary
  - Value: --os-font-size-2xl, --os-font-weight-bold, --os-color-text-primary
  - Change: --os-font-size-sm, --os-font-weight-medium (verde/vermelho)

**States:**

- **Default**: Valores normais
- **Positive**: Valor positivo (receitas > despesas) - cor verde
- **Negative**: Valor negativo (despesas > receitas) - cor vermelha
- **Neutral**: Valores neutros

**Responsiveness:**

- Mobile: Stack vertical, full width
- Tablet: Grid 2 colunas
- Desktop: Grid 3-4 colunas

**Accessibility:**

- **Role**: `article`
- **ARIA**:
  - `aria-label`: "[Label]: [Valor]"
  - `aria-describedby`: ID do label

## 🏗️ Layout Structure

### Grid System

- **Columns**: 12-col desktop, 8-col tablet, 1-col mobile
- **Gap**: 24px desktop, 16px tablet, 12px mobile
- **Max Width**: 1200px container (--os-container-xl)

### Sections

#### Header

- **Components**: os-page-header
- **Height**: Auto (conteúdo)
- **Sticky**: Não
- **Content**:
  - Título: "Relatórios Financeiros"
  - Subtítulo: "Análise visual dos seus gastos e receitas"
  - Z-index: 100

#### Filters Bar

- **Components**: os-filter-bar (ou div customizado), os-select, os-budget-selector
- **Height**: Auto (conteúdo)
- **Sticky**: Sim (sticky top após scroll)
- **Background**: --os-color-background-primary
- **Border**: Bottom border 1px solid --os-color-border
- **Padding**: 16px vertical, 24px horizontal
- **Z-index**: 99

**Filtros:**

1. **Período** (os-select):

   - Opções: "Mês Atual", "Mês Anterior", "Últimos 3 Meses"
   - Default: "Mês Atual"
   - Width: 200px (desktop), full width (mobile)

2. **Orçamento** (os-budget-selector):
   - Apenas se usuário tem múltiplos orçamentos
   - Default: Orçamento selecionado atualmente
   - Width: 250px (desktop), full width (mobile)

#### Main Content

- **Layout**: Grid responsivo
- **Padding**: 24px desktop, 16px tablet, 12px mobile
- **Components**:
  - Cards de resumo numérico (grid)
  - Gráfico de gastos por categoria (full width ou 2/3)
  - Gráfico de receitas vs despesas (full width ou 2/3)

**Estrutura de Grid:**

**Desktop (>= 992px):**

```
┌─────────────────────────────────────────────────────────┐
│ Summary Cards (Grid 3 colunas)                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │ Total    │ │ Receitas │ │ Diferença│                │
│ │ Gastos   │ │          │ │          │                │
│ └──────────┘ └──────────┘ └──────────┘                │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Gráfico: Gastos por Categoria (Pie Chart)          │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Gráfico: Receitas vs Despesas (Bar Chart)          │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Tablet (576-991px):**

```
┌─────────────────────────────────────┐
│ Summary Cards (Grid 2 colunas)      │
│ ┌──────────┐ ┌──────────┐          │
│ │ Total    │ │ Receitas │          │
│ │ Gastos   │ │          │          │
│ └──────────┘ └──────────┘          │
│ ┌──────────┐                        │
│ │ Diferença│                        │
│ └──────────┘                        │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Gastos por Categoria            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Receitas vs Despesas            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Mobile (< 576px):**

```
┌─────────────────────┐
│ Summary Cards       │
│ ┌─────────────────┐ │
│ │ Total Gastos    │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Receitas        │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Diferença       │ │
│ └─────────────────┘ │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Gastos por      │ │
│ │ Categoria       │ │
│ │                 │ │
│ └─────────────────┘ │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Receitas vs     │ │
│ │ Despesas        │ │
│ │                 │ │
│ └─────────────────┘ │
└─────────────────────┘
```

#### Footer

- **Components**: Não aplicável (página completa)
- **Height**: Auto

### Spacing Strategy

- **Section Gaps**: 32px desktop, 24px tablet, 16px mobile
- **Component Gaps**: 24px desktop, 16px tablet, 12px mobile
- **Card Padding**: 24px desktop, 20px tablet, 16px mobile
- **Consistent Padding Scale**: 8px, 12px, 16px, 20px, 24px, 32px

### Visual Hierarchy

1. **Nível 1 - Título da Página**: H1, maior destaque, cor primária
2. **Nível 2 - Cards de Resumo**: Valores grandes, cards destacados
3. **Nível 3 - Títulos dos Gráficos**: H2, dentro dos cards
4. **Nível 4 - Labels e Legendas**: Texto secundário, menor

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - header → filters → summary cards → gráficos
- **Focus Management**:
  - Visible focus ring em todos elementos interativos (2px solid --os-color-primary)
  - Focus trap em modals (se aplicável no futuro)
- **Shortcuts**:
  - Não aplicável para MVP
- **Skip Links**:
  - Skip to main content (se implementado globalmente)

#### ARIA Implementation

**Landmarks:**

- `<header role="banner">` - Header principal da página
- `<nav role="navigation">` - Barra de filtros (se aplicável)
- `<main role="main">` - Conteúdo principal com gráficos
- `<section role="region" aria-label="Resumo financeiro">` - Cards de resumo
- `<section role="region" aria-label="Gráfico de gastos por categoria">` - Gráfico 1
- `<section role="region" aria-label="Gráfico de receitas vs despesas">` - Gráfico 2

**Live Regions:**

- `aria-live="polite"` para atualizações de dados após filtro
- `aria-live="assertive"` para erros críticos de carregamento

**Labels e Descriptions:**

- Todos selects com labels associados (`<label for="...">`)
- Gráficos com `aria-label` descritivo: "Gráfico de pizza mostrando distribuição de gastos por categoria"
- Ícones decorativos com `aria-hidden="true"`
- Botões com `aria-label` descritivos: "Filtrar por mês atual", "Atualizar dados"

**Acessibilidade dos Gráficos (via Camada de Abstração):**

- A camada de abstração implementa ARIA via Chart.js plugins
- Implementar `chartjs-plugin-datalabels` para labels acessíveis (na camada de abstração)
- Adicionar `role="img"` nos canvas dos gráficos (via componentes base da camada)
- Fornecer alternativa textual (tabela) abaixo dos gráficos para screen readers
- ChartConfig genérico permite configurar acessibilidade sem conhecer Chart.js diretamente

#### Visual Accessibility

**Contraste:**

- Texto normal: >= 4.5:1 (--os-color-text-primary vs --os-color-background-primary)
- Texto grande (valores): >= 3:1
- UI Components (borders, backgrounds): >= 3:1
- Gráficos: Cores com contraste adequado entre si

**Typography:**

- Font-size mínimo: 16px (1rem) para body text
- Line-height: 1.5 para body text
- Escalável com zoom até 200% sem perda de funcionalidade
- Valores numéricos: Font-size maior (--os-font-size-2xl) para legibilidade

**Motion:**

- Respeita `prefers-reduced-motion`: Sem animações se usuário preferir
- Transições: <= 300ms para mudanças de estado
- Animações de gráficos: Suaves mas não excessivas
- Loading spinners: Animação discreta

#### Screen Reader Support

**Content Structure:**

- Headings hierárquicos: H1 (título página) → H2 (títulos gráficos)
- Tabelas alternativas abaixo dos gráficos com dados tabulares
- Descrições textuais dos gráficos antes do canvas

**Alt Text:**

- Não aplicável (gráficos são canvas, não imagens)
- Alternativa: Tabelas de dados abaixo dos gráficos

**Form Labels:**

- Associação explícita com `for` e `id`
- Labels visíveis sempre (não apenas placeholders)

**Error Messages:**

- Anunciados dinamicamente via `aria-live="assertive"`
- Mensagens claras e acionáveis

## 🎭 States and Interactions

### Global States

**Loading:**

- **Initial Load**: Skeleton screens para gráficos e cards
- **Filter Change**: Loading overlay discreto nos gráficos afetados
- **Button Loading**: Spinner em botões de ação
- **Indicador Visual**: Spinner centralizado ou skeleton

**Empty:**

- **No Data**:
  - Ícone ilustrativo (chart icon com estilo "empty")
  - Mensagem: "Nenhum dado disponível para o período selecionado"
  - Sugestão: "Tente selecionar outro período ou adicione transações"
- **No Transactions**:
  - Mensagem específica: "Você ainda não tem transações neste período"
  - Call-to-action: Link para adicionar transação

**Error:**

- **API Error**:
  - Ícone de erro
  - Mensagem: "Erro ao carregar dados. Tente novamente."
  - Botão: "Tentar Novamente"
- **Chart Error**:
  - Mensagem específica: "Erro ao renderizar gráfico"
  - Fallback: Mostrar dados em tabela

**Success:**

- **Filter Applied**:
  - Feedback visual discreto (não intrusivo)
  - Dados atualizados automaticamente
  - Foco retorna ao conteúdo principal

### Micro-interactions

**Hover:**

- **Cards**: Elevação sutil (box-shadow aumentado)
- **Buttons**: Background ligeiramente mais escuro
- **Selects**: Border color muda para --os-color-primary
- **Gráficos**: Tooltips aparecem no hover (configurado via ChartConfig genérico, implementado pela camada de abstração)

**Focus:**

- **Visible Ring**: 2px solid --os-color-primary, offset 2px
- **Scale**: Não aplicável (mantém tamanho original)
- **Outline**: Sempre visível em elementos interativos

**Active:**

- **Buttons**: Scale down ligeiro (0.98) + pressed state visual
- **Selects**: Mantém estado aberto até seleção

**Transitions:**

- **State Changes**: 200ms ease-in-out
- **Filter Updates**: 300ms para atualização de gráficos
- **Card Hover**: 150ms ease-out

### Component-Specific Interactions

**Gráfico de Pizza (Gastos por Categoria):**

- **Implementação**: Usa PieChartComponent da camada de abstração
- **Dados**: ChartData genérico convertido internamente para ng2-charts
- **Hover**: Tooltip mostra categoria, valor e percentual (configurado via ChartConfig)
- **Click**: Futuro - navegar para detalhes da categoria
- **Legend**: Click para destacar/ocultar categoria (configurado via ChartConfig)
- **Accessibility**: Tabela abaixo com todos os dados (implementada na camada de abstração)

**Gráfico de Barras (Receitas vs Despesas):**

- **Implementação**: Usa BarChartComponent da camada de abstração
- **Dados**: ChartData genérico convertido internamente para ng2-charts
- **Hover**: Tooltip mostra valor exato (configurado via ChartConfig)
- **Click**: Futuro - expandir detalhes
- **Accessibility**: Tabela abaixo com comparação (implementada na camada de abstração)

**Filtros:**

- **Select Change**: Atualização imediata dos dados
- **Loading State**: Discreto durante atualização
- **Error State**: Mensagem inline abaixo do select

**Cards de Resumo:**

- **Hover**: Elevação sutil (desktop apenas)
- **Click**: Não aplicável (apenas visual)
- **Animation**: Contador animado ao carregar (futuro)

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────────────────┐
│ Header (sticky)                    │
│ ┌───────────────────────────────┐ │
│ │ Relatórios Financeiros        │ │
│ │ Análise visual dos gastos     │ │
│ └───────────────────────────────┘ │
├─────────────────────────────────────┤
│ Filters Bar (sticky após scroll)   │
│ ┌───────────────────────────────┐ │
│ │ [Período ▼] [Orçamento ▼]    │ │
│ └───────────────────────────────┘ │
├─────────────────────────────────────┤
│ Main Content                        │
│ ┌───────────────────────────────┐ │
│ │ Total Gastos                  │ │
│ │ R$ 3.500,00                   │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Receitas                      │ │
│ │ R$ 5.000,00                   │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Diferença                     │ │
│ │ +R$ 1.500,00                  │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Gastos por Categoria          │ │
│ │                               │ │
│ │     [Pie Chart]               │ │
│ │     min-height: 250px          │ │
│ │                               │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Receitas vs Despesas          │ │
│ │                               │ │
│ │     [Bar Chart]               │ │
│ │     min-height: 250px         │ │
│ │                               │ │
│ └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Anotações:**

- Stack vertical completo
- Touch targets >= 44px em todos elementos interativos
- Sem scroll horizontal
- Gráficos com altura mínima 250px para legibilidade
- Padding reduzido (12px) para aproveitar espaço

### Tablet Layout (576-991px)

```
┌───────────────────────────────────────────────┐
│ Header                                        │
│ ┌──────────────────────────────────────────┐ │
│ │ Relatórios Financeiros                   │ │
│ └──────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Filters Bar                                   │
│ ┌──────────────────────────────────────────┐ │
│ │ [Período ▼] [Orçamento ▼]               │ │
│ └──────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Main Content                                  │
│ ┌──────────────┐ ┌──────────────┐           │
│ │ Total Gastos │ │ Receitas     │           │
│ │ R$ 3.500,00  │ │ R$ 5.000,00  │           │
│ └──────────────┘ └──────────────┘           │
│ ┌──────────────┐                             │
│ │ Diferença    │                             │
│ │ +R$ 1.500,00 │                             │
│ └──────────────┘                             │
│ ┌──────────────────────────────────────────┐ │
│ │ Gastos por Categoria                     │ │
│ │                                           │ │
│ │         [Pie Chart]                      │ │
│ │         min-height: 300px                │ │
│ │                                           │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Receitas vs Despesas                     │ │
│ │                                           │ │
│ │         [Bar Chart]                      │ │
│ │         min-height: 300px                │ │
│ │                                           │ │
│ └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

**Anotações:**

- Grid 2 colunas para cards de resumo
- Gráficos full width
- Navegação horizontal para filtros
- Padding médio (16px)

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Relatórios Financeiros                                  │ │
│ │ Análise visual dos seus gastos e receitas              │ │
│ └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Filters Bar (sticky)                                        │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ [Período ▼] [Orçamento ▼]                              │ │
│ └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Main Content                                                │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ Total Gastos │ │ Receitas     │ │ Diferença    │        │
│ │ R$ 3.500,00  │ │ R$ 5.000,00  │ │ +R$ 1.500,00 │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Gastos por Categoria                                   │ │
│ │                                                         │ │
│ │              [Pie Chart]                              │ │
│ │              min-height: 400px                        │ │
│ │                                                         │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Receitas vs Despesas                                    │ │
│ │                                                         │ │
│ │              [Bar Chart]                               │ │
│ │              min-height: 400px                         │ │
│ │                                                         │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Anotações:**

- Grid 3 colunas para cards de resumo
- Gráficos full width com altura maior
- Hover states ativos
- Padding completo (24px)
- Max width 1200px centralizado

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

1. **os-chart-container** (Molecule)

   - Container padronizado para gráficos
   - Estados: loading, error, empty
   - Integração com ng2-charts

2. **os-report-summary-card** (Molecule)

   - Card de resumo numérico
   - Variants: positive, negative, neutral
   - Responsivo

3. **spending-chart** (Component da feature)

   - Gráfico de pizza usando PieChartComponent da camada de abstração
   - Dados de gastos por categoria convertidos para formato genérico (ChartData, ChartConfig)
   - Integração com os-chart-container
   - Não depende diretamente do ng2-charts

4. **revenue-expense-chart** (Component da feature)

   - Gráfico de barras usando BarChartComponent da camada de abstração
   - Comparação receitas vs despesas convertida para formato genérico
   - Integração com os-chart-container
   - Não depende diretamente do ng2-charts

5. **report-filters** (Component da feature)
   - Filtros de período e orçamento
   - Integração com os-select e os-budget-selector

**Modificações:**

- Nenhuma modificação necessária em componentes existentes
- Possível extensão de os-filter-bar se necessário

### Dependências de UI

**Bibliotecas Necessárias:**

- **ng2-charts**: `^5.0.0` (wrapper Angular para Chart.js) - usado internamente pela camada de abstração
- **chart.js**: `^4.4.0` (biblioteca de gráficos base) - usado internamente pela camada de abstração

**Nota Importante:** Os componentes da feature **não importam ng2-charts diretamente**. Eles usam a camada de abstração (`src/shared/charts/`) que encapsula o ng2-charts.

**Providers Necessários:**

```typescript
// Providers são configurados na camada de abstração
// src/shared/charts/providers/chart-providers.ts
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// Providers centralizados na camada de abstração
export const chartProviders = [provideCharts(withDefaultRegisterables())];
```

**Imports nos Componentes da Feature:**

```typescript
// Componentes da feature usam a camada de abstração
import { PieChartComponent } from '@shared/charts/components/pie-chart';
import { BarChartComponent } from '@shared/charts/components/bar-chart';
import { ChartData, ChartConfig } from '@shared/charts/interfaces';

// NÃO importam ng2-charts diretamente
```

### Impacto em Performance

**Bundle Size:**

- **ng2-charts**: ~50KB (gzipped)
- **chart.js**: ~100KB (gzipped)
- **Total**: ~150KB adicional
- **Impacto**: Aceitável para funcionalidade de relatórios

**Lazy Loading:**

- Feature completa deve ser lazy loaded (`loadChildren`)
- Componentes de gráficos carregados apenas quando necessário
- Chart.js carregado apenas na rota `/reports`

**Critical CSS:**

- Estilos de layout críticos inline ou no bundle inicial
- Estilos de gráficos podem ser lazy loaded

**Otimizações:**

- Cálculos de agregação devem ser feitos no backend quando possível
- Cache de resultados de relatórios (localStorage ou service)
- Debounce em filtros para evitar recálculos excessivos

### Integration Points

**Serviços:**

- **ReportsApiService**: Busca dados de transações filtradas
- **ReportsCalculatorService**: Calcula agregações (gastos por categoria, receitas vs despesas)
- **ChartAdapterService**: Converte dados genéricos (ChartData, ChartConfig) para formato ng2-charts (usado internamente pela camada de abstração)
- **ChartConfigMapper**: Mapeia configurações genéricas para opções do Chart.js
- **ChartDataTransformer**: Transforma DTOs de relatórios em formato genérico (ChartData)
- **TransactionService**: Utilizado indiretamente via ReportsApiService
- **BudgetService**: Utilizado para buscar orçamentos e categorias
- **BudgetSelectionService**: Utilizado para orçamento selecionado

**Estado:**

- **ReportsState**: Gerencia estado da feature com signals
- **Computed Properties**: Para dados derivados dos gráficos

**Dados:**

- DTOs de relatórios (`ReportResponseDto`, `CategorySpendingDto`, `RevenueExpenseDto`)
- Transformação de DTOs para formato genérico (ChartData, ChartConfig) via ChartDataTransformer
- Conversão de formato genérico para ng2-charts feita internamente pela camada de abstração via ChartAdapterService

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance

- [ ] Componentes os-\* utilizados corretamente
- [ ] Design tokens aplicados (--os-\*)
- [ ] Nomenclatura consistente (os-\*)
- [ ] Tema aplicado corretamente (light/dark se aplicável)

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile < 576px, tablet 576-991px, desktop >= 992px)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Gráficos responsivos e legíveis em todas as resoluções
- [ ] Grid adapta corretamente por breakpoint

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Space)
- [ ] ARIA attributes corretos (landmarks, labels, descriptions)
- [ ] Screen reader friendly (tabelas alternativas para gráficos)
- [ ] Contraste adequado (>= 4.5:1 para texto, >= 3:1 para UI)
- [ ] Focus visible em elementos interativos
- [ ] Gráficos com descrições textuais

### Performance

- [ ] OnPush change detection em todos componentes
- [ ] Lazy loading da feature implementado
- [ ] Bundle size otimizado (ng2-charts + chart.js ~150KB)
- [ ] Computed signals para derivações
- [ ] Debounce em filtros para evitar recálculos excessivos

### Visual Quality

- [ ] Spacing consistente (usando tokens --os-spacing-\*)
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara (títulos, valores, labels)
- [ ] Estados (loading, error, empty) implementados
- [ ] Gráficos com cores adequadas e legíveis
- [ ] Cards com elevação e sombras consistentes

### Camada de Abstração e Integração

- [ ] Camada de abstração implementada corretamente (`src/shared/charts/`)
- [ ] Componentes da feature usam PieChartComponent/BarChartComponent (não ng2-charts diretamente)
- [ ] ChartAdapterService converte dados genéricos para ng2-charts corretamente
- [ ] ChartDataTransformer transforma DTOs para formato genérico
- [ ] Gráficos renderizam corretamente através da camada de abstração
- [ ] Tooltips funcionais
- [ ] Legendas configuradas adequadamente via ChartConfig genérico
- [ ] Responsividade dos gráficos funcionando
- [ ] Acessibilidade dos gráficos (ARIA, tabelas alternativas)
- [ ] Componentes da feature não têm dependências diretas do ng2-charts

## 📚 References

### Design System Documentation

- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines

- [Material Design - Data Visualization](https://material.io/design/communication/data-visualization.html)
- [Material Design - Cards](https://material.io/components/cards)
- [Material Design - Selection Controls](https://material.io/components/selection-controls)

### Chart.js Documentation

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [ng2-charts GitHub](https://github.com/valor-software/ng2-charts)
- [Chart.js Accessibility](https://www.chartjs.org/docs/latest/configuration/accessibility.html)

### WCAG Guidelines

- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Código Similar no Projeto

- **Dashboard Page**: `src/app/features/dashboard/pages/dashboard/` - Referência de layout com widgets
- **Transactions Filters**: `src/app/features/transactions/components/transactions-filters/` - Referência de filtros
- **Budget Selector**: `src/app/features/dashboard/components/budget-selector/` - Referência de seletor

### Meta Specs - Contexto de Produto

- **Personas**: `business/customer-profile/personas.md` - Perfis de usuário e necessidades específicas
- **Jornada do Cliente**: `business/customer-profile/customer-journey.md` - Touchpoints e estágios de engajamento
- **Conceitos Centrais**: `business/product-vision/core-concepts.md` - Domínio financeiro e regras de negócio
- **Funcionalidades Core**: `business/03_funcionalidades_core.md` - Diferenciação e valor único

### Angular Best Practices

- [Angular Signals](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Change Detection](https://angular.dev/guide/change-detection)

---

**Documento gerado para:** OS-232 - Relatórios Financeiros Simples MVP
**Data:** 2025-01-24
**Biblioteca escolhida:** ng2-charts (Chart.js wrapper)
**Camada de Abstração:** Wrapper customizado em `src/shared/charts/` para facilitar migrações futuras
