import { delay, http, HttpResponse } from 'msw';

export const transactionHandlers = [
  http.get('/api/transaction/list-transactions', async ({ request }) => {
    await delay(70);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '20');
    const items = Array.from({ length: Math.min(pageSize, 3) }).map((_, i) => ({
      id: `tx-${page}-${i + 1}`,
      date: new Date().toISOString(),
      description: `Item ${i + 1}`,
      amount: (i + 1) * 1000,
      direction: i % 2 === 0 ? 'out' : 'in',
      accountId: 'acc-1',
      categoryId: 'cat-1',
    }));
    return HttpResponse.json({ items, meta: { page, pageSize, hasNext: false } });
  }),
  http.post('/api/transaction/create-transaction', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/update-transaction', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/delete-transaction', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/mark-transaction-late', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/cancel-scheduled-transaction', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
