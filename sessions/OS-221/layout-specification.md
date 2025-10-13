# Dashboard Básico com Seleção de Orçamento - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Criar uma interface principal que comunique progresso financeiro de forma motivacional, permitindo alternância rápida entre orçamentos e visualização imediata do impacto das decisões financeiras. O layout deve inspirar confiança e clareza, transformando dados financeiros em insights acionáveis.

### Tipo de Layout

**Dashboard** - Interface principal da aplicação com sistema de widgets reativos

### Público-Alvo

**Universal** - Mobile-first com progressive enhancement para desktop

### Persona Primária

**Ana - A Organizadora Familiar** (32 anos, casada, 2 filhos, renda familiar R$ 8.000)

**Características da Persona:**

- Gerencia as finanças da casa e quer envolver o marido no controle
- Sonha com a casa própria e educação dos filhos (metas de longo prazo)
- Organizada mas sobrecarregada, precisa de simplicidade
- Usa planilhas atualmente, quer substituir por interface intuitiva
- Precisa de visão clara do progresso das metas familiares
- Valoriza compartilhamento e colaboração familiar

### Contexto de Uso

Interface principal da aplicação OrçaSonhos, primeira tela após login. Serve como hub central para:

- Visualização do progresso das metas financeiras
- Alternância entre diferentes orçamentos (pessoal, familiar, projetos)
- Acesso rápido às funcionalidades principais
- Navegação para outras seções da aplicação

### Funcionalidades Core Relacionadas

- **Sistema de Metas SMART**: Progresso visual das metas com barras de progresso e percentuais
- **Múltiplos Orçamentos**: Seletor de orçamento na AppBar para alternância rápida
- **Compartilhamento Familiar**: Indicadores de colaboração e participantes
- **Dashboard Motivacional**: Progresso central, conquistas e próximas ações
- **Sistema Dual**: Separação visual entre orçamentos e contas quando aplicável

### Considerações da Jornada do Usuário

**Estágio da Jornada: Engajamento Inicial (D+1 a D+7)**

**Objetivos do Usuário neste Estágio:**

- Entender para onde vai o dinheiro através de visualizações claras
- Ver progresso da primeira meta definida no onboarding
- Ganhar confiança na ferramenta através de insights úteis
- Estabelecer rotina de uso com interface intuitiva
- Envolver o parceiro no controle financeiro compartilhado

**Touchpoints Críticos:**

- **Primeiro login**: Interface deve impressionar positivamente com dados organizados
- **Primeira troca de orçamento**: Deve ser fluida e mostrar impacto imediato
- **Primeiro insight**: Deve gerar "aha moment" sobre gastos ou progresso
- **Compartilhamento**: Deve facilitar adição do parceiro ao orçamento familiar

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column
  - Touch targets: >= 44px
  - Sidebar: Colapsada por padrão, overlay em mobile
  - Budget selector: Dropdown compacto na AppBar
  - Widgets: Stack vertical, full width
  - Navegação: Menu hamburger com drawer

- **Tablet (576-991px)**:

  - Layout: 2 columns grid quando possível
  - Sidebar: Colapsável, overlay ou push
  - Budget selector: Dropdown expandido na AppBar
  - Widgets: Grid 2 colunas para widgets pequenos/médios
  - Navegação: Sidebar visível com toggle

- **Desktop (992px+)**:
  - Layout: Grid completo com sidebar fixa
  - Sidebar: Sempre visível, colapsável opcional
  - Budget selector: Dropdown completo na AppBar
  - Widgets: Grid 12 colunas flexível
  - Hover states: Ativos para melhor UX
  - Navegação: Sidebar expandida com labels

### Mobile-First Approach

Progressive enhancement começando com layout mobile e adicionando complexidade para telas maiores. Foco em touch interactions e gestos nativos.

### Touch Interactions

- **Swipe**: Para alternar entre widgets em mobile
- **Tap**: Para expandir widgets e acessar detalhes
- **Long press**: Para ações contextuais em widgets
- **Pull to refresh**: Para atualizar dados do dashboard

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: primary (ações principais), secondary (ações secundárias)
  - Size: medium (padrão), large (mobile touch targets)
  - Usage: Botões de ação rápida, navegação, confirmações

- **os-icon**:

  - Variant: default, primary (elementos ativos)
  - Size: sm (inline), md (botões), lg (headers)
  - Usage: Navegação, status, indicadores visuais

- **os-badge**:

  - Variant: primary (notificações), success (conquistas), warning (alertas)
  - Size: small (inline), medium (destaque)
  - Usage: Contadores, status, notificações

- **os-chip**:

  - Variant: primary (selecionado), secondary (opções)
  - Size: small (filtros), medium (categorias)
  - Usage: Filtros de orçamento, categorias, tags

- **os-progress-bar**:
  - Variant: primary (metas), success (conquistas)
  - Size: medium (widgets), large (destaque)
  - Usage: Progresso das metas, indicadores de saúde financeira

#### Molecules

- **os-form-field**:

  - Configuration: Budget selector, filtros
  - Usage: Seleção de orçamento, filtros de período

- **os-navigation-item**:
  - Configuration: Sidebar navigation, breadcrumbs
  - Usage: Navegação principal, breadcrumbs contextuais

#### Organisms

- **os-header**:

  - Variant: default (padrão), compact (mobile)
  - Actions: Budget selector, user menu, mobile toggle
  - Usage: Header principal com seletor de orçamento

- **os-sidebar**:

  - Variant: default (desktop), minimal (mobile)
  - Configuration: Navegação principal, colapsável
  - Usage: Navegação entre seções da aplicação

- **os-budget-summary**:

  - Variant: default, compact
  - Size: medium, large
  - Usage: Resumo do orçamento selecionado

- **os-goal-progress**:

  - Variant: default, motivational
  - Size: medium, large
  - Usage: Progresso das metas financeiras

- **os-transaction-list**:
  - Variant: default, compact
  - Size: medium, large
  - Usage: Lista de transações recentes

#### Templates

- **os-dashboard-template**:
  - Configuration: Layout responsivo com sidebar
  - Customizations: Budget selector no header, widgets reativos
  - Usage: Template principal do dashboard

### Novos Componentes (Especificação Detalhada)

#### OsBudgetSelectorComponent (Molecule)

**Propósito:**
Componente para seleção de orçamento ativo, permitindo alternância rápida entre orçamentos e criação de novos.

**Design Specs:**

- **Padding**: 12px horizontal, 8px vertical
- **Border**: 1px solid --os-color-border
- **Border-radius**: 6px
- **Typography**: --os-font-size-sm, --os-font-weight-medium
- **Colors**:
  - Background: --os-color-background-primary
  - Text: --os-color-text-primary
  - Hover: --os-color-background-hover
  - Focus: --os-color-primary

**States:**

- **Default**: Aparência padrão com orçamento selecionado
- **Hover**: Background +10% opacity, cursor pointer
- **Focus**: 2px solid ring --os-color-primary
- **Loading**: Spinner animation durante carregamento
- **Empty**: Placeholder "Selecionar orçamento"

**Responsiveness:**

- Mobile: Dropdown compacto, touch-friendly
- Tablet: Dropdown expandido com mais informações
- Desktop: Dropdown completo com descrições

**Accessibility:**

- **Role**: combobox
- **ARIA**: aria-expanded, aria-haspopup, aria-label
- **Keyboard**: Tab, Enter, Space, Arrow keys para navegação

**Variants:**

- **primary**: Para uso no header principal
- **secondary**: Para uso em modais ou sidebars

#### OsDashboardWidgetsComponent (Organism)

**Propósito:**
Container responsivo para widgets do dashboard com sistema de grid adaptativo.

**Design Specs:**

- **Grid System**: CSS Grid com 12 colunas (desktop), 8 colunas (tablet), 1 coluna (mobile)
- **Gap**: 16px desktop, 12px tablet, 8px mobile
- **Padding**: 24px desktop, 16px mobile
- **Background**: --os-color-background-secondary

**States:**

- **Loading**: Skeleton screens para cada widget
- **Empty**: Mensagem centralizada com call-to-action
- **Error**: Widgets com estado de erro e botão retry
- **Success**: Widgets carregados com animação de entrada

**Responsiveness:**

- Mobile: Stack vertical, widgets full width
- Tablet: Grid 2 colunas para widgets pequenos/médios
- Desktop: Grid flexível baseado no tamanho do widget

**Accessibility:**

- **Role**: main
- **ARIA**: aria-label para cada widget, live regions para updates
- **Keyboard**: Tab navigation entre widgets

## 🏗️ Layout Structure

### Grid System

- **Columns**: 12-col desktop, 8-col tablet, 1-col mobile
- **Gap**: 16px desktop, 12px tablet, 8px mobile
- **Max Width**: 1200px container

### Sections

#### Header

- **Components**: os-header, os-budget-selector
- **Height**: 64px desktop, 56px mobile
- **Sticky**: Yes
- **Z-index**: 100
- **Budget Selector**: Dropdown na AppBar com nome do orçamento e ação "Criar Novo"

#### Sidebar

- **Width**: 240px expanded, 64px collapsed
- **Breakpoint**: Hidden < 768px, overlay em mobile
- **Components**: os-sidebar, os-navigation
- **Navigation Items**: Dashboard, Orçamentos, Metas, Transações, Relatórios, Configurações

#### Main Content

- **Layout**: CSS Grid responsivo
- **Padding**: 24px desktop, 16px mobile
- **Components**: os-dashboard-widgets com grid de widgets
- **Widgets**: budget-summary, goal-progress, transaction-list, account-balance

#### Footer

- **Components**: os-footer (opcional)
- **Height**: Auto
- **Content**: Links úteis, informações da empresa

### Spacing Strategy

- **Section Gaps**: 32px desktop, 24px tablet, 16px mobile
- **Component Gaps**: 16px desktop, 12px tablet, 8px mobile
- **Consistent Padding**: 24px, 16px, 12px, 8px scale

### Visual Hierarchy

1. **Header com Budget Selector** - Navegação e contexto atual
2. **Progresso das Metas** - Elemento central motivacional
3. **Resumo do Orçamento** - Visão geral financeira
4. **Transações Recentes** - Atividade recente
5. **Saldo das Contas** - Posição financeira atual

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - header → sidebar → main → footer
- **Focus Management**: Visible focus ring em todos elementos interativos
- **Shortcuts**: Esc fecha modals, / para busca, Alt+B para budget selector
- **Skip Links**: Skip to main content, skip to budget selector

#### ARIA Implementation

- **Landmarks**:

  - `<header role="banner">` - Header principal
  - `<nav role="navigation">` - Navegação sidebar
  - `<main role="main">` - Conteúdo principal
  - `<aside role="complementary">` - Sidebar
  - `<footer role="contentinfo">` - Footer

- **Live Regions**:

  - [aria-live="polite"] para atualizações de widgets
  - [aria-live="assertive"] para alertas críticos de orçamento

- **Labels e Descriptions**:
  - Budget selector com aria-label descritivo
  - Widgets com aria-label indicando tipo e status
  - Ícones decorativos com aria-hidden="true"

#### Visual Accessibility

- **Contraste**:

  - Texto normal: >= 4.5:1
  - Texto grande: >= 3:1
  - UI Components: >= 3:1

- **Typography**:

  - Font-size mínimo: 16px (1rem)
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200%

- **Motion**:
  - Respeita prefers-reduced-motion
  - Transições <= 300ms
  - Sem animações desnecessárias

#### Screen Reader Support

- **Content Structure**: Headings hierárquicos (h1 → h2 → h3)
- **Widget Descriptions**: Cada widget com descrição clara
- **Budget Context**: Sempre anunciar orçamento selecionado
- **Progress Updates**: Anunciar mudanças no progresso das metas

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Skeleton screens para widgets
  - Spinner centralizado para carregamento geral
  - Loading state em budget selector

- **Empty**:

  - Ícone ilustrativo (📊)
  - Mensagem "Nenhum orçamento encontrado"
  - Call-to-action "Criar Primeiro Orçamento"

- **Error**:

  - Ícone de erro
  - Mensagem descritiva do problema
  - Botão de retry para cada widget

- **Success**:
  - Feedback visual de carregamento completo
  - Animações de entrada dos widgets

### Micro-interactions

- **Hover**: Elevação de widgets, mudança de cor em botões
- **Focus**: Ring outline, scale up sutil
- **Active**: Scale down, pressed state
- **Transitions**: 200ms ease-in-out para estados

### Component-Specific Interactions

- **Budget Selector**: Dropdown animado, busca em tempo real
- **Widgets**: Hover para preview, click para expandir
- **Sidebar**: Collapse/expand com animação suave
- **Mobile Menu**: Slide in/out com overlay

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ Header (sticky)         │
│ ┌─────────────────────┐ │
│ │ Logo [Budget▼] [☰] │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Main Content            │
│ ┌─────────────────────┐ │
│ │ Budget Summary      │ │
│ │ (full width)        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Goal Progress       │ │
│ │ (full width)        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Recent Transactions │ │
│ │ (full width)        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Account Balance     │ │
│ │ (full width)        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Anotações:**

- Stack vertical de todos widgets
- Touch targets >= 44px
- Sem scroll horizontal
- Sidebar como overlay quando ativa

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ Header (sticky)                   │
│ ┌─────────────────────────────┐   │
│ │ Logo Nav [Budget▼] [User]   │   │
│ └─────────────────────────────┘   │
├───────────────────────────────────┤
│ Main Content                      │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Budget      │ │ Goal        │   │
│ │ Summary     │ │ Progress     │   │
│ └─────────────┘ └─────────────┘   │
│ ┌─────────────────────────────┐   │
│ │ Recent Transactions (full)  │   │
│ └─────────────────────────────┘   │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Account     │ │ Quick       │   │
│ │ Balance     │ │ Actions     │   │
│ └─────────────┘ └─────────────┘   │
└───────────────────────────────────┘
```

**Anotações:**

- Grid 2 colunas quando possível
- Navegação visível no header
- Sidebar colapsável

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ Header (sticky)                             │
│ ┌───────────────────────────────────────┐   │
│ │ Logo Navigation [Budget▼] [User]     │   │
│ └───────────────────────────────────────┘   │
├─────┬───────────────────────────────────────┤
│ [S] │ Main Content                          │
│ [i] │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ [d] │ │Budget│ │Goal  │ │Recent│ │Account│   │
│ [e] │ │Summ. │ │Prog. │ │Trans.│ │Bal.  │   │
│ [b] │ └──────┘ └──────┘ └──────┘ └──────┘   │
│ [a] │ ┌──────────────────────────────────┐   │
│ [r] │ │ Additional Widgets (full width) │   │
│ │ └──────────────────────────────────┘   │
└─────┴───────────────────────────────────────┘
```

**Anotações:**

- Sidebar sempre visível
- Grid 12 colunas flexível
- Hover states ativos
- Múltiplos widgets por linha

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

- `OsBudgetSelectorComponent` - Seletor de orçamento para header
- `OsDashboardWidgetsComponent` - Container responsivo de widgets

**Modificações:**

- `OsHeaderComponent` - Integração do budget selector
- `OsDashboardTemplateComponent` - Configuração para budget selector
- `DashboardPage` - Implementação completa usando template

### Dependências de UI

- **Angular Material**: Base para componentes de seleção
- **Design System**: Componentes `os-*` existentes
- **CSS Grid**: Layout responsivo
- **Angular Signals**: Estado reativo

### Impacto em Performance

- **Bundle Size**: +15KB (novos componentes)
- **Lazy Loading**: Widgets podem ser lazy loaded
- **Critical CSS**: Estilos do header e grid críticos para first paint
- **Change Detection**: OnPush strategy para otimização

### Integration Points

- **BudgetSelectionService**: Estado global do orçamento selecionado
- **DashboardDataService**: Dados dos widgets
- **MSW Handlers**: Dados mockados para desenvolvimento
- **Angular Router**: Navegação entre seções

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance

- [ ] Componentes os-\* utilizados corretamente
- [ ] Design tokens aplicados (--os-\*)
- [ ] Nomenclatura consistente
- [ ] Tema aplicado corretamente

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile, tablet, desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Grid responsivo funcionando

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa
- [ ] ARIA attributes corretos
- [ ] Screen reader friendly
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos

### Performance

- [ ] OnPush change detection
- [ ] Lazy loading onde aplicável
- [ ] Bundle size otimizado
- [ ] Computed signals para derivações

### Visual Quality

- [ ] Spacing consistente
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara
- [ ] Estados (loading, error, empty) implementados
- [ ] Animações suaves e apropriadas

## 📚 References

### Design System Documentation

- Atoms: [src/app/shared/ui-components/atoms/]
- Molecules: [src/app/shared/ui-components/molecules/]
- Organisms: [src/app/shared/ui-components/organisms/]
- Templates: [src/app/shared/ui-components/templates/]

### Material Design Guidelines

- Layout patterns para dashboards
- Responsive design principles
- Accessibility guidelines

### WCAG Guidelines

- WCAG 2.1 AA compliance
- Keyboard navigation patterns
- Screen reader optimization

### Código Similar no Projeto

- `OsDashboardTemplateComponent` - Template base
- `OsHeaderComponent` - Header com navegação
- `OsSidebarComponent` - Navegação lateral

### Meta Specs - Contexto de Produto

- **Personas**: [personas.md] - Ana como persona primária para dashboard
- **Jornada do Cliente**: [customer-journey.md] - Estágio de Engajamento Inicial
- **Conceitos Centrais**: [core-concepts.md] - Metas SMART e múltiplos orçamentos
- **Funcionalidades Core**: [03_funcionalidades_core.md] - Dashboard motivacional e sistema dual
