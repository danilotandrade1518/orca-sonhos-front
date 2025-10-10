import type { Meta, StoryObj } from '@storybook/angular';
import { OsSliderComponent } from './os-slider.component';

const meta: Meta<OsSliderComponent> = {
  title: 'Design System/Atoms/Slider',
  component: OsSliderComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Slider do Design System Orca Sonhos com 3 tamanhos, valores customizáveis e integração com Angular Forms.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do slider',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do slider',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Texto de ajuda',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Mensagem de erro',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    value: {
      control: { type: 'number' },
      description: 'Valor atual do slider',
    },
    min: {
      control: { type: 'number' },
      description: 'Valor mínimo',
    },
    max: {
      control: { type: 'number' },
      description: 'Valor máximo',
    },
    step: {
      control: { type: 'number' },
      description: 'Incremento do slider',
    },
    showValue: {
      control: { type: 'boolean' },
      description: 'Mostrar valor atual',
    },
    showMinMax: {
      control: { type: 'boolean' },
      description: 'Mostrar valores mínimo e máximo',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    valueChange: {
      action: 'valueChange',
      description: 'Evento de mudança de valor',
    },
    blurEvent: {
      action: 'blurEvent',
      description: 'Evento de perda de foco',
    },
    focusEvent: {
      action: 'focusEvent',
      description: 'Evento de foco',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsSliderComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    label: 'Valor',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    showMinMax: false,
    helperText: 'Ajuste o valor desejado',
  },
};

export const WithMinMax: Story = {
  args: {
    size: 'medium',
    label: 'Valor com min/max',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    showMinMax: true,
    helperText: 'Valor entre 0 e 100',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Slider pequeno',
    value: 30,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    helperText: 'Tamanho pequeno',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Slider grande',
    value: 70,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    helperText: 'Tamanho grande',
  },
};

export const WithoutValue: Story = {
  args: {
    size: 'medium',
    label: 'Slider sem valor',
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    showValue: false,
    showMinMax: true,
    helperText: 'Sem exibição de valor',
  },
};

export const WithStep: Story = {
  args: {
    size: 'medium',
    label: 'Slider com step',
    value: 25,
    min: 0,
    max: 100,
    step: 5,
    showValue: true,
    showMinMax: true,
    helperText: 'Incremento de 5',
  },
};

export const Required: Story = {
  args: {
    size: 'medium',
    label: 'Slider obrigatório',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    required: true,
    helperText: 'Este campo é obrigatório',
  },
};

export const WithError: Story = {
  args: {
    size: 'medium',
    label: 'Slider com erro',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    errorMessage: 'Valor inválido',
    helperText: 'Corrija o erro',
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    label: 'Slider desabilitado',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    disabled: true,
    helperText: 'Campo desabilitado',
  },
};

export const CustomRange: Story = {
  args: {
    size: 'medium',
    label: 'Slider com range customizado',
    value: 75,
    min: 10,
    max: 200,
    step: 10,
    showValue: true,
    showMinMax: true,
    helperText: 'Range de 10 a 200',
  },
};

export const DecimalStep: Story = {
  args: {
    size: 'medium',
    label: 'Slider com step decimal',
    value: 2.5,
    min: 0,
    max: 10,
    step: 0.5,
    showValue: true,
    showMinMax: true,
    helperText: 'Incremento de 0.5',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-slider
          size="small"
          label="Slider pequeno"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          helperText="Tamanho pequeno">
        </os-slider>
        <os-slider
          size="medium"
          label="Slider médio"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          helperText="Tamanho médio">
        </os-slider>
        <os-slider
          size="large"
          label="Slider grande"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          helperText="Tamanho grande">
        </os-slider>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do slider.',
      },
    },
  },
};

export const DifferentRanges: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-slider
          label="Idade (0-100)"
          [value]="25"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Selecione sua idade">
        </os-slider>
        <os-slider
          label="Salário (R$ 1.000 - R$ 50.000)"
          [value]="15000"
          [min]="1000"
          [max]="50000"
          [step]="1000"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Faixa salarial desejada">
        </os-slider>
        <os-slider
          label="Nota (0-10)"
          [value]="7.5"
          [min]="0"
          [max]="10"
          [step]="0.5"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Avalie de 0 a 10">
        </os-slider>
        <os-slider
          label="Percentual (0-100%)"
          [value]="75"
          [min]="0"
          [max]="100"
          [step]="5"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Percentual de conclusão">
        </os-slider>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de diferentes ranges e contextos de uso.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-slider
          label="Estado normal"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          helperText="Estado normal">
        </os-slider>
        <os-slider
          label="Estado com erro"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          errorMessage="Valor inválido"
          helperText="Estado com erro">
        </os-slider>
        <os-slider
          label="Estado desabilitado"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          [disabled]="true"
          helperText="Estado desabilitado">
        </os-slider>
        <os-slider
          label="Estado obrigatório"
          [value]="50"
          [min]="0"
          [max]="100"
          [step]="1"
          [showValue]="true"
          [required]="true"
          helperText="Estado obrigatório">
        </os-slider>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do slider.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 500px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Configurações de Orçamento</h3>

        <os-slider
          label="Renda mensal (R$)"
          [value]="5000"
          [min]="1000"
          [max]="50000"
          [step]="500"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Sua renda mensal">
        </os-slider>

        <os-slider
          label="Percentual para economia (%)"
          [value]="20"
          [min]="0"
          [max]="100"
          [step]="5"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Quanto deseja economizar">
        </os-slider>

        <os-slider
          label="Meta de gastos com moradia (R$)"
          [value]="1500"
          [min]="500"
          [max]="5000"
          [step]="100"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Gastos mensais com moradia">
        </os-slider>

        <os-slider
          label="Tempo para atingir meta (anos)"
          [value]="5"
          [min]="1"
          [max]="20"
          [step]="1"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Prazo para atingir sua meta">
        </os-slider>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário de configurações de orçamento.',
      },
    },
  },
};

export const InteractiveExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Calculadora de Investimento</h3>

        <os-slider
          label="Valor inicial (R$)"
          [value]="10000"
          [min]="1000"
          [max]="100000"
          [step]="1000"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Valor inicial do investimento">
        </os-slider>

        <os-slider
          label="Aporte mensal (R$)"
          [value]="500"
          [min]="0"
          [max]="5000"
          [step]="100"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Valor mensal a ser investido">
        </os-slider>

        <os-slider
          label="Taxa de juros (% a.a.)"
          [value]="8"
          [min]="0"
          [max]="20"
          [step]="0.5"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Taxa de juros anual">
        </os-slider>

        <os-slider
          label="Período (anos)"
          [value]="10"
          [min]="1"
          [max]="30"
          [step]="1"
          [showValue]="true"
          [showMinMax]="true"
          helperText="Tempo de investimento">
        </os-slider>

        <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin-top: 16px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Resultado estimado:</h4>
          <p style="margin: 0; font-size: 18px; font-weight: 600; color: #2e7d32;">
            R$ 150.000,00
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
            Valor total ao final do período
          </p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo interativo de calculadora de investimento.',
      },
    },
  },
};
