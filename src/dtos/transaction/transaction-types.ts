export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  type?: TransactionType;
  direction?: TransactionType;
  accountId?: string;
  categoryId?: string;
  budgetId?: string;
  transactionDate?: string;
  date?: string;
  creditCardId?: string;
}
