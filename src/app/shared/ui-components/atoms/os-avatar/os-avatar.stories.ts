import type { Meta, StoryObj } from '@storybook/angular';
import { OsAvatarComponent } from './os-avatar.component';

const meta: Meta<OsAvatarComponent> = {
  title: 'Design System/Atoms/Avatar',
  component: OsAvatarComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Avatar do Design System Orca Sonhos com 3 variantes, 6 tamanhos, suporte a imagem, iniciais e ícones.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['circle', 'square', 'rounded'],
      description: 'Variante visual do avatar',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Tamanho do avatar',
    },
    image: {
      control: { type: 'text' },
      description: 'URL da imagem do avatar',
    },
    images: {
      control: { type: 'object' },
      description: 'Array de URLs de imagens para carousel',
    },
    initials: {
      control: { type: 'text' },
      description: 'Iniciais para exibir quando não há imagem',
    },
    alt: {
      control: { type: 'text' },
      description: 'Texto alternativo para a imagem',
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy', 'invisible'],
      description: 'Status do usuário',
    },
    role: {
      control: { type: 'select' },
      options: ['img', 'button', 'presentation'],
      description: 'Role de acessibilidade',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Avatar clicável',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    title: {
      control: { type: 'text' },
      description: 'Título do avatar (tooltip)',
    },
    badge: {
      control: { type: 'boolean' },
      description: 'Mostrar badge',
    },
    badgeText: {
      control: { type: 'text' },
      description: 'Texto do badge',
    },
    badgeVariant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Variante do badge',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsAvatarComponent>;

export const Default: Story = {
  args: {
    variant: 'circle',
    size: 'md',
    initials: 'JS',
    ariaLabel: 'Avatar de João Silva',
  },
};

export const WithImage: Story = {
  args: {
    variant: 'circle',
    size: 'md',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Avatar de usuário',
    ariaLabel: 'Avatar de usuário',
  },
};

export const Square: Story = {
  args: {
    variant: 'square',
    size: 'md',
    initials: 'AB',
    ariaLabel: 'Avatar quadrado',
  },
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    size: 'md',
    initials: 'CD',
    ariaLabel: 'Avatar arredondado',
  },
};

export const Small: Story = {
  args: {
    variant: 'circle',
    size: 'sm',
    initials: 'EF',
    ariaLabel: 'Avatar pequeno',
  },
};

export const Large: Story = {
  args: {
    variant: 'circle',
    size: 'lg',
    initials: 'GH',
    ariaLabel: 'Avatar grande',
  },
};

export const ExtraLarge: Story = {
  args: {
    variant: 'circle',
    size: 'xl',
    initials: 'IJ',
    ariaLabel: 'Avatar extra grande',
  },
};

export const WithBadge: Story = {
  args: {
    variant: 'circle',
    size: 'md',
    initials: 'KL',
    badge: true,
    badgeText: '3',
    badgeVariant: 'primary',
    ariaLabel: 'Avatar com badge',
  },
};

export const WithBadgeSuccess: Story = {
  args: {
    variant: 'circle',
    size: 'md',
    initials: 'MN',
    badge: true,
    badgeText: '✓',
    badgeVariant: 'success',
    ariaLabel: 'Avatar com badge de sucesso',
  },
};

export const WithBadgeWarning: Story = {
  args: {
    variant: 'circle',
    size: 'md',
    initials: 'OP',
    badge: true,
    badgeText: '!',
    badgeVariant: 'warning',
    ariaLabel: 'Avatar com badge de aviso',
  },
};

export const WithBadgeError: Story = {
  args: {
    variant: 'circle',
    size: 'md',
    initials: 'QR',
    badge: true,
    badgeText: '×',
    badgeVariant: 'error',
    ariaLabel: 'Avatar com badge de erro',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-avatar size="xs" initials="XS" [badge]="true" badgeText="1" badgeVariant="primary"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">XS</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="sm" initials="SM" [badge]="true" badgeText="2" badgeVariant="success"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">SM</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="md" initials="MD" [badge]="true" badgeText="3" badgeVariant="warning"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">MD</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="lg" initials="LG" [badge]="true" badgeText="4" badgeVariant="error"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">LG</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="xl" initials="XL" [badge]="true" badgeText="5" badgeVariant="info"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">XL</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="2xl" initials="2X" [badge]="true" badgeText="6" badgeVariant="secondary"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">2XL</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do avatar.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-avatar variant="circle" size="lg" initials="C" [badge]="true" badgeText="1" badgeVariant="primary"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Circle</div>
        </div>
        <div style="text-align: center;">
          <os-avatar variant="square" size="lg" initials="S" [badge]="true" badgeText="2" badgeVariant="success"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Square</div>
        </div>
        <div style="text-align: center;">
          <os-avatar variant="rounded" size="lg" initials="R" [badge]="true" badgeText="3" badgeVariant="warning"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Rounded</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis do avatar.',
      },
    },
  },
};

export const WithStatus: Story = {
  args: {
    variant: 'circle',
    size: 'lg',
    initials: 'JS',
    status: 'online',
    ariaLabel: 'Avatar com status online',
  },
};

export const WithLoading: Story = {
  args: {
    variant: 'circle',
    size: 'lg',
    loading: true,
    ariaLabel: 'Avatar carregando',
  },
};

export const Clickable: Story = {
  args: {
    variant: 'circle',
    size: 'lg',
    initials: 'CL',
    clickable: true,
    ariaLabel: 'Avatar clicável',
  },
};

export const WithMultipleImages: Story = {
  args: {
    variant: 'circle',
    size: 'lg',
    images: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    ],
    ariaLabel: 'Avatar com múltiplas imagens',
  },
};

export const StatusVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-avatar size="lg" initials="ON" status="online" [badge]="true" badgeText="✓" badgeVariant="success"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Online</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="lg" initials="OF" status="offline" [badge]="true" badgeText="○" badgeVariant="default"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Offline</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="lg" initials="AW" status="away" [badge]="true" badgeText="!" badgeVariant="warning"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Away</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="lg" initials="BU" status="busy" [badge]="true" badgeText="×" badgeVariant="error"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Busy</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os status disponíveis do avatar.',
      },
    },
  },
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-avatar size="lg" initials="AR" role="img" ariaLabel="Avatar de usuário" title="Usuário ativo"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Role: img</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="lg" initials="BU" role="button" clickable="true" ariaLabel="Botão de avatar" title="Clique para abrir perfil"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Role: button</div>
        </div>
        <div style="text-align: center;">
          <os-avatar size="lg" initials="PR" role="presentation" ariaLabel="Avatar decorativo"></os-avatar>
          <div style="font-size: 12px; margin-top: 4px;">Role: presentation</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de diferentes roles de acessibilidade do avatar.',
      },
    },
  },
};
