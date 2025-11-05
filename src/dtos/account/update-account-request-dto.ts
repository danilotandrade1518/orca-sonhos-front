import type { AccountType } from './account-types';

export interface UpdateAccountRequestDto {
  id: string;
  userId: string;
  name?: string;
  type?: AccountType;
  initialBalance?: number;
}

export interface UpdateAccountResponseDto {
  success: boolean;
}

