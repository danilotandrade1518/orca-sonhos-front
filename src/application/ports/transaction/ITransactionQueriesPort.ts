import { Uuid } from '@models/shared/value-objects/Uuid';

export interface ListTransactionsQuery {
  userId: Uuid;
  budgetId: Uuid;
  page?: number;
  pageSize?: number;
  accountId?: Uuid;
  categoryId?: Uuid;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface TransactionListItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  direction: 'in' | 'out';
  accountId: string;
  categoryId: string;
}

export interface ListTransactionsResult {
  items: TransactionListItem[];
  meta: { page: number; pageSize: number; hasNext: boolean };
}

export interface ITransactionQueriesPort {
  listTransactions(q: ListTransactionsQuery): Promise<ListTransactionsResult>;
}
