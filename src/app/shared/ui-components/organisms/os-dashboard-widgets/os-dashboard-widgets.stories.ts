import type { Meta, StoryObj } from '@storybook/angular';
import {
  OsDashboardWidgetsComponent,
  DashboardWidget,
  GoalProgressData,
} from './os-dashboard-widgets.component';

const meta: Meta<OsDashboardWidgetsComponent> = {
  title: 'Design System/Organisms/Dashboard Widgets',
  component: OsDashboardWidgetsComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Widgets do dashboard do Design System OrçaSonhos com funcionalidades avançadas, acessibilidade WCAG 2.1 AA e responsividade mobile-first.',
      },
    },
  },
  argTypes: {
    widgets: {
      control: { type: 'object' },
      description: 'Lista de widgets do dashboard',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'extended'],
      description: 'Variante visual dos widgets',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Tamanho dos widgets',
    },
    state: {
      control: { type: 'select' },
      options: ['loading', 'error', 'empty', 'success'],
      description: 'Estado do dashboard',
    },
    showWidgetActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações dos widgets',
    },
    showCreateActions: {
      control: { type: 'boolean' },
      description: 'Mostrar ações de criação',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Mensagem de erro',
    },
    emptyMessage: {
      control: { type: 'text' },
      description: 'Mensagem quando vazio',
    },
    widgetClick: {
      action: 'widgetClick',
      description: 'Evento de clique no widget',
    },
    widgetConfigure: {
      action: 'widgetConfigure',
      description: 'Evento de configuração do widget',
    },
    widgetClose: {
      action: 'widgetClose',
      description: 'Evento de fechamento do widget',
    },
    retryRequested: {
      action: 'retryRequested',
      description: 'Evento de retry',
    },
    createBudgetRequested: {
      action: 'createBudgetRequested',
      description: 'Evento de criação de orçamento',
    },
    createGoalRequested: {
      action: 'createGoalRequested',
      description: 'Evento de criação de meta',
    },
    addTransactionRequested: {
      action: 'addTransactionRequested',
      description: 'Evento de adição de transação',
    },
    viewReportsRequested: {
      action: 'viewReportsRequested',
      description: 'Evento de visualização de relatórios',
    },
    goalCardClick: {
      action: 'goalCardClick',
      description: 'Evento de clique no card de meta',
    },
    goalCardExpand: {
      action: 'goalCardExpand',
      description: 'Evento de expansão do card de meta',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<OsDashboardWidgetsComponent>;

const sampleGoalData: GoalProgressData = {
  id: 'goal-1',
  title: 'Casa Própria',
  description: 'Economizar para entrada da casa dos sonhos',
  currentValue: 45000,
  targetValue: 100000,
  unit: 'R$',
  deadline: new Date('2025-12-31'),
  priority: 'high',
  category: 'Moradia',
};

const sampleWidgets: DashboardWidget[] = [
  {
    id: 'widget-1',
    type: 'goal-progress',
    title: 'Progresso das Metas',
    size: 'large',
    position: { row: 1, column: 1 },
    enabled: true,
    data: sampleGoalData,
  },
  {
    id: 'widget-2',
    type: 'budget-summary',
    title: 'Resumo do Orçamento',
    size: 'medium',
    position: { row: 1, column: 2 },
    enabled: true,
  },
  {
    id: 'widget-3',
    type: 'transaction-list',
    title: 'Transações Recentes',
    size: 'medium',
    position: { row: 2, column: 1 },
    enabled: true,
  },
  {
    id: 'widget-4',
    type: 'account-balance',
    title: 'Saldo das Contas',
    size: 'medium',
    position: { row: 2, column: 2 },
    enabled: true,
  },
  {
    id: 'widget-5',
    type: 'quick-actions',
    title: 'Ações Rápidas',
    size: 'small',
    position: { row: 1, column: 3 },
    enabled: true,
  },
];

const emptyWidgets: DashboardWidget[] = [];

export const Default: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const Compact: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'compact',
    size: 'small',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const Extended: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'extended',
    size: 'large',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const Loading: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'default',
    size: 'medium',
    state: 'loading',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const Error: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'default',
    size: 'medium',
    state: 'error',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Falha na conexão com o servidor',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const Empty: Story = {
  args: {
    widgets: emptyWidgets,
    variant: 'default',
    size: 'medium',
    state: 'empty',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Configure seu primeiro orçamento para começar',
  },
};

export const WithoutWidgetActions: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: false,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const WithoutCreateActions: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: false,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const SingleWidget: Story = {
  args: {
    widgets: [sampleWidgets[0]], 
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const GoalProgressOnly: Story = {
  args: {
    widgets: [
      {
        id: 'widget-goal',
        type: 'goal-progress',
        title: 'Minhas Metas',
        size: 'full-width',
        position: { row: 1, column: 1 },
        enabled: true,
        data: sampleGoalData,
      },
    ],
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const BudgetSummaryOnly: Story = {
  args: {
    widgets: [
      {
        id: 'widget-budget',
        type: 'budget-summary',
        title: 'Resumo Financeiro',
        size: 'full-width',
        position: { row: 1, column: 1 },
        enabled: true,
      },
    ],
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const QuickActionsOnly: Story = {
  args: {
    widgets: [
      {
        id: 'widget-actions',
        type: 'quick-actions',
        title: 'Ações Rápidas',
        size: 'full-width',
        position: { row: 1, column: 1 },
        enabled: true,
      },
    ],
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
};

export const AccessibilityDemo: Story = {
  args: {
    widgets: sampleWidgets,
    variant: 'default',
    size: 'medium',
    state: 'success',
    showWidgetActions: true,
    showCreateActions: true,
    errorMessage: 'Erro ao carregar dados do dashboard',
    emptyMessage: 'Nenhum dado disponível para exibir',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstração das funcionalidades de acessibilidade dos widgets do dashboard.',
      },
    },
  },
};
