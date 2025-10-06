import { BaseRequestDto } from '@dtos/common';

export interface CreateGoalRequestDto extends BaseRequestDto {
  userId: string;
  budgetId: string;
  title: string;
  description?: string;
  targetAmount: number;
  targetDate: Date;
  categoryId: string;
  priority: 'low' | 'medium' | 'high';
}
