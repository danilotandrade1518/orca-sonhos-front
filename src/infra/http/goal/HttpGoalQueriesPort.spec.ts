import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';
import { HttpGoalQueriesPort } from './HttpGoalQueriesPort';

describe('HttpGoalQueriesPort (with MSW)', () => {
  it('listGoals returns goals for budget', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpGoalQueriesPort(http);
    const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174200');
    const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
    const items = await adapter.listGoals({ userId, budgetId });
    expect(items.length).toBeGreaterThan(0);
  });
});
