# Registro de Usuários com Google OAuth - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

Criar uma experiência de registro simples, confiável e acessível que comunique **confiança e simplicidade**. O layout deve guiar novos usuários através do processo de autenticação Google de forma intuitiva, minimizando fricção e maximizando a taxa de conversão. A página de completar perfil deve ser rápida e não intrusiva, permitindo que o usuário confirme/edite seu nome e prossiga rapidamente para o dashboard.

### Tipo de Layout

**Form** - Páginas de autenticação e onboarding com foco em formulários simples e ações claras

### Público-Alvo

**Mobile-first Universal** - Otimizado para todas as personas, com foco especial em iniciantes (Carlos) que estão tendo seu primeiro contato com controle financeiro

### Persona Primária

**Carlos - O Jovem Planejador** (26 anos, solteiro, primeiro emprego, renda R$ 4.500/mês)

**Características da Persona:**

- Primeiro emprego formal estável
- Não usa nenhuma ferramenta de controle financeiro atualmente
- Quer aprender a se organizar financeiramente
- Motivado mas sem disciplina financeira
- Precisa de orientação e simplicidade
- Usa principalmente mobile para acesso rápido

**Necessidades de Interface:**

- Interface muito simples e intuitiva
- Processo rápido e sem complicações
- Feedback claro sobre o que está acontecendo
- Onboarding educativo mas não intrusivo
- Botões grandes e fáceis de tocar
- Mensagens claras e diretas

**Dores Específicas:**

- Frustração com processos complexos de cadastro
- Medo de cometer erros
- Ansiedade com ferramentas financeiras
- Falta de confiança em apps financeiros

**Objetivos:**

- Começar a usar o OrçaSonhos rapidamente
- Entender o que está acontecendo em cada etapa
- Sentir-se confiante no processo
- Aprender conceitos básicos de forma prática

### Contexto de Uso

**Estágio da Jornada: Primeiro Uso**

Interface de entrada para novos usuários do OrçaSonhos. Esta é a primeira interação do usuário com a plataforma e deve criar uma impressão positiva, comunicando simplicidade, confiança e valor imediato.

**Objetivos do Usuário neste Estágio:**

- Cadastrar-se rapidamente (< 2 minutos)
- Entender o que está acontecendo em cada etapa
- Sentir-se confiante no processo de autenticação
- Completar o perfil sem fricção
- Acessar o dashboard rapidamente

**Touchpoints Críticos:**

- **Primeiro login**: Interface deve impressionar positivamente
- **Botão Google**: Deve ser claro e confiável
- **Redirecionamento**: Feedback durante o processo de autenticação
- **Completar perfil**: Processo rápido e não intrusivo
- **Primeira meta**: Deve ser inspiradora e realizável (próximo passo após registro)

**Recovery Points:**

- Mensagens de erro claras e acionáveis
- Estados de loading visíveis
- Possibilidade de tentar novamente facilmente
- Link para login caso já tenha conta

### Funcionalidades Core Relacionadas

- **Onboarding Orientado a Objetivos**: Primeiro contato motivador que prepara para criação da primeira meta
- **Autenticação Simplificada**: Google OAuth como método principal de entrada
- **Compartilhamento Familiar**: Preparação para futura colaboração (Ana, Roberto & Maria)
- **Múltiplos Orçamentos**: Base para futura criação de contextos financeiros

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:

  - Layout: Stack vertical, single column
  - Touch targets: >= 44px (ideal: 48px)
  - Botão Google: Full width
  - Card de formulário: Padding reduzido (16px)
  - Altura mínima: 100dvh (dynamic viewport height)
  - Comportamento específico:
    - Botão Google ocupa toda largura disponível
    - Espaçamento reduzido entre elementos
    - Texto centralizado para melhor legibilidade
    - Formulário de nome em single column

- **Tablet (576-991px)**:

  - Layout: Card centralizado com largura máxima (600px)
  - Botão Google: Largura fixa (400px) centralizado
  - Padding aumentado (24px)
  - Comportamento específico:
    - Card com sombra mais pronunciada
    - Espaçamento generoso entre elementos
    - Formulário de nome em single column

- **Desktop (992px+)**:
  - Layout: Card centralizado com largura máxima (500px)
  - Botão Google: Largura fixa (350px) centralizado
  - Padding: 32px
  - Hover states: Efeitos sutis em botões e links
  - Comportamento específico:
    - Card elevado com sombra
    - Espaçamento otimizado para leitura
    - Formulário de nome em single column

### Mobile-First Approach

- Design iniciado para mobile e aprimorado progressivamente
- Conteúdo essencial acima da dobra
- Botões grandes e fáceis de tocar
- Texto legível sem zoom
- Feedback visual claro em todas as interações

### Touch Interactions

- **Tap**: Botão Google com área de toque >= 44px
- **Swipe**: Não aplicável (páginas simples)
- **Long Press**: Não aplicável
- **Feedback Visual**: Ripple effect no botão Google (Material Design)

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: `primary` para botão Google, `secondary` para link de login
  - Size: `large` para botão Google (mobile), `medium` para desktop
  - Usage: Botão "Entrar com Google" e link "Já tem conta? Faça login"
  - Loading state: Spinner integrado durante autenticação

- **os-input**:

  - Type: `text` para campo de nome
  - Size: `medium`
  - Usage: Campo "Nome completo" na página de completar perfil
  - Validation: Integrada com reactive forms
  - Clearable: Não necessário (campo simples)

- **os-label**:

  - Size: `medium`
  - Variant: `default`
  - Usage: Label do campo de nome
  - Required indicator: Asterisco para campo obrigatório

- **os-icon**:

  - Name: `google` para ícone do Google (se disponível), ou ícone genérico
  - Size: `medium`
  - Usage: Ícone no botão Google e ícones decorativos

- **os-spinner**:

  - Size: `small` (dentro do botão durante loading)
  - Usage: Estados de loading durante autenticação

- **os-alert**:
  - Variant: `error` para mensagens de erro
  - Usage: Exibir erros de autenticação ou validação

#### Molecules

- **os-form-field**:

  - Configuration: Label "Nome completo", placeholder "Digite seu nome", required, validação 2-100 caracteres
  - Usage: Campo de nome na página de completar perfil
  - Error handling: Mensagens de erro integradas
  - Helper text: "Mínimo 2 caracteres, máximo 100 caracteres"

- **os-card**:
  - Variant: `default` ou `elevated`
  - Size: `medium`
  - Usage: Container para conteúdo das páginas de registro e completar perfil

#### Organisms

- **os-page-header**:
  - Variant: `compact` para páginas de autenticação
  - Usage: Título e subtítulo das páginas (opcional, pode ser substituído por conteúdo inline)

#### Templates

- **os-form-template**:
  - Configuration:
    - Size: `small` (páginas compactas)
    - Variant: `compact` (menos padding)
    - Show header: `true` (título e subtítulo)
    - Show progress: `false` (não aplicável)
    - Show actions: `true` (botão continuar)
  - Customizations:
    - Card centralizado verticalmente e horizontalmente
    - Largura máxima: 500px desktop, 600px tablet, 100% mobile
    - Background: Gradiente sutil ou cor sólida do tema
  - Usage: Estrutura base para ambas as páginas (registro e completar perfil)

### Novos Componentes (Especificação Detalhada)

#### Google Sign-In Button (Molecule)

**Propósito:**
Botão especializado para autenticação Google com ícone, texto e estados visuais específicos

**Design Specs:**

- **Padding**: 16px horizontal, 14px vertical
- **Border**: 1px solid --os-color-border (ou sem borda se variant primary)
- **Border-radius**: 8px
- **Typography**: --os-font-size-md, --os-font-weight-medium
- **Colors**:
  - Background: --os-color-primary-500 (ou cor do Google: #4285F4)
  - Text: white
  - Hover: Background +10% opacity ou --os-color-primary-600
  - Focus: 2px solid ring --os-color-primary-300
- **Min-height**: 48px (mobile), 44px (desktop)
- **Width**: 100% mobile, 350-400px desktop (centralizado)

**States:**

- **Default**: Cor sólida, ícone Google visível, texto "Entrar com Google"
- **Hover**: Background escurecido, cursor pointer, elevação sutil
- **Focus**: Ring outline 2px, background mantido
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Loading**: Spinner substitui ícone, texto mantido, disabled state

**Responsiveness:**

- Mobile: Full width, padding aumentado (16px vertical)
- Tablet: Largura fixa 400px, centralizado
- Desktop: Largura fixa 350px, centralizado

**Accessibility:**

- **Role**: `button`
- **ARIA**:
  - `aria-label`: "Entrar com Google"
  - `aria-busy`: true durante loading
- **Keyboard**: Tab, Enter/Space para ativar
- **Screen Reader**: Anuncia "Entrar com Google, botão" e "Carregando" durante loading

**Variants:**

- `primary`: Cor do Google (#4285F4) ou cor primária do tema
- `outlined`: Borda, background transparente (alternativa futura)

**Implementação:**

Pode ser criado como componente específico ou usar `os-button` com customizações via CSS. Recomendação: usar `os-button` com variant customizado e ícone Google.

## 🏗️ Layout Structure

### Grid System

- **Columns**:
  - Desktop: Single column (card centralizado)
  - Tablet: Single column (card centralizado)
  - Mobile: Single column (full width)
- **Gap**:
  - Desktop: 24px entre elementos
  - Tablet: 20px entre elementos
  - Mobile: 16px entre elementos
- **Max Width**:
  - Desktop: 500px (card)
  - Tablet: 600px (card)
  - Mobile: 100% (sem max-width)

### Sections

#### Página de Registro (`/register`)

**Layout Geral:**

```
┌─────────────────────────────────┐
│         (Espaço superior)        │
│                                  │
│  ┌───────────────────────────┐  │
│  │   Card Centralizado       │  │
│  │                            │  │
│  │   Logo/Título              │  │
│  │   Subtítulo                │  │
│  │                            │  │
│  │   [Botão Google]           │  │
│  │                            │  │
│  │   Link "Já tem conta?"     │  │
│  │                            │  │
│  │   (Mensagens de erro)      │  │
│  └───────────────────────────┘  │
│                                  │
│         (Espaço inferior)        │
└─────────────────────────────────┘
```

**Componentes:**

- **Header (dentro do card)**:

  - Título: "Bem-vindo ao OrçaSonhos" (H1)
  - Subtítulo: "Transforme seus sonhos em metas alcançáveis" (p)
  - Logo: Opcional, acima do título

- **Main Content**:

  - Botão Google: `os-button` variant `primary`, size `large`, icon `google`
  - Link Login: Texto "Já tem conta? Faça login" com link para `/login`
  - Mensagens de erro: `os-alert` variant `error` (se houver)

- **Footer (dentro do card)**:
  - Texto de ajuda: "Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade" (opcional, texto pequeno)

**Espaçamento:**

- Padding do card: 32px desktop, 24px tablet, 16px mobile
- Gap entre título e subtítulo: 8px
- Gap entre subtítulo e botão: 32px desktop, 24px mobile
- Gap entre botão e link: 16px
- Gap entre link e footer: 24px desktop, 16px mobile

#### Página Completar Perfil (`/register/complete-profile`)

**Layout Geral:**

```
┌─────────────────────────────────┐
│         (Espaço superior)        │
│                                  │
│  ┌───────────────────────────┐  │
│  │   Card Centralizado       │  │
│  │                            │  │
│  │   Título                   │  │
│  │   Subtítulo                │  │
│  │                            │  │
│  │   [Campo Nome]             │  │
│  │                            │  │
│  │   [Botão Continuar]        │  │
│  │                            │  │
│  │   (Mensagens de erro)      │  │
│  └───────────────────────────┘  │
│                                  │
│         (Espaço inferior)        │
└─────────────────────────────────┘
```

**Componentes:**

- **Header (dentro do card)**:

  - Título: "Complete seu perfil" (H1)
  - Subtítulo: "Confirme seu nome para continuar" (p)

- **Main Content**:

  - Campo Nome: `os-form-field` com `os-input` type `text`
    - Label: "Nome completo"
    - Placeholder: "Digite seu nome"
    - Value: Pré-preenchido com nome do Google (se disponível)
    - Required: true
    - Validation: 2-100 caracteres
    - Helper text: "Mínimo 2 caracteres, máximo 100 caracteres"
  - Botão Continuar: `os-button` variant `primary`, size `large`
    - Disabled quando nome inválido
    - Loading durante atualização

- **Footer (dentro do card)**:
  - Mensagem de sucesso: `os-alert` variant `success` (após atualização bem-sucedida)

**Espaçamento:**

- Padding do card: 32px desktop, 24px tablet, 16px mobile
- Gap entre título e subtítulo: 8px
- Gap entre subtítulo e campo: 24px desktop, 20px mobile
- Gap entre campo e botão: 32px desktop, 24px mobile

### Spacing Strategy

- **Section Gaps**:
  - Desktop: 32px entre seções
  - Tablet: 24px entre seções
  - Mobile: 16px entre seções
- **Component Gaps**:
  - Desktop: 24px entre componentes principais
  - Tablet: 20px entre componentes principais
  - Mobile: 16px entre componentes principais
- **Consistent Padding**:
  - Card: 32px (desktop), 24px (tablet), 16px (mobile)
  - Elementos internos: 16px, 12px, 8px conforme hierarquia

### Visual Hierarchy

1. **Título** (H1) - Elemento mais importante, fonte maior, peso bold
2. **Botão Google** - Ação principal, cor destacada, tamanho grande
3. **Subtítulo** - Contexto e orientação, fonte média
4. **Campo de Nome** - Input principal na página de completar perfil
5. **Link Login** - Ação secundária, estilo de link
6. **Mensagens de Erro** - Feedback importante mas não intrusivo

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: Lógico e sequencial
  - Página de Registro: Botão Google → Link Login
  - Página Completar Perfil: Campo Nome → Botão Continuar
- **Focus Management**:
  - Focus visível em todos elementos interativos (ring outline 2px)
  - Focus no campo de nome ao carregar página de completar perfil
  - Focus restaurado após operações assíncronas
- **Shortcuts**:
  - Enter/Space no botão Google para iniciar autenticação
  - Enter no campo de nome para submeter (se válido)
  - Esc para cancelar (não aplicável, mas preparado para futuras expansões)
- **Skip Links**: Não necessário (páginas simples, conteúdo acima da dobra)

#### ARIA Implementation

- **Landmarks**:

  - `<main role="main">` - Conteúdo principal (via os-form-template)
  - `<form role="form">` - Formulário de nome (página completar perfil)
  - `<header role="banner">` - Header com título (dentro do card)

- **Live Regions**:

  - `[aria-live="polite"]` para mensagens de sucesso
  - `[aria-live="assertive"]` para mensagens de erro críticas
  - `[aria-busy="true"]` no botão durante loading

- **Labels e Descriptions**:
  - Todos inputs com labels associados via `os-form-field`
  - Ícone Google com `aria-hidden="true"` (decorativo)
  - Botão Google com `aria-label="Entrar com Google"`
  - Link Login com texto descritivo "Já tem conta? Faça login"

#### Visual Accessibility

- **Contraste**:

  - Texto normal: >= 4.5:1 (verificado com tokens do tema)
  - Texto grande (títulos): >= 3:1
  - Botão Google: Contraste adequado entre texto e background
  - Links: Contraste >= 4.5:1

- **Typography**:

  - Font-size mínimo: 16px (1rem) para inputs
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200% sem quebra de layout

- **Motion**:
  - Respeita `prefers-reduced-motion`
  - Transições <= 300ms
  - Sem animações desnecessárias
  - Ripple effect do Material pode ser desabilitado se `prefers-reduced-motion`

#### Screen Reader Support

- **Content Structure**:
  - Headings hierárquicos (h1 → h2 se necessário)
  - Título principal como H1
- **Alt Text**:
  - Logo (se houver) com descrição significativa
  - Ícones decorativos com `aria-hidden="true"`
- **Form Labels**:
  - Campo de nome com label explícito via `os-form-field`
  - Associação via `for` e `id`
- **Error Messages**:
  - Anunciados dinamicamente via `aria-live="assertive"`
  - Associados ao campo via `aria-describedby`

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Botão Google: Spinner substitui ícone, texto mantido, disabled
  - Botão Continuar: Spinner dentro do botão, texto mantido, disabled
  - Overlay de loading: Não necessário (loading no botão é suficiente)

- **Empty**:

  - Campo de nome: Placeholder visível, valor vazio inicialmente
  - Após pré-preenchimento: Valor do Google preenchido

- **Error**:

  - Mensagem de erro: `os-alert` variant `error` acima do formulário
  - Campo de nome: Estado de erro visual (borda vermelha), mensagem abaixo do campo
  - Mensagens específicas:
    - "Nome deve ter no mínimo 2 caracteres"
    - "Nome deve ter no máximo 100 caracteres"
    - "Erro ao autenticar com Google. Tente novamente."
    - "Erro ao atualizar perfil. Tente novamente."

- **Success**:
  - Mensagem de sucesso: `os-alert` variant `success` após atualização
  - Redirecionamento automático para `/dashboard` após 1-2 segundos

### Micro-interactions

- **Hover**:
  - Botão Google: Background escurecido (+10% opacity), cursor pointer
  - Link Login: Sublinhado, cor alterada
- **Focus**:
  - Botão: Ring outline 2px, background mantido
  - Input: Ring outline 2px, borda destacada
- **Active**:
  - Botão: Scale down (0.98), pressed state visual
- **Transitions**:
  - 200ms ease-in-out para estados de hover/focus
  - 300ms ease-in-out para mudanças de estado (loading, error)

### Component-Specific Interactions

**Botão Google:**

- Click: Inicia `signInWithRedirect`
- Loading: Spinner aparece, botão disabled
- Success: Redirecionamento automático para Google
- Error: Mensagem de erro exibida, botão reabilitado

**Campo de Nome:**

- Input: Validação em tempo real (2-100 caracteres)
- Blur: Validação completa, mensagem de erro se inválido
- Focus: Placeholder desaparece, borda destacada
- Validação: Botão Continuar habilitado apenas quando válido

**Botão Continuar:**

- Click: Chama `completeProfile(name)`
- Loading: Spinner aparece, botão disabled
- Success: Mensagem de sucesso, redirecionamento após 1-2s
- Error: Mensagem de erro exibida, botão reabilitado

## 📐 Visual Specifications

### Mobile Layout (< 576px)

```
┌─────────────────────────────┐
│                             │
│    (Espaço flexível)        │
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   Bem-vindo ao        │  │
│  │   OrçaSonhos          │  │
│  │                       │  │
│  │   Transforme seus     │  │
│  │   sonhos em metas     │  │
│  │                       │  │
│  │   ┌─────────────────┐ │  │
│  │   │ [G] Entrar com  │ │  │
│  │   │     Google      │ │  │
│  │   └─────────────────┘ │  │
│  │                       │  │
│  │   Já tem conta?       │  │
│  │   Faça login          │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│    (Espaço flexível)        │
│                             │
└─────────────────────────────┘
```

**Anotações:**

- Card ocupa largura total menos padding (16px cada lado)
- Botão Google full width
- Texto centralizado
- Altura mínima: 100dvh para centralização vertical

### Tablet Layout (576-991px)

```
┌─────────────────────────────────────┐
│                                     │
│        (Espaço flexível)           │
│                                     │
│      ┌───────────────────────┐      │
│      │                       │      │
│      │   Bem-vindo ao        │      │
│      │   OrçaSonhos          │      │
│      │                       │      │
│      │   Transforme seus     │      │
│      │   sonhos em metas     │      │
│      │                       │      │
│      │   ┌───────────────┐   │      │
│      │   │ [G] Entrar    │   │      │
│      │   │ com Google    │   │      │
│      │   └───────────────┘   │      │
│      │                       │      │
│      │   Já tem conta?       │      │
│      │   Faça login          │      │
│      │                       │      │
│      └───────────────────────┘      │
│                                     │
│        (Espaço flexível)           │
│                                     │
└─────────────────────────────────────┘
```

**Anotações:**

- Card centralizado, largura máxima 600px
- Botão Google largura fixa 400px, centralizado
- Padding aumentado (24px)
- Sombra mais pronunciada no card

### Desktop Layout (>= 992px)

```
┌─────────────────────────────────────────┐
│                                         │
│          (Espaço flexível)             │
│                                         │
│        ┌─────────────────────┐          │
│        │                     │          │
│        │  Bem-vindo ao       │          │
│        │  OrçaSonhos         │          │
│        │                     │          │
│        │  Transforme seus    │          │
│        │  sonhos em metas    │          │
│        │                     │          │
│        │  ┌─────────────┐    │          │
│        │  │ [G] Entrar  │    │          │
│        │  │ com Google  │    │          │
│        │  └─────────────┘    │          │
│        │                     │          │
│        │  Já tem conta?      │          │
│        │  Faça login         │          │
│        │                     │          │
│        └─────────────────────┘          │
│                                         │
│          (Espaço flexível)             │
│                                         │
└─────────────────────────────────────────┘
```

**Anotações:**

- Card centralizado, largura máxima 500px
- Botão Google largura fixa 350px, centralizado
- Padding: 32px
- Hover states ativos
- Sombra elevada no card

### Wireframes Detalhados

**Página de Completar Perfil - Mobile:**

```
┌─────────────────────────────┐
│                             │
│    (Espaço flexível)        │
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   Complete seu        │  │
│  │   perfil              │  │
│  │                       │  │
│  │   Confirme seu nome   │  │
│  │   para continuar      │  │
│  │                       │  │
│  │   ┌─────────────────┐ │  │
│  │   │ Nome completo * │ │  │
│  │   │ [João Silva    ] │ │  │
│  │   │ Mín. 2, máx. 100│ │  │
│  │   └─────────────────┘ │  │
│  │                       │  │
│  │   ┌─────────────────┐ │  │
│  │   │   Continuar     │ │  │
│  │   └─────────────────┘ │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│    (Espaço flexível)        │
│                             │
└─────────────────────────────┘
```

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**

- Nenhum componente novo necessário - usar componentes existentes do Design System

**Modificações:**

- `os-button`: Verificar suporte a ícone Google (ou adicionar se necessário)
- `os-form-template`: Usar configuração `compact` e `small` para páginas de autenticação

### Dependências de UI

- **Design System**: Componentes `os-*` já disponíveis
- **Angular Material**: Já configurado e utilizado pelos componentes `os-*`
- **Firebase Auth**: `@angular/fire/auth` para autenticação Google
- **Router**: `@angular/router` para navegação e redirecionamentos

### Impacto em Performance

- **Bundle Size**:
  - Impacto mínimo - componentes já existentes
  - Firebase Auth já incluído no bundle
- **Lazy Loading**:
  - Páginas de registro podem ser lazy loaded (rotas públicas)
  - Componentes do Design System já otimizados
- **Critical CSS**:
  - Estilos críticos: Card, botão Google, campo de nome
  - Inline critical CSS para above-the-fold content

### Integration Points

- **AuthService**:
  - Métodos `signInWithGoogle()` e `completeProfile(name)`
  - Estados de loading e erro expostos via signals
- **Firebase Auth**:
  - `signInWithRedirect` para iniciar autenticação
  - `getRedirectResult` para tratar retorno do Google
  - `updateProfile` para atualizar `displayName`
- **Router**:
  - Redirecionamento para `/register/complete-profile` (primeiro acesso)
  - Redirecionamento para `/dashboard` (usuário existente ou após completar perfil)
- **Design System**:
  - Componentes `os-*` integrados via imports standalone
  - Templates `os-form-template` para estrutura base

## 🧪 Layout Validation Criteria

**Critérios para work.md validar:**

### Design System Compliance

- [ ] Componentes `os-*` utilizados corretamente
- [ ] Design tokens aplicados (`--os-*`)
- [ ] Nomenclatura consistente (`os-button`, `os-input`, etc.)
- [ ] Tema aplicado corretamente

### Responsiveness

- [ ] Mobile-first implementado
- [ ] Breakpoints funcionais (mobile < 576px, tablet 576-991px, desktop >= 992px)
- [ ] Touch targets >= 44px em mobile
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Card centralizado verticalmente e horizontalmente
- [ ] Botão Google responsivo (full width mobile, largura fixa desktop)

### Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa (Tab, Enter, Space)
- [ ] ARIA attributes corretos (`aria-label`, `aria-busy`, `aria-live`)
- [ ] Screen reader friendly (labels, descriptions, live regions)
- [ ] Contraste adequado (>= 4.5:1 texto normal, >= 3:1 texto grande)
- [ ] Focus visible em elementos interativos
- [ ] Respeita `prefers-reduced-motion`

### Performance

- [ ] OnPush change detection nos componentes
- [ ] Lazy loading das rotas de registro (se aplicável)
- [ ] Bundle size otimizado (componentes já existentes)
- [ ] Computed signals para derivações (validação, estados)

### Visual Quality

- [ ] Spacing consistente (tokens `--os-spacing-*`)
- [ ] Alinhamento visual correto (centralização, grid)
- [ ] Hierarquia visual clara (título → botão → link)
- [ ] Estados (loading, error, empty, success) implementados
- [ ] Transições suaves (200-300ms)

### Funcionalidade

- [ ] Botão Google inicia autenticação corretamente
- [ ] Redirecionamento após autenticação funciona
- [ ] Detecção de primeiro acesso funciona (`displayName` vazio)
- [ ] Campo de nome pré-preenchido com nome do Google
- [ ] Validação de nome funciona (2-100 caracteres)
- [ ] Botão Continuar habilitado apenas quando válido
- [ ] Atualização de perfil funciona
- [ ] Redirecionamento para dashboard após sucesso

## 📚 References

### Design System Documentation

- Atoms: `src/app/shared/ui-components/atoms/`
- Molecules: `src/app/shared/ui-components/molecules/`
- Organisms: `src/app/shared/ui-components/organisms/`
- Templates: `src/app/shared/ui-components/templates/`

### Material Design Guidelines

- [Material Design Buttons](https://material.angular.io/components/button/overview)
- [Material Design Form Fields](https://material.angular.io/components/form-field/overview)
- [Material Design Accessibility](https://material.angular.io/guide/accessibility)

### WCAG Guidelines

- [WCAG 2.1 AA - Perceivable](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aaa#perceivable)
- [WCAG 2.1 AA - Operable](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aaa#operable)
- [WCAG 2.1 AA - Understandable](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aaa#understandable)

### Código Similar no Projeto

- `sessions/OS-229/layout-specification.md` - Página de Accounts com formulários
- `sessions/OS-233/layout-specification.md` - Padronização de layout universal
- `src/app/shared/ui-components/templates/os-form-template/` - Template de formulário

### Meta Specs - Contexto de Produto

- **Personas**: `business/customer-profile/personas.md` - Perfis de usuário e necessidades específicas (Carlos como persona primária)
- **Jornada do Cliente**: `business/customer-profile/customer-journey.md` - Touchpoints e estágios de engajamento (Primeiro Uso)
- **Conceitos Centrais**: `business/product-vision/core-concepts.md` - Domínio financeiro e regras de negócio
- **Funcionalidades Core**: `business/03_funcionalidades_core.md` - Onboarding orientado a objetivos

### Firebase Authentication

- [Firebase Auth - Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)
- [AngularFire Auth](https://github.com/angular/angularfire)
- [Firebase Auth - Redirect-based OAuth](https://firebase.google.com/docs/auth/web/redirect-best-practices)
