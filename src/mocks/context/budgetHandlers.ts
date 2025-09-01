import { http, HttpResponse, delay } from 'msw';

export const budgetHandlers = [
  http.post('/api/budget/create-budget', async () => {
    await delay(100);
    return HttpResponse.json({ ok: true }, { status: 201 });
  }),
  http.post('/api/budget/update-budget', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/budget/delete-budget', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/budget/add-participant', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/budget/remove-participant', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
];
