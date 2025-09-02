import { delay, http, HttpResponse } from 'msw';

export const categoryHandlers = [
  http.get('/api/category/list-categories', async ({ request }) => {
    await delay(50);
    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') || '00000000-0000-0000-0000-000000000000';
    return HttpResponse.json([
      { id: 'cat-1', name: 'Groceries', type: 'expense', budgetId },
      { id: 'cat-2', name: 'Salary', type: 'income', budgetId },
    ]);
  }),
  http.post('/api/category/create-category', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/category/update-category', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/category/delete-category', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
];
