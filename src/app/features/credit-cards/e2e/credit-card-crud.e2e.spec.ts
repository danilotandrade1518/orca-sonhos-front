import { test, expect } from '@playwright/test';
import { AuthHelper } from '../../goals/e2e/helpers/auth.helper';
import { CreditCardHelper } from './helpers/credit-card.helper';

test.describe('Credit Card CRUD E2E', () => {
  let authHelper: AuthHelper;
  let creditCardHelper: CreditCardHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    creditCardHelper = new CreditCardHelper(page);

    await authHelper.login();
  });

  test('deve criar um novo cartão de crédito e aparecer na lista', async () => {
    const creditCardName = `E2E Cartão ${Date.now()}`;
    const limit = '5000.00';
    const closingDay = '15';
    const dueDay = '25';

    await creditCardHelper.navigateToCreditCardList();
    await creditCardHelper.waitForCreditCardList();

    await creditCardHelper.clickCreateCreditCard();
    await creditCardHelper.fillCreditCardForm(creditCardName, limit, closingDay, dueDay);

    const waitCreate = creditCardHelper.waitForCreateCreditCardResponse();
    await creditCardHelper.saveCreditCardForm();
    await waitCreate;

    await creditCardHelper.expectSuccessNotification(/cartão criado com sucesso/i);
    await creditCardHelper.waitForCreditCardList();
    await creditCardHelper.expectCreditCardInList(creditCardName);

    const waitDelete = creditCardHelper.waitForDeleteCreditCardResponse();
    await creditCardHelper.clickDeleteCreditCard(creditCardName);
    await creditCardHelper.confirmDelete();
    await waitDelete;
  });

  test('deve editar um cartão de crédito existente', async ({ request }) => {
    const originalName = `E2E Cartão Original ${Date.now()}`;
    const updatedName = `E2E Cartão Atualizado ${Date.now()}`;
    const limit = '5000.00';
    const updatedLimit = '6000.00';
    const closingDay = '15';
    const dueDay = '25';

    await creditCardHelper.navigateToCreditCardList();
    await creditCardHelper.waitForCreditCardList();

    await creditCardHelper.clickCreateCreditCard();
    await creditCardHelper.fillCreditCardForm(originalName, limit, closingDay, dueDay);

    const waitCreate = creditCardHelper.waitForCreateCreditCardResponse();
    await creditCardHelper.saveCreditCardForm();
    const creditCardId = await waitCreate;
    expect(creditCardId).toBeTruthy();

    await creditCardHelper.expectSuccessNotification(/cartão criado com sucesso/i);
    await creditCardHelper.waitForCreditCardList();
    await creditCardHelper.expectCreditCardInList(originalName);

    await creditCardHelper.clickEditCreditCard(originalName);

    await creditCardHelper.fillCreditCardForm(updatedName, updatedLimit, closingDay, dueDay);
    const waitUpdate = creditCardHelper.waitForUpdateCreditCardResponse();
    await creditCardHelper.saveCreditCardForm();
    await waitUpdate;

    await creditCardHelper.waitForCreditCardList();
    await creditCardHelper.expectCreditCardInList(updatedName);

    const waitDelete = creditCardHelper.waitForDeleteCreditCardResponse();
    await creditCardHelper.clickDeleteCreditCard(updatedName);
    await creditCardHelper.confirmDelete();
    await waitDelete;
  });

  test('deve deletar um cartão de crédito existente', async () => {
    const creditCardName = `E2E Cartão Para Deletar ${Date.now()}`;
    const limit = '5000.00';
    const closingDay = '15';
    const dueDay = '25';

    await creditCardHelper.navigateToCreditCardList();
    await creditCardHelper.waitForCreditCardList();

    await creditCardHelper.clickCreateCreditCard();
    await creditCardHelper.fillCreditCardForm(creditCardName, limit, closingDay, dueDay);

    const waitCreate = creditCardHelper.waitForCreateCreditCardResponse();
    await creditCardHelper.saveCreditCardForm();
    await waitCreate;

    await creditCardHelper.expectSuccessNotification(/cartão criado com sucesso/i);
    await creditCardHelper.waitForCreditCardList();
    await creditCardHelper.expectCreditCardInList(creditCardName);

    const waitDelete = creditCardHelper.waitForDeleteCreditCardResponse();
    await creditCardHelper.clickDeleteCreditCard(creditCardName);
    await creditCardHelper.confirmDelete();
    await waitDelete;

    await creditCardHelper.waitForCreditCardList();
    await creditCardHelper.expectCreditCardNotInList(creditCardName);
  });

  test('deve cancelar a exclusão de um cartão de crédito', async () => {
    const creditCardName = `E2E Cartão Cancelar Exclusão ${Date.now()}`;
    const limit = '5000.00';
    const closingDay = '15';
    const dueDay = '25';

    await creditCardHelper.navigateToCreditCardList();
    await creditCardHelper.waitForCreditCardList();

    await creditCardHelper.clickCreateCreditCard();
    await creditCardHelper.fillCreditCardForm(creditCardName, limit, closingDay, dueDay);

    const waitCreate = creditCardHelper.waitForCreateCreditCardResponse();
    await creditCardHelper.saveCreditCardForm();
    await waitCreate;

    await creditCardHelper.expectSuccessNotification(/cartão criado com sucesso/i);
    await creditCardHelper.waitForCreditCardList();
    await creditCardHelper.expectCreditCardInList(creditCardName);

    await creditCardHelper.clickDeleteCreditCard(creditCardName);
    await creditCardHelper.cancelDelete();
    await creditCardHelper.expectCreditCardInList(creditCardName);

    const waitDelete = creditCardHelper.waitForDeleteCreditCardResponse();
    await creditCardHelper.clickDeleteCreditCard(creditCardName);
    await creditCardHelper.confirmDelete();
    await waitDelete;
  });
});

