import { TransactionType } from '@models/shared/enums/transaction-type';

export interface CreateTransactionRequestDto {
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  budgetId: string;
  transactionDate?: string;
}
