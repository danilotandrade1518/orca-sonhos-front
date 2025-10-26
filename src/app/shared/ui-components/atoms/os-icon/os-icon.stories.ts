import type { Meta, StoryObj } from '@storybook/angular';
import { OsIconComponent } from './os-icon.component';

const meta: Meta<OsIconComponent> = {
  title: 'Design System/Atoms/Icon',
  component: OsIconComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Ícone do Design System Orca Sonhos com 7 variantes, 6 tamanhos, suporte a animações e Material Icons. Centraliza a renderização de ícones para garantir consistência visual e facilitar manutenção.',
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
    role: {
      control: { type: 'select' },
      options: ['decorative', 'informative', 'interactive'],
      description: 'Papel do ícone para acessibilidade',
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
    svgContent: {
      control: { type: 'text' },
      description: 'Conteúdo SVG inline',
    },
    svgUrl: {
      control: { type: 'text' },
      description: 'URL do arquivo SVG',
    },
    fallbackIcon: {
      control: { type: 'text' },
      description: 'Ícone de fallback',
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
    role: 'informative',
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
          <os-icon name="attach_money" size="lg" variant="success"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Money</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="chart" size="lg" variant="info"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Chart</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="calendar_today" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Calendar</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="eye" size="lg" variant="secondary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Eye</div>
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
        <div style="text-align: center;">
          <os-icon name="close" size="lg" variant="default"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Close</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstração de ícones comuns do sistema, incluindo os novos ícones adicionados na migração OS-224.',
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

export const AccessibilityRoles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-icon name="star" size="lg" variant="primary" role="decorative"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Decorative</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="warning" size="lg" variant="warning" role="informative" ariaLabel="Aviso importante"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Informative</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="settings" size="lg" variant="primary" role="interactive" ariaLabel="Configurações" title="Abrir configurações"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Interactive</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes papéis de acessibilidade dos ícones.',
      },
    },
  },
};

export const SVGSupport: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center;">
          <os-icon
            size="lg"
            variant="primary"
            svgContent="<svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'><circle cx='12' cy='12' r='10'/></svg>"
            ariaLabel="Círculo SVG"
          ></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">SVG Inline</div>
        </div>
        <div style="text-align: center;">
          <os-icon
            name="home"
            size="lg"
            variant="success"
            fallbackIcon="help"
          ></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Fallback</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de suporte a SVG e fallback para ícones não encontrados.',
      },
    },
  },
};

export const FormIcons: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
        <div style="text-align: center;">
          <os-icon name="eye" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Eye (Suffix)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="attach_money" size="lg" variant="success"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Money (Prefix)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="calendar_today" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Calendar (Toggle)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="close" size="lg" variant="default"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Close (Clear)</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="search" size="lg" variant="primary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Search</div>
        </div>
        <div style="text-align: center;">
          <os-icon name="filter" size="lg" variant="secondary"></os-icon>
          <div style="font-size: 12px; margin-top: 4px;">Filter</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Ícones específicos para formulários e inputs, incluindo os novos ícones adicionados na migração OS-224.',
      },
    },
  },
};

export const ContrastExamples: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div style="background: #ffffff; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">Background Claro</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <os-icon name="home" size="md" variant="default" data-background="light"></os-icon>
            <os-icon name="user" size="md" variant="primary" data-background="light"></os-icon>
            <os-icon name="settings" size="md" variant="secondary" data-background="light"></os-icon>
          </div>
        </div>
        <div style="background: #1a1a1a; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #fff;">Background Escuro</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <os-icon name="home" size="md" variant="default" data-background="dark"></os-icon>
            <os-icon name="user" size="md" variant="primary" data-background="dark"></os-icon>
            <os-icon name="settings" size="md" variant="secondary" data-background="dark"></os-icon>
          </div>
        </div>
        <div style="background: #e3f2fd; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #1976d2;">Background Colorido</h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <os-icon name="home" size="md" variant="default" data-background="colored"></os-icon>
            <os-icon name="user" size="md" variant="primary" data-background="colored"></os-icon>
            <os-icon name="settings" size="md" variant="secondary" data-background="colored"></os-icon>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de contraste automático em diferentes backgrounds.',
      },
    },
  },
};
