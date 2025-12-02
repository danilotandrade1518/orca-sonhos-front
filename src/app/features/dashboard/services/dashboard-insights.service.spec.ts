import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signal } from '@angular/core';

import { GoalDto } from '../../../../dtos/goal/goal-types/goal-types';
import { BudgetOverviewDto } from '../../../../dtos/budget/budget-types';
import { GoalsState } from '../../../goals/state/goals-state/goals.state';
import { DashboardDataService } from './dashboard-data.service';
import { DashboardInsightsService } from './dashboard-insights.service';

describe('DashboardInsightsService', () => {
  let service: DashboardInsightsService;
  let dashboardDataService: {
    budgetOverview: ReturnType<typeof signal<BudgetOverviewDto | null>>;
  };
  let goalsState: {
    items: ReturnType<typeof signal<GoalDto[]>>;
  };

  const mockBudgetOverview: BudgetOverviewDto = {
    id: 'budget-1',
    name: 'Orçamento Pessoal',
    type: 'PERSONAL',
    participants: [
      {
        id: 'participant-1',
        name: 'João Silva',
        email: 'joao@example.com',
      },
    ],
    totals: {
      accountsBalance: 10000,
      monthIncome: 5000,
      monthExpense: 3000,
      netMonth: 2000,
    },
    accounts: [
      {
        id: 'account-1',
        name: 'Conta Corrente',
        type: 'CHECKING_ACCOUNT',
      },
    ],
  };

  const mockGoals: GoalDto[] = [
    {
      id: 'goal-1',
      name: 'Reserva de Emergência',
      totalAmount: 10000,
      accumulatedAmount: 5000,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      budgetId: 'budget-1',
    },
    {
      id: 'goal-2',
      name: 'Viagem',
      totalAmount: 5000,
      accumulatedAmount: 2500,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      budgetId: 'budget-1',
    },
  ];

  beforeEach(() => {
    dashboardDataService = {
      budgetOverview: signal<BudgetOverviewDto | null>(null),
    };

    goalsState = {
      items: signal<GoalDto[]>([]),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardInsightsService,
        { provide: DashboardDataService, useValue: dashboardDataService },
        { provide: GoalsState, useValue: goalsState },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(DashboardInsightsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('budgetUsageIndicator', () => {
    it('should return null when no overview', () => {
      expect(service.budgetUsageIndicator()).toBeNull();
    });

    it('should return warning status when no income', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 0,
        },
      });

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.label).toBe('Sem receitas');
    });

    it('should return healthy status when usage < 80%', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 5000,
          monthExpense: 3000,
        },
      });

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.percentage).toBe(60);
    });

    it('should return warning status when usage between 80-100%', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 5000,
          monthExpense: 4500,
        },
      });

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.percentage).toBe(90);
    });

    it('should return critical status when usage > 100%', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 5000,
          monthExpense: 6000,
        },
      });

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.percentage).toBe(120);
    });
  });

  describe('cashFlowIndicator', () => {
    it('should return null when no overview', () => {
      expect(service.cashFlowIndicator()).toBeNull();
    });

    it('should return healthy status when only income', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 5000,
          monthExpense: 0,
        },
      });

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.ratio).toBe(100);
    });

    it('should return healthy status when ratio > 110%', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 5000,
          monthExpense: 4000,
        },
      });

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.ratio).toBe(125);
      expect(indicator?.absoluteValue).toBe(1000);
    });

    it('should return warning status when ratio between 100-110%', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 5000,
          monthExpense: 4800,
        },
      });

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.ratio).toBeCloseTo(104.17, 2);
    });

    it('should return critical status when ratio < 100%', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 3000,
          monthExpense: 4000,
        },
      });

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.ratio).toBe(75);
      expect(indicator?.absoluteValue).toBe(-1000);
    });
  });

  describe('goalsOnTrackIndicator', () => {
    it('should return warning when no goals', () => {
      goalsState.items.set([]);
      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.totalActiveCount).toBe(0);
    });

    it('should return healthy when >= 75% goals on track', () => {
      goalsState.items.set([
        {
          id: 'goal-1',
          name: 'Meta 1',
          totalAmount: 1000,
          accumulatedAmount: 500,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
        {
          id: 'goal-2',
          name: 'Meta 2',
          totalAmount: 1000,
          accumulatedAmount: 500,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
        {
          id: 'goal-3',
          name: 'Meta 3',
          totalAmount: 1000,
          accumulatedAmount: 500,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
        {
          id: 'goal-4',
          name: 'Meta 4',
          totalAmount: 1000,
          accumulatedAmount: 500,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
      ]);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.totalActiveCount).toBe(4);
    });

    it('should return warning when 50-75% goals on track', () => {
      goalsState.items.set([
        {
          id: 'goal-1',
          name: 'Meta 1',
          totalAmount: 1000,
          accumulatedAmount: 100,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
        {
          id: 'goal-2',
          name: 'Meta 2',
          totalAmount: 1000,
          accumulatedAmount: 500,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
      ]);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
    });

    it('should return critical when < 50% goals on track', () => {
      goalsState.items.set([
        {
          id: 'goal-1',
          name: 'Meta 1',
          totalAmount: 1000,
          accumulatedAmount: 50,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
        {
          id: 'goal-2',
          name: 'Meta 2',
          totalAmount: 1000,
          accumulatedAmount: 50,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
      ]);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
    });

    it('should consider completed goals as on-track', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      goalsState.items.set([
        {
          id: 'goal-1',
          name: 'Meta Completa',
          totalAmount: 1000,
          accumulatedAmount: 1000,
          deadline: pastDate,
          budgetId: 'budget-1',
        },
      ]);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.onTrackCount).toBe(1);
    });
  });

  describe('emergencyReserveIndicator', () => {
    it('should return null when no overview', () => {
      expect(service.emergencyReserveIndicator()).toBeNull();
    });

    it('should return warning when no expenses', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthExpense: 0,
        },
      });

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
    });

    it('should return critical when < 3 months', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          accountsBalance: 5000,
          monthExpense: 3000,
        },
      });

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.monthsCovered).toBeCloseTo(1.67, 2);
    });

    it('should return warning when 3-6 months', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          accountsBalance: 15000,
          monthExpense: 3000,
        },
      });

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.monthsCovered).toBe(5);
    });

    it('should return healthy when >= 6 months', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          accountsBalance: 24000,
          monthExpense: 3000,
        },
      });

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.monthsCovered).toBe(8);
    });
  });

  describe('suggestedActions', () => {
    it('should return empty array when no data', () => {
      expect(service.suggestedActions()).toEqual([]);
    });

    it('should suggest goal contribution actions', () => {
      goalsState.items.set([
        {
          id: 'goal-1',
          name: 'Meta Atrasada',
          totalAmount: 10000,
          accumulatedAmount: 1000,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
      ]);

      const actions = service.suggestedActions();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0].type).toBe('goal-contribution');
      expect(actions[0].priority).toBe('high');
    });

    it('should suggest emergency reserve action when < 3 months', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          accountsBalance: 5000,
          monthExpense: 3000,
        },
      });

      const actions = service.suggestedActions();
      const reserveAction = actions.find((a) => a.type === 'emergency-reserve');
      expect(reserveAction).toBeDefined();
      expect(reserveAction?.priority).toBe('high');
    });

    it('should suggest cash flow action when negative', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          monthIncome: 3000,
          monthExpense: 4000,
        },
      });

      const actions = service.suggestedActions();
      const cashFlowAction = actions.find((a) => a.type === 'cash-flow');
      expect(cashFlowAction).toBeDefined();
      expect(cashFlowAction?.priority).toBe('high');
    });

    it('should limit to 5 actions', () => {
      goalsState.items.set(
        Array.from({ length: 10 }, (_, i) => ({
          id: `goal-${i}`,
          name: `Meta ${i}`,
          totalAmount: 10000,
          accumulatedAmount: 1000,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        }))
      );

      const actions = service.suggestedActions();
      expect(actions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('recentAchievements', () => {
    it('should return empty array when no achievements', () => {
      expect(service.recentAchievements()).toEqual([]);
    });

    it('should detect completed goals', () => {
      goalsState.items.set([
        {
          id: 'goal-1',
          name: 'Meta Completa',
          totalAmount: 1000,
          accumulatedAmount: 1000,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        },
      ]);

      const achievements = service.recentAchievements();
      expect(achievements.length).toBeGreaterThan(0);
      expect(achievements[0].type).toBe('goal-completed');
    });

    it('should detect 3-month reserve milestone', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          accountsBalance: 9000,
          monthExpense: 3000,
        },
      });

      const achievements = service.recentAchievements();
      const reserveAchievement = achievements.find((a) => a.type === 'reserve-milestone');
      expect(reserveAchievement).toBeDefined();
    });

    it('should detect 6-month reserve milestone', () => {
      dashboardDataService.budgetOverview.set({
        ...mockBudgetOverview,
        totals: {
          ...mockBudgetOverview.totals,
          accountsBalance: 18000,
          monthExpense: 3000,
        },
      });

      const achievements = service.recentAchievements();
      const reserveAchievement = achievements.find((a) => a.id === 'achievement-reserve-6');
      expect(reserveAchievement).toBeDefined();
    });

    it('should limit to 5 achievements', () => {
      goalsState.items.set(
        Array.from({ length: 10 }, (_, i) => ({
          id: `goal-${i}`,
          name: `Meta ${i}`,
          totalAmount: 1000,
          accumulatedAmount: 1000,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          budgetId: 'budget-1',
        }))
      );

      const achievements = service.recentAchievements();
      expect(achievements.length).toBeLessThanOrEqual(5);
    });
  });
});

