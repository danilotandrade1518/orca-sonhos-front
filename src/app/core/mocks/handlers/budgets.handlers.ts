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
  http.get('/budgets', async ({ request }) => {
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

  http.get('/budget/:budgetId/overview', ({ request, params }) => {
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

  http.post('/budget/create-budget', async ({ request }) => {
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

  http.post('/budget/update-budget', async ({ request }) => {
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

  http.post('/budget/delete-budget', async ({ request }) => {
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

  http.post('/budget/add-participant', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.budgetId || !body.participantId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Back-end real retorna `{ id, traceId }` via DefaultResponseBuilder
    return HttpResponse.json({ id: body.participantId, traceId: 'msw-trace-id' }, { status: 200 });
  }),

  http.post('/budget/remove-participant', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as any;

    if (!body.budgetId || !body.participantId) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Back-end real retorna `{ id, traceId }` via DefaultResponseBuilder
    return HttpResponse.json({ id: body.participantId, traceId: 'msw-trace-id' }, { status: 200 });
  }),

  http.get('/budget/:budgetId/dashboard/insights', ({ request, params }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { budgetId } = params;

    if (budgetId === 'budget-1') {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

      return HttpResponse.json({
        data: {
          indicators: {
            budgetUsage: {
              value: 83.33,
              percentage: 83.33,
              status: 'warning',
              label: 'Uso de Orçamento',
              description: '83.3% das receitas foram utilizadas',
            },
            cashFlow: {
              value: 120,
              ratio: 120,
              absoluteValue: 500,
              status: 'healthy',
              label: 'Fluxo de Caixa',
              description: 'Superávit de R$ 500,00',
            },
            goalsOnTrack: {
              value: 75,
              percentage: 75,
              status: 'warning',
              label: 'Metas On-Track',
              description: '3 de 4 metas no prazo',
              onTrackCount: 3,
              totalActiveCount: 4,
            },
            emergencyReserve: {
              value: 2,
              monthsCovered: 2,
              status: 'critical',
              label: 'Reserva de Emergência',
              description: '2.0 meses de despesas cobertos',
            },
          },
          suggestedActions: [
            {
              id: 'emergency-reserve',
              type: 'emergency-reserve',
              title: 'Aumentar reserva de emergência',
              description: 'Sua reserva cobre apenas 2.0 meses. Recomenda-se pelo menos 3 meses',
              icon: 'shield',
              route: '/goals',
              priority: 'high',
            },
          ],
          recentAchievements: [
            {
              id: 'achievement-goal-1',
              type: 'goal-completed',
              message: 'Meta "Reserva de emergência" alcançada!',
              date: twoDaysAgo.toISOString(),
              icon: 'trophy',
            },
            {
              id: 'achievement-reserve-3',
              type: 'reserve-milestone',
              message: 'Reserva de emergência atingiu 3 meses!',
              date: fiveDaysAgo.toISOString(),
              icon: 'shield',
            },
          ],
          categorySpending: [
            {
              categoryId: 'category-groceries',
              categoryName: 'Supermercado',
              totalAmount: 45000,
              percentage: 29.3,
              transactionCount: 1,
            },
            {
              categoryId: 'category-transport',
              categoryName: 'Transporte',
              totalAmount: 20000,
              percentage: 13.0,
              transactionCount: 1,
            },
            {
              categoryId: 'category-entertainment',
              categoryName: 'Entretenimento',
              totalAmount: 30000,
              percentage: 19.5,
              transactionCount: 1,
            },
            {
              categoryId: 'category-clothing',
              categoryName: 'Roupas',
              totalAmount: 25000,
              percentage: 16.3,
              transactionCount: 1,
            },
            {
              categoryId: 'category-utilities',
              categoryName: 'Contas',
              totalAmount: 18500,
              percentage: 12.1,
              transactionCount: 2,
            },
            {
              categoryId: 'category-health',
              categoryName: 'Saúde',
              totalAmount: 15000,
              percentage: 9.8,
              transactionCount: 1,
            },
          ],
        },
      });
    }

    return HttpResponse.json({ error: 'Budget not found' }, { status: 404 });
  }),
];
