import type { TransactionType } from './transaction-types';

export interface UpdateTransactionRequestDto {
  userId: string;
  id: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  budgetId?: string;
  transactionDate?: string;
}

export interface UpdateTransactionResponseDto {
  success: boolean;
}
