import { Page, expect } from '@playwright/test';

export class BudgetHelper {
  constructor(private page: Page) {}

  async navigateToBudgetList(): Promise<void> {

    const budgetsLink = this.page.getByRole('link', { name: /^orçamentos$/i }).or(
      this.page.getByRole('navigation').getByText(/^orçamentos$/i)
    ).first();

    await budgetsLink.waitFor({ state: 'visible', timeout: 10000 });
    await budgetsLink.click();

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    await this.waitForBudgetList();
  }

  async clickCreateBudget(): Promise<void> {
    const tryClick = async (regex: RegExp) => {
      const btn = this.page.getByRole('button', { name: regex }).first();
      const visible = await btn.isVisible({ timeout: 1500 }).catch(() => false);
      if (!visible) return false;
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      return true;
    };

    await tryClick(/novo orçamento/i);
    await tryClick(/criar orçamento/i);

    await this.page.waitForTimeout(300);

    if (!this.page.url().includes('/budgets/new')) {

      if (!this.page.url().includes('/budgets')) {
        await this.navigateToBudgetList();
      }

      await tryClick(/novo orçamento/i);
      await tryClick(/criar orçamento/i);
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async fillBudgetForm(name: string, type?: 'PERSONAL' | 'SHARED'): Promise<void> {
    await this.page.getByText('Criar Orçamento').or(this.page.getByText('Editar Orçamento')).first().waitFor({
      state: 'visible',
      timeout: 15000,
    }).catch(() => {});

    const nameInput = this.page
      .locator('os-form-field')
      .filter({ hasText: 'Nome do Orçamento' })
      .locator('input')
      .first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });

    await nameInput.click();
    await nameInput.fill(name);

    await this.page.evaluate(({ value }) => {
      const doc = (globalThis as unknown as { document?: unknown }).document;
      if (!doc || typeof doc !== 'object') return;
      const selector = 'input[aria-label="Nome do Orçamento"], input#field-name, input[type="text"]';
      const querySelector = (doc as { querySelector?: (selector: string) => unknown }).querySelector;
      const input = querySelector ? querySelector.call(doc, selector) : null;
      if (!input || typeof input !== 'object') return;
      const el = input as { value?: unknown };
      if (String(el.value ?? '') !== value) el.value = value;
      const dispatchEvent = (input as { dispatchEvent?: (event: Event) => boolean }).dispatchEvent;
      if (typeof dispatchEvent === 'function') {
        (input as { dispatchEvent: (event: Event) => boolean }).dispatchEvent(
          new Event('input', { bubbles: true, cancelable: true })
        );
        (input as { dispatchEvent: (event: Event) => boolean }).dispatchEvent(
          new Event('change', { bubbles: true, cancelable: true })
        );
        (input as { dispatchEvent: (event: Event) => boolean }).dispatchEvent(
          new Event('blur', { bubbles: true, cancelable: true })
        );
      }
    }, { value: name });

    if (type) {
      const typeCombo = this.page.getByRole('combobox', { name: /^tipo$/i }).first();
      const isTypeEnabled = await typeCombo.isEnabled().catch(() => false);
      if (isTypeEnabled) {
        await typeCombo.click();
        await this.page.getByRole('option', { name: /pessoal/i }).first().waitFor({ state: 'visible', timeout: 5000 });
        if (type === 'SHARED') {
          await this.page.getByRole('option', { name: /compartilhado/i }).click();
        } else {
          await this.page.getByRole('option', { name: /pessoal/i }).click();
        }
      }
    }

    await this.page.waitForTimeout(300);
  }

  async saveBudgetForm(): Promise<void> {
    const saveButton = this.page.getByRole('button', { name: /^(criar|salvar)$/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });

    await this.page.waitForFunction(
      () => {
        const doc = (globalThis as unknown as { document?: unknown }).document;
        if (!doc || typeof doc !== 'object') return true;
        const querySelectorAll = (doc as { querySelectorAll?: (selector: string) => unknown }).querySelectorAll;
        const list = querySelectorAll ? querySelectorAll.call(doc, 'button') : null;
        if (!list || typeof list !== 'object') return true;
        const buttons = Array.from(list as ArrayLike<unknown>);
        const btn = buttons.find((b) => {
          if (!b || typeof b !== 'object') return false;
          const textContent = (b as { textContent?: unknown }).textContent;
          return /^(criar|salvar)$/i.test(String(textContent ?? '').trim());
        });
        if (!btn) return true;
        const disabled = (btn as { disabled?: unknown }).disabled;
        const hasAttribute = (btn as { hasAttribute?: (name: string) => unknown }).hasAttribute;
        return disabled !== true && hasAttribute?.('disabled') !== true;
      },
      { timeout: 15000 }
    ).catch(() => {});

    const enabled = await saveButton.isEnabled().catch(() => true);
    if (!enabled) {
      throw new Error('Botão de salvar/criar ainda está desabilitado. Formulário pode não estar válido.');
    }

    await saveButton.click({ force: true });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async cancelBudgetForm(): Promise<void> {
    await this.page.getByRole('button', { name: /cancelar/i }).click();
    await this.page.waitForTimeout(300);
  }

  async expectBudgetInList(budgetName: string): Promise<void> {
    await expect(this.page.locator('os-budget-card').filter({ hasText: budgetName }).first()).toBeVisible();
  }

  async clickBudget(budgetName: string): Promise<void> {
    await expect(this.page.getByText(budgetName)).toBeVisible();
  }

  async clickEditBudget(budgetName: string): Promise<void> {
    const card = this.page.locator('os-budget-card').filter({ hasText: budgetName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const editButton = card.locator('os-edit-button button').first();
    await editButton.waitFor({ state: 'visible', timeout: 10000 });
    await editButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickDeleteBudget(budgetName: string): Promise<void> {
    const card = this.page.locator('os-budget-card').filter({ hasText: budgetName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const deleteButton = card.locator('os-delete-button button').first();
    await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await deleteButton.click();
    await this.page.waitForTimeout(200);
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /^excluir$/i }).first().click();
  }

  async cancelDelete(): Promise<void> {

    const modal = this.page.locator('os-modal-template').first();
    const cancelBtn = modal.getByRole('button', { name: /cancelar/i }).first();
    await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
    await cancelBtn.click();
  }

  async expectSuccessNotification(message?: string | RegExp): Promise<void> {
    const notification = message
      ? this.page.getByText(message).first()
      : this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  async expectErrorNotification(message?: string | RegExp): Promise<void> {
    const notification = message
      ? this.page.getByText(message).first()
      : this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  async expectBudgetNotInList(budgetName: string): Promise<void> {
    await expect(this.page.locator('os-budget-card').filter({ hasText: budgetName })).toHaveCount(0);
  }

  async waitForBudgetList(): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    await Promise.race([
      this.page
        .waitForSelector('os-entity-list', { state: 'visible', timeout: 10000 })
        .catch(() => null),
      this.page
        .waitForSelector('text=Orçamentos', { state: 'visible', timeout: 10000 })
        .catch(() => null),
      this.page
        .waitForSelector('text=Nenhum orçamento encontrado', { state: 'visible', timeout: 10000 })
        .catch(() => null),
    ]);

    await this.page.waitForTimeout(500);
  }

  async waitForCreateBudgetResponse(): Promise<string | null> {
    const resp = await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/budget/create-budget'),
        { timeout: 20000 }
      )
      .catch(() => null);

    if (!resp) return null;
    const json = (await resp.json().catch(() => null)) as { id?: string } | null;
    return json?.id ?? null;
  }

  async waitForUpdateBudgetResponse(): Promise<void> {
    await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/budget/update-budget'),
        { timeout: 20000 }
      )
      .catch(() => null);
  }

  async waitForDeleteBudgetResponse(): Promise<void> {
    await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/budget/delete-budget'),
        { timeout: 20000 }
      )
      .catch(() => null);
  }
}
