import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';
import { BudgetHelper } from './helpers/budget.helper';
import { ParticipantsHelper } from './helpers/participants.helper';

test.describe('Budget Participants E2E (UI atual)', () => {
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
    const budgetName = `E2E Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'ana@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await participantsHelper.navigateToBudgetDetail(budgetId!);

    await participantsHelper.openManageParticipants();
    await participantsHelper.addParticipant(participantEmail);

    await participantsHelper.expectSuccessNotification(/participante adicionado com sucesso/i);
    await participantsHelper.expectParticipantInList(participantEmail);
    await participantsHelper.expectParticipantCount(2);
    
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve remover participante de orçamento SHARED', async () => {
    const budgetName = `E2E Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'ana@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await participantsHelper.navigateToBudgetDetail(budgetId!);

    await participantsHelper.openManageParticipants();
    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectParticipantInList(participantEmail);
    await participantsHelper.expectParticipantCount(2);

    await participantsHelper.removeParticipant(participantEmail);
    await participantsHelper.expectSuccessNotification(/participante removido com sucesso/i);
    await participantsHelper.expectParticipantNotInList(participantEmail);
    await participantsHelper.expectParticipantCount(1);
    
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve exibir erro ao tentar adicionar participante em orçamento PERSONAL', async () => {
    const budgetName = `E2E Orçamento Pessoal ${Date.now()}`;
    const participantEmail = 'ana@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await participantsHelper.navigateToBudgetDetail(budgetId!);

    await participantsHelper.openManageParticipants();
    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectPersonalBudgetError();
    
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve atualizar contagem de participantes após adicionar múltiplos', async () => {
    const budgetName = `E2E Orçamento Compartilhado ${Date.now()}`;
    const participant1 = 'ana@example.com';
    const participant2 = 'joao@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await participantsHelper.navigateToBudgetDetail(budgetId!);
    await participantsHelper.openManageParticipants();

    await participantsHelper.addParticipant(participant1);
    await participantsHelper.expectSuccessNotification(/participante adicionado com sucesso/i);
    await participantsHelper.expectParticipantCount(2);

    await participantsHelper.addParticipant(participant2);
    await participantsHelper.expectSuccessNotification(/participante adicionado com sucesso/i);
    await participantsHelper.expectParticipantCount(3);

    await participantsHelper.expectParticipantInList(participant1);
    await participantsHelper.expectParticipantInList(participant2);
    
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve exibir erro ao tentar adicionar participante duplicado', async () => {
    const budgetName = `E2E Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'ana@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await participantsHelper.navigateToBudgetDetail(budgetId!);
    await participantsHelper.openManageParticipants();

    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectSuccessNotification(/participante adicionado com sucesso/i);

    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectErrorNotification(/j[aá]\s+é\s+participante/i);
    
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });

  test('deve sincronizar contagem de participantes após remover', async () => {
    const budgetName = `E2E Orçamento Compartilhado ${Date.now()}`;
    const participant1 = 'ana@example.com';
    const participant2 = 'joao@example.com';

    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    const waitCreate = budgetHelper.waitForCreateBudgetResponse();
    await budgetHelper.saveBudgetForm();
    const budgetId = await waitCreate;
    expect(budgetId).toBeTruthy();

    await participantsHelper.navigateToBudgetDetail(budgetId!);
    await participantsHelper.openManageParticipants();

    await participantsHelper.addParticipant(participant1);
    await participantsHelper.addParticipant(participant2);
    await participantsHelper.expectParticipantCount(3);

    await participantsHelper.removeParticipant(participant1);
    await participantsHelper.expectSuccessNotification(/participante removido com sucesso/i);

    await participantsHelper.expectParticipantCount(2);
    await participantsHelper.expectParticipantNotInList(participant1);
    await participantsHelper.expectParticipantInList(participant2);
    
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    const waitDelete = budgetHelper.waitForDeleteBudgetResponse();
    await budgetHelper.clickDeleteBudget(budgetName);
    await budgetHelper.confirmDelete();
    await waitDelete;
  });
});
