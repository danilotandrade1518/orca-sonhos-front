import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.get('/api/me', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ anonymous: true }, { status: 200 });
    }

    const token = authHeader.replace('Bearer ', '');

    if (token === 'valid-token') {
      return HttpResponse.json({
        userId: 'user-123',
        email: 'user@example.com',
        name: 'Usuário Teste',
      });
    }

    return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
  }),

  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      traceId: 'trace-' + Date.now(),
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/ready', () => {
    return HttpResponse.json({
      status: 'ready',
      traceId: 'trace-' + Date.now(),
      timestamp: new Date().toISOString(),
    });
  }),
];
