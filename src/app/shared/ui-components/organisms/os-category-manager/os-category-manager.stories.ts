import type { Meta, StoryObj } from '@storybook/angular';
import { OsCategoryManagerComponent, Category } from './os-category-manager.component';

const meta: Meta<OsCategoryManagerComponent> = {
  title: 'Design System/Organisms/Category Manager',
  component: OsCategoryManagerComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Gerenciador de categorias do Design System Orca Sonhos com CRUD completo e filtros.',
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

const sampleCategories = [
  {
    id: '1',
    name: 'Alimentação',
    description: 'Gastos com comida e bebida',
    type: 'expense' as const,
    color: '#EF4444',
    icon: 'utensils',
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Transporte',
    description: 'Gastos com transporte público e privado',
    type: 'expense' as const,
    color: '#3B82F6',
    icon: 'car',
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Salário',
    description: 'Rendimento mensal',
    type: 'income' as const,
    color: '#10B981',
    icon: 'money-bill-wave',
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Transferência',
    description: 'Transferências entre contas',
    type: 'transfer' as const,
    color: '#F59E0B',
    icon: 'exchange-alt',
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    name: 'Lazer',
    description: 'Entretenimento e diversão',
    type: 'expense' as const,
    color: '#8B5CF6',
    icon: 'gamepad',
    active: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12'),
  },
];

const emptyCategories: Category[] = [];

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
  render: (args) => ({
    props: args,
    template: `
      <os-category-manager
        [title]="title"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [categories]="categories"
        [loading]="loading"
        [disabled]="disabled"
        (categoryAdded)="categoryAdded($event)"
        (categoryUpdated)="categoryUpdated($event)"
        (categoryDeleted)="categoryDeleted($event)"
        (categorySelected)="categorySelected($event)"
      ></os-category-manager>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-category-manager
            [categories]="sampleCategories"
            variant="default"
          ></os-category-manager>
        </div>

        <div>
          <h4>Compact</h4>
          <os-category-manager
            [categories]="sampleCategories"
            variant="compact"
          ></os-category-manager>
        </div>

        <div>
          <h4>Detailed</h4>
          <os-category-manager
            [categories]="sampleCategories"
            variant="detailed"
          ></os-category-manager>
        </div>
      </div>
    `,
    props: {
      sampleCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do gerenciador de categorias.',
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
          <os-category-manager
            [categories]="sampleCategories"
            size="small"
          ></os-category-manager>
        </div>

        <div>
          <h4>Medium</h4>
          <os-category-manager
            [categories]="sampleCategories"
            size="medium"
          ></os-category-manager>
        </div>

        <div>
          <h4>Large</h4>
          <os-category-manager
            [categories]="sampleCategories"
            size="large"
          ></os-category-manager>
        </div>
      </div>
    `,
    props: {
      sampleCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do gerenciador de categorias.',
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
          <os-category-manager
            [categories]="sampleCategories"
            theme="light"
          ></os-category-manager>
        </div>

        <div>
          <h4>Dark Theme</h4>
          <os-category-manager
            [categories]="sampleCategories"
            theme="dark"
          ></os-category-manager>
        </div>
      </div>
    `,
    props: {
      sampleCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Temas claro e escuro do gerenciador de categorias.',
      },
    },
  },
};

export const CategoryTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Receitas</h4>
          <os-category-manager
            [categories]="incomeCategories"
            title="Categorias de Receita"
          ></os-category-manager>
        </div>

        <div>
          <h4>Despesas</h4>
          <os-category-manager
            [categories]="expenseCategories"
            title="Categorias de Despesa"
          ></os-category-manager>
        </div>

        <div>
          <h4>Transferências</h4>
          <os-category-manager
            [categories]="transferCategories"
            title="Categorias de Transferência"
          ></os-category-manager>
        </div>
      </div>
    `,
    props: {
      incomeCategories: sampleCategories.filter((c) => c.type === 'income'),
      expenseCategories: sampleCategories.filter((c) => c.type === 'expense'),
      transferCategories: sampleCategories.filter((c) => c.type === 'transfer'),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tipos de categorias (receita, despesa, transferência).',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => ({
    template: `
      <os-category-manager
        [categories]="emptyCategories"
        title="Categorias Vazias"
      ></os-category-manager>
    `,
    props: {
      emptyCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio quando não há categorias.',
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
          <os-category-manager
            [categories]="sampleCategories"
            [loading]="true"
          ></os-category-manager>
        </div>

        <div>
          <h4>Carregado</h4>
          <os-category-manager
            [categories]="sampleCategories"
            [loading]="false"
          ></os-category-manager>
        </div>
      </div>
    `,
    props: {
      sampleCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados de carregamento do gerenciador de categorias.',
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
          <os-category-manager
            [categories]="sampleCategories"
            [disabled]="false"
          ></os-category-manager>
        </div>

        <div>
          <h4>Desabilitado</h4>
          <os-category-manager
            [categories]="sampleCategories"
            [disabled]="true"
          ></os-category-manager>
        </div>
      </div>
    `,
    props: {
      sampleCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Estados habilitado e desabilitado do gerenciador de categorias.',
      },
    },
  },
};

export const WithFilters: Story = {
  render: () => ({
    template: `
      <os-category-manager
        [categories]="sampleCategories"
        title="Com Filtros Ativos"
      ></os-category-manager>
    `,
    props: {
      sampleCategories,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Gerenciador de categorias com filtros de busca, tipo e status.',
      },
    },
  },
};

export const MixedStatus: Story = {
  render: () => ({
    template: `
      <os-category-manager
        [categories]="mixedStatusCategories"
        title="Categorias com Status Misto"
      ></os-category-manager>
    `,
    props: {
      mixedStatusCategories: [
        ...sampleCategories,
        {
          id: '6',
          name: 'Categoria Inativa',
          description: 'Esta categoria está inativa',
          type: 'expense' as const,
          color: '#6B7280',
          icon: 'ban',
          active: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-20'),
        },
      ],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Categorias com status ativo e inativo misturados.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    title: 'Gerenciador de Categorias',
    variant: 'default',
    size: 'medium',
    theme: 'light',
    categories: sampleCategories,
    loading: false,
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-category-manager
        [title]="title"
        [variant]="variant"
        [size]="size"
        [theme]="theme"
        [categories]="categories"
        [loading]="loading"
        [disabled]="disabled"
        (categoryAdded)="categoryAdded($event)"
        (categoryUpdated)="categoryUpdated($event)"
        (categoryDeleted)="categoryDeleted($event)"
        (categorySelected)="categorySelected($event)"
      ></os-category-manager>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Gerenciador de categorias interativo com controles para testar todas as propriedades.',
      },
    },
  },
};
