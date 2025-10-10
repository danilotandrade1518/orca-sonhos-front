import type { Meta, StoryObj } from '@storybook/angular';
import { OsLabelComponent } from './os-label.component';

const meta: Meta<OsLabelComponent> = {
  title: 'Design System/Atoms/Label',
  component: OsLabelComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Label do Design System Orca Sonhos com 7 variantes, 3 tamanhos, 5 pesos e suporte a acessibilidade.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Variante visual do label',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do label',
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'regular', 'medium', 'semibold', 'bold'],
      description: 'Peso da fonte do label',
    },
    for: {
      control: { type: 'text' },
      description: 'ID do elemento associado',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    ariaDescribedBy: {
      control: { type: 'text' },
      description: 'ID do elemento que descreve o label',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsLabelComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight" [for]="for" [required]="required" [disabled]="disabled" [ariaDescribedBy]="ariaDescribedBy" [ariaLabel]="ariaLabel">Label padrão</os-label>`,
  }),
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label primário</os-label>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label secundário</os-label>`,
  }),
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label de sucesso</os-label>`,
  }),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label de aviso</os-label>`,
  }),
};

export const Error: Story = {
  args: {
    variant: 'error',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label de erro</os-label>`,
  }),
};

export const Info: Story = {
  args: {
    variant: 'info',
    size: 'medium',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label informativo</os-label>`,
  }),
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label pequeno</os-label>`,
  }),
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    weight: 'regular',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label grande</os-label>`,
  }),
};

export const Required: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    weight: 'regular',
    required: true,
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight" [required]="required">Label obrigatório</os-label>`,
  }),
};

export const Disabled: Story = {
  args: {
    variant: 'default',
    size: 'medium',
    weight: 'regular',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight" [disabled]="disabled">Label desabilitado</os-label>`,
  }),
};

export const Bold: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    weight: 'bold',
  },
  render: (args) => ({
    props: args,
    template: `<os-label [variant]="variant" [size]="size" [weight]="weight">Label em negrito</os-label>`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-label variant="primary" size="small" weight="regular">Label pequeno</os-label>
        <os-label variant="primary" size="medium" weight="regular">Label médio</os-label>
        <os-label variant="primary" size="large" weight="regular">Label grande</os-label>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do label.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-label variant="default" size="medium" weight="regular">Label padrão</os-label>
        <os-label variant="primary" size="medium" weight="regular">Label primário</os-label>
        <os-label variant="secondary" size="medium" weight="regular">Label secundário</os-label>
        <os-label variant="success" size="medium" weight="regular">Label de sucesso</os-label>
        <os-label variant="warning" size="medium" weight="regular">Label de aviso</os-label>
        <os-label variant="error" size="medium" weight="regular">Label de erro</os-label>
        <os-label variant="info" size="medium" weight="regular">Label informativo</os-label>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis do label.',
      },
    },
  },
};

export const AllWeights: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-label variant="primary" size="medium" weight="light">Label light</os-label>
        <os-label variant="primary" size="medium" weight="regular">Label regular</os-label>
        <os-label variant="primary" size="medium" weight="medium">Label medium</os-label>
        <os-label variant="primary" size="medium" weight="semibold">Label semibold</os-label>
        <os-label variant="primary" size="medium" weight="bold">Label bold</os-label>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os pesos de fonte disponíveis do label.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-label variant="primary" size="medium" weight="regular">Label normal</os-label>
        <os-label variant="primary" size="medium" weight="regular" [required]="true">Label obrigatório</os-label>
        <os-label variant="default" size="medium" weight="regular" [disabled]="true">Label desabilitado</os-label>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do label.',
      },
    },
  },
};

export const WithFormField: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <os-label variant="primary" size="medium" weight="regular" for="email-input">Email</os-label>
        <input id="email-input" type="email" placeholder="Digite seu email" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso do label associado a um campo de formulário.',
      },
    },
  },
};
