import type { Meta, StoryObj } from '@storybook/angular';
import { OsInputComponent } from './os-input.component';

const meta: Meta<OsInputComponent> = {
  title: 'Design System/Atoms/Input',
  component: OsInputComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de entrada do Design System Orca Sonhos com 3 variantes, 3 tamanhos, validação e estados visuais.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do input',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Tipo do input HTML',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto placeholder',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do input',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Texto de ajuda',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Mensagem de erro',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Estado somente leitura',
    },
    clearable: {
      control: { type: 'boolean' },
      description: 'Permitir limpar o campo',
    },
    prefixIcon: {
      control: { type: 'text' },
      description: 'Ícone prefixo',
    },
    suffixIcon: {
      control: { type: 'text' },
      description: 'Ícone sufixo',
    },
    value: {
      control: { type: 'text' },
      description: 'Valor do input',
    },
    valueChange: {
      action: 'valueChange',
      description: 'Evento de mudança de valor',
    },
    focusEvent: {
      action: 'focusEvent',
      description: 'Evento de foco',
    },
    blurEvent: {
      action: 'blurEvent',
      description: 'Evento de perda de foco',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsInputComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    type: 'text',
    placeholder: 'Digite aqui...',
    label: 'Campo de Texto',
    helperText: '',
    errorMessage: '',
    required: false,
    disabled: false,
    readonly: false,
    clearable: false,
    prefixIcon: '',
    suffixIcon: '',
    value: '',
  },
  render: (args) => ({
    props: args,
    template:
      '<os-input [size]="size" [type]="type" [placeholder]="placeholder" [label]="label" [helperText]="helperText" [errorMessage]="errorMessage" [required]="required" [disabled]="disabled" [readonly]="readonly" [clearable]="clearable" [prefixIcon]="prefixIcon" [suffixIcon]="suffixIcon" [value]="value" (valueChange)="valueChange($event)" (focusEvent)="focusEvent($event)" (blurEvent)="blurEvent($event)"></os-input>',
  }),
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input label="Com ícone prefixo" placeholder="Digite aqui..." prefixIcon="search"></os-input>
        <os-input label="Com ícone sufixo" placeholder="Digite aqui..." suffixIcon="visibility"></os-input>
        <os-input label="Com ambos os ícones" placeholder="Digite aqui..." prefixIcon="search" suffixIcon="visibility"></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inputs com ícones prefixo e sufixo.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input size="small" label="Small" placeholder="Tamanho pequeno"></os-input>
        <os-input size="medium" label="Medium" placeholder="Tamanho médio"></os-input>
        <os-input size="large" label="Large" placeholder="Tamanho grande"></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do input.',
      },
    },
  },
};

export const Types: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input type="text" label="Texto" placeholder="Digite um texto"></os-input>
        <os-input type="email" label="Email" placeholder="seu@email.com"></os-input>
        <os-input type="password" label="Senha" placeholder="Digite sua senha"></os-input>
        <os-input type="number" label="Número" placeholder="Digite um número"></os-input>
        <os-input type="tel" label="Telefone" placeholder="(11) 99999-9999"></os-input>
        <os-input type="url" label="URL" placeholder="https://exemplo.com"></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tipos de input disponíveis.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input label="Normal" placeholder="Estado normal"></os-input>
        <os-input label="Required" placeholder="Campo obrigatório" required="true"></os-input>
        <os-input label="Disabled" placeholder="Campo desabilitado" disabled="true"></os-input>
        <os-input label="Readonly" placeholder="Campo somente leitura" readonly="true" value="Valor fixo"></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados do input.',
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input label="Email" type="email" placeholder="Digite um email válido" required="true"></os-input>
        <os-input label="Senha" type="password" placeholder="Mínimo 8 caracteres" maxLength="20"></os-input>
        <os-input label="Telefone" type="tel" placeholder="(11) 99999-9999" maxLength="15"></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inputs com validação e restrições.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    size: 'medium',
    type: 'text',
    placeholder: 'Digite aqui...',
    label: 'Campo Interativo',
    helperText: '',
    errorMessage: '',
    required: false,
    disabled: false,
    readonly: false,
    clearable: false,
    prefixIcon: '',
    suffixIcon: '',
    value: '',
  },
  render: (args) => ({
    props: args,
    template:
      '<os-input [size]="size" [type]="type" [placeholder]="placeholder" [label]="label" [helperText]="helperText" [errorMessage]="errorMessage" [required]="required" [disabled]="disabled" [readonly]="readonly" [clearable]="clearable" [prefixIcon]="prefixIcon" [suffixIcon]="suffixIcon" [value]="value" (valueChange)="valueChange($event)" (focusEvent)="focusEvent($event)" (blurEvent)="blurEvent($event)"></os-input>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Input interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input
          label="Campo Obrigatório"
          placeholder="Digite aqui..."
          required="true"
          helperText="Este campo é obrigatório"
        ></os-input>
        <os-input
          label="Campo com Erro"
          placeholder="Digite aqui..."
          errorMessage="Este campo é obrigatório"
        ></os-input>
        <os-input
          label="Campo Desabilitado"
          placeholder="Campo desabilitado"
          disabled="true"
        ></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inputs com diferentes estados de acessibilidade WCAG 2.1 AA.',
      },
    },
  },
};

export const Responsive: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="max-width: 200px;">
          <os-input size="small" label="Mobile (Small)" placeholder="Tamanho pequeno"></os-input>
        </div>
        <div style="max-width: 300px;">
          <os-input size="medium" label="Tablet (Medium)" placeholder="Tamanho médio"></os-input>
        </div>
        <div style="max-width: 400px;">
          <os-input size="large" label="Desktop (Large)" placeholder="Tamanho grande"></os-input>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inputs responsivos para diferentes breakpoints (mobile, tablet, desktop).',
      },
    },
  },
};

export const MicroInteractions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input
          label="Hover Effect"
          placeholder="Passe o mouse sobre mim"
          helperText="Observe o efeito hover"
        ></os-input>
        <os-input
          label="Focus Effect"
          placeholder="Clique para focar"
          helperText="Observe o efeito de foco"
        ></os-input>
        <os-input
          label="Clearable"
          placeholder="Digite algo e limpe"
          clearable="true"
          value="Texto para limpar"
          helperText="Use o botão X para limpar"
        ></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inputs demonstrando micro-interações e animações.',
      },
    },
  },
};

export const DesignTokens: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
        <os-input
          label="Primary Colors"
          placeholder="Usando tokens primários"
          helperText="Cores do sistema de design"
        ></os-input>
        <os-input
          label="Error State"
          placeholder="Estado de erro"
          errorMessage="Mensagem de erro"
        ></os-input>
        <os-input
          label="Success State"
          placeholder="Estado de sucesso"
          helperText="Campo válido"
        ></os-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Inputs demonstrando integração com design tokens do sistema.',
      },
    },
  },
};
