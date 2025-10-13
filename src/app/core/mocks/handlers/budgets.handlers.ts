import { http, HttpResponse } from 'msw';

const mockBudgets = [
  {
    id: 'budget-1',
    name: 'Orçamento Pessoal',
    type: 'PERSONAL',
    participantsCount: 1,
  },
  {
    id: 'budget-2',
    name: 'Orçamento Familiar',
    type: 'SHARED',
    participantsCount: 3,
  },
];

const mockBudgetOverview = {
  id: 'budget-1',
  name: 'Orçamento Pessoal',
  type: 'PERSONAL',
  participants: [{ id: 'user-123', name: 'Usuário Teste', email: 'user@example.com' }],
  totals: {
    accountsBalance: 5000.0,
    monthIncome: 3000.0,
    monthExpense: 2500.0,
    netMonth: 500.0,
  },
  accounts: [
    {
      id: 'account-1',
      name: 'Conta Corrente',
      type: 'CHECKING_ACCOUNT',
      balance: 3000.0,
    },
    {
      id: 'account-2',
      name: 'Poupança',
      type: 'SAVINGS_ACCOUNT',
      balance: 2000.0,
    },
  ],
};

export const budgetHandlers = [
  http.get('/api/budget', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      data: mockBudgets,
      meta: {
        count: mockBudgets.length,
      },
    });
  }),

  http.get('/api/budget/:budgetId/overview', ({ request, params }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { budgetId } = params;

    if (budgetId === 'budget-1') {
      return HttpResponse.json({
        data: mockBudgetOverview,
      });
    }

    return HttpResponse.json({ error: 'Budget not found' }, { status: 404 });
  }),

  http.post('/api/budget/create-budget', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.name || !body.ownerId || !body.type) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBudget = {
      id: 'budget-' + Date.now(),
      name: body.name,
      type: body.type,
      participantsCount: 1,
    };

    return HttpResponse.json({ id: newBudget.id }, { status: 201 });
  }),

  http.post('/api/budget/update-budget', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.budgetId || !body.name) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/budget/delete-budget', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/budget/add-participant', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.budgetId || !body.participantId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/budget/remove-participant', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.budgetId || !body.participantId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
