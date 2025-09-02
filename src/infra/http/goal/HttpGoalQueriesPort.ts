import {
  IGoalQueriesPort,
  ListGoalsQuery,
  GoalListItem,
} from '@application/ports/goal/IGoalQueriesPort';
import { HttpClient } from '../HttpClient';

export class HttpGoalQueriesPort implements IGoalQueriesPort {
  constructor(private readonly http: HttpClient) {}

  async listGoals(q: ListGoalsQuery): Promise<GoalListItem[]> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    return this.http.get<GoalListItem[]>(`/goal/list-goals?${params}`);
  }
}
