import type { Meta, StoryObj } from '@storybook/angular';
import { OsCategoryManagerComponent, Category } from './os-category-manager.component';

const meta: Meta<OsCategoryManagerComponent> = {
  title: 'Design System/Organisms/Category Manager',
  component: OsCategoryManagerComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Gerenciador de categorias do Design System Orca Sonhos com CRUD completo, drag-and-drop, color picker e icon picker.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Título do gerenciador',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do gerenciador',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do gerenciador',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Tema do gerenciador',
    },
    categories: {
      control: { type: 'object' },
      description: 'Lista de categorias',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado desabilitado',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsCategoryManagerComponent>;

const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Alimentação',
    description: 'Gastos com comida e bebida',
    type: 'expense',
    color: '#EF4444',
    icon: 'utensils',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    order: 0,
  },
  {
    id: '2',
    name: 'Salário',
    description: 'Renda mensal',
    type: 'income',
    color: '#10B981',
    icon: 'wallet',
    active: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    order: 1,
  },
  {
    id: '3',
    name: 'Transporte',
    description: 'Gastos com transporte',
    type: 'expense',
    color: '#3B82F6',
    icon: 'car',
    active: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    order: 2,
  },
  {
    id: '4',
    name: 'Transferência',
    description: 'Transferências entre contas',
    type: 'transfer',
    color: '#8B5CF6',
    icon: 'credit-card',
    active: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    order: 3,
  },
];

export const Default: Story = {
  args: {
    title: 'Gerenciador de Categorias',
    variant: 'default',
    size: 'medium',
    theme: 'light',
    categories: sampleCategories,
    loading: false,
    disabled: false,
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
    size: 'small',
  },
};

export const Detailed: Story = {
  args: {
    ...Default.args,
    variant: 'detailed',
    size: 'large',
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    categories: [],
  },
};

export const WithFilters: Story = {
  args: {
    ...Default.args,
    categories: sampleCategories,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstra o gerenciador com filtros ativos e funcionalidades de busca.',
      },
    },
  },
};

export const DragAndDrop: Story = {
  args: {
    ...Default.args,
    categories: sampleCategories,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstra a funcionalidade de drag-and-drop para reordenação de categorias.',
      },
    },
  },
};

export const ColorPicker: Story = {
  args: {
    ...Default.args,
    categories: sampleCategories,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstra o seletor de cores integrado para personalização visual das categorias.',
      },
    },
  },
};

export const IconPicker: Story = {
  args: {
    ...Default.args,
    categories: sampleCategories,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstra o seletor de ícones para personalização visual das categorias.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    categories: sampleCategories,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Versão otimizada para dispositivos móveis com touch targets adequados.',
      },
    },
  },
};
