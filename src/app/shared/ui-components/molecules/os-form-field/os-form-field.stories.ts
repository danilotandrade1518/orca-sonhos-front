import type { Meta, StoryObj } from '@storybook/angular';
import { OsFormFieldComponent } from './os-form-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

const meta: Meta<OsFormFieldComponent> = {
  title: 'Design System/Molecules/Form Field',
  component: OsFormFieldComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de formulário do Design System Orca Sonhos com label, input, validação e mensagens de erro.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Label do campo',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder do input',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Tipo do input',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do campo',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'filled'],
      description: 'Variante visual do campo',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Campo obrigatório',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Campo desabilitado',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Campo somente leitura',
    },
    clearable: {
      control: { type: 'boolean' },
      description: 'Botão de limpar',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Texto de ajuda',
    },
    hintText: {
      control: { type: 'text' },
      description: 'Texto de dica',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Mensagem de erro',
    },
    prefixIcon: {
      control: { type: 'text' },
      description: 'Ícone prefixo (Font Awesome)',
    },
    suffixIcon: {
      control: { type: 'text' },
      description: 'Ícone sufixo (Font Awesome)',
    },
    valueChange: {
      action: 'valueChange',
      description: 'Evento de mudança de valor',
    },
    blurEvent: {
      action: 'blurEvent',
      description: 'Evento de blur',
    },
    focusEvent: {
      action: 'focusEvent',
      description: 'Evento de focus',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsFormFieldComponent>;

export const Default: Story = {
  args: {
    label: 'Nome',
    placeholder: 'Digite seu nome',
    type: 'text',
    size: 'medium',
    variant: 'default',
    required: false,
    disabled: false,
    readonly: false,
    clearable: false,
    helperText: '',
    hintText: '',
    errorMessage: '',
    prefixIcon: '',
    suffixIcon: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-field 
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [size]="size"
        [variant]="variant"
        [required]="required"
        [disabled]="disabled"
        [readonly]="readonly"
        [clearable]="clearable"
        [helperText]="helperText"
        [hintText]="hintText"
        [errorMessage]="errorMessage"
        [prefixIcon]="prefixIcon"
        [suffixIcon]="suffixIcon"
        (valueChange)="valueChange($event)"
        (blurEvent)="blurEvent($event)"
        (focusEvent)="focusEvent($event)"
      ></os-form-field>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <os-form-field 
          label="Default" 
          placeholder="Campo com variante default"
          variant="default"
        ></os-form-field>
        
        <os-form-field 
          label="Outlined" 
          placeholder="Campo com variante outlined"
          variant="outlined"
        ></os-form-field>
        
        <os-form-field 
          label="Filled" 
          placeholder="Campo com variante filled"
          variant="filled"
        ></os-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do campo de formulário.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-form-field 
          label="Small" 
          placeholder="Campo pequeno"
          size="small"
        ></os-form-field>
        
        <os-form-field 
          label="Medium" 
          placeholder="Campo médio"
          size="medium"
        ></os-form-field>
        
        <os-form-field 
          label="Large" 
          placeholder="Campo grande"
          size="large"
        ></os-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do campo de formulário.',
      },
    },
  },
};

export const Types: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-form-field 
          label="Texto" 
          placeholder="Digite um texto"
          type="text"
        ></os-form-field>
        
        <os-form-field 
          label="Email" 
          placeholder="Digite seu email"
          type="email"
        ></os-form-field>
        
        <os-form-field 
          label="Senha" 
          placeholder="Digite sua senha"
          type="password"
        ></os-form-field>
        
        <os-form-field 
          label="Telefone" 
          placeholder="Digite seu telefone"
          type="tel"
        ></os-form-field>
        
        <os-form-field 
          label="Número" 
          placeholder="Digite um número"
          type="number"
        ></os-form-field>
        
        <os-form-field 
          label="URL" 
          placeholder="Digite uma URL"
          type="url"
        ></os-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tipos de input disponíveis.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-form-field 
          label="Usuário" 
          placeholder="Digite seu usuário"
          prefixIcon="fa fa-user"
        ></os-form-field>
        
        <os-form-field 
          label="Email" 
          placeholder="Digite seu email"
          prefixIcon="fa fa-envelope"
        ></os-form-field>
        
        <os-form-field 
          label="Senha" 
          placeholder="Digite sua senha"
          prefixIcon="fa fa-lock"
          type="password"
        ></os-form-field>
        
        <os-form-field 
          label="Buscar" 
          placeholder="Digite para buscar"
          prefixIcon="fa fa-search"
          suffixIcon="fa fa-times"
          clearable="true"
        ></os-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Campos com ícones prefixo e sufixo.',
      },
    },
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-form-field 
          label="Normal" 
          placeholder="Campo normal"
          value="Valor preenchido"
        ></os-form-field>
        
        <os-form-field 
          label="Obrigatório" 
          placeholder="Campo obrigatório"
          required="true"
        ></os-form-field>
        
        <os-form-field 
          label="Desabilitado" 
          placeholder="Campo desabilitado"
          disabled="true"
          value="Valor desabilitado"
        ></os-form-field>
        
        <os-form-field 
          label="Somente Leitura" 
          placeholder="Campo somente leitura"
          readonly="true"
          value="Valor somente leitura"
        ></os-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados do campo de formulário.',
      },
    },
  },
};

export const WithMessages: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <os-form-field 
          label="Com Texto de Ajuda" 
          placeholder="Digite aqui"
          helperText="Este texto ajuda o usuário a entender o que deve ser preenchido"
        ></os-form-field>
        
        <os-form-field 
          label="Com Dica" 
          placeholder="Digite aqui"
          hintText="Dica: Use pelo menos 8 caracteres"
        ></os-form-field>
        
        <os-form-field 
          label="Com Erro" 
          placeholder="Digite aqui"
          errorMessage="Este campo é obrigatório"
          value=""
        ></os-form-field>
        
        <os-form-field 
          label="Com Validação" 
          placeholder="Digite seu email"
          type="email"
          errorMessage="Email inválido"
          value="email-invalido"
        ></os-form-field>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Campos com diferentes tipos de mensagens.',
      },
    },
  },
};

export const ReactiveForm: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ReactiveFormsModule],
    },
    template: `
      <form [formGroup]="form" style="display: grid; gap: 16px; max-width: 400px;">
        <os-form-field 
          label="Nome Completo" 
          placeholder="Digite seu nome completo"
          formControlName="name"
          required="true"
        ></os-form-field>
        
        <os-form-field 
          label="Email" 
          placeholder="Digite seu email"
          type="email"
          formControlName="email"
          required="true"
        ></os-form-field>
        
        <os-form-field 
          label="Telefone" 
          placeholder="Digite seu telefone"
          type="tel"
          formControlName="phone"
        ></os-form-field>
        
        <div>
          <p><strong>Valor do Formulário:</strong></p>
          <pre>{{ form.value | json }}</pre>
        </div>
      </form>
    `,
    props: {
      form: new FormControl({
        name: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
      }),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso com Reactive Forms.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    label: 'Campo Interativo',
    placeholder: 'Digite aqui',
    type: 'text',
    size: 'medium',
    variant: 'default',
    required: false,
    disabled: false,
    readonly: false,
    clearable: false,
    helperText: '',
    hintText: '',
    errorMessage: '',
    prefixIcon: '',
    suffixIcon: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-field 
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [size]="size"
        [variant]="variant"
        [required]="required"
        [disabled]="disabled"
        [readonly]="readonly"
        [clearable]="clearable"
        [helperText]="helperText"
        [hintText]="hintText"
        [errorMessage]="errorMessage"
        [prefixIcon]="prefixIcon"
        [suffixIcon]="suffixIcon"
        (valueChange)="valueChange($event)"
        (blurEvent)="blurEvent($event)"
        (focusEvent)="focusEvent($event)"
      ></os-form-field>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Campo interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

