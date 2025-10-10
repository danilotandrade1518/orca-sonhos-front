# Storybook - Design System Orca Sonhos

Este documento contém informações sobre como usar e configurar o Storybook para o Design System Orca Sonhos.

## 🚀 Como Rodar o Storybook

### Desenvolvimento

```bash
npm run storybook
```

Acesse: http://localhost:6006

### Build de Produção

```bash
npm run build-storybook
```

O build será gerado na pasta `storybook-static/`

## 📁 Estrutura de Stories

### Padrão de Nomenclatura

- **Arquivos**: `[component-name].stories.ts`
- **Títulos**: `Design System/[Level]/[Component]`
- **Exemplo**: `Design System/Atoms/Button`

### Estrutura de Diretórios

```
src/app/shared/ui-components/
├── atoms/
│   ├── os-button/
│   │   └── os-button.stories.ts
│   ├── os-input/
│   │   └── os-input.stories.ts
│   └── ...
├── molecules/
│   └── ...
├── organisms/
│   └── ...
└── templates/
    └── ...
```

## 📝 Como Criar Novas Stories

### Template Básico

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { SeuComponenteComponent } from './seu-componente.component';

const meta: Meta<SeuComponenteComponent> = {
  title: 'Design System/Atoms/SeuComponente',
  component: SeuComponenteComponent,
  parameters: {
    docs: {
      description: {
        component: 'Descrição do componente...',
      },
    },
  },
  argTypes: {
    // Configuração dos controles
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SeuComponenteComponent>;

export const Default: Story = {
  args: {
    // Propriedades padrão
  },
  render: (args) => ({
    props: args,
    template: '<seu-componente [prop]="prop" (event)="event($event)"></seu-componente>',
  }),
};
```

### Stories Recomendadas

1. **Default**: Story básica com propriedades padrão
2. **Variants**: Todas as variantes do componente
3. **Sizes**: Todos os tamanhos disponíveis
4. **States**: Diferentes estados (disabled, loading, etc.)
5. **Interactive**: Story com controles para testar todas as propriedades

## 🎛️ Configuração de Controles

### Tipos de Controles Disponíveis

```typescript
argTypes: {
  // Select
  variant: {
    control: { type: 'select' },
    options: ['option1', 'option2'],
    description: 'Descrição da propriedade'
  },

  // Boolean
  disabled: {
    control: { type: 'boolean' },
    description: 'Estado desabilitado'
  },

  // Text
  label: {
    control: { type: 'text' },
    description: 'Texto do label'
  },

  // Number
  maxLength: {
    control: { type: 'number' },
    description: 'Número máximo de caracteres'
  },

  // Color
  color: {
    control: { type: 'color' },
    description: 'Cor do componente'
  },

  // Actions
  onClick: {
    action: 'onClick',
    description: 'Evento de clique'
  }
}
```

## 🧪 Testes de Interação

### Play Functions

```typescript
import { userEvent, within } from '@storybook/test';

export const InteractiveTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    // Verificar resultado
  },
};
```

## ♿ Acessibilidade

### Configuração A11y

O addon de acessibilidade está configurado com:

- **Regras WCAG 2.1 AA**
- **Verificação de contraste de cor**
- **Navegação por teclado**
- **Gerenciamento de foco**

### Testes de Acessibilidade

```typescript
export const A11yTest: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard-navigation', enabled: true },
        ],
      },
    },
  },
};
```

## 📱 Responsividade

### Viewports Configurados

- **Mobile**: 375px × 667px
- **Tablet**: 768px × 1024px
- **Desktop**: 1024px × 768px
- **Large**: 1440px × 900px

### Testando Responsividade

Use o addon Viewport para testar em diferentes tamanhos de tela.

## 🎨 Backgrounds

### Backgrounds Disponíveis

- **Light**: #ffffff (padrão)
- **Dark**: #333333
- **Blue**: #1976d2

## 📚 Documentação Automática

### Autodocs

Todas as stories com tag `autodocs` geram documentação automática.

### Compodoc Integration

O Storybook está configurado para usar documentação JSDoc gerada pelo Compodoc:

```bash
npm run docs:json
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Módulo Não Encontrado

**Problema**: `Module not found: Error: Can't resolve 'zone.js'`
**Solução**: Verificar se todas as dependências do Angular estão instaladas

#### 2. Stories Não Aparecem

**Problema**: Stories não são detectadas
**Solução**: Verificar se o padrão de stories está correto no `main.ts`

#### 3. Estilos Não Aplicados

**Problema**: Componentes sem estilos
**Solução**: Verificar se `styles.scss` está sendo importado no `preview.ts`

#### 4. Erro de TypeScript

**Problema**: Erros de compilação TypeScript
**Solução**: Verificar configuração do `tsconfig.json` do Storybook

### Logs de Debug

```bash
npm run storybook -- --debug-webpack
```

## 📋 Checklist para Novas Stories

- [ ] Arquivo `.stories.ts` criado
- [ ] Meta configurado com título correto
- [ ] ArgTypes configurados para todas as propriedades
- [ ] Story Default criada
- [ ] Stories de variantes criadas
- [ ] Stories de tamanhos criadas
- [ ] Stories de estados criadas
- [ ] Story Interactive criada
- [ ] Documentação JSDoc adicionada ao componente
- [ ] Testes de acessibilidade funcionando
- [ ] Responsividade testada

## 🚀 Próximos Passos

### Atoms Restantes (11 componentes)

- os-avatar
- os-chip
- os-date-input
- os-icon
- os-label
- os-money-input
- os-progress-bar
- os-radio
- os-select
- os-slider
- os-toggle

### Molecules (16 componentes)

- os-alert
- os-card
- os-data-table
- os-date-picker
- os-dropdown
- os-filter-bar
- os-form-field
- os-form-group
- os-form-section
- os-form-actions
- os-form-validation
- os-form-layout
- os-form-wizard
- os-form-stepper
- os-form-tabs
- os-form-accordion

### Organisms (14 componentes)

- os-header
- os-sidebar
- os-footer
- os-data-grid
- os-form-section
- os-navigation
- os-modal
- os-page-header
- os-goal-progress
- os-budget-summary
- os-transaction-list
- os-category-manager
- os-budget-tracker
- os-goal-tracker

### Templates (8 componentes)

- os-dashboard-template
- os-form-template
- os-list-template
- os-detail-template
- os-wizard-template
- os-modal-template
- os-drawer-template
- os-panel-template

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar este README
2. Consultar documentação oficial do Storybook
3. Verificar logs de debug
4. Abrir issue no repositório
