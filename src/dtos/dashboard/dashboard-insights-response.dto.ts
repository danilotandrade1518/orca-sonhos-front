import {
  BudgetUsageIndicator,
  CashFlowIndicator,
  EmergencyReserveIndicator,
  GoalsOnTrackIndicator,
  SuggestedAction,
} from '../../app/features/dashboard/types/dashboard.types';
import { CategorySpendingDto } from '../report/category-spending.dto';

export interface RecentAchievementDto {
  id: string;
  type: 'goal-completed' | 'reserve-milestone' | 'budget-maintained';
  message: string;
  date: string;
  icon: string;
}

export interface DashboardInsightsResponseDto {
  data: {
    indicators: {
      budgetUsage: BudgetUsageIndicator | null;
      cashFlow: CashFlowIndicator | null;
      goalsOnTrack: GoalsOnTrackIndicator | null;
      emergencyReserve: EmergencyReserveIndicator | null;
    };
    suggestedActions: SuggestedAction[];
    recentAchievements: RecentAchievementDto[];
    categorySpending: CategorySpendingDto[];
  };
}
