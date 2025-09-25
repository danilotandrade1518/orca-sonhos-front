import { PaginatedResponse } from '../../types';
import { BudgetResponseDto } from './budget-response.dto';

export interface BudgetListItemDto {
  id: string;
  name: string;
  limit: {
    valueInCents: number;
    formatted: string;
  };
  participantCount: number;
  isActive: boolean;
  createdAt: string;
  isOwner: boolean;
}

export interface BudgetListResponseDto extends PaginatedResponse<BudgetListItemDto> {
  summary: {
    totalBudgets: number;
    activeBudgets: number;
    ownedBudgets: number;
    sharedBudgets: number;
  };
}