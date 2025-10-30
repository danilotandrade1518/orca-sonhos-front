export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  type?: TransactionType; // alguns mocks usam "direction"
  direction?: TransactionType; // compatível com MSW existente
  accountId?: string;
  categoryId?: string;
  budgetId?: string;
  transactionDate?: string; // alguns mocks usam "date"
  date?: string; // compatível com MSW existente
}
