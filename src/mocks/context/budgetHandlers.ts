import { http, HttpResponse, delay } from 'msw';

export const budgetHandlers = [
  http.get('/api/budget/list-budgets', async ({ request }) => {
    await delay(60);
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || '00000000-0000-0000-0000-000000000000';
    return HttpResponse.json([
      { id: 'bud-1', name: 'Home', type: 'personal', participantsCount: 1, userId },
      { id: 'bud-2', name: 'Family', type: 'shared', participantsCount: 3, userId },
    ]);
  }),
  http.get('/api/budget/budget-overview', async ({ request }) => {
    await delay(80);
    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') || 'bud-1';
    return HttpResponse.json({
      id: budgetId,
      name: 'Home',
      type: 'personal',
      participants: [{ id: 'u-1' }],
      accounts: [
        { id: 'acc-1', name: 'Checking', type: 'checking', balance: 123450 },
        { id: 'acc-2', name: 'Savings', type: 'savings', balance: 987650 },
      ],
      totals: {
        accountsBalance: 123450 + 987650,
        monthIncome: 500000,
        monthExpense: 350000,
        netMonth: 150000,
      },
    });
  }),
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
