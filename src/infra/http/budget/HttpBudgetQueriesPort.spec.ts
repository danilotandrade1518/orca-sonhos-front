import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';
import { HttpBudgetQueriesPort } from './HttpBudgetQueriesPort';

describe('HttpBudgetQueriesPort (with MSW)', () => {
  it('listBudgets returns items for user', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpBudgetQueriesPort(http);
    const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174200');
    const items = await adapter.listBudgets({ userId });
    expect(items.length).toBeGreaterThan(0);
  });

  it('getBudgetOverview returns overview object', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpBudgetQueriesPort(http);
    const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174200');
    const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
    const ov = await adapter.getBudgetOverview({ userId, budgetId });
    expect(ov.id).toBe(budgetId.toString());
    expect(ov.accounts.length).toBeGreaterThan(0);
  });
});
