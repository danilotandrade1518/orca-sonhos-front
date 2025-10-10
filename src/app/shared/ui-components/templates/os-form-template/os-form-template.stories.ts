import type { Meta, StoryObj } from '@storybook/angular';
import { OsFormTemplateComponent } from './os-form-template.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

const meta: Meta<OsFormTemplateComponent> = {
  title: 'Design System/Templates/Form Template',
  component: OsFormTemplateComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Template de formulário do Design System Orca Sonhos com header, progresso e ações.',
      },
    },
  },
  argTypes: {
    config: {
      control: { type: 'object' },
      description: 'Configuração do template de formulário',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do template',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do template',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do template',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    form: {
      control: { type: 'object' },
      description: 'Formulário reativo',
    },
    showHeader: {
      control: { type: 'boolean' },
      description: 'Mostrar header',
    },
    showProgress: {
      control: { type: 'boolean' },
      description: 'Mostrar barra de progresso',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsFormTemplateComponent>;

const sampleConfig = {
  title: 'Criar Usuário',
  subtitle: 'Preencha os dados para criar um novo usuário',
  showBackButton: true,
  backUrl: '/users',
  showSaveButton: true,
  showCancelButton: true,
  saveButtonText: 'Criar Usuário',
  cancelButtonText: 'Cancelar',
  showProgress: true,
  progressValue: 60,
  showActions: true,
  actions: [
    {
      label: 'Salvar Rascunho',
      variant: 'tertiary' as const,
      size: 'medium' as const,
      icon: 'save',
    },
    {
      label: 'Visualizar',
      variant: 'secondary' as const,
      size: 'medium' as const,
      icon: 'visibility',
    },
  ],
};

const simpleConfig = {
  title: 'Formulário Simples',
  subtitle: 'Formulário básico sem progresso',
  showBackButton: false,
  showSaveButton: true,
  showCancelButton: true,
  showProgress: false,
  showActions: true,
  actions: [],
};

const wizardConfig = {
  title: 'Assistente de Configuração',
  subtitle: 'Passo 2 de 4 - Informações Pessoais',
  showBackButton: true,
  backUrl: '/wizard/step1',
  showSaveButton: false,
  showCancelButton: true,
  cancelButtonText: 'Sair do Assistente',
  showProgress: true,
  progressValue: 50,
  showActions: true,
  actions: [
    {
      label: 'Próximo',
      variant: 'primary' as const,
      size: 'medium' as const,
      icon: 'arrow-forward',
    },
    {
      label: 'Anterior',
      variant: 'secondary' as const,
      size: 'medium' as const,
      icon: 'arrow-back',
    },
  ],
};

export const Default: Story = {
  args: {
    config: sampleConfig,
    size: 'medium',
    variant: 'default',
    theme: 'light',
    disabled: false,
    loading: false,
    form: null,
    showHeader: true,
    showProgress: true,
    showActions: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-template
        [config]="config"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [form]="form"
        [showHeader]="showHeader"
        [showProgress]="showProgress"
        [showActions]="showActions"
        (save)="save()"
        (cancelClick)="cancelClick()"
        (actionClick)="actionClick($event)"
      >
        <div style="padding: 20px;">
          <h3>Conteúdo do Formulário</h3>
          <p>Este é um exemplo de conteúdo que seria inserido no formulário.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Nome:</label>
              <input type="text" placeholder="Digite o nome" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Email:</label>
              <input type="email" placeholder="Digite o email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Telefone:</label>
              <input type="tel" placeholder="Digite o telefone" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
          </div>
        </div>
      </os-form-template>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-form-template
            [config]="defaultConfig"
            variant="default"
          >
            <div style="padding: 20px;">
              <p>Conteúdo do formulário default</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Compact</h4>
          <os-form-template
            [config]="compactConfig"
            variant="compact"
          >
            <div style="padding: 20px;">
              <p>Conteúdo do formulário compact</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-form-template
            [config]="detailedConfig"
            variant="detailed"
          >
            <div style="padding: 20px;">
              <p>Conteúdo do formulário detailed</p>
            </div>
          </os-form-template>
        </div>
      </div>
    `,
    props: {
      defaultConfig: {
        title: 'Formulário Default',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 30,
        showActions: true,
        actions: [],
      },
      compactConfig: {
        title: 'Formulário Compact',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: false,
        showActions: true,
        actions: [],
      },
      detailedConfig: {
        title: 'Formulário Detailed',
        subtitle: 'Formulário com mais detalhes',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 70,
        showActions: true,
        actions: [
          {
            label: 'Ajuda',
            variant: 'tertiary',
            size: 'medium',
            icon: 'help',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do template de formulário.',
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
          <os-form-template
            [config]="config"
            size="small"
          >
            <div style="padding: 20px;">
              <p>Formulário pequeno</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Medium</h4>
          <os-form-template
            [config]="config"
            size="medium"
          >
            <div style="padding: 20px;">
              <p>Formulário médio</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Large</h4>
          <os-form-template
            [config]="config"
            size="large"
          >
            <div style="padding: 20px;">
              <p>Formulário grande</p>
            </div>
          </os-form-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Formulário',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 50,
        showActions: true,
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de formulário.',
      },
    },
  },
};

export const Themes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Light Theme</h4>
          <os-form-template
            [config]="config"
            theme="light"
          >
            <div style="padding: 20px;">
              <p>Formulário tema claro</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-form-template
            [config]="config"
            theme="dark"
          >
            <div style="padding: 20px;">
              <p>Formulário tema escuro</p>
            </div>
          </os-form-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Formulário',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 40,
        showActions: true,
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de formulário.',
      },
    },
  },
};

export const WithProgress: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Progresso</h4>
          <os-form-template
            [config]="withProgressConfig"
            [showProgress]="true"
          >
            <div style="padding: 20px;">
              <p>Formulário com barra de progresso</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Sem Progresso</h4>
          <os-form-template
            [config]="withoutProgressConfig"
            [showProgress]="false"
          >
            <div style="padding: 20px;">
              <p>Formulário sem barra de progresso</p>
            </div>
          </os-form-template>
        </div>
      </div>
    `,
    props: {
      withProgressConfig: {
        title: 'Formulário com Progresso',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 75,
        showActions: true,
        actions: [],
      },
      withoutProgressConfig: {
        title: 'Formulário sem Progresso',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: false,
        showActions: true,
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Formulário com e sem barra de progresso.',
      },
    },
  },
};

export const WizardForm: Story = {
  render: () => ({
    template: `
      <os-form-template
        [config]="wizardConfig"
        [showProgress]="true"
      >
        <div style="padding: 20px;">
          <h3>Passo 2: Informações Pessoais</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Nome Completo:</label>
              <input type="text" placeholder="Digite seu nome completo" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Data de Nascimento:</label>
              <input type="date" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Profissão:</label>
              <input type="text" placeholder="Digite sua profissão" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
          </div>
        </div>
      </os-form-template>
    `,
    props: {
      wizardConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Formulário estilo assistente (wizard) com múltiplas etapas.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Carregando</h4>
          <os-form-template
            [config]="config"
            [loading]="true"
          >
            <div style="padding: 20px;">
              <p>Formulário carregando...</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-form-template
            [config]="config"
            [loading]="false"
          >
            <div style="padding: 20px;">
              <p>Formulário carregado</p>
            </div>
          </os-form-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Formulário',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 60,
        showActions: true,
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de formulário.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Habilitado</h4>
          <os-form-template
            [config]="config"
            [disabled]="false"
          >
            <div style="padding: 20px;">
              <p>Formulário habilitado</p>
            </div>
          </os-form-template>
        </div>

        <div>
          <h4>Desabilitado</h4>
          <os-form-template
            [config]="config"
            [disabled]="true"
          >
            <div style="padding: 20px;">
              <p>Formulário desabilitado</p>
            </div>
          </os-form-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Formulário',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: true,
        progressValue: 30,
        showActions: true,
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados habilitado e desabilitado do template de formulário.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <os-form-template
        [config]="config"
        [showHeader]="false"
      >
        <div style="padding: 20px;">
          <h3>Formulário sem Header</h3>
          <p>Este formulário não possui header.</p>
        </div>
      </os-form-template>
    `,
    props: {
      config: {
        title: 'Formulário sem Header',
        showSaveButton: true,
        showCancelButton: true,
        showProgress: false,
        showActions: true,
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de formulário sem header.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    config: sampleConfig,
    size: 'medium',
    variant: 'default',
    theme: 'light',
    disabled: false,
    loading: false,
    form: null,
    showHeader: true,
    showProgress: true,
    showActions: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-form-template
        [config]="config"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [form]="form"
        [showHeader]="showHeader"
        [showProgress]="showProgress"
        [showActions]="showActions"
        (save)="save()"
        (cancelClick)="cancelClick()"
        (actionClick)="actionClick($event)"
      >
        <div style="padding: 20px;">
          <h3>Formulário Interativo</h3>
          <p>Use os controles para testar diferentes configurações.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Campo de Teste:</label>
              <input type="text" placeholder="Digite algo aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
          </div>
        </div>
      </os-form-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de formulário interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
