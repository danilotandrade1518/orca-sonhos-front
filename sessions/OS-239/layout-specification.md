# Finalizar Implementação do Componente Budget Detail Page - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

A página de detalhes do orçamento deve comunicar **clareza, controle e progresso**. O layout deve permitir que o usuário tenha uma visão completa e organizada de todas as informações relevantes do orçamento, facilitando a tomada de decisões financeiras e o acompanhamento de metas.

### Tipo de Layout

**Detail Page** - Página de detalhes com múltiplas seções organizadas verticalmente em cards.

### Público-Alvo

**Universal** - Mobile-first com adaptações para tablet e desktop.

### Persona Primária

**Ana - A Organizadora Familiar** (32 anos, casada, 2 filhos, gerencia finanças da casa)

**Características da Persona:**

- Gerencia as finanças da casa e quer envolver o marido no controle financeiro
- Organizada mas sobrecarregada, precisa de interface intuitiva que substitua planilhas complexas
- Usa principalmente desktop/tablet para gerenciamento financeiro, mas também mobile para consultas rápidas
- Nível de sofisticação: Intermediário - precisa de funcionalidades completas mas com simplicidade de uso
- Dores específicas: Dificuldade para visualizar progresso das metas, falta clareza sobre onde vai o dinheiro, ansiedade com planejamento futuro
- Objetivos: Comprar casa própria, criar reserva de emergência, ter controle compartilhado com o marido

**Por que Ana é a persona primária para este layout:**

- A página de detalhes do orçamento é especialmente relevante para quem gerencia orçamentos compartilhados
- Ana precisa de visão completa e organizada para tomar decisões financeiras familiares
- O compartilhamento e colaboração são funcionalidades centrais desta página
- Ana representa o uso regular e engajado da ferramenta (estágio de Adoção)

### Contexto de Uso

A página de detalhes do orçamento é acessada quando o usuário:
- Clica em um orçamento específico na lista de orçamentos
- Navega diretamente via URL `/budgets/:id`
- Precisa visualizar informações completas sobre um orçamento específico
- Quer gerenciar participantes, visualizar contas ou ver resumo financeiro

**Frequência de uso:** Regular (2-3x por semana) durante o estágio de Adoção.

### Funcionalidades Core Relacionadas

1. **Múltiplos Orçamentos**: A página permite visualizar detalhes de um orçamento específico, facilitando a alternância entre diferentes contextos financeiros
2. **Compartilhamento Familiar Simplificado**: Seção de colaboração permite gerenciar participantes do orçamento compartilhado
3. **Sistema de Metas SMART**: A seção "Visão Geral" pode exibir progresso de metas vinculadas ao orçamento
4. **Sistema Dual (Orçamentos/Contas)**: Seção de contas mostra onde o dinheiro está fisicamente armazenado
5. **Dashboard Motivacional**: Widgets de resumo financeiro incentivam o progresso e mostram saúde financeira

### Considerações da Jornada do Usuário

**Estágio da Jornada:**

- **Adoção (D+7 a D+30)** - Usuário já está usando regularmente e precisa de detalhes completos

**Objetivos do Usuário neste Estágio:**

- Visualizar informações completas sobre um orçamento específico
- Gerenciar participantes do orçamento compartilhado
- Ver resumo financeiro e progresso de metas
- Acessar contas vinculadas ao orçamento
- Tomar decisões financeiras baseadas em dados consolidados

**Valor Percebido Esperado:**

- Visão consolidada e organizada de todas as informações do orçamento
- Facilidade para gerenciar colaboração familiar
- Insights financeiros claros e acionáveis
- Navegação intuitiva para ações relacionadas (transações, contas, etc.)

**Friction Points a Evitar:**

- Informações fragmentadas em múltiplas páginas
- Dificuldade para encontrar ações importantes
- Carregamento lento ou estados de loading confusos
- Falta de feedback visual sobre progresso e saúde financeira

**Touchpoints Críticos:**

- **Primeira visualização**: Interface deve impressionar com organização e clareza
- **Gerenciamento de participantes**: Deve ser simples e direto, sem burocracias
- **Visualização de resumo financeiro**: Deve gerar "aha moment" sobre situação financeira
- **Navegação para ações**: Botões e links devem ser claros e acessíveis

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:
  - Layout: Stack vertical completo, single column
  - Touch targets: >= 44px para todos os elementos interativos
  - Cards: Full width, padding reduzido (16px)
  - Grid de informações: 1 coluna
  - Botões: Full width em ações principais, stacked verticalmente
  - Comportamento específico: Navegação simplificada, scroll vertical, modais quase full-screen

- **Tablet (576-991px)**:
  - Layout: Stack vertical com grid de 2 colunas onde aplicável
  - Navegação: Breadcrumbs visíveis, ações no header
  - Cards: Padding médio (20px), espaçamento entre cards (20px)
  - Grid de informações: 2 colunas
  - Botões: Inline quando possível, mantendo hierarquia visual
  - Comportamento específico: Melhor aproveitamento do espaço horizontal

- **Desktop (992px+)**:
  - Layout: Stack vertical com max-width 1200px, centralizado
  - Hover states: Ativos em cards e botões
  - Cards: Padding completo (24px), espaçamento generoso (24px)
  - Grid de informações: 3 colunas quando apropriado
  - Botões: Inline, agrupados logicamente
  - Comportamento específico: Hover effects, melhor visualização de dados, mais informações visíveis sem scroll

### Mobile-First Approach

Estratégia de progressive enhancement:
1. **Base Mobile**: Layout funcional e completo em mobile
2. **Tablet Enhancement**: Aproveitamento de espaço horizontal, grid de 2 colunas
3. **Desktop Enhancement**: Max-width, hover states, melhor hierarquia visual

### Touch Interactions

- **Tap**: Todos os elementos interativos com área de toque >= 44x44px
- **Swipe**: Não aplicável nesta página (scroll vertical apenas)
- **Long Press**: Não necessário
- **Gestos**: Scroll nativo do navegador

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:
  - Variant: `primary` (ações principais), `secondary` (ações secundárias), `danger` (excluir)
  - Size: `small` (header actions), `medium` (ações principais)
  - Usage: Navegação, ações de gerenciamento, CTAs

- **os-icon**:
  - Size: `sm` (inline), `md` (destaque)
  - Usage: Indicadores visuais, ícones de ações

- **os-skeleton**:
  - Variant: `card`
  - Size: `lg`
  - Usage: Estados de loading

- **os-badge**:
  - Variant: `info`, `success`, `warning`
  - Size: `sm`
  - Usage: Indicadores de status, contadores

#### Molecules

- **os-alert**:
  - Type: `error`, `warning`
  - Usage: Mensagens de erro, estados vazios

- **os-money-display**:
  - Size: `md`, `lg`
  - Variant: `positive`, `negative`, `default`
  - Usage: Exibição de valores monetários

- **os-account-card** (recomendado):
  - Variant: `default`
  - Size: `medium`
  - Usage: Listagem de contas do orçamento

#### Organisms

- **os-page**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Container principal da página

- **os-page-header**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Cabeçalho com título, breadcrumbs e ações

- **os-dashboard-widgets**:
  - Usage: Seção "Visão Geral" com resumo financeiro
  - Configuração: Widget `budget-summary` com dados do orçamento

- **collaboration-dashboard**:
  - Usage: Seção "Colaboração" com lista de participantes
  - Inputs: `budgetId`, `creatorId`

#### Templates

- **os-modal-template**:
  - Variant: `compact`
  - Size: `small`
  - Usage: Modal de confirmação de exclusão

### Novos Componentes (Especificação Detalhada)

Nenhum componente novo necessário - reutilização completa de componentes existentes do design system.

## 🏗️ Layout Structure

### Grid System

- **Columns**: 1 coluna (mobile), 2 colunas (tablet para info-grid), 3 colunas (desktop para info-grid)
- **Gap**: 16px (mobile), 20px (tablet), 24px (desktop)
- **Max Width**: 1200px (container da página via `os-page`)

### Sections

#### Header (os-page-header)

- **Components**: `os-page-header` com breadcrumbs, título, subtítulo e ações
- **Height**: Auto (conteúdo dinâmico)
- **Sticky**: Não (scroll normal)
- **Z-index**: N/A
- **Conteúdo**:
  - Breadcrumbs: ["Orçamentos", "Nome do Orçamento"]
  - Título: Nome do orçamento
  - Subtítulo: "Orçamento Pessoal" ou "Orçamento Compartilhado"
  - Ações: Botões "Editar" e "Excluir"

#### Main Content

- **Layout**: Stack vertical (flexbox column)
- **Padding**: 0 (padding vem do `os-page`)
- **Gap entre seções**: 24px (desktop), 20px (tablet), 16px (mobile)
- **Components**: Cards com seções organizadas

**Seções (em ordem):**

1. **Informações Básicas** (Card)
   - Grid de informações: ID, Tipo, Participantes
   - Layout: Grid responsivo (1-3 colunas)

2. **Visão Geral** (Card)
   - Componente: `os-dashboard-widgets`
   - Widget: `budget-summary` com resumo financeiro
   - Botão: "Ver Transações"

3. **Contas do Orçamento** (Card)
   - Header: Título + Botão "Criar Nova Conta"
   - Conteúdo: Lista de contas (usando `os-account-card` ou lista estilizada)
   - Footer: Botão "Ver Todas as Contas"

4. **Colaboração** (Card)
   - Header: Título + Botão "Gerenciar Participantes"
   - Conteúdo: `collaboration-dashboard` com lista de participantes

### Spacing Strategy

- **Section Gaps**: 24px (desktop), 20px (tablet), 16px (mobile)
- **Component Gaps**: 16px (desktop), 12px (tablet), 8px (mobile)
- **Card Padding**: 24px (desktop), 20px (tablet), 16px (mobile)
- **Consistent Padding Scale**: 8px, 12px, 16px, 20px, 24px

### Visual Hierarchy

1. **Nível 1 - H1 (Page Header)**: Nome do orçamento - elemento mais importante
2. **Nível 2 - H2 (Card Titles)**: Títulos das seções (Informações Básicas, Visão Geral, etc.)
3. **Nível 3 - H3 (Subsections)**: Subtítulos dentro de cards (se necessário)
4. **Conteúdo**: Texto body, valores, labels

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial
  - Header (breadcrumbs → título → ações)
  - Main content (seções em ordem)
  - Cards (título → conteúdo → ações)
  - Modals (quando abertos)
- **Focus Management**: 
  - Visible focus ring em todos elementos interativos (2px solid `--os-color-primary`)
  - Focus trap em modals
  - Focus retorno após fechar modal
- **Shortcuts**: 
  - `Esc`: Fecha modais
  - `Enter/Space`: Ativa botões e links
- **Skip Links**: Não necessário (página simples, header não sticky)

#### ARIA Implementation

- **Landmarks**:
  - `<header role="banner">` - Header principal (via `os-page-header`)
  - `<main role="main">` - Conteúdo principal (via `os-page`)
  - `<section>` - Cada card é uma seção semântica
  - `<nav role="navigation">` - Breadcrumbs (via `os-page-header`)

- **Live Regions**:
  - `aria-live="polite"` para estados de loading
  - `aria-live="assertive"` para mensagens de erro críticas

- **Labels e Descriptions**:
  - Todos os botões com `aria-label` descritivos
  - Ícones decorativos com `aria-hidden="true"`
  - Cards com `role="region"` e `aria-label` quando necessário
  - Listas com `role="list"` e `aria-label`

#### Visual Accessibility

- **Contraste**:
  - Texto normal: >= 4.5:1 (WCAG AA)
  - Texto grande (>= 18px): >= 3:1 (WCAG AA)
  - UI Components: >= 3:1 (WCAG AA)

- **Typography**:
  - Font-size mínimo: 16px (1rem) para body text
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200% sem quebra de layout

- **Motion**:
  - Respeita `prefers-reduced-motion`
  - Transições <= 300ms
  - Sem animações desnecessárias ou distrações

#### Screen Reader Support

- **Content Structure**: Headings hierárquicos (h1 → h2)
- **Alt Text**: N/A (sem imagens)
- **Form Labels**: N/A (sem formulários nesta página)
- **Error Messages**: Anunciados via `aria-live="assertive"`

## 🎭 States and Interactions

### Global States

- **Loading**:
  - Skeleton screens para conteúdo principal
  - Loading state em botões durante ações
  - Mensagem "Carregando..." com `aria-live="polite"`

- **Empty**:
  - Mensagem clara e descritiva
  - Call-to-action quando aplicável (ex: "Criar Primeira Conta")
  - Ícone ilustrativo (se disponível no design system)

- **Error**:
  - `os-alert` com tipo `error`
  - Mensagem descritiva do erro
  - Botão de ação (ex: "Tentar Novamente" ou "Voltar para Lista")
  - `aria-live="assertive"` para anunciar erro

- **Success**:
  - Feedback visual via toast (se disponível) ou mensagem inline
  - Confirmação de ações (ex: "Participante adicionado com sucesso")

### Micro-interactions

- **Hover**: 
  - Cards: Elevação sutil (box-shadow aumentado)
  - Botões: Mudança de cor de fundo, transform translateY(-1px)
  - Links: Underline ou mudança de cor
- **Focus**: 
  - Ring outline (2px solid `--os-color-primary`)
  - Visível em todos elementos interativos
- **Active**: 
  - Botões: Scale down (transform: scale(0.98))
  - Cards: Pressed state (box-shadow reduzido)
- **Transitions**: 
  - 200ms ease-in-out para estados de hover/focus
  - 150ms ease-out para active states

### Component-Specific Interactions

- **os-dashboard-widgets**: 
  - Hover em widgets individuais (se clickable)
  - Loading state interno
  - Empty state com mensagem

- **collaboration-dashboard**: 
  - Hover em cards de participantes
  - Loading state durante remoção
  - Feedback visual ao adicionar/remover participante

- **os-account-card**: 
  - Hover: Elevação do card
  - Click: Navegação para detalhes da conta (se implementado)

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ [Breadcrumbs]           │
│ Nome do Orçamento       │
│ Orçamento Compartilhado │
│ [Editar] [Excluir]     │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Informações Básicas│ │
│ │ ID | Tipo | Part.  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Visão Geral         │ │
│ │ [Dashboard Widgets] │ │
│ │ [Ver Transações]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Contas do Orçamento │ │
│ │ [+ Criar Nova Conta]│ │
│ │ [Account Card 1]    │ │
│ │ [Account Card 2]    │ │
│ │ [Ver Todas]        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Colaboração         │ │
│ │ [Gerenciar Part.]   │ │
│ │ [Participant List]  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Anotações:**
- Stack vertical completo
- Cards full width
- Touch targets >= 44px
- Padding reduzido (16px)
- Botões full width em ações principais
- Scroll vertical apenas

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ [Breadcrumbs]                     │
│ Nome do Orçamento                 │
│ Orçamento Compartilhado           │
│ [Editar] [Excluir]                │
├───────────────────────────────────┤
│ ┌───────────────────────────────┐ │
│ │ Informações Básicas           │ │
│ │ ID  │ Tipo │ Participantes    │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Visão Geral                   │ │
│ │ [Dashboard Widgets - 2 cols]  │ │
│ │ [Ver Transações]              │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Contas do Orçamento           │ │
│ │ [+ Criar Nova Conta]          │ │
│ │ [Card 1] [Card 2]             │ │
│ │ [Ver Todas]                   │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ Colaboração                   │ │
│ │ [Gerenciar Participantes]     │ │
│ │ [Participant Grid - 2 cols]  │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

**Anotações:**
- Grid de 2 colunas onde aplicável
- Melhor aproveitamento de espaço horizontal
- Padding médio (20px)
- Botões inline quando possível

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ [Breadcrumbs]                               │
│ Nome do Orçamento                           │
│ Orçamento Compartilhado                     │
│ [Editar] [Excluir]                          │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Informações Básicas                     │ │
│ │ ID │ Tipo │ Participantes               │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Visão Geral                             │ │
│ │ [Dashboard Widgets - Grid completo]     │ │
│ │ [Ver Transações]                        │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Contas do Orçamento                     │ │
│ │ [+ Criar Nova Conta]                    │ │
│ │ [Card 1] [Card 2] [Card 3]             │ │
│ │ [Ver Todas]                             │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Colaboração                             │ │
│ │ [Gerenciar Participantes]               │ │
│ │ [Participant Grid - 3 cols]            │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Anotações:**
- Max-width 1200px, centralizado
- Padding completo (24px)
- Grid de 3 colunas onde apropriado
- Hover states ativos
- Melhor hierarquia visual

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**
Nenhum componente novo necessário.

**Modificações:**
- `budget-detail.page.ts`: Adicionar imports e integrar componentes
- `budget-detail.page.scss`: Adicionar estilos faltantes para classes existentes

### Dependências de UI

Nenhuma nova dependência externa. Apenas componentes existentes do design system:
- `OsDashboardWidgetsComponent`
- `AccountCardComponent` (opcional)
- `CollaborationDashboardComponent`

### Impacto em Performance

- **Bundle Size**: Mínimo - apenas imports de componentes existentes
- **Lazy Loading**: Não necessário - componentes já estão no bundle principal
- **Critical CSS**: Estilos de loading e estrutura básica devem estar no CSS crítico

### Integration Points

- **BudgetState**: Para dados do orçamento
- **AccountState**: Para lista de contas
- **SharingState**: Para lista de participantes
- **ReportsState**: Para dados financeiros (opcional)
- **BudgetSelectionService**: Para seleção de orçamento atual

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance
- [ ] Componentes `os-*` utilizados corretamente
- [ ] Design tokens aplicados (`--os-*`)
- [ ] Nomenclatura consistente (BEM para classes customizadas)
- [ ] Tema aplicado corretamente

### Responsiveness
- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile, tablet, desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Grid responsivo funciona corretamente

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa
- [ ] ARIA attributes corretos
- [ ] Screen reader friendly
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos

### Performance
- [ ] OnPush change detection
- [ ] Computed signals para derivações
- [ ] Sem re-renderizações desnecessárias

### Visual Quality
- [ ] Spacing consistente (8px, 12px, 16px, 20px, 24px)
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara (H1 → H2 → conteúdo)
- [ ] Estados (loading, error, empty) implementados
- [ ] Cards com padding e espaçamento adequados

## 📚 References

### Design System Documentation
- **Atoms**: `src/app/shared/ui-components/atoms/`
- **Molecules**: `src/app/shared/ui-components/molecules/`
- **Organisms**: `src/app/shared/ui-components/organisms/`
- **Templates**: `src/app/shared/ui-components/templates/`

### Material Design Guidelines
- Material Design 3 - Layout patterns
- Material Design - Accessibility guidelines

### WCAG Guidelines
- WCAG 2.1 Level AA - Success Criteria
- WAI-ARIA Authoring Practices Guide

### Código Similar no Projeto
- `src/app/features/accounts/pages/accounts/accounts.page.ts` - Exemplo de listagem de contas
- `src/app/features/reports/pages/reports/reports.page.ts` - Exemplo de uso de widgets de dashboard
- `src/app/features/budget/components/collaboration-dashboard/` - Componente de colaboração

### Meta Specs - Contexto de Produto
- **Personas**: `business/customer-profile/personas.md` - Perfis de usuário e necessidades específicas
- **Jornada do Cliente**: `business/customer-profile/customer-journey.md` - Touchpoints e estágios de engajamento
- **Conceitos Centrais**: `business/product-vision/core-concepts.md` - Domínio financeiro e regras de negócio
- **Funcionalidades Core**: `business/03_funcionalidades_core.md` - Diferenciação e valor único

