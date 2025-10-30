# Transações (OS-227) - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Clareza e controle sobre transações por orçamento, com foco em registro rápido, filtros eficientes e leitura fácil do status temporal (Agendada, Atrasada, Hoje). O layout deve motivar o uso contínuo e reduzir a fricção para adicionar/editar itens.

### Tipo de Layout

List + Form (cards com filtros; formulário reativo em modal)

### Público-Alvo

Mobile-first (funciona muito bem em mobile; expande para tablet/desktop)

### Persona Primária

Ana (iniciando organização financeira; prefere simplicidade e orientação)

**Características da Persona:**

- Busca registrar despesas/receitas rapidamente e ver impacto no orçamento
- Necessita linguagem simples e feedback claro de estados (agendada/atrasada)
- Uso majoritário em mobile; sessões curtas, foco em registro e consulta
- Sofisticação média/baixa; aprecia padrões familiares e sugestões do sistema
- Dores: formulários longos, filtros confusos, excesso de passos
- Objetivos: registrar sem erro, encontrar transações, entender status e totalizações

### Contexto de Uso

Página dedicada em `/transactions` com seleção de orçamento corrente; navegável via Dashboard (atalho) e Budget Detail (link contextual). Fluxos principais: listar e filtrar; criar/editar; ações rápidas (marcar atrasada, cancelar agendada, excluir).

### Funcionalidades Core Relacionadas

- Sistema de Metas SMART: impacto indireto via progresso do orçamento
- Múltiplos Orçamentos: seletor/contexto de orçamento corrente
- Transações Temporais: status por data (Agendada, Atrasada, Hoje)
- Sistema Dual (Orçamentos/Contas): seleção de conta impacta listagem e criação
- Compartilhamento Familiar: preparado para múltiplos participantes (sem UI complexa nesta fase)

### Considerações da Jornada do Usuário

**Estágio da Jornada:** Engajamento → Adoção

**Objetivos do Usuário neste Estágio:**

- Registrar e revisar transações sem fricção
- Entender rapidamente status e totais
- Confiar que filtros e paginação não perdem informações

**Touchpoints Críticos:**

- Ação “+ Nova Transação” sempre visível
- Estados vazios/inconsistências com CTAs claros
- Confirmações acessíveis e não intrusivas para ações destrutivas

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:
  - Layout: coluna única; cards full-width; filtros colapsáveis
  - Touch targets: >= 44px
  - Comportamento: ações rápidas via menu de contexto nos cards
- **Tablet (576-991px)**:
  - Layout: grid 2 colunas para cards; filtros visíveis em linha
  - Navegação: cabeçalho com título, seletor de orçamento e ação “Nova Transação”
  - Comportamento: áreas de leitura e ação mais espaçadas
- **Desktop (992px+)**:
  - Layout: 3 colunas de cards; sidebar do app; filtros persistentes
  - Hover states: realce de card e botões; tooltips informativos
  - Comportamento: atalho de teclado para busca (/) e fechar modal (Esc)

### Mobile-First Approach

Construção progressiva: base mobile, adicionando grid e persistência de filtros em telas maiores. Componentes reusáveis do DS com variações compactas.

### Touch Interactions

- Swipe vertical para rolar cards
- Toque em áreas amplas para expandir detalhes
- Botões de ação com mínimo de 44x44px

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:
  - Variant: primary, secondary, tertiary, danger (para exclusão)
  - Size: small | medium | large
  - Usage: ações em header, filtros, vazios, cards e modais
- **os-icon**:
  - Usage: ícones de status (schedule, error, today), filtro, adicionar
- **os-badge**:
  - Usage: status da transação (Agendada/Atrasada/Hoje)
- **os-label**:
  - Usage: rótulos em formulário e filtros
- **os-spinner**:
  - Usage: loading global e incremental

#### Molecules

- **os-form-field**:
  - Configuration: label, hint, error; integra inputs/selects
  - Usage: formulário reativo (criar/editar)
- **os-filter-bar**:
  - Configuration: limpar/aplicar; integra controles declarados na página
  - Usage: área de filtros acima da listagem

#### Organisms

- **os-page-header**:
  - Variant: default
  - Actions: “+ Nova Transação”, “Atualizar”
  - Usage: header da página com breadcrumb opcional
- **os-transaction-list**:
  - Usage: renderização principal de cards de transações com ações e status
- Opcional: **os-data-grid** (para visual alternativo tabular futuro)

#### Templates

- **os-form-template**:
  - Configuration: título, ações; hospeda form reativo
  - Usage: modal/overlay de criar/editar
- **os-modal-template**:
  - Configuration: confirm/cancel; tamanhos small/medium
  - Usage: confirmações (excluir/cancelar/atrasar)

### Novos Componentes (Especificação Detalhada)

Não são necessários novos componentes no Design System nesta fase. Componentes específicos da feature (ex.: `transactions-filters`, `transaction-form`) serão implementados dentro da pasta da feature reutilizando os átomos/moléculas/organismos existentes.

## 🏗️ Layout Structure

### Grid System

- **Columns**: 12-col desktop, 8-col tablet, 1-col mobile
- **Gap**: 16px (desktop), 12px (tablet), 8px (mobile)
- **Max Width**: 1200px

### Sections

#### Header

- **Components**: `os-page-header` (título “Transações”), ação “+ Nova Transação”, “Atualizar”
- **Height**: 64px desktop, 56px mobile
- **Sticky**: Yes
- **Z-index**: 100

#### Sidebar (app)

- **Width**: conforme layout global; oculta em < 768px
- **Components**: navegação principal existente

#### Main Content

- **Layout**: stack (mobile) → grid (tablet/desktop)
- **Padding**: 24px (desktop), 16px (mobile)
- **Components**:
  - `os-filter-bar` + controles (Budget, Conta, Categoria, Data de/até, Type, Amount)
  - `os-transaction-list` (cards)

#### Footer

- **Components**: paginação/infinite scroll; texto de última atualização
- **Height**: Auto

### Spacing Strategy

- **Section Gaps**: 32px (desk), 24px (tab), 16px (mob)
- **Component Gaps**: 16px (desk), 12px (tab), 8px (mob)
- **Padding scale**: 24/16/12/8

### Visual Hierarchy

1. H1 “Transações” + ação primária
2. Filtros e estado de lista
3. Cards de transações e totais contextuais

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- Tab order: header → filtros → lista → footer
- Focus visível em todos os interativos (ring 2px)
- Shortcuts: Esc fecha modal; “/” foca busca (desktop)
- Skip link para conteúdo principal

#### ARIA Implementation

- Landmarks: `header[role=banner]`, `nav[role=navigation]`, `main[role=main]`, `footer[role=contentinfo]`
- Live Regions: `aria-live="polite"` para carregamentos; `assertive` para erros críticos
- Labels: inputs com `for`/`aria-labelledby`; ícones decorativos com `aria-hidden="true"`

#### Visual Accessibility

- Contraste: texto >= 4.5:1; UI >= 3:1
- Tipografia: min 16px; line-height 1.5; zoom 200%
- Motion: respeitar `prefers-reduced-motion`; transições <= 300ms

#### Screen Reader Support

- Headings hierárquicos (h1→h2→h3)
- Alt text significativo quando houver imagens (não esperado aqui)
- Erros de formulário anunciados dinamicamente

## 🎭 States and Interactions

### Global States

- Loading: `os-spinner` central; skeleton opcional
- Empty: ícone + mensagem + CTA “Nova Transação”
- Error: mensagem clara + botão “Tentar novamente”
- Success: toast/modal de confirmação

### Micro-interactions

- Hover: elevação/realce de cards (desktop)
- Focus: outline visível; sem mudança de layout
- Active: leve compressão em botões
- Transitions: 200ms ease-in-out

### Component-Specific Interactions

- Card: clicar abre detalhe/ação; menu contextual para ações rápidas
- Filtros: “Limpar” e “Aplicar” sempre visíveis; manter estado por sessão
- Paginação/Infinite: botão “Carregar mais” com `aria-live` apropriado

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌───────────────────────────────┐
│ Header (sticky)               │
│  Transações   [+ Nova]        │
├───────────────────────────────┤
│ Filtros (toggle)              │
│  [Filtro básico + Aplicar]    │
├───────────────────────────────┤
│ Lista (cards full-width)      │
│  ┌──────── Card ────────┐     │
│  │ Título / Valor       │     │
│  │ Status / Data        │     │
│  │ Ações (…)            │     │
│  └──────────────────────┘     │
│  …                            │
├───────────────────────────────┤
│ Footer (Carregar mais)        │
└───────────────────────────────┘
```

### Tablet Layout (576-991px)

```
┌───────────────────────────────────────┐
│ Header (sticky)  Transações  [+ Nova] │
├───────────────────────────────────────┤
│ Filtros inline                        │
├───────────────────────────────────────┤
│ Grid 2 colunas (cards)               │
│  [Card][Card]                        │
│  [Card][Card]                        │
├───────────────────────────────────────┤
│ Footer (pagina/polidez aria-live)     │
└───────────────────────────────────────┘
```

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────────────┐
│ Header (sticky)  Transações  [Atualizar] [+ Nova]   │
├───────────┬─────────────────────────────────────────┤
│ Sidebar   │ Filtros persistentes                    │
│           ├─────────────────────────────────────────┤
│           │ Grid 3 colunas (cards)                  │
│           │ [C][C][C]                               │
│           │ [C][C][C]                               │
│           ├─────────────────────────────────────────┤
│           │ Footer (última atualização, paginação)  │
└───────────┴─────────────────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar (na feature)

**Novos (feature):**

- `pages/transactions/transactions.page.ts` (estrutura da página)
- `components/transactions-filters/transactions-filters.component.ts` (controles específicos)
- `components/transaction-form/transaction-form.component.ts` (form reativo)
- `components/transactions-cards/transactions-cards.component.ts` (se não utilizar diretamente `os-transaction-list`)

**Reutilizados:**

- `os-page-header`, `os-filter-bar`, `os-transaction-list`, `os-form-template`, `os-modal-template`, `os-button`, `os-icon`, `os-badge`, `os-label`, `os-spinner`

### Dependências de UI

Sem novas bibliotecas. Reuso do Design System existente e Angular Material conforme necessário (inputs/select/date se aplicável).

### Impacto em Performance

- **Bundle Size**: baixo impacto (reuso de DS)
- **Lazy Loading**: rota `/transactions` lazy
- **Critical CSS**: header e estados vazios; evitar CSS pesado em cards

### Integration Points

- Integração com `BudgetSelectionService` (orçamento corrente)
- Serviços da feature para listagem e mutações
- MSW/Backend alinhados (paginação, filtros server-side)

## 🧪 Layout Validation Criteria

### Design System Compliance

- [ ] Componentes os-\* utilizados conforme API
- [ ] Design tokens aplicados (--os-\*)
- [ ] Nomenclatura consistente
- [ ] Tema aplicado corretamente

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile/tablet/desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal
- [ ] Media responsiva

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa
- [ ] ARIA attributes corretos
- [ ] Screen reader friendly
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos

### Performance

- [ ] OnPush nos componentes
- [ ] Lazy loading da rota
- [ ] Bundle otimizado (reuso DS)
- [ ] Signals/computed para derivações

### Visual Quality

- [ ] Spacing consistente
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara
- [ ] Estados (loading, error, empty) implementados

## 📚 References

### Design System Documentation

- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines

- List, Cards, Responsive layout, Density & Touch target (referência geral)

### WCAG Guidelines

- Perceivable 1.4.x (contraste), Operable 2.1.x (teclado), Understandable 3.x

### Código Similar no Projeto

- `features/budget/pages/budget-list/budget-list.page.ts` (padrões de estado e acessibilidade)
- `shared/ui-components/templates/os-list-template` (padrões de lista)
- `shared/ui-components/organisms/os-transaction-list` (organismo de transações)

### Meta Specs - Contexto de Produto

- Personas, Jornada, Conceitos e Funcionalidades Core (referência: repositório Meta Specs)
