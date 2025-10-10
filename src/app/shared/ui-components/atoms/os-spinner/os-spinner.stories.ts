import type { Meta, StoryObj } from '@storybook/angular';
import { OsSpinnerComponent } from './os-spinner.component';

const meta: Meta<OsSpinnerComponent> = {
  title: 'Design System/Atoms/Spinner',
  component: OsSpinnerComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Spinner do Design System Orca Sonhos com 3 variantes, 3 tamanhos e animações suaves.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Variante visual do spinner',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Tamanho do spinner',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    ariaHidden: {
      control: { type: 'boolean' },
      description: 'Ocultar do leitor de tela',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsSpinnerComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    ariaLabel: 'Loading',
    ariaHidden: false,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-spinner [variant]="variant" [size]="size" [ariaLabel]="ariaLabel" [ariaHidden]="ariaHidden"></os-spinner>',
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="default"></os-spinner>
          <span>Default</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="dots"></os-spinner>
          <span>Dots</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="bars"></os-spinner>
          <span>Bars</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do spinner.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner size="xs"></os-spinner>
          <span>XS</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner size="sm"></os-spinner>
          <span>Small</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner size="md"></os-spinner>
          <span>Medium</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner size="lg"></os-spinner>
          <span>Large</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner size="xl"></os-spinner>
          <span>XL</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do spinner.',
      },
    },
  },
};

export const SpinnerVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="default"></os-spinner>
          <span>Default</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="primary"></os-spinner>
          <span>Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="success"></os-spinner>
          <span>Success</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="warning"></os-spinner>
          <span>Warning</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <os-spinner variant="error"></os-spinner>
          <span>Error</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinners com diferentes variantes.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner size="small"></os-spinner>
          <span>Carregando dados...</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner variant="dots" size="medium"></os-spinner>
          <span>Processando solicitação...</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner variant="bars" size="large"></os-spinner>
          <span>Salvando alterações...</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de uso em diferentes estados de carregamento.',
      },
    },
  },
};

export const InButtons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <button style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px;">
          <os-spinner size="small" color="#1976d2"></os-spinner>
          Carregando...
        </button>
        <button style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px;">
          <os-spinner variant="dots" size="small" color="#4caf50"></os-spinner>
          Salvando...
        </button>
        <button style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px;">
          <os-spinner variant="bars" size="small" color="#ff9800"></os-spinner>
          Enviando...
        </button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinners integrados em botões para indicar ações em progresso.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'md',
    ariaLabel: 'Loading',
    ariaHidden: false,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-spinner [variant]="variant" [size]="size" [ariaLabel]="ariaLabel" [ariaHidden]="ariaHidden"></os-spinner>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinner interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
