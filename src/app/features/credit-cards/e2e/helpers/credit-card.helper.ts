import { Page, expect } from '@playwright/test';

export class CreditCardHelper {
  constructor(private page: Page) {}

  private async ensureBudgetSelected(): Promise<void> {
    const budgetCombobox = this.page.getByRole('combobox', { name: /seletor de orçamento/i }).first();
    const trigger = budgetCombobox.locator('button').first();

    const hasSelection = async (): Promise<boolean> => {
      const txt = (await budgetCombobox.textContent().catch(() => '')) ?? '';
      return !/selecionar orçamento|nenhum orçamento selecionado/i.test(txt);
    };

    if (await hasSelection()) return;

    const tryOpenAndSelectFirst = async (): Promise<boolean> => {
      const enabled = await trigger.isEnabled().catch(() => false);
      if (!enabled) return false;

      await trigger.click({ force: true });
      const firstOption = this.page.getByRole('option').first();
      const visible = await firstOption.isVisible({ timeout: 2000 }).catch(() => false);
      if (!visible) {
        await this.page.keyboard.press('Escape').catch(() => {});
        return false;
      }
      await firstOption.click();
      await this.page.waitForTimeout(500);
      return await hasSelection();
    };

    if (await tryOpenAndSelectFirst()) return;

    const returnUrl = this.page.url();
    const budgetName = `E2E Orçamento Cartões ${Date.now()}`;

    const budgetsLink = this.page.getByRole('link', { name: /^orçamentos$/i }).or(
      this.page.getByRole('navigation').getByText(/^orçamentos$/i)
    ).first();
    await budgetsLink.waitFor({ state: 'visible', timeout: 10000 });
    await budgetsLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);

    const createBtn = this.page.getByRole('button', { name: /(novo|criar) orçamento/i }).first();
    await createBtn.waitFor({ state: 'visible', timeout: 10000 });
    await createBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);

    const nameInput = this.page
      .locator('os-form-field')
      .filter({ hasText: 'Nome do Orçamento' })
      .locator('input')
      .first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.click();
    await nameInput.fill(budgetName);

    const typeCombo = this.page.getByRole('combobox', { name: /^tipo$/i }).first();
    const typeEnabled = await typeCombo.isVisible({ timeout: 1000 }).catch(() => false);
    if (typeEnabled) {
      await typeCombo.click().catch(() => {});
      const personalOpt = this.page.getByRole('option', { name: /pessoal/i }).first();
      if (await personalOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
        await personalOpt.click().catch(() => {});
      }
    }

    const saveBtn = this.page.getByRole('button', { name: /^(criar|salvar)$/i }).first();
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await expect(saveBtn).toBeEnabled({ timeout: 15000 });
    await saveBtn.click({ force: true });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(800);

    if (returnUrl.includes('/credit-cards')) {
      const creditCardsLink = this.page.getByRole('link', { name: /^cartões de crédito$/i }).or(
        this.page.getByRole('navigation').getByText(/^cartões de crédito$/i)
      ).first();
      await creditCardsLink.waitFor({ state: 'visible', timeout: 10000 });
      await creditCardsLink.click();
    } else {
      await this.page.goto(returnUrl, { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);

    const budgetComboboxAfter = this.page.getByRole('combobox', { name: /seletor de orçamento/i }).first();
    const triggerAfter = budgetComboboxAfter.locator('button').first();
    await triggerAfter.waitFor({ state: 'visible', timeout: 10000 });
    await triggerAfter.click({ force: true });
    const createdOption = this.page.getByRole('option', { name: new RegExp(budgetName) }).first();
    if (await createdOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createdOption.click();
    } else {
      await this.page.getByRole('option').first().click();
    }
    await this.page.waitForTimeout(500);
  }

  async navigateToCreditCardList(): Promise<void> {
    const creditCardsLink = this.page.getByRole('link', { name: /^cartões de crédito$/i }).or(
      this.page.getByRole('navigation').getByText(/^cartões de crédito$/i)
    ).first();

    await creditCardsLink.waitFor({ state: 'visible', timeout: 10000 });
    await creditCardsLink.click();

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    await this.waitForCreditCardList();
  }

  async waitForCreditCardList(): Promise<void> {
    await this.ensureBudgetSelected();

    await this.page.waitForSelector('os-credit-card-card, [data-testid="empty-state"]', {
      state: 'visible',
      timeout: 15000,
    });
    await this.page.waitForTimeout(500);
  }

  async clickCreateCreditCard(): Promise<void> {
    const tryClick = async (regex: RegExp) => {
      const btn = this.page.getByRole('button', { name: regex }).first();
      const visible = await btn.isVisible({ timeout: 1500 }).catch(() => false);
      if (!visible) return false;
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      return true;
    };

    await tryClick(/novo cartão/i);
    await tryClick(/criar cartão/i);

    await this.page.waitForTimeout(300);

    if (!this.page.url().includes('/credit-cards/new')) {
      if (!this.page.url().includes('/credit-cards')) {
        await this.navigateToCreditCardList();
      }

      await tryClick(/novo cartão/i);
      await tryClick(/criar cartão/i);
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async fillCreditCardForm(
    name: string,
    limit: string,
    closingDay: string,
    dueDay: string
  ): Promise<void> {
    await this.ensureBudgetSelected();

    await this.page
      .getByText('Novo Cartão')
      .or(this.page.getByText('Editar Cartão'))
      .first()
      .waitFor({
        state: 'visible',
        timeout: 15000,
      })
      .catch(() => {});

    const nameInput = this.page
      .locator('os-form-field')
      .filter({ hasText: 'Nome' })
      .locator('input')
      .first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.click();
    await nameInput.fill(name);

    const limitInput = this.page
      .locator('os-form-field')
      .filter({ hasText: /limite/i })
      .locator('input')
      .first();
    await limitInput.waitFor({ state: 'visible', timeout: 10000 });
    await limitInput.click();
    await limitInput.fill(limit);

    const closingDayInput = this.page
      .locator('os-form-field')
      .filter({ hasText: /dia de fechamento/i })
      .locator('input')
      .first();
    await closingDayInput.waitFor({ state: 'visible', timeout: 10000 });
    await closingDayInput.click();
    await closingDayInput.fill(closingDay);

    const dueDayInput = this.page
      .locator('os-form-field')
      .filter({ hasText: /dia de vencimento/i })
      .locator('input')
      .first();
    await dueDayInput.waitFor({ state: 'visible', timeout: 10000 });
    await dueDayInput.click();
    await dueDayInput.fill(dueDay);

    await this.page.waitForTimeout(500);
  }

  async saveCreditCardForm(): Promise<void> {
    const saveButton = this.page.getByRole('button', { name: /^(criar|salvar)$/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });

    await expect(saveButton).toBeEnabled({ timeout: 20000 });
    await saveButton.click({ force: true });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async expectCreditCardInList(creditCardName: string): Promise<void> {
    await expect(
      this.page.locator('os-credit-card-card').filter({ hasText: creditCardName }).first()
    ).toBeVisible();
  }

  async expectCreditCardNotInList(creditCardName: string): Promise<void> {
    await expect(
      this.page.locator('os-credit-card-card').filter({ hasText: creditCardName })
    ).not.toBeVisible();
  }

  async clickEditCreditCard(creditCardName: string): Promise<void> {
    const card = this.page.locator('os-credit-card-card').filter({ hasText: creditCardName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const editButton = card.getByRole('button', { name: /editar/i }).first();
    await editButton.waitFor({ state: 'visible', timeout: 5000 });
    await editButton.click({ force: true });

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async clickDeleteCreditCard(creditCardName: string): Promise<void> {
    const card = this.page.locator('os-credit-card-card').filter({ hasText: creditCardName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const deleteButton = card.getByRole('button', { name: /excluir|deletar/i }).first();
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click({ force: true });

    await this.page.waitForTimeout(300);
  }

  async confirmDelete(): Promise<void> {
    const confirmButton = this.page.getByRole('button', { name: /confirmar|sim/i }).first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click({ force: true });
    await this.page.waitForTimeout(300);
  }

  async cancelDelete(): Promise<void> {
    const cancelButton = this.page.getByRole('button', { name: /cancelar|não/i }).first();
    await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await cancelButton.click({ force: true });
    await this.page.waitForTimeout(300);
  }

  async expectSuccessNotification(message: RegExp): Promise<void> {
    await expect(this.page.getByText(message).first()).toBeVisible({ timeout: 10000 });
  }

  waitForCreateCreditCardResponse(): Promise<string> {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes('/credit-card/create-credit-card') && response.status() === 201,
      { timeout: 15000 }
    ).then(async (response) => {
      const body = (await response.json()) as { id?: string };
      return body.id || '';
    });
  }

  waitForUpdateCreditCardResponse(): Promise<void> {
    return this.page
      .waitForResponse(
        (response) =>
          response.url().includes('/credit-card/update-credit-card') && response.status() === 200,
        { timeout: 15000 }
      )
      .then(() => {});
  }

  waitForDeleteCreditCardResponse(): Promise<void> {
    return this.page
      .waitForResponse(
        (response) =>
          response.url().includes('/credit-card/delete-credit-card') && response.status() === 200,
        { timeout: 15000 }
      )
      .then(() => {});
  }
}

