import {
  ITransactionQueriesPort,
  ListTransactionsQuery,
  ListTransactionsResult,
} from '@application/ports/transaction/ITransactionQueriesPort';
import { HttpClient } from '../HttpClient';

export class HttpTransactionQueriesPort implements ITransactionQueriesPort {
  constructor(private readonly http: HttpClient) {}

  async listTransactions(q: ListTransactionsQuery): Promise<ListTransactionsResult> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    if (q.page) params.set('page', String(q.page));
    if (q.pageSize) params.set('pageSize', String(q.pageSize));
    if (q.accountId) params.set('accountId', q.accountId.toString());
    if (q.categoryId) params.set('categoryId', q.categoryId.toString());
    if (q.dateFrom) params.set('dateFrom', q.dateFrom.toISOString());
    if (q.dateTo) params.set('dateTo', q.dateTo.toISOString());

    return this.http.get<ListTransactionsResult>(`/transaction/list-transactions?${params}`);
  }
}
