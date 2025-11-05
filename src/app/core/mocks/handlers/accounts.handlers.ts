import { http, HttpResponse } from 'msw';

const mockAccounts = [
  {
    id: 'account-1',
    name: 'Conta Corrente Principal',
    type: 'CHECKING_ACCOUNT',
    balance: 3000.0,
  },
  {
    id: 'account-2',
    name: 'Poupança',
    type: 'SAVINGS_ACCOUNT',
    balance: 2000.0,
  },
  {
    id: 'account-3',
    name: 'Carteira Física',
    type: 'PHYSICAL_WALLET',
    balance: 500.0,
  },
  {
    id: 'account-4',
    name: 'Pix',
    type: 'DIGITAL_WALLET',
    balance: 1000.0,
  },
  {
    id: 'account-5',
    name: 'Investimentos',
    type: 'INVESTMENT_ACCOUNT',
    balance: 5000.0,
  },
];

export const accountHandlers = [
  http.get('/api/accounts', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId');

    if (!budgetId) {
      return HttpResponse.json({ error: 'budgetId is required' }, { status: 400 });
    }

    return HttpResponse.json({
      data: mockAccounts,
      meta: {
        count: mockAccounts.length,
      },
    });
  }),

  http.post('/api/accounts/create-account', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.name || !body.type || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAccount = {
      id: 'account-' + Date.now(),
      name: body.name,
      type: body.type,
      balance: body.initialBalance || 0,
    };

    return HttpResponse.json({ id: newAccount.id }, { status: 201 });
  }),

  http.post('/api/accounts/update-account', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id || !body.userId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/accounts/delete-account', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.accountId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/accounts/reconcile-account', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.budgetId || !body.accountId || body.realBalance === undefined) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/accounts/transfer-between-accounts', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.fromAccountId || !body.toAccountId || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
