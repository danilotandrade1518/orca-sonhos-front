import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChartDataTransformer } from './chart-data-transformer.service';
import type { CategorySpendingDto } from '../../../dtos/report/category-spending.dto';
import type { RevenueExpenseDto } from '../../../dtos/report/revenue-expense.dto';

describe('ChartDataTransformer', () => {
  let transformer: ChartDataTransformer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartDataTransformer, provideZonelessChangeDetection()],
    });

    transformer = TestBed.inject(ChartDataTransformer);
  });

  describe('transformCategorySpendingToChartData', () => {
    it('should transform CategorySpendingDto array to ChartData', () => {
      
      const categorySpending: CategorySpendingDto[] = [
        {
          categoryId: 'cat-1',
          categoryName: 'Alimentação',
          totalAmount: 1500.0,
          percentage: 65.22,
          transactionCount: 5,
        },
        {
          categoryId: 'cat-2',
          categoryName: 'Transporte',
          totalAmount: 800.0,
          percentage: 34.78,
          transactionCount: 3,
        },
      ];
      
      const result = transformer.transformCategorySpendingToChartData(categorySpending);
      
      expect(result.labels).toEqual(['Alimentação', 'Transporte']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].label).toBe('Gastos por Categoria');
      expect(result.datasets[0].data).toEqual([1500.0, 800.0]);
      expect(result.datasets[0].backgroundColor).toHaveLength(2);
      expect(result.datasets[0].borderColor).toHaveLength(2);
      expect(result.datasets[0].borderWidth).toBe(1);
    });

    it('should handle empty array', () => {
      
      const categorySpending: CategorySpendingDto[] = [];
      
      const result = transformer.transformCategorySpendingToChartData(categorySpending);
      
      expect(result.labels).toEqual([]);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].data).toEqual([]);
      expect(result.datasets[0].backgroundColor).toEqual([]);
      expect(result.datasets[0].borderColor).toEqual([]);
    });

    it('should generate colors for multiple categories', () => {
      
      const categorySpending: CategorySpendingDto[] = Array.from({ length: 15 }, (_, i) => ({
        categoryId: `cat-${i}`,
        categoryName: `Category ${i}`,
        totalAmount: 100.0 * (i + 1),
        percentage: (100.0 * (i + 1)) / 12000.0 * 100,
        transactionCount: 1,
      }));
      
      const result = transformer.transformCategorySpendingToChartData(categorySpending);
      
      expect(result.datasets[0].backgroundColor).toHaveLength(15);
      expect(result.datasets[0].borderColor).toHaveLength(15);
      
      const backgroundColor = result.datasets[0].backgroundColor;
      expect(backgroundColor).toBeDefined();
      expect(Array.isArray(backgroundColor)).toBe(true);
      if (backgroundColor && Array.isArray(backgroundColor)) {
        expect(backgroundColor[0]).toBe(backgroundColor[10]);
      }
    });

    it('should handle single category', () => {
      
      const categorySpending: CategorySpendingDto[] = [
        {
          categoryId: 'cat-1',
          categoryName: 'Alimentação',
          totalAmount: 1500.0,
          percentage: 100.0,
          transactionCount: 5,
        },
      ];
      
      const result = transformer.transformCategorySpendingToChartData(categorySpending);
      
      expect(result.labels).toEqual(['Alimentação']);
      expect(result.datasets[0].data).toEqual([1500.0]);
      expect(result.datasets[0].backgroundColor).toHaveLength(1);
      expect(result.datasets[0].borderColor).toHaveLength(1);
    });
  });

  describe('transformRevenueExpenseToChartData', () => {
    it('should transform RevenueExpenseDto to ChartData', () => {
      
      const revenueExpense: RevenueExpenseDto = {
        revenue: 5000.0,
        expense: 3000.0,
        difference: 2000.0,
        period: 'Mês Atual',
      };
      
      const result = transformer.transformRevenueExpenseToChartData(revenueExpense);
      
      expect(result.labels).toEqual(['Receitas', 'Despesas']);
      expect(result.datasets).toHaveLength(1);
      expect(result.datasets[0].label).toBe('Valor');
      expect(result.datasets[0].data).toEqual([5000.0, 3000.0]);
      expect(result.datasets[0].backgroundColor).toEqual(['#4CAF50', '#F44336']);
      expect(result.datasets[0].borderColor).toEqual(['#388E3C', '#D32F2F']);
      expect(result.datasets[0].borderWidth).toBe(1);
    });

    it('should handle zero values', () => {
      
      const revenueExpense: RevenueExpenseDto = {
        revenue: 0.0,
        expense: 0.0,
        difference: 0.0,
        period: 'Mês Atual',
      };
      
      const result = transformer.transformRevenueExpenseToChartData(revenueExpense);
      
      expect(result.datasets[0].data).toEqual([0.0, 0.0]);
    });

    it('should handle negative expense values', () => {
      
      const revenueExpense: RevenueExpenseDto = {
        revenue: 5000.0,
        expense: -1000.0,
        difference: 6000.0,
        period: 'Mês Atual',
      };
      
      const result = transformer.transformRevenueExpenseToChartData(revenueExpense);
      
      expect(result.datasets[0].data).toEqual([5000.0, -1000.0]);
    });
  });
});
