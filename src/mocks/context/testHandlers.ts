import { http, HttpResponse } from 'msw';

export const testHandlers = [
  http.get('/api/test/ok', () => HttpResponse.json({ ok: true })),
  http.get('/api/test/error', () => new HttpResponse(null, { status: 500 })),
  http.get('/api/test/echo-auth', ({ request }) => {
    const auth = request.headers.get('authorization');
    return HttpResponse.json({ auth });
  }),
  http.post('/api/test/no-content', () => new HttpResponse(null, { status: 204 })),
  // 200 OK with empty body to exercise FetchHttpClient JSON parse catch path
  http.post('/api/test/post-empty', () => new HttpResponse(null, { status: 200 })),
  http.post('/api/test/post-ok', async ({ request }) => {
    const body = await request.text();
    return HttpResponse.json({ received: body ? JSON.parse(body) : null });
  }),
];
