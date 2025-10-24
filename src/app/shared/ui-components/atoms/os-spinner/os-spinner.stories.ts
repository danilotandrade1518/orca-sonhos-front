import type { Meta, StoryObj } from '@storybook/angular';
import { OsSpinnerComponent } from './os-spinner.component';

const meta: Meta<OsSpinnerComponent> = {
  title: 'Design System/Atoms/Spinner',
  component: OsSpinnerComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Spinner do Design System Orca Sonhos com variantes semânticas, tamanhos responsivos, acessibilidade WCAG 2.1 AA e suporte a overlay para loading de página.',
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
    type: {
      control: { type: 'select' },
      options: ['default', 'overlay'],
      description: 'Tipo do spinner (default ou overlay para página)',
    },
    role: {
      control: { type: 'select' },
      options: ['status', 'progressbar', 'presentation'],
      description: 'Role de acessibilidade',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    ariaHidden: {
      control: { type: 'boolean' },
      description: 'Ocultar do leitor de tela',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Ativar animações',
    },
    fadeIn: {
      control: { type: 'boolean' },
      description: 'Ativar fade in',
    },
    fadeOut: {
      control: { type: 'boolean' },
      description: 'Ativar fade out',
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
    type: 'default',
    role: 'status',
    ariaLabel: 'Loading',
    ariaHidden: false,
    animated: true,
    fadeIn: true,
    fadeOut: true,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-spinner [variant]="variant" [size]="size" [type]="type" [role]="role" [ariaLabel]="ariaLabel" [ariaHidden]="ariaHidden" [animated]="animated" [fadeIn]="fadeIn" [fadeOut]="fadeOut"></os-spinner>',
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

export const OverlayType: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    type: 'overlay',
    role: 'status',
    ariaLabel: 'Loading page',
    animated: true,
    fadeIn: true,
    fadeOut: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; height: 200px; background: #f5f5f5; border: 1px solid #ddd;">
        <p style="padding: 20px;">Conteúdo da página</p>
        <os-spinner
          [variant]="variant"
          [size]="size"
          [type]="type"
          [role]="role"
          [ariaLabel]="ariaLabel"
          [animated]="animated"
          [fadeIn]="fadeIn"
          [fadeOut]="fadeOut">
        </os-spinner>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinner tipo overlay para loading de página completa.',
      },
    },
  },
};

export const AccessibilityRoles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner role="status" ariaLabel="Loading data" size="sm"></os-spinner>
          <span>Status role - anuncia mudanças</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner role="progressbar" ariaLabel="Progress: 50%" size="sm"></os-spinner>
          <span>Progressbar role - indica progresso</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner role="presentation" ariaHidden="true" size="sm"></os-spinner>
          <span>Presentation role - decorativo</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes roles de acessibilidade para diferentes contextos de uso.',
      },
    },
  },
};

export const AnimationStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner animated="true" fadeIn="true" size="md"></os-spinner>
          <span>Com animações (padrão)</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner animated="false" fadeIn="false" fadeOut="false" size="md"></os-spinner>
          <span>Sem animações</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <os-spinner animated="true" fadeIn="false" fadeOut="true" size="md"></os-spinner>
          <span>Apenas fade out</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados de animação do spinner.',
      },
    },
  },
};

export const ResponsiveSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <os-spinner size="xs"></os-spinner>
          <span>XS (16px)</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <os-spinner size="sm"></os-spinner>
          <span>SM (20px)</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <os-spinner size="md"></os-spinner>
          <span>MD (24px) - Padrão</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <os-spinner size="lg"></os-spinner>
          <span>LG (32px)</span>
        </div>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <os-spinner size="xl"></os-spinner>
          <span>XL (40px)</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos responsivos disponíveis com touch targets >= 44px em mobile.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'md',
    type: 'default',
    role: 'status',
    ariaLabel: 'Loading',
    ariaHidden: false,
    animated: true,
    fadeIn: true,
    fadeOut: true,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-spinner [variant]="variant" [size]="size" [type]="type" [role]="role" [ariaLabel]="ariaLabel" [ariaHidden]="ariaHidden" [animated]="animated" [fadeIn]="fadeIn" [fadeOut]="fadeOut"></os-spinner>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Spinner interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
