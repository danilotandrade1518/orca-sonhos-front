import type { Meta, StoryObj } from '@storybook/angular';
import { OsDatePickerComponent } from './os-date-picker.component';

const meta: Meta<OsDatePickerComponent> = {
  title: 'Design System/Molecules/Date Picker',
  component: OsDatePickerComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Seletor de data do Design System Orca Sonhos com 3 variantes, 3 tamanhos e suporte a validação de datas.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'date' },
      description: 'Data selecionada',
    },
    label: {
      control: { type: 'text' },
      description: 'Rótulo do campo',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto placeholder',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Texto de ajuda',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do componente',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'filled'],
      description: 'Variante visual do componente',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Campo desabilitado',
    },
    minDate: {
      control: { type: 'date' },
      description: 'Data mínima permitida',
    },
    maxDate: {
      control: { type: 'date' },
      description: 'Data máxima permitida',
    },
    touchUi: {
      control: { type: 'boolean' },
      description: 'Interface touch para dispositivos móveis',
    },
    calendarIcon: {
      control: { type: 'text' },
      description: 'Ícone do calendário',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDatePickerComponent>;

export const Default: Story = {
  args: {
    value: null,
    label: 'Data de Nascimento',
    placeholder: 'Selecionar data',
    helperText: '',
    size: 'medium',
    variant: 'default',
    required: false,
    disabled: false,
    minDate: null,
    maxDate: null,
    touchUi: false,
    calendarIcon: 'calendar_today',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-date-picker 
        [value]="value"
        [label]="label"
        [placeholder]="placeholder"
        [helperText]="helperText"
        [size]="size"
        [variant]="variant"
        [required]="required"
        [disabled]="disabled"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [touchUi]="touchUi"
        [calendarIcon]="calendarIcon"
        (valueChange)="valueChange($event)"
        (dateChange)="dateChange($event)"
        (focusEvent)="focusEvent($event)"
        (blurEvent)="blurEvent($event)"
      ></os-date-picker>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            variant="default"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Outlined</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            variant="outlined"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Filled</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            variant="filled"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do seletor de data.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Small</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            size="small"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Medium</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            size="medium"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Large</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            size="large"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do seletor de data.',
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Data Mínima</h4>
          <os-date-picker 
            label="Data de Início" 
            placeholder="Selecionar data"
            helperText="Data não pode ser anterior a hoje"
            [minDate]="new Date()"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Data Máxima</h4>
          <os-date-picker 
            label="Data de Fim" 
            placeholder="Selecionar data"
            helperText="Data não pode ser posterior a 31/12/2024"
            [maxDate]="new Date('2024-12-31')"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Intervalo de Datas</h4>
          <os-date-picker 
            label="Data de Evento" 
            placeholder="Selecionar data"
            helperText="Data deve estar entre 01/01/2024 e 31/12/2024"
            [minDate]="new Date('2024-01-01')"
            [maxDate]="new Date('2024-12-31')"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seletor de data com validação de datas mínimas e máximas.',
      },
    },
  },
};

export const WithHelperText: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-date-picker 
          label="Data de Nascimento" 
          placeholder="Selecionar data"
          helperText="Digite sua data de nascimento no formato DD/MM/AAAA"
        ></os-date-picker>
        
        <os-date-picker 
          label="Data de Vencimento" 
          placeholder="Selecionar data"
          helperText="Data de vencimento do pagamento"
          required="true"
        ></os-date-picker>
        
        <os-date-picker 
          label="Data de Agendamento" 
          placeholder="Selecionar data"
          helperText="Selecione uma data disponível para agendamento"
          [minDate]="new Date()"
        ></os-date-picker>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seletor de data com texto de ajuda.',
      },
    },
  },
};

export const DisabledAndReadonly: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Desabilitado</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            [disabled]="true"
            [value]="new Date('1990-01-01')"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Com Valor</h4>
          <os-date-picker 
            label="Data de Cadastro" 
            placeholder="Selecionar data"
            [value]="new Date('2024-01-15')"
            helperText="Data de cadastro no sistema"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seletor de data desabilitado e com valor pré-definido.',
      },
    },
  },
};

export const TouchUI: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Interface Normal</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            [touchUi]="false"
          ></os-date-picker>
        </div>
        
        <div>
          <h4>Interface Touch</h4>
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            [touchUi]="true"
            helperText="Interface otimizada para dispositivos móveis"
          ></os-date-picker>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparação entre interface normal e touch para dispositivos móveis.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <h3>Formulário de Cadastro</h3>
        <form style="display: flex; flex-direction: column; gap: 16px;">
          <os-date-picker 
            label="Data de Nascimento" 
            placeholder="Selecionar data"
            helperText="Digite sua data de nascimento"
            required="true"
          ></os-date-picker>
          
          <os-date-picker 
            label="Data de Início do Trabalho" 
            placeholder="Selecionar data"
            helperText="Data de início na empresa"
            [minDate]="new Date('2020-01-01')"
            [maxDate]="new Date()"
          ></os-date-picker>
          
          <os-date-picker 
            label="Data de Férias" 
            placeholder="Selecionar data"
            helperText="Data desejada para início das férias"
            [minDate]="new Date()"
            [maxDate]="new Date('2025-12-31')"
          ></os-date-picker>
        </form>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário com múltiplos seletores de data.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    value: null,
    label: 'Data de Nascimento',
    placeholder: 'Selecionar data',
    helperText: '',
    size: 'medium',
    variant: 'default',
    required: false,
    disabled: false,
    minDate: null,
    maxDate: null,
    touchUi: false,
    calendarIcon: 'calendar_today',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-date-picker 
        [value]="value"
        [label]="label"
        [placeholder]="placeholder"
        [helperText]="helperText"
        [size]="size"
        [variant]="variant"
        [required]="required"
        [disabled]="disabled"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [touchUi]="touchUi"
        [calendarIcon]="calendarIcon"
        (valueChange)="valueChange($event)"
        (dateChange)="dateChange($event)"
        (focusEvent)="focusEvent($event)"
        (blurEvent)="blurEvent($event)"
      ></os-date-picker>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seletor de data interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

