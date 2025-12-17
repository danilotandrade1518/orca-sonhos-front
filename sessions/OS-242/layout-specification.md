# Padronizar páginas de listagem - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Padronizar todas as páginas de listagem e formulários (criação/edição) para seguir um padrão visual consistente, garantindo:

- **Consistência**: Todas as páginas seguem o mesmo padrão visual estabelecido em Orçamentos
- **Clareza**: Navegação intuitiva com botões "Novo" no header e breadcrumbs em páginas de criação/edição
- **Profissionalismo**: Interface limpa e organizada que transmite confiança
- **Acessibilidade**: Suporte completo para navegação por teclado e leitores de tela

### Tipo de Layout

- **Páginas de Listagem**: List/Grid layout com header, filtros (onde existem) e lista de entidades
- **Páginas de Criação/Edição**: Form layout com header com breadcrumbs e formulário centralizado

### Público-Alvo

**Universal** - Mobile-first com progressive enhancement para desktop

### Persona Primária

**Usuários de aplicação financeira pessoal/familiar** que precisam:

- Gerenciar múltiplos orçamentos
- Criar e editar entidades financeiras rapidamente
- Navegação clara e intuitiva
- Acesso tanto mobile quanto desktop

**Características da Persona:**

- Usuários que valorizam simplicidade e clareza
- Necessidade de acesso rápido às funcionalidades principais
- Uso frequente em dispositivos móveis
- Expectativa de feedback visual claro nas ações

### Contexto de Uso

- **Páginas de Listagem**: Visualização e gerenciamento de entidades (Orçamentos, Contas, Cartões, Transações, Categorias, Envelopes)
- **Páginas de Criação/Edição**: Criação e edição de entidades através de formulários dedicados

### Funcionalidades Core Relacionadas

- **Sistema de Múltiplos Orçamentos**: Navegação contextual entre diferentes orçamentos
- **Gestão Financeira**: Criação rápida de contas, cartões, transações e categorias
- **Organização**: Filtros e busca para localizar entidades rapidamente

### Considerações da Jornada do Usuário

**Estágio da Jornada:** Engajamento e Adoção

**Objetivos do Usuário neste Estágio:**

- Criar e gerenciar entidades financeiras rapidamente
- Navegar entre diferentes seções da aplicação com facilidade
- Ter feedback claro sobre ações realizadas
- Acessar funcionalidades principais de forma intuitiva

**Touchpoints Críticos:**

- Botão "Novo" no header deve ser facilmente acessível
- Breadcrumbs devem permitir navegação rápida de volta
- Formulários devem ser claros e objetivos
- Feedback visual após criação/edição bem-sucedida

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column
  - Touch targets: >= 44px (recomendação WCAG)
  - Header: Compacto, botões em linha única quando possível
  - Formulários: Campos em stack vertical completo
  - Filtros: Colapsáveis ou em stack vertical

- **Tablet (576-991px)**:

  - Layout: Grid 2 colunas quando aplicável
  - Header: Mais espaçado, ações visíveis
  - Formulários: Campos podem estar lado a lado quando faz sentido
  - Filtros: Visíveis, layout horizontal quando possível

- **Desktop (992px+)**:
  - Layout: Grid completo, máximo 1200px de largura
  - Header: Espaçamento completo, todas ações visíveis
  - Formulários: Layout otimizado, campos lado a lado quando apropriado
  - Filtros: Sempre visíveis, layout horizontal

### Mobile-First Approach

- Estilos base para mobile
- Progressive enhancement com media queries para tablet e desktop
- Componentes adaptam-se automaticamente usando BreakpointObserver do Angular CDK

### Touch Interactions

- Botões com tamanho mínimo de 44x44px em mobile
- Espaçamento adequado entre elementos interativos
- Gestos de swipe mantidos apenas onde já existem (não adicionar novos)

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: `primary` para ações principais (Criar, Salvar)
  - Variant: `secondary` para ações secundárias (Cancelar, Transferir)
  - Size: `medium` padrão, `large` em mobile quando necessário
  - Usage: Botões de ação no header e formulários

- **os-input**:

  - Type: `text` para campos de texto
  - Validation: Integrado com Reactive Forms
  - Usage: Campos de formulário (nome, descrição, etc.)

- **os-select**:

  - Options: Array de opções com value/label
  - Required: Quando aplicável
  - Usage: Seleção de tipo, categoria, etc.

- **os-icon**:

  - Name: Material Icons (plus, edit, delete, etc.)
  - Size: `sm` para breadcrumbs, `md` para botões
  - Usage: Ícones em botões, breadcrumbs, ações

- **os-label**:

  - Variant: `default`
  - Required: Quando campo é obrigatório
  - Usage: Labels de campos de formulário

- **os-money-input**:
  - AllowNegative: `false` para valores positivos
  - Usage: Campos monetários (saldo, limite, etc.)

#### Molecules

- **os-form-field**:

  - Label: Texto descritivo do campo
  - Required: Indicador visual de campo obrigatório
  - ErrorMessage: Mensagem de erro reativa
  - Usage: Wrapper para campos de formulário

- **os-filter-bar**:

  - Variant: `default`
  - Size: `medium`
  - HasActiveFilters: Computed signal
  - Usage: Barra de filtros em páginas de listagem (onde já existe)

- **os-card**:

  - Variant: `default`
  - Usage: Cards de entidades em listas

- **os-alert**:
  - Type: `error`, `info`, `success`
  - Usage: Mensagens de erro, feedback, informações

#### Organisms

- **os-page-header**:

  - Title: Título da página
  - Subtitle: Descrição opcional
  - Actions: Array de ações (botão "Novo", etc.)
  - Breadcrumbs: Array de breadcrumbs (em páginas de criação/edição)
  - Usage: Header padrão de todas as páginas

- **os-page**:

  - Variant: `default`
  - Size: `medium`
  - Usage: Container principal de todas as páginas

- **os-entity-list**:
  - Layout: `grid` para cards
  - Size: `medium`
  - Loading/Empty states: Integrados
  - Usage: Lista de entidades em páginas de listagem

#### Templates

- **os-form-template**:
  - Config: FormTemplateConfig com ações, progresso, etc.
  - Form: FormGroup reativo
  - Loading: Estado de carregamento
  - Usage: Template padrão para formulários de criação/edição

### Novos Componentes (Especificação Detalhada)

**Nenhum novo componente necessário** - Todos os componentes existentes são suficientes para a padronização.

## 🏗️ Layout Structure

### Grid System

- **Columns**: 12-col desktop, 8-col tablet, 1-col mobile
- **Gap**: 16px desktop, 12px tablet, 8px mobile
- **Max Width**: 1200px container (via `os-page`)

### Sections

#### Header (os-page-header)

- **Components**: `os-page-header` com title, subtitle, actions
- **Height**: Auto (conteúdo define altura)
- **Sticky**: Não (scroll natural)
- **Actions**: Botão "Novo [Entidade]" sempre presente em páginas de listagem
- **Breadcrumbs**: Presentes em páginas de criação/edição

#### Main Content

**Páginas de Listagem:**

- **Layout**: Stack vertical
- **Padding**: 24px desktop, 16px mobile (via `os-page`)
- **Sections**:
  1. Header (os-page-header)
  2. Filtros (os-filter-bar) - onde existem
  3. Lista (os-entity-list ou conteúdo customizado)

**Páginas de Criação/Edição:**

- **Layout**: Stack vertical, formulário centralizado
- **Padding**: 24px desktop, 16px mobile (via `os-page`)
- **Sections**:
  1. Header com breadcrumbs (os-page-header)
  2. Formulário (os-form-template)
     - Card interno com formulário reativo
     - Campos em stack vertical (mobile) ou grid (desktop quando apropriado)
     - Ações no rodapé do card

### Spacing Strategy

- **Section Gaps**: 32px desktop, 24px tablet, 16px mobile
- **Component Gaps**: 16px desktop, 12px tablet, 8px mobile
- **Consistent Padding**: 24px, 16px, 12px, 8px scale

### Visual Hierarchy

1. **H1 (Título da página)** - Maior destaque, define contexto
2. **H2 (Subtítulo)** - Contexto adicional quando necessário
3. **Formulários/Cards** - Conteúdo principal
4. **Ações** - Botões de ação claramente visíveis

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - header → filtros → conteúdo → ações
- **Focus Management**:
  - Focus visível em todos elementos interativos (ring outline)
  - Focus trap em modais (quando ainda existirem para confirmações)
  - Focus retorna ao elemento que abriu modal após fechamento
- **Shortcuts**:
  - `Esc` fecha modais de confirmação
  - `Enter` submete formulários quando focado em botão de submit
- **Skip Links**: Não necessário (páginas simples)

#### ARIA Implementation

- **Landmarks**:

  - `<header role="banner">` - Header principal (via os-page-header)
  - `<nav role="navigation">` - Breadcrumbs (via os-page-header)
  - `<main role="main">` - Conteúdo principal (via os-page)
  - `<form>` - Formulários (sem role adicional necessário)

- **Live Regions**:

  - `aria-live="polite"` para notificações de sucesso
  - `aria-live="assertive"` para erros críticos
  - Implementado via NotificationService

- **Labels e Descriptions**:
  - Todos inputs com labels associados via `os-form-field`
  - Ícones decorativos com `aria-hidden="true"`
  - Botões com `aria-label` descritivos quando necessário
  - Breadcrumbs com `aria-current="page"` no item atual

#### Visual Accessibility

- **Contraste**:

  - Texto normal: >= 4.5:1 (via design tokens)
  - Texto grande: >= 3:1
  - UI Components: >= 3:1

- **Typography**:

  - Font-size mínimo: 16px (1rem) para body text
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200%

- **Motion**:
  - Respeita `prefers-reduced-motion`
  - Transições <= 300ms
  - Sem animações desnecessárias

#### Screen Reader Support

- **Content Structure**: Headings hierárquicos (h1 → h2 → h3)
- **Alt Text**: Imagens com descrições significativas (quando aplicável)
- **Form Labels**: Associação explícita via `os-form-field`
- **Error Messages**: Anunciados dinamicamente via `aria-live`
- **Button Labels**: Texto descritivo ou `aria-label` quando necessário

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Spinner centralizado em `os-entity-list` durante carregamento
  - Loading state em botões durante submissão
  - Formulário desabilitado durante loading

- **Empty**:

  - Ícone ilustrativo
  - Mensagem clara
  - Call-to-action quando aplicável (botão "Criar primeiro [entidade]")

- **Error**:

  - `os-alert` com type="error"
  - Mensagem descritiva
  - Botão de retry quando aplicável

- **Success**:
  - Feedback via NotificationService (toast)
  - Navegação automática de volta à listagem após criação/edição

### Micro-interactions

- **Hover**: Elevação sutil de cards, mudança de cor em botões
- **Focus**: Ring outline (2px solid), scale up sutil
- **Active**: Scale down, pressed state
- **Transitions**: 200ms ease-in-out para estados

### Component-Specific Interactions

**os-page-header:**

- Breadcrumbs clicáveis navegam para rota correspondente
- Botões de ação disparam eventos que navegam para páginas de criação

**os-form-template:**

- Validação em tempo real (on blur/touch)
- Mensagens de erro aparecem abaixo dos campos
- Botão de submit desabilitado quando formulário inválido

**os-filter-bar:**

- Botão "Limpar" reseta todos os filtros
- Botão "Aplicar" aplica filtros (quando necessário)

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ Header                  │
│ ┌───────────────────┐   │
│ │ [Entidade]        │   │
│ │ [Novo]            │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ Filtros (se existir)    │
│ ┌───────────────────┐   │
│ │ [Buscar] [Tipo]   │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ Conteúdo                │
│ ┌───────────────────┐   │
│ │ Card 1            │   │
│ └───────────────────┘   │
│ ┌───────────────────┐   │
│ │ Card 2            │   │
│ └───────────────────┘   │
└─────────────────────────┘
```

**Página de Criação/Edição Mobile:**

```
┌─────────────────────────┐
│ Header                  │
│ ┌───────────────────┐   │
│ │ [Entidade] > Novo │   │
│ │ Criar [Entidade]  │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ Formulário              │
│ ┌───────────────────┐   │
│ │ Campo 1           │   │
│ │ Campo 2           │   │
│ │ Campo 3           │   │
│ │                   │   │
│ │ [Cancelar] [Criar]│   │
│ └───────────────────┘   │
└─────────────────────────┘
```

**Anotações:**

- Stack vertical completo
- Touch targets >= 44px
- Sem scroll horizontal
- Botões de ação em stack vertical ou lado a lado se espaço permitir

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ Header                            │
│ ┌─────────────────────────────┐   │
│ │ [Entidade]    [Novo]        │   │
│ └─────────────────────────────┘   │
├───────────────────────────────────┤
│ Filtros                           │
│ ┌─────────────────────────────┐   │
│ │ [Buscar] [Tipo] [Aplicar]   │   │
│ └─────────────────────────────┘   │
├───────────────────────────────────┤
│ Conteúdo                          │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Card 1      │ │ Card 2      │   │
│ └─────────────┘ └─────────────┘   │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Card 3      │ │ Card 4      │   │
│ └─────────────┘ └─────────────┘   │
└───────────────────────────────────┘
```

**Anotações:**

- Grid 2 colunas para cards
- Filtros em layout horizontal
- Mais espaçamento entre elementos

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ Header                                      │
│ ┌───────────────────────────────────────┐   │
│ │ [Entidade]              [Novo]         │   │
│ └───────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│ Filtros                                     │
│ ┌───────────────────────────────────────┐   │
│ │ [Buscar] [Tipo] [Aplicar] [Limpar]    │   │
│ └───────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│ Conteúdo                                    │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Card 1│ │Card 2│ │Card 3│ │Card 4│       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Card 5│ │Card 6│ │Card 7│ │Card 8│       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
└─────────────────────────────────────────────┘
```

**Página de Criação/Edição Desktop:**

```
┌─────────────────────────────────────────────┐
│ Header                                      │
│ ┌───────────────────────────────────────┐   │
│ │ [Entidade] > Novo                     │   │
│ │ Criar [Entidade]                      │   │
│ └───────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│ Formulário (max-width: 800px, centralizado) │
│ ┌───────────────────────────────────────┐   │
│ │ Campo 1          Campo 2              │   │
│ │ Campo 3                               │   │
│ │ Campo 4                               │   │
│ │                                       │   │
│ │              [Cancelar] [Criar]       │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Anotações:**

- Grid 12 colunas flexível
- Formulários centralizados com max-width
- Campos podem estar lado a lado quando apropriado
- Hover states ativos

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Nenhum novo componente necessário** - Todos os componentes existentes são suficientes.

**Modificações:**

- Páginas de listagem: Remover lógica de modal, manter estrutura existente
- Páginas de criação/edição: Criar novas páginas seguindo padrão de `budget-create.page.ts`

### Dependências de UI

- Nenhuma nova dependência necessária
- Componentes existentes do Design System são suficientes

### Impacto em Performance

- **Bundle Size**: Mínimo - apenas reutilização de componentes existentes
- **Lazy Loading**: Páginas de criação/edição já serão lazy loaded via rotas
- **Critical CSS**: Estilos já existentes, sem impacto adicional

### Integration Points

- **Estados**: Integração com estados existentes (AccountState, CreditCardState, etc.)
- **Router**: Navegação entre páginas via Angular Router
- **NotificationService**: Feedback ao usuário após ações
- **AuthService**: Validação de usuário quando necessário

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance

- [ ] Componentes os-\* utilizados corretamente
- [ ] Design tokens aplicados (--os-\*)
- [ ] Nomenclatura consistente
- [ ] Tema aplicado corretamente

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile < 576px, tablet 576-991px, desktop >= 992px)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Formulários responsivos e legíveis em todas as resoluções

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Esc)
- [ ] ARIA attributes corretos (landmarks, labels, live regions)
- [ ] Screen reader friendly (headings hierárquicos, labels associados)
- [ ] Contraste adequado (>= 4.5:1 texto normal, >= 3:1 texto grande)
- [ ] Focus visible em elementos interativos

### Performance

- [ ] OnPush change detection em todos componentes
- [ ] Lazy loading de páginas de criação/edição
- [ ] Bundle size otimizado (sem componentes desnecessários)
- [ ] Computed signals para derivações

### Visual Quality

- [ ] Spacing consistente (8px, 12px, 16px, 24px, 32px scale)
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara (H1 > H2 > conteúdo)
- [ ] Estados (loading, error, empty) implementados
- [ ] Transições suaves (200ms ease-in-out)

### Consistência com Padrão

- [ ] Páginas de listagem seguem padrão de `budget-list.page.ts`
- [ ] Páginas de criação seguem padrão de `budget-create.page.ts`
- [ ] Páginas de edição seguem padrão de criação
- [ ] Navegação consistente entre todas as páginas

## 📚 References

### Design System Documentation

- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines

- [Material Design - Responsive Layout](https://material.io/design/layout/responsive-layout-grid.html)
- [Material Design - Accessibility](https://material.io/design/usability/accessibility.html)
- [Angular CDK BreakpointObserver](https://material.angular.io/cdk/layout/overview)

### WCAG Guidelines

- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [Keyboard Navigation](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [Focus Management](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)

### Código Similar no Projeto

- Padrão de Listagem: `src/app/features/budget/pages/budget-list/budget-list.page.ts`
- Padrão de Criação: `src/app/features/budget/pages/budget-create/budget-create.page.ts`
- Componentes UI: `src/app/shared/ui-components/`

### Meta Specs - Contexto de Produto

- **Design System**: Componentes existentes em `src/app/shared/ui-components/`
- **Padrões de Layout**: Estabelecidos em páginas de Orçamentos
- **Responsividade**: Breakpoints definidos via Angular CDK BreakpointObserver
