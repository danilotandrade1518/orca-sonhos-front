import type { CategorySpendingDto } from './category-spending.dto';
import type { RevenueExpenseDto } from './revenue-expense.dto';

export interface ReportResponseDto {
  period: string;
  startDate: string;
  endDate: string;
  categorySpending: CategorySpendingDto[];
  revenueExpense: RevenueExpenseDto;
  totalTransactions: number;
}
