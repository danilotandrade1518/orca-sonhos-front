import type { Meta, StoryObj } from '@storybook/angular';
import { OsBadgeComponent } from './os-badge.component';

const meta: Meta<OsBadgeComponent> = {
  title: 'Design System/Atoms/Badge',
  component: OsBadgeComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Badge do Design System Orca Sonhos com 4 variantes, 3 tamanhos e suporte a texto customizado.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Variante visual do badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do badge',
    },
    text: {
      control: { type: 'text' },
      description: 'Texto do badge',
    },
    icon: {
      control: { type: 'text' },
      description: 'Ícone do badge (Font Awesome)',
    },
    position: {
      control: { type: 'select' },
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline'],
      description: 'Posição do badge',
    },
    dot: {
      control: { type: 'boolean' },
      description: 'Mostrar apenas um ponto',
    },
    pill: {
      control: { type: 'boolean' },
      description: 'Formato pill',
    },
    outlined: {
      control: { type: 'boolean' },
      description: 'Estilo outlined',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsBadgeComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    text: 'Badge',
    icon: '',
    position: 'inline',
    dot: false,
    pill: false,
    outlined: false,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-badge [variant]="variant" [size]="size" [text]="text" [icon]="icon" [position]="position" [dot]="dot" [pill]="pill" [outlined]="outlined"></os-badge>',
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <os-badge variant="default" text="Default"></os-badge>
        <os-badge variant="success" text="Success"></os-badge>
        <os-badge variant="warning" text="Warning"></os-badge>
        <os-badge variant="danger" text="Danger"></os-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do badge.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <os-badge size="sm" text="Small"></os-badge>
        <os-badge size="md" text="Medium"></os-badge>
        <os-badge size="lg" text="Large"></os-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do badge.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <os-badge variant="success" text="Concluído" icon="fa fa-check"></os-badge>
        <os-badge variant="warning" text="Pendente" icon="fa fa-clock"></os-badge>
        <os-badge variant="danger" text="Erro" icon="fa fa-times"></os-badge>
        <os-badge variant="default" text="Info" icon="fa fa-info"></os-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badges com ícones Font Awesome.',
      },
    },
  },
};

export const StatusIndicators: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Status do Pedido:</span>
          <os-badge variant="success" text="Aprovado" icon="fa fa-check"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Status do Pagamento:</span>
          <os-badge variant="warning" text="Pendente" icon="fa fa-clock"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Status da Entrega:</span>
          <os-badge variant="danger" text="Cancelado" icon="fa fa-times"></os-badge>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de uso como indicadores de status.',
      },
    },
  },
};

export const Counters: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Notificações:</span>
          <os-badge variant="danger" text="5" size="small"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Mensagens:</span>
          <os-badge variant="default" text="12" size="small"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Itens no Carrinho:</span>
          <os-badge variant="success" text="3" size="small"></os-badge>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de uso como contadores.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    variant: 'default',
    size: 'md',
    text: 'Badge Interativo',
    icon: '',
    position: 'inline',
    dot: false,
    pill: false,
    outlined: false,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-badge [variant]="variant" [size]="size" [text]="text" [icon]="icon" [position]="position" [dot]="dot" [pill]="pill" [outlined]="outlined"></os-badge>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badge interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
