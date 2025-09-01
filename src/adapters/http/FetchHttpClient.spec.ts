import { FetchHttpClient } from './FetchHttpClient';
import { ENV } from '@app/env';

describe('FetchHttpClient (through MSW)', () => {
  it('adds Authorization header when token present', async () => {
    const client = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL, getAccessToken: () => 'tok' });
    const res = await client.get<{ auth: string | null }>('/test/echo-auth');
    expect(res.auth).toBe('Bearer tok');
  });

  it('throws on non-OK GET', async () => {
    const client = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    await expectAsync(client.get('/test/error')).toBeRejected();
  });

  it('POST returns undefined on 204, and json otherwise', async () => {
    const client = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const empty = await client.post('/test/no-content', {});
    expect(empty).toBeUndefined();

    const payload = { a: 1 };
    const echoed = await client.post<{ received: { a: number } }>(' /test/post-ok'.trim(), payload);
    expect(echoed.received).toEqual(payload);
  });

  it('handles 200 OK with empty body gracefully (undefined)', async () => {
    const http = new FetchHttpClient({ baseUrl: ENV.API_BASE_URL });
    const result = await http.post('/test/post-empty', {} as any);
    expect(result as any).toBeUndefined();
  });
});
