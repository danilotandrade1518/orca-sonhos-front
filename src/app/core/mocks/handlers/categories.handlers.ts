import { http, HttpResponse } from 'msw';

import type { CategoryDto, CategoryType } from '../../../../dtos/category';

const baseMockCategories: Array<{ id: string; name: string; type: CategoryType }> = [
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

const categoriesStore = new Map<string, CategoryDto>();

function initializeStoreForBudget(budgetId: string): void {
  if (categoriesStore.has(budgetId)) {
    return;
  }

  const now = new Date().toISOString();
  const categories: CategoryDto[] = baseMockCategories.map((category, index) => ({
    id: category.id,
    budgetId,
    name: category.name,
    description: undefined,
    type: category.type as CategoryType,
    kind: 'PRESET',
    color: undefined,
    icon: undefined,
    active: true,
    createdAt: now,
    updatedAt: now,
    order: index,
  }));

  categories.forEach((category) => {
    categoriesStore.set(`${budgetId}:${category.id}`, category);
  });
}

function getCategoriesByBudget(budgetId: string): CategoryDto[] {
  initializeStoreForBudget(budgetId);
  return Array.from(categoriesStore.values()).filter((cat) => cat.budgetId === budgetId);
}

function generateCategoryId(): string {
  return `category-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const categoryHandlers = [
  http.get('/categories', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const budgetId = url.searchParams.get('budgetId') ?? 'mock-budget-id';

    const categories = getCategoriesByBudget(budgetId);

    return HttpResponse.json({
      data: categories,
      meta: {
        count: categories.length,
      },
    });
  }),

  http.post('/category/create-category', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      name: string;
      type: string;
      budgetId: string;
    };

    const now = new Date().toISOString();
    const categoryId = generateCategoryId();
    const key = `${body.budgetId}:${categoryId}`;

    const existingCategories = getCategoriesByBudget(body.budgetId);
    const nameExists = existingCategories.some(
      (cat) => cat.name.toLowerCase() === body.name.toLowerCase()
    );

    if (nameExists) {
      return HttpResponse.json(
        { errors: ['Category name already exists for this budget'], traceId: 'mock-trace-id' },
        { status: 400 }
      );
    }

    const newCategory: CategoryDto = {
      id: categoryId,
      budgetId: body.budgetId,
      name: body.name,
      description: undefined,
      type: body.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
      kind: 'CUSTOM',
      color: undefined,
      icon: undefined,
      active: true,
      createdAt: now,
      updatedAt: now,
      order: existingCategories.length,
    };

    categoriesStore.set(key, newCategory);

    return HttpResponse.json({ id: categoryId, traceId: 'mock-trace-id' }, { status: 201 });
  }),

  http.post('/category/update-category', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      id: string;
      name: string;
      type: string;
    };

    const existingCategory = Array.from(categoriesStore.values()).find(
      (cat) => cat.id === body.id
    );

    if (!existingCategory) {
      return HttpResponse.json(
        { errors: ['Category not found'], traceId: 'mock-trace-id' },
        { status: 404 }
      );
    }

    const key = `${existingCategory.budgetId}:${body.id}`;

    if (body.name && body.name.toLowerCase() !== existingCategory.name.toLowerCase()) {
      const existingCategories = getCategoriesByBudget(existingCategory.budgetId);
      const nameExists = existingCategories.some(
        (cat) => cat.id !== body.id && cat.name.toLowerCase() === body.name.toLowerCase()
      );

      if (nameExists) {
        return HttpResponse.json(
          { errors: ['Category name already exists for this budget'], traceId: 'mock-trace-id' },
          { status: 400 }
        );
      }
    }

    const updatedCategory: CategoryDto = {
      ...existingCategory,
      name: body.name,
      type: body.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
      updatedAt: new Date().toISOString(),
    };

    categoriesStore.set(key, updatedCategory);

    return HttpResponse.json({ id: body.id, traceId: 'mock-trace-id' }, { status: 200 });
  }),

  http.post('/category/delete-category', async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      id: string;
    };

    if (!body.id) {
      return HttpResponse.json(
        { errors: ['id is required'], traceId: 'mock-trace-id' },
        { status: 400 }
      );
    }

    const existingCategory = Array.from(categoriesStore.values()).find(
      (cat) => cat.id === body.id
    );

    if (!existingCategory) {
      return HttpResponse.json(
        { errors: ['Category not found'], traceId: 'mock-trace-id' },
        { status: 404 }
      );
    }

    const key = `${existingCategory.budgetId}:${body.id}`;

    categoriesStore.delete(key);

    return HttpResponse.json({ id: body.id, traceId: 'mock-trace-id' }, { status: 200 });
  }),
];
