import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { BudgetHelper } from './helpers/budget.helper';
import { ParticipantsHelper } from './helpers/participants.helper';

test.describe('Budget Participants E2E Tests', () => {
  let authHelper: AuthHelper;
  let budgetHelper: BudgetHelper;
  let participantsHelper: ParticipantsHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    budgetHelper = new BudgetHelper(page);
    participantsHelper = new ParticipantsHelper(page);

    await authHelper.login();
  });

  test('deve criar orçamento SHARED e adicionar participante', async () => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);

    await participantsHelper.openManageParticipants();

    await participantsHelper.addParticipant(participantEmail);

    await participantsHelper.expectSuccessNotification('adicionado com sucesso');

    await participantsHelper.expectParticipantInList(participantEmail);

    await participantsHelper.expectParticipantCount(1);
  });

  test('deve remover participante de orçamento SHARED', async () => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);
    await participantsHelper.openManageParticipants();
    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectParticipantInList(participantEmail);

    await participantsHelper.removeParticipant(participantEmail);

    await participantsHelper.expectSuccessNotification('removido com sucesso');

    await participantsHelper.expectParticipantNotInList(participantEmail);

    await participantsHelper.expectParticipantCount(0);
  });

  test('deve exibir erro ao tentar adicionar participante em orçamento PERSONAL', async ({ page }) => {
    const budgetName = `Orçamento Pessoal ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);

    const manageButton = page.getByRole('button', { name: /gerenciar participantes/i });

    if (await manageButton.isVisible()) {
      await participantsHelper.openManageParticipants();

      await participantsHelper.addParticipant(participantEmail);

      await participantsHelper.expectPersonalBudgetError();
    } else {

      await expect(manageButton).not.toBeVisible();
    }
  });

  test('deve atualizar contagem de participantes após adicionar múltiplos', async () => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participant1 = 'participant1@example.com';
    const participant2 = 'participant2@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);
    await participantsHelper.openManageParticipants();

    await participantsHelper.addParticipant(participant1);
    await participantsHelper.expectSuccessNotification('adicionado com sucesso');
    await participantsHelper.expectParticipantCount(1);

    await participantsHelper.addParticipant(participant2);
    await participantsHelper.expectSuccessNotification('adicionado com sucesso');
    await participantsHelper.expectParticipantCount(2);

    await participantsHelper.expectParticipantInList(participant1);
    await participantsHelper.expectParticipantInList(participant2);
  });

  test('deve exibir erro ao tentar adicionar participante duplicado', async () => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);
    await participantsHelper.openManageParticipants();

    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectSuccessNotification('adicionado com sucesso');

    await participantsHelper.addParticipant(participantEmail);

    await participantsHelper.expectErrorNotification('já existe|duplicado|já.*participante');
  });

  test('deve sincronizar contagem de participantes após remover', async () => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participant1 = 'participant1@example.com';
    const participant2 = 'participant2@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);
    await participantsHelper.openManageParticipants();
    await participantsHelper.addParticipant(participant1);
    await participantsHelper.addParticipant(participant2);
    await participantsHelper.expectParticipantCount(2);

    await participantsHelper.removeParticipant(participant1);
    await participantsHelper.expectSuccessNotification('removido com sucesso');

    await participantsHelper.expectParticipantCount(1);
    await participantsHelper.expectParticipantNotInList(participant1);
    await participantsHelper.expectParticipantInList(participant2);
  });
});
