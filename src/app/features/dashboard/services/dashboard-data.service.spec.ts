import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';

import { ApiService } from '../../../core/services/api/api.service';
import { DashboardDataService } from './dashboard-data.service';

describe('DashboardDataService', () => {
  let service: DashboardDataService;
  let apiService: ApiService;

  const mockBudgetsResponse = {
    data: [
      {
        id: 'budget-1',
        name: 'Orçamento Pessoal',
        type: 'PERSONAL' as const,
        participantsCount: 1,
      },
    ],
  };

  const mockOverviewResponse = {
    data: {
      id: 'budget-1',
      name: 'Orçamento Pessoal',
      type: 'PERSONAL' as const,
      participants: [
        {
          id: 'participant-1',
          name: 'João Silva',
          email: 'joao@example.com',
        },
      ],
      totals: {
        accountsBalance: 4000,
        monthIncome: 5000,
        monthExpense: 1000,
        netMonth: 4000,
      },
      accounts: [
        {
          id: 'account-1',
          name: 'Conta Corrente',
          type: 'CHECKING_ACCOUNT' as const,
          balance: 5000,
        },
        {
          id: 'account-2',
          name: 'Cartão de Crédito',
          type: 'CHECKING_ACCOUNT' as const,
          balance: -1000,
        },
      ],
    },
  };

  beforeEach(async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    service = TestBed.inject(DashboardDataService);
    apiService = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with empty budgets', () => {
      expect(service.budgets()).toEqual([]);
    });

    it('should initialize with null overview', () => {
      expect(service.budgetOverview()).toBeNull();
    });

    it('should initialize with loading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('computed signals', () => {
    it('should have hasBudgets as false when no budgets', () => {
      expect(service.hasBudgets()).toBe(false);
    });

    it('should have hasBudgets as true when budgets available', () => {
      service['_budgets'].set(mockBudgetsResponse.data);
      expect(service.hasBudgets()).toBe(true);
    });

    it('should have hasOverview as false when no overview', () => {
      expect(service.hasOverview()).toBe(false);
    });

    it('should have hasOverview as true when overview available', () => {
      service['_budgetOverview'].set(mockOverviewResponse.data);
      expect(service.hasOverview()).toBe(true);
    });
  });

  describe('loadBudgets', () => {
    it('should load budgets successfully', async () => {
      vi.spyOn(apiService, 'get').mockReturnValue(of(mockBudgetsResponse));

      const result = await firstValueFrom(service.loadBudgets());

      expect(result).toEqual(mockBudgetsResponse.data);
      expect(service.budgets()).toEqual(mockBudgetsResponse.data);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should handle error when loading budgets', async () => {
      const error = new Error('API Error');
      vi.spyOn(apiService, 'get').mockReturnValue(throwError(() => error));

      const result = await firstValueFrom(service.loadBudgets());

      expect(result).toEqual([]);
      expect(service.error()).toBe('API Error');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('loadBudgetOverview', () => {
    it('should load budget overview successfully', async () => {
      vi.spyOn(apiService, 'get').mockReturnValue(of(mockOverviewResponse));

      const result = await firstValueFrom(service.loadBudgetOverview('budget-1'));

      expect(result).toEqual(mockOverviewResponse.data);
      expect(service.budgetOverview()).toEqual(mockOverviewResponse.data);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should handle error when loading overview', async () => {
      const error = new Error('API Error');
      vi.spyOn(apiService, 'get').mockReturnValue(throwError(() => error));

      const result = await firstValueFrom(service.loadBudgetOverview('budget-1'));

      expect(result).toBeNull();
      expect(service.error()).toBe('API Error');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should clear overview', () => {
      service['_budgetOverview'].set(mockOverviewResponse.data);
      service['_error'].set('Some error');

      service.clearOverview();

      expect(service.budgetOverview()).toBeNull();
      expect(service.error()).toBeNull();
    });

    it('should clear error', () => {
      service['_error'].set('Some error');
      service.clearError();
      expect(service.error()).toBeNull();
    });

    it('should reset all state', () => {
      service['_budgets'].set(mockBudgetsResponse.data);
      service['_budgetOverview'].set(mockOverviewResponse.data);
      service['_isLoading'].set(true);
      service['_error'].set('Some error');

      service.reset();

      expect(service.budgets()).toEqual([]);
      expect(service.budgetOverview()).toBeNull();
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });
  });

  describe('calculateMetrics', () => {
    it('should calculate metrics correctly', () => {
      service['_budgetOverview'].set(mockOverviewResponse.data);
      const metrics = service['calculateMetrics']();

      expect(metrics.totalAccounts).toBe(2);
      expect(metrics.totalBalance).toBe(4000);
      expect(metrics.monthlyIncome).toBe(5000);
      expect(metrics.monthlyExpense).toBe(1000);
      expect(metrics.netMonthly).toBe(4000);
      expect(metrics.goalsProgress).toBe(0);
      expect(metrics.recentTransactionsCount).toBe(0);
    });

    it('should return zero metrics when no overview', () => {
      const metrics = service['calculateMetrics']();

      expect(metrics.totalAccounts).toBe(0);
      expect(metrics.totalBalance).toBe(0);
      expect(metrics.monthlyIncome).toBe(0);
      expect(metrics.monthlyExpense).toBe(0);
      expect(metrics.netMonthly).toBe(0);
      expect(metrics.goalsProgress).toBe(0);
      expect(metrics.recentTransactionsCount).toBe(0);
    });
  });

  describe('dashboardData computed', () => {
    it('should return complete dashboard data', () => {
      service['_budgetOverview'].set(mockOverviewResponse.data);

      const data = service.dashboardData();

      expect(data.budgetOverview).toEqual(mockOverviewResponse.data);
      expect(data.isLoading).toBe(false);
      expect(data.error).toBeNull();
    });
  });
});
