# Compartilhamento Familiar - Colaboração - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

O layout deve comunicar **simplicidade, colaboração e confiança**. A interface deve transmitir que compartilhar um orçamento é um processo direto e sem complicações, alinhado com o conceito de "Compartilhamento Simplificado" do OrçaSonhos. A experiência visual deve ser **acolhedora e familiar**, refletindo o contexto de uso colaborativo entre membros da família.

### Tipo de Layout

**Modal + Dashboard + Form**

- **ShareBudgetComponent**: Modal para adicionar participantes
- **UserInviteComponent**: Form de busca e seleção de usuários (dentro do modal)
- **CollaborationDashboardComponent**: Dashboard de visualização de participantes (seção na BudgetDetailPage)

### Público-Alvo

**Mobile-first | Universal**

A funcionalidade deve funcionar perfeitamente em dispositivos móveis (onde Ana provavelmente usa mais) e desktop, garantindo que o compartilhamento seja acessível em qualquer contexto.

### Persona Primária

**Ana - A Organizadora Familiar** (32 anos, casada, 2 filhos)

**Características da Persona:**

- Gerencia as finanças da casa e quer envolver o marido no controle
- Valoriza compartilhamento e colaboração familiar
- Precisa de simplicidade e clareza
- Não quer processos complexos de convite/aprovação
- Organizada mas sobrecarregada
- Usa principalmente mobile para interações rápidas
- Nível de sofisticação: Intermediário (não é iniciante, mas não é power user)
- Dores específicas: Dificuldade para o marido participar do controle, falta clareza sobre colaboração
- Objetivos: Ter controle compartilhado com o marido, organizar múltiplos objetivos familiares

### Contexto de Uso

A funcionalidade será utilizada na **BudgetDetailPage**, onde Ana visualiza os detalhes de um orçamento compartilhado ou deseja transformar um orçamento pessoal em compartilhado. O fluxo principal é:

1. Ana está na página de detalhes do orçamento
2. Clica em "Gerenciar Participantes" (botão na seção de colaboração)
3. Modal abre com busca de usuários e lista de participantes atuais
4. Ana busca o marido por email/telefone
5. Seleciona e adiciona
6. Marido recebe acesso imediato

### Funcionalidades Core Relacionadas

**Extraídas dinamicamente de 03_funcionalidades_core.md:**

1. **Compartilhamento Familiar Simplificado** (Funcionalidade Core #3)
   - Adição direta de usuários (sem convites ou aprovações)
   - Acesso total para todos os participantes
   - Sincronização em tempo real
   - Remoção simples de participantes

2. **Múltiplos Orçamentos** (Funcionalidade Core #2)
   - Orçamentos compartilhados vs pessoais
   - Alternância entre contextos
   - Separação visual clara

### Considerações da Jornada do Usuário

**Estágio da Jornada: Adoção (D+7 a D+30)**

Ana já está usando o OrçaSonhos regularmente e consolidou seu uso. Agora quer evoluir para o compartilhamento familiar.

**Objetivos do Usuário neste Estágio:**

- Envolver a família no controle financeiro
- Ter colaboração real e prática
- Ver valor imediato no compartilhamento
- Estabelecer rotina de uso colaborativo

**Valor Percebido Esperado:**

- Simplicidade: Adicionar marido deve ser rápido (< 1 minuto)
- Clareza: Ver quem está participando e o que cada um pode fazer
- Confiança: Sincronização em tempo real funciona perfeitamente
- Controle: Poder remover participantes se necessário

**Friction Points a Evitar:**

- Processos complexos de convite/aprovação
- Falta de clareza sobre permissões
- Dificuldade para encontrar usuários
- Feedback lento ou ausente

**Touchpoints Críticos:**

- **Momento de Verdade**: Primeira vez que Ana adiciona o marido ao orçamento
- **Recovery Points**: Se a busca não encontrar o usuário, oferecer alternativas claras
- **Transições entre Estágios**: De uso individual para colaborativo deve ser fluida

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:
  - Layout: Stack vertical, single column
  - Touch targets: >= 44px (WCAG 2.1 AA)
  - Modal: Full screen ou quase full screen
  - Busca: Input full width
  - Lista de participantes: Cards empilhados verticalmente
  - Comportamento específico: Botões de ação em stack vertical, sem hover states

- **Tablet (576-991px)**:
  - Layout: 2 columns grid quando possível
  - Modal: 80% da largura, centralizado
  - Busca: Input full width com sugestões dropdown
  - Lista de participantes: Grid 2 colunas
  - Navegação: Touch targets mantidos, hover states ativos
  - Comportamento específico: Melhor aproveitamento do espaço horizontal

- **Desktop (992px+)**:
  - Layout: Grid completo, modal centralizado
  - Modal: Max-width 600px, centralizado
  - Busca: Input com sugestões dropdown expandido
  - Lista de participantes: Grid 3 colunas ou lista com mais informações
  - Hover states: Ativos em todos elementos interativos
  - Comportamento específico: Keyboard navigation completa, shortcuts (Esc para fechar)

### Mobile-First Approach

**Estratégia de Progressive Enhancement:**

1. **Base Mobile**: Funcionalidade completa e usável em mobile
2. **Tablet Enhancement**: Melhor aproveitamento de espaço, grid 2 colunas
3. **Desktop Enhancement**: Hover states, keyboard navigation avançada, mais informações visíveis

### Touch Interactions

- **Tap**: Seleção de usuário, adicionar participante, remover participante
- **Swipe**: (Futuro) Swipe para remover participante em mobile
- **Long Press**: (Futuro) Menu contextual em mobile
- **Pull to Refresh**: (Futuro) Atualizar lista de participantes

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:
  - Variant: `primary` (adicionar), `secondary` (cancelar), `danger` (remover)
  - Size: `small` (ações secundárias), `medium` (ações principais)
  - Usage: Botões de ação no modal, botões de remoção, botão "Gerenciar Participantes"

- **os-input**:
  - Type: `text` (busca de email/telefone)
  - Validation: Validação de email/telefone no backend
  - Usage: Campo de busca no UserInviteComponent

- **os-icon**:
  - Icons: `users` (participantes), `add` (adicionar), `remove` (remover), `search` (busca), `mail` (email), `phone` (telefone)
  - Usage: Ícones decorativos e informativos

- **os-label**:
  - Variant: `default`
  - Size: `medium`
  - Usage: Labels de formulário

- **os-badge**:
  - Variant: `info` (criador), `success` (participante ativo)
  - Usage: Indicar status de participante (criador vs participante)

#### Molecules

- **os-search-box**:
  - Configuration: `showSuggestions: true`, `debounceTime: 300ms`, `maxSuggestions: 5`
  - Usage: Busca de usuários no UserInviteComponent
  - Variant: `default`
  - Size: `medium`

- **os-card**:
  - Variant: `default` (participantes), `outlined` (seleção de usuário)
  - Size: `medium`
  - Usage: Cards de participantes no CollaborationDashboardComponent, cards de resultados de busca

- **os-form-field**:
  - Configuration: Label, input, error message
  - Usage: Campo de busca com validação

#### Organisms

- **os-modal** (via os-modal-template):
  - Variant: `default`
  - Size: `medium` (mobile), `large` (desktop)
  - Usage: Container principal do ShareBudgetComponent

#### Templates

- **os-modal-template**:
  - Configuration: Título "Gerenciar Participantes", botões Cancelar/Confirmar
  - Customizations: Conteúdo customizado com busca e lista
  - Usage: Template base do ShareBudgetComponent

### Novos Componentes (Especificação Detalhada)

#### UserInviteComponent (Molecule)

**Propósito:**
Componente de busca e seleção de usuários para adicionar ao orçamento. Deve ser simples, rápido e claro.

**Design Specs:**

- **Padding**: 16px horizontal, 12px vertical
- **Border**: 1px solid `--os-color-border` (quando focado)
- **Border-radius**: 8px
- **Typography**: `--os-font-size-md` (16px), `--os-font-weight-regular`
- **Colors**:
  - Background: `--os-color-background-primary`
  - Text: `--os-color-text-primary`
  - Border: `--os-color-border`
  - Focus: `--os-color-primary` (2px solid ring)
  - Placeholder: `--os-color-text-secondary`

**States:**

- **Default**: Input de busca com placeholder "Buscar por email ou telefone"
- **Focused**: Border azul, ring de foco visível
- **Loading**: Spinner ao lado do input, desabilitado
- **Error**: Mensagem de erro abaixo do input (vermelho)
- **Success**: Feedback visual quando usuário é encontrado (verde)

**Responsiveness:**

- Mobile: Input full width, sugestões dropdown full width
- Tablet: Input full width, sugestões dropdown com max-width
- Desktop: Input full width, sugestões dropdown expandido

**Accessibility:**

- **Role**: `combobox` (busca com sugestões)
- **ARIA**: 
  - `aria-label`: "Buscar usuário por email ou telefone"
  - `aria-expanded`: true/false baseado em sugestões visíveis
  - `aria-controls`: ID da lista de sugestões
  - `aria-activedescendant`: ID da sugestão ativa
- **Keyboard**: 
  - Tab: Foca no input
  - ArrowDown/ArrowUp: Navega sugestões
  - Enter: Seleciona sugestão ativa
  - Escape: Fecha sugestões

**Variants:**
- `default`: Busca padrão
- `compact`: Versão menor para espaços reduzidos

#### ShareBudgetComponent (Organism - Modal)

**Propósito:**
Modal completo para gerenciar participantes do orçamento. Integra busca (UserInviteComponent) e visualização (CollaborationDashboardComponent).

**Design Specs:**

- **Padding**: 24px (desktop), 16px (mobile)
- **Max-width**: 600px (desktop), 100% (mobile)
- **Border-radius**: 12px
- **Background**: `--os-color-background-primary`
- **Shadow**: Elevação média para modal

**Sections:**

1. **Header**: Título "Gerenciar Participantes", subtítulo com nome do orçamento
2. **Search Section**: UserInviteComponent integrado
3. **Participants List**: CollaborationDashboardComponent integrado
4. **Actions**: Botões Cancelar/Confirmar (se necessário)

**States:**

- **Loading**: Overlay com spinner ao adicionar/remover participante
- **Error**: Toast/mensagem de erro no topo do modal
- **Success**: Feedback visual quando participante é adicionado

**Responsiveness:**

- Mobile: Modal quase full screen, padding reduzido
- Tablet: Modal 80% width, padding médio
- Desktop: Modal centralizado, max-width 600px

**Accessibility:**

- **Role**: `dialog`
- **ARIA**: 
  - `aria-labelledby`: ID do título
  - `aria-describedby`: ID da descrição
  - `aria-modal`: true
- **Keyboard**: 
  - Tab: Navega entre elementos focáveis
  - Escape: Fecha modal
  - Enter: Confirma ação (se aplicável)

#### CollaborationDashboardComponent (Organism)

**Propósito:**
Dashboard para visualizar todos os participantes do orçamento com informações relevantes e ações de remoção.

**Design Specs:**

- **Padding**: 16px
- **Background**: `--os-color-background-secondary`
- **Border-radius**: 8px
- **Gap**: 12px entre cards

**Layout:**

- **Header Section**: Título "Participantes" + contador
- **Participants Grid**: Grid responsivo de cards de participantes
- **Empty State**: Mensagem quando não há participantes (exceto criador)

**Participant Card:**

- **Padding**: 16px
- **Border**: 1px solid `--os-color-border`
- **Border-radius**: 8px
- **Background**: `--os-color-background-primary`
- **Layout**: Flex horizontal
  - Avatar/Inicial (esquerda)
  - Nome e email (centro, flex: 1)
  - Badge "Criador" (se aplicável)
  - Botão remover (direita, se não for criador)

**States:**

- **Default**: Card normal
- **Hover**: Elevação sutil, cursor pointer
- **Loading**: Spinner no lugar do botão remover
- **Disabled**: Opacidade reduzida (criador não pode ser removido)

**Responsiveness:**

- Mobile: Cards empilhados verticalmente, full width
- Tablet: Grid 2 colunas
- Desktop: Grid 3 colunas ou lista horizontal

**Accessibility:**

- **Role**: `list` (lista de participantes)
- **ARIA**: 
  - `aria-label`: "Lista de participantes do orçamento"
  - Cada card: `role="listitem"`
  - Botão remover: `aria-label`: "Remover [nome do participante]"
- **Keyboard**: 
  - Tab: Navega entre cards e botões
  - Enter/Space: Ativa botão remover

## 🏗️ Layout Structure

### Grid System

- **Columns**: 12-col desktop, 8-col tablet, 1-col mobile
- **Gap**: 16px desktop, 12px tablet, 8px mobile
- **Max Width**: 600px para modal (desktop)

### Sections

#### ShareBudgetComponent (Modal)

**Header:**
- **Components**: Título + subtítulo (nome do orçamento)
- **Height**: Auto (conteúdo)
- **Padding**: 24px (desktop), 16px (mobile)

**Search Section:**
- **Components**: UserInviteComponent
- **Padding**: 16px (desktop), 12px (mobile)
- **Margin-bottom**: 24px

**Participants List:**
- **Components**: CollaborationDashboardComponent
- **Padding**: 16px (desktop), 12px (mobile)
- **Max-height**: 400px (scroll se necessário)

**Actions:**
- **Components**: os-button (Cancelar, Confirmar se necessário)
- **Height**: 56px (desktop), 48px (mobile)
- **Padding**: 16px
- **Border-top**: 1px solid `--os-color-border`

#### CollaborationDashboardComponent (Dashboard)

**Header:**
- **Components**: Título "Participantes" + badge com contador
- **Height**: Auto
- **Padding**: 16px bottom

**Participants Grid:**
- **Layout**: Grid responsivo
- **Gap**: 12px
- **Padding**: 0

**Empty State:**
- **Components**: Ícone + mensagem + CTA (se aplicável)
- **Padding**: 32px
- **Text-align**: Center

### Spacing Strategy

- **Section Gaps**: 24px desktop, 16px tablet, 12px mobile
- **Component Gaps**: 16px desktop, 12px tablet, 8px mobile
- **Consistent Padding**: 24px, 16px, 12px, 8px scale

### Visual Hierarchy

1. **Título do Modal** - H2, maior destaque
2. **Campo de Busca** - Destaque visual, foco imediato
3. **Lista de Participantes** - Cards com informações claras
4. **Ações** - Botões secundários no footer

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial - busca → lista de participantes → botões de ação
- **Focus Management**: 
  - Focus trap dentro do modal
  - Focus retorna ao botão que abriu o modal ao fechar
  - Focus visível em todos elementos interativos (2px solid ring)
- **Shortcuts**: 
  - `Esc`: Fecha modal
  - `Enter`: Seleciona sugestão ativa na busca
  - `ArrowDown/ArrowUp`: Navega sugestões
- **Skip Links**: Não necessário (modal já é foco isolado)

#### ARIA Implementation

- **Landmarks**:
  - Modal: `role="dialog"`, `aria-modal="true"`
  - Lista de participantes: `role="list"`
  - Cards: `role="listitem"`

- **Live Regions**:
  - `aria-live="polite"`: Notificações de sucesso (participante adicionado)
  - `aria-live="assertive"`: Erros críticos (falha ao adicionar)

- **Labels e Descriptions**:
  - Input de busca: `aria-label="Buscar usuário por email ou telefone"`
  - Botão remover: `aria-label="Remover [nome do participante]"`
  - Botão adicionar: `aria-label="Adicionar [nome do usuário] ao orçamento"`
  - Ícones decorativos: `aria-hidden="true"`

#### Visual Accessibility

- **Contraste**:
  - Texto normal: >= 4.5:1 (verificado com tokens do design system)
  - Texto grande: >= 3:1
  - UI Components: >= 3:1

- **Typography**:
  - Font-size mínimo: 16px (1rem) - input de busca
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200%

- **Motion**:
  - Respeita `prefers-reduced-motion`
  - Transições <= 300ms
  - Sem animações desnecessárias

#### Screen Reader Support

- **Content Structure**: Headings hierárquicos (h2 no modal, h3 nos cards)
- **Alt Text**: Não aplicável (sem imagens)
- **Form Labels**: Associação explícita com inputs
- **Error Messages**: Anunciados dinamicamente via `aria-live="assertive"`
- **Success Messages**: Anunciados via `aria-live="polite"`

## 🎭 States and Interactions

### Global States

- **Loading**:
  - Spinner no botão "Adicionar" durante busca
  - Spinner no botão "Remover" durante remoção
  - Overlay no modal durante operações assíncronas

- **Empty**:
  - **Busca vazia**: Placeholder "Buscar por email ou telefone"
  - **Sem resultados**: Mensagem "Nenhum usuário encontrado"
  - **Sem participantes**: Mensagem "Nenhum participante adicionado ainda" + CTA para adicionar

- **Error**:
  - **Busca falhou**: Mensagem abaixo do input "Erro ao buscar usuários. Tente novamente."
  - **Adicionar falhou**: Toast/mensagem no topo do modal
  - **Remover falhou**: Toast/mensagem no topo do modal
  - **Usuário já participante**: Mensagem "Este usuário já é participante"

- **Success**:
  - **Participante adicionado**: 
    - Feedback visual (card aparece na lista)
    - Mensagem de sucesso (toast ou inline)
    - Input de busca limpo
  - **Participante removido**: 
    - Card removido da lista
    - Mensagem de sucesso (toast)

### Micro-interactions

- **Hover**: 
  - Cards de participantes: Elevação sutil (shadow)
  - Botões: Mudança de cor de fundo
  - Sugestões de busca: Background highlight

- **Focus**: 
  - Input: Ring azul 2px solid
  - Botões: Ring azul 2px solid
  - Cards: Outline azul (se clicáveis)

- **Active**: 
  - Botões: Scale down (0.98)
  - Cards: Scale down (se clicáveis)

- **Transitions**: 
  - 200ms ease-in-out para estados
  - 300ms para animações de entrada/saída

### Component-Specific Interactions

**UserInviteComponent:**
- Digitação → Debounce 300ms → Busca → Sugestões aparecem
- Seleção de sugestão → Input preenchido → Botão "Adicionar" habilitado
- Enter na busca → Seleciona primeira sugestão ou busca novamente

**CollaborationDashboardComponent:**
- Hover no card → Botão remover aparece (desktop)
- Click no botão remover → Modal de confirmação (se necessário) → Remoção
- Loading durante remoção → Spinner no botão

**ShareBudgetComponent:**
- Abertura do modal → Focus no input de busca
- Fechamento → Focus retorna ao botão "Gerenciar Participantes"
- Escape → Fecha modal

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────┐
│ Modal (quase full)      │
│ ┌─────────────────────┐ │
│ │ Gerenciar Partici-  │ │
│ │ pantes              │ │
│ │ Orçamento: Casa     │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [Buscar usuário...] │ │
│ │ (os-search-box)     │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Participantes (2)   │ │
│ │ ┌─────────────────┐ │ │
│ │ │ 👤 Ana Silva    │ │ │
│ │ │   Criador       │ │ │
│ │ └─────────────────┘ │ │
│ │ ┌─────────────────┐ │ │
│ │ │ 👤 João Silva   │ │ │
│ │ │   [Remover]     │ │ │
│ │ └─────────────────┘ │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [Cancelar] [Adicionar]│ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Anotações:**
- Modal quase full screen (padding mínimo)
- Stack vertical de todos elementos
- Touch targets >= 44px
- Sem scroll horizontal
- Botões de ação em stack vertical

### Tablet Layout (576-991px)

```
┌───────────────────────────────────┐
│ Modal (80% width, centralizado)   │
│ ┌───────────────────────────────┐ │
│ │ Gerenciar Participantes       │ │
│ │ Orçamento: Casa               │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ [Buscar usuário por email...] │ │
│ │ (os-search-box full width)     │ │
│ └───────────────────────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ 👤 Ana      │ │ 👤 João     │ │
│ │   Criador   │ │   [Remover] │ │
│ └─────────────┘ └─────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ [Cancelar]    [Adicionar]     │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

**Anotações:**
- Modal 80% width, centralizado
- Grid 2 colunas para participantes
- Busca full width
- Botões de ação em linha horizontal

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────────┐
│ Modal (max-width 600px, centralizado)       │
│ ┌─────────────────────────────────────────┐ │
│ │ Gerenciar Participantes                 │ │
│ │ Orçamento: Casa                          │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ [Buscar usuário por email ou telefone...]│ │
│ │ (os-search-box com dropdown expandido)   │ │
│ └─────────────────────────────────────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ 👤 Ana   │ │ 👤 João   │ │ 👤 Maria  │   │
│ │ Criador  │ │ [Remover] │ │ [Remover] │   │
│ └──────────┘ └──────────┘ └──────────┘   │
│ ┌─────────────────────────────────────────┐ │
│ │ [Cancelar]              [Adicionar]     │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Anotações:**
- Modal max-width 600px, centralizado
- Grid 3 colunas para participantes (ou lista horizontal)
- Hover states ativos
- Keyboard navigation completa
- Sugestões de busca com mais informações

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**
- `UserInviteComponent` (Molecule) - `src/app/features/budget/components/user-invite/`
- `ShareBudgetComponent` (Organism) - `src/app/features/budget/components/share-budget/`
- `CollaborationDashboardComponent` (Organism) - `src/app/features/budget/components/collaboration-dashboard/`

**Modificações:**
- `BudgetDetailPage` - Adicionar seção de colaboração com botão "Gerenciar Participantes"

### Dependências de UI

Nenhuma nova dependência externa. Todas as dependências já existem:
- Angular Material (já configurado)
- Design System OrçaSonhos (componentes os-*)

### Impacto em Performance

- **Bundle Size**: 
  - Estimativa: +15KB (3 componentes novos)
  - Mitigação: Lazy loading dos componentes de compartilhamento
- **Lazy Loading**: 
  - Componentes de compartilhamento devem ser lazy loaded
  - Modal só carrega quando aberto
- **Critical CSS**: 
  - Estilos do modal e busca são críticos para first paint
  - Resto pode ser carregado sob demanda

### Integration Points

- **SharingService**: Comunicação com API para buscar/adicionar/remover participantes
- **SharingState**: Estado reativo com signals para lista de participantes
- **BudgetState**: Atualização quando participantes mudam
- **AuthService**: Identificação do usuário atual (para validar se é criador)

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance
- [ ] Componentes os-* utilizados corretamente
- [ ] Design tokens aplicados (--os-*)
- [ ] Nomenclatura consistente
- [ ] Tema aplicado corretamente

### Responsiveness
- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile, tablet, desktop)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Modal responsivo (full screen mobile, centralizado desktop)

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa
- [ ] ARIA attributes corretos
- [ ] Screen reader friendly
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos
- [ ] Focus trap no modal

### Performance
- [ ] OnPush change detection
- [ ] Lazy loading onde aplicável
- [ ] Bundle size otimizado
- [ ] Computed signals para derivações
- [ ] Debounce na busca (300ms)

### Visual Quality
- [ ] Spacing consistente
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara
- [ ] Estados (loading, error, empty, success) implementados
- [ ] Transições suaves (200-300ms)

### Funcionalidade
- [ ] Busca de usuários funciona (email/telefone)
- [ ] Adição de participante funciona
- [ ] Remoção de participante funciona (exceto criador)
- [ ] Validações implementadas (usuário já participante, etc.)
- [ ] Feedback visual em todas ações
- [ ] Sincronização em tempo real (polling)

## 📚 References

### Design System Documentation
- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines
- [Material Design - Dialogs](https://material.io/components/dialogs)
- [Material Design - Text Fields](https://material.io/components/text-fields)
- [Material Design - Lists](https://material.io/components/lists)

### WCAG Guidelines
- [WCAG 2.1 - Keyboard Accessible](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [WCAG 2.1 - Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [WCAG 2.1 - Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Código Similar no Projeto
- `src/app/features/budget/pages/budget-detail/budget-detail.page.ts` - Página base onde será integrado
- `src/app/shared/ui-components/templates/os-modal-template/os-modal-template.component.ts` - Template de modal
- `src/app/shared/ui-components/molecules/os-search-box/os-search-box.component.ts` - Componente de busca
- `src/app/features/credit-cards/components/credit-card-form/credit-card-form.component.ts` - Exemplo de form em modal

### Meta Specs - Contexto de Produto
- **Personas**: `personas.md` - Ana, a Organizadora Familiar
- **Jornada do Cliente**: `customer-journey.md` - Estágio de Adoção
- **Conceitos Centrais**: `core-concepts.md` - Compartilhamento Simplificado
- **Funcionalidades Core**: `03_funcionalidades_core.md` - Compartilhamento Familiar Simplificado (#3)



