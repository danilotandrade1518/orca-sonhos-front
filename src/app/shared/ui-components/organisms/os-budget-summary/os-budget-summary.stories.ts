import type { Meta, StoryObj } from '@storybook/angular';
import { OsBudgetSummaryComponent } from './os-budget-summary.component';

const meta: Meta<OsBudgetSummaryComponent> = {
  title: 'Design System/Organisms/Budget Summary',
  component: OsBudgetSummaryComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Resumo de orçamento do Design System Orca Sonhos com progresso, status e informações financeiras.',
      },
    },
  },
  argTypes: {
    budgetData: {
      control: { type: 'object' },
      description: 'Dados do orçamento',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'detailed'],
      description: 'Variante do resumo',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do resumo',
    },
    showProgress: {
      control: { type: 'boolean' },
      description: 'Mostrar barra de progresso',
    },
    showStatus: {
      control: { type: 'boolean' },
      description: 'Mostrar status do orçamento',
    },
    showDates: {
      control: { type: 'boolean' },
      description: 'Mostrar datas (apenas na variante detailed)',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Card clicável',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsBudgetSummaryComponent>;

const sampleBudgetData = {
  id: '1',
  name: 'Orçamento Mensal',
  totalBudget: 5000,
  spentAmount: 3200,
  remainingAmount: 1800,
  percentage: 64,
  status: 'on-track' as const,
  category: 'Geral',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  lastUpdated: new Date('2024-01-20'),
};

const overBudgetData = {
  id: '2',
  name: 'Orçamento Alimentação',
  totalBudget: 800,
  spentAmount: 950,
  remainingAmount: -150,
  percentage: 119,
  status: 'over-budget' as const,
  category: 'Alimentação',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  lastUpdated: new Date('2024-01-20'),
};

const underBudgetData = {
  id: '3',
  name: 'Orçamento Transporte',
  totalBudget: 500,
  spentAmount: 200,
  remainingAmount: 300,
  percentage: 40,
  status: 'under-budget' as const,
  category: 'Transporte',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  lastUpdated: new Date('2024-01-20'),
};

const completedBudgetData = {
  id: '4',
  name: 'Orçamento Lazer',
  totalBudget: 300,
  spentAmount: 300,
  remainingAmount: 0,
  percentage: 100,
  status: 'completed' as const,
  category: 'Lazer',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  lastUpdated: new Date('2024-01-20'),
};

export const Default: Story = {
  args: {
    budgetData: sampleBudgetData,
    variant: 'default',
    size: 'medium',
    showProgress: true,
    showStatus: true,
    showDates: false,
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-budget-summary 
        [budgetData]="budgetData"
        [variant]="variant"
        [size]="size"
        [showProgress]="showProgress"
        [showStatus]="showStatus"
        [showDates]="showDates"
        [clickable]="clickable"
      ></os-budget-summary>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Default</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Compact</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="compact"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Detailed</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="detailed"
            [showDates]="true"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes disponíveis do resumo de orçamento.',
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
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            size="small"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Medium</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            size="medium"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Large</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            size="large"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos disponíveis do resumo de orçamento.',
      },
    },
  },
};

export const BudgetStatuses: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>No Prazo</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Acima do Orçamento</h4>
          <os-budget-summary 
            [budgetData]="overBudgetData"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Abaixo do Orçamento</h4>
          <os-budget-summary 
            [budgetData]="underBudgetData"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Concluído</h4>
          <os-budget-summary 
            [budgetData]="completedBudgetData"
            variant="default"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
      overBudgetData,
      underBudgetData,
      completedBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes status de orçamento.',
      },
    },
  },
};

export const WithProgress: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Barra de Progresso</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            [showProgress]="true"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Sem Barra de Progresso</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            [showProgress]="false"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Resumo de orçamento com e sem barra de progresso.',
      },
    },
  },
};

export const WithStatus: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Status</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            [showStatus]="true"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Sem Status</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            [showStatus]="false"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Resumo de orçamento com e sem status.',
      },
    },
  },
};

export const WithDates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Com Datas (Detailed)</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="detailed"
            [showDates]="true"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Sem Datas (Detailed)</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="detailed"
            [showDates]="false"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Com Datas (Default - não exibe)</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            variant="default"
            [showDates]="true"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Resumo de orçamento com e sem datas (apenas na variante detailed).',
      },
    },
  },
};

export const Clickable: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4>Card Clicável</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            [clickable]="true"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Card Não Clicável</h4>
          <os-budget-summary 
            [budgetData]="sampleBudgetData"
            [clickable]="false"
          ></os-budget-summary>
        </div>
      </div>
    `,
    props: {
      sampleBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Resumo de orçamento clicável e não clicável.',
      },
    },
  },
};

export const DifferentCategories: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div>
          <h4>Alimentação</h4>
          <os-budget-summary 
            [budgetData]="{
              id: '1',
              name: 'Orçamento Alimentação',
              totalBudget: 800,
              spentAmount: 600,
              remainingAmount: 200,
              percentage: 75,
              status: 'on-track',
              category: 'Alimentação',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-31'),
              lastUpdated: new Date('2024-01-20')
            }"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Transporte</h4>
          <os-budget-summary 
            [budgetData]="{
              id: '2',
              name: 'Orçamento Transporte',
              totalBudget: 500,
              spentAmount: 450,
              remainingAmount: 50,
              percentage: 90,
              status: 'on-track',
              category: 'Transporte',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-31'),
              lastUpdated: new Date('2024-01-20')
            }"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Lazer</h4>
          <os-budget-summary 
            [budgetData]="{
              id: '3',
              name: 'Orçamento Lazer',
              totalBudget: 300,
              spentAmount: 150,
              remainingAmount: 150,
              percentage: 50,
              status: 'under-budget',
              category: 'Lazer',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-31'),
              lastUpdated: new Date('2024-01-20')
            }"
            variant="default"
          ></os-budget-summary>
        </div>
        
        <div>
          <h4>Saúde</h4>
          <os-budget-summary 
            [budgetData]="{
              id: '4',
              name: 'Orçamento Saúde',
              totalBudget: 200,
              spentAmount: 200,
              remainingAmount: 0,
              percentage: 100,
              status: 'completed',
              category: 'Saúde',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-31'),
              lastUpdated: new Date('2024-01-20')
            }"
            variant="default"
          ></os-budget-summary>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Resumos de orçamento para diferentes categorias.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    budgetData: sampleBudgetData,
    variant: 'default',
    size: 'medium',
    showProgress: true,
    showStatus: true,
    showDates: false,
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <os-budget-summary 
        [budgetData]="budgetData"
        [variant]="variant"
        [size]="size"
        [showProgress]="showProgress"
        [showStatus]="showStatus"
        [showDates]="showDates"
        [clickable]="clickable"
      ></os-budget-summary>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Resumo de orçamento interativo com controles para testar todas as propriedades.',
      },
    },
  },
};

