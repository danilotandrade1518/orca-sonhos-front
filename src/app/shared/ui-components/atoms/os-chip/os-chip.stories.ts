import type { Meta, StoryObj } from '@storybook/angular';
import { OsChipComponent } from './os-chip.component';

const meta: Meta<OsChipComponent> = {
  title: 'Design System/Atoms/Chip',
  component: OsChipComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Chip do Design System Orca Sonhos com 6 variantes, 3 tamanhos, suporte a ícones e remoção.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Variante visual do chip',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do chip',
    },
    text: {
      control: { type: 'text' },
      description: 'Texto do chip',
    },
    icon: {
      control: { type: 'text' },
      description: 'Ícone do chip (Font Awesome)',
    },
    removable: {
      control: { type: 'boolean' },
      description: 'Permitir remoção do chip',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
    selected: {
      control: { type: 'boolean' },
      description: 'Estado selecionado',
    },
    removeLabel: {
      control: { type: 'text' },
      description: 'Label para remoção (acessibilidade)',
    },
    clicked: {
      action: 'clicked',
      description: 'Evento de clique do chip',
    },
    removed: {
      action: 'removed',
      description: 'Evento de remoção do chip',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsChipComponent>;

export const Default: Story = {
  args: {
    text: 'Chip padrão',
    variant: 'neutral',
    size: 'medium',
  },
};

export const Primary: Story = {
  args: {
    text: 'Chip primário',
    variant: 'primary',
    size: 'medium',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Chip secundário',
    variant: 'secondary',
    size: 'medium',
  },
};

export const Success: Story = {
  args: {
    text: 'Chip de sucesso',
    variant: 'success',
    size: 'medium',
  },
};

export const Warning: Story = {
  args: {
    text: 'Chip de aviso',
    variant: 'warning',
    size: 'medium',
  },
};

export const Danger: Story = {
  args: {
    text: 'Chip de perigo',
    variant: 'danger',
    size: 'medium',
  },
};

export const WithIcon: Story = {
  args: {
    text: 'Chip com ícone',
    icon: 'fas fa-star',
    variant: 'primary',
    size: 'medium',
  },
};

export const Removable: Story = {
  args: {
    text: 'Chip removível',
    removable: true,
    variant: 'primary',
    size: 'medium',
  },
};

export const Selected: Story = {
  args: {
    text: 'Chip selecionado',
    selected: true,
    variant: 'primary',
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    text: 'Chip desabilitado',
    disabled: true,
    variant: 'neutral',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    text: 'Chip pequeno',
    variant: 'primary',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    text: 'Chip grande',
    variant: 'primary',
    size: 'large',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <os-chip text="Primary" variant="primary" size="medium"></os-chip>
        <os-chip text="Secondary" variant="secondary" size="medium"></os-chip>
        <os-chip text="Success" variant="success" size="medium"></os-chip>
        <os-chip text="Warning" variant="warning" size="medium"></os-chip>
        <os-chip text="Danger" variant="danger" size="medium"></os-chip>
        <os-chip text="Neutral" variant="neutral" size="medium"></os-chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todas as variantes disponíveis do chip.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <os-chip text="Small" variant="primary" size="small"></os-chip>
        <os-chip text="Medium" variant="primary" size="medium"></os-chip>
        <os-chip text="Large" variant="primary" size="large"></os-chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de todos os tamanhos disponíveis do chip.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <os-chip text="Favorito" icon="fas fa-heart" variant="danger" size="medium"></os-chip>
        <os-chip text="Estrela" icon="fas fa-star" variant="warning" size="medium"></os-chip>
        <os-chip text="Check" icon="fas fa-check" variant="success" size="medium"></os-chip>
        <os-chip text="Info" icon="fas fa-info" variant="primary" size="medium"></os-chip>
        <os-chip text="Tag" icon="fas fa-tag" variant="secondary" size="medium"></os-chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de chips com diferentes ícones.',
      },
    },
  },
};

export const RemovableChips: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <os-chip text="Removível 1" variant="primary" size="medium" [removable]="true"></os-chip>
        <os-chip text="Removível 2" variant="success" size="medium" [removable]="true"></os-chip>
        <os-chip text="Removível 3" variant="warning" size="medium" [removable]="true"></os-chip>
        <os-chip text="Removível 4" variant="danger" size="medium" [removable]="true"></os-chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de chips removíveis.',
      },
    },
  },
};

export const InteractiveStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <os-chip text="Normal" variant="primary" size="medium"></os-chip>
        <os-chip text="Selecionado" variant="primary" size="medium" [selected]="true"></os-chip>
        <os-chip text="Desabilitado" variant="neutral" size="medium" [disabled]="true"></os-chip>
        <os-chip text="Removível" variant="success" size="medium" [removable]="true"></os-chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração dos diferentes estados interativos do chip.',
      },
    },
  },
};
