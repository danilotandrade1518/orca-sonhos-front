import { TestBed } from '@angular/core/testing';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReportsState } from './reports.state';
import { ReportsApiService } from '../../services/reports-api/reports-api.service';
import { ReportsCalculatorService } from '../../services/reports-calculator/reports-calculator.service';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { ReportPeriod } from '../../types/reports.types';
import type { TransactionDto } from '../../../../../dtos/transaction';
import type { CategorySpendingDto } from '../../../../../dtos/report/category-spending.dto';

describe('ReportsState', () => {
  let state: ReportsState;
  let reportsApi: {
    getTransactionsForReport: ReturnType<typeof vi.fn>;
  };
  let calculator: {
    calculateCategorySpending: ReturnType<typeof vi.fn>;
    calculateRevenueExpense: ReturnType<typeof vi.fn>;
    calculateTotals: ReturnType<typeof vi.fn>;
  };
  let budgetSelectionService: {
    selectedBudgetId: ReturnType<typeof signal<string | null>>;
  };

  const createMockTransaction = (
    id: string,
    amount: number,
    type: 'INCOME' | 'EXPENSE'
  ): TransactionDto => ({
    id,
    accountId: 'acc-1',
    budgetId: 'budget-1',
    amount,
    description: `Transaction ${id}`,
    type,
    categoryId: type === 'EXPENSE' ? 'cat-1' : undefined,
    date: '2024-01-15T10:00:00.000Z',
  });

  beforeEach(() => {
    reportsApi = {
      getTransactionsForReport: vi.fn(),
    };

    calculator = {
      calculateCategorySpending: vi.fn(),
      calculateRevenueExpense: vi.fn(),
      calculateTotals: vi.fn(),
    };

    budgetSelectionService = {
      selectedBudgetId: signal<string | null>('budget-1'),
    };

    TestBed.configureTestingModule({
      providers: [
        ReportsState,
        { provide: ReportsApiService, useValue: reportsApi },
        { provide: ReportsCalculatorService, useValue: calculator },
        { provide: BudgetSelectionService, useValue: budgetSelectionService },
        provideZonelessChangeDetection(),
      ],
    });

    state = TestBed.inject(ReportsState);
  });

  describe('initial state', () => {
    it('should initialize with empty state', () => {
      expect(state.transactions()).toEqual([]);
      expect(state.categorySpending()).toEqual([]);
      expect(state.revenueExpense()).toBeNull();
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
      expect(state.filters().period).toBe(ReportPeriod.CURRENT_MONTH);
    });

    it('should expose readonly signals', () => {
      expect(state.transactions).toBeDefined();
      expect(state.categorySpending).toBeDefined();
      expect(state.revenueExpense).toBeDefined();
      expect(state.loading).toBeDefined();
      expect(state.error).toBeDefined();
      expect(state.filters).toBeDefined();
    });
  });

  describe('computed properties', () => {
    it('should compute hasData correctly', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      await state.loadReports();

      expect(state.hasData()).toBe(true);
    });

    it('should compute hasCategorySpending correctly', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      const categorySpending: CategorySpendingDto[] = [
        {
          categoryId: 'cat-1',
          categoryName: 'Category 1',
          totalAmount: 100.0,
          percentage: 100,
          transactionCount: 1,
        },
      ];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue(categorySpending);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      await state.loadReports();

      expect(state.hasCategorySpending()).toBe(true);
    });

    it('should compute totals correctly', async () => {
      const transactions = [
        createMockTransaction('txn-1', 5000.0, 'INCOME'),
        createMockTransaction('txn-2', -3000.0, 'EXPENSE'),
      ];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 5000,
        expense: 3000,
        difference: 2000,
        period: '',
      });
      calculator.calculateTotals.mockReturnValue({
        totalRevenue: 5000,
        totalExpense: 3000,
        totalDifference: 2000,
        totalTransactions: 2,
      });

      await state.loadReports();

      const totals = state.totals();
      expect(totals.totalRevenue).toBe(5000);
      expect(totals.totalExpense).toBe(3000);
      expect(totals.totalDifference).toBe(2000);
      expect(totals.totalTransactions).toBe(2);
    });
  });

  describe('loadReports', () => {
    it('should load reports successfully', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      const categorySpending: CategorySpendingDto[] = [];

      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue(categorySpending);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      await state.loadReports();

      expect(state.transactions()).toEqual(transactions);
      expect(state.categorySpending()).toEqual(categorySpending);
      expect(state.revenueExpense()?.revenue).toBe(0);
      expect(state.revenueExpense()?.expense).toBe(100);
      expect(state.revenueExpense()?.period).toBe('Mês Atual');
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });

    it('should set error when no budget is selected', async () => {
      budgetSelectionService.selectedBudgetId.set(null);

      await state.loadReports();

      expect(state.error()).toBe('Nenhum orçamento selecionado');
      expect(state.transactions()).toEqual([]);
      expect(state.loading()).toBe(false);
    });

    it('should not load when already loading and force is false', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      const promise1 = state.loadReports();
      const promise2 = state.loadReports();

      await Promise.all([promise1, promise2]);

      expect(reportsApi.getTransactionsForReport).toHaveBeenCalledTimes(1);
    });

    it('should load when force is true even if loading', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      const promise1 = state.loadReports();
      await state.loadReports(true);
      await promise1;

      expect(reportsApi.getTransactionsForReport).toHaveBeenCalledTimes(2);
    });

    it('should handle errors correctly', async () => {
      const error = new Error('API Error');
      reportsApi.getTransactionsForReport.mockRejectedValue(error);

      await state.loadReports();

      expect(state.error()).toBe('API Error');
      expect(state.transactions()).toEqual([]);
      expect(state.categorySpending()).toEqual([]);
      expect(state.revenueExpense()).toBeNull();
      expect(state.loading()).toBe(false);
    });

    it('should use correct period label', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      state.updateFilters({ period: ReportPeriod.LAST_MONTH });
      await state.loadReports();

      expect(state.revenueExpense()?.period).toBe('Mês Anterior');
    });
  });

  describe('updateFilters', () => {
    it('should update filters and reload reports', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      await state.updateFilters({ period: ReportPeriod.LAST_MONTH });

      expect(state.filters().period).toBe(ReportPeriod.LAST_MONTH);
      expect(reportsApi.getTransactionsForReport).toHaveBeenCalledWith(
        expect.objectContaining({ period: ReportPeriod.LAST_MONTH })
      );
    });
  });

  describe('setCategoryMap', () => {
    it('should update category map and recalculate category spending', () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      const categoryMap = {
        'cat-1': {
          name: 'Alimentação',
          type: 'EXPENSE' as const,
        },
      };
      const newCategorySpending: CategorySpendingDto[] = [
        {
          categoryId: 'cat-1',
          categoryName: 'Alimentação',
          totalAmount: 100.0,
          percentage: 100,
          transactionCount: 1,
        },
      ];

      calculator.calculateCategorySpending.mockReturnValue(newCategorySpending);

      state['_transactions'].set(transactions);
      state.setCategoryMap(categoryMap);

      expect(calculator.calculateCategorySpending).toHaveBeenCalledWith(transactions, categoryMap);
      expect(state.categorySpending()).toEqual(newCategorySpending);
    });

    it('should not recalculate when no transactions', () => {
      const categoryMap = {
        'cat-1': {
          name: 'Alimentação',
          type: 'EXPENSE' as const,
        },
      };

      state.setCategoryMap(categoryMap);

      expect(calculator.calculateCategorySpending).not.toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      state['_error'].set('Some error');

      state.clearError();

      expect(state.error()).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should reload reports with force', async () => {
      const transactions = [createMockTransaction('txn-1', 100.0, 'EXPENSE')];
      reportsApi.getTransactionsForReport.mockResolvedValue(transactions);
      calculator.calculateCategorySpending.mockReturnValue([]);
      calculator.calculateRevenueExpense.mockReturnValue({
        revenue: 0,
        expense: 100,
        difference: -100,
        period: '',
      });

      await state.refresh();

      expect(reportsApi.getTransactionsForReport).toHaveBeenCalled();
    });
  });
});
