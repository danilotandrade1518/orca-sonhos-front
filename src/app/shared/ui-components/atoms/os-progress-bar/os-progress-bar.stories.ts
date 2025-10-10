import type { Meta, StoryObj } from '@storybook/angular';
import { OsProgressBarComponent } from './os-progress-bar.component';

const meta: Meta<OsProgressBarComponent> = {
  title: 'Design System/Atoms/Progress Bar',
  component: OsProgressBarComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Barra de progresso do Design System Orca Sonhos com 5 variantes, 3 tamanhos, animações e suporte a buffer.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Valor atual do progresso',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Valor máximo do progresso',
    },
    label: {
      control: { type: 'text' },
      description: 'Label da barra de progresso',
    },
    hint: {
      control: { type: 'text' },
      description: 'Dica adicional',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description: 'Mostrar porcentagem',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da barra de progresso',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Variante visual da barra de progresso',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Animação da barra de progresso',
    },
    striped: {
      control: { type: 'boolean' },
      description: 'Listras na barra de progresso',
    },
    bufferValue: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Valor do buffer (para modo buffer)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsProgressBarComponent>;

export const Default: Story = {
  args: {
    value: 50,
    max: 100,
    label: 'Progresso',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const Primary: Story = {
  args: {
    value: 75,
    max: 100,
    label: 'Progresso primário',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    value: 60,
    max: 100,
    label: 'Progresso secundário',
    showPercentage: true,
    size: 'medium',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    value: 100,
    max: 100,
    label: 'Progresso de sucesso',
    showPercentage: true,
    size: 'medium',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    value: 80,
    max: 100,
    label: 'Progresso de aviso',
    showPercentage: true,
    size: 'medium',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    value: 25,
    max: 100,
    label: 'Progresso de perigo',
    showPercentage: true,
    size: 'medium',
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    value: 40,
    max: 100,
    label: 'Progresso pequeno',
    showPercentage: true,
    size: 'small',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    value: 70,
    max: 100,
    label: 'Progresso grande',
    showPercentage: true,
    size: 'large',
    variant: 'primary',
  },
};

export const Animated: Story = {
  args: {
    value: 65,
    max: 100,
    label: 'Progresso animado',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
    animated: true,
  },
};

export const Striped: Story = {
  args: {
    value: 45,
    max: 100,
    label: 'Progresso listrado',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
    striped: true,
  },
};

export const AnimatedStriped: Story = {
  args: {
    value: 55,
    max: 100,
    label: 'Progresso animado e listrado',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
    animated: true,
    striped: true,
  },
};

export const WithHint: Story = {
  args: {
    value: 30,
    max: 100,
    label: 'Progresso com dica',
    hint: 'Faltam 70% para completar',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const WithoutPercentage: Story = {
  args: {
    value: 85,
    max: 100,
    label: 'Progresso sem porcentagem',
    showPercentage: false,
    size: 'medium',
    variant: 'primary',
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 90,
    max: 100,
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const Buffer: Story = {
  args: {
    value: 40,
    max: 100,
    bufferValue: 70,
    label: 'Progresso com buffer',
    showPercentage: true,
    size: 'medium',
    variant: 'primary',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-progress-bar
          [value]="50"
          [max]="100"
          label="Progresso pequeno"
          size="small"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="50"
          [max]="100"
          label="Progresso médio"
          size="medium"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="50"
          [max]="100"
          label="Progresso grande"
          size="large"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis da barra de progresso.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-progress-bar
          [value]="60"
          [max]="100"
          label="Progresso primário"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="60"
          [max]="100"
          label="Progresso secundário"
          variant="secondary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="60"
          [max]="100"
          label="Progresso de sucesso"
          variant="success"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="60"
          [max]="100"
          label="Progresso de aviso"
          variant="warning"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="60"
          [max]="100"
          label="Progresso de perigo"
          variant="danger"
          [showPercentage]="true">
        </os-progress-bar>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis da barra de progresso.',
      },
    },
  },
};

export const DifferentValues: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-progress-bar
          [value]="0"
          [max]="100"
          label="Início"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="25"
          [max]="100"
          label="25%"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="50"
          [max]="100"
          label="50%"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="75"
          [max]="100"
          label="75%"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="100"
          [max]="100"
          label="Completo"
          variant="success"
          [showPercentage]="true">
        </os-progress-bar>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de diferentes valores de progresso.',
      },
    },
  },
};

export const AnimatedExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-progress-bar
          [value]="70"
          [max]="100"
          label="Progresso normal"
          variant="primary"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="70"
          [max]="100"
          label="Progresso animado"
          variant="primary"
          [animated]="true"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="70"
          [max]="100"
          label="Progresso listrado"
          variant="primary"
          [striped]="true"
          [showPercentage]="true">
        </os-progress-bar>
        <os-progress-bar
          [value]="70"
          [max]="100"
          label="Progresso animado e listrado"
          variant="primary"
          [animated]="true"
          [striped]="true"
          [showPercentage]="true">
        </os-progress-bar>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de diferentes estilos de animação.',
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 500px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Progresso do Orçamento</h3>

        <div>
          <os-progress-bar
            [value]="75"
            [max]="100"
            label="Meta de economia mensal"
            hint="R$ 750 de R$ 1.000"
            variant="success"
            [showPercentage]="true">
          </os-progress-bar>
        </div>

        <div>
          <os-progress-bar
            [value]="45"
            [max]="100"
            label="Gastos com alimentação"
            hint="R$ 450 de R$ 1.000"
            variant="warning"
            [showPercentage]="true">
          </os-progress-bar>
        </div>

        <div>
          <os-progress-bar
            [value]="90"
            [max]="100"
            label="Gastos com transporte"
            hint="R$ 450 de R$ 500"
            variant="danger"
            [showPercentage]="true">
          </os-progress-bar>
        </div>

        <div>
          <os-progress-bar
            [value]="30"
            [max]="100"
            label="Gastos com lazer"
            hint="R$ 150 de R$ 500"
            variant="primary"
            [showPercentage]="true">
          </os-progress-bar>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso real em um dashboard de orçamento.',
      },
    },
  },
};
