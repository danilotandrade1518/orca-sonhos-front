import { http, HttpResponse } from 'msw';

// Função auxiliar para gerar data no mês atual
const getCurrentMonthDate = (day: number, hour: number = 12): string => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), day, hour, 0, 0);
  return date.toISOString();
};

const mockTransactions = [
  {
    id: 'transaction-1',
    date: getCurrentMonthDate(5),
    transactionDate: getCurrentMonthDate(5),
    description: 'Salário',
    amount: 5000.0,
    type: 'INCOME',
    direction: 'INCOME',
    accountId: 'account-1',
    categoryId: 'category-salary',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-2',
    date: getCurrentMonthDate(8),
    transactionDate: getCurrentMonthDate(8),
    description: 'Supermercado',
    amount: 450.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-groceries',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-3',
    date: getCurrentMonthDate(10),
    transactionDate: getCurrentMonthDate(10),
    description: 'Conta de luz',
    amount: 120.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-utilities',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-4',
    date: getCurrentMonthDate(12),
    transactionDate: getCurrentMonthDate(12),
    description: 'Freelance',
    amount: 1500.0,
    type: 'INCOME',
    direction: 'INCOME',
    accountId: 'account-1',
    categoryId: 'category-freelance',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-5',
    date: getCurrentMonthDate(15),
    transactionDate: getCurrentMonthDate(15),
    description: 'Restaurante',
    amount: 85.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-food',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-6',
    date: getCurrentMonthDate(18),
    transactionDate: getCurrentMonthDate(18),
    description: 'Transporte',
    amount: 200.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-transport',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-7',
    date: getCurrentMonthDate(20),
    transactionDate: getCurrentMonthDate(20),
    description: 'Lazer',
    amount: 300.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-entertainment',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-8',
    date: getCurrentMonthDate(22),
    transactionDate: getCurrentMonthDate(22),
    description: 'Conta de água',
    amount: 65.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-utilities',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-9',
    date: getCurrentMonthDate(25),
    transactionDate: getCurrentMonthDate(25),
    description: 'Venda de produto',
    amount: 800.0,
    type: 'INCOME',
    direction: 'INCOME',
    accountId: 'account-1',
    categoryId: 'category-sales',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-10',
    date: getCurrentMonthDate(28),
    transactionDate: getCurrentMonthDate(28),
    description: 'Farmácia',
    amount: 150.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-health',
    budgetId: 'budget-1',
  },
  {
    id: 'transaction-11',
    date: getCurrentMonthDate(16),
    transactionDate: getCurrentMonthDate(16),
    description: 'Roupas',
    amount: 250.0,
    type: 'EXPENSE',
    direction: 'EXPENSE',
    accountId: 'account-1',
    categoryId: 'category-clothing',
    budgetId: 'budget-1',
  },
];

export const transactionHandlers = [
  http.get('/api/transactions', ({ request }) => {
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

    // Filtrar por budgetId se fornecido
    if (budgetId) {
      filteredTransactions = filteredTransactions.filter((t) => t.budgetId === budgetId);
    }

    if (accountId) {
      filteredTransactions = filteredTransactions.filter((t) => t.accountId === accountId);
    }

    if (categoryId) {
      filteredTransactions = filteredTransactions.filter((t) => t.categoryId === categoryId);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filteredTransactions = filteredTransactions.filter((t) => {
        const transactionDate = t.transactionDate || t.date;
        if (!transactionDate) return false;
        const txDate = new Date(transactionDate);
        txDate.setHours(0, 0, 0, 0);
        return txDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filteredTransactions = filteredTransactions.filter((t) => {
        const transactionDate = t.transactionDate || t.date;
        if (!transactionDate) return false;
        const txDate = new Date(transactionDate);
        txDate.setHours(0, 0, 0, 0);
        return txDate <= toDate;
      });
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: {
        data: paginatedTransactions,
        meta: {
          page,
          pageSize,
          hasNext: endIndex < filteredTransactions.length,
        },
      },
    });
  }),

  http.post('/api/transaction/create-transaction', async ({ request }) => {
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

  http.post('/api/transaction/update-transaction', async ({ request }) => {
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

  http.post('/api/transaction/delete-transaction', async ({ request }) => {
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

  http.post('/api/transaction/cancel-scheduled-transaction', async ({ request }) => {
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

  http.post('/api/transaction/mark-transaction-late', async ({ request }) => {
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
