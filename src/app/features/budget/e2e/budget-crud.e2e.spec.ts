import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { BudgetHelper } from './helpers/budget.helper';

test.describe('Budget CRUD E2E (UI atual)', () => {
  let authHelper: AuthHelper;
  let budgetHelper: BudgetHelper;
  const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';
  const MOCK_TOKEN = 'mock-bearer-token';

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    budgetHelper = new BudgetHelper(page);

    await authHelper.login();
  });

  test('deve criar um novo orçamento PERSONAL e aparecer na lista', async () => {
    const budgetName = `E2E Orçamento Pessoal ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');

    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate;

    await budgetHelper.expectSuccessNotification(/orçamento criado com sucesso/i);
    await budgetHelper.waitForBudgetList();
    await budgetHelper.expectBudgetInList(budgetName);

    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve criar um novo orçamento SHARED e aparecer na lista', async () => {
    const budgetName = `E2E Orçamento Compartilhado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');

    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate;

    await budgetHelper.expectSuccessNotification(/orçamento criado com sucesso/i);
    await budgetHelper.waitForBudgetList();
    await budgetHelper.expectBudgetInList(budgetName);

    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve editar um orçamento existente', async ({ request }) => {
    const originalName = `E2E Orçamento Original ${Date.now()}`;
    const updatedName = `E2E Orçamento Atualizado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(originalName, 'PERSONAL');

    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await budgetHelper.expectSuccessNotification(/orçamento criado com sucesso/i);
    await budgetHelper.waitForBudgetList();
    await budgetHelper.expectBudgetInList(originalName);

    await budgetHelper.clickEditBudget(originalName);

    await budgetHelper.fillBudgetForm(updatedName);
    const waitUpdate = budgetHelper.waitForUpdateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitUpdate;

    const listResp = await request.get('http://localhost:3000/budgets', {
      headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
    });
    expect(listResp.ok()).toBeTruthy();
    const listJson = (await listResp.json()) as { data?: { id: string; name: string }[] };
    const updated = listJson.data?.find((b) => b.id === budgetId);
    expect(updated?.name).toBe(updatedName);

    const delResp = await request.post('http://localhost:3000/budget/delete-budget', {
      headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
      data: { userId: MOCK_USER_ID, budgetId },
    });
    expect(delResp.ok()).toBeTruthy();
  });

  test('deve deletar um orçamento existente', async () => {
    const budgetName = `E2E Orçamento Para Deletar ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');

    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate;

    await budgetHelper.expectSuccessNotification(/orçamento criado com sucesso/i);
    await budgetHelper.waitForBudgetList();
    await budgetHelper.expectBudgetInList(budgetName);

    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;

    await budgetHelper.waitForBudgetList();
    await budgetHelper.expectBudgetNotInList(budgetName);
  });

  test('deve cancelar a exclusão de um orçamento', async () => {
    const budgetName = `E2E Orçamento Cancelar Exclusão ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');

    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate;

    await budgetHelper.expectSuccessNotification(/orçamento criado com sucesso/i);
    await budgetHelper.waitForBudgetList();
    await budgetHelper.expectBudgetInList(budgetName);

    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.cancelDelete();
    await budgetHelper.expectBudgetInList(budgetName);

    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve validar campos obrigatórios no formulário', async ({ page }) => {
    await page.goto('/budgets/new');
    await page.waitForLoadState('networkidle');

    const nameInput = page
      .locator('os-form-field')
      .filter({ hasText: 'Nome do Orçamento' })
      .locator('input')
      .first();
    await nameInput.fill('A');
    await nameInput.fill('');

    await expect(page.getByText(/nome do orçamento é obrigatório/i)).toBeVisible();
  });

  test('deve exibir mensagem de erro ao tentar criar orçamento com nome muito curto', async ({ page }) => {
    await page.goto('/budgets/new');
    await page.waitForLoadState('networkidle');

    await page
      .locator('os-form-field')
      .filter({ hasText: 'Nome do Orçamento' })
      .locator('input')
      .first()
      .fill('AB');

    await expect(page.getByText(/pelo menos 3 caracteres/i)).toBeVisible();
  });

  test('deve exibir estado vazio (por filtro) quando não há resultados e permitir ir para criação', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    const searchInput = page.locator('input[placeholder="Buscar orçamentos..."]').first();
    await searchInput.fill(`NAO-EXISTE-${Date.now()}`);

    await expect(page.getByText(/nenhum orçamento encontrado/i)).toBeVisible();

    await page.getByRole('button', { name: /criar orçamento/i }).first().click();
    await expect(page).toHaveURL(/\/budgets\/new/);
    await expect(page.getByText(/criar orçamento/i)).toBeVisible();
  });

  test('deve filtrar orçamentos por tipo', async ({ page }) => {
    const personalBudget = `E2E Orçamento Pessoal ${Date.now()}`;
    const sharedBudget = `E2E Orçamento Compartilhado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(personalBudget, 'PERSONAL');
    const waitCreate1 = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate1;
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(sharedBudget, 'SHARED');
    const waitCreate2 = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate2;
    await budgetHelper.waitForBudgetList();

    const typeSelect = page.getByRole('combobox', { name: /tipo/i }).first();
    await typeSelect.click();
    await page.getByRole('option', { name: /pessoal/i }).click();

    await budgetHelper.expectBudgetInList(personalBudget);
    await budgetHelper.expectBudgetNotInList(sharedBudget);

    // Resetar filtro para "todos" de forma resiliente.
    // O texto/option do dropdown pode variar, mas a UI expõe botões explícitos de ação.
    await page.getByRole('button', { name: /^limpar$/i }).first().click();
    await budgetHelper.waitForBudgetList();
    const waitDelete1 = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(personalBudget);
    await budgetHelper.confirmDelete();
    await waitDelete1;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    const waitDelete2 = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(sharedBudget);
    await budgetHelper.confirmDelete();
    await waitDelete2;
  });

  test('deve buscar orçamentos por nome', async ({ page }) => {
    const budgetName = `E2E Orçamento Busca ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    await waitCreate;
    await budgetHelper.waitForBudgetList();

    const searchInput = page.locator('input[placeholder="Buscar orçamentos..."]').first();
    await searchInput.fill(budgetName);

    await budgetHelper.expectBudgetInList(budgetName);

    await searchInput.fill('');
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });
});
