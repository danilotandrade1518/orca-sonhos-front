# Metas (Goals) - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Comunicar progresso, motivação e clareza dos próximos passos. O usuário deve entender rapidamente quanto falta para atingir cada meta, qual aporte mensal é sugerido e quais ações estão disponíveis (adicionar/retirar aporte, editar, excluir).

### Tipo de Layout

List + Form + Detail (com cartões de resumo)

### Público-Alvo

Mobile-first (universal com ótima experiência em desktop)

### Persona Primária

Ana (Organizadora Familiar) e Carlos (Jovem Planejador), conforme personas.

- Necessitam clareza visual de progresso e ações simples
- Preferem linguagem simples e feedback imediato
- Uso frequente em mobile, com complementos em desktop
- Sofisticação média/baixa na criação inicial (onboarding leve)

### Contexto de Uso

- Rota base `'/goals'` com subrotas `'/goals/new'` e `'/goals/:id'`
- Integrado ao orçamento selecionado (validações com `BudgetSelectionService`)
- Acionável a partir do Dashboard e da navegação principal

### Funcionalidades Core Relacionadas

- Sistema de Metas SMART (progresso visual, aporte sugerido)
- Múltiplos Orçamentos (contexto da meta)
- Dashboard centrado em progresso (entrada e overview)
- Sistema Dual (referência de `sourceAccountId`)

### Considerações da Jornada do Usuário

- Estágios: Primeiro Uso → Engajamento → Adoção
- Objetivos: criar primeira meta rapidamente; visualizar progresso; manter motivação
- Touchpoints críticos: criação da primeira meta; primeiro aporte; primeira meta concluída

## 📱 Responsive Strategy

### Breakpoints Definidos

- Mobile (0–575px)
  - Layout: coluna única, componentes empilhados
  - Touch targets: ≥ 44px
  - Cards de meta em largura total; ações em toolbar inferior do card
- Tablet (576–991px)
  - Layout: grade 2 colunas para cards; formulário em 1–2 colunas conforme campos
  - Navegação sempre visível
- Desktop (≥ 992px)
  - Layout: grade 12 colunas; lista com 3–4 colunas de cards, detalhe em 2 colunas
  - Sidebar opcional no detalhe

### Mobile-First Approach

- Construção base para mobile; expandir para tablet/desktop com grid responsivo
- Progressive enhancement em interações de hover/teclado

### Touch Interactions

- Swipe não obrigatório
- Botões grandes e claros para ações principais

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

- Atoms
  - `os-button`: primary/secondary/tertiary/danger; tamanhos small/medium/large
  - `os-label`, `os-badge`, `os-icon`, `os-input`
- Molecules
  - `os-form-field`
- Organisms
  - `os-transaction-list` (referência de padrões de lista)
  - `os-category-manager` (referência de layout de painel)
  - `os-goal-progress` e `os-goal-tracker` (quando disponíveis no DS)
- Templates
  - `os-form-template`: para criação/edição de metas (com progress opcional)
  - `os-detail-template`: para visão detalhada da meta
  - `os-dashboard-template`: integração com widgets de progresso

Tokens e tema
- Usar `--os-color-success`, `--os-color-warning`, `--os-color-error` para thresholds
- Respeitar escala tipográfica e spacing do tema (`theme/_tokens.scss`)

### Novos Componentes (se necessário)

- Não obrigatórios para a V1. Se faltar barra de progresso específica de Goal, usar `os-progress-bar` do template ou `os-goal-progress` se disponível. Caso ausente, definir `GoalProgress` como organism reutilizável posteriormente.

## 🏗️ Layout Structure

### Grid System

- 12 col desktop, 8 col tablet, 1 col mobile
- Gaps: 16px desktop, 12px tablet, 8px mobile
- Container max-width: 1200px

### Sections

- Lista (`/goals`)
  - Header simples com título e ação “Nova Meta”
  - Grid de `GoalCard` com progresso, valores e ações
  - Estados: loading (skeleton), empty (CTA para criar), error (retry)
- Formulário (`/goals/new`)
  - `os-form-template` com título, campos (nome, valor alvo, data-alvo, orçamento, conta)
  - Aporte sugerido exibido como dica/field help
- Detalhe (`/goals/:id`)
  - `os-detail-template` com seções: Resumo, Aportes, Informações
  - Sidebar opcional com quick actions em desktop

### Spacing Strategy

- Section gaps: 32/24/16 (desktop/tablet/mobile)
- Component gaps: 16/12/8

### Visual Hierarchy

1. Título/Progresso da meta
2. Valores principais (acumulado, restante, aporte sugerido)
3. Ações (adicionar/retirar aporte, editar, excluir)

## ♿ Accessibility Specifications

### Keyboard Navigation

- Ordem lógica: header → filtros (quando houver) → lista → modais
- Focus ring visível em todos interativos
- Skip link para conteúdo principal

### ARIA Implementation

- Landmarks: header/nav/main/aside/footer
- Live regions: `aria-live="polite"` para feedback e `assertive` para erros
- Labels: inputs com `label` associado; botões com `aria-label` descritivos

### Visual Accessibility

- Contraste mínimo 4.5:1 (texto normal); 3:1 (texto grande)
- Tipografia mínima 16px; line-height 1.5; respeitar zoom 200%
- Respeitar `prefers-reduced-motion`; transições ≤ 300ms

### Screen Reader Support

- Hierarquia de headings (h1→h2→h3)
- Mensagens de erro anunciadas dinamicamente

## 🎭 States and Interactions

- Loading: skeletons e spinner
- Empty: ícone, mensagem e CTA
- Error: mensagem clara e retry
- Success: toast/alerta visual
- Micro: hover em desktop, focus ring, pressed

## 📐 Visual Specifications (Wireframes)

Wireframe level: detailed (há múltiplas telas e componentes com thresholds e responsividade)

### Mobile (<576px)

```
┌────────────────────────┐
│ Header: Metas          │
├────────────────────────┤
│ + Nova Meta            │
├────────────────────────┤
│ [Card] Nome da Meta    │
│  Progresso ███░ 45%    │
│  Restante R$ X | D+N   │
│  [Aportar] [Editar]    │
├────────────────────────┤
│ [Card] ...             │
└────────────────────────┘
```

### Tablet (576–991px)

```
┌────────────────────────────────┐
│ Header + Ações                 │
├────────────────────────────────┤
│ [Card]       │ [Card]         │
│ [Card]       │ [Card]         │
└────────────────────────────────┘
```

### Desktop (≥992px)

```
┌──────────────────────────────────────────────┐
│ Header + Ações                               │
├───────┬──────────────────────────────────────┤
│Sidebar│ Grid 3–4 col de Cards                │
└───────┴──────────────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

- Reutilizar `os-form-template` e `os-detail-template`
- Criar `GoalCard` (feature) e `GoalList` (feature) conforme arquitetura da sessão
- Manter padrões de `transactions.page` para live regions e modais

### Dependências de UI

- Sem novas libs; Angular Material e DS existentes

### Impacto em Performance

- OnPush em todas as páginas/componentes
- Lazy load das rotas de Goals
- Use computed signals para derivar progresso/sugestões

### Integration Points

- `BudgetSelectionService` (contexto do orçamento)
- `GoalsApiService` (CRUD + aportes)

## 🧪 Layout Validation Criteria

- Design System
  - os-* corretos; tokens `--os-*` aplicados
- Responsiveness
  - Mobile-first; sem scroll horizontal; touch targets ≥ 44px
- Accessibility
  - WCAG 2.1 AA; teclado completo; ARIA; contraste ≥ 4.5:1; focus visible
- Performance
  - OnPush; lazy; computed signals
- Visual Quality
  - Spacing consistente; hierarquia clara; estados implementados

## 📚 References

- DS: `src/app/shared/ui-components/` (atoms, molecules, organisms, templates)
- Layouts similares: `budget-list.page.ts`, `transactions.page.ts`
- Meta Specs: personas, journey, core concepts, funcionalidades core
- Padrões: CLAUDE.md

