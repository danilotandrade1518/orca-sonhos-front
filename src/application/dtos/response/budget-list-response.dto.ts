import { PaginationMeta } from '../../types';
import { BudgetResponseDto } from './budget-response.dto';

/**
 * DTO for budget list response with pagination
 */
export interface BudgetListResponseDto {
  data: BudgetResponseDto[];
  pagination: PaginationMeta;
}