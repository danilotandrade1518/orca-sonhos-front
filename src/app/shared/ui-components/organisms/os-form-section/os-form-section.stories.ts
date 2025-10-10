import type { Meta, StoryObj } from '@storybook/angular';
import { OsFormSectionComponent } from './os-form-section.component';

const meta: Meta<OsFormSectionComponent> = {
  title: 'Design System/Organisms/Form Section',
  component: OsFormSectionComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Seção de formulário do Design System Orca Sonhos com 4 variantes, 3 tamanhos e suporte a campos e ações.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Título da seção',
    },
    description: {
      control: { type: 'text' },
      description: 'Descrição da seção',
    },
    groupTitle: {
      control: { type: 'text' },
      description: 'Título do grupo de formulário',
    },
    groupDescription: {
      control: { type: 'text' },
      description: 'Descrição do grupo de formulário',
    },
    fields: {
      control: { type: 'object' },
      description: 'Lista de campos do formulário',
    },
    actions: {
      control: { type: 'object' },
      description: 'Ações da seção',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'card', 'outlined', 'minimal'],
      description: 'Variante da seção',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho da seção',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema da seção',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Seção obrigatória',
    },
    collapsible: {
      control: { type: 'boolean' },
      description: 'Seção colapsável',
    },
    collapsed: {
      control: { type: 'boolean' },
      description: 'Seção colapsada',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsFormSectionComponent>;

const sampleFields = [
  {
    id: 'name',
    label: 'Nome',
    type: 'text' as const,
    required: true,
    placeholder: 'Digite seu nome',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email' as const,
    required: true,
    placeholder: 'Digite seu email',
  },
  { id: 'phone', label: 'Telefone', type: 'tel' as const, placeholder: 'Digite seu telefone' },
];

const sampleActions = [
  { label: 'Salvar', variant: 'primary' },
  { label: 'Cancelar', variant: 'secondary' },
];

export const Default: Story = {
  args: {
    title: 'Informações Pessoais',
    description: 'Preencha seus dados pessoais básicos',
    groupTitle: 'Dados do Usuário',
    groupDescription: 'Todos os campos são obrigatórios',
    fields: sampleFields,
    actions: sampleActions,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    required: true,
    collapsible: false,
    collapsed: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-section
        [title]="title"
        [description]="description"
        [groupTitle]="groupTitle"
        [groupDescription]="groupDescription"
        [fields]="fields"
        [actions]="actions"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [required]="required"
        [collapsible]="collapsible"
        [collapsed]="collapsed"
      >
        <os-form-field label="Nome" placeholder="Digite seu nome" required="true"></os-form-field>
        <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
        <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>

        <div slot="actions">
          <os-button variant="primary">Salvar</os-button>
          <os-button variant="secondary">Cancelar</os-button>
        </div>
      </os-form-section>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-form-section
            title="Informações Pessoais"
            description="Preencha seus dados pessoais"
            variant="default"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Card</h4>
          <os-form-section
            title="Endereço"
            description="Informe seu endereço de residência"
            variant="card"
          >
            <os-form-field label="Rua" placeholder="Digite o nome da rua"></os-form-field>
            <os-form-field label="Número" placeholder="Digite o número" type="number"></os-form-field>
            <os-form-field label="CEP" placeholder="Digite o CEP" type="tel"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Outlined</h4>
          <os-form-section
            title="Configurações"
            description="Ajuste suas preferências"
            variant="outlined"
          >
            <os-form-field label="Notificações" placeholder="Configurar notificações"></os-form-field>
            <os-form-field label="Tema" placeholder="Selecionar tema"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Minimal</h4>
          <os-form-section
            title="Comentários"
            description="Deixe seu comentário"
            variant="minimal"
          >
            <os-form-field label="Comentário" placeholder="Digite seu comentário" type="textarea"></os-form-field>
          </os-form-section>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis da seção de formulário.',
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
          <os-form-section
            title="Configurações Rápidas"
            description="Ajustes básicos"
            size="small"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome" size="small"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" size="small"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Medium</h4>
          <os-form-section
            title="Informações Pessoais"
            description="Preencha seus dados pessoais"
            size="medium"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome" size="medium"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" size="medium"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Large</h4>
          <os-form-section
            title="Cadastro Completo"
            description="Preencha todos os dados necessários"
            size="large"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome" size="large"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" size="large"></os-form-field>
          </os-form-section>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis da seção de formulário.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Ações</h4>
          <os-form-section
            title="Criar Usuário"
            description="Preencha os dados do novo usuário"
            [actions]="sampleActions"
          >
            <os-form-field label="Nome" placeholder="Digite o nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite o email" type="email"></os-form-field>
            <os-form-field label="Senha" placeholder="Digite a senha" type="password"></os-form-field>

            <div slot="actions">
              <os-button variant="primary">Criar</os-button>
              <os-button variant="secondary">Cancelar</os-button>
            </div>
          </os-form-section>
        </div>

        <div>
          <h4>Com Múltiplas Ações</h4>
          <os-form-section
            title="Editar Perfil"
            description="Atualize suas informações"
            [actions]="[
              { label: 'Salvar', variant: 'primary' },
              { label: 'Salvar e Continuar', variant: 'secondary' },
              { label: 'Cancelar', variant: 'tertiary' }
            ]"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>

            <div slot="actions">
              <os-button variant="primary">Salvar</os-button>
              <os-button variant="secondary">Salvar e Continuar</os-button>
              <os-button variant="tertiary">Cancelar</os-button>
            </div>
          </os-form-section>
        </div>

        <div>
          <h4>Sem Ações</h4>
          <os-form-section
            title="Visualizar Dados"
            description="Informações do usuário"
            [actions]="[]"
          >
            <os-form-field label="Nome" placeholder="Nome do usuário" readonly="true"></os-form-field>
            <os-form-field label="Email" placeholder="Email do usuário" type="email" readonly="true"></os-form-field>
          </os-form-section>
        </div>
      </div>
    `,
    props: {
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seção de formulário com e sem ações.',
      },
    },
  },
};

export const WithGroupTitle: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Título do Grupo</h4>
          <os-form-section
            title="Cadastro de Usuário"
            description="Preencha todos os dados necessários"
            groupTitle="Dados Pessoais"
            groupDescription="Informações básicas do usuário"
          >
            <os-form-field label="Nome" placeholder="Digite o nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite o email" type="email"></os-form-field>
            <os-form-field label="Telefone" placeholder="Digite o telefone" type="tel"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Sem Título do Grupo</h4>
          <os-form-section
            title="Configurações"
            description="Ajuste suas preferências"
          >
            <os-form-field label="Notificações" placeholder="Configurar notificações"></os-form-field>
            <os-form-field label="Tema" placeholder="Selecionar tema"></os-form-field>
          </os-form-section>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seção de formulário com e sem título do grupo.',
      },
    },
  },
};

export const Required: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Seção Obrigatória</h4>
          <os-form-section
            title="Informações Obrigatórias"
            description="Todos os campos são obrigatórios"
            [required]="true"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome" required="true"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
            <os-form-field label="Senha" placeholder="Digite sua senha" type="password" required="true"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Seção Opcional</h4>
          <os-form-section
            title="Informações Opcionais"
            description="Estes campos são opcionais"
            [required]="false"
          >
            <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
            <os-form-field label="Data de Nascimento" placeholder="Digite sua data de nascimento" type="date"></os-form-field>
          </os-form-section>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seção de formulário obrigatória e opcional.',
      },
    },
  },
};

export const Collapsible: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Seção Colapsável - Expandida</h4>
          <os-form-section
            title="Configurações Avançadas"
            description="Ajustes avançados do sistema"
            [collapsible]="true"
            [collapsed]="false"
          >
            <os-form-field label="Timeout" placeholder="Digite o timeout"></os-form-field>
            <os-form-field label="Retry" placeholder="Digite o número de tentativas"></os-form-field>
            <os-form-field label="Cache" placeholder="Configurar cache"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Seção Colapsável - Colapsada</h4>
          <os-form-section
            title="Configurações Avançadas"
            description="Ajustes avançados do sistema"
            [collapsible]="true"
            [collapsed]="true"
          >
            <os-form-field label="Timeout" placeholder="Digite o timeout"></os-form-field>
            <os-form-field label="Retry" placeholder="Digite o número de tentativas"></os-form-field>
            <os-form-field label="Cache" placeholder="Configurar cache"></os-form-field>
          </os-form-section>
        </div>

        <div>
          <h4>Seção Não Colapsável</h4>
          <os-form-section
            title="Informações Básicas"
            description="Dados essenciais"
            [collapsible]="false"
            [collapsed]="false"
          >
            <os-form-field label="Nome" placeholder="Digite seu nome"></os-form-field>
            <os-form-field label="Email" placeholder="Digite seu email" type="email"></os-form-field>
          </os-form-section>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seção de formulário colapsável e não colapsável.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px;">
        <h4 style="color: white; margin-bottom: 16px;">Tema Escuro</h4>
        <os-form-section
          title="Configurações do Sistema"
          description="Ajuste as configurações do sistema"
          groupTitle="Configurações Gerais"
          groupDescription="Configurações básicas do sistema"
          variant="card"
          theme="dark"
          [actions]="sampleActions"
        >
          <os-form-field label="Nome do Sistema" placeholder="Digite o nome do sistema"></os-form-field>
          <os-form-field label="URL Base" placeholder="Digite a URL base" type="url"></os-form-field>
          <os-form-field label="Porta" placeholder="Digite a porta" type="number"></os-form-field>

          <div slot="actions">
            <os-button variant="primary">Salvar</os-button>
            <os-button variant="secondary">Cancelar</os-button>
          </div>
        </os-form-section>
      </div>
    `,
    props: {
      sampleActions,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seção de formulário com tema escuro.',
      },
    },
  },
};

export const ComplexForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 800px;">
        <h3>Formulário de Cadastro Completo</h3>

        <os-form-section
          title="Dados Pessoais"
          description="Informações pessoais básicas"
          groupTitle="Informações Pessoais"
          groupDescription="Todos os campos são obrigatórios"
          variant="card"
          [required]="true"
        >
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <os-form-field label="Nome" placeholder="Digite seu nome" required="true"></os-form-field>
            <os-form-field label="Sobrenome" placeholder="Digite seu sobrenome" required="true"></os-form-field>
          </div>
          <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
          <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>
        </os-form-section>

        <os-form-section
          title="Endereço"
          description="Informe seu endereço de residência"
          groupTitle="Dados de Endereço"
          groupDescription="Informações de localização"
          variant="outlined"
        >
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
            <os-form-field label="Rua" placeholder="Digite o nome da rua"></os-form-field>
            <os-form-field label="Número" placeholder="Digite o número" type="number"></os-form-field>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <os-form-field label="CEP" placeholder="Digite o CEP" type="tel"></os-form-field>
            <os-form-field label="Cidade" placeholder="Digite a cidade"></os-form-field>
            <os-form-field label="Estado" placeholder="Digite o estado"></os-form-field>
          </div>
        </os-form-section>

        <os-form-section
          title="Configurações de Conta"
          description="Defina suas preferências de conta"
          groupTitle="Preferências"
          groupDescription="Configurações opcionais"
          variant="minimal"
        >
          <os-form-field label="Senha" placeholder="Digite sua senha" type="password" required="true"></os-form-field>
          <os-form-field label="Confirmar Senha" placeholder="Confirme sua senha" type="password" required="true"></os-form-field>
        </os-form-section>

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
        story: 'Exemplo de formulário complexo com múltiplas seções.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Informações Pessoais',
    description: 'Preencha seus dados pessoais básicos',
    groupTitle: 'Dados do Usuário',
    groupDescription: 'Todos os campos são obrigatórios',
    fields: sampleFields,
    actions: sampleActions,
    variant: 'default',
    size: 'medium',
    theme: 'light',
    required: true,
    collapsible: false,
    collapsed: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-section
        [title]="title"
        [description]="description"
        [groupTitle]="groupTitle"
        [groupDescription]="groupDescription"
        [fields]="fields"
        [actions]="actions"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [required]="required"
        [collapsible]="collapsible"
        [collapsed]="collapsed"
      >
        <os-form-field label="Nome" placeholder="Digite seu nome" required="true"></os-form-field>
        <os-form-field label="Email" placeholder="Digite seu email" type="email" required="true"></os-form-field>
        <os-form-field label="Telefone" placeholder="Digite seu telefone" type="tel"></os-form-field>

        <div slot="actions">
          <os-button variant="primary">Salvar</os-button>
          <os-button variant="secondary">Cancelar</os-button>
        </div>
      </os-form-section>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Seção de formulário interativa com controles para testar todas as propriedades.',
      },
    },
  },
};
