import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import { ENV } from '@app/env';
import { Uuid } from '@models/shared/value-objects/Uuid';

import { HttpEnvelopeQueriesPort } from './HttpEnvelopeQueriesPort';

describe('HttpEnvelopeQueriesPort (with MSW)', () => {
  it('builds the correct URL with query params and returns mocked data', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const adapter = new HttpEnvelopeQueriesPort(http);

    const userId = Uuid.create('123e4567-e89b-12d3-a456-426614174000');
    const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174001');

    const result = await adapter.listEnvelopes({ userId, budgetId });

    expect(Array.isArray(result)).toBeTrue();
    expect(result.length).toBeGreaterThan(0);
    // All returned items should match the requested budgetId per our handler behavior
    expect(result.every((e) => e.budgetId === budgetId.toString())).toBeTrue();
  });

  it('uses default budgetId in handler when query param omitted', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    // Call raw GET to omit budgetId and userId intentionally
    const res = await http.get<any[]>('/envelope/list');
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((e) => e.budgetId === '00000000-0000-0000-0000-000000000000')).toBeTrue();
  });
});
