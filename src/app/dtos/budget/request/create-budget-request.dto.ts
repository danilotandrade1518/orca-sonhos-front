import { BaseRequestDto } from '@dtos/common';
import { BudgetTypeEnum } from '../enums/budget-type.enum';

export interface CreateBudgetRequestDto extends BaseRequestDto {
  name: string;
  ownerId: string;
  participantIds?: string[];
  type?: BudgetTypeEnum;
}
