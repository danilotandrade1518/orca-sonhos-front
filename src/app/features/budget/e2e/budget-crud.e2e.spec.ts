import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { BudgetHelper } from './helpers/budget.helper';

test.describe('Budget CRUD E2E Tests', () => {
  let authHelper: AuthHelper;
  let budgetHelper: BudgetHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    budgetHelper = new BudgetHelper(page);

    // Autenticar usuário de teste
    await authHelper.login('test-user-id', 'test@example.com', 'Test User');
  });

  test('deve criar um novo orçamento PERSONAL e aparecer na lista', async ({ page }) => {
    const budgetName = `Orçamento Teste ${Date.now()}`;

    // Navegar para lista de orçamentos
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    // Criar novo orçamento
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();

    // Verificar notificação de sucesso
    await budgetHelper.expectSuccessNotification(/criado com sucesso/i);

    // Verificar que o orçamento aparece na lista
    await budgetHelper.expectBudgetInList(budgetName);
  });

  test('deve criar um novo orçamento SHARED e aparecer na lista', async ({ page }) => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();

    await budgetHelper.expectSuccessNotification(/criado com sucesso/i);
    await budgetHelper.expectBudgetInList(budgetName);
  });

  test('deve editar um orçamento existente', async ({ page }) => {
    const originalName = `Orçamento Original ${Date.now()}`;
    const updatedName = `Orçamento Atualizado ${Date.now()}`;

    // Criar orçamento primeiro
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(originalName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    // Editar orçamento
    await budgetHelper.clickEditBudget(originalName);
    await budgetHelper.fillBudgetForm(updatedName);
    await budgetHelper.saveBudgetForm();

    // Verificar notificação de sucesso
    await budgetHelper.expectSuccessNotification(/atualizado com sucesso/i);

    // Verificar que o nome foi atualizado na lista
    await budgetHelper.expectBudgetInList(updatedName);
    await budgetHelper.expectBudgetNotInList(originalName);
  });

  test('deve deletar um orçamento existente', async ({ page }) => {
    const budgetName = `Orçamento para Deletar ${Date.now()}`;

    // Criar orçamento primeiro
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    // Deletar orçamento
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();

    // Verificar notificação de sucesso
    await budgetHelper.expectSuccessNotification(/excluído com sucesso/i);

    // Verificar que o orçamento não aparece mais na lista
    await budgetHelper.expectBudgetNotInList(budgetName);
  });

  test('deve cancelar a exclusão de um orçamento', async ({ page }) => {
    const budgetName = `Orçamento para Cancelar ${Date.now()}`;

    // Criar orçamento primeiro
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    // Tentar deletar mas cancelar
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.cancelDelete();

    // Verificar que o orçamento ainda está na lista
    await budgetHelper.expectBudgetInList(budgetName);
  });

  test('deve validar campos obrigatórios no formulário', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();

    // Tentar salvar sem preencher nome
    await budgetHelper.saveBudgetForm();

    // Verificar mensagem de validação
    await expect(page.getByText(/nome.*obrigatório|campo.*obrigatório/i)).toBeVisible();
  });

  test('deve exibir mensagem de erro ao tentar criar orçamento com nome muito curto', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();

    // Preencher com nome muito curto
    await budgetHelper.fillBudgetForm('AB');
    await budgetHelper.saveBudgetForm();

    // Verificar mensagem de validação
    await expect(page.getByText(/mínimo.*caracteres|nome.*curto/i)).toBeVisible();
  });

  test('deve exibir lista vazia quando não há orçamentos', async ({ page }) => {
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    // Verificar mensagem de lista vazia
    await expect(page.getByText(/nenhum orçamento encontrado/i)).toBeVisible();
    await expect(page.getByText(/crie seu primeiro orçamento/i)).toBeVisible();
  });

  test('deve filtrar orçamentos por tipo', async ({ page }) => {
    const personalBudget = `Orçamento Pessoal ${Date.now()}`;
    const sharedBudget = `Orçamento Compartilhado ${Date.now()}`;

    // Criar dois orçamentos
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

    // Filtrar por PERSONAL
    const typeSelect = page.getByLabel(/tipo/i);
    await typeSelect.click();
    await page.getByRole('option', { name: /pessoal/i }).click();
    await page.waitForTimeout(500);

    // Verificar que apenas PERSONAL aparece
    await budgetHelper.expectBudgetInList(personalBudget);
    await budgetHelper.expectBudgetNotInList(sharedBudget);
  });

  test('deve buscar orçamentos por nome', async ({ page }) => {
    const budgetName = `Orçamento Busca ${Date.now()}`;

    // Criar orçamento
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    // Buscar pelo nome
    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill(budgetName);
    await page.waitForTimeout(500);

    // Verificar que o orçamento aparece
    await budgetHelper.expectBudgetInList(budgetName);
  });
});
