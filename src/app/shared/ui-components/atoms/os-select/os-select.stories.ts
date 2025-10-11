import type { Meta, StoryObj } from '@storybook/angular';
import { OsSelectComponent, OsSelectOption } from './os-select.component';

const meta: Meta<OsSelectComponent> = {
  title: 'Design System/Atoms/Select',
  component: OsSelectComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Select do Design System Orca Sonhos com 3 tamanhos, validação e integração com Angular Forms.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do select',
    },
    label: {
      control: { type: 'text' },
      description: 'Label do select',
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
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    value: {
      control: { type: 'text' },
      description: 'Valor selecionado',
    },
    options: {
      control: { type: 'object' },
      description: 'Opções do select',
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
type Story = StoryObj<OsSelectComponent>;

const defaultOptions: OsSelectOption[] = [
  { value: 'option1', label: 'Opção 1' },
  { value: 'option2', label: 'Opção 2' },
  { value: 'option3', label: 'Opção 3' },
  { value: 'option4', label: 'Opção 4' },
];

export const Default: Story = {
  args: {
    size: 'medium',
    label: 'Selecione uma opção',
    placeholder: 'Escolha...',
    helperText: 'Selecione uma opção da lista',
    options: defaultOptions,
  },
};

export const WithValue: Story = {
  args: {
    size: 'medium',
    label: 'Opção selecionada',
    placeholder: 'Escolha...',
    value: 'option2',
    options: defaultOptions,
    helperText: 'Opção já selecionada',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Select pequeno',
    placeholder: 'Escolha...',
    options: defaultOptions,
    helperText: 'Tamanho pequeno',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Select grande',
    placeholder: 'Escolha...',
    options: defaultOptions,
    helperText: 'Tamanho grande',
  },
};

export const Required: Story = {
  args: {
    size: 'medium',
    label: 'Select obrigatório',
    placeholder: 'Escolha...',
    required: true,
    options: defaultOptions,
    helperText: 'Este campo é obrigatório',
  },
};

export const WithError: Story = {
  args: {
    size: 'medium',
    label: 'Select com erro',
    placeholder: 'Escolha...',
    errorMessage: 'Selecione uma opção válida',
    options: defaultOptions,
    helperText: 'Corrija o erro',
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    label: 'Select desabilitado',
    placeholder: 'Escolha...',
    disabled: true,
    options: defaultOptions,
    helperText: 'Campo desabilitado',
  },
};

export const ManyOptions: Story = {
  args: {
    size: 'medium',
    label: 'Select com muitas opções',
    placeholder: 'Escolha...',
    options: [
      { value: 'option1', label: 'Opção 1' },
      { value: 'option2', label: 'Opção 2' },
      { value: 'option3', label: 'Opção 3' },
      { value: 'option4', label: 'Opção 4' },
      { value: 'option5', label: 'Opção 5' },
      { value: 'option6', label: 'Opção 6' },
      { value: 'option7', label: 'Opção 7' },
      { value: 'option8', label: 'Opção 8' },
      { value: 'option9', label: 'Opção 9' },
      { value: 'option10', label: 'Opção 10' },
    ],
    helperText: 'Select com muitas opções',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-select
          size="small"
          label="Select pequeno"
          placeholder="Escolha..."
          [options]="options"
          helperText="Tamanho pequeno">
        </os-select>
        <os-select
          size="medium"
          label="Select médio"
          placeholder="Escolha..."
          [options]="options"
          helperText="Tamanho médio">
        </os-select>
        <os-select
          size="large"
          label="Select grande"
          placeholder="Escolha..."
          [options]="options"
          helperText="Tamanho grande">
        </os-select>
      </div>
    `,
    props: {
      options: defaultOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do select.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-select
          label="Estado normal"
          placeholder="Escolha..."
          [options]="options"
          helperText="Estado normal">
        </os-select>
        <os-select
          label="Estado com erro"
          placeholder="Escolha..."
          [options]="options"
          errorMessage="Selecione uma opção válida"
          helperText="Estado com erro">
        </os-select>
        <os-select
          label="Estado desabilitado"
          placeholder="Escolha..."
          [options]="options"
          [disabled]="true"
          helperText="Estado desabilitado">
        </os-select>
        <os-select
          label="Estado com valor"
          placeholder="Escolha..."
          [options]="options"
          value="option2"
          helperText="Estado com valor selecionado">
        </os-select>
      </div>
    `,
    props: {
      options: defaultOptions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados do select.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Formulário de Cadastro</h3>

        <os-select
          label="País"
          placeholder="Selecione seu país"
          [options]="countryOptions"
          [required]="true"
          helperText="Selecione seu país de residência">
        </os-select>

        <os-select
          label="Estado"
          placeholder="Selecione seu estado"
          [options]="stateOptions"
          [required]="true"
          helperText="Selecione seu estado">
        </os-select>

        <os-select
          label="Tipo de conta"
          placeholder="Escolha o tipo de conta"
          [options]="accountTypeOptions"
          [required]="true"
          helperText="Selecione o tipo de conta">
        </os-select>

        <os-select
          label="Frequência de notificações"
          placeholder="Escolha a frequência"
          [options]="notificationOptions"
          helperText="Com que frequência deseja receber notificações">
        </os-select>
      </div>
    `,
    props: {
      countryOptions: [
        { value: 'br', label: 'Brasil' },
        { value: 'us', label: 'Estados Unidos' },
        { value: 'ca', label: 'Canadá' },
        { value: 'mx', label: 'México' },
        { value: 'ar', label: 'Argentina' },
      ],
      stateOptions: [
        { value: 'sp', label: 'São Paulo' },
        { value: 'rj', label: 'Rio de Janeiro' },
        { value: 'mg', label: 'Minas Gerais' },
        { value: 'rs', label: 'Rio Grande do Sul' },
        { value: 'pr', label: 'Paraná' },
      ],
      accountTypeOptions: [
        { value: 'personal', label: 'Pessoal' },
        { value: 'business', label: 'Empresarial' },
        { value: 'student', label: 'Estudante' },
      ],
      notificationOptions: [
        { value: 'daily', label: 'Diariamente' },
        { value: 'weekly', label: 'Semanalmente' },
        { value: 'monthly', label: 'Mensalmente' },
        { value: 'never', label: 'Nunca' },
      ],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário de cadastro.',
      },
    },
  },
};

export const WithDisabledOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-select
          label="Select com opções desabilitadas"
          placeholder="Escolha..."
          [options]="optionsWithDisabled"
          helperText="Algumas opções estão desabilitadas">
        </os-select>
      </div>
    `,
    props: {
      optionsWithDisabled: [
        { value: 'option1', label: 'Opção 1' },
        { value: 'option2', label: 'Opção 2 (desabilitada)', disabled: true },
        { value: 'option3', label: 'Opção 3' },
        { value: 'option4', label: 'Opção 4 (desabilitada)', disabled: true },
        { value: 'option5', label: 'Opção 5' },
      ],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de select com opções desabilitadas.',
      },
    },
  },
};



