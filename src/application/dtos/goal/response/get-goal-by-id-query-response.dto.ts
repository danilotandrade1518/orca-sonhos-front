import { MoneyDto } from '../../shared/money.dto';

export interface GetGoalByIdQueryResponseDto {
  goal: GoalDetailDto;
}

export interface GoalDetailDto {
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
  daysUntilTarget?: number;
  monthlyTargetAmount?: MoneyDto;
}
