import type { Meta, StoryObj } from '@storybook/angular';
import { OsPanelTemplateComponent } from './os-panel-template.component';

const meta: Meta<OsPanelTemplateComponent> = {
  title: 'Design System/Templates/Panel Template',
  component: OsPanelTemplateComponent,
  parameters: {
    docs: {
      description: {
        component: 'Template de painel do Design System Orca Sonhos com header, conteúdo e ações.',
      },
    },
  },
  argTypes: {
    config: {
      control: { type: 'object' },
      description: 'Configuração do template de painel',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do painel',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do template',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do painel',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    expanded: {
      control: { type: 'boolean' },
      description: 'Estado expandido (para painéis colapsáveis)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsPanelTemplateComponent>;

const sampleConfig = {
  title: 'Painel de Configurações',
  subtitle: 'Configure as opções do sistema',
  showHeader: true,
  showFooter: true,
  showActions: true,
  collapsible: false,
  expanded: true,
  actions: [
    {
      label: 'Salvar',
      variant: 'primary' as const,
      size: 'medium' as const,
      icon: 'save',
    },
    {
      label: 'Resetar',
      variant: 'secondary' as const,
      size: 'medium' as const,
      icon: 'refresh',
    },
  ],
};

const collapsibleConfig = {
  title: 'Painel Colapsável',
  subtitle: 'Clique para expandir/recolher',
  showHeader: true,
  showFooter: true,
  showActions: true,
  collapsible: true,
  expanded: true,
  actions: [
    {
      label: 'Editar',
      variant: 'primary' as const,
      size: 'medium' as const,
      icon: 'edit',
    },
  ],
};

const simpleConfig = {
  title: 'Painel Simples',
  showHeader: true,
  showFooter: false,
  showActions: false,
  collapsible: false,
  expanded: true,
  actions: [],
};

const detailedConfig = {
  title: 'Painel Detalhado',
  subtitle: 'Painel com múltiplas opções e ações',
  showHeader: true,
  showFooter: true,
  showActions: true,
  collapsible: false,
  expanded: true,
  actions: [
    {
      label: 'Aplicar',
      variant: 'primary' as const,
      size: 'medium' as const,
      icon: 'check',
    },
    {
      label: 'Cancelar',
      variant: 'secondary' as const,
      size: 'medium' as const,
      icon: 'close',
    },
    {
      label: 'Ajuda',
      variant: 'tertiary' as const,
      size: 'medium' as const,
      icon: 'help',
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
    expanded: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-panel-template
        [config]="config"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [expanded]="expanded"
        (actionClick)="actionClick($event)"
        (toggled)="toggled($event)"
      >
        <div style="padding: 20px;">
          <h4>Conteúdo do Painel</h4>
          <p>Este é o conteúdo principal do painel. Aqui você pode colocar qualquer conteúdo necessário.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Configuração 1:</label>
              <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Configuração 2:</label>
              <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
              </select>
            </div>
          </div>
        </div>
      </os-panel-template>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-panel-template
            [config]="defaultConfig"
            variant="default"
          >
            <div style="padding: 20px;">
              <p>Painel padrão com todas as funcionalidades.</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Compact</h4>
          <os-panel-template
            [config]="compactConfig"
            variant="compact"
          >
            <div style="padding: 20px;">
              <p>Painel compacto para economizar espaço.</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-panel-template
            [config]="detailedConfig"
            variant="detailed"
          >
            <div style="padding: 20px;">
              <p>Painel detalhado com mais opções.</p>
            </div>
          </os-panel-template>
        </div>
      </div>
    `,
    props: {
      defaultConfig: {
        title: 'Painel Default',
        subtitle: 'Painel padrão do sistema',
        showHeader: true,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
        ],
      },
      compactConfig: {
        title: 'Painel Compact',
        showHeader: true,
        showFooter: false,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'secondary',
            size: 'small',
            icon: 'edit',
          },
        ],
      },
      detailedConfig: {
        title: 'Painel Detailed',
        subtitle: 'Painel com múltiplas opções',
        showHeader: true,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Aplicar',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
          {
            label: 'Cancelar',
            variant: 'secondary',
            size: 'medium',
            icon: 'close',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do template de painel.',
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
          <os-panel-template
            [config]="config"
            size="small"
          >
            <div style="padding: 20px;">
              <p>Painel pequeno para informações compactas.</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Medium</h4>
          <os-panel-template
            [config]="config"
            size="medium"
          >
            <div style="padding: 20px;">
              <p>Painel médio para a maioria dos casos de uso.</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Large</h4>
          <os-panel-template
            [config]="config"
            size="large"
          >
            <div style="padding: 20px;">
              <p>Painel grande para conteúdo extenso.</p>
            </div>
          </os-panel-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Painel',
        showHeader: true,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do template de painel.',
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
          <os-panel-template
            [config]="config"
            theme="light"
          >
            <div style="padding: 20px;">
              <p>Painel com tema claro.</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-panel-template
            [config]="config"
            theme="dark"
          >
            <div style="padding: 20px;">
              <p>Painel com tema escuro.</p>
            </div>
          </os-panel-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Painel',
        showHeader: true,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do template de painel.',
      },
    },
  },
};

export const Collapsible: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Expandido</h4>
          <os-panel-template
            [config]="collapsibleConfig"
            [expanded]="true"
          >
            <div style="padding: 20px;">
              <p>Painel colapsável expandido. Clique no botão para recolher.</p>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <label>Campo 1:</label>
                  <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                  <label>Campo 2:</label>
                  <input type="text" placeholder="Digite aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
              </div>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Recolhido</h4>
          <os-panel-template
            [config]="collapsibleConfig"
            [expanded]="false"
          >
            <div style="padding: 20px;">
              <p>Painel colapsável recolhido. Clique no botão para expandir.</p>
            </div>
          </os-panel-template>
        </div>
      </div>
    `,
    props: {
      collapsibleConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Painel colapsável em estados expandido e recolhido.',
      },
    },
  },
};

export const SimplePanel: Story = {
  render: () => ({
    template: `
      <os-panel-template
        [config]="simpleConfig"
      >
        <div style="padding: 20px;">
          <h4>Painel Simples</h4>
          <p>Este é um painel simples sem ações ou footer.</p>
          <p>Ideal para exibir informações estáticas ou conteúdo de leitura.</p>
        </div>
      </os-panel-template>
    `,
    props: {
      simpleConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Painel simples sem ações ou footer.',
      },
    },
  },
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <os-panel-template
        [config]="detailedConfig"
      >
        <div style="padding: 20px;">
          <h4>Painel com Ações</h4>
          <p>Este painel possui múltiplas ações no footer.</p>
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
              <label>Mensagem:</label>
              <textarea placeholder="Digite a mensagem" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; height: 80px;"></textarea>
            </div>
          </div>
        </div>
      </os-panel-template>
    `,
    props: {
      detailedConfig,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Painel com múltiplas ações no footer.',
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
          <os-panel-template
            [config]="config"
            [loading]="true"
          >
            <div style="padding: 20px;">
              <p>Carregando conteúdo do painel...</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-panel-template
            [config]="config"
            [loading]="false"
          >
            <div style="padding: 20px;">
              <p>Conteúdo do painel carregado com sucesso.</p>
            </div>
          </os-panel-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Painel',
        showHeader: true,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do template de painel.',
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
          <os-panel-template
            [config]="config"
            [disabled]="false"
          >
            <div style="padding: 20px;">
              <p>Painel habilitado com todas as ações disponíveis.</p>
            </div>
          </os-panel-template>
        </div>

        <div>
          <h4>Desabilitado</h4>
          <os-panel-template
            [config]="config"
            [disabled]="true"
          >
            <div style="padding: 20px;">
              <p>Painel desabilitado com ações bloqueadas.</p>
            </div>
          </os-panel-template>
        </div>
      </div>
    `,
    props: {
      config: {
        title: 'Painel',
        showHeader: true,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados habilitado e desabilitado do template de painel.',
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <os-panel-template
        [config]="noHeaderConfig"
      >
        <div style="padding: 20px;">
          <h4>Painel sem Header</h4>
          <p>Este painel não possui header, apenas conteúdo e ações.</p>
        </div>
      </os-panel-template>
    `,
    props: {
      noHeaderConfig: {
        title: 'Painel sem Header',
        showHeader: false,
        showFooter: true,
        showActions: true,
        collapsible: false,
        expanded: true,
        actions: [
          {
            label: 'Ação',
            variant: 'primary',
            size: 'medium',
            icon: 'check',
          },
        ],
      },
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Painel sem header para uma interface mais limpa.',
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
    expanded: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-panel-template
        [config]="config"
        [size]="size"
        [variant]="variant"
        [theme]="theme"
        [disabled]="disabled"
        [loading]="loading"
        [expanded]="expanded"
        (actionClick)="actionClick($event)"
        (toggled)="toggled($event)"
      >
        <div style="padding: 20px;">
          <h4>Painel Interativo</h4>
          <p>Use os controles para testar diferentes configurações do painel.</p>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label>Campo de Teste:</label>
              <input type="text" placeholder="Digite algo aqui" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div>
              <label>Seleção:</label>
              <select style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
              </select>
            </div>
          </div>
        </div>
      </os-panel-template>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Template de painel interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
