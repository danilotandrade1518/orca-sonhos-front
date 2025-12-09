# Sistema de Envelopes - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Apresentar de forma clara e motivacional os limites de gastos por categoria (envelopes), permitindo ao usuário visualizar rapidamente o progresso de uso de cada envelope e identificar situações de alerta (quando próximo ou excedendo o limite). O layout deve comunicar **controle financeiro** e **progresso visual**, incentivando disciplina orçamentária.

### Tipo de Layout

**List** - Layout de lista em grid responsivo, seguindo o padrão de `AccountsPage`.

### Público-Alvo

**Mobile-first | Universal** - A funcionalidade é crítica para uso mobile, onde os usuários verificam seus gastos frequentemente ao longo do dia.

### Persona Primária

**Ana - A Organizadora Familiar** 🎯

Ana é a persona ideal para o sistema de envelopes pois:

**Características da Persona:**
- 32 anos, casada, 2 filhos, gerencia finanças da casa
- Renda familiar R$ 8.000/mês
- Usa planilhas do Excel atualmente
- Organizada mas sobrecarregada com múltiplas responsabilidades
- Quer envolver o marido no controle financeiro
- Sonha com casa própria e educação dos filhos

**Necessidades de Interface:**
- Visualização rápida de "onde está indo o dinheiro"
- Alertas claros quando categorias estão próximas do limite
- Interface simples que substitua planilhas complexas
- Progresso visual das metas de economia

**Contexto de Uso:**
- Mobile (60%): Verifica gastos durante o dia, no supermercado, etc.
- Desktop (40%): Análise semanal detalhada, ajustes de limites

**Dores Específicas que o Layout Resolve:**
- Falta de clareza sobre onde vai o dinheiro → Grid visual de envelopes
- Perde tempo com planilhas complexas → Interface intuitiva e direta
- Não consegue visualizar progresso → Barras de progresso coloridas

### Contexto de Uso

O sistema de envelopes é acessado via navegação lateral (`/envelopes`), dentro do contexto de um orçamento selecionado. É uma funcionalidade central para o **Dashboard Centrado em Progresso** e alimenta o indicador de **"Uso de Orçamento e Envelopes"** no `FinancialHealthIndicatorComponent`.

### Funcionalidades Core Relacionadas

1. **Sistema de Metas SMART** - Envelopes ajudam a controlar gastos para sobrar dinheiro para metas
2. **Dashboard Centrado em Progresso** - Envelopes alimentam indicadores de saúde financeira
3. **Múltiplos Orçamentos** - Cada envelope pertence a um orçamento específico

### Considerações da Jornada do Usuário

**Estágio da Jornada: Engajamento → Adoção**

Este layout atende principalmente usuários nos estágios 3 (Engajamento Inicial) e 4 (Adoção).

**Objetivos do Usuário neste Estágio:**
- Entender para onde vai o dinheiro (D+1 a D+7)
- Ganhar confiança na ferramenta
- Estabelecer rotina de controle financeiro
- Refinamento de categorias e orçamentos (D+7 a D+30)

**Valor Percebido Esperado:**
- "Agora eu SEI quanto posso gastar em cada categoria"
- "Recebi um alerta antes de estourar o limite"
- "Consigo ver que estou economizando"

**Friction Points a Evitar:**
- Complexidade para criar envelopes
- Falta de feedback visual do progresso
- Alertas confusos ou tardios sobre estouros

**Touchpoints Críticos:**
- Primeiro envelope criado: Deve ser intuitivo e rápido
- Primeiro alerta de limite: Deve ser claro e acionável
- Visualização de estouro: Feedback visual inequívoco (vermelho)

---

## 📱 Responsive Strategy

### Breakpoints Definidos

#### Mobile (0-575px)
- **Layout**: Stack vertical, single column, 100% width
- **Touch targets**: >= 44px (Apple HIG) / 48px ideal (Material)
- **Card height**: Auto, mínimo 120px
- **Progress bar**: Full width
- **Actions**: Botões de ícone compactos no canto superior direito
- **Comportamento específico**: 
  - Cards ocupam largura total
  - Menu hambúrguer para ações secundárias
  - Bottom sheet para formulário de criação/edição

#### Tablet (576-991px)
- **Layout**: Grid 2 colunas, `repeat(auto-fill, minmax(240px, 1fr))`
- **Navegação**: Sidebar colapsada disponível
- **Card height**: Auto, mínimo 140px
- **Actions**: Botões com ícone visíveis no hover/focus
- **Comportamento específico**:
  - Cards em grid adaptativo
  - Modal para formulário de criação/edição

#### Desktop (992px+)
- **Layout**: Grid 3-4 colunas, `repeat(auto-fill, minmax(280px, 1fr))`
- **Sidebar**: Expandida, 240px
- **Card height**: Auto, mínimo 160px
- **Hover states**: Elevação de cards, ações visíveis
- **Comportamento específico**:
  - Grid fluido de cards
  - Modal para formulário de criação/edição
  - Tooltips em elementos truncados

### Mobile-First Approach

1. **Base**: Layout single-column com todos os dados essenciais visíveis
2. **Progressive Enhancement**:
   - Tablet: Adiciona grid 2 colunas
   - Desktop: Grid fluido, hover states, ações expandidas

### Touch Interactions

- **Tap**: Abre card para ver detalhes ou acionar ação primária
- **Swipe horizontal** (mobile): Revelar ações de editar/excluir (futuro)
- **Long press** (mobile): Menu de contexto rápido (futuro)

---

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

| Componente | Uso no Layout | Configuração |
|------------|---------------|--------------|
| `os-button` | Ações de criar, editar | `variant="primary/secondary/ghost"`, `size="small/medium"` |
| `os-icon` | Ícones de ações, estados | `name="wallet/edit/trash/alert"` |
| `os-progress-bar` | Barra de uso do envelope | `variant="success/warning/danger"`, `showPercentage=true` |
| `os-skeleton` | Loading state | `variant="card"`, `size="md"` |
| `os-edit-button` | Editar envelope | `ariaLabel="Editar envelope X"` |
| `os-delete-button` | Excluir envelope | `ariaLabel="Excluir envelope X"` |

#### Molecules

| Componente | Uso no Layout | Configuração |
|------------|---------------|--------------|
| `os-card` | Container de cada envelope | `variant="default"`, `size="medium"`, `clickable=false` |
| `os-money-display` | Valores de gasto e limite | `size="sm/md"`, `currency="BRL"`, `autoVariant=true` |
| `os-empty-state` | Quando não há envelopes | `icon="wallet"`, `title/message/action` |
| `os-form-field` | Campos do formulário | `label`, `hint`, `error`, `required` |
| `os-alert` | Mensagens de erro/sucesso | `type="error/success/warning"` |

#### Organisms

| Componente | Uso no Layout | Configuração |
|------------|---------------|--------------|
| `os-page` | Container principal | `variant="default"`, `size="medium"` |
| `os-page-header` | Header com título e ações | `title`, `subtitle`, `actions`, `breadcrumbs` |
| `os-entity-list` | Grid de cards de envelopes | `layout="grid"`, `size="medium"` |
| `os-modal` | Modal de formulário | `maxWidth="500px"` |

#### Templates

| Componente | Uso no Layout | Configuração |
|------------|---------------|--------------|
| `os-modal-template` | Template do modal de criação/edição/deleção | `variant="compact"`, `size="small/medium"` |

### Novos Componentes (Especificação Detalhada)

#### `os-envelope-card` (Molecule)

**Propósito:**
Exibir informações de um envelope individual, incluindo nome, categoria vinculada, valor gasto vs. limite, e barra de progresso visual com indicadores de status.

**Design Specs:**

```
┌─────────────────────────────────────────────┐
│ Header                                      │
│ ┌─────────────────────────────────────────┐ │
│ │ [Nome do Envelope]           [⋮] Actions │ │
│ │ Categoria: Alimentação                   │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Progress Section                            │
│ ┌─────────────────────────────────────────┐ │
│ │ ████████████████████░░░░░░ 56%          │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Values Section                              │
│ ┌───────────────────┬─────────────────────┐ │
│ │ Gasto             │ Limite              │ │
│ │ R$ 450,00         │ R$ 800,00           │ │
│ └───────────────────┴─────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Estrutura de Estilos:**

- **Padding**: `16px` (mobile `12px`)
- **Border**: `1px solid var(--os-border-color)` - Default
- **Border-left**: `4px solid [status-color]` - Indicador visual de status
- **Border-radius**: `var(--os-radius-md)` = `8px`
- **Background**: `var(--os-color-background-primary)` = `#FFFFFF`
- **Shadow**: `var(--os-shadow-sm)` no hover

**Typography:**
- **Nome do Envelope**: `var(--os-font-size-md)` = `16px`, `var(--os-font-weight-medium)` = `500`
- **Categoria**: `var(--os-font-size-sm)` = `14px`, `var(--os-color-text-secondary)`
- **Labels (Gasto/Limite)**: `var(--os-font-size-xs)` = `12px`, `var(--os-color-text-secondary)`, uppercase
- **Valores**: via `os-money-display` com `size="sm"` ou `size="md"`
- **Percentual**: `var(--os-font-size-sm)` = `14px`, `var(--os-font-weight-bold)` = `700`

**Colors por Status:**
- **Normal (0-79%)**: `var(--os-color-success)` = `#388E3C` (verde)
- **Warning (80-99%)**: `var(--os-color-warning)` = `#F57C00` (laranja)
- **Danger (100%+)**: `var(--os-color-danger)` = `#D32F2F` (vermelho)

**States:**

| State | Aparência |
|-------|-----------|
| **Default** | Border padrão, sem shadow |
| **Hover** | `box-shadow: var(--os-shadow-sm)`, ações visíveis |
| **Focus** | `outline: 2px solid var(--os-color-primary)`, `outline-offset: 2px` |
| **Over-budget** | Border-left vermelho 4px, background sutilmente rosado `rgba(211, 47, 47, 0.04)` |
| **Near-limit** | Border-left laranja 4px |

**Responsiveness:**

| Breakpoint | Ajustes |
|------------|---------|
| Mobile | Padding 12px, progress bar full-width, valores em row único |
| Tablet | Padding 14px |
| Desktop | Padding 16px, hover effects completos |

**Accessibility:**

- **Role**: `article` (conteúdo independente)
- **ARIA**: 
  - `aria-label="Envelope [nome], [percentual]% usado, [status]"`
  - `aria-describedby` para progress bar
- **Keyboard**: 
  - `Tab` para navegar entre cards
  - `Enter/Space` para ação primária (editar)
  - Botões de ação acessíveis por Tab dentro do card

**Interface de Inputs:**

```typescript
// os-envelope-card.component.ts
envelope = input.required<EnvelopeDto>();
edit = output<EnvelopeDto>();
delete = output<EnvelopeDto>();

// Computed signals
readonly isOverBudget = computed(() => this.envelope().usagePercentage > 100);
readonly isNearLimit = computed(() => {
  const pct = this.envelope().usagePercentage;
  return pct >= 80 && pct <= 100;
});
readonly progressVariant = computed(() => {
  const pct = this.envelope().usagePercentage;
  if (pct > 100) return 'danger';
  if (pct >= 80) return 'warning';
  return 'success';
});
readonly statusLabel = computed(() => {
  if (this.isOverBudget()) return 'Limite excedido';
  if (this.isNearLimit()) return 'Próximo do limite';
  return 'Dentro do limite';
});
```

---

## 🏗️ Layout Structure

### Grid System

- **Columns**: 
  - Desktop: `repeat(auto-fill, minmax(280px, 1fr))` (3-4 colunas em 1200px)
  - Tablet: `repeat(auto-fill, minmax(240px, 1fr))` (2 colunas)
  - Mobile: `1fr` (1 coluna)
- **Gap**: 
  - Desktop: `var(--os-gap-md)` = `16px`
  - Tablet: `var(--os-gap-md)` = `16px`
  - Mobile: `var(--os-gap-sm)` = `12px`
- **Max Width**: Container padrão do `os-page` (`1200px`)

### Sections

#### Header (via `os-page-header`)

- **Components**: `os-page-header` com título, subtítulo e ações
- **Height**: Auto
- **Sticky**: Não (seguir padrão de `AccountsPage`)
- **Content**:
  - Title: "Envelopes"
  - Subtitle: "Gerencie seus limites de gastos por categoria"
  - Actions: Botão "Novo Envelope" (primary, icon="plus")

#### Main Content

- **Layout**: Flexbox column → `os-entity-list` (grid interno)
- **Padding**: Herdado de `os-page` (`24px` desktop, `16px` mobile)
- **Components**:
  - `os-alert` (se erro)
  - `os-entity-list` → `os-envelope-card[]`

### Spacing Strategy

| Elemento | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Page padding | 24px | 20px | 16px |
| Section gaps | 24px | 20px | 16px |
| Card gaps (grid) | 16px | 16px | 12px |
| Card internal padding | 16px | 14px | 12px |

### Visual Hierarchy

1. **Nível 1**: Page Header (título "Envelopes")
2. **Nível 2**: Cards de envelope (nome do envelope em destaque)
3. **Nível 3**: Progress bars (indicador visual de uso)
4. **Nível 4**: Valores monetários (gasto e limite)
5. **Nível 5**: Labels e metadados (categoria, percentual)

---

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial
  1. Header → Botão "Novo Envelope"
  2. Cards de envelope (um por um)
  3. Dentro de cada card: botão editar → botão excluir
- **Focus Management**: 
  - Focus ring visível em todos elementos interativos
  - `outline: 2px solid var(--os-color-primary)`, `outline-offset: 2px`
- **Shortcuts**: 
  - `Esc` fecha modais
  - `Enter/Space` aciona botões
- **Skip Links**: Via layout global (`os-app-shell`)

#### ARIA Implementation

**Landmarks:**
```html
<main role="main" aria-label="Gerenciamento de envelopes">
  <header role="banner"><!-- os-page-header --></header>
  <section role="region" aria-label="Lista de envelopes">
    <!-- os-entity-list com cards -->
  </section>
</main>
```

**Live Regions:**
- `aria-live="polite"` para loading states
- `aria-live="assertive"` para erros e alertas de estouro
- Status de operações CRUD anunciados via `ScreenReaderService`

**Labels e Descriptions:**
- Todos inputs com labels associados via `for/id`
- Botões com `aria-label` descritivos
- Progress bars com `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

#### Visual Accessibility

**Contraste:**
| Elemento | Foreground | Background | Ratio |
|----------|------------|------------|-------|
| Texto normal | #212121 | #FFFFFF | 16:1 ✅ |
| Texto secondary | #616161 | #FFFFFF | 7.4:1 ✅ |
| Status success | #388E3C | #FFFFFF | 5.3:1 ✅ |
| Status warning | #F57C00 | #FFFFFF | 4.5:1 ✅ |
| Status danger | #D32F2F | #FFFFFF | 5.1:1 ✅ |

**Typography:**
- Font-size mínimo: `14px` (labels), `16px` (body)
- Line-height: `1.5` para body text
- Escalável com zoom até 200%

**Motion:**
- Respeita `prefers-reduced-motion`
- Transições <= 200ms
- Progress bar sem animação se reduced-motion

#### Screen Reader Support

- **Content Structure**: 
  - H1: "Envelopes" (via page-header)
  - Cards como `article` independentes
- **Progress Bar**: Anunciado como "Uso do envelope: X% do limite"
- **Status Changes**: Anunciados automaticamente via aria-live
- **Empty State**: Mensagem clara sobre inexistência de envelopes

---

## 🎭 States and Interactions

### Global States

#### Loading
- `os-entity-list` com `isLoading=true`
- 6 skeleton cards em grid
- Texto "Carregando envelopes..."
- `aria-busy="true"`, `role="status"`

#### Empty
- `os-empty-state` com:
  - `icon="wallet"` (ou "folder_open")
  - `title="Nenhum envelope cadastrado"`
  - `message="Crie seu primeiro envelope para controlar seus gastos por categoria"`
  - Botão "Criar primeiro envelope" (se budget selecionado)

#### Error
- `os-alert` com `type="error"`
- Mensagem descritiva do erro
- Botão "Tentar Novamente"
- `role="alert"`, `aria-live="assertive"`

#### Success (após operação)
- Notificação via `NotificationService`
- Toast com mensagem de sucesso
- Auto-dismiss após 3 segundos

### Micro-interactions

| Interação | Comportamento |
|-----------|---------------|
| **Hover em card** | `box-shadow: var(--os-shadow-sm)`, elevação sutil |
| **Focus em card** | `outline: 2px solid var(--os-color-primary)` |
| **Hover em botão de ação** | Background opacity 10%, cursor pointer |
| **Click em criar** | Abre modal com foco no primeiro campo |
| **Progress bar** | Transição suave ao atualizar valor (200ms) |

### Component-Specific Interactions

#### EnvelopeCard
- **Hover**: Mostra ações (editar/excluir) se não visíveis
- **Click em editar**: Abre modal de edição preenchido
- **Click em excluir**: Abre modal de confirmação

#### EnvelopeForm (Modal)
- **Validação**: Inline em cada campo
- **Submit**: Loading state no botão, disabled nos campos
- **Sucesso**: Fecha modal, recarrega lista, toast de sucesso
- **Erro**: Mostra mensagem no modal, mantém dados

---

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────────────────┐
│ Header (sticky top bar)             │
│ ┌─────────────────────────────────┐ │
│ │ [☰] OrçaSonhos    [🔔] [👤]    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Page Header                         │
│ ┌─────────────────────────────────┐ │
│ │ Envelopes                       │ │
│ │ Limites de gastos               │ │
│ │                    [+ Novo]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Main Content (scroll)               │
│ ┌─────────────────────────────────┐ │
│ │ Envelope: Alimentação    [⋮]   │ │
│ │ Categoria: Alimentação          │ │
│ │ ███████████████████░░░░░░ 56%   │ │
│ │ Gasto: R$ 450  Limite: R$ 800   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Envelope: Transporte    [⋮] ⚠️ │ │
│ │ Categoria: Transporte           │ │
│ │ █████████████████████████ 117%  │ │
│ │ Gasto: R$ 350  Limite: R$ 300   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Envelope: Lazer         [⋮]    │ │
│ │ Categoria: Lazer                │ │
│ │ ████████░░░░░░░░░░░░░░░░ 32%    │ │
│ │ Gasto: R$ 160  Limite: R$ 500   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Anotações Mobile:**
- Stack vertical de todos cards (1 coluna)
- Touch targets >= 44px
- Sem scroll horizontal
- Botão flutuante ou no header para criar
- Menu de 3 pontos para ações do card
- Badge de alerta (⚠️) em cards over-budget

### Tablet Layout (576-991px)

```
┌───────────────────────────────────────────────┐
│ Header (sticky)                               │
│ ┌───────────────────────────────────────────┐ │
│ │ [☰] OrçaSonhos           [🔔] [👤]       │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Page Header                                   │
│ ┌───────────────────────────────────────────┐ │
│ │ Envelopes                                 │ │
│ │ Gerencie seus limites de gastos           │ │
│ │                           [+ Novo Env.]   │ │
│ └───────────────────────────────────────────┘ │
├───────────────────────────────────────────────┤
│ Main Content                                  │
│ ┌───────────────────┐ ┌───────────────────┐   │
│ │ Alimentação       │ │ Transporte    ⚠️  │   │
│ │ ██████████░░░ 56% │ │ ██████████████117%│   │
│ │ R$ 450 / R$ 800   │ │ R$ 350 / R$ 300   │   │
│ │ [✏️] [🗑️]         │ │ [✏️] [🗑️]         │   │
│ └───────────────────┘ └───────────────────┘   │
│ ┌───────────────────┐ ┌───────────────────┐   │
│ │ Lazer             │ │ Saúde             │   │
│ │ █████░░░░░░░ 32%  │ │ ███████████░ 75%  │   │
│ │ R$ 160 / R$ 500   │ │ R$ 225 / R$ 300   │   │
│ │ [✏️] [🗑️]         │ │ [✏️] [🗑️]         │   │
│ └───────────────────┘ └───────────────────┘   │
└───────────────────────────────────────────────┘
```

**Anotações Tablet:**
- Grid 2 colunas (auto-fill, minmax 240px)
- Ações de editar/excluir sempre visíveis
- Progress bar compacta

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Header (sticky)                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🐋 OrçaSonhos    Dashboard  Transações  Contas  ...    [🔔] [👤]   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├───────┬─────────────────────────────────────────────────────────────────┤
│ [S]   │ Page Header                                                     │
│ [i]   │ ┌─────────────────────────────────────────────────────────────┐ │
│ [d]   │ │ Envelopes                                                   │ │
│ [e]   │ │ Gerencie seus limites de gastos por categoria               │ │
│ [b]   │ │                                    [+ Novo Envelope]        │ │
│ [a]   │ └─────────────────────────────────────────────────────────────┘ │
│ [r]   │                                                                 │
│  📊   │ Main Content (Grid 3-4 cols)                                    │
│  💳   │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  🏦   │ │Alimentação  │ │Transporte ⚠️│ │Lazer        │ │Saúde        │ │
│  📁   │ │Alimentação  │ │Transporte   │ │Lazer        │ │Saúde        │ │
│  🎯   │ │█████░░░ 56% │ │████████ 117%│ │███░░░░ 32%  │ │██████░ 75%  │ │
│  📦   │ │450 / 800    │ │350 / 300    │ │160 / 500    │ │225 / 300    │ │
│       │ │[✏️][🗑️]     │ │[✏️][🗑️]     │ │[✏️][🗑️]     │ │[✏️][🗑️]     │ │
│       │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│       │                                                                 │
│       │ ┌─────────────┐ ┌─────────────┐                                 │
│       │ │Educação     │ │Vestuário    │                                 │
│       │ │Educação     │ │Vestuário    │                                 │
│       │ │██░░░░░ 15%  │ │████░░░ 45%  │                                 │
│       │ │75 / 500     │ │135 / 300    │                                 │
│       │ │[✏️][🗑️]     │ │[✏️][🗑️]     │                                 │
│       │ └─────────────┘ └─────────────┘                                 │
└───────┴─────────────────────────────────────────────────────────────────┘
```

**Anotações Desktop:**
- Sidebar expandida (240px)
- Grid auto-fill minmax(280px, 1fr) - até 4 colunas em widescreen
- Hover states com elevação
- Ações sempre visíveis com hover highlight
- Tooltips em elementos truncados

---

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

| Componente | Tipo | Localização | Descrição |
|------------|------|-------------|-----------|
| `EnvelopeCardComponent` | Molecule | `src/app/shared/ui-components/molecules/envelope-card/` | Card de envelope com progress bar |
| `EnvelopeFormComponent` | Organism | `src/app/features/envelopes/components/envelope-form/` | Formulário de criação/edição |
| `ConfirmDeleteEnvelopeModalComponent` | Organism | `src/app/features/envelopes/components/confirm-delete-modal/` | Modal de confirmação de exclusão |
| `EnvelopesPage` | Page | `src/app/features/envelopes/pages/envelopes/` | Página principal de listagem |

**Modificações:**

| Componente | Modificação |
|------------|-------------|
| `os-progress-bar` | Verificar se suporta `variant="danger"` (vermelho) - **já suporta** ✅ |
| `CategorySpendingWidgetComponent` | Integrar com dados de envelopes (futura fase) |

### Dependências de UI

Todas já disponíveis no projeto:
- `@angular/material` (progress-bar, form-field, dialog)
- Design tokens do sistema (`_tokens.scss`, `_variables.scss`)
- Componentes `os-*` existentes

### Impacto em Performance

- **Bundle Size**: Mínimo - reutiliza componentes existentes
- **Lazy Loading**: `EnvelopesModule` carregado sob demanda via routes
- **Critical CSS**: Inline styles apenas para above-the-fold (header + 2 cards)
- **Change Detection**: `OnPush` em todos componentes

### Integration Points

| Integração | Descrição |
|------------|-----------|
| `EnvelopeState` | Provê dados reativos para a página |
| `BudgetSelectionService` | Contexto do orçamento selecionado |
| `CategoriesApiService` | Lista de categorias para o formulário |
| `NotificationService` | Feedback de operações (toast) |

---

## 🧪 Layout Validation Criteria

### Design System Compliance
- [ ] Componentes `os-*` utilizados corretamente
- [ ] Design tokens aplicados (`--os-*`)
- [ ] Nomenclatura consistente (`os-envelope-card`)
- [ ] Tema aplicado corretamente (cores, tipografia)

### Responsiveness
- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile < 576px, tablet 576-991px, desktop >= 992px)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Grid responsivo com `auto-fill` e `minmax`

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Esc)
- [ ] ARIA attributes corretos (`role`, `aria-label`, `aria-live`)
- [ ] Screen reader friendly (anúncios de status)
- [ ] Contraste adequado (>= 4.5:1 para texto normal)
- [ ] Focus visible em elementos interativos

### Performance
- [ ] `ChangeDetectionStrategy.OnPush` em todos componentes
- [ ] Lazy loading da rota `/envelopes`
- [ ] Computed signals para derivações (progressVariant, isOverBudget)
- [ ] Track by ID em `@for` loops

### Visual Quality
- [ ] Spacing consistente (usando tokens)
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara (nome > progress > valores)
- [ ] Estados implementados (loading, error, empty, success)
- [ ] Indicadores visuais de status (verde/amarelo/vermelho)

---

## 📚 References

### Design System Documentation
- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`
- Theme: `src/app/shared/ui-components/theme/`

### Material Design Guidelines
- [Progress indicators](https://material.io/components/progress-indicators)
- [Cards](https://material.io/components/cards)
- [Data visualization colors](https://material.io/design/color/data-visualization.html)

### WCAG Guidelines
- [WCAG 2.1 - 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WCAG 2.1 - 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [WCAG 2.1 - 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)

### Código Similar no Projeto
- `src/app/features/accounts/pages/accounts/accounts.page.ts` - Estrutura de página similar
- `src/app/shared/ui-components/molecules/account-card/` - Padrão de card de entidade
- `src/app/shared/ui-components/organisms/os-entity-list/` - Grid de entidades

### Meta Specs - Contexto de Produto
- **Personas**: `personas.md` - Ana como persona primária
- **Jornada do Cliente**: `customer-journey.md` - Estágios de engajamento e adoção
- **Conceitos Centrais**: `core-concepts.md` - Definição de Envelopes
- **Funcionalidades Core**: `03_funcionalidades_core.md` - Dashboard Centrado em Progresso
- **Financial Health**: `business/financial-health.md` - Indicador "Uso de Orçamento e Envelopes"






