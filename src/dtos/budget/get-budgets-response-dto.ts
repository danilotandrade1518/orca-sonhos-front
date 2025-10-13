import { BudgetDto } from './budget-types';

export interface GetBudgetsResponseDto {
  data: BudgetDto[];
  meta: {
    count: number;
  };
}
