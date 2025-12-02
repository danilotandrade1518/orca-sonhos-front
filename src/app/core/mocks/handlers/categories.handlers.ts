import { http, HttpResponse } from 'msw';

const baseMockCategories = [
  // Income categories
  {
    id: 'category-salary',
    name: 'Salário',
    type: 'INCOME',
  },
  {
    id: 'category-freelance',
    name: 'Freelance',
    type: 'INCOME',
  },
  {
    id: 'category-investments',
    name: 'Investimentos',
    type: 'INCOME',
  },
  {
    id: 'category-bonus',
    name: 'Bônus',
    type: 'INCOME',
  },
  // Expense categories
  {
    id: 'category-groceries',
    name: 'Supermercado',
    type: 'EXPENSE',
  },
  {
    id: 'category-utilities',
    name: 'Contas',
    type: 'EXPENSE',
  },
  {
    id: 'category-transport',
    name: 'Transporte',
    type: 'EXPENSE',
  },
  {
    id: 'category-health',
    name: 'Saúde',
    type: 'EXPENSE',
  },
  {
    id: 'category-education',
    name: 'Educação',
    type: 'EXPENSE',
  },
  {
    id: 'category-entertainment',
    name: 'Entretenimento',
    type: 'EXPENSE',
  },
  {
    id: 'category-clothing',
    name: 'Roupas',
    type: 'EXPENSE',
  },
  {
    id: 'category-home',
    name: 'Casa',
    type: 'EXPENSE',
  },
  // Transfer categories
  {
    id: 'category-transfer',
    name: 'Transferência',
    type: 'TRANSFER',
  },
  {
    id: 'category-savings',
    name: 'Poupança',
    type: 'TRANSFER',
  },
];

export const categoryHandlers = [
  http.get('/categories', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') ?? 'mock-budget-id';

    const now = new Date().toISOString();

    const categories = baseMockCategories.map((category, index) => ({
      id: category.id,
      budgetId,
      name: category.name,
      description: undefined,
      type: category.type,
      kind: 'PRESET',
      color: undefined,
      icon: undefined,
      active: true,
      createdAt: now,
      updatedAt: now,
      order: index,
    }));

    return HttpResponse.json({
      data: categories,
      meta: {
        count: categories.length,
      },
    });
  }),
];
