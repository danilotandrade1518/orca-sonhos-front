import { PaginationQuery } from '../../types';

export interface ListBudgetsQueryDto extends PaginationQuery {
  ownerId: string;
  includeParticipant?: boolean;
  isActive?: boolean;
  nameFilter?: string;
}

export interface BudgetOverviewQueryDto {
  budgetId: string;
  requesterId: string;
}