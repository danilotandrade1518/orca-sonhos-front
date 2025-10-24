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
    errorMessage: {
      control: { type: 'text' },
      description: 'Mensagem de erro (visível quando invalid=true)',
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
    columns: {
      control: { type: 'select' },
      options: [1, 2, 3],
      description: 'Número de colunas no layout (responsivo - força 1 coluna em mobile)',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Grupo obrigatório',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Grupo desabilitado',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Grupo com erro de validação',
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

export const ColumnLayouts: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h4>1 Coluna (Padrão)</h4>
          <os-form-group
            title="Informações Pessoais"
            description="Campos em uma coluna"
            [columns]="1"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
            <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
          </os-form-group>
        </div>

        <div>
          <h4>2 Colunas</h4>
          <os-form-group
            title="Informações Pessoais"
            description="Campos em duas colunas (mobile: 1 coluna)"
            [columns]="2"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Sobrenome" placeholder="Digite seu sobrenome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
            <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
          </os-form-group>
        </div>

        <div>
          <h4>3 Colunas</h4>
          <os-form-group
            title="Informações de Endereço"
            description="Campos em três colunas (tablet: 2 colunas, mobile: 1 coluna)"
            [columns]="3"
          >
            <os-form-field label="CEP" placeholder="Digite seu CEP" type="tel"></os-form-field>
            <os-form-field label="Cidade" placeholder="Digite sua cidade"></os-form-field>
            <os-form-field label="Estado" placeholder="Digite seu estado"></os-form-field>
            <os-form-field label="Rua" placeholder="Digite o nome da rua"></os-form-field>
            <os-form-field label="Número" placeholder="Digite o número" type="number"></os-form-field>
            <os-form-field label="Complemento" placeholder="Digite o complemento"></os-form-field>
          </os-form-group>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstração dos layouts de 1, 2 e 3 colunas. O layout é responsivo e ajusta automaticamente para 1 coluna em mobile.',
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h4>Estado Normal</h4>
          <os-form-group
            title="Informações de Contato"
            description="Preencha seus dados"
            helperText="Todos os campos são obrigatórios"
            [invalid]="false"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
          </os-form-group>
        </div>

        <div>
          <h4>Estado de Erro</h4>
          <os-form-group
            title="Informações de Contato"
            description="Preencha seus dados"
            errorMessage="Por favor, corrija os erros nos campos abaixo"
            [invalid]="true"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome" invalid="true" errorText="Campo obrigatório"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" invalid="true" errorText="Email inválido"></os-form-field>
          </os-form-group>
        </div>

        <div>
          <h4>Estado Desabilitado</h4>
          <os-form-group
            title="Informações de Contato"
            description="Campos desabilitados"
            helperText="Este formulário está desabilitado"
            [disabled]="true"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome" disabled="true"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" disabled="true"></os-form-field>
          </os-form-group>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos estados de validação: normal, erro e desabilitado.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
          <h4>Recursos de Acessibilidade (WCAG 2.1 AA)</h4>
          <ul>
            <li>✅ Fieldset + Legend para estrutura semântica</li>
            <li>✅ ARIA attributes completos (aria-invalid, aria-required, aria-describedby)</li>
            <li>✅ IDs únicos para associação de elementos</li>
            <li>✅ Role="alert" em mensagens de erro</li>
            <li>✅ aria-live="polite" para atualizações dinâmicas</li>
            <li>✅ Suporte a dark mode</li>
            <li>✅ Suporte a high contrast mode</li>
            <li>✅ Suporte a reduced motion</li>
          </ul>
        </div>

        <os-form-group
          title="Formulário Acessível"
          description="Todos os recursos de acessibilidade habilitados"
          helperText="Use Tab para navegar, screen reader irá anunciar corretamente"
          [required]="true"
        >
          <os-form-field label="Nome Completo" placeholder="Digite seu nome completo" required="true"></os-form-field>
          <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
        </os-form-group>

        <os-form-group
          title="Formulário com Erro"
          description="Mensagens de erro são anunciadas dinamicamente"
          errorMessage="Existem erros no formulário que precisam ser corrigidos"
          [invalid]="true"
          [required]="true"
        >
          <os-form-field label="Nome Completo" placeholder="Digite seu nome completo" invalid="true" errorText="Nome é obrigatório"></os-form-field>
          <os-form-field label="Email" placeholder="Digite seu email" type="email" invalid="true" errorText="Email inválido"></os-form-field>
        </os-form-group>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstração dos recursos de acessibilidade WCAG 2.1 AA implementados no componente.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Grupo Interativo',
    description: 'Descrição do grupo',
    helperText: 'Texto de ajuda',
    errorMessage: '',
    variant: 'default',
    size: 'medium',
    columns: 1,
    required: false,
    disabled: false,
    invalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-group
        [title]="title"
        [description]="description"
        [helperText]="helperText"
        [errorMessage]="errorMessage"
        [variant]="variant"
        [size]="size"
        [columns]="columns"
        [required]="required"
        [disabled]="disabled"
        [invalid]="invalid"
      >
        <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
        <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
        <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
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
