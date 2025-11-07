import { inject, Injectable } from '@angular/core';

import type { CategorySpendingDto } from '../../../dtos/report/category-spending.dto';
import type { RevenueExpenseDto } from '../../../dtos/report/revenue-expense.dto';
import type { ChartData } from '../interfaces/chart-data.interface';

@Injectable({
  providedIn: 'root',
})
export class ChartDataTransformer {
  transformCategorySpendingToChartData(
    categorySpending: CategorySpendingDto[]
  ): ChartData {
    const labels = categorySpending.map((item) => item.categoryName);
    const data = categorySpending.map((item) => item.totalAmount);

    const colors = this.generateColors(categorySpending.length);

    return {
      labels,
      datasets: [
        {
          label: 'Gastos por Categoria',
          data,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ],
    };
  }

  transformRevenueExpenseToChartData(
    revenueExpense: RevenueExpenseDto
  ): ChartData {
    return {
      labels: ['Receitas', 'Despesas'],
      datasets: [
        {
          label: 'Valor',
          data: [revenueExpense.revenue, revenueExpense.expense],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderColor: ['#388E3C', '#D32F2F'],
          borderWidth: 1,
        },
      ],
    };
  }

  private generateColors(count: number): {
    background: string[];
    border: string[];
  } {
    const colorPalette = [
      { bg: '#2196F3', border: '#1976D2' },
      { bg: '#FF9800', border: '#F57C00' },
      { bg: '#9C27B0', border: '#7B1FA2' },
      { bg: '#00BCD4', border: '#0097A7' },
      { bg: '#4CAF50', border: '#388E3C' },
      { bg: '#F44336', border: '#D32F2F' },
      { bg: '#FFC107', border: '#FFA000' },
      { bg: '#795548', border: '#5D4037' },
      { bg: '#607D8B', border: '#455A64' },
      { bg: '#E91E63', border: '#C2185B' },
    ];

    const background: string[] = [];
    const border: string[] = [];

    for (let i = 0; i < count; i++) {
      const color = colorPalette[i % colorPalette.length];
      background.push(color.bg);
      border.push(color.border);
    }

    return { background, border };
  }
}

