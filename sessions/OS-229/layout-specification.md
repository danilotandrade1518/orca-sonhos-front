# Accounts - Gestão de Contas - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Interface clara e organizada que permite ao usuário visualizar e gerenciar todas as suas contas financeiras de forma intuitiva. O layout deve comunicar **clareza sobre onde o dinheiro está** e facilitar operações como transferências e reconciliação, alinhado ao conceito de **Sistema Dual: Orçamentos + Contas**.

### Tipo de Layout

**List Page** com **Modal Forms** para criação/edição e ações secundárias (transferência, reconciliação).

### Público-Alvo

**Universal** - Mobile-first com progressive enhancement para tablet e desktop.

### Persona Primária

**Ana (Organizadora Familiar)** - Gerencia finanças da casa, precisa de controle claro sobre onde o dinheiro está guardado, com interface que permita compartilhamento e transparência.

**Características da Persona:**

- 32 anos, casada, 2 filhos
- Gerencia as finanças da casa
- Quer envolver o marido no controle financeiro
- Organizada mas sobrecarregada
- Precisa de simplicidade e clareza visual
- Usa principalmente mobile/tablet para gestão rápida

**Necessidades de Interface:**

- Visualização rápida de saldos
- Ações frequentes (transferir, reconciliar) facilmente acessíveis
- Formulários simples e diretos
- Feedback visual claro sobre operações
- Suporte a múltiplos tipos de conta (corrente, poupança, carteira)

### Contexto de Uso

**Estágio da Jornada: Adoção (D+7 a D+30)**

Usuário já estabeleceu rotina de uso, está criando múltiplas metas e precisa de controle detalhado sobre suas contas. Esta funcionalidade é essencial para o **Sistema Dual** que separa "para que uso" (orçamentos) de "onde está" (contas).

**Objetivos do Usuário neste Estágio:**

- Visualizar todas as contas do orçamento atual em um único lugar
- Criar novas contas rapidamente (corrente, poupança, carteira, etc.)
- Transferir dinheiro entre contas com validações claras
- Reconciliar saldos quando há divergências
- Editar/excluir contas quando necessário
- Ver saldo atualizado em tempo real após operações

**Valor Percebido Esperado:**

- **Clareza financeira**: Sabe exatamente onde cada centavo está guardado
- **Controle total**: Pode mover dinheiro entre contas facilmente
- **Consistência**: Saldos sempre sincronizados com o orçamento atual
- **Transparência**: Interface clara que facilita compartilhamento familiar

**Friction Points a Evitar:**

- Complexidade desnecessária nos formulários
- Falta de feedback após operações
- Validações pouco claras
- Dificuldade para encontrar ações (transferir, reconciliar)

**Touchpoints Críticos:**

- **Primeira criação de conta**: Deve ser intuitiva e rápida (< 1 minuto)
- **Primeira transferência**: Deve ser clara e validada (mesmo orçamento, saldo suficiente)
- **Reconciliação**: Deve explicar o processo (valor final esperado, backend calcula ajuste)
- **Exclusão bloqueada**: Mensagem clara quando há transações vinculadas

### Funcionalidades Core Relacionadas

1. **Sistema Dual: Orçamentos + Contas** ⭐⭐⭐

   - **Impacto no Layout**: Separação visual clara entre orçamento atual e contas
   - **Seletor de orçamento**: Visível no header para contexto
   - **Filtro automático**: Lista apenas contas do orçamento atual

2. **Múltiplos Orçamentos** ⭐⭐

   - **Impacto no Layout**: Contas filtradas por orçamento atual
   - **Navegação contextual**: Criação de conta já com `budgetId` do orçamento atual

3. **Compartilhamento Familiar Simplificado** ⭐

   - **Impacto no Layout**: Interface deve ser clara para múltiplos usuários
   - **Ações colaborativas**: Transferências e reconciliações visíveis para todos

4. **Transações Temporalmente Flexíveis** ⭐

   - **Impacto no Layout**: Consistência com sistema de transações
   - **Integração**: Campo "Conta" obrigatório em transações

5. **Dashboard Centrado em Progresso** ⭐
   - **Impacto no Layout**: Card "Contas" no dashboard com ações rápidas
   - **Navegação**: Link direto do dashboard para `/accounts`

### Considerações da Jornada do Usuário

**Estágio da Jornada: Adoção**

- Usuário já conhece a ferramenta
- Precisa de funcionalidades avançadas
- Quer controle total sobre finanças
- Estabeleceu rotina de uso

**Touchpoints Críticos:**

- **Momento de verdade**: Primeira transferência bem-sucedida entre contas
- **Recovery points**: Feedback claro em caso de erro (ex: saldo insuficiente)
- **Transições**: Integração fluida com Dashboard, Budgets e Transactions

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column para lista de contas
  - Touch targets: >= 44px para todos os botões e ações
  - Cards de conta: Full width, stack vertical
  - Ações: Botões full width em mobile, menu dropdown para ações secundárias
  - Modais: Full screen ou quase full screen
  - Comportamento específico: Filtros em drawer lateral, scroll infinito

- **Tablet (576-991px)**:

  - Layout: Grid 2 colunas para cards de conta
  - Navegação: Header completo com ações principais visíveis
  - Modais: Centralizados com largura máxima (600px)
  - Comportamento específico: Filtros em barra horizontal acima da lista

- **Desktop (992px+)**:
  - Layout: Grid 3-4 colunas para cards de conta (dependendo do conteúdo)
  - Hover states: Elevação de cards, hover em botões
  - Modais: Centralizados com largura máxima (700px)
  - Comportamento específico: Sidebar de filtros (opcional), ações rápidas sempre visíveis

### Mobile-First Approach

- **Base**: Lista vertical simples, cards empilhados, ações principais sempre visíveis
- **Progressive Enhancement**:
  - Tablet: Grid 2 colunas, filtros horizontais
  - Desktop: Grid 3-4 colunas, hover states, sidebar opcional

### Touch Interactions

- **Swipe**: Não aplicável (listas não são swipeable)
- **Tap**: Todas as ações principais via tap em botões >= 44px
- **Long press**: Não aplicável
- **Pull to refresh**: Suporte a refresh da lista de contas

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: `primary` (Nova Conta, Salvar), `secondary` (Transferir, Reconciliar), `tertiary` (Editar, Cancelar), `danger` (Excluir)
  - Size: `medium` (padrão), `small` (ações secundárias em cards)
  - Usage: Todas as ações principais e secundárias

- **os-icon**:

  - Icons: `account_balance` (conta corrente), `account_balance_wallet` (carteira), `savings` (poupança), `trending_up` (investimento), `credit_card` (cartão), `add` (nova conta), `edit` (editar), `delete` (excluir), `swap_horiz` (transferir), `check_circle` (reconciliar)
  - Usage: Indicadores de tipo de conta, ações, status

- **os-input**:

  - Type: `text` (nome da conta), `number` (saldo inicial)
  - Validation: Integrado com reactive forms
  - Usage: Formulários de criação/edição de conta

- **os-select**:

  - Usage: Seleção de tipo de conta, seleção de contas origem/destino em transferência
  - Options: `CORRENTE`, `POUPANCA`, `CARTEIRA_FISICA`, `CARTEIRA_DIGITAL`, `INVESTIMENTO`, `OUTROS`

- **os-money-input**:

  - Usage: Saldo inicial, valor de transferência, valor final na reconciliação
  - Validation: >= 0, formato monetário brasileiro

- **os-label**:

  - Usage: Labels de formulários
  - Variant: `default`, `required` para campos obrigatórios

- **os-badge**:

  - Usage: Indicador de tipo de conta, status de conta
  - Variant: `primary`, `secondary`, `success`, `warning`

- **os-spinner**:
  - Usage: Loading states durante operações
  - Size: `md` (padrão), `sm` (em botões)

#### Molecules

- **os-form-field**:

  - Configuration: Label, placeholder, validação, mensagens de erro
  - Usage: Todos os campos de formulário (nome, tipo, saldo inicial)

- **os-form-group**:

  - Configuration: Agrupamento de campos relacionados
  - Usage: Formulários de conta (dados básicos), transferência (origem/destino/valor), reconciliação (valor final)

- **os-card**:

  - Variant: `default` (padrão), `outlined` (destaque)
  - Size: `medium` (padrão)
  - Usage: Cards de conta na lista, cards de resumo

- **os-money-display**:

  - Usage: Exibição de saldo nas contas
  - Format: R$ 0,00 (formato brasileiro)

- **os-filter-bar**:
  - Usage: Filtros de busca e tipo de conta (opcional na primeira versão)
  - Variant: `compact` (mobile), `default` (tablet/desktop)

#### Organisms

- **os-page-header**:

  - Variant: `default`
  - Actions: Botão "Nova Conta" (primary), ações secundárias (Transferir, Reconciliar)
  - Usage: Header da página de contas

- **os-data-grid** (via os-list-template):

  - Usage: Lista de contas em formato de grid/cards
  - Variant: `default`
  - Actions: Editar, Excluir por linha/card

- **os-modal**:

  - Usage: Formulários de criação/edição, confirmação de exclusão, transferência, reconciliação
  - Variant: `default` (formulários), `compact` (confirmações)

- **os-transaction-list** (referência):
  - Usage: Padrão de lista similar (adaptar para contas)

#### Templates

- **os-list-template**:

  - Configuration:
    - `title`: "Contas"
    - `subtitle`: "Gerencie suas contas financeiras"
    - `data`: Lista de contas formatada
    - `columns`: Nome, Tipo, Saldo, Ações
    - `headerActions`: Nova Conta, Transferir, Reconciliar
    - `emptyAction`: "Criar primeira conta"
  - Customizations: Layout de cards em vez de tabela, grid responsivo
  - Usage: Página principal de listagem de contas

- **os-form-template** (ou modal):

  - Configuration:
    - Formulário de criação/edição de conta
    - Campos: Nome (obrigatório), Tipo (obrigatório), Saldo Inicial (>= 0)
  - Usage: Modal de criação/edição de conta

- **os-modal-template**:
  - Configuration:
    - Transferência: Formulário com origem, destino, valor
    - Reconciliação: Formulário com valor final esperado
    - Confirmação: Exclusão de conta
  - Usage: Modais de ações secundárias

### Novos Componentes (Especificação Detalhada)

#### AccountCard (Molecule)

**Propósito:**
Card individual para exibir uma conta na lista, com informações principais (nome, tipo, saldo) e ações rápidas (editar, excluir).

**Design Specs:**

- **Padding**: 16px horizontal, 12px vertical
- **Border**: 1px solid `--os-color-border`
- **Border-radius**: 8px
- **Typography**:
  - Nome: `--os-font-size-lg`, `--os-font-weight-semibold`
  - Tipo: `--os-font-size-sm`, `--os-font-weight-medium`
  - Saldo: `--os-font-size-xl`, `--os-font-weight-bold`
- **Colors**:
  - Background: `--os-color-background-primary`
  - Text: `--os-color-text-primary`
  - Border: `--os-color-border`
  - Hover: `--os-color-background-hover` (elevação leve)
  - Focus: 2px solid ring `--os-color-primary`

**States:**

- **Default**: Card estático com informações
- **Hover**: Elevação leve (box-shadow), cursor pointer se clicável
- **Focus**: Ring outline 2px `--os-color-primary`
- **Selected**: Border destacado `--os-color-primary`
- **Loading**: Skeleton/placeholder durante carregamento

**Responsiveness:**

- Mobile: Full width, stack vertical de informações
- Tablet: Largura 50% (2 colunas), layout horizontal
- Desktop: Largura 33% (3 colunas) ou 25% (4 colunas), layout otimizado

**Accessibility:**

- **Role**: `article` ou `button` (se clicável)
- **ARIA**:
  - `aria-label`: "Conta {nome}, tipo {tipo}, saldo {valor}"
  - `aria-describedby`: ID do elemento com detalhes
- **Keyboard**: Tab para navegação, Enter/Space para ação principal

**Variants:**

- `default`: Card padrão
- `compact`: Versão compacta com menos informações
- `detailed`: Versão detalhada com histórico recente (futuro)

#### AccountTypeBadge (Atom)

**Propósito:**
Badge para indicar o tipo de conta com ícone e cor específica.

**Design Specs:**

- **Padding**: 4px horizontal, 2px vertical
- **Border-radius**: 4px
- **Typography**: `--os-font-size-xs`, `--os-font-weight-medium`
- **Colors por tipo**:
  - Corrente: `--os-color-primary`
  - Poupança: `--os-color-success`
  - Carteira Física: `--os-color-warning`
  - Carteira Digital: `--os-color-secondary`
  - Investimento: `--os-color-info` (se disponível)
  - Outros: `--os-color-neutral-500`

**States:**

- Apenas estado default (sem interação)

**Accessibility:**

- **ARIA**: `aria-label`: "Tipo de conta: {tipo}"

#### TransferForm (Molecule)

**Propósito:**
Formulário específico para transferência entre contas.

**Design Specs:**

- **Layout**: Formulário vertical com 3 campos principais
- **Campos**:
  1. Conta Origem (select, obrigatório)
  2. Conta Destino (select, obrigatório)
  3. Valor (money-input, obrigatório, >= 0.01)
- **Validações**:
  - Contas devem pertencer ao mesmo orçamento
  - Conta origem deve ter saldo suficiente
  - Conta origem != Conta destino
- **Feedback**: Mensagens de erro claras e específicas

**Accessibility:**

- **ARIA**: `role="form"`, `aria-label`: "Formulário de transferência entre contas"
- **Labels**: Todos os campos com labels associados
- **Error messages**: Anunciados via `aria-live="assertive"`

#### ReconcileForm (Molecule)

**Propósito:**
Formulário para reconciliação de saldo de conta.

**Design Specs:**

- **Layout**: Formulário simples com campo de valor final
- **Campos**:
  1. Conta (select, disabled, mostra conta atual)
  2. Valor Final Esperado (money-input, obrigatório, >= 0)
- **Helper Text**: "O sistema calculará automaticamente a diferença e criará uma transação de ajuste"
- **Feedback**: Mensagem explicativa sobre o processo

**Accessibility:**

- **ARIA**: `role="form"`, `aria-label`: "Formulário de reconciliação de saldo"
- **Helper text**: Associado via `aria-describedby`

## 🏗️ Layout Structure

### Grid System

- **Columns**:
  - Desktop: 12-col (flexível para 3-4 colunas de cards)
  - Tablet: 8-col (2 colunas de cards)
  - Mobile: 1-col (stack vertical)
- **Gap**:
  - Desktop: 24px
  - Tablet: 16px
  - Mobile: 12px
- **Max Width**: 1200px container (centralizado)

### Sections

#### Header

- **Components**: `os-page-header` com título "Contas" e ações
- **Height**: 64px desktop, 56px mobile
- **Sticky**: Não (scroll normal)
- **Z-index**: 100 (se necessário para dropdowns)
- **Actions**:
  - "Nova Conta" (primary, icon: `add`)
  - "Transferir" (secondary, icon: `swap_horiz`)
  - "Reconciliar" (secondary, icon: `check_circle`)

#### Main Content

- **Layout**: Grid responsivo de cards de conta
- **Padding**:
  - Desktop: 32px
  - Tablet: 24px
  - Mobile: 16px
- **Components**:
  - `os-list-template` (adaptado para cards)
  - `AccountCard` (molecule nova)
  - Empty state com CTA
  - Loading skeleton

#### Modals

- **AccountFormModal**: Criação/edição de conta
  - Width: 500px (desktop), full screen (mobile)
  - Fields: Nome, Tipo, Saldo Inicial
- **TransferModal**: Transferência entre contas
  - Width: 600px (desktop), full screen (mobile)
  - Fields: Origem, Destino, Valor
- **ReconcileModal**: Reconciliação de saldo
  - Width: 500px (desktop), full screen (mobile)
  - Fields: Conta (readonly), Valor Final
- **ConfirmModal**: Confirmação de exclusão
  - Width: 400px (desktop), full screen (mobile)
  - Message: Explicação sobre bloqueio se houver transações

### Spacing Strategy

- **Section Gaps**:
  - Desktop: 32px entre header e conteúdo
  - Tablet: 24px
  - Mobile: 16px
- **Component Gaps**:
  - Desktop: 24px entre cards
  - Tablet: 16px
  - Mobile: 12px
- **Consistent Padding**: 24px, 16px, 12px, 8px scale

### Visual Hierarchy

1. **Título da Página** (H1) - "Contas"
2. **Ações Principais** (Header buttons) - Nova Conta, Transferir, Reconciliar
3. **Cards de Conta** (H2 nível visual) - Nome da conta, tipo, saldo
4. **Ações Secundárias** (Card actions) - Editar, Excluir
5. **Informações Detalhadas** (H3) - Tipo, saldo formatado

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - header → filtros (se houver) → lista de contas → modais
- **Focus Management**:
  - Visible focus ring em todos elementos interativos
  - Foco retorna ao trigger após fechar modal
  - Skip links para pular ao conteúdo principal
- **Shortcuts**:
  - `Esc` fecha modais
  - `Enter` submete formulários (quando foco em campo)
- **Skip Links**: "Pular para conteúdo principal" (visível no focus)

#### ARIA Implementation

- **Landmarks**:

  - `<header role="banner">` - Header principal
  - `<main role="main">` - Conteúdo principal (lista de contas)
  - `<nav role="navigation">` - Navegação (se houver breadcrumbs)
  - `<aside role="complementary">` - Filtros (se em sidebar)

- **Live Regions**:

  - `aria-live="polite"` para atualizações de lista (nova conta criada, saldo atualizado)
  - `aria-live="assertive"` para erros críticos (ex: saldo insuficiente, exclusão bloqueada)

- **Labels e Descriptions**:

  - Todos inputs com labels associados via `os-form-field`
  - Ícones decorativos com `aria-hidden="true"`
  - Botões com `aria-label` descritivos: "Editar conta {nome}", "Excluir conta {nome}"
  - Cards de conta com `aria-label` completo: "Conta {nome}, tipo {tipo}, saldo {valor}"

- **Formulários**:
  - `role="form"` em todos os formulários
  - `aria-required="true"` em campos obrigatórios
  - `aria-invalid="true"` em campos com erro
  - `aria-describedby` linkando mensagens de erro/helper text

#### Visual Accessibility

- **Contraste**:

  - Texto normal: >= 4.5:1 (verificado com tokens do design system)
  - Texto grande (>= 18px): >= 3:1
  - UI Components (botões, badges): >= 3:1

- **Typography**:

  - Font-size mínimo: 16px (1rem) para body text
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200% sem quebra de layout

- **Motion**:
  - Respeita `prefers-reduced-motion` (sem animações desnecessárias)
  - Transições <= 300ms para estados
  - Sem animações que podem causar desconforto

#### Screen Reader Support

- **Content Structure**:
  - Headings hierárquicos (h1 → h2 → h3)
  - Listas semânticas (`<ul>`, `<li>`) para lista de contas
  - Landmarks apropriados
- **Alt Text**:
  - Ícones com significado têm `aria-label`
  - Ícones decorativos têm `aria-hidden="true"`
- **Form Labels**:
  - Associação explícita via `os-form-field` (label + input)
  - Helper text e error messages associados via `aria-describedby`
- **Error Messages**:
  - Anunciados dinamicamente via `aria-live="assertive"`
  - Vinculados aos campos via `aria-describedby`

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Spinner centralizado durante carregamento inicial
  - Skeleton screens para cards de conta durante loading
  - Loading state em botões durante operações (create/update/delete/transfer/reconcile)

- **Empty**:

  - Ícone ilustrativo (`account_balance_wallet`)
  - Título: "Nenhuma conta cadastrada"
  - Descrição: "Crie sua primeira conta para começar a gerenciar suas finanças"
  - Call-to-action: Botão "Nova Conta" (primary)

- **Error**:

  - Ícone de erro (`error`)
  - Mensagem descritiva específica:
    - "Não foi possível carregar as contas. Tente novamente."
    - "Saldo insuficiente na conta origem."
    - "Não é possível excluir conta com transações vinculadas."
  - Botão de retry quando aplicável

- **Success**:
  - Toast notification para ações bem-sucedidas:
    - "Conta criada com sucesso!"
    - "Transferência realizada com sucesso!"
    - "Saldo reconciliado com sucesso!"
  - Feedback visual imediato (atualização de saldo em tempo real)

### Micro-interactions

- **Hover**:
  - Cards: Elevação leve (box-shadow), cursor pointer
  - Botões: Mudança de cor de fundo, elevação
- **Focus**:
  - Ring outline 2px `--os-color-primary`
  - Focus visível em todos elementos interativos
- **Active**:
  - Botões: Scale down leve (0.98), pressed state
- **Transitions**:
  - 200ms ease-in-out para estados hover/focus
  - 300ms para modais (open/close)

### Component-Specific Interactions

#### AccountCard

- **Click**: Abre modal de edição (futuro: pode abrir detalhes)
- **Hover**: Elevação e highlight leve
- **Actions**: Menu dropdown ou botões inline (editar, excluir)

#### TransferForm

- **Validação em tempo real**:
  - Verifica saldo suficiente ao selecionar conta origem
  - Desabilita conta destino se for igual à origem
  - Valida formato monetário do valor
- **Feedback imediato**: Mensagens de erro aparecem durante digitação

#### ReconcileForm

- **Helper text**: Explicação sobre processo de reconciliação sempre visível
- **Validação**: Valor final >= 0

#### Modals

- **Open/Close**:
  - Fade in/out com backdrop
  - Foco capturado no modal ao abrir
  - Foco retorna ao trigger ao fechar
- **Esc key**: Fecha modal
- **Click outside**: Fecha modal (exceto confirmações críticas)

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ Header (sticky)         │
│ ┌───────────────────┐ │
│ │ Contas      [New] │ │
│ └───────────────────┘ │
├─────────────────────────┤
│ Actions (stack)         │
│ ┌───────────────────┐ │
│ │ [Transferir]      │ │
│ │ [Reconciliar]     │ │
│ └───────────────────┘ │
├─────────────────────────┤
│ Main Content            │
│ ┌───────────────────┐ │
│ │ Account Card 1    │ │
│ │ ┌───────────────┐ │ │
│ │ │ Nome    [⋮]  │ │ │
│ │ │ Tipo Badge   │ │ │
│ │ │ Saldo R$...  │ │ │
│ │ │ [Edit][Del]  │ │ │
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ Account Card 2    │ │
│ │ ┌───────────────┐ │ │
│ │ │ ...           │ │ │
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
└─────────────────────────┘
```

**Anotações:**

- Stack vertical de todos os cards
- Touch targets >= 44px
- Ações em menu dropdown (⋮) ou botões inline full width
- Modais full screen ou quase full screen
- Sem scroll horizontal

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ Header (sticky)                   │
│ ┌─────────────────────────────┐ │
│ │ Contas [New][Transfer][Rec] │ │
│ └─────────────────────────────┘ │
├───────────────────────────────────┤
│ Main Content (2 cols)             │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Account 1   │ │ Account 2   │ │
│ │ ┌─────────┐ │ │ ┌─────────┐ │ │
│ │ │ ...     │ │ │ │ ...     │ │ │
│ │ └─────────┘ │ │ └─────────┘ │ │
│ └─────────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Account 3   │ │ Account 4   │ │
│ └─────────────┘ └─────────────┘ │
└───────────────────────────────────┘
```

**Anotações:**

- Grid 2 colunas para cards
- Ações principais sempre visíveis no header
- Modais centralizados (600px max width)

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ Header (sticky)                             │
│ ┌───────────────────────────────────────┐ │
│ │ Contas  [New] [Transfer] [Reconcile]  │ │
│ └───────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Main Content (3-4 cols)                    │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │Card 1│ │Card 2│ │Card 3│ │Card 4│      │
│ │      │ │      │ │      │ │      │      │
│ └──────┘ └──────┘ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │Card 5│ │Card 6│ │Card 7│               │
│ └──────┘ └──────┘ └──────┘               │
└─────────────────────────────────────────────┘
```

**Anotações:**

- Grid 3-4 colunas flexível
- Hover states ativos
- Modais centralizados (700px max width)
- Ações rápidas sempre visíveis

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

1. **AccountCard** (Molecule) - Card individual de conta
2. **AccountTypeBadge** (Atom) - Badge de tipo de conta
3. **TransferForm** (Molecule) - Formulário de transferência
4. **ReconcileForm** (Molecule) - Formulário de reconciliação
5. **AccountFormComponent** (Component) - Formulário de criação/edição (usa os-form-template)

**Modificações:**

- **os-list-template**: Adaptar para layout de cards (já suporta via data-grid)
- Nenhuma modificação necessária em componentes existentes

### Dependências de UI

- Nenhuma nova dependência necessária
- Componentes do Design System já disponíveis

### Impacto em Performance

- **Bundle Size**:
  - ~15KB adicional (componentes novos)
  - Lazy loading de modais (já implementado)
- **Lazy Loading**:
  - Feature `accounts` já será lazy loaded via rotas
  - Modais carregados sob demanda
- **Critical CSS**:
  - Estilos de cards e layout críticos para first paint
  - Skeleton screens para loading states

### Integration Points

- **AccountState**: Consumo de `accounts()` signal para lista
- **AccountState**: Métodos `create()`, `update()`, `delete()`, `transfer()`, `reconcile()`
- **BudgetSelectionService**: Filtro automático por `budgetId` atual
- **Transactions**: Integração futura (campo obrigatório de conta)

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance

- [ ] Componentes os-\* utilizados corretamente
- [ ] Design tokens aplicados (--os-\*)
- [ ] Nomenclatura consistente (account-_, os-_)
- [ ] Tema aplicado corretamente (light/dark)

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile, tablet, desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Cards responsivos (1 col → 2 cols → 3-4 cols)

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Esc)
- [ ] ARIA attributes corretos (labels, live regions, landmarks)
- [ ] Screen reader friendly (testado com NVDA/JAWS)
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos
- [ ] Skip links funcionais

### Performance

- [ ] OnPush change detection em todos componentes
- [ ] Lazy loading de modais
- [ ] Bundle size otimizado
- [ ] Computed signals para derivações (filtros, ordenação)

### Visual Quality

- [ ] Spacing consistente (24px, 16px, 12px, 8px)
- [ ] Alinhamento visual correto (grid alinhado)
- [ ] Hierarquia visual clara (título → ações → cards)
- [ ] Estados (loading, error, empty) implementados
- [ ] Micro-interactions suaves (hover, focus, active)

### Funcionalidades Core

- [ ] Sistema Dual aplicado (orçamento atual visível)
- [ ] Múltiplos orçamentos suportados (filtro automático)
- [ ] Integração com Dashboard (card "Contas")
- [ ] Integração com Transactions (preparação para campo obrigatório)

## 📚 References

### Design System Documentation

- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines

- [Material Design Lists](https://material.io/design/components/lists.html)
- [Material Design Cards](https://material.io/design/components/cards.html)
- [Material Design Forms](https://material.io/design/components/text-fields.html)

### WCAG Guidelines

- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [Keyboard Navigation](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [Focus Management](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)

### Código Similar no Projeto

- `src/app/features/transactions/pages/transactions/transactions.page.ts` - Padrão de lista similar
- `src/app/features/budget/pages/budget-list/budget-list.page.ts` - Padrão de listagem com cards
- `src/app/shared/ui-components/templates/os-list-template/` - Template reutilizável

### Meta Specs - Contexto de Produto

- **Personas**: `business/customer-profile/personas.md` - Perfis de usuário e necessidades específicas
- **Jornada do Cliente**: `business/customer-profile/customer-journey.md` - Touchpoints e estágios de engajamento
- **Conceitos Centrais**: `business/product-vision/core-concepts.md` - Sistema Dual: Orçamentos + Contas
- **Funcionalidades Core**: `business/03_funcionalidades_core.md` - Sistema Dual como funcionalidade core




