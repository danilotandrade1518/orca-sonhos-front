import type { TransactionType } from './transaction-types';

export interface CreateTransactionRequestDto {
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  budgetId: string;
  transactionDate?: string;
  creditCardId?: string;
}

export interface CreateTransactionResponseDto {
  id: string;
}
