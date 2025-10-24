import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { OsBudgetTrackerComponent, BudgetTrackerData } from './os-budget-tracker.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../../molecules/os-money-display/os-money-display.component';
import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';

const meta: Meta<OsBudgetTrackerComponent> = {
  title: 'Design System/Organisms/Budget Tracker',
  component: OsBudgetTrackerComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente para rastreamento de orçamentos com métricas, tendências e projeções financeiras.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        OsCardComponent,
        OsMoneyDisplayComponent,
        OsBadgeComponent,
        OsIconComponent,
        OsProgressBarComponent,
        OsSpinnerComponent,
      ],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Variante visual do componente',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamanho do componente',
    },
    showCharts: {
      control: 'boolean',
      description: 'Exibir gráficos de gastos mensais',
    },
    showTrends: {
      control: 'boolean',
      description: 'Exibir informações de tendências',
    },
    showProjections: {
      control: 'boolean',
      description: 'Exibir projeções financeiras',
    },
    showStatus: {
      control: 'boolean',
      description: 'Exibir status do orçamento',
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento',
    },
    clickable: {
      control: 'boolean',
      description: 'Componente clicável',
    },
    showAlerts: {
      control: 'boolean',
      description: 'Exibir alertas visuais',
    },
    enableDrillDown: {
      control: 'boolean',
      description: 'Habilitar drill-down em categorias',
    },
    alertThreshold: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Limite para alertas (porcentagem)',
    },
  },
};

export default meta;
type Story = StoryObj<OsBudgetTrackerComponent>;

// Mock data
const mockBudgetData: BudgetTrackerData = {
  id: 'budget-001',
  name: 'Orçamento Familiar',
  totalBudget: 5000,
  spentAmount: 3200,
  remainingAmount: 1800,
  percentage: 64,
  status: 'on-track',
  category: 'Família',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  lastUpdated: new Date('2024-10-15'),
  monthlySpending: [
    { month: '01', year: 2024, amount: 2800, percentage: 56 },
    { month: '02', year: 2024, amount: 3100, percentage: 62 },
    { month: '03', year: 2024, amount: 2900, percentage: 58 },
    { month: '04', year: 2024, amount: 3200, percentage: 64 },
    { month: '05', year: 2024, amount: 3000, percentage: 60 },
    { month: '06', year: 2024, amount: 3300, percentage: 66 },
  ],
  trends: {
    spendingTrend: 'increasing',
    projection: 4200,
    riskLevel: 'medium',
  },
  categoryColor: '#3B82F6',
  categoryIcon: 'home',
  alertThreshold: 80,
  isUrgent: false,
};

const overBudgetData: BudgetTrackerData = {
  ...mockBudgetData,
  name: 'Orçamento Excedido',
  spentAmount: 5500,
  remainingAmount: -500,
  percentage: 110,
  status: 'over-budget',
  categoryColor: '#EF4444',
  categoryIcon: 'warning',
  isUrgent: true,
  trends: {
    spendingTrend: 'increasing',
    projection: 6000,
    riskLevel: 'high',
  },
};

const completedBudgetData: BudgetTrackerData = {
  ...mockBudgetData,
  name: 'Orçamento Concluído',
  spentAmount: 5000,
  remainingAmount: 0,
  percentage: 100,
  status: 'completed',
  categoryColor: '#10B981',
  categoryIcon: 'check_circle',
  isUrgent: false,
  trends: {
    spendingTrend: 'stable',
    projection: 5000,
    riskLevel: 'low',
  },
};

export const Default: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const Compact: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'compact',
    size: 'small',
    showCharts: false,
    showTrends: true,
    showProjections: false,
    showStatus: true,
    loading: false,
    clickable: true,
  },
};

export const Detailed: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'detailed',
    size: 'large',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: true,
  },
};

export const OverBudget: Story = {
  args: {
    budgetData: overBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const Completed: Story = {
  args: {
    budgetData: completedBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const Loading: Story = {
  args: {
    budgetData: null,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: true,
    clickable: false,
  },
};

export const SmallSize: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'small',
    showCharts: false,
    showTrends: true,
    showProjections: false,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const LargeSize: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'detailed',
    size: 'large',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: true,
  },
};

export const WithoutCharts: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: false,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const WithoutTrends: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: false,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const WithoutProjections: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: false,
    showStatus: true,
    loading: false,
    clickable: false,
  },
};

export const Clickable: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente clicável com cursor pointer e eventos de clique',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3>Default Variant</h3>
          <os-budget-tracker
            [budgetData]="budgetData"
            variant="default"
            size="medium">
          </os-budget-tracker>
        </div>

        <div>
          <h3>Compact Variant</h3>
          <os-budget-tracker
            [budgetData]="budgetData"
            variant="compact"
            size="small">
          </os-budget-tracker>
        </div>

        <div>
          <h3>Detailed Variant</h3>
          <os-budget-tracker
            [budgetData]="budgetData"
            variant="detailed"
            size="large">
          </os-budget-tracker>
        </div>
      </div>
    `,
    props: {
      budgetData: mockBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparação de todas as variantes do componente',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3>Small Size</h3>
          <os-budget-tracker
            [budgetData]="budgetData"
            variant="default"
            size="small">
          </os-budget-tracker>
        </div>

        <div>
          <h3>Medium Size</h3>
          <os-budget-tracker
            [budgetData]="budgetData"
            variant="default"
            size="medium">
          </os-budget-tracker>
        </div>

        <div>
          <h3>Large Size</h3>
          <os-budget-tracker
            [budgetData]="budgetData"
            variant="default"
            size="large">
          </os-budget-tracker>
        </div>
      </div>
    `,
    props: {
      budgetData: mockBudgetData,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparação de todos os tamanhos do componente',
      },
    },
  },
};

export const InteractiveExample: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'detailed',
    size: 'large',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: true,
    showAlerts: true,
    enableDrillDown: true,
    alertThreshold: 80,
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo interativo com todas as funcionalidades habilitadas',
      },
    },
  },
};

export const WithAlerts: Story = {
  args: {
    budgetData: overBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
    showAlerts: true,
    enableDrillDown: true,
    alertThreshold: 80,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Componente com alertas visuais aprimorados para orçamento excedido, incluindo animações pulse e cores semânticas',
      },
    },
  },
};

export const WithDrillDown: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'detailed',
    size: 'large',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: true,
    showAlerts: true,
    enableDrillDown: true,
    alertThreshold: 80,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Componente com drill-down funcional para navegação profunda em categorias, incluindo estados visuais por categoria',
      },
    },
  },
};

export const WithoutAlerts: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
    showAlerts: false,
    enableDrillDown: false,
    alertThreshold: 80,
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente sem alertas visuais',
      },
    },
  },
};

export const HighAlertThreshold: Story = {
  args: {
    budgetData: mockBudgetData,
    variant: 'default',
    size: 'medium',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: false,
    showAlerts: true,
    enableDrillDown: true,
    alertThreshold: 90,
  },
  parameters: {
    docs: {
      description: {
        story: 'Componente com limite de alerta alto (90%)',
      },
    },
  },
};

export const RefinedFeatures: Story = {
  args: {
    budgetData: {
      ...mockBudgetData,
      spentAmount: 4500,
      remainingAmount: 500,
      percentage: 90,
      status: 'over-budget',
      categoryColor: '#F59E0B',
      categoryIcon: 'warning',
      isUrgent: true,
    },
    variant: 'detailed',
    size: 'large',
    showCharts: true,
    showTrends: true,
    showProjections: true,
    showStatus: true,
    loading: false,
    clickable: true,
    showAlerts: true,
    enableDrillDown: true,
    alertThreshold: 80,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstração das funcionalidades refinadas: progresso por categoria, alertas visuais aprimorados, drill-down funcional e responsividade mobile',
      },
    },
  },
};
