# Padronização de Modais e Componentes de Confirmação no Design System - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Criar uma experiência de confirmação **clara, rápida e não intrusiva** que permita ao usuário tomar decisões conscientes sobre ações importantes (exclusões, operações críticas) sem interromper significativamente o fluxo de trabalho. Para formulários, migrar para páginas dedicadas que oferecem **melhor contexto, navegação e controle** ao usuário.

### Tipo de Layout

**Fase 1:** Modal de Confirmação (Dialog Component)
**Fase 2:** Páginas de Formulário (Form Pages)

### Público-Alvo

**Universal** - Mobile-first com adaptação para tablet e desktop

### Persona Primária

**Ana - A Organizadora Familiar** (32 anos, casada, 2 filhos)

**Características da Persona:**
- Gerencia as finanças da casa e precisa de confirmações claras para ações importantes
- Organizada mas sobrecarregada - confirmações devem ser rápidas e diretas
- Usa o sistema regularmente (estágio de Adoção) - precisa de eficiência
- Prefere interfaces intuitivas que não complicam o fluxo de trabalho
- Valoriza clareza e segurança em ações que podem ter consequências (exclusões)

**Contexto de Uso:**
- Desktop/Tablet: Durante gestão de orçamentos, contas e envelopes
- Mobile: Ações rápidas de exclusão ou confirmação durante navegação

### Contexto de Uso

**Fase 1 - Modal de Confirmação:**
- Aparece como overlay sobre a interface atual
- Usado para confirmações de exclusão (envelopes, contas, cartões, categorias)
- Deve ser rápido e não bloquear o fluxo de trabalho
- Contexto: Usuário já está engajado (estágio de Adoção - D+7 a D+30)

**Fase 2 - Páginas de Formulário:**
- Páginas dedicadas com URLs próprias
- Usado para formulários complexos (criar/editar envelope, pagar fatura, transferências)
- Oferece melhor contexto e navegação
- Contexto: Operações que requerem mais atenção e podem ser interrompidas/retomadas

### Funcionalidades Core Relacionadas

**Extraídas de `03_funcionalidades_core.md`:**

1. **Sistema de Metas SMART**: Confirmações de exclusão podem impactar metas vinculadas
2. **Múltiplos Orçamentos**: Confirmações devem considerar contexto do orçamento atual
3. **Dashboard Centrado em Progresso**: Modais não devem interromper visualização de progresso
4. **Sistema Dual: Orçamentos + Contas**: Formulários de transferência/reconciliação precisam de contexto completo

### Considerações da Jornada do Usuário

**Estágio da Jornada: Adoção (D+7 a D+30)**

**Objetivos do Usuário neste Estágio:**
- Uso regular consolidado (diário/semanal)
- Eficiência nas operações rotineiras
- Confiança nas ações realizadas
- Validação rápida de decisões importantes

**Touchpoints Críticos:**
- **Confirmação de Exclusão**: Momento de verdade - usuário precisa estar seguro da decisão
- **Formulários Complexos**: Operações que podem ser interrompidas e retomadas
- **Feedback Imediato**: Confirmações devem ser claras sobre consequências

**Recovery Points:**
- Cancelamento fácil (ESC, clique fora, botão cancelar)
- Mensagens claras sobre irreversibilidade
- Opção de voltar atrás antes de confirmar

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:
  - Layout: Modal full-width com padding lateral (16px)
  - Touch targets: >= 44px para botões
  - Comportamento específico: Modal ocupa quase toda tela, botões empilhados verticalmente
  - Páginas: Stack vertical completo, formulário em coluna única

- **Tablet (576-991px)**:
  - Layout: Modal centralizado com largura máxima (400px para confirmação, 600px para formulários)
  - Navegação: Botões lado a lado quando espaço permite
  - Comportamento específico: Modal centralizado, formulários em 2 colunas quando aplicável

- **Desktop (992px+)**:
  - Layout: Modal centralizado (400px confirmação, 800px formulários)
  - Hover states: Efeitos visuais em botões e elementos interativos
  - Comportamento específico: Páginas com sidebar quando aplicável, formulários em grid

### Mobile-First Approach

**Estratégia de Progressive Enhancement:**
1. Base mobile: Modal simples, stack vertical, touch targets grandes
2. Tablet: Adiciona centralização e melhor uso de espaço
3. Desktop: Adiciona hover states e layouts mais sofisticados

### Touch Interactions

- **Tap**: Confirmação/cancelamento em botões
- **Swipe down**: Fechar modal (opcional, apenas em mobile)
- **Back button**: Navegar para página anterior (Fase 2 - páginas)

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:
  - Variant: `primary` (confirmar), `secondary` (cancelar), `danger` (exclusões críticas)
  - Size: `medium` (padrão), `small` (mobile quando necessário)
  - Usage: Botões de ação no modal e páginas

- **os-icon**:
  - Variant: `warning` (danger), `info` (info), `error` (danger)
  - Size: `lg` (ícones principais), `md` (ícones secundários)
  - Usage: Ícones de alerta e feedback visual

- **os-label**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Labels de formulários nas páginas

- **os-input**:
  - Type: `text`, `number`, `email`
  - Validation: Validação client-side para melhor UX
  - Usage: Campos de formulário nas páginas

- **os-select**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Seleção de opções em formulários

- **os-money-input**:
  - Variant: `default`
  - Usage: Campos monetários em formulários

#### Molecules

- **os-form-field**:
  - Configuration: Labels, validação, mensagens de erro
  - Usage: Wrapper de campos de formulário nas páginas

- **os-alert**:
  - Type: `warning`, `error`, `info`
  - Usage: Mensagens de aviso no modal de confirmação e erros nas páginas

- **os-card**:
  - Variant: `outlined` (modal), `elevated` (páginas)
  - Usage: Container visual para conteúdo

#### Organisms

- **os-modal**:
  - Variant: `confirmation` (modal de confirmação)
  - Size: `small` (confirmação), `medium` (formulários em modal - temporário)
  - Usage: Base para o modal de confirmação

- **os-modal-template**:
  - Variant: `compact` (confirmação)
  - Size: `small` (confirmação)
  - Usage: Template wrapper para modais (reutilizar estrutura existente)

- **os-page**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Container principal para páginas de formulário

- **os-page-header**:
  - Variant: `default`
  - Usage: Cabeçalho das páginas com título e ações

- **os-form-template**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Template para formulários nas páginas

#### Templates

- **os-form-template**:
  - Configuration: Header, actions, validation
  - Customizations: Adaptado para páginas dedicadas
  - Usage: Estrutura base para formulários migrados

- **os-page-template** (se existir):
  - Configuration: Layout de página padrão
  - Usage: Container para páginas de formulário

### Novos Componentes (Especificação Detalhada)

#### os-confirm-dialog (Organism)

**Propósito:**
Componente genérico de confirmação reutilizável para substituir modais duplicados e `confirm()` nativo.

**Design Specs:**

- **Padding**: 24px (desktop), 16px (mobile)
- **Border**: Nenhum (usa os-card internamente)
- **Border-radius**: 8px (via os-card)
- **Typography**: 
  - Título: `--os-font-size-lg` (18px), `--os-font-weight-semibold`
  - Mensagem: `--os-font-size-md` (16px), `--os-font-weight-regular`
  - Aviso: `--os-font-size-sm` (14px), `--os-font-weight-regular`
- **Colors** (por variante):
  - **danger**: 
    - Background alert: `--os-color-error-light` (rgba(244, 67, 54, 0.1))
    - Border alert: `--os-color-error` (#f44336)
    - Icon: `--os-color-error`
  - **warning**:
    - Background alert: `--os-color-warning-light` (rgba(245, 124, 0, 0.1))
    - Border alert: `--os-color-warning` (#f57c00)
    - Icon: `--os-color-warning`
  - **info**:
    - Background alert: `--os-color-info-light` (rgba(33, 150, 243, 0.1))
    - Border alert: `--os-color-info` (#2196f3)
    - Icon: `--os-color-info`

**States:**

- **Default**: Modal visível, botões habilitados
- **Loading**: Botão de confirmação com spinner (gerenciado pelo consumidor)
- **Disabled**: Botões desabilitados durante processamento

**Responsiveness:**

- Mobile: Full-width com padding 16px, botões empilhados
- Tablet: Centralizado 400px, botões lado a lado
- Desktop: Centralizado 400px, botões lado a lado com hover states

**Accessibility:**

- **Role**: `dialog`
- **ARIA**: 
  - `aria-modal="true"`
  - `aria-labelledby` (título)
  - `aria-describedby` (mensagem)
  - `aria-live="polite"` (para mudanças dinâmicas)
- **Keyboard**: 
  - `Tab`: Navegação entre botões
  - `Enter`: Confirma ação
  - `Escape`: Cancela e fecha
  - `Shift+Tab`: Navegação reversa

**Variants:**
- `danger`: Exclusões e ações irreversíveis (vermelho)
- `warning`: Ações com consequências (laranja)
- `info`: Confirmações informativas (azul)

## 🏗️ Layout Structure

### Grid System

- **Modal de Confirmação**: Não usa grid (layout simples)
- **Páginas de Formulário**: 
  - Columns: 12-col desktop, 8-col tablet, 1-col mobile
  - Gap: 24px desktop, 16px tablet, 12px mobile
  - Max Width: 800px container (formulários)

### Sections

#### Modal de Confirmação

**Header:**
- **Components**: Título do modal (h2)
- **Height**: Auto (conteúdo)
- **Padding**: 24px 24px 16px 24px

**Content:**
- **Layout**: Stack vertical
- **Padding**: 0 24px 24px 24px
- **Components**: 
  - Mensagem principal (p)
  - Alerta visual (div com background colorido)
  - Ícone de variante (os-icon)

**Footer (Actions):**
- **Components**: os-button (cancelar, confirmar)
- **Height**: Auto
- **Padding**: 16px 24px 24px 24px
- **Layout**: Flex row (desktop/tablet), column (mobile)
- **Gap**: 12px entre botões

#### Páginas de Formulário

**Header:**
- **Components**: os-page-header
- **Height**: Auto
- **Sticky**: Não (scroll natural)
- **Content**: Título, subtítulo, breadcrumbs (se aplicável)

**Main Content:**
- **Layout**: os-form-template
- **Padding**: 24px desktop, 16px mobile
- **Components**: 
  - os-form-field (campos do formulário)
  - os-alert (mensagens de erro/sucesso)
  - Validação inline

**Footer (Actions):**
- **Components**: os-button (cancelar, salvar)
- **Height**: Auto
- **Padding**: 24px
- **Layout**: Flex row, justify-end
- **Gap**: 12px

### Spacing Strategy

- **Section Gaps**: 24px desktop, 16px mobile
- **Component Gaps**: 16px desktop, 12px mobile
- **Consistent Padding**: 24px, 16px, 12px, 8px scale
- **Modal Padding**: 24px (desktop), 16px (mobile)

### Visual Hierarchy

1. **Título do Modal/Página** (H2) - Mais importante, destaque visual
2. **Mensagem de Confirmação** (P) - Conteúdo principal
3. **Alerta Visual** (Div colorida) - Destaque para variante
4. **Botões de Ação** (os-button) - Ações secundárias mas visíveis

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - título → mensagem → botão cancelar → botão confirmar
- **Focus Management**: 
  - Foco inicial no botão cancelar (mais seguro)
  - Focus trap dentro do modal
  - Foco retorna ao elemento que abriu o modal ao fechar
- **Shortcuts**: 
  - `Esc`: Fecha modal e cancela
  - `Enter`: Confirma ação (quando foco no botão confirmar)
- **Skip Links**: Não aplicável (modal é overlay)

#### ARIA Implementation

- **Landmarks**:
  - Modal: `<div role="dialog" aria-modal="true">`
  - Páginas: `<main role="main">` (via os-page)

- **Live Regions**:
  - `aria-live="polite"` para mudanças de estado
  - `aria-live="assertive"` para erros críticos

- **Labels e Descriptions**:
  - Título com `id` referenciado por `aria-labelledby`
  - Mensagem com `id` referenciado por `aria-describedby`
  - Botões com `aria-label` descritivos
  - Ícones decorativos com `aria-hidden="true"`

#### Visual Accessibility

- **Contraste**:
  - Texto normal: >= 4.5:1 (validado com tokens do design system)
  - Texto grande: >= 3:1
  - UI Components: >= 3:1
  - Botões: >= 4.5:1

- **Typography**:
  - Font-size mínimo: 16px (1rem) para body text
  - Line-height: 1.5 para legibilidade
  - Escalável com zoom até 200%

- **Motion**:
  - Respeita `prefers-reduced-motion`
  - Transições <= 300ms
  - Animações suaves de entrada/saída do modal

#### Screen Reader Support

- **Content Structure**: Headings hierárquicos (h2 para título)
- **Alt Text**: Ícones com `aria-label` descritivos
- **Form Labels**: Associação explícita com inputs (via os-form-field)
- **Error Messages**: Anunciados dinamicamente com `aria-live`

## 🎭 States and Interactions

### Global States

- **Loading**:
  - Botão de confirmação mostra spinner
  - Modal permanece aberto durante processamento
  - Botão cancelar desabilitado durante loading (opcional)

- **Empty**:
  - Não aplicável (modal sempre tem conteúdo)

- **Error**:
  - Mensagem de erro exibida via os-alert
  - `aria-live="assertive"` para anunciar erro
  - Botão de retry quando aplicável

- **Success**:
  - Modal fecha automaticamente após confirmação bem-sucedida
  - Feedback via notification service (toast)

### Micro-interactions

- **Hover**: 
  - Botões: Elevação sutil, mudança de cor
  - Cards: Sombra aumentada (páginas)
- **Focus**: 
  - Ring outline 2px solid `--os-color-primary-500`
  - Offset 2px
- **Active**: 
  - Scale down 0.98
  - Pressed state visual
- **Transitions**: 
  - 200ms ease-in-out para estados
  - 300ms ease para animações de modal

### Component-Specific Interactions

**Modal de Confirmação:**
- Entrada: Fade in + scale up (300ms)
- Saída: Fade out + scale down (300ms)
- Backdrop click: Fecha modal (configurável)
- Escape key: Fecha modal

**Páginas de Formulário:**
- Navegação: Router navigation com histórico
- Validação: Inline com feedback imediato
- Submit: Loading state no botão de salvar

## 📐 Visual Specifications

### Mobile Layout (< 576px)

**Modal de Confirmação:**
```
┌─────────────────────────┐
│ [Backdrop]              │
│                         │
│  ┌───────────────────┐  │
│  │ Título            │  │
│  │                   │  │
│  │ Mensagem          │  │
│  │ principal         │  │
│  │                   │  │
│  │ ┌───────────────┐ │  │
│  │ │ ⚠️ Alerta     │ │  │
│  │ │ Visual        │ │  │
│  │ └───────────────┘ │  │
│  │                   │  │
│  │ ┌───────────────┐ │  │
│  │ │  Cancelar     │ │  │
│  │ └───────────────┘ │  │
│  │ ┌───────────────┐ │  │
│  │ │  Confirmar    │ │  │
│  │ └───────────────┘ │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Anotações:**
- Modal ocupa ~90% da largura
- Padding lateral 16px
- Botões empilhados verticalmente
- Touch targets >= 44px

**Página de Formulário:**
```
┌─────────────────────────┐
│ Header (Título)         │
├─────────────────────────┤
│ Main Content            │
│ ┌───────────────────┐   │
│ │ Campo 1          │   │
│ └───────────────────┘   │
│ ┌───────────────────┐   │
│ │ Campo 2          │   │
│ └───────────────────┘   │
│ ┌───────────────────┐   │
│ │ Campo 3          │   │
│ └───────────────────┘   │
│                         │
│ ┌──────┐  ┌──────┐      │
│ │Cancel│  │Salvar│      │
│ └──────┘  └──────┘      │
└─────────────────────────┘
```

### Tablet Layout (576-991px)

**Modal de Confirmação:**
```
┌─────────────────────────────┐
│      [Backdrop]             │
│                             │
│    ┌─────────────────┐      │
│    │ Título          │      │
│    │                 │      │
│    │ Mensagem        │      │
│    │                 │      │
│    │ ┌─────────────┐ │      │
│    │ │ ⚠️ Alerta  │ │      │
│    │ └─────────────┘ │      │
│    │                 │      │
│    │ [Cancelar][Confirmar] │ │
│    └─────────────────┘      │
└─────────────────────────────┘
```

**Anotações:**
- Modal centralizado 400px
- Botões lado a lado
- Padding 24px

### Desktop Layout (>= 992px)

**Modal de Confirmação:**
```
┌─────────────────────────────────┐
│         [Backdrop]              │
│                                 │
│      ┌─────────────────┐        │
│      │ Título          │        │
│      │                 │        │
│      │ Mensagem        │        │
│      │                 │        │
│      │ ┌─────────────┐ │        │
│      │ │ ⚠️ Alerta  │ │        │
│      │ └─────────────┘ │        │
│      │                 │        │
│      │ [Cancelar][Confirmar] │  │
│      └─────────────────┘        │
└─────────────────────────────────┘
```

**Anotações:**
- Modal centralizado 400px
- Hover states ativos
- Transições suaves

**Página de Formulário:**
```
┌─────────────────────────────────────┐
│ Header (Título + Breadcrumbs)      │
├─────────────────────────────────────┤
│ Main Content (max-width: 800px)    │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ Campo 1    │ │ Campo 2    │    │
│ └─────────────┘ └─────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Campo 3 (full width)        │    │
│ └─────────────────────────────┘    │
│                                     │
│              [Cancelar][Salvar]     │
└─────────────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**
- `os-confirm-dialog.component.ts` - Componente de confirmação genérico
- `os-confirm-dialog.component.scss` - Estilos com variantes
- Páginas de formulário (5 novas páginas)

**Modificações:**
- `os-modal.component.ts` - Reutilizar como base (sem modificações)
- `os-modal-template.component.ts` - Reutilizar (sem modificações)
- Componentes que usam modais duplicados - Substituir por serviço

### Dependências de UI

**Nenhuma nova dependência** - Todas as bibliotecas necessárias já estão no projeto:
- Angular Material Dialog (já importado)
- Design System components (já existentes)

### Impacto em Performance

- **Bundle Size**: 
  - Modal: ~5KB (componente pequeno)
  - Páginas: ~10-15KB cada (lazy loaded)
- **Lazy Loading**: 
  - Páginas de formulário via lazy loading de rotas
  - Modal carregado sob demanda via serviço
- **Critical CSS**: 
  - Estilos do modal inline no componente
  - Estilos de páginas em arquivos separados (lazy loaded)

### Integration Points

- **ConfirmDialogService**: Integra com MatDialog para abertura programática
- **Router**: Páginas de formulário integradas com sistema de rotas
- **States**: Formulários mantêm integração com States existentes (EnvelopeState, AccountState, etc.)
- **NotificationService**: Feedback de sucesso/erro via toasts

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance
- [ ] Componentes os-* utilizados corretamente
- [ ] Design tokens aplicados (--os-*)
- [ ] Nomenclatura consistente (BEM)
- [ ] Tema aplicado corretamente

### Responsiveness
- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile, tablet, desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Modal responsivo em todas as resoluções

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Esc)
- [ ] ARIA attributes corretos (role, aria-modal, aria-labelledby, aria-describedby)
- [ ] Screen reader friendly (testado com NVDA/JAWS)
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos
- [ ] Focus trap no modal

### Performance
- [ ] OnPush change detection
- [ ] Lazy loading de páginas
- [ ] Bundle size otimizado
- [ ] Computed signals para derivações
- [ ] Sem memory leaks (unsubscribe adequado)

### Visual Quality
- [ ] Spacing consistente (24px, 16px, 12px, 8px)
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara
- [ ] Estados (loading, error, success) implementados
- [ ] Animações suaves (300ms max)
- [ ] Respeita prefers-reduced-motion

## 📚 References

### Design System Documentation
- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines
- [Dialog Component](https://material.angular.io/components/dialog)
- [Accessibility](https://material.angular.io/guide/accessibility)
- [Responsive Design](https://material.angular.io/guide/responsive-design)

### WCAG Guidelines
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [Keyboard Navigation](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [Focus Management](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)

### Código Similar no Projeto
- `src/app/shared/ui-components/organisms/os-modal/` - Base para modal
- `src/app/shared/ui-components/templates/os-modal-template/` - Template wrapper
- `src/app/features/envelopes/pages/envelopes/envelopes.page.ts` - Exemplo de página
- `src/app/features/auth/pages/register/complete-profile/complete-profile.page.ts` - Exemplo de formulário em página

### Meta Specs - Contexto de Produto
- **Personas**: `personas.md` - Perfis de usuário e necessidades específicas (Ana identificada como persona primária)
- **Jornada do Cliente**: `customer-journey.md` - Touchpoints e estágios de engajamento (Estágio de Adoção identificado)
- **Conceitos Centrais**: `core-concepts.md` - Domínio financeiro e regras de negócio
- **Funcionalidades Core**: `03_funcionalidades_core.md` - Diferenciação e valor único (4 funcionalidades core mapeadas)


