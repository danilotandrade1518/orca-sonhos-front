import type { Meta, StoryObj } from '@storybook/angular';
import { OsFormGroupComponent } from './os-form-group.component';

const meta: Meta<OsFormGroupComponent> = {
  title: 'Design System/Molecules/Form Group',
  component: OsFormGroupComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Grupo de formulário do Design System Orca Sonhos com 3 variantes, 3 tamanhos e suporte a título, descrição e texto de ajuda.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Título do grupo',
    },
    description: {
      control: { type: 'text' },
      description: 'Descrição do grupo',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Texto de ajuda',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'spaced'],
      description: 'Variante visual do grupo',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do grupo',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Grupo obrigatório',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsFormGroupComponent>;

export const Default: Story = {
  args: {
    title: 'Informações Pessoais',
    description: 'Preencha seus dados pessoais',
    helperText: '',
    variant: 'default',
    size: 'medium',
    required: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-group 
        [title]="title"
        [description]="description"
        [helperText]="helperText"
        [variant]="variant"
        [size]="size"
        [required]="required"
      >
        <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
        <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
        <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
      </os-form-group>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-form-group title="Informações Pessoais" description="Preencha seus dados pessoais" variant="default">
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
          </os-form-group>
        </div>
        
        <div>
          <h4>Compact</h4>
          <os-form-group title="Informações Pessoais" description="Preencha seus dados pessoais" variant="compact">
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
          </os-form-group>
        </div>
        
        <div>
          <h4>Spaced</h4>
          <os-form-group title="Informações Pessoais" description="Preencha seus dados pessoais" variant="spaced">
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
          </os-form-group>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do grupo de formulário.',
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
          <os-form-group title="Informações Pessoais" size="small">
            <os-form-field label="Nome" placeholder="Digite seu nome" size="small"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" size="small"></os-form-field>
          </os-form-group>
        </div>
        
        <div>
          <h4>Medium</h4>
          <os-form-group title="Informações Pessoais" size="medium">
            <os-form-field label="Nome" placeholder="Digite seu nome" size="medium"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" size="medium"></os-form-field>
          </os-form-group>
        </div>
        
        <div>
          <h4>Large</h4>
          <os-form-group title="Informações Pessoais" size="large">
            <os-form-field label="Nome" placeholder="Digite seu nome" size="large"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" size="large"></os-form-field>
          </os-form-group>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do grupo de formulário.',
      },
    },
  },
};

export const WithHelperText: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-form-group 
          title="Informações de Contato" 
          description="Preencha seus dados de contato"
          helperText="Todos os campos são obrigatórios para completar o cadastro"
        >
          <os-form-field label="Nome Completo" placeholder="Digite seu nome completo" required="true"></os-form-field>
          <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
          <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel" required="true"></os-form-field>
        </os-form-group>
        
        <os-form-group 
          title="Endereço" 
          description="Informe seu endereço de residência"
          helperText="Os dados de endereço são utilizados para entrega e cobrança"
        >
          <os-form-field label="CEP" placeholder="Digite seu CEP" type="tel"></os-form-field>
          <os-form-field label="Rua" placeholder="Digite o nome da rua"></os-form-field>
          <os-form-field label="Número" placeholder="Digite o número" type="number"></os-form-field>
          <os-form-field label="Complemento" placeholder="Digite o complemento"></os-form-field>
        </os-form-group>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grupos de formulário com texto de ajuda.',
      },
    },
  },
};

export const Required: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <os-form-group 
          title="Informações Obrigatórias" 
          description="Campos marcados com * são obrigatórios"
          [required]="true"
        >
          <os-form-field label="Nome" placeholder="Digite seu nome" required="true"></os-form-field>
          <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
          <os-form-field label="Senha" placeholder="Digite sua senha" type="password" required="true"></os-form-field>
        </os-form-group>
        
        <os-form-group 
          title="Informações Opcionais" 
          description="Estes campos são opcionais"
          [required]="false"
        >
          <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
          <os-form-field label="Data de Nascimento" placeholder="Digite sua data de nascimento" type="date"></os-form-field>
        </os-form-group>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grupos de formulário obrigatórios e opcionais.',
      },
    },
  },
};

export const ComplexForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <h2>Cadastro de Usuário</h2>
        
        <os-form-group 
          title="Dados Pessoais" 
          description="Informe seus dados pessoais básicos"
          helperText="Todos os campos são obrigatórios"
          [required]="true"
        >
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <os-form-field label="Nome" placeholder="Digite seu nome" required="true"></os-form-field>
            <os-form-field label="Sobrenome" placeholder="Digite seu sobrenome" required="true"></os-form-field>
          </div>
          <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
          <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
        </os-form-group>
        
        <os-form-group 
          title="Endereço" 
          description="Informe seu endereço de residência"
          variant="spaced"
        >
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
            <os-form-field label="CEP" placeholder="Digite seu CEP" type="tel"></os-form-field>
            <os-form-field label="Cidade" placeholder="Digite sua cidade"></os-form-field>
          </div>
          <os-form-field label="Rua" placeholder="Digite o nome da rua"></os-form-field>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <os-form-field label="Número" placeholder="Digite o número" type="number"></os-form-field>
            <os-form-field label="Complemento" placeholder="Digite o complemento"></os-form-field>
          </div>
        </os-form-group>
        
        <os-form-group 
          title="Configurações de Conta" 
          description="Defina suas preferências de conta"
          variant="compact"
        >
          <os-form-field label="Senha" placeholder="Digite sua senha" type="password" required="true"></os-form-field>
          <os-form-field label="Confirmar Senha" placeholder="Confirme sua senha" type="password" required="true"></os-form-field>
        </os-form-group>
        
        <div style="display: flex; gap: 16px; margin-top: 24px;">
          <os-button variant="primary">Cadastrar</os-button>
          <os-button variant="secondary">Cancelar</os-button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário complexo com múltiplos grupos.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <os-form-group>
          <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
          <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
        </os-form-group>
        
        <os-form-group helperText="Informações opcionais">
          <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
          <os-form-field label="Data de Nascimento" placeholder="Digite sua data de nascimento" type="date"></os-form-field>
        </os-form-group>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grupos de formulário sem título, apenas com conteúdo.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Grupo Interativo',
    description: 'Descrição do grupo',
    helperText: 'Texto de ajuda',
    variant: 'default',
    size: 'medium',
    required: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-group 
        [title]="title"
        [description]="description"
        [helperText]="helperText"
        [variant]="variant"
        [size]="size"
        [required]="required"
      >
        <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
        <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
      </os-form-group>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grupo de formulário interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

