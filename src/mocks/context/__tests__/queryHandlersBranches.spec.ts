import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';

describe('MSW Query Handlers Branches', () => {
  it('budgetHandlers: list-budgets falls back to default userId when missing', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const res = await http.get<any[]>('/budget/list-budgets');
    expect(res[0].userId).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('budgetHandlers: budget-overview falls back to default budgetId when missing', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const res = await http.get<any>('/budget/budget-overview');
    expect(res.id).toBe('bud-1');
  });

  it('accountHandlers: list-accounts branch with missing params still returns list', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const res = await http.get<any[]>('/account/list-accounts');
    expect(Array.isArray(res)).toBeTrue();
  });

  it('categoryHandlers: list-categories branch with missing params still returns list', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const res = await http.get<any[]>('/category/list-categories');
    expect(Array.isArray(res)).toBeTrue();
  });

  it('goalHandlers: list-goals branch with missing params still returns list', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const res = await http.get<any[]>('/goal/list-goals');
    expect(Array.isArray(res)).toBeTrue();
  });
});
