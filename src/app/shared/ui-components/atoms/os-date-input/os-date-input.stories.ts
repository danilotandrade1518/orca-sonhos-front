import type { Meta, StoryObj } from '@storybook/angular';
import { OsDateInputComponent } from './os-date-input.component';

const meta: Meta<OsDateInputComponent> = {
  title: 'Design System/Atoms/Date Input',
  component: OsDateInputComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de entrada de data do Design System Orca Sonhos com 3 tamanhos, validação e integração com datepicker.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do campo de data',
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
    prefixIcon: {
      control: { type: 'text' },
      description: 'Ícone prefixo',
    },
    suffixIcon: {
      control: { type: 'text' },
      description: 'Ícone sufixo',
    },
    minDate: {
      control: { type: 'text' },
      description: 'Data mínima (YYYY-MM-DD)',
    },
    maxDate: {
      control: { type: 'text' },
      description: 'Data máxima (YYYY-MM-DD)',
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
type Story = StoryObj<OsDateInputComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    label: 'Data de nascimento',
    placeholder: 'Selecione uma data',
    helperText: 'Digite ou selecione uma data',
  },
};

export const WithValue: Story = {
  args: {
    size: 'medium',
    label: 'Data de início',
    placeholder: 'Selecione uma data',
    value: new Date('2024-01-15'),
    helperText: 'Data de início do projeto',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Data pequena',
    placeholder: 'Data',
    helperText: 'Campo pequeno',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Data grande',
    placeholder: 'Selecione uma data',
    helperText: 'Campo grande',
  },
};

export const WithPrefixIcon: Story = {
  args: {
    size: 'medium',
    label: 'Data com ícone',
    placeholder: 'Selecione uma data',
    prefixIcon: 'event',
    helperText: 'Campo com ícone prefixo',
  },
};

export const WithSuffixIcon: Story = {
  args: {
    size: 'medium',
    label: 'Data com ícone sufixo',
    placeholder: 'Selecione uma data',
    suffixIcon: 'schedule',
    helperText: 'Campo com ícone sufixo',
  },
};

export const Required: Story = {
  args: {
    size: 'medium',
    label: 'Data obrigatória',
    placeholder: 'Selecione uma data',
    required: true,
    helperText: 'Este campo é obrigatório',
  },
};

export const WithError: Story = {
  args: {
    size: 'medium',
    label: 'Data com erro',
    placeholder: 'Selecione uma data',
    errorMessage: 'Data inválida',
    helperText: 'Corrija o erro',
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    label: 'Data desabilitada',
    placeholder: 'Selecione uma data',
    disabled: true,
    helperText: 'Campo desabilitado',
  },
};

export const Readonly: Story = {
  args: {
    size: 'medium',
    label: 'Data somente leitura',
    placeholder: 'Selecione uma data',
    readonly: true,
    value: new Date('2024-01-15'),
    helperText: 'Campo somente leitura',
  },
};

export const WithMinMaxDate: Story = {
  args: {
    size: 'medium',
    label: 'Data com limites',
    placeholder: 'Selecione uma data',
    minDate: '2024-01-01',
    maxDate: '2024-12-31',
    helperText: 'Selecione uma data entre 01/01/2024 e 31/12/2024',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-date-input
          size="small"
          label="Data pequena"
          placeholder="Data pequena"
          helperText="Tamanho pequeno">
        </os-date-input>
        <os-date-input
          size="medium"
          label="Data média"
          placeholder="Data média"
          helperText="Tamanho médio">
        </os-date-input>
        <os-date-input
          size="large"
          label="Data grande"
          placeholder="Data grande"
          helperText="Tamanho grande">
        </os-date-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do campo de data.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-date-input
          label="Data com ícone prefixo"
          placeholder="Selecione uma data"
          prefixIcon="event"
          helperText="Campo com ícone prefixo">
        </os-date-input>
        <os-date-input
          label="Data com ícone sufixo"
          placeholder="Selecione uma data"
          suffixIcon="schedule"
          helperText="Campo com ícone sufixo">
        </os-date-input>
        <os-date-input
          label="Data com ambos os ícones"
          placeholder="Selecione uma data"
          prefixIcon="event"
          suffixIcon="schedule"
          helperText="Campo com ícones prefixo e sufixo">
        </os-date-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de campos de data com diferentes ícones.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-date-input
          label="Estado normal"
          placeholder="Selecione uma data"
          helperText="Estado normal">
        </os-date-input>
        <os-date-input
          label="Estado com erro"
          placeholder="Selecione uma data"
          errorMessage="Data inválida"
          helperText="Estado com erro">
        </os-date-input>
        <os-date-input
          label="Estado desabilitado"
          placeholder="Selecione uma data"
          [disabled]="true"
          helperText="Estado desabilitado">
        </os-date-input>
        <os-date-input
          label="Estado somente leitura"
          placeholder="Selecione uma data"
          [readonly]="true"
          [value]="new Date('2024-01-15')"
          helperText="Estado somente leitura">
        </os-date-input>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do campo de data.',
      },
    },
  },
};
