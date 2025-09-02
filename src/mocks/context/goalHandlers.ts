import { delay, http, HttpResponse } from 'msw';

export const goalHandlers = [
  http.get('/api/goal/list-goals', async ({ request }) => {
    await delay(60);
    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') || '00000000-0000-0000-0000-000000000000';
    return HttpResponse.json([
      {
        id: 'goal-1',
        name: 'Emergency Fund',
        targetAmount: 1000000,
        currentAmount: 250000,
        percentAchieved: 0.25,
        dueDate: null,
        budgetId,
      },
    ]);
  }),
  http.post('/api/goal/create-goal', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/goal/update-goal', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/goal/delete-goal', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/goal/add-amount-to-goal', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
