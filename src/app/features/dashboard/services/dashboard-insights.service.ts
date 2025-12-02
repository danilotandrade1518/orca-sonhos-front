import { computed, Injectable, signal } from '@angular/core';

import {
  BudgetUsageIndicator,
  CashFlowIndicator,
  EmergencyReserveIndicator,
  GoalsOnTrackIndicator,
  RecentAchievement,
  SuggestedAction,
} from '../types/dashboard.types';
import { CategorySpendingDto } from '../../../../dtos/report/category-spending.dto';
import { DashboardInsightsResponseDto } from '../../../../dtos/dashboard/dashboard-insights-response.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardInsightsService {
  private readonly _indicators = signal<{
    budgetUsage: BudgetUsageIndicator | null;
    cashFlow: CashFlowIndicator | null;
    goalsOnTrack: GoalsOnTrackIndicator | null;
    emergencyReserve: EmergencyReserveIndicator | null;
  }>({
    budgetUsage: null,
    cashFlow: null,
    goalsOnTrack: null,
    emergencyReserve: null,
  });

  private readonly _suggestedActions = signal<SuggestedAction[]>([]);
  private readonly _recentAchievements = signal<RecentAchievement[]>([]);
  private readonly _categorySpending = signal<CategorySpendingDto[]>([]);

  readonly budgetUsageIndicator = computed(() => this._indicators().budgetUsage);
  readonly cashFlowIndicator = computed(() => this._indicators().cashFlow);
  readonly goalsOnTrackIndicator = computed(() => this._indicators().goalsOnTrack);
  readonly emergencyReserveIndicator = computed(() => this._indicators().emergencyReserve);
  readonly suggestedActions = computed(() => this._suggestedActions());
  readonly recentAchievements = computed(() => this._recentAchievements());
  readonly categorySpending = computed(() => this._categorySpending());

  setInsights(insights: DashboardInsightsResponseDto['data']): void {
    this._indicators.set(insights.indicators);
    this._suggestedActions.set(insights.suggestedActions);

    const achievements: RecentAchievement[] = insights.recentAchievements.map((achievement) => ({
      ...achievement,
      date: new Date(achievement.date),
    }));
    this._recentAchievements.set(achievements);

    this._categorySpending.set(insights.categorySpending);
  }
}
