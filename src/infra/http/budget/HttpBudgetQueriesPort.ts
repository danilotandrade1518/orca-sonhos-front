import {
  BudgetListItem,
  BudgetOverviewQuery,
  BudgetOverviewResult,
  IBudgetQueriesPort,
  ListBudgetsQuery,
} from '@application/ports/budget/IBudgetQueriesPort';
import { HttpClient } from '../HttpClient';

export class HttpBudgetQueriesPort implements IBudgetQueriesPort {
  constructor(private readonly http: HttpClient) {}

  async listBudgets(q: ListBudgetsQuery): Promise<BudgetListItem[]> {
    const params = new URLSearchParams({ userId: q.userId.toString() });
    return this.http.get<BudgetListItem[]>(`/budget/list-budgets?${params}`);
  }

  async getBudgetOverview(q: BudgetOverviewQuery): Promise<BudgetOverviewResult> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    return this.http.get<BudgetOverviewResult>(`/budget/budget-overview?${params}`);
  }
}
