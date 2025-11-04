import type { Meta, StoryObj } from '@storybook/angular';
import { OsBudgetSelectorComponent, BudgetOption } from './os-budget-selector.component';

const meta: Meta<OsBudgetSelectorComponent> = {
  title: 'Design System/Molecules/Budget Selector',
  component: OsBudgetSelectorComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Seletor de orçamento do Design System OrçaSonhos com indicadores visuais, ações rápidas e acessibilidade WCAG 2.1 AA.',
      },
    },
  },
  argTypes: {
    budgets: {
      control: { type: 'object' },
      description: 'Lista de orçamentos disponíveis',
    },
    selectedBudgetId: {
      control: { type: 'text' },
      description: 'ID do orçamento selecionado',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'accent'],
      description: 'Variante visual do seletor',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do seletor',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto placeholder',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Label de acessibilidade',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'loading', 'error'],
      description: 'Estado do seletor',
    },
    budgetSelected: {
      action: 'budgetSelected',
      description: 'Evento de seleção de orçamento',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsBudgetSelectorComponent>;

const sampleBudgets: BudgetOption[] = [
  {
    id: 'budget-1',
    name: 'Orçamento Familiar',
    description: 'Controle financeiro da família',
    isActive: true,
    isShared: true,
    participants: 3,
    lastModified: new Date('2024-12-19'),
    balance: 15000.5,
  },
  {
    id: 'budget-2',
    name: 'Pessoal',
    description: 'Orçamento pessoal',
    isActive: false,
    isShared: false,
    lastModified: new Date('2024-12-18'),
    balance: 5000.0,
  },
  {
    id: 'budget-3',
    name: 'Férias 2025',
    description: 'Economia para viagem de férias',
    isActive: false,
    isShared: true,
    participants: 2,
    lastModified: new Date('2024-12-15'),
    balance: 2500.75,
  },
];

const emptyBudgets: BudgetOption[] = [];

export const Default: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento melhorado',
    state: 'default',
  },
};

export const Primary: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'primary',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento primário',
    state: 'default',
  },
};

export const Secondary: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-2',
    variant: 'secondary',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento secundário',
    state: 'default',
  },
};

export const Accent: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-3',
    variant: 'accent',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento com destaque',
    state: 'default',
  },
};

export const Small: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'small',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento pequeno',
    state: 'default',
  },
};

export const Large: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'large',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento grande',
    state: 'default',
  },
};

export const Loading: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: null,
    variant: 'default',
    size: 'medium',
    placeholder: 'Carregando orçamentos...',
    ariaLabel: 'Carregando orçamentos',
    state: 'loading',
  },
};

export const Error: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: null,
    variant: 'default',
    size: 'medium',
    placeholder: 'Erro ao carregar orçamentos',
    ariaLabel: 'Erro no seletor de orçamento',
    state: 'error',
  },
};

export const Empty: Story = {
  args: {
    budgets: emptyBudgets,
    selectedBudgetId: null,
    variant: 'default',
    size: 'medium',
    placeholder: 'Nenhum orçamento disponível',
    ariaLabel: 'Nenhum orçamento disponível',
    state: 'default',
  },
};

export const WithoutQuickActions: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento sem ações rápidas',
    state: 'default',
  },
};

export const WithoutShareButton: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-2',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento sem compartilhamento',
    state: 'default',
  },
};

export const WithoutCreateButton: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Seletor de orçamento sem criação',
    state: 'default',
  },
};

export const PersonalBudget: Story = {
  args: {
    budgets: [sampleBudgets[1]], 
    selectedBudgetId: 'budget-2',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Orçamento pessoal',
    state: 'default',
  },
};

export const SharedBudget: Story = {
  args: {
    budgets: [sampleBudgets[0]], 
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Orçamento compartilhado',
    state: 'default',
  },
};

export const AccessibilityDemo: Story = {
  args: {
    budgets: sampleBudgets,
    selectedBudgetId: 'budget-1',
    variant: 'default',
    size: 'medium',
    placeholder: 'Selecionar orçamento',
    ariaLabel: 'Demonstração de acessibilidade - Seletor de orçamento',
    state: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das funcionalidades de acessibilidade do seletor de orçamento.',
      },
    },
  },
};
