import { BaseRequestDto } from '@dtos/common';

export interface DeleteBudgetRequestDto extends BaseRequestDto {
  userId: string;
  budgetId: string;
}
