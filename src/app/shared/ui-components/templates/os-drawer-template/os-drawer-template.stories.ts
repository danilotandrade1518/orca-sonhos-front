import type { Meta, StoryObj } from '@storybook/angular';
import { OsDrawerTemplateComponent } from './os-drawer-template.component';

const meta: Meta<OsDrawerTemplateComponent> = {
  title: 'Design System/Templates/Drawer Template',
  component: OsDrawerTemplateComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Template de drawer (gaveta lateral) do Design System Orca Sonhos com header, conteúdo e ações.',
      },
    },
  },
  argTypes: {
    config: {
      control: { type: 'object' },
      description: 'Configuração do template de drawer',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do drawer',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do template',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do drawer',
    },
    position: {
      control: { type: 'select' },
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Posição do drawer',
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
      description: 'Estado de validação',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDrawerTemplateComponent>;

const sampleConfig = {
  title: 'Configurações',
  subtitle: 'Ajuste as configurações do sistema',
  showCloseButton: true,
  showHeader: true,
  showFooter: true,
  showActions: true,
  closeButtonText: 'Fechar',
  confirmButtonText: 'Salvar',
  cancelButtonText: 'Cancelar',
  showConfirmButton: true,
  showCancelButton: true,
  actions: [
    {
      label: 'Aplicar',
      variant: 'primary' as const,
      size: 'medium' as const,
      disabled: false,
      loading: false,
      icon: 'check',
    },
    {
      label: 'Resetar',
      variant: 'secondary' as const,
      size: 'medium' as const,
      disabled: false,
      loading: false,
      icon: 'refresh',
    },
  ],
};

const compactConfig = {
  title: 'Drawer Compacto',
  showCloseButton: true,
  showHeader: true,
  showFooter: false,
  showActions: true,
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: 'OK',
};

const detailedConfig = {
  title: 'Configurações Detalhadas',
  subtitle: 'Configure todas as opções disponíveis no sistema',
  showCloseButton: true,
  showHeader: true,
  showFooter: true,
  showActions: true,
  closeButtonText: 'Fechar',
  confirmButtonText: 'Salvar Alterações',
  cancelButtonText: 'Descartar',
  showConfirmButton: true,
  showCancelButton: true,
  actions: [
    {
      label: 'Aplicar',
      variant: 'primary' as const,
      size: 'medium' as const,
      disabled: false,
      loading: false,
      icon: 'check',
    },
    {
      label: 'Resetar',
      variant: 'secondary' as const,
      size: 'medium' as const,
      disabled: false,
      loading: false,
      icon: 'refresh',
    },
    {
      label: 'Exportar',
      variant: 'tertiary' as const,
      size: 'medium' as const,
      disabled: false,
      loading: false,
      icon: 'download',
    },
  ],
};

export const Default: Story = {
  args: {
    config: sampleConfig,
    size: 'medium',
    variant: 'default',
    theme: 'light',
    position: 'right',
    disabled: false,
    loading: false,
    valid: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; height: 400px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
        <os-drawer-template
          [config]="config"
          [size]="size"
          [variant]="variant"
          [theme]="theme"
          [position]="position"
          [disabled]="disabled"
          [loading]="loading"
          [valid]="valid"
          (closed)="closed()"
          (confirmed)="confirmed()"
          (cancelled)="cancelled()"
          (actionClick)="actionClick($event)"
        >
          <div style="padding: 20px;">
            <h3>Conteúdo do Drawer</h3>
            <p>Este é o conteúdo principal do drawer. Aqui você pode colocar formulários, listas, ou qualquer outro conteúdo.</p>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label>Campo de Texto:</label>
                <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div>
                <label>Seleção:</label>
                <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                  <option>Opção 1</option>
                  <option>Opção 2</option>
                  <option>Opção 3</option>
                </select>
              </div>
              <div>
                <label>
                  <input type="checkbox" style="margin-right: 8px;">
                  Aceitar termos e condições
                </label>
              </div>
            </div>
          </div>
        </os-drawer-template>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="defaultConfig"
              variant="default"
            >
              <div style="padding: 20px;">
                <p>Drawer padrão com todas as funcionalidades.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Compact</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="compactConfig"
              variant="compact"
            >
              <div style="padding: 20px;">
                <p>Drawer compacto para economizar espaço.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Detailed</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="detailedConfig"
              variant="detailed"
            >
              <div style="padding: 20px;">
                <p>Drawer detalhado com mais informações.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>
      </div>
    `,
    props: {
      defaultConfig: {
        title: 'Drawer Default',
        subtitle: 'Drawer padrão do sistema',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
      },
      compactConfig,
      detailedConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do template de drawer.',
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
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              size="small"
            >
              <div style="padding: 20px;">
                <p>Drawer pequeno para interfaces compactas.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Medium</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              size="medium"
            >
              <div style="padding: 20px;">
                <p>Drawer médio para a maioria dos casos de uso.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Large</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              size="large"
            >
              <div style="padding: 20px;">
                <p>Drawer grande para conteúdo extenso.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Drawer',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de drawer.',
      },
    },
  },
};

export const Positions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Left</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              position="left"
            >
              <div style="padding: 20px;">
                <p>Drawer posicionado à esquerda.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Right</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              position="right"
            >
              <div style="padding: 20px;">
                <p>Drawer posicionado à direita.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Top</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              position="top"
            >
              <div style="padding: 20px;">
                <p>Drawer posicionado no topo.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Bottom</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              position="bottom"
            >
              <div style="padding: 20px;">
                <p>Drawer posicionado na parte inferior.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Drawer',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as posições disponíveis do template de drawer.',
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
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              theme="light"
            >
              <div style="padding: 20px;">
                <p>Drawer com tema claro.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              theme="dark"
            >
              <div style="padding: 20px;">
                <p>Drawer com tema escuro.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Drawer',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de drawer.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
        <os-drawer-template
          [config]="configWithoutHeader"
        >
          <div style="padding: 20px;">
            <h3>Drawer sem Header</h3>
            <p>Este drawer não possui header, apenas o conteúdo e as ações.</p>
          </div>
        </os-drawer-template>
      </div>
    `,
    props: {
      configWithoutHeader: {
        title: 'Drawer sem Header',
        showCloseButton: false,
        showHeader: false,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Drawer sem header para uma interface mais limpa.',
      },
    },
  },
};

export const WithoutActions: Story = {
  render: () => ({
    template: `
      <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
        <os-drawer-template
          [config]="configWithoutActions"
        >
          <div style="padding: 20px;">
            <h3>Drawer sem Ações</h3>
            <p>Este drawer não possui ações, apenas o conteúdo.</p>
          </div>
        </os-drawer-template>
      </div>
    `,
    props: {
      configWithoutActions: {
        title: 'Drawer sem Ações',
        subtitle: 'Apenas visualização',
        showCloseButton: true,
        showHeader: true,
        showFooter: false,
        showActions: false,
        showConfirmButton: false,
        showCancelButton: false,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Drawer sem ações para visualização apenas.',
      },
    },
  },
};

export const WithCustomActions: Story = {
  render: () => ({
    template: `
      <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
        <os-drawer-template
          [config]="configWithCustomActions"
        >
          <div style="padding: 20px;">
            <h3>Drawer com Ações Customizadas</h3>
            <p>Este drawer possui ações personalizadas além dos botões padrão.</p>
          </div>
        </os-drawer-template>
      </div>
    `,
    props: {
      configWithCustomActions: {
        title: 'Drawer com Ações Customizadas',
        subtitle: 'Múltiplas opções de ação',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
        actions: [
          {
            label: 'Salvar como Rascunho',
            variant: 'secondary' as const,
            size: 'medium' as const,
            disabled: false,
            loading: false,
            icon: 'save',
          },
          {
            label: 'Pré-visualizar',
            variant: 'tertiary' as const,
            size: 'medium' as const,
            disabled: false,
            loading: false,
            icon: 'visibility',
          },
          {
            label: 'Excluir',
            variant: 'danger' as const,
            size: 'medium' as const,
            disabled: false,
            loading: false,
            icon: 'delete',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Drawer com ações personalizadas além dos botões padrão.',
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
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              [loading]="true"
            >
              <div style="padding: 20px;">
                <p>Processando dados...</p>
              </div>
            </os-drawer-template>
          </div>
        </div>

        <div>
          <h4>Carregado</h4>
          <div style="position: relative; height: 300px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
            <os-drawer-template
              [config]="config"
              [loading]="false"
            >
              <div style="padding: 20px;">
                <p>Drawer carregado com sucesso.</p>
              </div>
            </os-drawer-template>
          </div>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Drawer',
        showCloseButton: true,
        showHeader: true,
        showFooter: true,
        showActions: true,
        showConfirmButton: true,
        showCancelButton: true,
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de drawer.',
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
    position: 'right',
    disabled: false,
    loading: false,
    valid: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="position: relative; height: 400px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
        <os-drawer-template
          [config]="config"
          [size]="size"
          [variant]="variant"
          [theme]="theme"
          [position]="position"
          [disabled]="disabled"
          [loading]="loading"
          [valid]="valid"
          (closed)="closed()"
          (confirmed)="confirmed()"
          (cancelled)="cancelled()"
          (actionClick)="actionClick($event)"
        >
          <div style="padding: 20px;">
            <h3>Drawer Interativo</h3>
            <p>Use os controles para testar diferentes configurações do drawer.</p>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label>Campo de Texto:</label>
                <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div>
                <label>Seleção:</label>
                <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                  <option>Opção 1</option>
                  <option>Opção 2</option>
                  <option>Opção 3</option>
                </select>
              </div>
              <div>
                <label>
                  <input type="checkbox" style="margin-right: 8px;">
                  Aceitar termos e condições
                </label>
              </div>
            </div>
          </div>
        </os-drawer-template>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de drawer interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
