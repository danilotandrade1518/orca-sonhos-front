import { http, HttpResponse } from 'msw';

const mockCreditCards = [
  {
    id: 'credit-card-1',
    name: 'Cartão Principal',
    limit: 5000.0,
    closingDay: 15,
    dueDay: 25,
    budgetId: 'budget-1',
  },
  {
    id: 'credit-card-2',
    name: 'Cartão de Emergência',
    limit: 2000.0,
    closingDay: 5,
    dueDay: 15,
    budgetId: 'budget-1',
  },
];

const mockCreditCardBills = [
  {
    id: 'bill-1',
    creditCardId: 'credit-card-1',
    closingDate: '2025-01-15T23:59:59Z',
    dueDate: '2025-01-25T23:59:59Z',
    amount: 1200.0,
    paid: false,
  },
  {
    id: 'bill-2',
    creditCardId: 'credit-card-2',
    closingDate: '2025-01-05T23:59:59Z',
    dueDate: '2025-01-15T23:59:59Z',
    amount: 450.0,
    paid: true,
  },
];

export const creditCardHandlers = [
  // Credit Card endpoints
  http.post('/credit-card/create-credit-card', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.name || !body.limit || !body.closingDay || !body.dueDay || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.limit <= 0) {
      return HttpResponse.json({ error: 'Limit must be positive' }, { status: 400 });
    }

    if (body.closingDay < 1 || body.closingDay > 31) {
      return HttpResponse.json({ error: 'Closing day must be between 1 and 31' }, { status: 400 });
    }

    if (body.dueDay < 1 || body.dueDay > 31) {
      return HttpResponse.json({ error: 'Due day must be between 1 and 31' }, { status: 400 });
    }

    const newCreditCard = {
      id: 'credit-card-' + Date.now(),
      name: body.name,
      limit: body.limit,
      closingDay: body.closingDay,
      dueDay: body.dueDay,
      budgetId: body.budgetId,
    };

    return HttpResponse.json({ id: newCreditCard.id }, { status: 201 });
  }),

  http.post('/credit-card/update-credit-card', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id || !body.name || !body.limit || !body.closingDay || !body.dueDay) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.limit <= 0) {
      return HttpResponse.json({ error: 'Limit must be positive' }, { status: 400 });
    }

    if (body.closingDay < 1 || body.closingDay > 31) {
      return HttpResponse.json({ error: 'Closing day must be between 1 and 31' }, { status: 400 });
    }

    if (body.dueDay < 1 || body.dueDay > 31) {
      return HttpResponse.json({ error: 'Due day must be between 1 and 31' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/credit-card/delete-credit-card', async ({ request }) => {
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

  // Credit Card Bill endpoints
  http.post('/credit-card-bill/create-credit-card-bill', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.creditCardId || !body.closingDate || !body.dueDate || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const newBill = {
      id: 'bill-' + Date.now(),
      creditCardId: body.creditCardId,
      closingDate: body.closingDate,
      dueDate: body.dueDate,
      amount: body.amount,
      paid: false,
    };

    return HttpResponse.json({ id: newBill.id }, { status: 201 });
  }),

  http.post('/credit-card-bill/update-credit-card-bill', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.id || !body.closingDate || !body.dueDate || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/credit-card-bill/delete-credit-card-bill', async ({ request }) => {
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

  http.post('/credit-card-bill/pay-credit-card-bill', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (
      !body.creditCardBillId ||
      !body.accountId ||
      !body.userId ||
      !body.budgetId ||
      !body.amount ||
      !body.paymentCategoryId
    ) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/credit-card-bill/reopen-credit-card-bill', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.creditCardBillId || !body.userId || !body.budgetId || !body.justification) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
