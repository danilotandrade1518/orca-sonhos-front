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
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'goal-active',
        'goal-completed',
        'goal-overdue',
      ],
      description: 'Variante visual do badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
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
    role: {
      control: { type: 'select' },
      options: ['decorative', 'status', 'alert'],
      description: 'Role de acessibilidade',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    title: {
      control: { type: 'text' },
      description: 'Título do badge',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Animação de entrada',
    },
    maxValue: {
      control: { type: 'number' },
      description: 'Valor máximo antes de mostrar 99+',
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
    role: 'decorative',
    ariaLabel: '',
    title: '',
    animated: true,
    maxValue: 99,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-badge [variant]="variant" [size]="size" [text]="text" [icon]="icon" [position]="position" [dot]="dot" [pill]="pill" [outlined]="outlined" [role]="role" [ariaLabel]="ariaLabel" [title]="title" [animated]="animated" [maxValue]="maxValue"></os-badge>',
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <os-badge variant="default" text="Default"></os-badge>
        <os-badge variant="primary" text="Primary"></os-badge>
        <os-badge variant="secondary" text="Secondary"></os-badge>
        <os-badge variant="success" text="Success"></os-badge>
        <os-badge variant="warning" text="Warning"></os-badge>
        <os-badge variant="error" text="Error"></os-badge>
        <os-badge variant="info" text="Info"></os-badge>
        <os-badge variant="goal-active" text="Meta Ativa"></os-badge>
        <os-badge variant="goal-completed" text="Meta Concluída"></os-badge>
        <os-badge variant="goal-overdue" text="Meta Atrasada"></os-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do badge, incluindo as específicas para metas.',
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
        <os-badge size="xl" text="Extra Large"></os-badge>
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

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Badge Decorativo:</span>
          <os-badge variant="default" text="Decorativo" role="decorative"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Badge de Status:</span>
          <os-badge variant="success" text="Concluído" role="status" ariaLabel="Status: Concluído"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Badge de Alerta:</span>
          <os-badge variant="error" text="Erro" role="alert" ariaLabel="Alerta: Erro crítico"></os-badge>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de badges com diferentes roles de acessibilidade.',
      },
    },
  },
};

export const NumberFormatting: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Números normais:</span>
          <os-badge variant="primary" text="50" maxValue="99"></os-badge>
          <os-badge variant="success" text="75" maxValue="99"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Números grandes (99+):</span>
          <os-badge variant="warning" text="150" maxValue="99"></os-badge>
          <os-badge variant="error" text="250" maxValue="99"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Texto não numérico:</span>
          <os-badge variant="info" text="Novo" maxValue="99"></os-badge>
          <os-badge variant="secondary" text="Atualizado" maxValue="99"></os-badge>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de formatação automática de números grandes.',
      },
    },
  },
};

export const GoalStatus: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Meta Ativa:</span>
          <os-badge variant="goal-active" text="Em Progresso" role="status" ariaLabel="Meta ativa: Em progresso"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Meta Concluída:</span>
          <os-badge variant="goal-completed" text="Concluída" role="status" ariaLabel="Meta concluída"></os-badge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span>Meta Atrasada:</span>
          <os-badge variant="goal-overdue" text="Atrasada" role="alert" ariaLabel="Meta atrasada"></os-badge>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de badges específicos para status de metas.',
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
    role: 'decorative',
    ariaLabel: '',
    title: '',
    animated: true,
    maxValue: 99,
  },
  render: (args) => ({
    props: args,
    template:
      '<os-badge [variant]="variant" [size]="size" [text]="text" [icon]="icon" [position]="position" [dot]="dot" [pill]="pill" [outlined]="outlined" [role]="role" [ariaLabel]="ariaLabel" [title]="title" [animated]="animated" [maxValue]="maxValue"></os-badge>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Badge interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
