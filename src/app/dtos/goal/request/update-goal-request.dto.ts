import { BaseRequestDto } from '@dtos/common';

export interface UpdateGoalRequestDto extends BaseRequestDto {
  userId: string;
  goalId: string;
  budgetId?: string;
  title?: string;
  description?: string;
  targetAmount?: number;
  targetDate?: Date;
  categoryId?: string;
  priority?: 'low' | 'medium' | 'high';
}
