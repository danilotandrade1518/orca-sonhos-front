import { http, HttpResponse } from 'msw';

const mockGoals = [
  {
    id: 'goal-1',
    name: 'Viagem para Europa',
    totalAmount: 15000.0,
    accumulatedAmount: 5000.0,
    deadline: '2025-12-31T23:59:59Z',
    budgetId: 'budget-1',
  },
  {
    id: 'goal-large',
    name: 'Meta com valor grande',
    totalAmount: 1500000.0,
    accumulatedAmount: 999999.99,
    deadline: '2026-12-31T23:59:59Z',
    budgetId: 'budget-1',
  },
  {
    id: 'goal-2',
    name: 'Reserva de emergência',
    totalAmount: 10000.0,
    accumulatedAmount: 7500.0,
    deadline: '2025-06-30T23:59:59Z',
    budgetId: 'budget-1',
  },
  {
    id: 'goal-3',
    name: 'Novo notebook',
    totalAmount: 3000.0,
    accumulatedAmount: 1200.0,
    deadline: '2025-03-31T23:59:59Z',
    budgetId: 'budget-1',
  },
  {
    id: 'goal-4',
    name: 'Casa própria',
    totalAmount: 200000.0,
    accumulatedAmount: 25000.0,
    deadline: '2027-12-31T23:59:59Z',
    budgetId: 'budget-2',
  },
];

export const goalHandlers = [
  http.get('/api/goals', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId');

    if (!budgetId) {
      return HttpResponse.json({ error: 'budgetId is required' }, { status: 400 });
    }

    const filteredGoals = mockGoals.filter((goal) => goal.budgetId === budgetId);

    return HttpResponse.json({
      data: filteredGoals,
      meta: {
        count: filteredGoals.length,
      },
    });
  }),

  http.post('/api/goals/create-goal', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.name || !body.totalAmount || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.totalAmount <= 0) {
      return HttpResponse.json({ error: 'Total amount must be positive' }, { status: 400 });
    }

    const newGoal = {
      id: 'goal-' + Date.now(),
      name: body.name,
      totalAmount: body.totalAmount,
      accumulatedAmount: body.accumulatedAmount || 0,
      deadline: body.deadline,
      budgetId: body.budgetId,
    };

    return HttpResponse.json({ id: newGoal.id }, { status: 201 });
  }),

  http.post('/api/goals/update-goal', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id || !body.name || !body.totalAmount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.totalAmount <= 0) {
      return HttpResponse.json({ error: 'Total amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/goals/delete-goal', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/goals/add-amount-goal', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/goals/remove-amount-goal', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
