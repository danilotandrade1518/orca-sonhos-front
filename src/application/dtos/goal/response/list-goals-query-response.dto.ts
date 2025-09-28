import { MoneyDto } from '../../shared/money.dto';

export interface ListGoalsQueryResponseDto {
  goals: GoalSummaryDto[];
}

export interface GoalSummaryDto {
  id: string;
  name: string;
  targetAmount: MoneyDto;
  currentAmount: MoneyDto;
  budgetId: string;
  targetDate?: string;
  description: string;
  status: string;
  createdAt: string;
  remainingAmount: MoneyDto;
  progressPercentage: number;
  isCompleted: boolean;
  isOverdue: boolean;
}
