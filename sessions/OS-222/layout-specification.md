# Refinamento Completo do Design System e Dashboard - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Refinar todos os componentes existentes do Design System (`os-*`) e a feature Dashboard implementada (OS-221) para alinhar com a visão de produto das Meta Specs, melhorando aspectos visuais e de experiência do usuário para todas as 4 personas definidas.

### Tipo de Layout

**Dashboard Refinado** - Interface principal centrada em progresso das metas com componentes do Design System refinados

### Público-Alvo

**Mobile-first Universal** - Otimizado para todas as personas (Ana, Carlos, Roberto & Maria, Júlia) com foco em dispositivos móveis

### Persona Primária

**Ana - A Organizadora Familiar** (32 anos, casada, 2 filhos, renda familiar R$ 8.000)

**Características da Persona:**

- Gerencia as finanças da casa e quer envolver o marido no controle financeiro
- Usa planilhas do Excel atualmente e quer substituir por interface intuitiva
- Sonha com a casa própria e educação dos filhos
- Organizada mas sobrecarregada, precisa de clareza sobre onde vai o dinheiro
- Quer compartilhamento simples sem burocracia

### Contexto de Uso

Interface principal do OrçaSonhos onde usuários visualizam progresso das metas, controlam orçamentos e gerenciam transações financeiras. Foco em transformar sonhos em planos de ação financeiros.

### Funcionalidades Core Relacionadas

- **Sistema de Metas SMART**: Barras de progresso, indicadores visuais de progresso
- **Múltiplos Orçamentos**: Seletor de orçamento, navegação contextual
- **Compartilhamento Familiar**: Indicadores de colaboração, interface para adicionar participantes
- **Dashboard Centrado em Progresso**: Progresso das metas como elemento central
- **Sistema Dual: Orçamentos + Contas**: Separação visual entre orçamentos e contas

### Considerações da Jornada do Usuário

**Estágio da Jornada: Adoção (D+7 a D+30)**

- Uso regular consolidado com múltiplas metas
- Envolvimento da família (quando aplicável)
- Refinamento de categorias e orçamentos
- Features avançadas exploradas

**Objetivos do Usuário neste Estágio:**

- Ver progresso consolidado de todas as metas
- Controlar gastos por categoria de forma visual
- Compartilhar orçamento com família
- Acessar informações rapidamente em qualquer dispositivo

**Touchpoints Críticos:**

- **Primeiro login**: Interface deve impressionar positivamente
- **Seleção de orçamento**: Deve ser intuitiva e rápida
- **Visualização de progresso**: Deve ser motivacional e clara
- **Compartilhamento**: Deve ser simples e sem fricção

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column
  - Touch targets: >= 44px
  - Sidebar: Overlay com backdrop
  - Widgets: Full width, stack vertical
  - Navegação: Hamburger menu

- **Tablet (576-991px)**:

  - Layout: 2 columns grid para widgets
  - Navegação: Sidebar colapsável
  - Widgets: Grid responsivo 2 colunas
  - Touch targets: >= 44px

- **Desktop (992px+)**:
  - Layout: Grid completo, sidebar fixo
  - Widgets: Grid 12 colunas flexível
  - Hover states: Ativos
  - Navegação: Sidebar sempre visível

### Mobile-First Approach

Design otimizado para smartphones com progressive enhancement para telas maiores. Foco em touch interactions e gestos naturais.

### Touch Interactions

- **Swipe**: Navegação entre widgets (mobile)
- **Tap**: Seleção de orçamento, interação com widgets
- **Long press**: Ações contextuais (desktop)
- **Pinch**: Zoom em gráficos (quando aplicável)

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms (15+ componentes)

- **os-button**: Variantes primary, secondary, tertiary, danger
- **os-input**: Text, email, password, number com validação
- **os-icon**: Biblioteca de ícones com tamanhos consistentes
- **os-badge**: Status indicators com cores semânticas
- **os-avatar**: User avatars para compartilhamento
- **os-spinner**: Loading indicators
- **os-progress-bar**: Barras de progresso para metas
- **os-checkbox**: Seleção múltipla
- **os-radio**: Seleção única
- **os-toggle**: Switches para configurações
- **os-slider**: Controles de valor
- **os-chip**: Tags e categorias
- **os-label**: Labels com acessibilidade
- **os-money-input**: Inputs monetários
- **os-date-input**: Seleção de datas

#### Molecules (12+ componentes)

- **os-form-field**: Input + label + validation
- **os-card**: Content containers
- **os-search-box**: Busca com sugestões
- **os-money-display**: Formatação monetária
- **os-date-picker**: Seleção de datas
- **os-dropdown**: Select com opções
- **os-filter-bar**: Filtros avançados
- **os-form-group**: Grupos de campos
- **os-navigation-item**: Itens de navegação
- **os-tooltip**: Tooltips informativos
- **os-alert**: Notificações e alertas
- **os-data-table**: Tabelas com sorting/filtering

#### Organisms (12+ componentes)

- **os-header**: Cabeçalho principal
- **os-sidebar**: Navegação lateral
- **os-navigation**: Navegação principal
- **os-modal**: Dialogs e overlays
- **os-page-header**: Títulos e ações de página
- **os-footer**: Rodapé
- **os-budget-summary**: Resumo de orçamento
- **os-budget-tracker**: Acompanhamento de orçamento
- **os-category-manager**: Gestão de categorias
- **os-goal-progress**: Progresso de metas
- **os-goal-tracker**: Acompanhamento de metas
- **os-transaction-list**: Lista de transações

#### Templates (8+ templates)

- **os-dashboard-template**: Layout principal do dashboard
- **os-form-template**: Layout para formulários
- **os-list-template**: Layout para listas
- **os-detail-template**: Layout para detalhes
- **os-modal-template**: Layout para modais
- **os-wizard-template**: Layout para wizards
- **os-drawer-template**: Layout para drawers
- **os-panel-template**: Layout para painéis

### Novos Componentes (Especificação Detalhada)

#### os-goal-progress-card (Molecule)

**Propósito:**
Card específico para exibir progresso de metas com visual motivacional

**Design Specs:**

- **Padding**: 16px horizontal, 12px vertical
- **Border**: 1px solid --os-color-border
- **Border-radius**: 8px
- **Typography**: --os-font-size-sm para labels, --os-font-size-lg para valores
- **Colors**:
  - Background: --os-color-background-primary
  - Progress bar: --os-color-primary
  - Text: --os-color-text-primary
  - Success: --os-color-success

**States:**

- **Default**: Card com progresso normal
- **Completed**: Verde com ícone de check
- **Overdue**: Vermelho com ícone de alerta
- **Loading**: Skeleton animation

**Responsiveness:**

- Mobile: Full width, stack vertical
- Tablet: 2 colunas
- Desktop: 3-4 colunas

**Accessibility:**

- **Role**: region
- **ARIA**: aria-label, aria-describedby
- **Keyboard**: Tab navigation, Enter para expandir

#### os-budget-selector-enhanced (Molecule)

**Propósito:**
Seletor de orçamento melhorado com indicadores visuais e ações rápidas

**Design Specs:**

- **Padding**: 12px horizontal, 8px vertical
- **Border**: 1px solid --os-color-border
- **Border-radius**: 6px
- **Typography**: --os-font-size-sm, --os-font-weight-medium
- **Colors**:
  - Background: --os-color-background-primary
  - Hover: --os-color-background-hover
  - Focus: --os-color-primary

**States:**

- **Default**: Dropdown fechado
- **Open**: Dropdown expandido com opções
- **Loading**: Spinner animation
- **Error**: Border vermelho com mensagem

**Responsiveness:**

- Mobile: Full width, stack vertical
- Desktop: Inline com botão de criar

**Accessibility:**

- **Role**: combobox
- **ARIA**: aria-expanded, aria-haspopup
- **Keyboard**: Arrow keys, Enter, Escape

## 🏗️ Layout Structure

### Grid System

- **Columns**: 12-col desktop, 8-col tablet, 1-col mobile
- **Gap**: 16px desktop, 12px tablet, 8px mobile
- **Max Width**: 1200px container

### Sections

#### Header

- **Components**: os-header, os-budget-selector-enhanced
- **Height**: 64px desktop, 56px mobile
- **Sticky**: Yes
- **Z-index**: 100

#### Sidebar

- **Width**: 240px expanded, 64px collapsed
- **Breakpoint**: Hidden < 768px
- **Components**: os-sidebar, os-navigation
- **Mobile**: Overlay com backdrop

#### Main Content

- **Layout**: CSS Grid responsivo
- **Padding**: 24px desktop, 16px mobile
- **Components**: os-dashboard-widgets, os-goal-progress-card

### Spacing Strategy

- **Section Gaps**: 32px desktop, 24px tablet, 16px mobile
- **Component Gaps**: 16px desktop, 12px tablet, 8px mobile
- **Consistent Padding**: 24px, 16px, 12px, 8px scale

### Visual Hierarchy

1. **Título da página** - H1, Hero
2. **Cards de metas** - H2, Cards principais
3. **Métricas e dados** - H3, Conteúdo secundário
4. **Labels e descrições** - H4, Texto auxiliar

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - header → sidebar → main → footer
- **Focus Management**: Visible focus ring em todos elementos interativos
- **Shortcuts**: Esc fecha modals, / para busca, Arrow keys para navegação
- **Skip Links**: Skip to main content, Skip to budget selector

#### ARIA Implementation

- **Landmarks**:

  - `<header role="banner">` - Header principal
  - `<nav role="navigation">` - Sidebar navigation
  - `<main role="main">` - Conteúdo principal
  - `<aside role="complementary">` - Sidebar
  - `<footer role="contentinfo">` - Footer

- **Live Regions**:

  - [aria-live="polite"] para atualizações de progresso
  - [aria-live="assertive"] para erros críticos

- **Labels e Descriptions**:
  - Todos inputs com labels associados
  - Ícones decorativos com aria-hidden="true"
  - Botões com aria-label descritivos

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
- **Alt Text**: Imagens com descrições significativas
- **Form Labels**: Associação explícita com inputs
- **Error Messages**: Anunciados dinamicamente

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Spinner centralizado
  - Skeleton screens para widgets
  - Loading state em botões

- **Empty**:

  - Ícone ilustrativo
  - Mensagem clara
  - Call-to-action para criar primeiro orçamento

- **Error**:

  - Ícone de erro
  - Mensagem descritiva
  - Botão de retry

- **Success**:
  - Feedback visual (toast/modal)
  - Mensagem de confirmação

### Micro-interactions

- **Hover**: Elevação de cards, mudança de cor em botões
- **Focus**: Ring outline, scale up
- **Active**: Scale down, pressed state
- **Transitions**: 200ms ease-in-out para estados

### Component-Specific Interactions

- **Budget Selector**: Dropdown animation, loading states
- **Goal Progress**: Progress bar animation, completion celebration
- **Widgets**: Hover effects, click feedback
- **Sidebar**: Collapse/expand animation

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ Header (sticky)         │
│ ┌─────────────────────┐ │
│ │ Logo [Selector]    │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Main Content            │
│ ┌─────────────────────┐ │
│ │ Goal Progress Card │ │
│ │ [Progress Bar]     │ │
│ │ [Value] [Target]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Budget Summary      │ │
│ │ [Total] [Income]    │ │
│ │ [Expenses]          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Recent Transactions │ │
│ │ [List Items]        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Anotações:**

- Stack vertical de todos widgets
- Touch targets >= 44px
- Sem scroll horizontal
- Sidebar como overlay

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ Header (sticky)                  │
│ ┌─────────────────────────────┐  │
│ │ Logo Nav [Selector]        │  │
│ └─────────────────────────────┘  │
├───────────────────────────────────┤
│ Main Content                      │
│ ┌─────────────┐ ┌─────────────┐  │
│ │ Goal Card   │ │ Goal Card   │  │
│ │ [Progress]  │ │ [Progress]  │  │
│ └─────────────┘ └─────────────┘  │
│ ┌─────────────────────────────┐  │
│ │ Budget Summary (full)      │  │
│ │ [Metrics Grid]             │  │
│ └─────────────────────────────┘  │
└───────────────────────────────────┘
```

**Anotações:**

- Grid 2 colunas para cards de metas
- Navegação visível
- Widgets maiores em full width

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ Header (sticky)                            │
│ ┌───────────────────────────────────────┐  │
│ │ Logo Navigation [Selector] Actions  │  │
│ └───────────────────────────────────────┘  │
├─────┬───────────────────────────────────────┤
│ [S] │ Main Content                          │
│ [i] │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ [d] │ │Goal  │ │Goal  │ │Goal  │ │Goal  │ │
│ [e] │ │Card  │ │Card  │ │Card  │ │Card  │ │
│ [b] │ └──────┘ └──────┘ └──────┘ └──────┘ │
│ [a] │ ┌──────────────────────────────────┐ │
│ [r] │ │ Budget Summary (full width)      │ │
│ │   │ │ [Metrics Grid]                   │ │
│ │   │ └──────────────────────────────────┘ │
└─────┴───────────────────────────────────────┘
```

**Anotações:**

- Sidebar colapsável
- Grid 12 colunas flexível
- Hover states ativos
- Widgets em grid responsivo

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

- os-goal-progress-card (Molecule)
- os-budget-selector-enhanced (Molecule)
- os-dashboard-widgets-refined (Organism)

**Modificações:**

- Todos os 15+ atoms com refinamento visual
- Todos os 12+ molecules com melhorias de UX
- Todos os 12+ organisms com otimizações
- Todos os 8+ templates com responsividade aprimorada

### Dependências de UI

- **Angular Material 20.2.3**: Componentes base
- **SCSS**: Sistema de estilos refinado
- **Design Tokens**: Paleta azul dominante mantida
- **Storybook**: Documentação atualizada

### Impacto em Performance

- **Bundle Size**: Mantido ou reduzido com otimizações
- **Lazy Loading**: Componentes críticos carregados primeiro
- **Critical CSS**: Estilos críticos para first paint
- **Images**: Otimização de ícones e assets

### Integration Points

- **BudgetSelectionService**: Integração com seletor refinado
- **DashboardDataService**: Dados para widgets otimizados
- **ThemeService**: Aplicação de tema refinado
- **BreakpointService**: Responsividade aprimorada

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
- [ ] Imagens/media responsivas

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

## 🔧 Componentes - Ajustes Necessários Detalhados

### 🔹 ATOMS (16 componentes)

#### os-button

**Problemas Identificados:**

- ❌ Cores hardcoded no SCSS (#d32f2f, #b71c1c) - deve usar tokens
- ❌ Falta variant "success" para celebrações de metas completadas
- ❌ Falta variant "warning" para alertas de orçamento
- ❌ Ripple effect não implementado para feedback tátil mobile
- ❌ Touch targets não garantidos >= 44px em mobile
- ❌ Focus ring não usa tokens de design

**Ajustes Necessários:**

- ✅ Adicionar variant "success" com cor --os-color-success
- ✅ Adicionar variant "warning" com cor --os-color-warning
- ✅ Substituir cores hardcoded por tokens (--os-color-error-600, --os-color-error-700)
- ✅ Implementar ripple effect usando Angular Material Ripple
- ✅ Garantir min-height: 44px em mobile (--os-touch-target-min)
- ✅ Usar --os-focus-ring-width e --os-focus-ring-color para focus ring
- ✅ Adicionar micro-animation no hover (scale: 1.02)
- ✅ Melhorar disabled state (opacity: 0.6, cursor: not-allowed)

#### os-progress-bar

**Problemas Identificados:**

- ❌ Falta celebração visual quando meta atinge 100%
- ❌ Não há milestone markers (25%, 50%, 75%, 90%)
- ❌ Cores não usam tokens consistentes
- ❌ Falta animação de preenchimento suave
- ❌ Não há feedback visual de "quase lá" (90%+)

**Ajustes Necessários:**

- ✅ Adicionar animação de confetti/celebration ao atingir 100%
- ✅ Implementar milestone markers visuais opcionais
- ✅ Usar tokens para todas as cores (--os-color-primary-500, --os-color-success, etc.)
- ✅ Adicionar animação de preenchimento (transition: width 0.3s ease)
- ✅ Adicionar variant "almost-there" para 90%+ (cor laranja)
- ✅ Melhorar acessibilidade (aria-valuenow, aria-valuemin, aria-valuemax)
- ✅ Adicionar tooltip opcional com valor exato

#### os-input

**Problemas Identificados:**

- ❌ Estados de erro não são suficientemente visíveis
- ❌ Touch targets pequenos em mobile (< 44px)
- ❌ Falta feedback visual de validação em tempo real
- ❌ Placeholder não tem contraste adequado
- ❌ Focus ring não usa tokens

**Ajustes Necessários:**

- ✅ Melhorar contraste do estado de erro (border: 2px solid --os-color-error)
- ✅ Garantir min-height: 44px em mobile
- ✅ Adicionar ícone de validação (check/error) no suffix
- ✅ Melhorar contraste do placeholder (--os-color-text-muted)
- ✅ Usar --os-focus-ring-width para focus ring
- ✅ Adicionar animação de shake para erro
- ✅ Melhorar acessibilidade (aria-invalid, aria-describedby)

#### os-money-input

**Problemas Identificados:**

- ❌ Formatação BRL não validada (R$ 1.234,56)
- ❌ Falta suporte para entrada rápida de centavos
- ❌ Não há destaque visual para valores grandes (>= R$ 10.000)
- ❌ Falta máscara de entrada em tempo real
- ❌ Não há validação de valores negativos

**Ajustes Necessários:**

- ✅ Implementar formatação BRL correta (Intl.NumberFormat)
- ✅ Adicionar entrada rápida: "100" → "R$ 1,00"
- ✅ Destacar valores grandes com typography maior
- ✅ Implementar máscara de entrada em tempo real
- ✅ Adicionar validação de valores negativos (permitir/bloquear)
- ✅ Melhorar acessibilidade (aria-label com valor formatado)
- ✅ Adicionar suporte para diferentes moedas (futuro)

#### os-icon

**Problemas Identificados:**

- ❌ Biblioteca de ícones não documentada
- ❌ Falta validação de acessibilidade (aria-hidden)
- ❌ Tamanhos não responsivos
- ❌ Falta suporte para ícones customizados

**Ajustes Necessários:**

- ✅ Documentar biblioteca de ícones disponíveis (Material Icons, Font Awesome)
- ✅ Garantir aria-hidden="true" para ícones decorativos
- ✅ Implementar tamanhos responsivos (sm, md, lg, xl)
- ✅ Adicionar suporte para ícones SVG customizados
- ✅ Melhorar contraste em diferentes backgrounds
- ✅ Adicionar fallback para ícones não encontrados

#### os-badge

**Problemas Identificados:**

- ❌ Cores não usam tokens semânticos
- ❌ Falta variants para status de metas
- ❌ Tamanhos não responsivos
- ❌ Falta animação de entrada

**Ajustes Necessários:**

- ✅ Usar tokens para cores (--os-color-success, --os-color-warning, --os-color-error)
- ✅ Adicionar variants: "goal-active", "goal-completed", "goal-overdue"
- ✅ Implementar tamanhos responsivos
- ✅ Adicionar animação de entrada (scale + fade)
- ✅ Melhorar contraste para acessibilidade
- ✅ Adicionar suporte para números grandes (99+)

#### os-avatar

**Problemas Identificados:**

- ❌ Fallback para initials não otimizado
- ❌ Tamanhos não responsivos
- ❌ Falta suporte para status online/offline
- ❌ Não há loading state

**Ajustes Necessários:**

- ✅ Melhorar algoritmo de fallback para initials
- ✅ Implementar tamanhos responsivos (sm, md, lg, xl)
- ✅ Adicionar indicador de status (online/offline)
- ✅ Implementar loading state (skeleton)
- ✅ Melhorar acessibilidade (alt text descritivo)
- ✅ Adicionar suporte para múltiplas imagens (carousel)

#### os-spinner

**Problemas Identificados:**

- ❌ Cores não usam tokens
- ❌ Falta acessibilidade (aria-live)
- ❌ Tamanhos limitados
- ❌ Falta animação de fade in/out

**Ajustes Necessários:**

- ✅ Usar tokens para cores (--os-color-primary)
- ✅ Adicionar aria-live="polite" e aria-label
- ✅ Implementar tamanhos responsivos
- ✅ Adicionar animação de fade in/out
- ✅ Melhorar performance (GPU acceleration)
- ✅ Adicionar variant "overlay" para loading de página

#### os-checkbox

**Problemas Identificados:**

- ❌ Touch targets < 44px em mobile
- ❌ Contraste de focus ring inadequado
- ❌ Falta animação de check
- ❌ Estados intermediários não suportados

**Ajustes Necessários:**

- ✅ Garantir touch targets >= 44px
- ✅ Melhorar contraste do focus ring
- ✅ Adicionar animação de check (scale + color)
- ✅ Implementar estado "indeterminate"
- ✅ Melhorar acessibilidade (aria-checked)
- ✅ Adicionar suporte para grupos (aria-labelledby)

#### os-radio

**Problemas Identificados:**

- ❌ Touch targets < 44px em mobile
- ❌ Contraste de focus ring inadequado
- ❌ Falta animação de seleção
- ❌ Grupos não bem estruturados

**Ajustes Necessários:**

- ✅ Garantir touch targets >= 44px
- ✅ Melhorar contraste do focus ring
- ✅ Adicionar animação de seleção (scale + color)
- ✅ Melhorar estrutura de grupos (fieldset + legend)
- ✅ Melhorar acessibilidade (aria-checked, aria-labelledby)
- ✅ Adicionar suporte para orientação (horizontal/vertical)

#### os-toggle

**Problemas Identificados:**

- ❌ Touch targets < 44px em mobile
- ❌ Feedback visual de estado inadequado
- ❌ Falta animação de transição
- ❌ Cores não usam tokens

**Ajustes Necessários:**

- ✅ Garantir touch targets >= 44px
- ✅ Melhorar feedback visual (cor + posição)
- ✅ Adicionar animação de transição suave
- ✅ Usar tokens para cores (--os-color-primary, --os-color-success)
- ✅ Melhorar acessibilidade (aria-checked)
- ✅ Adicionar suporte para labels inline

#### os-slider

**Problemas Identificados:**

- ❌ Touch targets inadequados em mobile
- ❌ Falta feedback tátil
- ❌ Valores não formatados adequadamente
- ❌ Falta suporte para range

**Ajustes Necessários:**

- ✅ Melhorar touch targets (área de toque maior)
- ✅ Adicionar feedback tátil (haptic feedback)
- ✅ Implementar formatação de valores (moeda, porcentagem)
- ✅ Adicionar suporte para range (min/max)
- ✅ Melhorar acessibilidade (aria-valuenow, aria-valuemin, aria-valuemax)
- ✅ Adicionar tooltip com valor atual

#### os-chip

**Problemas Identificados:**

- ❌ Cores não otimizadas para categorias
- ❌ Touch targets pequenos
- ❌ Falta animação de remoção
- ❌ Não há suporte para ícones

**Ajustes Necessários:**

- ✅ Otimizar cores para categorias de orçamento
- ✅ Garantir touch targets >= 44px
- ✅ Adicionar animação de remoção (scale + fade)
- ✅ Implementar suporte para ícones
- ✅ Melhorar acessibilidade (aria-label, role)
- ✅ Adicionar suporte para drag & drop

#### os-label

**Problemas Identificados:**

- ❌ Associação com inputs não validada
- ❌ Contraste inadequado em alguns casos
- ❌ Falta suporte para tooltips
- ❌ Tamanhos não responsivos

**Ajustes Necessários:**

- ✅ Validar associação com inputs (for attribute)
- ✅ Melhorar contraste (--os-color-text-primary)
- ✅ Adicionar suporte para tooltips informativos
- ✅ Implementar tamanhos responsivos
- ✅ Melhorar acessibilidade (aria-describedby)
- ✅ Adicionar suporte para labels obrigatórios (\*)

#### os-select

**Problemas Identificados:**

- ❌ Touch targets < 44px em mobile
- ❌ Dropdown não otimizado para mobile
- ❌ Falta busca integrada
- ❌ Keyboard navigation incompleta

**Ajustes Necessários:**

- ✅ Garantir touch targets >= 44px
- ✅ Otimizar dropdown para mobile (full screen modal)
- ✅ Implementar busca integrada para muitas opções
- ✅ Completar keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Melhorar acessibilidade (aria-expanded, aria-haspopup)
- ✅ Adicionar suporte para grupos de opções

#### os-date-input

**Problemas Identificados:**

- ❌ Não validado para metas com prazos
- ❌ Interface não mobile-friendly
- ❌ Falta seleção rápida de prazos
- ❌ Não há validação de datas passadas

**Ajustes Necessários:**

- ✅ Validar para metas SMART (datas futuras)
- ✅ Melhorar interface mobile (date picker nativo)
- ✅ Adicionar seleção rápida (30 dias, 6 meses, 1 ano)
- ✅ Implementar validação de datas passadas
- ✅ Melhorar acessibilidade (aria-label com formato)
- ✅ Adicionar suporte para range de datas

### 🔹 MOLECULES (12 componentes)

#### os-card

**Problemas Identificados:**

- ❌ Shadows não usam tokens
- ❌ Hover effects não expressivos
- ❌ Padding não otimizado para mobile
- ❌ Clickable state inadequado

**Ajustes Necessários:**

- ✅ Usar tokens para shadows (--os-shadow-sm, --os-shadow-md)
- ✅ Melhorar hover effects (elevation + scale)
- ✅ Otimizar padding para mobile (--os-padding-sm)
- ✅ Melhorar clickable state (cursor: pointer, scale: 0.98)
- ✅ Adicionar animação de entrada (fade + slide)
- ✅ Implementar skeleton loading state

#### os-money-display

**Problemas Identificados:**

- ❌ Formatação BRL não validada
- ❌ Falta variants para valores positivos/negativos
- ❌ Tamanhos não responsivos
- ❌ Não há destaque para valores grandes

**Ajustes Necessários:**

- ✅ Validar formatação BRL (Intl.NumberFormat)
- ✅ Implementar variants (positive, negative, neutral)
- ✅ Adicionar tamanhos responsivos (sm, md, lg, xl)
- ✅ Destacar valores grandes (>= R$ 10.000) com typography maior
- ✅ Melhorar acessibilidade (aria-label com valor por extenso)
- ✅ Adicionar suporte para diferentes moedas

#### os-form-field

**Problemas Identificados:**

- ❌ Feedback de erro não visível
- ❌ Spacing não otimizado para mobile
- ❌ ControlValueAccessor não validado
- ❌ Estados de validação confusos

**Ajustes Necessários:**

- ✅ Melhorar feedback de erro (cor + ícone + mensagem)
- ✅ Otimizar spacing para mobile (--os-spacing-sm)
- ✅ Validar ControlValueAccessor (writeValue, registerOnChange)
- ✅ Clarificar estados de validação (pristine, dirty, touched)
- ✅ Melhorar acessibilidade (aria-invalid, aria-describedby)
- ✅ Adicionar suporte para validação em tempo real

#### os-search-box

**Problemas Identificados:**

- ❌ Acessibilidade inadequada
- ❌ Touch targets pequenos
- ❌ Falta debounce para performance
- ❌ Sugestões não otimizadas

**Ajustes Necessários:**

- ✅ Melhorar acessibilidade (aria-label, role="searchbox")
- ✅ Garantir touch targets >= 44px
- ✅ Implementar debounce (300ms) para performance
- ✅ Otimizar sugestões (highlight, keyboard navigation)
- ✅ Adicionar suporte para filtros avançados
- ✅ Implementar histórico de buscas

#### os-date-picker

**Problemas Identificados:**

- ❌ Interface não mobile-friendly
- ❌ Falta seleção rápida de prazos
- ❌ Visual de "hoje" não destacado
- ❌ Keyboard navigation incompleta

**Ajustes Necessários:**

- ✅ Melhorar interface mobile (date picker nativo)
- ✅ Adicionar seleção rápida (hoje, amanhã, próxima semana)
- ✅ Destacar data atual (border + cor)
- ✅ Completar keyboard navigation (Arrow keys, Enter)
- ✅ Melhorar acessibilidade (aria-label com formato)
- ✅ Adicionar suporte para range de datas

#### os-dropdown

**Problemas Identificados:**

- ❌ Dropdown não otimizado para mobile
- ❌ Falta busca integrada
- ❌ Keyboard navigation incompleta
- ❌ Grupos de opções não suportados

**Ajustes Necessários:**

- ✅ Otimizar dropdown para mobile (full screen modal)
- ✅ Implementar busca integrada para muitas opções
- ✅ Completar keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Adicionar suporte para grupos de opções
- ✅ Melhorar acessibilidade (aria-expanded, aria-haspopup)
- ✅ Implementar virtual scrolling para muitas opções

#### os-filter-bar

**Problemas Identificados:**

- ❌ Layout não responsivo
- ❌ Touch targets pequenos
- ❌ Filtros não persistentes
- ❌ Falta reset rápido

**Ajustes Necessários:**

- ✅ Implementar layout responsivo (stack vertical em mobile)
- ✅ Garantir touch targets >= 44px
- ✅ Implementar persistência de filtros (localStorage)
- ✅ Adicionar reset rápido (botão "Limpar todos")
- ✅ Melhorar acessibilidade (aria-label para cada filtro)
- ✅ Adicionar suporte para filtros avançados

#### os-form-group

**Problemas Identificados:**

- ❌ Spacing inconsistente
- ❌ Falta validação de grupo
- ❌ Responsividade inadequada
- ❌ Acessibilidade incompleta

**Ajustes Necessários:**

- ✅ Padronizar spacing (--os-spacing-md entre campos)
- ✅ Implementar validação de grupo (todos os campos obrigatórios)
- ✅ Melhorar responsividade (stack vertical em mobile)
- ✅ Completar acessibilidade (fieldset + legend)
- ✅ Adicionar suporte para validação condicional
- ✅ Implementar layout flexível (1, 2, 3 colunas)

#### os-navigation-item

**Problemas Identificados:**

- ❌ Touch targets < 44px
- ❌ Active state não visível
- ❌ Badge positioning inadequado
- ❌ Falta animação de transição

**Ajustes Necessários:**

- ✅ Garantir touch targets >= 44px
- ✅ Melhorar active state (cor + background + border)
- ✅ Otimizar badge positioning (absolute + top-right)
- ✅ Adicionar animação de transição (color + background)
- ✅ Melhorar acessibilidade (aria-current="page")
- ✅ Adicionar suporte para sub-navegação

#### os-tooltip

**Problemas Identificados:**

- ❌ Acessibilidade inadequada
- ❌ Comportamento mobile inadequado
- ❌ Posicionamento não inteligente
- ❌ Falta animação de entrada

**Ajustes Necessários:**

- ✅ Melhorar acessibilidade (aria-describedby, role="tooltip")
- ✅ Implementar comportamento mobile (tap vs hover)
- ✅ Implementar posicionamento inteligente (auto-ajuste)
- ✅ Adicionar animação de entrada (fade + scale)
- ✅ Melhorar contraste (background + text)
- ✅ Adicionar suporte para tooltips interativos

#### os-alert

**Problemas Identificados:**

- ❌ Cores não usam tokens
- ❌ ARIA role inadequado
- ❌ Dismiss button não acessível
- ❌ Falta animação de entrada

**Ajustes Necessários:**

- ✅ Usar tokens para cores (--os-color-success, --os-color-warning, --os-color-error)
- ✅ Implementar ARIA role="alert" e aria-live="assertive"
- ✅ Melhorar dismiss button (aria-label, keyboard accessible)
- ✅ Adicionar animação de entrada (slide + fade)
- ✅ Melhorar contraste para acessibilidade
- ✅ Adicionar suporte para auto-dismiss

#### os-data-table

**Problemas Identificados:**

- ❌ Responsividade inadequada
- ❌ Sorting não acessível
- ❌ Falta virtual scrolling
- ❌ Paginação não otimizada

**Ajustes Necessários:**

- ✅ Implementar responsividade (cards stacked em mobile)
- ✅ Melhorar sorting acessível (aria-sort, keyboard navigation)
- ✅ Implementar virtual scrolling para performance
- ✅ Otimizar paginação (touch-friendly, keyboard accessible)
- ✅ Melhorar acessibilidade (aria-label para colunas)
- ✅ Adicionar suporte para filtros inline

### 🔹 ORGANISMS (15 componentes)

#### os-goal-progress

**Problemas Identificados:**

- ❌ Falta celebração visual ao atingir 100%
- ❌ Visual de "overdue" não urgente
- ❌ Falta micro-animations
- ❌ Mobile spacing inadequado
- ❌ Acessibilidade incompleta

**Ajustes Necessários:**

- ✅ Implementar celebração visual (confetti, animation, cor dourada)
- ✅ Melhorar visual de "overdue" (vermelho mais intenso, ícone de alerta)
- ✅ Adicionar micro-animations (progress bar fill, hover effects)
- ✅ Otimizar spacing para mobile (--os-spacing-sm)
- ✅ Completar acessibilidade (aria-live para progresso)
- ✅ Adicionar suporte para múltiplas metas
- ✅ Implementar milestone celebrations (25%, 50%, 75%)

#### os-budget-summary

**Problemas Identificados:**

- ❌ Visual não destacado para totais
- ❌ Cores não semânticas
- ❌ Falta gráficos visuais
- ❌ Responsividade inadequada

**Ajustes Necessários:**

- ✅ Destacar totais com typography maior e cor primária
- ✅ Implementar cores semânticas (verde positivo, vermelho negativo)
- ✅ Adicionar gráficos visuais simples (pie chart ou bar chart)
- ✅ Melhorar responsividade (stack vertical em mobile)
- ✅ Adicionar animações de entrada (stagger)
- ✅ Implementar skeleton loading state
- ✅ Adicionar suporte para comparação com mês anterior

#### os-budget-tracker

**Problemas Identificados:**

- ❌ Visual de progresso por categoria inadequado
- ❌ Alertas de orçamento estourado não visíveis
- ❌ Responsividade mobile inadequada
- ❌ Falta interatividade

**Ajustes Necessários:**

- ✅ Melhorar visual de progresso por categoria (bar charts coloridos)
- ✅ Implementar alertas visuais (cores, ícones, animações)
- ✅ Otimizar responsividade mobile (cards stacked)
- ✅ Adicionar interatividade (click para detalhes)
- ✅ Implementar drill-down por categoria
- ✅ Adicionar suporte para múltiplos orçamentos
- ✅ Implementar comparação com períodos anteriores

#### os-goal-tracker

**Problemas Identificados:**

- ❌ Lista de metas sem priorização visual
- ❌ Quick actions não implementadas
- ❌ Filtros por status não disponíveis
- ❌ Falta ordenação inteligente

**Ajustes Necessários:**

- ✅ Implementar priorização visual (cores, ícones, tamanhos)
- ✅ Adicionar quick actions (editar, completar, pausar)
- ✅ Implementar filtros por status (ativas, completadas, atrasadas)
- ✅ Adicionar ordenação inteligente (prazo, prioridade, progresso)
- ✅ Implementar drag & drop para reordenação
- ✅ Adicionar suporte para metas em grupo
- ✅ Implementar notificações de prazo

#### os-transaction-list

**Problemas Identificados:**

- ❌ Visual não escaneável
- ❌ Categorização por cor inadequada
- ❌ Falta infinite scroll
- ❌ Filtros não mobile-friendly

**Ajustes Necessários:**

- ✅ Melhorar visual escaneável (typography, spacing, cores)
- ✅ Implementar categorização por cor consistente
- ✅ Adicionar infinite scroll ou paginação inteligente
- ✅ Otimizar filtros para mobile (drawer, chips)
- ✅ Implementar busca em tempo real
- ✅ Adicionar suporte para agrupamento por data
- ✅ Implementar ações em lote

#### os-category-manager

**Problemas Identificados:**

- ❌ Drag-and-drop não implementado
- ❌ Color picker não disponível
- ❌ Ícones não customizáveis
- ❌ Falta validação de nomes

**Ajustes Necessários:**

- ✅ Implementar drag-and-drop para reordenação
- ✅ Adicionar color picker para categorias
- ✅ Implementar ícones customizáveis
- ✅ Adicionar validação de nomes (únicos, não vazios)
- ✅ Implementar suporte para sub-categorias
- ✅ Adicionar suporte para ícones personalizados
- ✅ Implementar templates de categorias

#### os-header

**Problemas Identificados:**

- ❌ Performance de mobile menu inadequada
- ❌ Sticky behavior inconsistente
- ❌ Z-index não usa tokens
- ❌ Falta animações suaves

**Ajustes Necessários:**

- ✅ Otimizar performance de mobile menu (lazy loading)
- ✅ Melhorar sticky behavior (scroll threshold)
- ✅ Usar tokens para z-index (--os-z-index-sticky)
- ✅ Adicionar animações suaves (slide, fade)
- ✅ Implementar backdrop blur para mobile
- ✅ Adicionar suporte para breadcrumbs
- ✅ Implementar notificações no header

#### os-sidebar

**Problemas Identificados:**

- ❌ Overlay mobile sem backdrop
- ❌ Collapse/expand animation inadequada
- ❌ Keyboard navigation incompleta
- ❌ ARIA attributes incompletos

**Ajustes Necessários:**

- ✅ Implementar overlay mobile com backdrop
- ✅ Melhorar collapse/expand animation (width + opacity)
- ✅ Completar keyboard navigation (Esc para fechar)
- ✅ Completar ARIA attributes (aria-expanded, aria-hidden)
- ✅ Implementar suporte para sub-navegação
- ✅ Adicionar suporte para ícones customizados
- ✅ Implementar persistência de estado

#### os-navigation

**Problemas Identificados:**

- ❌ Touch targets < 44px
- ❌ Active state inconsistente
- ❌ Keyboard navigation incompleta
- ❌ Falta suporte para badges

**Ajustes Necessários:**

- ✅ Garantir touch targets >= 44px
- ✅ Padronizar active state (cor + background + border)
- ✅ Completar keyboard navigation (Arrow keys, Enter)
- ✅ Melhorar suporte para badges (positioning, animação)
- ✅ Implementar suporte para sub-navegação
- ✅ Adicionar suporte para ícones customizados
- ✅ Implementar persistência de estado

#### os-modal

**Problemas Identificados:**

- ❌ Focus trap não implementado
- ❌ Escape key não funciona
- ❌ ARIA role inadequado
- ❌ Backdrop click não configurável

**Ajustes Necessários:**

- ✅ Implementar focus trap (CDK FocusTrap)
- ✅ Implementar Escape key para fechar
- ✅ Implementar ARIA role="dialog"
- ✅ Tornar backdrop click configurável
- ✅ Implementar animações de entrada/saída
- ✅ Adicionar suporte para modais aninhados
- ✅ Implementar suporte para tamanhos customizados

#### os-page-header

**Problemas Identificados:**

- ❌ Responsividade inadequada
- ❌ Breadcrumbs mobile não otimizados
- ❌ Actions não responsivas
- ❌ Falta suporte para back button

**Ajustes Necessários:**

- ✅ Melhorar responsividade (title + actions stack)
- ✅ Otimizar breadcrumbs mobile (truncate, overflow)
- ✅ Implementar actions responsivas (dropdown em mobile)
- ✅ Adicionar suporte para back button
- ✅ Implementar suporte para tabs
- ✅ Adicionar suporte para filtros
- ✅ Implementar suporte para ações em lote

#### os-footer

**Problemas Identificados:**

- ❌ Responsividade mobile inadequada
- ❌ Links não otimizados
- ❌ Falta suporte para social media
- ❌ Acessibilidade incompleta

**Ajustes Necessários:**

- ✅ Melhorar responsividade mobile (stack vertical)
- ✅ Otimizar links (hover states, focus)
- ✅ Adicionar suporte para social media
- ✅ Completar acessibilidade (aria-label, role)
- ✅ Implementar suporte para múltiplas colunas
- ✅ Adicionar suporte para newsletter
- ✅ Implementar suporte para idiomas

#### os-data-grid

**Problemas Identificados:**

- ❌ Responsividade mobile inadequada
- ❌ Virtual scrolling não implementado
- ❌ Sorting não acessível
- ❌ Paginação não otimizada

**Ajustes Necessários:**

- ✅ Melhorar responsividade mobile (cards stacked)
- ✅ Implementar virtual scrolling para performance
- ✅ Melhorar sorting acessível (aria-sort, keyboard)
- ✅ Otimizar paginação (touch-friendly)
- ✅ Implementar suporte para seleção múltipla
- ✅ Adicionar suporte para filtros inline
- ✅ Implementar suporte para exportação

#### os-form-section

**Problemas Identificados:**

- ❌ Spacing inconsistente
- ❌ Collapsible sections não implementadas
- ❌ Validação de grupo inadequada
- ❌ Acessibilidade incompleta

**Ajustes Necessários:**

- ✅ Padronizar spacing (--os-spacing-md)
- ✅ Implementar collapsible sections (accordion)
- ✅ Melhorar validação de grupo (todos os campos)
- ✅ Completar acessibilidade (fieldset + legend)
- ✅ Implementar suporte para validação condicional
- ✅ Adicionar suporte para layout flexível
- ✅ Implementar suporte para progress indicator

#### notification-container

**Problemas Identificados:**

- ❌ ARIA live regions inadequadas
- ❌ Toast positioning mobile inadequado
- ❌ Auto-dismiss timing não configurável
- ❌ Falta suporte para ações

**Ajustes Necessários:**

- ✅ Implementar ARIA live regions (polite, assertive)
- ✅ Melhorar toast positioning mobile (bottom, full width)
- ✅ Tornar auto-dismiss timing configurável
- ✅ Adicionar suporte para ações (botões)
- ✅ Implementar suporte para notificações persistentes
- ✅ Adicionar suporte para notificações em grupo
- ✅ Implementar suporte para notificações com progress

### 🔹 TEMPLATES (8 templates)

#### os-dashboard-template

**Problemas Identificados:**

- ❌ Grid system não responsivo
- ❌ Widget areas não definidas
- ❌ Skeleton screens inadequados
- ❌ Empty states não visuais

**Ajustes Necessários:**

- ✅ Implementar grid system responsivo (12-col desktop, 1-col mobile)
- ✅ Definir widget areas específicas (hero, metrics, charts, actions)
- ✅ Melhorar skeleton screens (shimmer effect)
- ✅ Implementar empty states visuais (ilustrações, CTAs)
- ✅ Adicionar suporte para drag & drop de widgets
- ✅ Implementar suporte para temas
- ✅ Adicionar suporte para personalização

#### os-form-template

**Problemas Identificados:**

- ❌ Layout multi-step não implementado
- ❌ Progress indicator não disponível
- ❌ Mobile-friendly inadequado
- ❌ Validação de grupo não implementada

**Ajustes Necessários:**

- ✅ Implementar layout multi-step (wizard)
- ✅ Adicionar progress indicator visual
- ✅ Melhorar mobile-friendly (stack vertical)
- ✅ Implementar validação de grupo
- ✅ Adicionar suporte para navegação entre steps
- ✅ Implementar suporte para validação condicional
- ✅ Adicionar suporte para salvar rascunho

#### os-list-template

**Problemas Identificados:**

- ❌ Infinite scroll não implementado
- ❌ Filtros sidebar mobile inadequados
- ❌ Empty states não visuais
- ❌ Paginação não otimizada

**Ajustes Necessários:**

- ✅ Implementar infinite scroll ou paginação inteligente
- ✅ Melhorar filtros sidebar mobile (drawer)
- ✅ Implementar empty states visuais
- ✅ Otimizar paginação (touch-friendly)
- ✅ Adicionar suporte para busca em tempo real
- ✅ Implementar suporte para ordenação
- ✅ Adicionar suporte para seleção múltipla

#### os-detail-template

**Problemas Identificados:**

- ❌ Responsividade inadequada
- ❌ Content + sidebar stack não implementado
- ❌ Falta suporte para tabs
- ❌ Actions não responsivas

**Ajustes Necessários:**

- ✅ Melhorar responsividade (content + sidebar stack)
- ✅ Implementar layout flexível (sidebar colapsável)
- ✅ Adicionar suporte para tabs
- ✅ Implementar actions responsivas
- ✅ Adicionar suporte para breadcrumbs
- ✅ Implementar suporte para back button
- ✅ Adicionar suporte para compartilhamento

#### os-modal-template

**Problemas Identificados:**

- ❌ Focus management inadequado
- ❌ Mobile full screen não implementado
- ❌ Keyboard navigation incompleta
- ❌ Animações inadequadas

**Ajustes Necessários:**

- ✅ Melhorar focus management (trap, restore)
- ✅ Implementar mobile full screen
- ✅ Completar keyboard navigation (Tab, Enter, Escape)
- ✅ Melhorar animações (slide, fade, scale)
- ✅ Adicionar suporte para modais aninhados
- ✅ Implementar suporte para tamanhos customizados
- ✅ Adicionar suporte para backdrop configurável

#### os-wizard-template

**Problemas Identificados:**

- ❌ Step indicator não acessível
- ❌ Mobile navigation inadequada
- ❌ Back/Next buttons inconsistentes
- ❌ Validação entre steps não implementada

**Ajustes Necessários:**

- ✅ Melhorar step indicator acessível (aria-current)
- ✅ Otimizar mobile navigation (touch-friendly)
- ✅ Padronizar Back/Next buttons
- ✅ Implementar validação entre steps
- ✅ Adicionar suporte para navegação não linear
- ✅ Implementar suporte para salvar progresso
- ✅ Adicionar suporte para validação condicional

#### os-drawer-template

**Problemas Identificados:**

- ❌ Slide animation inadequada
- ❌ Backdrop não implementado
- ❌ Keyboard close não funciona
- ❌ Responsividade inadequada

**Ajustes Necessários:**

- ✅ Melhorar slide animation (transform + opacity)
- ✅ Implementar backdrop com blur
- ✅ Implementar keyboard close (Escape)
- ✅ Melhorar responsividade (full width em mobile)
- ✅ Adicionar suporte para múltiplos drawers
- ✅ Implementar suporte para tamanhos customizados
- ✅ Adicionar suporte para posicionamento (left, right, top, bottom)

#### os-panel-template

**Problemas Identificados:**

- ❌ Collapsible não implementado
- ❌ Responsividade inadequada
- ❌ Falta suporte para tabs
- ❌ Actions não responsivas

**Ajustes Necessários:**

- ✅ Implementar collapsible (accordion)
- ✅ Melhorar responsividade (stack vertical em mobile)
- ✅ Adicionar suporte para tabs
- ✅ Implementar actions responsivas
- ✅ Adicionar suporte para drag & drop
- ✅ Implementar suporte para redimensionamento
- ✅ Adicionar suporte para temas

### 🔹 THEME SYSTEM

#### \_tokens.scss

**Problemas Identificados:**

- ❌ Faltam tokens de cores primárias em escala (50-900)
- ❌ Spacing nomenclatura inconsistente (xs vs 1, 2, 3)
- ❌ Faltam tokens para Dashboard específicos
- ❌ Cores secundárias não definidas

**Ajustes Necessários:**

- ✅ Adicionar escala completa de cores primárias (--os-color-primary-50 até -900)
- ✅ Adicionar escala completa de cores secundárias (--os-color-secondary-50 até -900)
- ✅ Unificar nomenclatura de spacing (manter scale numérico: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
- ✅ Adicionar tokens para Dashboard específicos (--os-dashboard-\*)
- ✅ Adicionar tokens para breakpoints específicos (--os-breakpoint-\*)
- ✅ Adicionar tokens para z-index específicos (--os-z-index-\*)
- ✅ Adicionar tokens para animações específicas (--os-animation-\*)

#### \_colors.scss

**Problemas Identificados:**

- ❌ Uso de cada cor não documentado
- ❌ Contraste WCAG 2.1 AA não validado
- ❌ Cores semânticas incompletas
- ❌ Falta suporte para dark mode

**Ajustes Necessários:**

- ✅ Documentar uso de cada cor (quando usar cada variante)
- ✅ Validar contraste WCAG 2.1 AA (>= 4.5:1 para texto normal)
- ✅ Completar cores semânticas (success, warning, error, info)
- ✅ Adicionar suporte para dark mode (--os-color-\*-dark)
- ✅ Implementar suporte para high contrast mode
- ✅ Adicionar suporte para cores de acessibilidade
- ✅ Implementar suporte para cores customizadas

#### \_typography.scss

**Problemas Identificados:**

- ❌ Line-height não validado para acessibilidade
- ❌ Falta suporte para fontes customizadas
- ❌ Responsividade inadequada
- ❌ Falta suporte para idiomas

**Ajustes Necessários:**

- ✅ Validar line-height para acessibilidade (>= 1.5)
- ✅ Adicionar suporte para fontes customizadas
- ✅ Melhorar responsividade (fluid typography)
- ✅ Adicionar suporte para idiomas (fontes específicas)
- ✅ Implementar suporte para font-display: swap
- ✅ Adicionar suporte para fontes de ícones
- ✅ Implementar suporte para fallbacks

#### \_spacing.scss

**Problemas Identificados:**

- ❌ Classes utilitárias incompletas
- ❌ Falta suporte para spacing negativo
- ❌ Responsividade inadequada
- ❌ Falta suporte para spacing customizado

**Ajustes Necessários:**

- ✅ Completar classes utilitárias (margins, paddings, gaps)
- ✅ Adicionar suporte para spacing negativo (-m-_, -p-_)
- ✅ Melhorar responsividade (spacing responsivo)
- ✅ Adicionar suporte para spacing customizado
- ✅ Implementar suporte para spacing condicional
- ✅ Adicionar suporte para spacing automático
- ✅ Implementar suporte para spacing dinâmico

#### \_material-theme.scss

**Problemas Identificados:**

- ❌ Override do Material incompleto
- ❌ Paleta customizada não alinhada
- ❌ Falta suporte para temas dinâmicos
- ❌ Performance inadequada

**Ajustes Necessários:**

- ✅ Completar override do Material (todos os componentes)
- ✅ Alinhar paleta customizada com tokens
- ✅ Adicionar suporte para temas dinâmicos
- ✅ Melhorar performance (CSS custom properties)
- ✅ Implementar suporte para temas múltiplos
- ✅ Adicionar suporte para temas personalizados
- ✅ Implementar suporte para temas sazonais

### 🔹 DASHBOARD COMPONENTS (Feature-specific)

#### budget-selector

**Problemas Identificados:**

- ❌ Visual não destacado para orçamento ativo
- ❌ Quick actions não integradas
- ❌ Loading state visual inadequado
- ❌ Error state não visível
- ❌ Mobile: Full width não implementado

**Ajustes Necessários:**

- ✅ Destacar orçamento ativo (cor primária, ícone, badge)
- ✅ Integrar quick actions (editar, criar, compartilhar)
- ✅ Melhorar loading state visual (skeleton, spinner)
- ✅ Melhorar error state (cor vermelha, ícone, mensagem)
- ✅ Implementar mobile full width (stack vertical)
- ✅ Adicionar suporte para busca de orçamentos
- ✅ Implementar suporte para ordenação personalizada
- ✅ Adicionar suporte para favoritos

#### dashboard-widgets

**Problemas Identificados:**

- ❌ Widgets placeholder sem implementação
- ❌ Grid hardcoded não responsivo
- ❌ Skeleton screens inadequados
- ❌ Empty states não visuais
- ❌ Error states sem retry

**Ajustes Necessários:**

- ✅ Implementar todos os widgets (goal-progress, transaction-list, account-balance, monthly-trends, quick-actions)
- ✅ Implementar grid system responsivo (CSS Grid com breakpoints)
- ✅ Melhorar skeleton screens (shimmer effect, animação)
- ✅ Implementar empty states visuais (ilustrações, CTAs)
- ✅ Melhorar error states com retry (botão, mensagem clara)
- ✅ Adicionar suporte para drag & drop de widgets
- ✅ Implementar suporte para personalização de layout
- ✅ Adicionar suporte para widgets customizados

## 📚 References

### Design System Documentation

- Atoms: [src/app/shared/ui-components/atoms/]
- Molecules: [src/app/shared/ui-components/molecules/]
- Organisms: [src/app/shared/ui-components/organisms/]
- Templates: [src/app/shared/ui-components/templates/]

### Material Design Guidelines

- Angular Material 20.2.3: Componentes base
- CDK: BreakpointObserver, VirtualScrolling, DragDrop

### WCAG Guidelines

- WCAG 2.1 AA: Diretrizes de acessibilidade
- Focus management: Keyboard navigation
- Screen reader support: ARIA patterns

### Código Similar no Projeto

- Dashboard atual: [src/app/features/dashboard/]
- Design System: [src/app/shared/ui-components/]
- Theme system: [src/app/shared/ui-components/theme/]

### Meta Specs - Contexto de Produto

- **Personas**: [personas.md] - Ana, Carlos, Roberto & Maria, Júlia
- **Jornada do Cliente**: [customer-journey.md] - Estágio de Adoção
- **Conceitos Centrais**: [core-concepts.md] - Metas SMART, Múltiplos Orçamentos
- **Funcionalidades Core**: [03_funcionalidades_core.md] - Dashboard Centrado em Progresso
