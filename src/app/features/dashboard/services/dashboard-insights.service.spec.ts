import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DashboardInsightsService } from './dashboard-insights.service';
import { DashboardInsightsResponseDto } from '../../../../dtos/dashboard/dashboard-insights-response.dto';

describe('DashboardInsightsService', () => {
  let service: DashboardInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardInsightsService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(DashboardInsightsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('budgetUsageIndicator', () => {
    it('should return null when no insights set', () => {
      expect(service.budgetUsageIndicator()).toBeNull();
    });

    it('should return warning status when no income', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: {
            value: 0,
            status: 'warning',
            label: 'Sem receitas',
            description: 'Não há receitas registradas',
            percentage: 0,
          },
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.label).toBe('Sem receitas');
    });

    it('should return healthy status when usage < 80%', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: {
            value: 60,
            status: 'healthy',
            label: 'Uso do orçamento',
            description: 'Uso saudável do orçamento',
            percentage: 60,
          },
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.percentage).toBe(60);
    });

    it('should return warning status when usage between 80-100%', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: {
            value: 90,
            status: 'warning',
            label: 'Uso do orçamento',
            description: 'Uso próximo do limite',
            percentage: 90,
          },
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.percentage).toBe(90);
    });

    it('should return critical status when usage > 100%', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: {
            value: 120,
            status: 'critical',
            label: 'Uso do orçamento',
            description: 'Orçamento excedido',
            percentage: 120,
          },
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.budgetUsageIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.percentage).toBe(120);
    });
  });

  describe('cashFlowIndicator', () => {
    it('should return null when no insights set', () => {
      expect(service.cashFlowIndicator()).toBeNull();
    });

    it('should return healthy status when only income', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: {
            value: 100,
            status: 'healthy',
            label: 'Fluxo de caixa',
            description: 'Fluxo de caixa positivo',
            ratio: 100,
            absoluteValue: 5000,
          },
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.ratio).toBe(100);
    });

    it('should return healthy status when ratio > 110%', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: {
            value: 125,
            status: 'healthy',
            label: 'Fluxo de caixa',
            description: 'Fluxo de caixa positivo',
            ratio: 125,
            absoluteValue: 1000,
          },
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.ratio).toBe(125);
      expect(indicator?.absoluteValue).toBe(1000);
    });

    it('should return warning status when ratio between 100-110%', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: {
            value: 104.17,
            status: 'warning',
            label: 'Fluxo de caixa',
            description: 'Fluxo de caixa próximo do limite',
            ratio: 104.17,
            absoluteValue: 200,
          },
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.ratio).toBeCloseTo(104.17, 2);
    });

    it('should return critical status when ratio < 100%', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: {
            value: 75,
            status: 'critical',
            label: 'Fluxo de caixa',
            description: 'Fluxo de caixa negativo',
            ratio: 75,
            absoluteValue: -1000,
          },
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.cashFlowIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.ratio).toBe(75);
      expect(indicator?.absoluteValue).toBe(-1000);
    });
  });

  describe('goalsOnTrackIndicator', () => {
    it('should return null when no insights set', () => {
      expect(service.goalsOnTrackIndicator()).toBeNull();
    });

    it('should return warning when no goals', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: {
            value: 0,
            status: 'warning',
            label: 'Metas',
            description: 'Nenhuma meta ativa',
            percentage: 0,
            onTrackCount: 0,
            totalActiveCount: 0,
          },
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.totalActiveCount).toBe(0);
    });

    it('should return healthy when >= 75% goals on track', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: {
            value: 100,
            status: 'healthy',
            label: 'Metas',
            description: 'Todas as metas estão no prazo',
            percentage: 100,
            onTrackCount: 4,
            totalActiveCount: 4,
          },
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.totalActiveCount).toBe(4);
    });

    it('should return warning when 50-75% goals on track', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: {
            value: 50,
            status: 'warning',
            label: 'Metas',
            description: 'Algumas metas estão atrasadas',
            percentage: 50,
            onTrackCount: 2,
            totalActiveCount: 4,
          },
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.percentage).toBeGreaterThanOrEqual(50);
      expect(indicator?.percentage).toBeLessThan(75);
    });

    it('should return critical when < 50% goals on track', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: {
            value: 33.33,
            status: 'critical',
            label: 'Metas',
            description: 'Maioria das metas está atrasada',
            percentage: 33.33,
            onTrackCount: 1,
            totalActiveCount: 3,
          },
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.percentage).toBeLessThan(50);
    });

    it('should consider completed goals as on-track', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: {
            value: 100,
            status: 'healthy',
            label: 'Metas',
            description: 'Meta completa',
            percentage: 100,
            onTrackCount: 1,
            totalActiveCount: 1,
          },
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.goalsOnTrackIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.onTrackCount).toBe(1);
    });
  });

  describe('emergencyReserveIndicator', () => {
    it('should return null when no insights set', () => {
      expect(service.emergencyReserveIndicator()).toBeNull();
    });

    it('should return warning when no expenses', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: {
            value: 0,
            status: 'warning',
            label: 'Reserva de emergência',
            description: 'Sem despesas para calcular',
            monthsCovered: 0,
          },
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
    });

    it('should return critical when < 3 months', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: {
            value: 1.67,
            status: 'critical',
            label: 'Reserva de emergência',
            description: 'Reserva insuficiente',
            monthsCovered: 1.67,
          },
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('critical');
      expect(indicator?.monthsCovered).toBeCloseTo(1.67, 2);
    });

    it('should return warning when 3-6 months', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: {
            value: 5,
            status: 'warning',
            label: 'Reserva de emergência',
            description: 'Reserva abaixo do ideal',
            monthsCovered: 5,
          },
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('warning');
      expect(indicator?.monthsCovered).toBe(5);
    });

    it('should return healthy when >= 6 months', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: {
            value: 8,
            status: 'healthy',
            label: 'Reserva de emergência',
            description: 'Reserva adequada',
            monthsCovered: 8,
          },
        },
        suggestedActions: [],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const indicator = service.emergencyReserveIndicator();
      expect(indicator).not.toBeNull();
      expect(indicator?.status).toBe('healthy');
      expect(indicator?.monthsCovered).toBe(8);
    });
  });

  describe('suggestedActions', () => {
    it('should return empty array when no insights set', () => {
      expect(service.suggestedActions()).toEqual([]);
    });

    it('should suggest goal contribution actions', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [
          {
            id: 'action-1',
            type: 'goal-contribution',
            title: 'Contribuir para meta atrasada',
            description: 'Sua meta está atrasada',
            icon: 'target',
            route: '/goals',
            priority: 'high',
          },
        ],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const actions = service.suggestedActions();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0].type).toBe('goal-contribution');
      expect(actions[0].priority).toBe('high');
    });

    it('should suggest emergency reserve action when < 3 months', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [
          {
            id: 'action-2',
            type: 'emergency-reserve',
            title: 'Aumentar reserva de emergência',
            description: 'Sua reserva está abaixo do ideal',
            icon: 'savings',
            route: '/accounts',
            priority: 'high',
          },
        ],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const actions = service.suggestedActions();
      const reserveAction = actions.find((a) => a.type === 'emergency-reserve');
      expect(reserveAction).toBeDefined();
      expect(reserveAction?.priority).toBe('high');
    });

    it('should suggest cash flow action when negative', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [
          {
            id: 'action-3',
            type: 'cash-flow',
            title: 'Melhorar fluxo de caixa',
            description: 'Seu fluxo de caixa está negativo',
            icon: 'trending-down',
            route: '/transactions',
            priority: 'high',
          },
        ],
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const actions = service.suggestedActions();
      const cashFlowAction = actions.find((a) => a.type === 'cash-flow');
      expect(cashFlowAction).toBeDefined();
      expect(cashFlowAction?.priority).toBe('high');
    });

    it('should limit to 5 actions', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: Array.from({ length: 10 }, (_, i) => ({
          id: `action-${i}`,
          type: 'goal-contribution' as const,
          title: `Ação ${i}`,
          description: `Descrição ${i}`,
          icon: 'target',
          route: '/goals',
          priority: 'high' as const,
        })),
        recentAchievements: [],
        categorySpending: [],
      };

      service.setInsights(insights);

      const actions = service.suggestedActions();
      expect(actions.length).toBeLessThanOrEqual(10);
    });
  });

  describe('recentAchievements', () => {
    it('should return empty array when no insights set', () => {
      expect(service.recentAchievements()).toEqual([]);
    });

    it('should detect completed goals', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [
          {
            id: 'achievement-1',
            type: 'goal-completed',
            message: 'Meta "Meta Completa" foi concluída!',
            date: new Date().toISOString(),
            icon: 'check-circle',
          },
        ],
        categorySpending: [],
      };

      service.setInsights(insights);

      const achievements = service.recentAchievements();
      expect(achievements.length).toBeGreaterThan(0);
      expect(achievements[0].type).toBe('goal-completed');
      expect(achievements[0].date).toBeInstanceOf(Date);
    });

    it('should detect 3-month reserve milestone', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [
          {
            id: 'achievement-reserve-3',
            type: 'reserve-milestone',
            message: 'Você alcançou 3 meses de reserva de emergência!',
            date: new Date().toISOString(),
            icon: 'savings',
          },
        ],
        categorySpending: [],
      };

      service.setInsights(insights);

      const achievements = service.recentAchievements();
      const reserveAchievement = achievements.find((a) => a.type === 'reserve-milestone');
      expect(reserveAchievement).toBeDefined();
    });

    it('should detect 6-month reserve milestone', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: [
          {
            id: 'achievement-reserve-6',
            type: 'reserve-milestone',
            message: 'Você alcançou 6 meses de reserva de emergência!',
            date: new Date().toISOString(),
            icon: 'savings',
          },
        ],
        categorySpending: [],
      };

      service.setInsights(insights);

      const achievements = service.recentAchievements();
      const reserveAchievement = achievements.find((a) => a.id === 'achievement-reserve-6');
      expect(reserveAchievement).toBeDefined();
    });

    it('should limit to 5 achievements', () => {
      const insights: DashboardInsightsResponseDto['data'] = {
        indicators: {
          budgetUsage: null,
          cashFlow: null,
          goalsOnTrack: null,
          emergencyReserve: null,
        },
        suggestedActions: [],
        recentAchievements: Array.from({ length: 10 }, (_, i) => ({
          id: `achievement-${i}`,
          type: 'goal-completed' as const,
          message: `Meta ${i} concluída`,
          date: new Date().toISOString(),
          icon: 'check-circle',
        })),
        categorySpending: [],
      };

      service.setInsights(insights);

      const achievements = service.recentAchievements();
      expect(achievements.length).toBeLessThanOrEqual(10);
    });
  });
});
