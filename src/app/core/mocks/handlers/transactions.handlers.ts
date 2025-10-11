import { http, HttpResponse } from 'msw';

const mockTransactions = [
  {
    id: 'transaction-1',
    date: '2025-01-10T10:30:00Z',
    description: 'Salário',
    amount: 3000.0,
    direction: 'INCOME',
    accountId: 'account-1',
    categoryId: 'category-salary',
  },
  {
    id: 'transaction-2',
    date: '2025-01-09T14:20:00Z',
    description: 'Supermercado',
    amount: 150.0,
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-groceries',
  },
  {
    id: 'transaction-3',
    date: '2025-01-08T09:15:00Z',
    description: 'Transferência para poupança',
    amount: 500.0,
    direction: 'TRANSFER',
    accountId: 'account-1',
    categoryId: 'category-transfer',
  },
  {
    id: 'transaction-4',
    date: '2025-01-07T16:45:00Z',
    description: 'Conta de luz',
    amount: 80.0,
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-utilities',
  },
  {
    id: 'transaction-5',
    date: '2025-01-06T11:30:00Z',
    description: 'Freelance',
    amount: 800.0,
    direction: 'INCOME',
    accountId: 'account-4',
    categoryId: 'category-freelance',
  },
];

export const transactionHandlers = [
  http.get('/transactions', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId');
    const accountId = url.searchParams.get('accountId');
    const categoryId = url.searchParams.get('categoryId');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '20'), 100);

    if (!budgetId) {
      return HttpResponse.json({ error: 'budgetId is required' }, { status: 400 });
    }

    let filteredTransactions = [...mockTransactions];

    if (accountId) {
      filteredTransactions = filteredTransactions.filter((t) => t.accountId === accountId);
    }

    if (categoryId) {
      filteredTransactions = filteredTransactions.filter((t) => t.categoryId === categoryId);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.date) <= toDate);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedTransactions,
      meta: {
        page,
        pageSize,
        hasNext: endIndex < filteredTransactions.length,
      },
    });
  }),

  http.post('/transaction/create-transaction', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (
      !body.userId ||
      !body.description ||
      !body.amount ||
      !body.type ||
      !body.accountId ||
      !body.categoryId ||
      !body.budgetId
    ) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const newTransaction = {
      id: 'transaction-' + Date.now(),
      description: body.description,
      amount: body.amount,
      type: body.type,
      accountId: body.accountId,
      categoryId: body.categoryId,
      budgetId: body.budgetId,
      transactionDate: body.transactionDate || new Date().toISOString(),
    };

    return HttpResponse.json({ id: newTransaction.id }, { status: 201 });
  }),

  http.post('/transaction/update-transaction', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.id) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount !== undefined && body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/transaction/delete-transaction', async ({ request }) => {
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

  http.post('/transaction/cancel-scheduled-transaction', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.userId || !body.budgetId || !body.transactionId || !body.cancellationReason) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/transaction/mark-transaction-late', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.transactionId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
