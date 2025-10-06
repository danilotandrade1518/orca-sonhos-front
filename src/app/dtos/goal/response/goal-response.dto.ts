import { BaseResponseDto } from '@dtos/common';

/**
 * DTO for goal response
 */
export interface GoalResponseDto extends BaseResponseDto {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  targetDate: Date;
  categoryId: string;
  categoryName: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  progressPercentage: number;
  daysRemaining: number;
  isCompleted: boolean;
}
