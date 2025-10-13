import { BudgetType } from './budget-types';

export interface UpdateBudgetRequestDto {
  id: string;
  name?: string;
  type?: BudgetType;
}
