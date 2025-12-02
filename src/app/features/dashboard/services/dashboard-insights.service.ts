import { computed, inject, Injectable } from '@angular/core';

import { GoalDto } from '../../../../dtos/goal/goal-types/goal-types';
import { GoalsState } from '../../../goals/state/goals-state/goals.state';
import { DashboardDataService } from './dashboard-data.service';
import {
  BudgetUsageIndicator,
  CashFlowIndicator,
  EmergencyReserveIndicator,
  GoalsOnTrackIndicator,
  HealthIndicatorStatus,
  RecentAchievement,
  SuggestedAction,
} from '../types/dashboard.types';

@Injectable({
  providedIn: 'root',
})
export class DashboardInsightsService {
  private readonly dashboardDataService = inject(DashboardDataService);
  private readonly goalsState = inject(GoalsState);

  readonly budgetUsageIndicator = computed<BudgetUsageIndicator | null>(() => {
    const overview = this.dashboardDataService.budgetOverview();
    if (!overview) {
      return null;
    }

    const monthExpense = overview.totals.monthExpense;
    const monthIncome = overview.totals.monthIncome;

    if (monthIncome <= 0) {
      return {
        value: 0,
        percentage: 0,
        status: 'warning',
        label: 'Sem receitas',
        description: 'Não há receitas registradas no período atual',
      };
    }

    const percentage = (monthExpense / monthIncome) * 100;
    let status: HealthIndicatorStatus = 'healthy';

    if (percentage > 100) {
      status = 'critical';
    } else if (percentage > 80) {
      status = 'warning';
    }

    return {
      value: percentage,
      percentage,
      status,
      label: 'Uso de Orçamento',
      description: `${percentage.toFixed(1)}% das receitas foram utilizadas`,
    };
  });

  readonly cashFlowIndicator = computed<CashFlowIndicator | null>(() => {
    const overview = this.dashboardDataService.budgetOverview();
    if (!overview) {
      return null;
    }

    const totalReceitas = overview.totals.monthIncome;
    const totalDespesas = overview.totals.monthExpense;

    if (totalDespesas <= 0) {
      return {
        value: 100,
        ratio: 100,
        absoluteValue: totalReceitas,
        status: 'healthy',
        label: 'Fluxo de Caixa',
        description: 'Apenas receitas no período',
      };
    }

    const ratio = (totalReceitas / totalDespesas) * 100;
    const absoluteValue = totalReceitas - totalDespesas;

    let status: HealthIndicatorStatus = 'healthy';

    if (ratio < 100) {
      status = 'critical';
    } else if (ratio < 110) {
      status = 'warning';
    }

    return {
      value: ratio,
      ratio,
      absoluteValue,
      status,
      label: 'Fluxo de Caixa',
      description:
        ratio >= 100
          ? `Superávit de ${Math.abs(absoluteValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
          : `Déficit de ${Math.abs(absoluteValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    };
  });

  readonly goalsOnTrackIndicator = computed<GoalsOnTrackIndicator | null>(() => {
    const goals = this.goalsState.items();
    const activeGoals = goals.filter((goal) => goal.totalAmount > 0);

    if (activeGoals.length === 0) {
      return {
        value: 0,
        percentage: 0,
        status: 'warning',
        label: 'Metas On-Track',
        description: 'Nenhuma meta ativa encontrada',
        onTrackCount: 0,
        totalActiveCount: 0,
      };
    }

    const now = new Date();
    let onTrackCount = 0;

    activeGoals.forEach((goal) => {
      if (!goal.deadline) {
        return;
      }

      const deadline = new Date(goal.deadline);
      if (deadline <= now) {
        if (goal.accumulatedAmount >= goal.totalAmount) {
          onTrackCount++;
        }
        return;
      }

      const progress = goal.totalAmount > 0 ? (goal.accumulatedAmount / goal.totalAmount) * 100 : 0;
      const monthsRemaining = this.calculateMonthsRemaining(now, deadline);
      const expectedProgress = monthsRemaining > 0 ? Math.max(0, 100 - (monthsRemaining / 12) * 100) : 100;

      if (progress >= expectedProgress) {
        onTrackCount++;
      }
    });

    const percentage = (onTrackCount / activeGoals.length) * 100;
    let status: HealthIndicatorStatus = 'healthy';

    if (percentage < 50) {
      status = 'critical';
    } else if (percentage < 75) {
      status = 'warning';
    }

    return {
      value: percentage,
      percentage,
      status,
      label: 'Metas On-Track',
      description: `${onTrackCount} de ${activeGoals.length} metas no prazo`,
      onTrackCount,
      totalActiveCount: activeGoals.length,
    };
  });

  readonly emergencyReserveIndicator = computed<EmergencyReserveIndicator | null>(() => {
    const overview = this.dashboardDataService.budgetOverview();
    if (!overview) {
      return null;
    }

    const totalBalance = overview.totals.accountsBalance;
    const monthlyExpense = overview.totals.monthExpense;

    if (monthlyExpense <= 0) {
      return {
        value: 0,
        monthsCovered: 0,
        status: 'warning',
        label: 'Reserva de Emergência',
        description: 'Não é possível calcular sem despesas mensais',
      };
    }

    const monthsCovered = totalBalance / monthlyExpense;
    let status: HealthIndicatorStatus = 'critical';

    if (monthsCovered >= 6) {
      status = 'healthy';
    } else if (monthsCovered >= 3) {
      status = 'warning';
    }

    return {
      value: monthsCovered,
      monthsCovered,
      status,
      label: 'Reserva de Emergência',
      description: `${monthsCovered.toFixed(1)} meses de despesas cobertos`,
    };
  });

  readonly suggestedActions = computed<SuggestedAction[]>(() => {
    const actions: SuggestedAction[] = [];
    const goals = this.goalsState.items();
    const overview = this.dashboardDataService.budgetOverview();
    const now = new Date();

    goals.forEach((goal) => {
      if (!goal.deadline || goal.totalAmount <= 0) {
        return;
      }

      const deadline = new Date(goal.deadline);
      if (deadline <= now) {
        return;
      }

      const monthsRemaining = this.calculateMonthsRemaining(now, deadline);
      const remaining = Math.max(goal.totalAmount - goal.accumulatedAmount, 0);
      const suggestedMonthly = monthsRemaining > 0 ? remaining / monthsRemaining : null;

      if (suggestedMonthly && suggestedMonthly > 0) {
        const progress = (goal.accumulatedAmount / goal.totalAmount) * 100;
        const expectedProgress = monthsRemaining > 0 ? Math.max(0, 100 - (monthsRemaining / 12) * 100) : 100;

        if (progress < expectedProgress) {
          actions.push({
            id: `goal-${goal.id}`,
            type: 'goal-contribution',
            title: `Aporte sugerido para "${goal.name}"`,
            description: `Contribua ${suggestedMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} mensalmente para manter a meta no prazo`,
            icon: 'flag',
            route: `/goals/${goal.id}`,
            priority: monthsRemaining <= 3 ? 'high' : 'medium',
          });
        }
      }
    });

    const reserveIndicator = this.emergencyReserveIndicator();
    if (reserveIndicator && reserveIndicator.monthsCovered < 3) {
      actions.push({
        id: 'emergency-reserve',
        type: 'emergency-reserve',
        title: 'Aumentar reserva de emergência',
        description: `Sua reserva cobre apenas ${reserveIndicator.monthsCovered.toFixed(1)} meses. Recomenda-se pelo menos 3 meses`,
        icon: 'shield',
        route: '/goals',
        priority: 'high',
      });
    }

    const cashFlowIndicator = this.cashFlowIndicator();
    if (cashFlowIndicator && cashFlowIndicator.status === 'critical') {
      actions.push({
        id: 'cash-flow-negative',
        type: 'cash-flow',
        title: 'Ajustar fluxo de caixa',
        description: `Suas despesas estão ${Math.abs(cashFlowIndicator.absoluteValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} acima das receitas`,
        icon: 'trending-down',
        route: '/transactions',
        priority: 'high',
      });
    }

    return actions.slice(0, 5);
  });

  readonly recentAchievements = computed<RecentAchievement[]>(() => {
    const achievements: RecentAchievement[] = [];
    const goals = this.goalsState.items();
    const now = new Date();

    goals.forEach((goal) => {
      if (goal.accumulatedAmount >= goal.totalAmount && goal.totalAmount > 0) {
        achievements.push({
          id: `achievement-goal-${goal.id}`,
          type: 'goal-completed',
          message: `Meta "${goal.name}" alcançada!`,
          date: now,
          icon: 'trophy',
        });
      }
    });

    const reserveIndicator = this.emergencyReserveIndicator();
    if (reserveIndicator && reserveIndicator.monthsCovered >= 3 && reserveIndicator.monthsCovered < 6) {
      achievements.push({
        id: 'achievement-reserve-3',
        type: 'reserve-milestone',
        message: 'Reserva de emergência atingiu 3 meses!',
        date: now,
        icon: 'shield',
      });
    }

    if (reserveIndicator && reserveIndicator.monthsCovered >= 6) {
      achievements.push({
        id: 'achievement-reserve-6',
        type: 'reserve-milestone',
        message: 'Reserva de emergência atingiu 6 meses!',
        date: now,
        icon: 'shield-check',
      });
    }

    return achievements.slice(0, 5);
  });

  private calculateMonthsRemaining(start: Date, end: Date): number {
    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;

    if (end.getDate() < start.getDate()) {
      return Math.max(0, totalMonths - 1);
    }

    return Math.max(0, totalMonths);
  }
}

