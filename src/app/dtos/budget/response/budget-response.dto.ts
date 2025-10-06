import { BaseResponseDto } from '@dtos/common';

/**
 * DTO for budget response
 */
export interface BudgetResponseDto extends BaseResponseDto {
  name: string;
  description?: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  startDate: Date;
  endDate: Date;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  progressPercentage: number;
}
