import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for updating an existing budget
 */
export interface UpdateBudgetRequestDto extends BaseRequestDto {
  name?: string;
  description?: string;
  totalAmount?: number;
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  isActive?: boolean;
}
