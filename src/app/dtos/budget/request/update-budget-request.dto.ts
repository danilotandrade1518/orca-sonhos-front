import { BaseRequestDto } from '@dtos/common';
import { BudgetTypeEnum } from '../enums/budget-type.enum';

export interface UpdateBudgetRequestDto extends BaseRequestDto {
  budgetId: string;
  userId: string;
  name?: string;
  participantIds?: string[];
  type?: BudgetTypeEnum;
}
