import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for creating a new budget
 */
export interface CreateBudgetRequestDto extends BaseRequestDto {
  name: string;
  description?: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  categoryId: string;
  isActive: boolean;
}
