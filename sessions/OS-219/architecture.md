# Design System Base - Atomic Design até Templates - Arquitetura Técnica

## 🏗️ Visão Geral da Implementação

### Estado Atual

O projeto possui uma base Angular 20.2.0 sólida com:

- ✅ Angular 20+ com standalone components
- ✅ Angular Material 20.2.3 instalado e configurado
- ✅ Estrutura Feature-Based configurada
- ✅ Path aliases (@app, @core, @shared, @features, @dtos)
- ✅ Tema Material básico com azul/terciário
- ✅ TypeScript strict mode
- ✅ ESLint com regras de boundary
- ✅ Estrutura de pastas organizada

### Mudanças Propostas

Implementar Design System completo seguindo Atomic Design:

- **ATOMS**: 15+ componentes básicos (Button, Input, Icon, etc.)
- **MOLECULES**: 12+ componentes compostos (Form Field, Card, etc.)
- **ORGANISMS**: 12+ componentes complexos (Header, Sidebar, etc.)
- **TEMPLATES**: 8+ layouts (Dashboard, Form, List, etc.)
- **Sistema de Tema**: Paleta azul dominante com tokens customizados
- **Integração**: Camada de abstração sobre Angular Material

### Impactos

- **Estrutura de Pastas**: Nova organização em `/src/app/shared/ui-components/`
- **Sistema de Tema**: Customização completa do Material Design
- **Componentes**: Base para todas as features futuras
- **Performance**: Bundle otimizado com tree shaking
- **Manutenibilidade**: Padrões consistentes e documentação

## 🔧 Componentes e Estrutura

### Arquivos Principais a Modificar

- `src/styles.scss`: Integração do sistema de tema customizado
- `src/app/shared/index.ts`: Exportações do Design System
- `package.json`: Possível adição de dependências para Storybook

### Novos Arquivos a Criar

- `src/app/shared/ui-components/`: Estrutura completa do Design System
- `src/app/shared/ui-components/theme/`: Sistema de tema customizado
- `src/app/shared/ui-components/atoms/`: Componentes básicos
- `src/app/shared/ui-components/molecules/`: Componentes compostos
- `src/app/shared/ui-components/organisms/`: Componentes complexos
- `src/app/shared/ui-components/templates/`: Layouts
- `src/app/shared/ui-components/ui-components.module.ts`: Módulo principal

### Estrutura de Diretórios

```
src/app/shared/ui-components/
├── /atoms/
│   ├── os-button/
│   ├── os-input/
│   ├── os-icon/
│   ├── os-badge/
│   ├── os-avatar/
│   ├── os-spinner/
│   ├── os-label/
│   ├── os-chip/
│   ├── os-money-input/
│   ├── os-date-input/
│   ├── os-select/
│   ├── os-checkbox/
│   ├── os-radio/
│   ├── os-toggle/
│   ├── os-slider/
│   └── os-progress-bar/
├── /molecules/
│   ├── os-form-field/
│   ├── os-card/
│   ├── os-search-box/
│   ├── os-data-table/
│   ├── os-filter-bar/
│   ├── os-navigation-item/
│   ├── os-money-display/
│   ├── os-date-picker/
│   ├── os-dropdown/
│   ├── os-form-group/
│   ├── os-alert/
│   └── os-tooltip/
├── /organisms/
│   ├── os-header/
│   ├── os-sidebar/
│   ├── os-footer/
│   ├── os-data-grid/
│   ├── os-form-section/
│   ├── os-navigation/
│   ├── os-modal/
│   ├── os-page-header/
│   ├── os-goal-progress/
│   ├── os-budget-summary/
│   ├── os-transaction-list/
│   └── os-category-manager/
├── /templates/
│   ├── os-dashboard-layout/
│   ├── os-form-layout/
│   ├── os-list-layout/
│   ├── os-detail-layout/
│   ├── os-auth-layout/
│   ├── os-onboarding-layout/
│   ├── os-sidebar-template/
│   └── os-appbar-template/
├── /theme/
│   ├── _tokens.scss
│   ├── _material-theme.scss
│   ├── _colors.scss
│   ├── _typography.scss
│   ├── _spacing.scss
│   └── theme.scss
└── ui-components.module.ts
```

## 🏛️ Padrões Arquiteturais

### Padrões Seguidos

- **Atomic Design**: Atoms → Molecules → Organisms → Templates
- **Standalone Components**: Arquitetura moderna do Angular 20+
- **Feature-Based**: Integração com estrutura existente
- **Signals**: Estado reativo com input/output signals
- **OnPush**: Change detection otimizada
- **CSS BEM**: Nomenclatura consistente de classes

### Decisões Arquiteturais

- **Decisão**: Usar Angular Material como base com abstração
- **Alternativas**: Biblioteca própria, outras UI libraries
- **Justificativa**: Acelera desenvolvimento, mantém consistência, permite customização

- **Decisão**: Atomic Design para organização
- **Alternativas**: Estrutura por funcionalidade, estrutura monolítica
- **Justificativa**: Facilita reutilização, escalabilidade e manutenção

- **Decisão**: Prefixo 'os-' para todos os componentes
- **Alternativas**: Sem prefixo, prefixo genérico
- **Justificativa**: Evita conflitos, identifica componentes do OrçaSonhos

- **Decisão**: Sistema de tema customizado
- **Alternativas**: Tema Material padrão, tema genérico
- **Justificativa**: Identidade visual única, flexibilidade futura

## 📦 Dependências e Integrações

### Dependências Existentes

- **Angular Material 20.2.3**: Base para componentes
- **Angular CDK 20.2.3**: Funcionalidades avançadas
- **RxJS 7.8.0**: Reatividade
- **TypeScript 5.9.2**: Tipagem
- **SCSS**: Estilização

### Novas Dependências

- **@storybook/angular**: Documentação interativa (opcional)
- **@storybook/addon-a11y**: Testes de acessibilidade (opcional)

### Integrações

- **Angular Material**: Camada de abstração com API própria
- **Sistema de Roteamento**: Integração com templates de layout
- **Feature-Based**: Integração com estrutura existente
- **Sistema de Tema**: Integração com Angular Material

## 🔄 Fluxo de Dados

### Implementação de Componentes

1. **Criação**: Componente standalone com signals
2. **Estilização**: SCSS com variáveis CSS customizadas
3. **Testes**: Testes unitários com Jest/Vitest
4. **Documentação**: Storybook (opcional)
5. **Integração**: Exportação no módulo principal

### Sistema de Tema

1. **Tokens**: Definição de variáveis CSS
2. **Material Theme**: Customização do tema Material
3. **Componentes**: Aplicação de tokens nos componentes
4. **Responsividade**: Breakpoints e adaptações

## 🧪 Considerações de Teste

### Testes Unitários

- **Todos os componentes**: Testes de renderização, interação, acessibilidade
- **Sistema de Tema**: Validação de tokens e variáveis
- **Responsividade**: Testes em diferentes breakpoints
- **Acessibilidade**: Validação WCAG 2.1 AA

### Testes de Integração

- **Componentes compostos**: Interação entre atoms e molecules
- **Templates**: Integração com roteamento
- **Sistema de Tema**: Aplicação consistente

### Mocks e Fixtures

- **Dados de teste**: Fixtures para componentes de dados
- **Temas**: Mocks para tema claro/escuro
- **Responsividade**: Mocks para diferentes tamanhos de tela

## ⚖️ Trade-offs e Riscos

### Trade-offs Aceitos

- **Complexidade inicial**: Muitos componentes para implementar
- **Bundle size**: Possível aumento inicial
- **Curva de aprendizado**: Equipe precisa aprender padrões

### Riscos Identificados

- **Performance**: Bundle size pode crescer
- **Manutenção**: Muitos componentes para manter
- **Migração**: Impacto em features existentes
- **Consistência**: Difícil manter padrões em muitos componentes

**Mitigações:**

- Implementação incremental por nível
- Lazy loading para componentes pesados
- Tree shaking otimizado
- Testes abrangentes
- Documentação detalhada
- Code review rigoroso

## 📋 Lista de Implementação

### Fase 1: Configuração Base

- [ ] Criar estrutura de diretórios
- [ ] Configurar sistema de tema
- [ ] Implementar design tokens
- [ ] Configurar Storybook (opcional)

### Fase 2: ATOMS (15+ componentes)

- [ ] os-button (4 variantes, 3 tamanhos)
- [ ] os-input (text, email, password, number, tel)
- [ ] os-icon (sistema próprio)
- [ ] os-badge (status indicators)
- [ ] os-avatar (user avatars)
- [ ] os-spinner (loading indicators)
- [ ] os-label (text labels)
- [ ] os-chip (tags e filtros)
- [ ] os-money-input (formatação monetária)
- [ ] os-date-input (seleção de datas)
- [ ] os-select (dropdowns)
- [ ] os-checkbox (seleção múltipla)
- [ ] os-radio (seleção única)
- [ ] os-toggle (switch on/off)
- [ ] os-slider (controle de range)
- [ ] os-progress-bar (indicadores de progresso)

### Fase 3: MOLECULES (12+ componentes)

- [ ] os-form-field (input + label + validation)
- [ ] os-card (content containers)
- [ ] os-search-box (busca com sugestões)
- [ ] os-data-table (tabelas básicas)
- [ ] os-filter-bar (filtros de dados)
- [ ] os-navigation-item (itens de navegação)
- [ ] os-money-display (formatação de valores)
- [ ] os-date-picker (seleção de datas)
- [ ] os-dropdown (menus suspensos)
- [ ] os-form-group (grupos de campos)
- [ ] os-alert (notificações)
- [ ] os-tooltip (dicas contextuais)

### Fase 4: ORGANISMS (12+ componentes)

- [ ] os-header (cabeçalho da aplicação)
- [ ] os-sidebar (navegação lateral)
- [ ] os-footer (rodapé)
- [ ] os-data-grid (tabelas avançadas)
- [ ] os-form-section (seções de formulário)
- [ ] os-navigation (navegação principal)
- [ ] os-modal (diálogos e overlays)
- [ ] os-page-header (cabeçalhos de página)
- [ ] os-goal-progress (progresso de metas)
- [ ] os-budget-summary (resumo de orçamentos)
- [ ] os-transaction-list (lista de transações)
- [ ] os-category-manager (gerenciador de categorias)

### Fase 5: TEMPLATES (8+ layouts)

- [ ] os-dashboard-layout (layout principal)
- [ ] os-form-layout (layout para formulários)
- [ ] os-list-layout (layout para listas)
- [ ] os-detail-layout (layout para detalhes)
- [ ] os-auth-layout (layout para autenticação)
- [ ] os-onboarding-layout (layout simplificado)
- [ ] os-sidebar-template (template de navegação)
- [ ] os-appbar-template (template de barra superior)

### Fase 6: Qualidade e Documentação

- [ ] Testes unitários para todos os componentes
- [ ] Documentação completa do Design System
- [ ] Storybook configurado
- [ ] Acessibilidade validada
- [ ] Performance otimizada
- [ ] Bundle size otimizado

## 📋 Code Standards e Convenções

### 🚫 Comentários no Código - REGRA CRÍTICA

**IMPORTANTE**: **NÃO adicionar comentários** a menos que explicitamente solicitado.

#### Comentários Óbvios (EVITAR)

```typescript
// ❌ Evitar comentários óbvios
export class OsButtonComponent {
  // Creates a new button - DESNECESSÁRIO
  public createButton() {}

  // Gets button variant - DESNECESSÁRIO
  public getVariant() {}
}

// ✅ Código auto-explicativo (SEM comentários)
export class OsButtonComponent {
  public createButton() {}
  public getVariant() {}
}
```

#### Comentários Redundantes (EVITAR)

```typescript
// ❌ Comentário que repete o código
export class OsFormFieldComponent {
  // Validate the form field
  validateField(): boolean {
    return this.required && this.value.length > 0;
  }
}

// ✅ Código claro sem comentários
export class OsFormFieldComponent {
  validateField(): boolean {
    return this.required && this.value.length > 0;
  }
}
```

#### Quando Comentar (Exceções)

Apenas quando **explicitamente solicitado**:

```typescript
// ✅ Regras de negócio não óbvias (quando solicitado)
export class OsMoneyInputComponent {
  public formatCurrency(value: number): string {
    // Financial rule: Brazilian Real format with 2 decimal places
    // Formula: R$ X.XXX,XX where X = digits
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}

// ✅ Algoritmos complexos (quando solicitado)
private calculateCompoundInterest(principal: number, rate: number, time: number): number {
  // Formula: A = P(1 + r)^t
  // A = final amount, P = principal, r = annual interest rate, t = time in years
  return principal * Math.pow(1 + rate, time);
}
```

### 🏷️ Nomenclatura e Convenções

#### Componentes do Design System

```typescript
// ✅ Seletores com prefixo 'os-'
@Component({
  selector: 'os-button'           // Design System component
})

@Component({
  selector: 'os-form-field'      // Molecule component
})

@Component({
  selector: 'os-data-table'       // Organism component
})

@Component({
  selector: 'os-dashboard-layout' // Template component
})
```

#### Classes e Arquivos

```typescript
// ✅ Classes: PascalCase
export class OsButtonComponent {}
export class OsFormFieldComponent {}
export class OsDataTableComponent {}

// ✅ Arquivos: kebab-case
os - button.component.ts;
os - form - field.component.ts;
os - data - table.component.ts;
```

#### Métodos e Variáveis

```typescript
// ✅ Métodos e variáveis: camelCase
public createButton() {}
public getVariant() {}
private validateInput() {}

const buttonVariant = 'primary';
const isDisabled = false;
const hasIcon = true;
```

#### Constantes

```typescript
// ✅ SCREAMING_SNAKE_CASE para constantes globais
const MAX_BUTTON_SIZE = 'large';
const DEFAULT_VARIANT = 'primary';
const ANIMATION_DURATION = 300;

// ✅ camelCase para constantes locais
const defaultButtonConfig = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
};
```

### 🏗️ Padrões Arquiteturais

#### Standalone Components

```typescript
// ✅ Standalone components obrigatório
@Component({
  selector: 'os-button',
  template: `...`,
  styleUrls: ['./os-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsButtonComponent {
  // Implementation
}
```

#### Signals para Estado Reativo

```typescript
// ✅ Signals para estado reativo
export class OsButtonComponent {
  variant = input<'primary' | 'secondary' | 'tertiary' | 'danger'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  disabled = input(false);
  loading = input(false);

  onClick = output<MouseEvent>();

  // Computed properties
  protected buttonClass = computed(() => {
    return [
      'os-button',
      `os-button--${this.variant()}`,
      `os-button--${this.size()}`,
      this.disabled() ? 'os-button--disabled' : '',
      this.loading() ? 'os-button--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
```

#### Control Flow Nativo

```typescript
// ✅ Control flow nativo
template: `
  @if (loading()) {
    <os-spinner />
  } @else {
    <button [class]="buttonClass()" (click)="handleClick($event)">
      @if (icon() && !loading()) {
        <os-icon [name]="icon()" />
      }
      <ng-content />
    </button>
  }
`;
```

### 🧪 Padrões de Testes

#### Estrutura AAA (Arrange, Act, Assert)

```typescript
// ✅ Testes unitários com estrutura AAA
describe('OsButtonComponent', () => {
  describe('click handling', () => {
    it('should emit click event when button is clicked', () => {
      // Arrange
      const component = new OsButtonComponent();
      const clickSpy = jest.fn();
      component.onClick.subscribe(clickSpy);

      // Act
      component.handleClick(new MouseEvent('click'));

      // Assert
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
```

#### Test Factories

```typescript
// ✅ Factory pattern para testes
export class OsButtonTestFactory {
  public static create(overrides: Partial<OsButtonProps> = {}): OsButtonProps {
    return {
      variant: 'primary',
      size: 'medium',
      disabled: false,
      loading: false,
      ...overrides,
    };
  }
}
```

### 🔒 Segurança e Performance

#### Input Sanitization

```typescript
// ✅ Sanitização de inputs
export class OsInputComponent {
  public sanitizeInput(value: string): string {
    return value.trim().replace(/[<>]/g, '');
  }
}
```

#### OnPush Strategy

```typescript
// ✅ OnPush obrigatório para performance
@Component({
  selector: 'os-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsButtonComponent {
  // Implementation
}
```

### 🚨 Anti-Padrões a Evitar

#### ❌ Comentários Desnecessários

```typescript
// ❌ NUNCA adicionar comentários óbvios
export class OsButtonComponent {
  // This method creates a button - DESNECESSÁRIO
  public createButton() {}
}
```

#### ❌ Código Comentado

```typescript
// ❌ NUNCA deixar código comentado
export class OsButtonComponent {
  public handleClick() {
    // const oldCode = 'removed';  ← DELETAR
    this.onClick.emit(event);
  }
}
```

#### ❌ Console.log

```typescript
// ❌ NUNCA deixar console.log no código
export class OsButtonComponent {
  public handleClick() {
    // console.log('Button clicked');  ← REMOVER
    this.onClick.emit(event);
  }
}
```

## 📚 Referências

- **Meta Specs**: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs
- **Code Standards**: /home/danilo/workspace/projeto-orca-sonhos/orca-sonhos-meta-specs/technical/code-standards/
- **Angular Material**: https://material.angular.dev/
- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **Angular Best Practices**: Configuração atual do projeto
- **Design Tokens**: https://spectrum.adobe.com/page/design-tokens/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
