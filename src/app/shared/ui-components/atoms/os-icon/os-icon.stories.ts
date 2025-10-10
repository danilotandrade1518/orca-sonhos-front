import type { Meta, StoryObj } from '@storybook/angular';
import { OsIconComponent } from './os-icon.component';

const meta: Meta<OsIconComponent> = {
  title: 'Design System/Atoms/Icon',
  component: OsIconComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Ícone do Design System Orca Sonhos com 7 variantes, 6 tamanhos, suporte a animações e Font Awesome.',
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Nome do ícone',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Tamanho do ícone',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Variante visual do ícone',
    },
    ariaHidden: {
      control: { type: 'boolean' },
      description: 'Ocultar do leitor de tela',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    title: {
      control: { type: 'text' },
      description: 'Título do ícone (tooltip)',
    },
    spin: {
      control: { type: 'boolean' },
      description: 'Animação de rotação',
    },
    pulse: {
      control: { type: 'boolean' },
      description: 'Animação de pulso',
    },
    fontSet: {
      control: { type: 'text' },
      description: 'Conjunto de fontes (ex: fas, far, fab)',
    },
    fontIcon: {
      control: { type: 'text' },
      description: 'Nome do ícone da fonte',
    },
    inline: {
      control: { type: 'boolean' },
      description: 'Ícone inline',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsIconComponent>;

export const Default: Story = {
  args: {
    name: 'home',
    size: 'md',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    name: 'star',
    size: 'md',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    name: 'user',
    size: 'md',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    name: 'check',
    size: 'md',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    name: 'warning',
    size: 'md',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    name: 'error',
    size: 'md',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    name: 'info',
    size: 'md',
    variant: 'info',
  },
};

export const Small: Story = {
  args: {
    name: 'heart',
    size: 'sm',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    name: 'star',
    size: 'lg',
    variant: 'warning',
  },
};

export const ExtraLarge: Story = {
  args: {
    name: 'money',
    size: 'xl',
    variant: 'success',
  },
};

export const WithSpin: Story = {
  args: {
    name: 'loading',
    size: 'md',
    variant: 'primary',
    spin: true,
  },
};

export const WithPulse: Story = {
  args: {
    name: 'bell',
    size: 'md',
    variant: 'warning',
    pulse: true,
  },
};

export const WithAccessibility: Story = {
  args: {
    name: 'user',
    size: 'md',
    variant: 'default',
    ariaHidden: false,
    ariaLabel: 'Ícone de usuário',
    title: 'Usuário',
  },
};

export const FontAwesome: Story = {
  args: {
    name: 'home',
    size: 'md',
    variant: 'primary',
    fontSet: 'fas',
    fontIcon: 'home',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-icon name="star" size="xs" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">XS</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" size="sm" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">SM</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" size="md" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">MD</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">LG</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" size="xl" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">XL</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" size="2xl" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">2XL</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do ícone.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-icon name="star" variant="default" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Default</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" variant="primary" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Primary</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" variant="secondary" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Secondary</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="check" variant="success" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Success</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="warning" variant="warning" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Warning</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="error" variant="error" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Error</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="info" variant="info" size="lg"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Info</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis do ícone.',
      },
    },
  },
};

export const CommonIcons: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
        <div style="text-align: center;">
          <os-icon name="home" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Home</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="user" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">User</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="settings" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Settings</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="search" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Search</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="money" size="lg" variant="success"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Money</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="chart" size="lg" variant="info"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Chart</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="calendar" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Calendar</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="notification" size="lg" variant="warning"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Notification</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="heart" size="lg" variant="error"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Heart</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="star" size="lg" variant="warning"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Star</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de ícones comuns do sistema.',
      },
    },
  },
};

export const AnimatedIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-icon name="loading" size="lg" variant="primary" [spin]="true"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Loading (Spin)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="bell" size="lg" variant="warning" [pulse]="true"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Bell (Pulse)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="refresh" size="lg" variant="primary" [spin]="true"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Refresh (Spin)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="heart" size="lg" variant="error" [pulse]="true"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Heart (Pulse)</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de ícones com animações.',
      },
    },
  },
};
