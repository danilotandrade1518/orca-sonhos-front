import {
  AccountListItem,
  IAccountQueriesPort,
  ListAccountsQuery,
} from '@application/ports/account/IAccountQueriesPort';
import { HttpClient } from '../HttpClient';

export class HttpAccountQueriesPort implements IAccountQueriesPort {
  constructor(private readonly http: HttpClient) {}

  async listAccounts(q: ListAccountsQuery): Promise<AccountListItem[]> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    return this.http.get<AccountListItem[]>(`/account/list-accounts?${params}`);
  }
}
