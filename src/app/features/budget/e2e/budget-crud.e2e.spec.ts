import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { BudgetHelper } from './helpers/budget.helper';

test.describe('Budget CRUD E2E Tests', () => {
  let authHelper: AuthHelper;
  let budgetHelper: BudgetHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    budgetHelper = new BudgetHelper(page);

    await authHelper.login();
  });

  test('deve criar um novo orçamento PERSONAL e aparecer na lista', async () => {
    const budgetName = `Orçamento Teste ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();

    await budgetHelper.expectSuccessNotification('criado com sucesso');

    await budgetHelper.expectBudgetInList(budgetName);
  });

  test('deve criar um novo orçamento SHARED e aparecer na lista', async () => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();

    await budgetHelper.expectSuccessNotification('criado com sucesso');
    await budgetHelper.expectBudgetInList(budgetName);
  });

  test('deve editar um orçamento existente', async () => {
    const originalName = `Orçamento Original ${Date.now()}`;
    const updatedName = `Orçamento Atualizado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(originalName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickEditBudget(originalName);
    await budgetHelper.fillBudgetForm(updatedName);
    await budgetHelper.saveBudgetForm();

    await budgetHelper.expectSuccessNotification('atualizado com sucesso');

    await budgetHelper.expectBudgetInList(updatedName);
    await budgetHelper.expectBudgetNotInList(originalName);
  });

  test('deve deletar um orçamento existente', async () => {
    const budgetName = `Orçamento para Deletar ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();

    await budgetHelper.expectSuccessNotification('excluído com sucesso');

    await budgetHelper.expectBudgetNotInList(budgetName);
  });

  test('deve cancelar a exclusão de um orçamento', async () => {
    const budgetName = `Orçamento para Cancelar ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.cancelDelete();

    await budgetHelper.expectBudgetInList(budgetName);
  });

  test('deve validar campos obrigatórios no formulário', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();

    await budgetHelper.saveBudgetForm();

    await expect(page.getByText(/nome.*obrigatório|campo.*obrigatório/i)).toBeVisible();
  });

  test('deve exibir mensagem de erro ao tentar criar orçamento com nome muito curto', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();

    await budgetHelper.fillBudgetForm('AB');
    await budgetHelper.saveBudgetForm();

    await expect(page.getByText(/mínimo.*caracteres|nome.*curto/i)).toBeVisible();
  });

  test('deve exibir lista vazia quando não há orçamentos', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await expect(page.getByText(/nenhum orçamento encontrado/i)).toBeVisible();
    await expect(page.getByText(/crie seu primeiro orçamento/i)).toBeVisible();
  });

  test('deve filtrar orçamentos por tipo', async ({ page }) => {
    const personalBudget = `Orçamento Pessoal ${Date.now()}`;
    const sharedBudget = `Orçamento Compartilhado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(personalBudget, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(sharedBudget, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    const typeSelect = page.getByLabel(/tipo/i);
    await typeSelect.click();
    await page.getByRole('option', { name: /pessoal/i }).click();
    await page.waitForTimeout(500);

    await budgetHelper.expectBudgetInList(personalBudget);
    await budgetHelper.expectBudgetNotInList(sharedBudget);
  });

  test('deve buscar orçamentos por nome', async ({ page }) => {
    const budgetName = `Orçamento Busca ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill(budgetName);
    await page.waitForTimeout(500);

    await budgetHelper.expectBudgetInList(budgetName);
  });
});
