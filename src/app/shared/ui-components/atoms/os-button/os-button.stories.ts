import type { Meta, StoryObj } from '@storybook/angular';
import { OsButtonComponent } from './os-button.component';

const meta: Meta<OsButtonComponent> = {
  title: 'Design System/Atoms/Button',
  component: OsButtonComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Botão do Design System Orca Sonhos com 4 variantes, 3 tamanhos, estados de loading e suporte a ícones.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      description: 'Variante visual do botão',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do botão',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    icon: {
      control: { type: 'text' },
      description: 'Ícone do botão (Font Awesome)',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Tipo do botão HTML',
    },
    buttonClick: {
      action: 'buttonClick',
      description: 'Evento de clique do botão',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsButtonComponent>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    icon: '',
    type: 'button',
  },
  render: (args) => ({
    props: args,
    template:
      '<os-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [type]="type" (buttonClick)="buttonClick($event)">Botão Padrão</os-button>',
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <os-button variant="primary">Primary</os-button>
        <os-button variant="secondary">Secondary</os-button>
        <os-button variant="tertiary">Tertiary</os-button>
        <os-button variant="danger">Danger</os-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do botão.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <os-button size="small">Small</os-button>
        <os-button size="medium">Medium</os-button>
        <os-button size="large">Large</os-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do botão.',
      },
    },
  },
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <os-button icon="fa fa-plus">Adicionar</os-button>
        <os-button icon="fa fa-edit" variant="secondary">Editar</os-button>
        <os-button icon="fa fa-trash" variant="danger">Excluir</os-button>
        <os-button icon="fa fa-save" variant="tertiary">Salvar</os-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Botões com ícones Font Awesome.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <os-button>Normal</os-button>
        <os-button disabled="true">Disabled</os-button>
        <os-button loading="true">Loading</os-button>
        <os-button disabled="true" loading="true">Disabled + Loading</os-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados do botão.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    icon: 'fa fa-check',
    type: 'button',
  },
  render: (args) => ({
    props: args,
    template:
      '<os-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [type]="type" (buttonClick)="buttonClick($event)">Botão Interativo</os-button>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Botão interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
