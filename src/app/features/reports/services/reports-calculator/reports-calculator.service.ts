import { Injectable } from '@angular/core';
import type { TransactionDto, TransactionType } from '../../../../../dtos/transaction';
import type { CategorySpendingDto } from '../../../../../dtos/report/category-spending.dto';
import type { RevenueExpenseDto } from '../../../../../dtos/report/revenue-expense.dto';

export type CategoryMap = Record<
  string,
  {
    name: string;
    type: TransactionType;
  }
>;

@Injectable({ providedIn: 'root' })
export class ReportsCalculatorService {
  calculateCategorySpending(
    transactions: TransactionDto[],
    categoryMap?: CategoryMap
  ): CategorySpendingDto[] {
    const expenseTransactions = transactions.filter(
      (t) => t.type === 'EXPENSE' && t.categoryId && t.amount > 0
    );

    if (expenseTransactions.length === 0) {
      return [];
    }

    const categoryTotals = new Map<string, { amount: number; count: number; name: string }>();

    expenseTransactions.forEach((transaction) => {
      const categoryId = transaction.categoryId!;
      const categoryName =
        categoryMap?.[categoryId]?.name || `Categoria ${categoryId.substring(0, 8)}`;

      const existing = categoryTotals.get(categoryId) || {
        amount: 0,
        count: 0,
        name: categoryName,
      };

      categoryTotals.set(categoryId, {
        amount: existing.amount + Math.abs(transaction.amount),
        count: existing.count + 1,
        name: categoryName,
      });
    });

    const totalAmount = Array.from(categoryTotals.values()).reduce(
      (sum, cat) => sum + cat.amount,
      0
    );

    const categorySpending: CategorySpendingDto[] = Array.from(categoryTotals.entries()).map(
      ([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        totalAmount: data.amount,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
        transactionCount: data.count,
      })
    );

    return categorySpending.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  calculateRevenueExpense(transactions: TransactionDto[]): RevenueExpenseDto {
    let revenue = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      const amount = Math.abs(transaction.amount);

      if (transaction.type === 'INCOME') {
        revenue += amount;
      } else if (transaction.type === 'EXPENSE') {
        expense += amount;
      }
    });

    const difference = revenue - expense;

    return {
      revenue,
      expense,
      difference,
      period: '',
    };
  }

  calculateTotals(transactions: TransactionDto[]): {
    totalRevenue: number;
    totalExpense: number;
    totalDifference: number;
    totalTransactions: number;
  } {
    const revenueExpense = this.calculateRevenueExpense(transactions);

    return {
      totalRevenue: revenueExpense.revenue,
      totalExpense: revenueExpense.expense,
      totalDifference: revenueExpense.difference,
      totalTransactions: transactions.length,
    };
  }
}
