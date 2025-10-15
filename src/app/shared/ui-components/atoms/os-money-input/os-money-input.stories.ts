import type { Meta, StoryObj } from '@storybook/angular';
import { OsMoneyInputComponent } from './os-money-input.component';

const meta: Meta<OsMoneyInputComponent> = {
  title: 'Design System/Atoms/Money Input',
  component: OsMoneyInputComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de entrada de valores monetários do Design System Orca Sonhos com 3 tamanhos, formatação automática e validação.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do campo de dinheiro',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do campo',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto placeholder',
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
    readonly: {
      control: { type: 'boolean' },
      description: 'Estado somente leitura',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    value: {
      control: { type: 'number' },
      description: 'Valor monetário',
    },
    allowNegative: {
      control: { type: 'boolean' },
      description: 'Permitir valores negativos',
    },
    isFormatting: {
      control: { type: 'boolean' },
      description: 'Estado de formatação',
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
type Story = StoryObj<OsMoneyInputComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    label: 'Valor',
    placeholder: '0,00',
    helperText: 'Digite o valor em reais',
  },
};

export const WithValue: Story = {
  args: {
    size: 'medium',
    label: 'Salário',
    placeholder: '0,00',
    value: 5000.5,
    helperText: 'Valor do salário',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Valor pequeno',
    placeholder: '0,00',
    helperText: 'Campo pequeno',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Valor grande',
    placeholder: '0,00',
    helperText: 'Campo grande',
  },
};

export const Required: Story = {
  args: {
    size: 'medium',
    label: 'Valor obrigatório',
    placeholder: '0,00',
    required: true,
    helperText: 'Este campo é obrigatório',
  },
};

export const WithError: Story = {
  args: {
    size: 'medium',
    label: 'Valor com erro',
    placeholder: '0,00',
    errorMessage: 'Valor inválido',
    helperText: 'Corrija o erro',
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    label: 'Valor desabilitado',
    placeholder: '0,00',
    disabled: true,
    helperText: 'Campo desabilitado',
  },
};

export const Readonly: Story = {
  args: {
    size: 'medium',
    label: 'Valor somente leitura',
    placeholder: '0,00',
    readonly: true,
    value: 1000.0,
    helperText: 'Campo somente leitura',
  },
};

export const HighValue: Story = {
  args: {
    size: 'medium',
    label: 'Valor alto',
    placeholder: '0,00',
    value: 999999.99,
    helperText: 'Valor alto formatado',
  },
};

export const ZeroValue: Story = {
  args: {
    size: 'medium',
    label: 'Valor zero',
    placeholder: '0,00',
    value: 0,
    helperText: 'Valor zero',
  },
};

export const NegativeValue: Story = {
  args: {
    size: 'medium',
    label: 'Valor negativo',
    placeholder: '0,00',
    value: -500.75,
    helperText: 'Valor negativo',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-money-input
          size="small"
          label="Valor pequeno"
          placeholder="0,00"
          helperText="Tamanho pequeno">
        </os-money-input>
        <os-money-input
          size="medium"
          label="Valor médio"
          placeholder="0,00"
          helperText="Tamanho médio">
        </os-money-input>
        <os-money-input
          size="large"
          label="Valor grande"
          placeholder="0,00"
          helperText="Tamanho grande">
        </os-money-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do campo de dinheiro.',
      },
    },
  },
};

export const DifferentValues: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-money-input
          label="Valor baixo"
          placeholder="0,00"
          [value]="10.50"
          helperText="Valor baixo">
        </os-money-input>
        <os-money-input
          label="Valor médio"
          placeholder="0,00"
          [value]="1500.75"
          helperText="Valor médio">
        </os-money-input>
        <os-money-input
          label="Valor alto"
          placeholder="0,00"
          [value]="50000.00"
          helperText="Valor alto">
        </os-money-input>
        <os-money-input
          label="Valor negativo"
          placeholder="0,00"
          [value]="-250.30"
          helperText="Valor negativo">
        </os-money-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de diferentes valores monetários.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-money-input
          label="Estado normal"
          placeholder="0,00"
          helperText="Estado normal">
        </os-money-input>
        <os-money-input
          label="Estado com erro"
          placeholder="0,00"
          errorMessage="Valor inválido"
          helperText="Estado com erro">
        </os-money-input>
        <os-money-input
          label="Estado desabilitado"
          placeholder="0,00"
          [disabled]="true"
          helperText="Estado desabilitado">
        </os-money-input>
        <os-money-input
          label="Estado somente leitura"
          placeholder="0,00"
          [readonly]="true"
          [value]="1000.00"
          helperText="Estado somente leitura">
        </os-money-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do campo de dinheiro.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Formulário de Orçamento</h3>
        <os-money-input
          label="Renda mensal"
          placeholder="0,00"
          [value]="5000.00"
          [required]="true"
          helperText="Sua renda mensal">
        </os-money-input>
        <os-money-input
          label="Gastos com moradia"
          placeholder="0,00"
          [value]="1500.00"
          [required]="true"
          helperText="Aluguel, condomínio, etc.">
        </os-money-input>
        <os-money-input
          label="Gastos com alimentação"
          placeholder="0,00"
          [value]="800.00"
          [required]="true"
          helperText="Supermercado, restaurantes">
        </os-money-input>
        <os-money-input
          label="Gastos com transporte"
          placeholder="0,00"
          [value]="300.00"
          helperText="Combustível, transporte público">
        </os-money-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário de orçamento.',
      },
    },
  },
};

export const QuickEntry: Story = {
  args: {
    size: 'medium',
    label: 'Entrada rápida',
    placeholder: '0,00',
    helperText: 'Digite "100" para R$ 1,00',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração da entrada rápida para centavos. Digite "100" para obter R$ 1,00.',
      },
    },
  },
};

export const LargeValue: Story = {
  args: {
    size: 'medium',
    label: 'Valor alto',
    placeholder: '0,00',
    value: 50000.0,
    helperText: 'Valores >= R$ 10.000 são destacados visualmente',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração do destaque visual para valores grandes.',
      },
    },
  },
};

export const NegativeValues: Story = {
  args: {
    size: 'medium',
    label: 'Valor com negativos',
    placeholder: '0,00',
    allowNegative: true,
    value: -250.75,
    helperText: 'Permite valores negativos',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração do suporte a valores negativos.',
      },
    },
  },
};

export const EnhancedFeatures: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Funcionalidades Avançadas</h3>
        <os-money-input
          label="Entrada rápida"
          placeholder="0,00"
          helperText="Digite '100' para R$ 1,00">
        </os-money-input>
        <os-money-input
          label="Valor alto destacado"
          placeholder="0,00"
          [value]="25000.00"
          helperText="Valores >= R$ 10.000 são destacados">
        </os-money-input>
        <os-money-input
          label="Valores negativos"
          placeholder="0,00"
          [allowNegative]="true"
          [value]="-150.50"
          helperText="Suporte a valores negativos">
        </os-money-input>
        <os-money-input
          label="Formatação em tempo real"
          placeholder="0,00"
          helperText="Máscara aplicada automaticamente">
        </os-money-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das funcionalidades avançadas implementadas.',
      },
    },
  },
};
