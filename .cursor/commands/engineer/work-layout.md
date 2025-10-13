# Engineer Work-Layout

Comando para criar especificações detalhadas de layout, UI/UX e acessibilidade antes da implementação.

## Configuração de IA

Antes de executar este comando, leia o arquivo `ai.properties.md` na raiz do projeto para obter configurações locais.

Se o arquivo não existir ou não estiver configurado, use a URL padrão do GitHub.

## Argumentos da Sessão

<folder>
#$ARGUMENTS
</folder>

## Objetivo

Analisar requisitos de layout e criar especificação detalhada de UI/UX, gerando o artefato `layout-specification.md` e enriquecendo `architecture.md` com decisões de layout.

## Processo de Especificação de Layout

### 0. Execução Automática Inicial

#### Context Loading Especializado em Layout

**SEMPRE execute automaticamente:**

1. **Leitura de Documentos da Sessão:**

   - `sessions/<folder>/context.md` - Requisitos funcionais
   - `sessions/<folder>/architecture.md` - Arquitetura técnica

2. **Documentação de Layout (Meta Specs):**

   - `design-system-patterns.md` - Padrões Atomic Design
   - `responsive-design.md` - Mobile-first e breakpoints
   - `accessibility.md` - WCAG 2.1 AA
   - `ui-system.md` - Angular Material + abstração OrçaSonhos

3. **Busca Contextual no Codebase:**

   ```typescript
   // Buscar componentes do Design System existentes
   const dsComponents = await codebase_search({
     query: 'componentes design system atoms molecules organisms templates',
     target_directories: ['src/app/shared/ui-components/'],
   });

   // Buscar layouts similares
   const similarLayouts = await codebase_search({
     query: `${componentType} layout responsive mobile template similar`,
     target_directories: ['src/app/features/', 'src/app/shared/ui-components/templates/'],
   });
   ```

4. **Angular Material Best Practices:**
   ```typescript
   const angularBestPractices = await mcp_angular_cli_get_best_practices();
   const materialDocs = await mcp_angular_cli_search_documentation({
     query: 'Angular Material layout responsive accessibility',
     includeTopContent: true,
   });
   ```

### 1. Análise de Requisitos de Layout

**Baseado em context.md e architecture.md:**

1. **Identificar Tipo de Layout:**

   - Dashboard, Form, List, Detail, Modal, etc.
   - Complexidade da interação
   - Fluxos de usuário necessários

2. **Analisar Design System Existente:**

   - Componentes reutilizáveis disponíveis
   - Gaps no Design System
   - Necessidade de novos componentes

3. **Definir Estratégia Responsiva:**

   - Breakpoints necessários
   - Comportamento mobile-first
   - Touch targets e gestos

4. **Requisitos de Acessibilidade:**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - ARIA patterns necessários

### 2. Análise Automática de Necessidade de Wireframes

**Critérios para geração de wireframes:**

```typescript
const needsWireframes = {
  newLayout: !hasExistingLayoutTemplate, // Layout novo sem template
  complexInteractions: hasComplexUserFlows, // Múltiplos fluxos de usuário
  newDSComponents: needsNewDesignSystemComponents, // Componentes novos no DS
  complexResponsive: hasMultipleBreakpointAdaptations, // Mudanças significativas por breakpoint
  accessibilityComplexity: hasSpecificA11yPatterns, // Padrões ARIA complexos
};

const wireframeLevel = determineWireframeLevel(needsWireframes);
// Retorna: 'none' | 'sketches' | 'detailed'
```

**Decisão Automática:**

- **none:** Usa componentes existentes, layout simples
- **sketches:** Wireframes textuais/ASCII art para referência
- **detailed:** Descrições detalhadas de layout por breakpoint

### 3. Geração do layout-specification.md

**Template do Artefato:**

```markdown
# [NOME DA FUNCIONALIDADE] - Layout Specification

## 🎯 Layout Overview

### Objetivo Visual

[O que o layout deve comunicar visualmente]

### Tipo de Layout

[Dashboard | Form | List | Detail | Modal | Custom]

### Público-Alvo

[Mobile-first | Desktop-first | Universal]

### Contexto de Uso

[Onde e como será utilizado na aplicação]

## 📱 Responsive Strategy

### Breakpoints Definidos

- **Mobile (0-575px)**:
  - Layout: [Stack vertical, single column]
  - Touch targets: [>= 44px]
  - Comportamento específico: [...]
- **Tablet (576-991px)**:
  - Layout: [2 columns grid, adaptações]
  - Navegação: [...]
  - Comportamento específico: [...]
- **Desktop (992px+)**:
  - Layout: [Grid completo, sidebar]
  - Hover states: [...]
  - Comportamento específico: [...]

### Mobile-First Approach

[Estratégia de progressive enhancement]

### Touch Interactions

[Gestos, swipe, tap específicos]

## 🎨 Design System Integration

### Componentes Existentes (Reutilização)

#### Atoms

- **os-button**:

  - Variant: [primary | secondary | tertiary]
  - Size: [small | medium | large]
  - Usage: [Onde será usado]

- **os-input**:
  - Type: [text | email | password]
  - Validation: [...]
  - Usage: [...]

[Listar todos os atoms reutilizados]

#### Molecules

- **os-form-field**:
  - Configuration: [...]
  - Usage: [...]

[Listar todas as molecules reutilizadas]

#### Organisms

- **os-header**:
  - Variant: [default | compact]
  - Actions: [...]
  - Usage: [...]

[Listar todos os organisms reutilizados]

#### Templates

- **os-dashboard-template** | **os-form-template** | [outro]:
  - Configuration: [...]
  - Customizations: [...]
  - Usage: [...]

### Novos Componentes (Especificação Detalhada)

@if (needsNewComponents) {

#### [Nome do Novo Componente] (Atom | Molecule | Organism)

**Propósito:**
[Para que serve este componente]

**Design Specs:**

- **Padding**: [12px horizontal, 8px vertical]
- **Border**: [1px solid --os-color-border]
- **Border-radius**: [6px]
- **Typography**: [--os-font-size-sm, --os-font-weight-medium]
- **Colors**:
  - Background: [--os-color-background-primary]
  - Text: [--os-color-text-primary]
  - Hover: [--os-color-background-hover]
  - Focus: [--os-color-primary]

**States:**

- **Default**: [Aparência padrão]
- **Hover**: [background +10% opacity, cursor pointer]
- **Focus**: [2px solid ring --os-color-primary]
- **Disabled**: [opacity 0.5, cursor not-allowed]
- **Loading**: [Spinner animation]

**Responsiveness:**

- Mobile: [Ajustes específicos]
- Tablet: [Ajustes específicos]
- Desktop: [Ajustes específicos]

**Accessibility:**

- **Role**: [button | link | input | ...]
- **ARIA**: [aria-label, aria-describedby, ...]
- **Keyboard**: [Tab, Enter, Space, ...]

**Variants:**
[Se aplicável, variações do componente]

}

## 🏗️ Layout Structure

### Grid System

- **Columns**: [12-col desktop, 8-col tablet, 1-col mobile]
- **Gap**: [16px desktop, 12px tablet, 8px mobile]
- **Max Width**: [1200px container]

### Sections

#### Header

- **Components**: [os-header, os-budget-selector, ...]
- **Height**: [64px desktop, 56px mobile]
- **Sticky**: [Yes | No]
- **Z-index**: [100]

#### Sidebar (if applicable)

- **Width**: [240px expanded, 64px collapsed]
- **Breakpoint**: [Hidden < 768px]
- **Components**: [os-sidebar, os-navigation, ...]

#### Main Content

- **Layout**: [Grid | Flexbox | Stack]
- **Padding**: [24px desktop, 16px mobile]
- **Components**: [Lista de widgets/componentes]

#### Footer (if applicable)

- **Components**: [os-footer, ...]
- **Height**: [Auto]

### Spacing Strategy

- **Section Gaps**: [32px desktop, 24px tablet, 16px mobile]
- **Component Gaps**: [16px desktop, 12px tablet, 8px mobile]
- **Consistent Padding**: [24px, 16px, 12px, 8px scale]

### Visual Hierarchy

1. [Elemento mais importante - H1, Hero]
2. [Segundo nível - H2, Cards principais]
3. [Terceiro nível - H3, Conteúdo secundário]

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance

#### Keyboard Navigation

- **Tab Order**: [Lógico e sequencial - header → main → footer]
- **Focus Management**: [Visible focus ring em todos elementos interativos]
- **Shortcuts**: [Se aplicável - Esc fecha modals, /, para busca]
- **Skip Links**: [Skip to main content]

#### ARIA Implementation

- **Landmarks**:

  - `<header role="banner">` - Header principal
  - `<nav role="navigation">` - Navegação
  - `<main role="main">` - Conteúdo principal
  - `<aside role="complementary">` - Sidebar
  - `<footer role="contentinfo">` - Footer

- **Live Regions**:

  - [aria-live="polite"] para notificações
  - [aria-live="assertive"] para erros críticos

- **Labels e Descriptions**:
  - Todos inputs com labels associados
  - Ícones decorativos com aria-hidden="true"
  - Botões com aria-label descritivos

#### Visual Accessibility

- **Contraste**:

  - Texto normal: >= 4.5:1
  - Texto grande: >= 3:1
  - UI Components: >= 3:1

- **Typography**:

  - Font-size mínimo: 16px (1rem)
  - Line-height: 1.5 para body text
  - Escalável com zoom até 200%

- **Motion**:
  - Respeita prefers-reduced-motion
  - Transições <= 300ms
  - Sem animações desnecessárias

#### Screen Reader Support

- **Content Structure**: Headings hierárquicos (h1 → h2 → h3)
- **Alt Text**: Imagens com descrições significativas
- **Form Labels**: Associação explícita com inputs
- **Error Messages**: Anunciados dinamicamente

## 🎭 States and Interactions

### Global States

- **Loading**:

  - Spinner centralizado
  - Skeleton screens para conteúdo
  - Loading state em botões

- **Empty**:

  - Ícone ilustrativo
  - Mensagem clara
  - Call-to-action quando aplicável

- **Error**:

  - Ícone de erro
  - Mensagem descritiva
  - Botão de retry/resolução

- **Success**:
  - Feedback visual (toast/modal)
  - Mensagem de confirmação

### Micro-interactions

- **Hover**: [Elevação de cards, mudança de cor em botões]
- **Focus**: [Ring outline, scale up]
- **Active**: [Scale down, pressed state]
- **Transitions**: [200ms ease-in-out para estados]

### Component-Specific Interactions

[Interações específicas de cada componente principal]

## 📐 Visual Specifications

@if (wireframeLevel !== 'none') {

**Localização dos Wireframes:**

- **Padrão**: Wireframes inline neste documento (ASCII art)
- **Casos Complexos**: Se wireframes muito detalhados ou múltiplos fluxos, criar pasta `wireframes/` com arquivos separados

### Mobile Layout (< 576px)
```

┌─────────────────────────┐
│ Header (sticky) │
│ ┌───────────────────┐ │
│ │ Logo [Selector] │ │
│ └───────────────────┘ │
├─────────────────────────┤
│ Main Content │
│ ┌───────────────────┐ │
│ │ Widget 1 (full) │ │
│ │ │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ Widget 2 (full) │ │
│ │ │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ Widget 3 (full) │ │
│ └───────────────────┘ │
└─────────────────────────┘

```

**Anotações:**
- Stack vertical de todos widgets
- Touch targets >= 44px
- Sem scroll horizontal

### Tablet Layout (576-991px)

```

┌───────────────────────────────────┐
│ Header (sticky) │
│ ┌─────────────────────────────┐ │
│ │ Logo Nav [Selector] │ │
│ └─────────────────────────────┘ │
├───────────────────────────────────┤
│ Main Content │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Widget 1 │ │ Widget 2 │ │
│ │ │ │ │ │
│ └─────────────┘ └─────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Widget 3 (full width) │ │
│ └─────────────────────────────┘ │
└───────────────────────────────────┘

```

**Anotações:**
- Grid 2 colunas quando possível
- Navegação visível

### Desktop Layout (>= 992px)

```

┌─────────────────────────────────────────────┐
│ Header (sticky) │
│ ┌───────────────────────────────────────┐ │
│ │ Logo Navigation [Selector] Actions│ │
│ └───────────────────────────────────────┘ │
├─────┬───────────────────────────────────────┤
│ [S] │ Main Content │
│ [i] │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ [d] │ │Widget│ │Widget│ │Widget│ │Widget│ │
│ [e] │ │ 1 │ │ 2 │ │ 3 │ │ 4 │ │
│ [b] │ └──────┘ └──────┘ └──────┘ └──────┘ │
│ [a] │ ┌──────────────────────────────────┐ │
│ [r] │ │ Widget 5 (full width) │ │
│ │ └──────────────────────────────────┘ │
└─────┴───────────────────────────────────────┘

```

**Anotações:**
- Sidebar colapsável
- Grid 12 colunas flexível
- Hover states ativos

@if (hasComplexWireframes) {

### Wireframes Detalhados

**Para wireframes muito complexos ou múltiplos fluxos de usuário, consulte:**
- `sessions/<folder>/wireframes/` - Pasta com wireframes detalhados

**Arquivos disponíveis:**
- `mobile-flow.md` - Fluxo detalhado mobile
- `tablet-flow.md` - Fluxo detalhado tablet
- `desktop-flow.md` - Fluxo detalhado desktop
- `interaction-states.md` - Estados de interação complexos

}

}

## 🔄 Architecture Impact

### Componentes de UI a Criar/Modificar

**Novos:**
[Lista de componentes novos necessários]

**Modificações:**
[Componentes existentes que precisam ajustes]

### Dependências de UI
[Bibliotecas/pacotes necessários para layout]

### Impacto em Performance
- **Bundle Size**: [Estimativa de impacto]
- **Lazy Loading**: [Componentes a fazer lazy load]
- **Critical CSS**: [Estilos críticos para first paint]

### Integration Points
[Como o layout se integra com serviços e dados]

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
- [ ] Imagens/media responsivas

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation completa
- [ ] ARIA attributes corretos
- [ ] Screen reader friendly
- [ ] Contraste adequado (>= 4.5:1)
- [ ] Focus visible em elementos interativos

### Performance
- [ ] OnPush change detection
- [ ] Lazy loading onde aplicável
- [ ] Bundle size otimizado
- [ ] Computed signals para derivações

### Visual Quality
- [ ] Spacing consistente
- [ ] Alinhamento visual correto
- [ ] Hierarquia visual clara
- [ ] Estados (loading, error, empty) implementados

## 📚 References

### Design System Documentation
- Atoms: [src/app/shared/ui-components/atoms/]
- Molecules: [src/app/shared/ui-components/molecules/]
- Organisms: [src/app/shared/ui-components/organisms/]
- Templates: [src/app/shared/ui-components/templates/]

### Material Design Guidelines
[Referências específicas do Material Design aplicadas]

### WCAG Guidelines
[Seções específicas do WCAG 2.1 relevantes]

### Código Similar no Projeto
[Exemplos de layouts similares já implementados]
```

### 4. Enriquecimento do architecture.md

**Após gerar layout-specification.md, AUTOMATICAMENTE:**

1. **Ler architecture.md existente**

2. **Adicionar/Atualizar seção "UI Components":**

```markdown
## 🎨 UI Components and Layout

### Design System Integration

[Resumo dos componentes do DS utilizados]

### New Components Required

[Componentes novos necessários - referência ao layout-specification.md]

### Layout Architecture

[Como o layout se integra com a arquitetura]

### Performance Considerations

[Impacto de UI na performance]

**Detalhes completos em:** `layout-specification.md`
```

3. **Atualizar seção "Dependências"** se houver novas dependências de UI

4. **Atualizar "Lista de Implementação"** com tarefas de UI:

```markdown
## 📋 Lista de Implementação

### UI Components

- [ ] Implementar [novo componente] conforme layout-specification
- [ ] Configurar [template] com customizações
- [ ] Implementar responsividade (mobile/tablet/desktop)
- [ ] Implementar acessibilidade (ARIA, keyboard)

[Resto da lista existente...]
```

### 5. Validação e Aprovação

**Apresente ao usuário:**

```markdown
## 🎨 Layout Specification Completa

**Artefato Gerado:** `sessions/<folder>/layout-specification.md`

**Architecture.md Atualizado:** Seções de UI Components adicionadas

### Resumo das Especificações:

- **Tipo de Layout**: [Dashboard | Form | ...]
- **Componentes Reutilizados**: [X atoms, Y molecules, Z organisms]
- **Componentes Novos**: [Lista]
- **Wireframes**: [Generated | Not needed]
- **Breakpoints**: [Mobile, Tablet, Desktop]
- **Accessibility**: [WCAG 2.1 AA compliant]

### Próximos Passos:

1. Revisar `layout-specification.md`
2. Aprovar especificações
3. Prosseguir para `/plan` (planejamento de implementação)

**Posso prosseguir?**
```

### 6. Finalização

Após aprovação:

- Confirmar que `layout-specification.md` está completo
- Confirmar que `architecture.md` foi enriquecido
- Informar próximo passo: `/plan`

## Próximos Passos

Após completion do `/work-layout`:

1. **Planejamento** (`/plan`) - Quebra em etapas de implementação
2. **Desenvolvimento** (`/work`) - Execução das etapas
3. **Revisão** (`/pre-pr`) - Validações antes do PR
4. **Pull Request** (`/pr`) - Finalização e submissão

---

## ⚠️ LEMBRETE IMPORTANTE

**Este comando executa automaticamente**:

1. ✅ **Context Loading Especializado** (Design System, Responsive, A11y, Material)
2. ✅ **Angular Best Practices** (via MCP Angular CLI)
3. ✅ **Geração de layout-specification.md** (completo e detalhado)
4. ✅ **Enriquecimento do architecture.md** (com UI context)
5. ✅ **Validação e Aprovação** (antes de prosseguir)

**Resultado**: Especificações de layout robustas, responsivas, acessíveis e alinhadas com o Design System!

---

## 🔗 Ver Também

- **[start.md](./start.md)** - Comando anterior (contexto e arquitetura)
- **[plan.md](./plan.md)** - Próximo comando (planejamento de implementação)
- **Meta Specs**:
  - `design-system-patterns.md` - Padrões Atomic Design
  - `responsive-design.md` - Mobile-first e breakpoints
  - `accessibility.md` - WCAG 2.1 AA compliance
  - `ui-system.md` - Angular Material + abstração
