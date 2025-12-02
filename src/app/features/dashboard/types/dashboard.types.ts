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
  | 'quick-actions'
  | 'financial-health'
  | 'suggested-actions'
  | 'category-spending'
  | 'recent-achievements';

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

export type HealthIndicatorStatus = 'healthy' | 'warning' | 'critical';

export interface HealthIndicator {
  value: number;
  status: HealthIndicatorStatus;
  label: string;
  description: string;
}

export interface BudgetUsageIndicator extends HealthIndicator {
  percentage: number;
}

export interface CashFlowIndicator extends HealthIndicator {
  ratio: number;
  absoluteValue: number;
}

export interface GoalsOnTrackIndicator extends HealthIndicator {
  percentage: number;
  onTrackCount: number;
  totalActiveCount: number;
}

export interface EmergencyReserveIndicator extends HealthIndicator {
  monthsCovered: number;
}

export interface SuggestedAction {
  id: string;
  type: 'goal-contribution' | 'emergency-reserve' | 'budget-adjustment' | 'cash-flow';
  title: string;
  description: string;
  icon: string;
  route: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecentAchievement {
  id: string;
  type: 'goal-completed' | 'reserve-milestone' | 'budget-maintained';
  message: string;
  date: Date;
  icon: string;
}
