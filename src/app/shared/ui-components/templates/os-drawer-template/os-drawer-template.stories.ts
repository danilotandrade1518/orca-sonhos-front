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

export const Default: Story = {
  args: {
    config: {
      title: 'Configurações',
      subtitle: 'Gerencie suas preferências e configurações',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
    },
    size: 'medium',
    variant: 'default',
    theme: 'light',
    position: 'right',
    disabled: false,
    loading: false,
    valid: true,
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
    size: 'small',
    config: {
      title: 'Ação Rápida',
      subtitle: 'Confirmação necessária',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    },
  },
};

export const Detailed: Story = {
  args: {
    ...Default.args,
    variant: 'detailed',
    size: 'large',
    config: {
      title: 'Configurações Avançadas',
      subtitle: 'Configure opções detalhadas do sistema',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aplicar Configurações',
      cancelButtonText: 'Descartar',
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    ...Default.args,
    config: {
      title: 'Ações Múltiplas',
      subtitle: 'Escolha uma das opções disponíveis',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      actions: [
        {
          label: 'Duplicar',
          variant: 'secondary',
          size: 'medium',
          icon: 'copy',
        },
        {
          label: 'Excluir',
          variant: 'danger',
          size: 'medium',
          icon: 'trash',
        },
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    config: {
      title: 'Processando...',
      subtitle: 'Aguarde enquanto processamos sua solicitação',
      showCloseButton: false,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: 'Processando...',
    },
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    config: {
      title: 'Modo Somente Leitura',
      subtitle: 'Este drawer está em modo somente leitura',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Fechar',
    },
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
    config: {
      title: 'Tema Escuro',
      subtitle: 'Interface com tema escuro ativado',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar',
    },
  },
};

export const LeftPosition: Story = {
  args: {
    ...Default.args,
    position: 'left',
    config: {
      title: 'Navegação',
      subtitle: 'Menu lateral de navegação',
      showCloseButton: true,
      showHeader: true,
      showActions: false,
    },
  },
};

export const TopPosition: Story = {
  args: {
    ...Default.args,
    position: 'top',
    size: 'small',
    config: {
      title: 'Notificação',
      subtitle: 'Mensagem importante do sistema',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: 'Entendi',
    },
  },
};

export const BottomPosition: Story = {
  args: {
    ...Default.args,
    position: 'bottom',
    size: 'small',
    config: {
      title: 'Ações Rápidas',
      subtitle: 'Acesso rápido a funcionalidades',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Executar',
      cancelButtonText: 'Fechar',
    },
  },
};

export const MobileResponsive: Story = {
  args: {
    ...Default.args,
    size: 'medium',
    config: {
      title: 'Responsivo',
      subtitle: 'Otimizado para dispositivos móveis',
      showCloseButton: true,
      showHeader: true,
      showActions: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Voltar',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
