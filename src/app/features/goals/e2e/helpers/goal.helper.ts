import { Page, expect } from '@playwright/test';

export class GoalHelper {
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
    const budgetName = `E2E Orçamento Metas ${Date.now()}`;
    
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
    
    if (returnUrl.includes('/goals')) {
      const metasLink = this.page.getByRole('link', { name: /^metas$/i }).or(
        this.page.getByRole('navigation').getByText(/^metas$/i)
      ).first();
      await metasLink.waitFor({ state: 'visible', timeout: 10000 });
      await metasLink.click();
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
  
  async navigateToGoalList(): Promise<void> {
    
    const metasLink = this.page.getByRole('link', { name: /^metas$/i }).or(
      this.page.getByRole('navigation').getByText(/^metas$/i)
    ).first();
    
    await metasLink.waitFor({ state: 'visible', timeout: 10000 });
    await metasLink.click();
    
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    await this.waitForGoalList();
  }

  async clickCreateGoal(): Promise<void> {
    const tryClick = async (regex: RegExp) => {
      const btn = this.page.getByRole('button', { name: regex }).first();
      const visible = await btn.isVisible({ timeout: 1500 }).catch(() => false);
      if (!visible) return false;
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      return true;
    };

    await tryClick(/nova meta/i);
    await tryClick(/criar meta/i);

    await this.page.waitForTimeout(300);
    
    if (!this.page.url().includes('/goals/new')) {
      
      if (!this.page.url().includes('/goals')) {
        await this.navigateToGoalList();
      }
      
      await tryClick(/nova meta/i);
      await tryClick(/criar meta/i);
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async fillGoalForm(
    name: string,
    totalAmount: string,
    deadline?: string,
    sourceAccountId?: string
  ): Promise<void> {
    
    await this.ensureBudgetSelected();

    await this.page
      .getByText('Nova Meta')
      .or(this.page.getByText('Editar Meta'))
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

    await this.page.evaluate(({ value }) => {
      const doc = (globalThis as unknown as { document?: unknown }).document;
      if (!doc || typeof doc !== 'object') return;
      const selector = 'input[aria-label="Nome"], input#field-name, input[type="text"]';
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
    
    const totalAmountInput = this.page
      .locator('os-form-field')
      .filter({ hasText: 'Valor alvo' })
      .locator('input')
      .first();
    await totalAmountInput.waitFor({ state: 'visible', timeout: 10000 });
    await totalAmountInput.click();
    await totalAmountInput.fill(totalAmount);

    await this.page.evaluate(({ value }) => {
      const doc = (globalThis as unknown as { document?: unknown }).document;
      if (!doc || typeof doc !== 'object') return;
      const selector = 'input[aria-label="Valor alvo"], input[type="number"]';
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
    }, { value: totalAmount });
    
    if (deadline) {
      const datePicker = this.page.locator('os-date-picker').first();
      await datePicker.waitFor({ state: 'visible', timeout: 10000 });
      const dateInput = datePicker.locator('input').first();
      await dateInput.fill(deadline);
      await this.page.waitForTimeout(300);
    }
    
    const accountCombo = this.page.getByRole('combobox', { name: /conta de origem/i }).first();
    await accountCombo.waitFor({ state: 'visible', timeout: 15000 });
    await accountCombo.click({ force: true });
    
    const options = this.page.getByRole('option');
    await options.first().waitFor({ state: 'visible', timeout: 15000 });

    if (sourceAccountId) {
      const preferred = options.filter({ hasText: new RegExp(sourceAccountId) }).first();
      if (await preferred.isVisible({ timeout: 1500 }).catch(() => false)) {
        await preferred.click();
      } else {
        await options.first().click();
      }
    } else {
      await options.first().click();
    }
    
    await this.page
      .waitForFunction(() => {
        const combo = document.querySelector('[role="combobox"][aria-label*="Conta de origem"]');
        if (!combo) return true;
        const txt = (combo.textContent || '').toLowerCase();
        return !txt.includes('selecione uma conta');
      })
      .catch(() => {});
    
    await this.page.waitForTimeout(1500);
  }

  async saveGoalForm(): Promise<void> {
    const saveButton = this.page.getByRole('button', { name: /^(criar|salvar)$/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    
    await expect(saveButton).toBeEnabled({ timeout: 20000 });
    await saveButton.click({ force: true });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async cancelGoalForm(): Promise<void> {
    await this.page.getByRole('button', { name: /cancelar/i }).click();
    await this.page.waitForTimeout(300);
  }

  async expectGoalInList(goalName: string): Promise<void> {
    await expect(this.page.locator('os-goal-progress-card').filter({ hasText: goalName }).first()).toBeVisible();
  }

  async clickGoal(goalName: string): Promise<void> {
    const card = this.page.locator('os-goal-progress-card').filter({ hasText: goalName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickEditGoal(goalName: string): Promise<void> {
    const card = this.page.locator('os-goal-progress-card').filter({ hasText: goalName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const editButton = card.locator('button').filter({ hasText: /editar/i }).first();
    await editButton.waitFor({ state: 'visible', timeout: 10000 });
    await editButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickDeleteGoal(goalName: string): Promise<void> {
    const card = this.page.locator('os-goal-progress-card').filter({ hasText: goalName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const deleteButton = card.locator('button').filter({ hasText: /excluir/i }).first();
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

  async expectGoalNotInList(goalName: string): Promise<void> {
    await expect(this.page.locator('os-goal-progress-card').filter({ hasText: goalName })).toHaveCount(0);
  }

  async waitForGoalList(): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    await Promise.race([
      this.page
        .waitForSelector('os-goal-list', { state: 'visible', timeout: 10000 })
        .catch(() => null),
      this.page
        .waitForSelector('text=Metas', { state: 'visible', timeout: 10000 })
        .catch(() => null),
      this.page
        .waitForSelector('text=Nenhuma meta encontrada', { state: 'visible', timeout: 10000 })
        .catch(() => null),
    ]);

    await this.page.waitForTimeout(500);
  }

  async waitForCreateGoalResponse(): Promise<string | null> {
    const resp = await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/goal/create-goal'),
        { timeout: 20000 }
      )
      .catch(() => null);

    if (!resp) return null;
    const json = (await resp.json().catch(() => null)) as { id?: string } | null;
    return json?.id ?? null;
  }

  async waitForUpdateGoalResponse(): Promise<void> {
    await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/goal/update-goal'),
        { timeout: 20000 }
      )
      .catch(() => null);
  }

  async waitForDeleteGoalResponse(): Promise<void> {
    await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/goal/delete-goal'),
        { timeout: 20000 }
      )
      .catch(() => null);
  }
  
  async navigateToGoalDetail(goalName: string): Promise<void> {
    await this.navigateToGoalList();
    await this.clickGoal(goalName);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
  
  async navigateToGoalEdit(goalName: string): Promise<void> {
    await this.navigateToGoalList();
    await this.clickEditGoal(goalName);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
  
  async navigateToAddAmount(goalName: string): Promise<void> {
    
    if (this.page.url().includes('/goals/') && !this.page.url().includes('/goals/new') && !this.page.url().includes('/goals/edit')) {
      const addButton = this.page.getByRole('button', { name: /aportar/i }).first();
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      await addButton.click();
    } else {
      
      await this.navigateToGoalList();
      await this.clickAddAmountButton(goalName);
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
  
  async navigateToRemoveAmount(goalName: string): Promise<void> {
    
    if (this.page.url().includes('/goals/') && !this.page.url().includes('/goals/new') && !this.page.url().includes('/goals/edit')) {
      const removeButton = this.page.getByRole('button', { name: /remover/i }).first();
      await removeButton.waitFor({ state: 'visible', timeout: 10000 });
      await removeButton.click();
    } else {
      
      await this.navigateToGoalList();
      await this.clickRemoveAmountButton(goalName);
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async fillAmountForm(amount: string): Promise<void> {
    await this.page
      .getByText('Adicionar Aporte')
      .or(this.page.getByText('Remover Aporte'))
      .first()
      .waitFor({
        state: 'visible',
        timeout: 15000,
      })
      .catch(() => {});

    const amountInput = this.page
      .locator('os-money-input')
      .first()
      .locator('input[matInput]')
      .or(this.page.locator('os-money-input').first().locator('input'))
      .first();
    await amountInput.waitFor({ state: 'visible', timeout: 10000 });

    await amountInput.click();
    await amountInput.clear();
    await amountInput.fill(amount);
    await amountInput.blur();

    await this.page.evaluate(({ value }) => {
      const doc = (globalThis as unknown as { document?: unknown }).document;
      if (!doc || typeof doc !== 'object') return;
      const selector = 'os-money-input input[matInput], os-money-input input[type="text"], os-money-input input';
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
    }, { value: amount });

    await this.page.waitForTimeout(500);
  }

  async saveAmountForm(): Promise<void> {
    
    await this.page.waitForFunction(
      () => {
        const doc = (globalThis as unknown as { document?: unknown }).document;
        if (!doc || typeof doc !== 'object') return false;
        const querySelectorAll = (doc as { querySelectorAll?: (selector: string) => unknown }).querySelectorAll;
        const list = querySelectorAll ? querySelectorAll.call(doc, 'button') : null;
        if (!list || typeof list !== 'object') return false;
        const buttons = Array.from(list as ArrayLike<unknown>);
        const btn = buttons.find((b) => {
          if (!b || typeof b !== 'object') return false;
          const textContent = (b as { textContent?: unknown }).textContent;
          return /^(adicionar|remover)$/i.test(String(textContent ?? '').trim());
        });
        if (!btn) return false;
        const disabled = (btn as { disabled?: unknown }).disabled;
        const hasAttribute = (btn as { hasAttribute?: (name: string) => unknown }).hasAttribute;
        return disabled !== true && hasAttribute?.('disabled') !== true;
      },
      { timeout: 20000 }
    ).catch(() => {});

    const saveButton = this.page.getByRole('button', { name: /^(adicionar|remover)$/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    
    const enabled = await saveButton.isEnabled().catch(() => false);
    if (!enabled) {
      
      await this.page.waitForTimeout(1000);
      const enabledAgain = await saveButton.isEnabled().catch(() => false);
      if (!enabledAgain) {
        throw new Error('Botão de salvar ainda está desabilitado. Formulário pode não estar válido.');
      }
    }

    await saveButton.click({ force: true });
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async clickAddAmountButton(goalName: string): Promise<void> {
    const card = this.page.locator('os-goal-progress-card').filter({ hasText: goalName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const addButton = card.locator('button').filter({ hasText: /aportar/i }).first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickRemoveAmountButton(goalName: string): Promise<void> {
    const card = this.page.locator('os-goal-progress-card').filter({ hasText: goalName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });

    const removeButton = card.locator('button').filter({ hasText: /remover/i }).first();
    await removeButton.waitFor({ state: 'visible', timeout: 10000 });
    await removeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAddAmountResponse(): Promise<void> {
    await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/goal/add-amount-goal'),
        { timeout: 20000 }
      )
      .catch(() => null);
  }

  async waitForRemoveAmountResponse(): Promise<void> {
    await this.page
      .waitForResponse(
        (r) => r.request().method() === 'POST' && r.url().includes('/goal/remove-amount-goal'),
        { timeout: 20000 }
      )
      .catch(() => null);
  }

  private escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
