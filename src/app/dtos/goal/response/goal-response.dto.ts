import { BaseResponseDto } from '@dtos/common';

export interface GoalResponseDto extends BaseResponseDto {
  budgetId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  targetDate: Date;
  categoryId: string;
  categoryName: string;
  priority: 'low' | 'medium' | 'high';
  progressPercentage: number;
  daysRemaining: number;
  isCompleted: boolean;
}
