import { PaginatedResponseDto } from '../../common';
import { BudgetResponseDto } from './budget-response.dto';

export interface BudgetListResponseDto extends PaginatedResponseDto<BudgetResponseDto> {
  readonly _type: 'budget-list';
}

export interface BudgetSummaryResponseDto {
  totalBudgets: number;
  activeBudgets: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
}
