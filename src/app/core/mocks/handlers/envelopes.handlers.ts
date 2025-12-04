import { http, HttpResponse } from 'msw';

import type { EnvelopeDto } from '../../../../dtos/envelope';

const mockEnvelopes: EnvelopeDto[] = [
  {
    id: 'envelope-1',
    name: 'Alimentação',
    budgetId: 'budget-1',
    categoryId: 'category-groceries',
    categoryName: 'Alimentação',
    limit: 80000,
    currentUsage: 45000,
    usagePercentage: 56.25,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
  {
    id: 'envelope-2',
    name: 'Transporte',
    budgetId: 'budget-1',
    categoryId: 'category-transport',
    categoryName: 'Transporte',
    limit: 30000,
    currentUsage: 35000,
    usagePercentage: 116.67,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
  {
    id: 'envelope-3',
    name: 'Entretenimento',
    budgetId: 'budget-1',
    categoryId: 'category-entertainment',
    categoryName: 'Entretenimento',
    limit: 20000,
    currentUsage: 7500,
    usagePercentage: 37.5,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
  {
    id: 'envelope-4',
    name: 'Saúde',
    budgetId: 'budget-1',
    categoryId: 'category-health',
    categoryName: 'Saúde',
    limit: 50000,
    currentUsage: 32000,
    usagePercentage: 64.0,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
  {
    id: 'envelope-5',
    name: 'Educação',
    budgetId: 'budget-1',
    categoryId: 'category-education',
    categoryName: 'Educação',
    limit: 40000,
    currentUsage: 0,
    usagePercentage: 0,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-12-03T00:00:00Z',
  },
];

export const envelopeHandlers = [
  http.get('/api/envelopes', ({ request }) => {
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

  http.post('/api/envelope/create-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.name || body.limit === undefined || !body.budgetId || !body.categoryId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.limit <= 0) {
      return HttpResponse.json({ error: 'Limit must be positive' }, { status: 400 });
    }

    const newEnvelopeId = 'envelope-' + Date.now();

    return HttpResponse.json({ id: newEnvelopeId }, { status: 201 });
  }),

  http.post('/api/envelope/update-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.envelopeId || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.limit !== undefined && body.limit <= 0) {
      return HttpResponse.json({ error: 'Limit must be positive' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.post('/api/envelope/delete-envelope', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.envelopeId || !body.budgetId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
