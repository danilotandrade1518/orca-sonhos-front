import { PaginatedResponseDto } from '../../common';
import { BudgetResponseDto } from './budget-response.dto';

/**
 * DTO for budget list response
 */
export interface BudgetListResponseDto extends PaginatedResponseDto<BudgetResponseDto> {
  readonly _type: 'budget-list';
}

/**
 * DTO for budget summary response
 */
export interface BudgetSummaryResponseDto {
  totalBudgets: number;
  activeBudgets: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
}
