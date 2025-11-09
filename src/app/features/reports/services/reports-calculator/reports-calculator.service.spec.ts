import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ReportsCalculatorService, type CategoryMap } from './reports-calculator.service';
import type { TransactionDto } from '../../../../../dtos/transaction';

describe('ReportsCalculatorService', () => {
  let service: ReportsCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportsCalculatorService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(ReportsCalculatorService);
  });

  describe('calculateCategorySpending', () => {
    it('should calculate category spending from transactions', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -100.0,
          description: 'Transaction 1',
          type: 'EXPENSE',
          categoryId: 'cat-1',
          date: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -200.0,
          description: 'Transaction 2',
          type: 'EXPENSE',
          categoryId: 'cat-1',
          date: '2024-01-16T10:00:00.000Z',
        },
        {
          id: 'txn-3',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -150.0,
          description: 'Transaction 3',
          type: 'EXPENSE',
          categoryId: 'cat-2',
          date: '2024-01-17T10:00:00.000Z',
        },
      ];

      const result = service.calculateCategorySpending(transactions);

      expect(result).toHaveLength(2);
      expect(result[0].categoryId).toBe('cat-1');
      expect(result[0].totalAmount).toBe(300.0);
      expect(result[0].transactionCount).toBe(2);
      expect(result[0].percentage).toBeCloseTo(66.67, 2);
      expect(result[1].categoryId).toBe('cat-2');
      expect(result[1].totalAmount).toBe(150.0);
      expect(result[1].transactionCount).toBe(1);
      expect(result[1].percentage).toBeCloseTo(33.33, 2);
    });

    it('should use category map when provided', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -100.0,
          description: 'Transaction 1',
          type: 'EXPENSE',
          categoryId: 'cat-1',
          date: '2024-01-15T10:00:00.000Z',
        },
      ];

      const categoryMap: CategoryMap = {
        'cat-1': {
          name: 'Alimentação',
          type: 'EXPENSE',
        },
      };

      const result = service.calculateCategorySpending(transactions, categoryMap);

      expect(result[0].categoryName).toBe('Alimentação');
    });

    it('should use default category name when category map not provided', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -100.0,
          description: 'Transaction 1',
          type: 'EXPENSE',
          categoryId: 'cat-12345678',
          date: '2024-01-15T10:00:00.000Z',
        },
      ];

      const result = service.calculateCategorySpending(transactions);

      expect(result[0].categoryName).toBe('Categoria cat-1234');
    });

    it('should filter out income transactions', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: 1000.0,
          description: 'Income',
          type: 'INCOME',
          categoryId: 'cat-1',
          date: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -100.0,
          description: 'Expense',
          type: 'EXPENSE',
          categoryId: 'cat-2',
          date: '2024-01-16T10:00:00.000Z',
        },
      ];

      const result = service.calculateCategorySpending(transactions);

      expect(result).toHaveLength(1);
      expect(result[0].categoryId).toBe('cat-2');
    });

    it('should filter out transactions without categoryId', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -100.0,
          description: 'Transaction without category',
          type: 'EXPENSE',
          date: '2024-01-15T10:00:00.000Z',
        },
      ];

      const result = service.calculateCategorySpending(transactions);

      expect(result).toHaveLength(0);
    });

    it('should return empty array when no expense transactions', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: 1000.0,
          description: 'Income',
          type: 'INCOME',
          date: '2024-01-15T10:00:00.000Z',
        },
      ];

      const result = service.calculateCategorySpending(transactions);

      expect(result).toEqual([]);
    });

    it('should sort results by totalAmount descending', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -100.0,
          description: 'Small',
          type: 'EXPENSE',
          categoryId: 'cat-small',
          date: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -500.0,
          description: 'Large',
          type: 'EXPENSE',
          categoryId: 'cat-large',
          date: '2024-01-16T10:00:00.000Z',
        },
      ];

      const result = service.calculateCategorySpending(transactions);

      expect(result).toHaveLength(2);
      expect(result[0]?.categoryId).toBe('cat-large');
      expect(result[1]?.categoryId).toBe('cat-small');
    });
  });

  describe('calculateRevenueExpense', () => {
    it('should calculate revenue and expense correctly', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: 5000.0,
          description: 'Salary',
          type: 'INCOME',
          date: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -3000.0,
          description: 'Expense',
          type: 'EXPENSE',
          date: '2024-01-16T10:00:00.000Z',
        },
      ];

      const result = service.calculateRevenueExpense(transactions);

      expect(result.revenue).toBe(5000.0);
      expect(result.expense).toBe(3000.0);
      expect(result.difference).toBe(2000.0);
    });

    it('should handle negative amounts correctly', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -5000.0,
          description: 'Negative income',
          type: 'INCOME',
          date: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -3000.0,
          description: 'Negative expense',
          type: 'EXPENSE',
          date: '2024-01-16T10:00:00.000Z',
        },
      ];

      const result = service.calculateRevenueExpense(transactions);

      expect(result.revenue).toBe(5000.0);
      expect(result.expense).toBe(3000.0);
    });

    it('should return zero values for empty transactions', () => {
      const transactions: TransactionDto[] = [];

      const result = service.calculateRevenueExpense(transactions);

      expect(result.revenue).toBe(0);
      expect(result.expense).toBe(0);
      expect(result.difference).toBe(0);
    });
  });

  describe('calculateTotals', () => {
    it('should calculate totals correctly', () => {
      const transactions: TransactionDto[] = [
        {
          id: 'txn-1',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: 5000.0,
          description: 'Income',
          type: 'INCOME',
          date: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'txn-2',
          accountId: 'acc-1',
          budgetId: 'budget-1',
          amount: -3000.0,
          description: 'Expense',
          type: 'EXPENSE',
          date: '2024-01-16T10:00:00.000Z',
        },
      ];

      const result = service.calculateTotals(transactions);

      expect(result.totalRevenue).toBe(5000.0);
      expect(result.totalExpense).toBe(3000.0);
      expect(result.totalDifference).toBe(2000.0);
      expect(result.totalTransactions).toBe(2);
    });

    it('should handle empty transactions', () => {
      const transactions: TransactionDto[] = [];

      const result = service.calculateTotals(transactions);

      expect(result.totalRevenue).toBe(0);
      expect(result.totalExpense).toBe(0);
      expect(result.totalDifference).toBe(0);
      expect(result.totalTransactions).toBe(0);
    });
  });
});
