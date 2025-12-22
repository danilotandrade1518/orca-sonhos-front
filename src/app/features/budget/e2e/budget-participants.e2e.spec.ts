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

    // Autenticar usuário de teste
    await authHelper.login('test-user-id', 'test@example.com', 'Test User');
  });

  test('deve criar orçamento SHARED e adicionar participante', async ({ page }) => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    // Criar orçamento SHARED
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    // Navegar para detalhes do orçamento
    await budgetHelper.clickBudget(budgetName);

    // Abrir modal de participantes
    await participantsHelper.openManageParticipants();

    // Adicionar participante
    await participantsHelper.addParticipant(participantEmail);

    // Verificar notificação de sucesso
    await participantsHelper.expectSuccessNotification(/adicionado com sucesso/i);

    // Verificar que participante aparece na lista
    await participantsHelper.expectParticipantInList(participantEmail);

    // Verificar contagem de participantes
    await participantsHelper.expectParticipantCount(1);
  });

  test('deve remover participante de orçamento SHARED', async ({ page }) => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    // Criar orçamento SHARED e adicionar participante
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

    // Remover participante
    await participantsHelper.removeParticipant(participantEmail);

    // Verificar notificação de sucesso
    await participantsHelper.expectSuccessNotification(/removido com sucesso/i);

    // Verificar que participante não aparece mais
    await participantsHelper.expectParticipantNotInList(participantEmail);

    // Verificar contagem de participantes
    await participantsHelper.expectParticipantCount(0);
  });

  test('deve exibir erro ao tentar adicionar participante em orçamento PERSONAL', async ({ page }) => {
    const budgetName = `Orçamento Pessoal ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    // Criar orçamento PERSONAL
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'PERSONAL');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    // Navegar para detalhes
    await budgetHelper.clickBudget(budgetName);

    // Tentar abrir modal de participantes (pode não estar disponível)
    // Ou tentar adicionar diretamente se o botão existir
    const manageButton = page.getByRole('button', { name: /gerenciar participantes/i });

    if (await manageButton.isVisible()) {
      await participantsHelper.openManageParticipants();

      // Tentar adicionar participante
      await participantsHelper.addParticipant(participantEmail);

      // Verificar mensagem de erro
      await participantsHelper.expectPersonalBudgetError();
    } else {
      // Se o botão não estiver visível, isso também é válido
      // Orçamentos PERSONAL não devem permitir gerenciar participantes
      await expect(manageButton).not.toBeVisible();
    }
  });

  test('deve atualizar contagem de participantes após adicionar múltiplos', async ({ page }) => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participant1 = 'participant1@example.com';
    const participant2 = 'participant2@example.com';

    // Criar orçamento SHARED
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);
    await participantsHelper.openManageParticipants();

    // Adicionar primeiro participante
    await participantsHelper.addParticipant(participant1);
    await participantsHelper.expectSuccessNotification(/adicionado com sucesso/i);
    await participantsHelper.expectParticipantCount(1);

    // Adicionar segundo participante
    await participantsHelper.addParticipant(participant2);
    await participantsHelper.expectSuccessNotification(/adicionado com sucesso/i);
    await participantsHelper.expectParticipantCount(2);

    // Verificar que ambos aparecem
    await participantsHelper.expectParticipantInList(participant1);
    await participantsHelper.expectParticipantInList(participant2);
  });

  test('deve exibir erro ao tentar adicionar participante duplicado', async ({ page }) => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participantEmail = 'participant@example.com';

    // Criar orçamento SHARED
    await budgetHelper.navigateToBudgetList();
    await budgetHelper.waitForBudgetList();
    await budgetHelper.clickCreateBudget();
    await budgetHelper.fillBudgetForm(budgetName, 'SHARED');
    await budgetHelper.saveBudgetForm();
    await budgetHelper.waitForBudgetList();

    await budgetHelper.clickBudget(budgetName);
    await participantsHelper.openManageParticipants();

    // Adicionar participante pela primeira vez
    await participantsHelper.addParticipant(participantEmail);
    await participantsHelper.expectSuccessNotification(/adicionado com sucesso/i);

    // Tentar adicionar novamente
    await participantsHelper.addParticipant(participantEmail);

    // Verificar mensagem de erro
    await participantsHelper.expectErrorNotification(/já existe|duplicado|já.*participante/i);
  });

  test('deve sincronizar contagem de participantes após remover', async ({ page }) => {
    const budgetName = `Orçamento Compartilhado ${Date.now()}`;
    const participant1 = 'participant1@example.com';
    const participant2 = 'participant2@example.com';

    // Criar orçamento e adicionar dois participantes
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

    // Remover um participante
    await participantsHelper.removeParticipant(participant1);
    await participantsHelper.expectSuccessNotification(/removido com sucesso/i);

    // Verificar que contagem foi atualizada
    await participantsHelper.expectParticipantCount(1);
    await participantsHelper.expectParticipantNotInList(participant1);
    await participantsHelper.expectParticipantInList(participant2);
  });
});
