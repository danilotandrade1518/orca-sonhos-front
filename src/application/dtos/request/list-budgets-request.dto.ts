import { PaginationQuery } from '../../types';

/**
 * DTO for listing budgets with pagination
 */
export interface ListBudgetsRequestDto extends PaginationQuery {
  ownerId?: string;
  isActive?: boolean;
}