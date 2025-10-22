import type { Meta, StoryObj } from '@storybook/angular';
import { OsModalTemplateComponent } from './os-modal-template.component';

const meta: Meta<OsModalTemplateComponent> = {
  title: 'Design System/Templates/Modal Template',
  component: OsModalTemplateComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Template de modal do Design System Orca Sonhos com ações e configurações flexíveis.',
      },
    },
  },
  argTypes: {
    config: {
      control: { type: 'object' },
      description: 'Configuração do template de modal',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do modal',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do template',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do modal',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    valid: {
      control: { type: 'boolean' },
      description: 'Estado válido do formulário',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsModalTemplateComponent>;

const sampleConfig = {
  title: 'Confirmar Ação',
  subtitle: 'Tem certeza que deseja continuar?',
  showCloseButton: true,
  showHeader: true,
  showFooter: true,
  showActions: true,
  closeButtonText: 'Fechar',
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  showConfirmButton: true,
  showCancelButton: true,
  actions: [],
};

const confirmationConfig = {
  title: 'Excluir Item',
  subtitle: 'Esta ação não pode ser desfeita.',
  showCloseButton: true,
  showHeader: true,
  showFooter: true,
  showActions: true,
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonText: 'Excluir',
  cancelButtonText: 'Cancelar',
  actions: [],
};

const formConfig = {
  title: 'Editar Usuário',
  subtitle: 'Preencha os dados do usuário',
  showCloseButton: true,
  showHeader: true,
  showFooter: true,
  showActions: true,
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonText: 'Salvar',
  cancelButtonText: 'Cancelar',
  actions: [
    {
      label: 'Resetar',
      variant: 'tertiary' as const,
      size: 'medium' as const,
      icon: 'refresh',
    },
  ],
};

const infoConfig = {
  title: 'Informações',
  subtitle: 'Detalhes do item selecionado',
  showCloseButton: true,
  showHeader: true,
  showFooter: true,
  showActions: true,
  showConfirmButton: false,
  showCancelButton: true,
  cancelButtonText: 'Fechar',
  actions: [
    {
      label: 'Editar',
      variant: 'primary' as const,
      size: 'medium' as const,
      icon: 'edit',
    },
    {
      label: 'Duplicar',
      variant: 'secondary' as const,
      size: 'medium' as const,
      icon: 'copy',
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
    valid: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-modal-template
        [config]="config"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [valid]="valid"
        (closed)="closed()"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (actionClick)="actionClick($event)"
        (backdropClick)="backdropClick()"
        (escapeKey)="escapeKey()"
      >
        <div style="padding: 20px;">
          <p>Este é o conteúdo do modal. Aqui você pode colocar qualquer conteúdo necessário.</p>
          <p>O template de modal fornece uma estrutura consistente com header, conteúdo e ações.</p>
        </div>
      </os-modal-template>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-modal-template
            [config]="defaultConfig"
            variant="default"
          >
            <div style="padding: 20px;">
              <p>Modal padrão com todas as funcionalidades.</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Compact</h4>
          <os-modal-template
            [config]="compactConfig"
            variant="compact"
          >
            <div style="padding: 20px;">
              <p>Modal compacto para confirmações rápidas.</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-modal-template
            [config]="detailedConfig"
            variant="detailed"
          >
            <div style="padding: 20px;">
              <p>Modal detalhado para formulários complexos.</p>
            </div>
          </os-modal-template>
        </div>
      </div>
    `,
    props: {
      defaultConfig: {
        title: 'Modal Default',
        subtitle: 'Modal padrão do sistema',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        actions: [],
      },
      compactConfig: {
        title: 'Modal Compact',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        actions: [],
      },
      detailedConfig: {
        title: 'Modal Detailed',
        subtitle: 'Modal com mais detalhes e opções',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
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
        story: 'Todas as variantes disponíveis do template de modal.',
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
          <os-modal-template
            [config]="config"
            size="small"
          >
            <div style="padding: 20px;">
              <p>Modal pequeno para confirmações simples.</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Medium</h4>
          <os-modal-template
            [config]="config"
            size="medium"
          >
            <div style="padding: 20px;">
              <p>Modal médio para a maioria dos casos de uso.</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Large</h4>
          <os-modal-template
            [config]="config"
            size="large"
          >
            <div style="padding: 20px;">
              <p>Modal grande para formulários complexos e conteúdo extenso.</p>
            </div>
          </os-modal-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Modal',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de modal.',
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
          <os-modal-template
            [config]="config"
            theme="light"
          >
            <div style="padding: 20px;">
              <p>Modal com tema claro.</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-modal-template
            [config]="config"
            theme="dark"
          >
            <div style="padding: 20px;">
              <p>Modal com tema escuro.</p>
            </div>
          </os-modal-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Modal',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de modal.',
      },
    },
  },
};

export const ConfirmationModal: Story = {
  render: () => ({
    template: `
      <os-modal-template
        [config]="confirmationConfig"
        variant="compact"
        size="small"
      >
        <div style="padding: 20px; text-align: center;">
          <p>Esta ação não pode ser desfeita. Tem certeza que deseja continuar?</p>
        </div>
      </os-modal-template>
    `,
    props: {
      confirmationConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal de confirmação para ações destrutivas.',
      },
    },
  },
};

export const FormModal: Story = {
  render: () => ({
    template: `
      <os-modal-template
        [config]="formConfig"
        variant="detailed"
        size="large"
      >
        <div style="padding: 20px;">
          <h3>Editar Usuário</h3>
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
      </os-modal-template>
    `,
    props: {
      formConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal de formulário com ações adicionais.',
      },
    },
  },
};

export const InfoModal: Story = {
  render: () => ({
    template: `
      <os-modal-template
        [config]="infoConfig"
        variant="default"
        size="medium"
      >
        <div style="padding: 20px;">
          <h3>Informações do Usuário</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <strong>Nome:</strong> João Silva
            </div>
            <div>
              <strong>Email:</strong> joao@example.com
            </div>
            <div>
              <strong>Telefone:</strong> (11) 99999-9999
            </div>
            <div>
              <strong>Status:</strong> Ativo
            </div>
            <div>
              <strong>Última Atualização:</strong> 15/01/2024
            </div>
          </div>
        </div>
      </os-modal-template>
    `,
    props: {
      infoConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal informativo com ações de edição e duplicação.',
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
          <os-modal-template
            [config]="config"
            [loading]="true"
          >
            <div style="padding: 20px;">
              <p>Processando solicitação...</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-modal-template
            [config]="config"
            [loading]="false"
          >
            <div style="padding: 20px;">
              <p>Modal carregado com sucesso.</p>
            </div>
          </os-modal-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Modal',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de modal.',
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
          <os-modal-template
            [config]="config"
            [disabled]="false"
          >
            <div style="padding: 20px;">
              <p>Modal habilitado com todas as ações disponíveis.</p>
            </div>
          </os-modal-template>
        </div>

        <div>
          <h4>Desabilitado</h4>
          <os-modal-template
            [config]="config"
            [disabled]="true"
          >
            <div style="padding: 20px;">
              <p>Modal desabilitado com ações bloqueadas.</p>
            </div>
          </os-modal-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Modal',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados habilitado e desabilitado do template de modal.',
      },
    },
  },
};

export const InvalidForm: Story = {
  render: () => ({
    template: `
      <os-modal-template
        [config]="config"
        [valid]="false"
      >
        <div style="padding: 20px;">
          <h3>Formulário com Erros</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Nome:</label>
              <input type="text" placeholder="Digite o nome" style="width: 100%; padding: 8px; border: 1px solid #f44336; border-radius: 4px;">
              <small style="color: #f44336;">Nome é obrigatório</small>
            </div>
            <div>
              <label>Email:</label>
              <input type="email" placeholder="Digite o email" style="width: 100%; padding: 8px; border: 1px solid #f44336; border-radius: 4px;">
              <small style="color: #f44336;">Email inválido</small>
            </div>
          </div>
        </div>
      </os-modal-template>
    `,
    props: {
      config: {
        title: 'Formulário com Erros',
        subtitle: 'Corrija os erros antes de continuar',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        actions: [],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal com formulário inválido (botão de confirmação desabilitado).',
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
    valid: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-modal-template
        [config]="config"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [valid]="valid"
        (closed)="closed()"
        (confirmed)="confirmed()"
        (cancelled)="cancelled()"
        (actionClick)="actionClick($event)"
        (backdropClick)="backdropClick()"
        (escapeKey)="escapeKey()"
      >
        <div style="padding: 20px;">
          <h3>Modal Interativo</h3>
          <p>Use os controles para testar diferentes configurações do modal.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Campo de Teste:</label>
              <input type="text" placeholder="Digite algo aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
          </div>
        </div>
      </os-modal-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de modal interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
