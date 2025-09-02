import { delay, http, HttpResponse } from 'msw';

export const accountHandlers = [
  // Queries
  http.get('/api/account/list-accounts', async ({ request }) => {
    await delay(60);
    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') || '00000000-0000-0000-0000-000000000000';
    return HttpResponse.json([
      { id: 'acc-1', name: 'Checking', type: 'checking', balance: 123450, budgetId },
      { id: 'acc-2', name: 'Savings', type: 'savings', balance: 987650, budgetId },
    ]);
  }),
  http.post('/api/account/create-account', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/update-account', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/delete-account', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/reconcile-account', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/transfer-between-accounts', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
