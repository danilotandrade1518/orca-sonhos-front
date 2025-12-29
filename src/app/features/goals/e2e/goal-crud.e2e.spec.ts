import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { GoalHelper } from './helpers/goal.helper';

test.describe('Goal CRUD E2E (UI atual)', () => {
  let authHelper: AuthHelper;
  let goalHelper: GoalHelper;
  const MOCK_TOKEN = 'mock-bearer-token';

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    goalHelper = new GoalHelper(page);

    await authHelper.login();
  });

  test('deve criar uma nova meta e aparecer na lista', async () => {
    const goalName = `E2E Meta ${Date.now()}`;
    const totalAmount = '1000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    await waitCreate;

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve editar uma meta existente', async ({ request }) => {
    const originalName = `E2E Meta Original ${Date.now()}`;
    const updatedName = `E2E Meta Atualizada ${Date.now()}`;
    const totalAmount = '1000.00';
    const updatedTotalAmount = '2000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(originalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(originalName);

    await goalHelper.clickEditGoal(originalName);

    await goalHelper.fillGoalForm(updatedName, updatedTotalAmount);
    const waitUpdate = goalHelper.waitForUpdateGoalResponse();
    await goalHelper.saveGoalForm();
    await waitUpdate;

    const listResp = await request.get('http://localhost:3000/goal', {
      headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
    });
    expect(listResp.ok()).toBeTruthy();
    const listJson = (await listResp.json()) as { data?: { id: string; name: string }[] };
    const updated = listJson.data?.find((g) => g.id === goalId);
    expect(updated?.name).toBe(updatedName);

    const delResp = await request.post('http://localhost:3000/goal/delete-goal', {
      headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
      data: { id: goalId },
    });
    expect(delResp.ok()).toBeTruthy();
  });

  test('deve deletar uma meta existente', async () => {
    const goalName = `E2E Meta Para Deletar ${Date.now()}`;
    const totalAmount = '1000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    await waitCreate;

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;

    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalNotInList(goalName);
  });

  test('deve cancelar a exclusão de uma meta', async () => {
    const goalName = `E2E Meta Cancelar Exclusão ${Date.now()}`;
    const totalAmount = '1000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    await waitCreate;

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.cancelDelete();
    await goalHelper.expectGoalInList(goalName);

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve validar campos obrigatórios no formulário', async ({ page }) => {
    await goalHelper.navigateToGoalList();
    await goalHelper.clickCreateGoal();

    const nameInput = page
      .locator('os-form-field')
      .filter({ hasText: 'Nome' })
      .locator('input')
      .first();
    await nameInput.fill('A');
    await nameInput.fill('');

    await expect(page.getByText(/nome é obrigatório/i)).toBeVisible();
  });

  test('deve exibir mensagem de erro ao tentar criar meta com nome muito curto', async ({ page }) => {
    await goalHelper.navigateToGoalList();
    await goalHelper.clickCreateGoal();

    await page
      .locator('os-form-field')
      .filter({ hasText: 'Nome' })
      .locator('input')
      .first()
      .fill('A');

    await expect(page.getByText(/pelo menos 2 caracteres/i)).toBeVisible();
  });

  test('deve exibir mensagem de erro ao tentar criar meta com nome muito longo', async ({ page }) => {
    await goalHelper.navigateToGoalList();
    await goalHelper.clickCreateGoal();

    const longName = 'A'.repeat(51);
    const nameInput = page
      .locator('os-form-field')
      .filter({ hasText: 'Nome' })
      .locator('input')
      .first();
    await nameInput.fill(longName);
    await nameInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText(/nome deve ter no máximo 50 caracteres/i)).toBeVisible();
  });

  test('deve exibir estado vazio (por filtro) quando não há resultados e permitir ir para criação', async ({
    page,
  }) => {
    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    const searchInput = page.locator('input[placeholder="Buscar metas..."]').first();
    await searchInput.fill(`NAO-EXISTE-${Date.now()}`);

    await expect(page.getByText(/nenhuma meta encontrada/i)).toBeVisible();

    await page.getByRole('button', { name: /nova meta/i }).first().click();
    await expect(page).toHaveURL(/\/goals\/new/);
    await expect(page.locator('h1.os-page-header__title').filter({ hasText: /nova meta/i }).first()).toBeVisible();
  });

  test('deve buscar metas por nome', async ({ page }) => {
    const goalName = `E2E Meta Busca ${Date.now()}`;
    const totalAmount = '1000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);
    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    await waitCreate;
    await goalHelper.waitForGoalList();

    const searchInput = page.locator('input[placeholder="Buscar metas..."]').first();
    await searchInput.fill(goalName);

    await goalHelper.expectGoalInList(goalName);

    await searchInput.fill('');
    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve navegar para detalhes ao clicar no card', async ({ page }) => {
    const goalName = `E2E Meta Detalhes ${Date.now()}`;
    const totalAmount = '1000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickGoal(goalName);

    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));
    await expect(page.getByText(goalName)).toBeVisible();

    await page.goBack();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve navegar para edição ao clicar no botão Editar', async ({ page }) => {
    const goalName = `E2E Meta Edição ${Date.now()}`;
    const totalAmount = '1000.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickEditGoal(goalName);

    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}/edit`));
    await expect(page.getByText(/editar meta/i)).toBeVisible();

    await goalHelper.cancelGoalForm();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve validar data no passado', async ({ page }) => {
    await goalHelper.navigateToGoalList();
    await goalHelper.clickCreateGoal();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const datePicker = page.locator('os-date-picker').first();
    await datePicker.waitFor({ state: 'visible', timeout: 10000 });
    const dateInput = datePicker.locator('input').first();
    await dateInput.fill(yesterdayStr);
    await dateInput.blur();
    await page.waitForTimeout(500);

    await expect(page.getByText(/data não pode ser no passado/i)).toBeVisible();
  });

  test('deve adicionar aporte a uma meta', async ({ page }) => {
    const goalName = `E2E Meta Aporte ${Date.now()}`;
    const totalAmount = '1000.00';
    const addAmount = '100.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickGoal(goalName);
    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));

    await goalHelper.navigateToAddAmount(goalName);
    await goalHelper.fillAmountForm(addAmount);

    const waitAddAmount = goalHelper.waitForAddAmountResponse();
    await goalHelper.saveAmountForm();
    await waitAddAmount;

    await goalHelper.expectSuccessNotification(/aporte adicionado com sucesso/i);

    await page.goBack();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve remover aporte de uma meta', async ({ page }) => {
    const goalName = `E2E Meta Remover Aporte ${Date.now()}`;
    const totalAmount = '1000.00';
    const addAmount = '200.00';
    const removeAmount = '100.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickGoal(goalName);
    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));

    await goalHelper.navigateToAddAmount(goalName);
    await goalHelper.fillAmountForm(addAmount);

    const waitAddAmount = goalHelper.waitForAddAmountResponse();
    await goalHelper.saveAmountForm();
    await waitAddAmount;

    await goalHelper.expectSuccessNotification(/aporte adicionado com sucesso/i);

    await page.goBack();
    await goalHelper.navigateToRemoveAmount(goalName);
    await goalHelper.fillAmountForm(removeAmount);

    const waitRemoveAmount = goalHelper.waitForRemoveAmountResponse();
    await goalHelper.saveAmountForm();
    await waitRemoveAmount;

    await goalHelper.expectSuccessNotification(/aporte removido com sucesso/i);

    await page.goBack();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve validar que não é possível remover mais do que o valor acumulado', async ({ page }) => {
    const goalName = `E2E Meta Validar Remoção ${Date.now()}`;
    const totalAmount = '1000.00';
    const addAmount = '100.00';
    const invalidRemoveAmount = '200.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickGoal(goalName);
    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));

    await goalHelper.navigateToAddAmount(goalName);
    await goalHelper.fillAmountForm(addAmount);

    const waitAddAmount = goalHelper.waitForAddAmountResponse();
    await goalHelper.saveAmountForm();
    await waitAddAmount;

    await goalHelper.expectSuccessNotification(/aporte adicionado com sucesso/i);

    await page.goBack();
    await goalHelper.navigateToRemoveAmount(goalName);
    await goalHelper.fillAmountForm(invalidRemoveAmount);
    await page.waitForTimeout(500);

    await expect(
      page.getByText(/não é possível remover valor que resulte em saldo negativo/i)
    ).toBeVisible();

    await page.goBack();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve adicionar aporte via botão na página de detalhes', async ({ page }) => {
    const goalName = `E2E Meta Aporte Botão ${Date.now()}`;
    const totalAmount = '1000.00';
    const addAmount = '150.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickGoal(goalName);
    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));

    const addButton = page.getByRole('button', { name: /aportar/i }).first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}/add-amount`));
    await goalHelper.fillAmountForm(addAmount);

    const waitAddAmount = goalHelper.waitForAddAmountResponse();
    await goalHelper.saveAmountForm();
    await waitAddAmount;

    await goalHelper.expectSuccessNotification(/aporte adicionado com sucesso/i);

    await page.goBack();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });

  test('deve remover aporte via botão na página de detalhes', async ({ page }) => {
    const goalName = `E2E Meta Remover Botão ${Date.now()}`;
    const totalAmount = '1000.00';
    const addAmount = '200.00';
    const removeAmount = '50.00';

    await goalHelper.navigateToGoalList();
    await goalHelper.waitForGoalList();

    await goalHelper.clickCreateGoal();
    await goalHelper.fillGoalForm(goalName, totalAmount);

    const waitCreate = goalHelper.waitForCreateGoalResponse();
    await goalHelper.saveGoalForm();
    const goalId = await waitCreate;
    expect(goalId).toBeTruthy();

    await goalHelper.expectSuccessNotification(/meta criada com sucesso/i);
    await goalHelper.waitForGoalList();
    await goalHelper.expectGoalInList(goalName);

    await goalHelper.clickGoal(goalName);
    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));

    const addButton = page.getByRole('button', { name: /aportar/i }).first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click();
    await page.waitForLoadState('networkidle');

    await goalHelper.fillAmountForm(addAmount);

    const waitAddAmount = goalHelper.waitForAddAmountResponse();
    await goalHelper.saveAmountForm();
    await waitAddAmount;

    await goalHelper.expectSuccessNotification(/aporte adicionado com sucesso/i);

    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}`));

    const removeButton = page.getByRole('button', { name: /remover/i }).first();
    await removeButton.waitFor({ state: 'visible', timeout: 10000 });
    await removeButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp(`/goals/${goalId}/remove-amount`));
    await goalHelper.fillAmountForm(removeAmount);

    const waitRemoveAmount = goalHelper.waitForRemoveAmountResponse();
    await goalHelper.saveAmountForm();
    await waitRemoveAmount;

    await goalHelper.expectSuccessNotification(/aporte removido com sucesso/i);

    await page.goBack();
    await goalHelper.waitForGoalList();

    const waitDelete = goalHelper.waitForDeleteGoalResponse();
    await goalHelper.clickDeleteGoal(goalName);
    await goalHelper.confirmDelete();
    await waitDelete;
  });
});
