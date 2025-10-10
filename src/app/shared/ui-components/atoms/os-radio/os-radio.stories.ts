import type { Meta, StoryObj } from '@storybook/angular';
import { OsRadioComponent } from './os-radio.component';

const meta: Meta<OsRadioComponent> = {
  title: 'Design System/Atoms/Radio',
  component: OsRadioComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Radio button do Design System Orca Sonhos com 6 variantes, 3 tamanhos e integração com Angular Forms.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do radio button',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Variante visual do radio button',
    },
    name: {
      control: { type: 'text' },
      description: 'Nome do grupo de radio buttons',
    },
    value: {
      control: { type: 'text' },
      description: 'Valor do radio button',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do radio button',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Estado selecionado',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    ariaDescribedBy: {
      control: { type: 'text' },
      description: 'ID do elemento que descreve o radio button',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    radioChange: {
      action: 'radioChange',
      description: 'Evento de mudança de valor',
    },
    radioBlurEvent: {
      action: 'radioBlurEvent',
      description: 'Evento de perda de foco',
    },
    radioFocusEvent: {
      action: 'radioFocusEvent',
      description: 'Evento de foco',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsRadioComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    variant: 'default',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção 1',
    checked: false,
  },
};

export const Primary: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção primária',
    checked: true,
  },
};

export const Secondary: Story = {
  args: {
    size: 'medium',
    variant: 'secondary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção secundária',
    checked: false,
  },
};

export const Success: Story = {
  args: {
    size: 'medium',
    variant: 'success',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção de sucesso',
    checked: false,
  },
};

export const Warning: Story = {
  args: {
    size: 'medium',
    variant: 'warning',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção de aviso',
    checked: false,
  },
};

export const Error: Story = {
  args: {
    size: 'medium',
    variant: 'error',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção de erro',
    checked: false,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção pequena',
    checked: false,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção grande',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção selecionada',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    variant: 'default',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção desabilitada',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção desabilitada e selecionada',
    checked: true,
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção obrigatória',
    checked: false,
    required: true,
  },
};

export const WithAccessibility: Story = {
  args: {
    size: 'medium',
    variant: 'primary',
    name: 'radio-group',
    value: 'option1',
    label: 'Opção com acessibilidade',
    checked: false,
    ariaLabel: 'Opção com acessibilidade',
    ariaDescribedBy: 'radio-description',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-radio
          size="small"
          variant="primary"
          name="size-group"
          value="small"
          label="Opção pequena">
        </os-radio>
        <os-radio
          size="medium"
          variant="primary"
          name="size-group"
          value="medium"
          label="Opção média">
        </os-radio>
        <os-radio
          size="large"
          variant="primary"
          name="size-group"
          value="large"
          label="Opção grande">
        </os-radio>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do radio button.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-radio
          variant="default"
          name="variant-group"
          value="default"
          label="Opção padrão">
        </os-radio>
        <os-radio
          variant="primary"
          name="variant-group"
          value="primary"
          label="Opção primária">
        </os-radio>
        <os-radio
          variant="secondary"
          name="variant-group"
          value="secondary"
          label="Opção secundária">
        </os-radio>
        <os-radio
          variant="success"
          name="variant-group"
          value="success"
          label="Opção de sucesso">
        </os-radio>
        <os-radio
          variant="warning"
          name="variant-group"
          value="warning"
          label="Opção de aviso">
        </os-radio>
        <os-radio
          variant="error"
          name="variant-group"
          value="error"
          label="Opção de erro">
        </os-radio>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis do radio button.',
      },
    },
  },
};

export const RadioGroup: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Escolha uma opção:</h3>
        <os-radio
          variant="primary"
          name="choice-group"
          value="option1"
          label="Primeira opção">
        </os-radio>
        <os-radio
          variant="primary"
          name="choice-group"
          value="option2"
          label="Segunda opção">
        </os-radio>
        <os-radio
          variant="primary"
          name="choice-group"
          value="option3"
          label="Terceira opção">
        </os-radio>
        <os-radio
          variant="primary"
          name="choice-group"
          value="option4"
          label="Quarta opção">
        </os-radio>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de um grupo de radio buttons.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-radio
          variant="primary"
          name="state-group"
          value="normal"
          label="Estado normal">
        </os-radio>
        <os-radio
          variant="primary"
          name="state-group"
          value="checked"
          label="Estado selecionado"
          [checked]="true">
        </os-radio>
        <os-radio
          variant="default"
          name="state-group"
          value="disabled"
          label="Estado desabilitado"
          [disabled]="true">
        </os-radio>
        <os-radio
          variant="primary"
          name="state-group"
          value="disabled-checked"
          label="Estado desabilitado e selecionado"
          [checked]="true"
          [disabled]="true">
        </os-radio>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do radio button.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Preferências de Notificação</h3>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Frequência de emails:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <os-radio
              variant="primary"
              name="email-frequency"
              value="daily"
              label="Diariamente">
            </os-radio>
            <os-radio
              variant="primary"
              name="email-frequency"
              value="weekly"
              label="Semanalmente">
            </os-radio>
            <os-radio
              variant="primary"
              name="email-frequency"
              value="monthly"
              label="Mensalmente">
            </os-radio>
            <os-radio
              variant="primary"
              name="email-frequency"
              value="never"
              label="Nunca">
            </os-radio>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Tipo de conta:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <os-radio
              variant="primary"
              name="account-type"
              value="personal"
              label="Pessoal">
            </os-radio>
            <os-radio
              variant="primary"
              name="account-type"
              value="business"
              label="Empresarial">
            </os-radio>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário de preferências.',
      },
    },
  },
};
