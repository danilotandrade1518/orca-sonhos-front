import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for creating a new goal
 */
export interface CreateGoalRequestDto extends BaseRequestDto {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  categoryId: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}
