import { BudgetDto, BudgetOverviewDto } from '../../../../dtos';

export interface BudgetSelection {
  selectedBudgetId: string | null;
  availableBudgets: BudgetDto[];
  isLoading: boolean;
  error: string | null;
}

export interface DashboardData {
  budgetOverview: BudgetOverviewDto | null;
  isLoading: boolean;
  error: string | null;
}

export interface WidgetConfiguration {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: WidgetPosition;
  enabled: boolean;
}

export type WidgetType =
  | 'budget-summary'
  | 'goal-progress'
  | 'transaction-list'
  | 'account-balance'
  | 'monthly-trends'
  | 'quick-actions';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full-width';

export interface WidgetPosition {
  row: number;
  column: number;
  rowSpan?: number;
  columnSpan?: number;
}

export interface DashboardState {
  budgetSelection: BudgetSelection;
  dashboardData: DashboardData;
  widgetConfigurations: WidgetConfiguration[];
  isInitialized: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  variant: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export interface DashboardMetrics {
  totalAccounts: number;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netMonthly: number;
  goalsProgress: number;
  recentTransactionsCount: number;
}
