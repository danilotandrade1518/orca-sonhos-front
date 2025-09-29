import { TransactionType } from '@models/shared/enums/transaction-type';

export interface UpdateTransactionRequestDto {
  userId: string;
  id: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  transactionDate?: string;
}
