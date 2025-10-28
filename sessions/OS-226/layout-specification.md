# Budgets - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Transmitir controle, clareza e colaboração na gestão de orçamentos. Facilitar descoberta, criação e edição com fluidez via modal, mantendo o contexto da lista/detalhe.

### Tipo de Layout

- List, Detail, Modal (Form)

### Público-Alvo

- Universal com abordagem Mobile-first

### Persona Primária

- Ana (Organizadora Familiar) no contexto de budgets

**Características da Persona:**

- Precisa de visão clara e simples; tempo reduzido
- Colaboração com parceiro; múltiplos orçamentos
- Usa mobile frequentemente; desktop em períodos de planejamento

### Contexto de Uso

- Acesso recorrente via Dashboard e AppBar
- Criação rápida via modal; edição contextual

### Funcionalidades Core Relacionadas

- Múltiplos Orçamentos; Compartilhamento; Metas SMART; Transações temporais

### Considerações da Jornada do Usuário

**Estágio da Jornada:** Engajamento → Adoção

**Objetivos do Usuário neste Estágio:**

- Consolidar controle; criar/ajustar orçamentos; navegar entre contextos

**Touchpoints Críticos:**

- Seleção de orçamento; criação fluida; feedbacks claros

## 📱 Responsive Strategy

### Breakpoints Definidos

- Mobile (0-575px):
  - Stack vertical; 1 coluna
  - Touch targets >= 44px
  - Ações primárias sempre visíveis
- Tablet (576-991px):
  - Grid 2 colunas para cards
  - Filtros compactos em linha
- Desktop (992px+):
  - Grid 12 colunas; 3 ou 4 cards por linha
  - Filtros em toolbar superior

### Mobile-First Approach

- Estilização progressiva; esconder elementos não críticos em mobile

### Touch Interactions

- Tap: abrir modal; swipe não necessário para lista

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- os-button: primary/secondary/tertiary; small/medium/large
- os-input: texto; com validação
- os-icon: ícones de ação (add, edit, delete, filter)
- os-progress-bar (para detalhe/overview quando aplicável)

#### Molecules

- os-form-field: campos do formulário
- os-card: container de cards de orçamento
- os-dropdown (para filtros simples)

#### Organisms

- os-modal: modal de criação/edição (variant: form)
- os-page-header: header das páginas
- os-transaction-list (referência de list/toolbar patterns)

#### Templates

- os-form-template: estrutura do formulário no modal
- os-app-shell-template: layout base com header/slots

### Novos Componentes (Especificação Detalhada)

- BudgetCard (molecule/organism leve)
  - Props: id, name, type, participantsCount, lastModified?, balance?
  - States: default, hover, focus, selected?
  - Ações: editar (abre modal), excluir (confirmação), abrir detalhe (card click)
  - A11y: role="button" no card; aria-label com nome do orçamento

## 🏗️ Layout Structure

### Grid System

- Columns: 12 desktop, 8 tablet, 1 mobile
- Gap: 16px desktop, 12px tablet, 8px mobile
- Max Width: 1200px

### Sections

#### Header

- os-header + os-dashboard-budget-selector
- Altura: 64px desktop, 56px mobile; sticky

#### Main Content - Budgets List

- Toolbar superior: filtros (texto + período + status) e ação "Criar"
- Grid de `BudgetCard` responsivo

#### Detail Page

- Page header com título do orçamento e ações (Editar, Excluir)
- Cards secundários (participants, overview link)

#### Modal (Form)

- os-modal (variant: form) + os-form-template
- Campos: name (texto), type (dropdown: PERSONAL | SHARED)
- Ações: Cancelar/Salvar; loading/disabled conforme estado

### Spacing Strategy

- Section gaps: 24/16/12
- Component gaps: 16/12/8

### Visual Hierarchy

1. Header e CTAs principais
2. Lista de orçamentos (cards)
3. Filtros e ações secundárias

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- Tab order lógico; foco visível
- Esc fecha modais; Enter/Space ativa card
- Skip to main content

#### ARIA Implementation

- Landmarks: header, main, footer
- Modal: role="dialog" aria-modal="true" aria-labelledby/aria-describedby
- Botões com aria-label descritivas

#### Visual Accessibility

- Contraste 4.5:1
- Font-size mínimo 16px; line-height 1.5
- Respeitar prefers-reduced-motion

#### Screen Reader Support

- Headings hierárquicos
- Labels explícitas em inputs
- Mensagens de erro anunciadas (aria-live)

## 🎭 States and Interactions

### Global States

- Loading: spinner/list skeleton
- Empty: mensagem + CTA criar
- Error: mensagem + retry
- Success: toast de confirmação

### Micro-interactions

- Hover: elevação/outline de cards
- Focus: focus ring visível
- Transitions: 200ms ease-in-out

### Component-Specific Interactions

- Card click abre detalhe; botão Edit abre modal; Delete abre confirmação (os-modal variant confirmation)

## 📐 Visual Specifications

### Wireframes (ASCII)

#### Mobile (< 576px)

```
[Header]
[Selector]
[Toolbar: Filtros]
[Card]
[Card]
[Card]
```

#### Tablet (576-991px)

```
[Header]
[Selector]
[Toolbar]
[Card][Card]
[Card][Card]
```

#### Desktop (>= 992px)

```
[Header | Selector | Ações]
[Toolbar: Filtros + Criar]
[Card][Card][Card][Card]
[Card][Card][Card][Card]
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

- BudgetCardComponent
- BudgetFormComponent (modal)
- BudgetListPage
- BudgetDetailPage

**Modificações:**

- AppLayoutComponent: tratar createBudgetRequested
- DashboardWidgetsComponent: onWidgetClick → detalhe

### Dependências de UI

- Sem novas dependências (reuso DS + Material infra já existente)

### Impacto em Performance

- Lazy-load rotas de budgets
- OnPush em todos componentes
- CSS leve por componente

### Integration Points

- Integra com `BudgetState`/`BudgetService`
- Usa `BudgetSelectionService` para seleção

## 🧪 Layout Validation Criteria

### Design System Compliance

- [ ] os-\* utilizados corretamente e tokens aplicados

### Responsiveness

- [ ] Mobile-first; breakpoints funcionais; sem scroll horizontal

### Accessibility

- [ ] WCAG 2.1 AA; keyboard; ARIA; contraste; focus visible

### Performance

- [ ] OnPush; lazy loading; computed signals

### Visual Quality

- [ ] Spacing, alinhamento, hierarquia e estados

## 📚 References

### Design System Documentation

- Atoms/Molecules/Organisms/Templates em `src/app/shared/ui-components/`

### WCAG Guidelines

- Referência geral WCAG 2.1 AA

### Código Similar no Projeto

- `os-form-template`, `os-modal`, `os-transaction-list` (padrões de list/toolbar)

### Meta Specs - Contexto de Produto

- Personas, Jornada do Cliente, Conceitos Centrais
