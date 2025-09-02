import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';
import { HttpTransactionQueriesPort } from './HttpTransactionQueriesPort';

describe('HttpTransactionQueriesPort (with MSW)', () => {
  it('listTransactions returns page structure', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpTransactionQueriesPort(http);
    const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174200');
    const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
    const res = await adapter.listTransactions({ userId, budgetId, page: 1, pageSize: 5 });
    expect(Array.isArray(res.items)).toBeTrue();
    expect(res.meta.page).toBe(1);
  });

  it('listTransactions includes optional filters (accountId, categoryId, dateFrom, dateTo)', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpTransactionQueriesPort(http);
    const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174200');
    const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174201');
    const accountId = Uuid.create('123e4567-e89b-12d3-a456-426614174202');
    const categoryId = Uuid.create('123e4567-e89b-12d3-a456-426614174203');
    const dateFrom = new Date('2025-01-01T00:00:00.000Z');
    const dateTo = new Date('2025-01-31T23:59:59.999Z');

    const res = await adapter.listTransactions({
      userId,
      budgetId,
      page: 2,
      pageSize: 10,
      accountId,
      categoryId,
      dateFrom,
      dateTo,
    });

    expect(Array.isArray(res.items)).toBeTrue();
    expect(res.meta.page).toBe(2);
  });
});
