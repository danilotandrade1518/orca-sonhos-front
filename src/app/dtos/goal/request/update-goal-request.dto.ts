import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for updating an existing goal
 */
export interface UpdateGoalRequestDto extends BaseRequestDto {
  title?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
  categoryId?: string;
  priority?: 'low' | 'medium' | 'high';
  isActive?: boolean;
}
