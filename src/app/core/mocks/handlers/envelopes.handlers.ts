import { http, HttpResponse } from 'msw';

const mockEnvelopes = [
  {
    id: 'envelope-1',
    name: 'Alimentação',
    monthlyLimit: 800.0,
    currentAmount: 450.0,
    budgetId: 'budget-1',
    categoryId: 'category-groceries',
  },
  {
    id: 'envelope-2',
    name: 'Transporte',
    monthlyLimit: 300.0,
    currentAmount: 180.0,
    budgetId: 'budget-1',
    categoryId: 'category-transport',
  },
  {
    id: 'envelope-3',
    name: 'Entretenimento',
    monthlyLimit: 200.0,
    currentAmount: 75.0,
    budgetId: 'budget-1',
    categoryId: 'category-entertainment',
  },
  {
    id: 'envelope-4',
    name: 'Saúde',
    monthlyLimit: 500.0,
    currentAmount: 320.0,
    budgetId: 'budget-1',
    categoryId: 'category-health',
  },
  {
    id: 'envelope-5',
    name: 'Educação',
    monthlyLimit: 400.0,
    currentAmount: 0.0,
    budgetId: 'budget-1',
    categoryId: 'category-education',
  },
];

export const envelopeHandlers = [
  http.get('/envelopes', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId');

    if (!budgetId) {
      return HttpResponse.json({ error: 'budgetId is required' }, { status: 400 });
    }

    const filteredEnvelopes = mockEnvelopes.filter((envelope) => envelope.budgetId === budgetId);

    return HttpResponse.json({
      data: filteredEnvelopes,
      meta: {
        count: filteredEnvelopes.length,
      },
    });
  }),

  http.post('/envelope/create-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.name || !body.monthlyLimit || !body.budgetId || !body.categoryId || !body.userId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.monthlyLimit <= 0) {
      return HttpResponse.json({ error: 'Monthly limit must be positive' }, { status: 400 });
    }

    const newEnvelope = {
      id: 'envelope-' + Date.now(),
      name: body.name,
      monthlyLimit: body.monthlyLimit,
      currentAmount: 0,
      budgetId: body.budgetId,
      categoryId: body.categoryId,
    };

    return HttpResponse.json({ id: newEnvelope.id }, { status: 201 });
  }),

  http.post('/envelope/update-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.envelopeId || !body.userId || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.monthlyLimit !== undefined && body.monthlyLimit <= 0) {
      return HttpResponse.json({ error: 'Monthly limit must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/envelope/delete-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.envelopeId || !body.userId || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/envelope/add-amount-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.envelopeId || !body.userId || !body.budgetId || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/envelope/remove-amount-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.envelopeId || !body.userId || !body.budgetId || !body.amount) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/envelope/transfer-between-envelopes', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (
      !body.sourceEnvelopeId ||
      !body.targetEnvelopeId ||
      !body.userId ||
      !body.budgetId ||
      !body.amount
    ) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.amount <= 0) {
      return HttpResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    if (body.sourceEnvelopeId === body.targetEnvelopeId) {
      return HttpResponse.json(
        { error: 'Source and target envelopes must be different' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
