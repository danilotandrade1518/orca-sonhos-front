# Credit Cards - Gestão de Cartões de Crédito e Faturas - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

O layout deve comunicar **controle e organização** sobre cartões de crédito e faturas, permitindo que o usuário visualize rapidamente:

- Cartões cadastrados com seus limites e informações principais
- Faturas associadas a cada cartão com status (aberta, paga, vencida)
- Ações rápidas para gerenciar cartões e faturas
- Integração clara com o sistema de transações

### Tipo de Layout

**List** - Página de listagem com cards expandíveis, similar ao padrão Accounts

### Público-Alvo

**Universal** - Mobile-first com adaptações para tablet e desktop

### Persona Primária

**Ana - A Organizadora Familiar** e **Roberto & Maria - O Casal Experiente**

**Características da Persona:**

- **Ana**: Gerencia as finanças da casa, quer controle compartilhado, organizada mas sobrecarregada
- **Roberto & Maria**: Têm várias metas simultâneas, precisam de controle detalhado, experiência financeira intermediária
- **Comportamento financeiro**: Usam cartões de crédito regularmente, precisam de visibilidade sobre limites e faturas
- **Necessidades de interface**: Interface intuitiva que substitua planilhas complexas, controle visual claro
- **Contexto de uso**: Principalmente mobile para consultas rápidas, desktop para gestão detalhada
- **Nível de sofisticação esperado**: Intermediário - funcionalidades avançadas mas com simplicidade de uso
- **Dores específicas**: Dificuldade para visualizar todas as faturas em um só lugar, falta de controle sobre limites de crédito

### Contexto de Uso

- **Localização**: Rota `/credit-cards` acessível via menu/sidebar
- **Integração**: Campo "Forma de Pagamento" em transações permite selecionar cartão
- **Filtragem**: Cartões e faturas filtrados automaticamente pelo orçamento selecionado
- **Ações principais**: Criar cartão, criar fatura, pagar fatura, reabrir fatura, editar, excluir

### Funcionalidades Core Relacionadas

1. **Gestão Integrada de Cartões de Crédito** (Core #5)

   - Gastos por categoria mantidos (não só "cartão de crédito")
   - Área específica do cartão mostra limite, fatura e vencimento
   - Pagamento de fatura como transação normal
   - Controle de limite em tempo real

2. **Sistema Dual: Orçamentos + Contas** (Core #6)
   - Cartões vinculados a orçamentos específicos
   - Pagamento de fatura usa conta bancária como origem
   - Separação clara entre "para que uso" (orçamento) e "onde está" (conta)

### Considerações da Jornada do Usuário

**Estágio da Jornada:**

- **Adoção** (D+7 a D+30) - Uso regular consolidado

**Objetivos do Usuário neste Estágio:**

- Controlar todos os cartões de crédito em um só lugar
- Visualizar faturas abertas e vencimentos
- Realizar pagamentos de faturas de forma integrada
- Manter controle sobre limites de crédito disponíveis
- Planejar pagamentos considerando vencimentos

**Valor Percebido Esperado:**

- Visão consolidada de todos os cartões e faturas
- Integração transparente com sistema de transações
- Controle de limite em tempo real
- Facilidade para pagar faturas sem sair do contexto

**Friction Points a Evitar:**

- Complexidade na criação de cartões e faturas
- Falta de clareza sobre status das faturas
- Dificuldade para encontrar informações importantes (limite, vencimento)
- Processo confuso para pagar faturas

**Touchpoints Críticos:**

- **Primeiro cartão criado**: Deve ser intuitivo e rápido
- **Primeira fatura visualizada**: Deve mostrar informações claras e ações disponíveis
- **Primeiro pagamento de fatura**: Deve ser integrado e criar transação automaticamente
- **Visualização de limite**: Deve ser imediata e clara

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column de cards
  - Touch targets: >= 44px para todos os botões e ações
  - Cards: Full width com padding lateral de 16px
  - Modais: Full screen ou quase full screen
  - Navegação: Botões de ação empilhados verticalmente
  - Comportamento específico: Cards expandíveis para mostrar faturas

- **Tablet (576-991px)**:

  - Layout: Grid 2 colunas para cards de cartões
  - Navegação: Botões de ação em linha horizontal
  - Modais: Tamanho médio, centralizados
  - Comportamento específico: Mais espaço para informações detalhadas

- **Desktop (992px+)**:
  - Layout: Grid 3-4 colunas flexível (máx 4)
  - Hover states: Elevação de cards, mudança de cor em botões
  - Modais: Tamanho grande, centralizados
  - Comportamento específico: Sidebar visível, mais informações visíveis sem expansão

### Mobile-First Approach

- Base: Layout mobile otimizado
- Progressive enhancement: Adiciona colunas e funcionalidades conforme aumenta a tela
- Touch-first: Todas as interações funcionam perfeitamente em touch
- Performance: Carregamento otimizado para conexões móveis

### Touch Interactions

- **Tap**: Seleção de cartão, ações principais
- **Swipe**: (Futuro) Swipe para ações rápidas em cards
- **Long press**: (Futuro) Menu contextual em cards
- **Pull to refresh**: Recarregar lista de cartões

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: `primary` (criar cartão/fatura), `secondary` (ações secundárias), `tertiary` (editar), `danger` (excluir)
  - Size: `small` (ações em cards), `medium` (botões principais)
  - Usage: Botões de ação na página e dentro dos cards

- **os-input**:

  - Type: `text` (nome do cartão), `number` (limite, dias)
  - Validation: Required, min/max para valores numéricos
  - Usage: Formulários de cartão e fatura

- **os-select**:

  - Usage: Seleção de cartão ao criar fatura, seleção de conta no pagamento
  - Options: Dinâmicas baseadas em dados do estado

- **os-label**:

  - Variant: `default`
  - Size: `medium`
  - Usage: Labels de formulários

- **os-icon**:

  - Icons: `credit-card`, `money`, `edit`, `delete`, `add`, `check`, `warning`
  - Usage: Ícones decorativos e de ação

- **os-badge**:

  - Variant: `success` (fatura paga), `warning` (fatura vencida), `default` (fatura aberta)
  - Usage: Status de faturas

- **os-money-display**:

  - Usage: Exibição de limites, valores de faturas, saldos
  - Size: `lg` para valores principais, `md` para secundários

- **os-money-input**:

  - Usage: Campos de valor (limite, valor da fatura)
  - Currency: BRL

- **os-date-input**:

  - Usage: Datas de fechamento e vencimento
  - Format: DD/MM/YYYY

- **os-spinner**:
  - Usage: Estados de loading

#### Molecules

- **os-card**:

  - Variant: `default`
  - Size: `medium`
  - Usage: Container para cards de cartões de crédito

- **os-form-field**:

  - Usage: Campos de formulário com label e validação
  - Configuration: Required, error messages

- **os-form-group**:

  - Usage: Agrupamento de campos relacionados

- **os-money-display**:
  - Usage: Exibição formatada de valores monetários

#### Organisms

- **os-modal**:

  - Usage: Modais de formulários e confirmações
  - Variant: `default` para formulários, `confirmation` para confirmações

- **os-page-header**:
  - Usage: Cabeçalho da página com título e ações
  - Variant: `default`

#### Templates

- **os-modal-template**:

  - Configuration: Título, ações (salvar/cancelar), conteúdo customizado
  - Customizations: Formulários de cartão e fatura, modais de pagamento e reabertura
  - Usage: Todos os modais da feature

- **os-form-template**:
  - Configuration: (Opcional) Para formulários em página separada se necessário
  - Usage: Alternativa aos modais se preferir formulários em página

### Novos Componentes (Especificação Detalhada)

#### credit-card-card (Molecule)

**Propósito:**
Card reutilizável para exibir informações de um cartão de crédito, similar ao `account-card`, com suporte para exibir faturas associadas.

**Design Specs:**

- **Padding**: 16px horizontal, 20px vertical
- **Border**: 1px solid `--os-color-border` (--os-color-neutral-200)
- **Border-radius**: 8px
- **Typography**:
  - Nome do cartão: `--os-font-size-lg` (18px), `--os-font-weight-semibold`
  - Informações secundárias: `--os-font-size-sm` (14px), `--os-font-weight-regular`
- **Colors**:
  - Background: `--os-color-background-primary` (--os-color-neutral-50)
  - Text: `--os-color-text-primary` (--os-color-neutral-900)
  - Border: `--os-color-border` (--os-color-neutral-200)
  - Hover: `--os-color-background-hover` (--os-color-neutral-100)
  - Focus: `--os-color-primary` com ring de 2px

**States:**

- **Default**: Card com informações básicas visíveis
- **Hover**: Background muda para `--os-color-neutral-100`, cursor pointer
- **Focus**: Ring outline de 2px em `--os-color-primary`
- **Expanded**: Mostra lista de faturas abaixo do card
- **Loading**: Skeleton ou spinner durante carregamento de faturas

**Responsiveness:**

- Mobile: Full width, stack vertical de informações
- Tablet: Grid 2 colunas, informações mais espaçadas
- Desktop: Grid 3-4 colunas, hover states ativos

**Accessibility:**

- **Role**: `article` ou `region`
- **ARIA**:
  - `aria-label`: "Cartão de crédito [nome], limite [valor]"
  - `aria-expanded`: Para estado expandido/colapsado
  - `aria-describedby`: Para informações adicionais
- **Keyboard**:
  - Tab para navegar entre cards
  - Enter/Space para expandir/colapsar
  - Setas para navegar entre faturas quando expandido

**Variants:**

- `default`: Card padrão com todas as informações
- `compact`: Versão reduzida para listagens densas (futuro)

**Estrutura do Card:**

```
┌─────────────────────────────────────┐
│ Nome do Cartão          [Editar][X] │
│ Tipo: Crédito                       │
│                                     │
│ Limite: R$ 5.000,00                 │
│ Disponível: R$ 3.200,00             │
│                                     │
│ Fechamento: Dia 10                  │
│ Vencimento: Dia 20                  │
│                                     │
│ Faturas (3) [Expandir ▼]           │
│ ┌─────────────────────────────────┐ │
│ │ Fatura Jan/2024                 │ │
│ │ R$ 1.800,00 | Venc: 20/01      │ │
│ │ [Status: Aberta] [Pagar]       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### credit-card-bill-item (Molecule - dentro do card)

**Propósito:**
Item de fatura dentro do card expandido, mostrando informações resumidas da fatura.

**Design Specs:**

- **Padding**: 12px horizontal, 16px vertical
- **Border-top**: 1px solid `--os-color-neutral-200` (separador)
- **Typography**:
  - Título: `--os-font-size-base` (16px), `--os-font-weight-medium`
  - Valor: `--os-font-size-lg` (18px), `--os-font-weight-semibold`
- **Colors**:
  - Background: `--os-color-background-primary`
  - Text: `--os-color-text-primary`
  - Status badge: Variável conforme status

**States:**

- **Default**: Informações visíveis
- **Hover**: Background `--os-color-neutral-50`
- **Paid**: Texto com opacidade reduzida, badge verde
- **Overdue**: Badge vermelho, destaque visual

**Accessibility:**

- **Role**: `listitem` dentro de `list`
- **ARIA**:
  - `aria-label`: "Fatura de [mês/ano], valor [valor], status [status]"
  - `aria-describedby`: Para ações disponíveis

## 🏗️ Layout Structure

### Grid System

- **Columns**:
  - Mobile: 1 coluna
  - Tablet: 2 colunas
  - Desktop: 3-4 colunas (máx 4, flexível)
- **Gap**:
  - Mobile: 16px
  - Tablet: 20px
  - Desktop: 24px
- **Max Width**: 1200px container (centralizado)

### Sections

#### Header

- **Components**: `os-page-header` customizado
- **Height**: Auto (conteúdo + padding)
- **Sticky**: Não (scroll normal)
- **Z-index**: N/A
- **Content**:
  - Título: "Cartões de Crédito"
  - Subtítulo: "Gerencie seus cartões e faturas"
  - Ações: Botões "Novo Cartão" e "Nova Fatura"

#### Main Content

- **Layout**: Grid responsivo de cards
- **Padding**:
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 32px
- **Components**:
  - Grid de `credit-card-card`
  - Estados: loading, error, empty, success

#### Footer

- **Components**: N/A (não aplicável nesta página)

### Spacing Strategy

- **Section Gaps**:
  - Mobile: 16px entre header e content
  - Tablet: 24px
  - Desktop: 32px
- **Component Gaps**:
  - Mobile: 16px entre cards
  - Tablet: 20px
  - Desktop: 24px
- **Consistent Padding**: Escala de 8px, 12px, 16px, 20px, 24px, 32px

### Visual Hierarchy

1. **Título da página** - H1, maior destaque
2. **Cards de cartões** - H3 para nome do cartão, informações principais
3. **Faturas** - Informações secundárias dentro dos cards expandidos
4. **Ações** - Botões terciários, menos destaque visual

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - header → cards → modais
- **Focus Management**:
  - Visible focus ring em todos elementos interativos (2px solid `--os-color-primary`)
  - Focus trap em modais
  - Return focus ao fechar modal
- **Shortcuts**:
  - `Esc` fecha modais
  - `Enter/Space` expande/colapsa cards
- **Skip Links**: Skip to main content (já implementado no padrão)

#### ARIA Implementation

- **Landmarks**:

  - `<header role="banner">` - Header da página
  - `<main role="main">` - Conteúdo principal com grid de cards
  - `<section>` para agrupamentos lógicos

- **Live Regions**:

  - `aria-live="polite"` para atualizações de estado (loading, sucesso)
  - `aria-live="assertive"` para erros críticos
  - `role="status"` para mensagens informativas

- **Labels e Descriptions**:
  - Todos inputs com labels associados via `os-form-field`
  - Ícones decorativos com `aria-hidden="true"`
  - Botões com `aria-label` descritivos
  - Cards com `aria-label` completo: "Cartão [nome], limite [valor], disponível [valor]"

#### Visual Accessibility

- **Contraste**:

  - Texto normal: >= 4.5:1 (verificado com tokens do design system)
  - Texto grande (>= 18px): >= 3:1
  - UI Components: >= 3:1
  - Botões: Contraste adequado conforme variante

- **Typography**:

  - Font-size mínimo: 16px (1rem) para body text
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200% sem quebrar layout

- **Motion**:
  - Respeita `prefers-reduced-motion`
  - Transições <= 300ms
  - Sem animações desnecessárias ou distrações

#### Screen Reader Support

- **Content Structure**:
  - Headings hierárquicos (h1 → h2 → h3)
  - Listas semânticas para faturas (`<ul>`, `<li>`)
- **Alt Text**: N/A (sem imagens)
- **Form Labels**: Associação explícita via `os-form-field`
- **Error Messages**: Anunciados dinamicamente via `aria-live="assertive"`

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Spinner centralizado durante carregamento inicial
  - Skeleton screens para cards (futuro)
  - Loading state em botões durante ações

- **Empty**:

  - Ícone ilustrativo (cartão de crédito)
  - Mensagem: "Nenhum cartão cadastrado"
  - Descrição: "Crie seu primeiro cartão para começar a gerenciar suas faturas"
  - Call-to-action: Botão "Criar primeiro cartão"

- **Error**:

  - Ícone de erro
  - Mensagem descritiva do erro
  - Botão de retry: "Tentar Novamente"

- **Success**:
  - Feedback visual via toast/notification (futuro)
  - Mensagem de confirmação em modais
  - Atualização automática da lista após ações

### Micro-interactions

- **Hover**:
  - Cards: Elevação sutil (box-shadow), background change
  - Botões: Mudança de cor, scale up sutil (1.02)
- **Focus**:
  - Ring outline de 2px em `--os-color-primary`
  - Scale up sutil (1.02) em botões
- **Active**:
  - Scale down (0.98) em botões
  - Pressed state visual
- **Transitions**:
  - 200ms ease-in-out para estados de hover/focus
  - 300ms ease-in-out para expansão/colapso de cards

### Component-Specific Interactions

- **Credit Card Card**:

  - Click no card: Expande/colapsa para mostrar faturas
  - Click em "Editar": Abre modal de edição
  - Click em "Excluir": Abre modal de confirmação
  - Click em "Pagar" na fatura: Abre modal de pagamento

- **Modais**:

  - Click no backdrop: Fecha modal (configurável)
  - `Esc`: Fecha modal
  - Focus trap: Tab fica dentro do modal
  - Return focus: Volta para elemento que abriu o modal

- **Formulários**:
  - Validação em tempo real
  - Mensagens de erro abaixo dos campos
  - Botão "Salvar" desabilitado até formulário válido
  - Loading state durante submissão

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ Header (sticky)         │
│ ┌───────────────────┐  │
│ │ Cartões de Crédito │  │
│ │ Gerencie seus...   │  │
│ │ [Novo] [Nova Fat.] │  │
│ └───────────────────┘  │
├─────────────────────────┤
│ Main Content            │
│ ┌───────────────────┐  │
│ │ Card Cartão 1     │  │
│ │ Nome              │  │
│ │ Limite: R$ 5.000  │  │
│ │ [Editar] [X]      │  │
│ │ Faturas (3) [▼]   │  │
│ └───────────────────┘  │
│ ┌───────────────────┐  │
│ │ Card Cartão 2     │  │
│ │ ...                │  │
│ └───────────────────┘  │
└─────────────────────────┘
```

**Anotações:**

- Stack vertical de todos os cards
- Touch targets >= 44px
- Sem scroll horizontal
- Modais full screen ou quase full screen
- Botões de ação empilhados verticalmente no header

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ Header                            │
│ ┌─────────────────────────────┐  │
│ │ Cartões de Crédito           │  │
│ │ [Novo Cartão] [Nova Fatura] │  │
│ └─────────────────────────────┘  │
├───────────────────────────────────┤
│ Main Content                      │
│ ┌─────────────┐ ┌─────────────┐  │
│ │ Card 1      │ │ Card 2      │  │
│ │             │ │             │  │
│ │             │ │             │  │
│ └─────────────┘ └─────────────┘  │
│ ┌─────────────┐ ┌─────────────┐  │
│ │ Card 3      │ │ Card 4      │  │
│ └─────────────┘ └─────────────┘  │
└───────────────────────────────────┘
```

**Anotações:**

- Grid 2 colunas para cards
- Botões de ação em linha horizontal
- Modais tamanho médio, centralizados
- Mais espaço para informações detalhadas

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ Header                                      │
│ ┌───────────────────────────────────────┐  │
│ │ Cartões de Crédito                    │  │
│ │ [Novo Cartão] [Nova Fatura]          │  │
│ └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│ Main Content                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Card 1│ │Card 2│ │Card 3│ │Card 4│       │
│ │      │ │      │ │      │ │      │       │
│ │      │ │      │ │      │ │      │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│ ┌──────┐ ┌──────┐                         │
│ │Card 5│ │Card 6│                         │
│ └──────┘ └──────┘                         │
└─────────────────────────────────────────────┘
```

**Anotações:**

- Grid 3-4 colunas flexível (máx 4)
- Hover states ativos
- Modais tamanho grande, centralizados
- Sidebar visível (se aplicável)
- Mais informações visíveis sem necessidade de expansão

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

- `credit-card-card` (molecule) - Card de cartão de crédito
- `credit-card-bill-item` (molecule) - Item de fatura dentro do card
- `credit-card-form` (component) - Formulário de cartão (usa `os-modal-template`)
- `credit-card-bill-form` (component) - Formulário de fatura (usa `os-modal-template`)
- `pay-bill-modal` (component) - Modal de pagamento de fatura (usa `os-modal-template`)
- `reopen-bill-modal` (component) - Modal de reabertura de fatura (usa `os-modal-template`)
- `confirm-delete-modal` (component) - Modal de confirmação de exclusão (usa `os-modal-template`)

**Modificações:**

- Nenhuma modificação necessária em componentes existentes
- Reutilização total de componentes do Design System

### Dependências de UI

- **Angular Material**: Já disponível no projeto
- **Design System**: Componentes `os-*` já implementados
- **Nenhuma nova dependência**: Todas as dependências necessárias já estão no projeto

### Impacto em Performance

- **Bundle Size**:
  - Estimativa: ~15-20KB adicional (componentes novos)
  - Mitigação: Lazy loading da feature `/credit-cards`
- **Lazy Loading**:
  - Feature completa em lazy loading
  - Componentes de modal carregados sob demanda
- **Critical CSS**:
  - Estilos críticos para first paint: Header e grid básico
  - Cards podem ser carregados progressivamente

### Integration Points

- **CreditCardState**: Estado reativo com signals para cartões e faturas
- **BudgetSelectionService**: Filtragem automática por orçamento
- **AccountState**: Seleção de conta no pagamento de fatura
- **TransactionService**: Criação automática de transação no pagamento
- **Router**: Rotas lazy loading `/credit-cards`, `/credit-cards/new`, `/credit-cards/:id/edit`

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance

- [ ] Componentes `os-*` utilizados corretamente
- [ ] Design tokens aplicados (`--os-*`)
- [ ] Nomenclatura consistente (BEM ou similar)
- [ ] Tema aplicado corretamente (light/dark se aplicável)

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile < 576px, tablet 576-991px, desktop >= 992px)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Grid responsivo funciona corretamente em todos os breakpoints

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Space, Esc)
- [ ] ARIA attributes corretos (labels, live regions, roles)
- [ ] Screen reader friendly (testado com NVDA/JAWS)
- [ ] Contraste adequado (>= 4.5:1 para texto normal)
- [ ] Focus visible em todos elementos interativos

### Performance

- [ ] OnPush change detection em todos componentes
- [ ] Lazy loading da feature implementado
- [ ] Bundle size otimizado (verificar com bundle analyzer)
- [ ] Computed signals para derivações (não computed desnecessários)

### Visual Quality

- [ ] Spacing consistente (escala de 8px)
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara (título > cards > faturas)
- [ ] Estados (loading, error, empty, success) implementados
- [ ] Transições suaves (200-300ms)

## 📚 References

### Design System Documentation

- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines

- [Material Design Cards](https://material.io/components/cards)
- [Material Design Lists](https://material.io/components/lists)
- [Material Design Dialogs](https://material.io/components/dialogs)

### WCAG Guidelines

- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [Keyboard Navigation](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [Focus Management](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)

### Código Similar no Projeto

- **Accounts Feature**: `src/app/features/accounts/` - Padrão de referência
- **Account Card**: `src/app/shared/ui-components/molecules/account-card/` - Referência para `credit-card-card`
- **Accounts Page**: `src/app/features/accounts/pages/accounts/accounts.page.ts` - Referência para estrutura de página

### Meta Specs - Contexto de Produto

- **Personas**: `personas.md` - Perfis de usuário e necessidades específicas (Ana, Roberto & Maria)
- **Jornada do Cliente**: `customer-journey.md` - Touchpoints e estágios de engajamento (Estágio: Adoção)
- **Conceitos Centrais**: `core-concepts.md` - Domínio financeiro e regras de negócio (Gestão de Cartões, Sistema Dual)
- **Funcionalidades Core**: `03_funcionalidades_core.md` - Diferenciação e valor único (Gestão Integrada de Cartões #5, Sistema Dual #6)


