import { Uuid } from '@models/shared/value-objects/Uuid';

export interface ListAccountsQuery {
  userId: Uuid;
  budgetId: Uuid;
}

export interface AccountListItem {
  id: string;
  name: string;
  type: string;
  balance: number; // in cents
}

export interface IAccountQueriesPort {
  listAccounts(q: ListAccountsQuery): Promise<AccountListItem[]>;
}
