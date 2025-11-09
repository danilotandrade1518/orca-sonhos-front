# Padronização de layout e UI com DS - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Transmitir consistência visual em todas as páginas do app através do Design System `os-*`, com hierarquia clara (header → conteúdo), espaçamentos/tokens uniformes, ações padronizadas e estados de interface previsíveis (loading, empty, error). O resultado deve ser uma experiência fluida, acessível (WCAG 2.1 AA) e responsiva.

### Tipo de Layout

Universal (aplicado a Dashboard | List | Detail | Config), com containers base (`os-page`, `os-page-header`) e variações por template quando necessário (`os-dashboard-template`, `os-form-template`).

### Público-Alvo

Universal (mobile-first).

### Persona Primária

Ana (Organizadora Familiar) — precisa de simplicidade, clareza de progresso e colaboração eventual.

**Características da Persona:**

- Busca organização e visualização de progresso (metas, orçamentos)
- Usa principalmente mobile, com passagens por desktop
- Precisa de ações claras e labels descritivas
- Valoriza feedback (toasts/alertas) e previsibilidade
- Acessibilidade básica (foco visível, leitura clara)

### Contexto de Uso

Todas as páginas do menu: Dashboard, Orçamentos, Contas, Cartões, Metas, Transações, Relatórios, Configurações.

### Funcionalidades Core Relacionadas

- Metas SMART, Múltiplos Orçamentos, Dashboard motivacional, Transações temporais, Sistema Dual (orçamentos/contas), Gestão de cartões, Onboarding orientado.

### Considerações da Jornada do Usuário

**Estágio da Jornada:** Engajamento → Adoção  
**Objetivos:** ver progresso claro, operar ações frequentes rapidamente, manter rotina de uso  
**Touchpoints:** cabeçalhos com ações, listas/cards consistentes, filtros previsíveis, feedbacks claros

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0–575px)**:
  - Layout: stack vertical; 1 coluna
  - Touch targets: ≥ 44px
  - `os-page-header` tamanho `medium`; actions como `secondary/small` quando em listas
- **Tablet (576–991px)**:
  - Layout: 2 colunas quando aplicável (grids e listas com filtros)
  - Navegação visível; header com ações primárias
- **Desktop (≥ 992px)**:
  - Layout: grid 12 col; sidebar do app quando aplicável
  - Estados de hover e microinterações mais ricos

### Mobile-First Approach

Definir estilos base para mobile; adaptar para tablet/desktop via tokens de breakpoint. Sem overflow horizontal; imagens e mídias responsivas.

### Touch Interactions

Botões com tamanho mínimo, foco visível, feedback de clique (ripple ou estado pressed). Gestos não essenciais (sem dependência de swipe).

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**
  - Variant: primary | secondary | tertiary | danger | success | warning
  - Size: small | medium | large
  - Usage: ações em `os-page-header`, toolbars e cards/listas; ícone-only com `aria-label`

- **os-input / os-select / os-icon / os-badge / os-progress-bar / os-spinner**
  - Usage: compor filtros, indicadores e estados

#### Molecules

- **os-form-field**
  - Usage: campos em filtros e formulários

- **os-card**
  - Usage: base de cards de entidades e agrupamentos

- **os-filter-bar**
  - Usage: filtros de Orçamentos e Metas; padronizar limpar/aplicar

#### Organisms

- **os-page-header**
  - Variant: default | compact; Actions: primária/secundária
  - Usage: cabeçalho padronizado de páginas

- **os-entity-card / os-entity-list** (quando existentes)
  - Usage: cards/listas de entidades com ações consistentes

- **os-alert**
  - Usage: toasts/alertas; `aria-live` adequado

#### Templates

- **os-dashboard-template**
- **os-form-template**
- **os-app-shell-template**

### Novos Componentes (Especificação Detalhada)

Não são necessários novos componentes do DS nesta fase. Páginas/containers devem reutilizar os existentes.

## 🏗️ Layout Structure

### Grid System

- Columns: 12 (desktop), 8 (tablet), 1 (mobile)
- Gap: 16px (desktop), 12px (tablet), 8px (mobile)
- Max Width: 1200px (quando aplicável)

### Sections

#### Header

- Components: `os-page-header`
- Height: 64px desktop, 56px mobile
- Sticky: Yes (quando pertinente ao fluxo)
- Z-index: 100

#### Sidebar (app)

- Width: conforme shell; ocultar < 768px
- Components: navegação principal

#### Main Content

- Layout: stack (mobile) → grid (tablet/desktop)
- Padding: 24px desktop, 16px mobile
- Components: filtros (`os-filter-bar`), listas/cards (`os-entity-*`), templates específicos quando necessário

#### Footer (se aplicável)

- Components: seção final opcional

### Spacing Strategy

- Section Gaps: 32px (desktop), 24px (tablet), 16px (mobile)
- Component Gaps: 16px (desktop), 12px (tablet), 8px (mobile)
- Tokens: usar escala `--os-spacing-*` existente

### Visual Hierarchy

1. H1 (título da página no `os-page-header`)
2. Ações principais e filtros
3. Cards/listas e conteúdo secundário

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- Tab order lógico: header → filtros → conteúdo → footer
- Focus visível em todos elementos interativos
- Skip links já suportados pelo `os-app-shell-template`

#### ARIA Implementation

- Landmarks: header (banner), nav (navigation), main (role=main), aside (complementary), footer (contentinfo)
- Live regions: `aria-live="polite"` (notificações), `assertive` para erros críticos
- Labels: inputs com label; ícones decorativos com `aria-hidden="true"`; botões ícone-only com `aria-label`

#### Visual Accessibility

- Contraste: texto normal ≥ 4.5:1; componentes ≥ 3:1
- Tipografia: mínimo 16px; line-height ≥ 1.5
- Motion: respeitar `prefers-reduced-motion`; transições ≤ 300ms

#### Screen Reader Support

- Headings hierárquicos; alt text adequado; erros anunciados dinamicamente

## 🎭 States and Interactions

- Loading: `os-skeleton` e spinner; botões com estado `loading`
- Empty: `os-empty-state` com ilustração opcional e CTA
- Error: `os-alert` role=alert; retry quando aplicável
- Success: toasts/alertas com `aria-live="polite"`
- Microinteractions: hover/focus/active consistentes; transições ~200ms ease-in-out

## 📐 Visual Specifications

Wireframes nível: sketches

### Mobile Layout (< 576px)

```
┌──────────────────────────────┐
│ os-page-header               │
├──────────────────────────────┤
│ os-filter-bar (quando houver)│
├──────────────────────────────┤
│ Conteúdo (stack)             │
│ ┌───────────────┐            │
│ │ Card/List 1   │            │
│ └───────────────┘            │
│ ┌───────────────┐            │
│ │ Card/List 2   │            │
│ └───────────────┘            │
└──────────────────────────────┘
```

### Tablet Layout (576–991px)

```
┌──────────────────────────────────┐
│ os-page-header                   │
├──────────────────────────────────┤
│ os-filter-bar                    │
├──────────────────────────────────┤
│ Grid 2 colunas (quando aplicável)│
│ ┌──────────┐ ┌──────────┐        │
│ │ Card 1   │ │ Card 2   │        │
│ └──────────┘ └──────────┘        │
└──────────────────────────────────┘
```

### Desktop Layout (≥ 992px)

```
┌──────────────────────────────────────────┐
│ os-page-header                           │
├─────┬────────────────────────────────────┤
│Nav  │ Main (grid 12 col / listas/cards)  │
└─────┴────────────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:** nenhum no DS; apenas containers/páginas adotando os padrões.  
**Modificações:** migrar `mat-*` de botões para `os-button`; aplicar `os-page/os-page-header`; substituir estilos inline por tokens/grids.

### Dependências de UI

Sem novas dependências obrigatórias.

### Impacto em Performance

- OnPush e signals preservados
- Reutilização de componentes DS (tree-shaking)
- CSS crítico: cabeçalhos e grids leves

### Integration Points

Integração com serviços/pipes de formatação `pt-BR` centralizados.

## 🧪 Layout Validation Criteria

### Design System Compliance
- [ ] `os-*` utilizados corretamente
- [ ] Tokens aplicados
- [ ] Nomenclatura consistente
- [ ] Tema aplicado

### Responsiveness
- [ ] Mobile-first
- [ ] Breakpoints funcionais
- [ ] Touch targets ≥ 44px
- [ ] Sem scroll horizontal
- [ ] Mídias responsivas

### Accessibility
- [ ] WCAG 2.1 AA
- [ ] Keyboard navigation
- [ ] ARIA correta
- [ ] Screen reader friendly
- [ ] Contraste adequado
- [ ] Focus visible

### Performance
- [ ] OnPush
- [ ] Lazy loading onde aplicável
- [ ] Bundle otimizado
- [ ] Signals/computed para derivações

### Visual Quality
- [ ] Spacing consistente
- [ ] Alinhamento e hierarquia
- [ ] Estados loading/error/empty

## 📚 References

- DS: `src/app/shared/ui-components/` (atoms, molecules, organisms, templates)
- Angular best practices (standalone, signals, OnPush, control flow nativo)
- Personas e Jornada: Meta Specs


