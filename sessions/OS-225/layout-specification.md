# Layout Global (App Shell) – Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Unificar header, navegação lateral e área principal em um App Shell consistente (Material Design M3), com seletor de orçamento e ações contextuais, garantindo foco em metas e progresso financeiro.

### Tipo de Layout

Custom (App Shell: Top App Bar + Navigation Drawer + Main Area)

### Público-Alvo

Mobile-first, adaptando para tablet e desktop

### Persona Primária

Ana — Organizadora Familiar

**Características da Persona:**

- Organiza finanças da família; quer envolver o parceiro
- Valoriza clareza visual e indicadores de progresso
- Usa majoritariamente mobile, mas alterna com desktop
- Sofisticação média; prefere fluxos simples e guiados
- Dores: visão de progresso, colaboração, alternância de contextos (orçamentos)

### Contexto de Uso

- Shell global aplicado às rotas da aplicação; remove header/sidebar locais do `Dashboard`
- Ações contextuais no app bar (ex.: criar transação/meta)
- Seletor de orçamento sempre acessível

### Funcionalidades Core Relacionadas

- Sistema de Metas SMART (progresso em destaque)
- Múltiplos Orçamentos (seletor persistente)
- Compartilhamento Familiar (indicadores de colaboração)
- Dashboard Centrado em Progresso
- Sistema Dual: Orçamentos + Contas

### Considerações da Jornada do Usuário

**Estágio da Jornada:** Engajamento Inicial → Adoção

**Objetivos do Usuário neste Estágio:**

- Entender progresso e próximas ações rapidamente
- Alternar entre orçamentos sem fricção
- Criar primeira/novas metas com facilidade

**Touchpoints Críticos:**

- Primeira navegação pós-login deve ser clara
- Mudança de orçamento deve refletir no conteúdo e métricas instantaneamente
- Feedback visível de ações (toasts, estado loading)

## 📱 Responsive Strategy

### Breakpoints Definidos

- Mobile (< 768px):
  - Layout: stack vertical; drawer modal/full overlay
  - Touch targets: ≥ 44px
  - App bar compacto; ações em overflow/kebab
- Tablet (768-991px):
  - Layout: drawer persistente/rail; 2 colunas quando aplicável
  - Navegação sempre visível; seletor de orçamento no header
- Desktop (≥ 992px):
  - Layout: drawer permanente colapsável; grid 12 colunas
  - Hover states presentes; maior densidade informacional

### Mobile-First Approach

- Estilos base para mobile; ampliações progressivas para tablet/desktop
- Uso de tokens responsivos e utilitários do DS (`theme.scss`)

### Touch Interactions

- Swipe para abrir/fechar drawer em mobile (opcional futuro)
- Teclas de atalho: `/` busca, `Esc` fecha overlays, `Alt+B` foca seletor de orçamento

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

- Atoms:
  - `os-icon`, `os-button`, `os-chip`, `os-label`, `os-spinner`, `os-toggle` (toggle tema)
- Molecules:
  - `os-navigation-item`, `os-filter-bar` (em listas), `os-data-table` (contextual)
- Organisms:
  - `os-header` (top app bar com navegação/ações/usuário)
  - `os-sidebar` (drawer/rail com colapso e breakpoints)
  - `os-navigation` (abas/menus internos)
  - `os-page-header` (títulos por página)
- Templates:
  - `os-dashboard-template` (referência de composição header+sidebar+grid)
  - `os-list-template`, `os-detail-template` (padrões de conteúdo)

### Novos Componentes (Especificação Detalhada)

- App Shell Template (Template)

  **Propósito:** Compor `os-header` + `os-sidebar` + `router-outlet`, expondo slots para ações contextuais e integração com seletor de orçamento.

  **Design Specs:**

  - Padding: 16px mobile, 24px tablet/desktop na área principal
  - Border: 1px sólido `--os-color-border` em separadores
  - Grid: 12 col (desktop), 8 col (tablet), 1 col (mobile)
  - Tipografia: tokens do DS; corpo 16px, line-height 1.5+

  **States:** default, hover/active em navegação, focus visível, loading global

  **Responsiveness:** drawer modal (<768), persistente (>=768), permanente (>=992) com rail colapsável

  **Accessibility:**

  - Role/landmarks corretos (banner/nav/main/contentinfo)
  - ARIA em toggle/colapso do sidebar; `aria-expanded`, `aria-controls`
  - Skip links `#main-content`, `#budget-selector`

  **Variants:** `light` | `dark`; `compact` | `default`

## 🏗️ Layout Structure

### Grid System

- Columns: 12 (desktop), 8 (tablet), 1 (mobile)
- Gap: 16px desktop, 12px tablet, 8px mobile
- Max Width: 1200px container

### Sections

- Header
  - Components: `os-header`, seletor de orçamento (molecule existente de dashboard) ou menu de orçamento
  - Height: 56px mobile, 64px desktop
  - Sticky: Yes; z-index elevado
- Sidebar
  - Width: 280px (default), 60px (collapsed)
  - Breakpoint: modal <768px; persistente ≥768; permanente ≥992
  - Components: `os-sidebar` + `os-navigation-item`
- Main Content
  - Layout: grid/flex; padding 16/24; container centralizado
  - Components: templates por página (`os-dashboard-template`, `os-list-template`, `os-detail-template`)
- Footer (opcional)
  - Components: `os-footer` (se necessário)

### Spacing Strategy

- Section Gaps: 24/32/16 conforme viewport
- Component Gaps: 12/16/8
- Tokens `--os-spacing-*` para consistência

### Visual Hierarchy

1. Top App Bar (logo/branding, seletor, ações principais)
2. Navegação lateral (seções) e título da página (`os-page-header`)
3. Conteúdo (cards, listas, widgets)

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

- Keyboard Navigation
  - Tab order lógico; foco visível (`--os-focus-ring-*`)
  - Shortcuts: `Esc`, `/`, `Alt+B`
  - Skip links implementados
- ARIA Implementation
  - Landmarks: `header[role=banner]`, `nav[role=navigation]`, `main[role=main]`, `aside[role=complementary]`, `footer[role=contentinfo]`
  - Live regions para toasts/erros
  - Labels/Descriptions em inputs e botões icônicos
- Visual Accessibility
  - Contraste ≥ 4.5:1 (texto), ≥ 3:1 (UI)
  - Fonte mínima 16px; line-height ≥ 1.5; zoom 200%
  - `prefers-reduced-motion` respeitado
- Screen Reader Support
  - Headings hierárquicos; alt text significativo; erros anunciados

## 🎭 States and Interactions

- Global States
  - Loading: spinner central e skeletons; botões com `loading`
  - Empty: mensagens claras e CTA
  - Error: mensagem descritiva e retry
  - Success: toasts não intrusivos
- Micro-interactions
  - Hover: elevação leve; focus ring consistente
  - Active: scale 0.98; transições ≤ 300ms

## 📐 Visual Specifications (Wireframes)

### Mobile (< 768px)

```
┌──────────────────────────────┐
│ Header (sticky)              │
│ [Logo]  [Selector]   [⋮]     │
├──────────────────────────────┤
│ Drawer (modal, overlay)      │
│  ┌──────────────┐            │
│  │ Nav itens    │            │
│  └──────────────┘            │
├──────────────────────────────┤
│ Main (stack)                 │
│ [Page Header]                │
│ [Content / Widgets]          │
└──────────────────────────────┘
```

### Tablet (768-991px)

```
┌────────────────────────────────────┐
│ Header (sticky)  [Selector] [Ações]│
├───────────────┬────────────────────┤
│ Sidebar       │ Main               │
│ (persistente) │ [Page Header]      │
│               │ [Conteúdo 2 col]   │
└───────────────┴────────────────────┘
```

### Desktop (≥ 992px)

```
┌────────────────────────────────────────────────────┐
│ Header (sticky)  [Selector] [Ações]  [Usuário]     │
├───────┬────────────────────────────────────────────┤
│ Rail  │ Main (grid 12 col)                         │
│/Side  │ [Widgets/Lists/Cards]                      │
│bar    │                                            │
└───────┴────────────────────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

- Novo: `AppShellTemplate` (template que orquestra header + sidebar + router-outlet)
- Modificar: remover header/sidebar locais do `Dashboard` e migrar para shell
- Integrar: `os-toggle` no header para tema light/dark

### Dependências de UI

- Reuso de Angular Material já presente via DS (Slide Toggle)
- Sem novas libs

### Impacto em Performance

- Bundle Size: mínimo (reuso de organisms)
- Lazy Loading: manter rotas de features em lazy
- Critical CSS: header/sidebar mínimos; evitar FOUC de tema

### Integration Points

- Seletor de orçamento no header aciona `BudgetSelectionService`
- Navegação do sidebar usa rotas lazy; estado de colapso persistido (localStorage)

## 🧪 Layout Validation Criteria

### Design System Compliance

- [ ] `os-*` utilizados corretamente
- [ ] Design tokens `--os-*` aplicados
- [ ] Tema e variantes padronizados

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (<768, 768-991, ≥992)
- [ ] Touch targets ≥ 44px
- [ ] Sem scroll horizontal

### Accessibility

- [ ] WCAG 2.1 AA
- [ ] Navegação por teclado completa
- [ ] ARIA correto
- [ ] Focus visible consistente

### Performance

- [ ] OnPush em todos os componentes
- [ ] Lazy loading de features
- [ ] Computed signals para estados derivados

### Visual Quality

- [ ] Spacing consistente
- [ ] Hierarquia clara
- [ ] Estados (loading, error, empty) implementados

## 📚 References

- Design System: `src/app/shared/ui-components/`
- Material Design M3: Top App Bar, Navigation Drawer
- WCAG 2.1 AA: Navegação por teclado, contraste, motion
- Código Similar: `os-dashboard-template`, `os-sidebar`, `os-header`
- Meta Specs: Personas, Jornada, Conceitos, Core Features
