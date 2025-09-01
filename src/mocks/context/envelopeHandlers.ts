import { http, HttpResponse, delay } from 'msw';

// Simple in-memory store to simulate state for envelope context
const state = {
  envelopes: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      budgetId: '00000000-0000-0000-0000-000000000000',
      categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Groceries',
      monthlyLimit: 50000,
      balance: 12500,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      budgetId: '00000000-0000-0000-0000-000000000000',
      categoryId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'Transport',
      monthlyLimit: 20000,
      balance: 5000,
    },
  ],
};

export const envelopeHandlers = [
  // GET /envelope/list?userId=...&budgetId=...
  http.get('/api/envelope/list', async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') ?? '00000000-0000-0000-0000-000000000000';
    await delay(150);
    return HttpResponse.json(
      state.envelopes.map((e) => ({ ...e, budgetId }))
    );
  }),

  // Command-style endpoints (no-op, simulate success)
  http.post('/api/envelope/create-envelope', async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/envelope/update-envelope', async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/envelope/delete-envelope', async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/envelope/add-amount-envelope', async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/envelope/remove-amount-envelope', async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/envelope/transfer-between-envelopes', async () => {
    await delay(150);
    return HttpResponse.json({ ok: true });
  }),
];
