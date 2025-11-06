import type { AccountType } from './account-types';

export interface CreateAccountRequestDto {
  userId: string;
  name: string;
  type: AccountType;
  budgetId: string;
  initialBalance?: number;
}

export interface CreateAccountResponseDto {
  id: string;
}
