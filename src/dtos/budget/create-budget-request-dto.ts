import { BudgetType } from './budget-types';

export interface CreateBudgetRequestDto {
  name: string;
  ownerId: string;
  type: BudgetType;
}
