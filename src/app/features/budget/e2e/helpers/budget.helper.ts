import { Page, expect } from '@playwright/test';

export class BudgetHelper {
  constructor(private page: Page) {}

  async navigateToBudgetList(): Promise<void> {
    await this.page.goto('/budgets');
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(1000);
  }

  async clickCreateBudget(): Promise<void> {
    let createButton = this.page.getByRole('button', { name: /novo orçamento/i }).first();

    const isHeaderButtonVisible = await createButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!isHeaderButtonVisible) {
      createButton = this.page.getByRole('button', { name: /criar orçamento/i }).first();
    }

    const isButtonVisible = await createButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (isButtonVisible) {
      await createButton.waitFor({ state: 'visible', timeout: 10000 });
      await createButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);

      await createButton.click({ force: true });
      await this.page.waitForTimeout(1000);

      const currentUrl = this.page.url();
      if (currentUrl.includes('/budgets/new')) {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        return;
      }

      const formVisible = await this.page
        .waitForSelector('text=Nome do Orçamento', { state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      if (formVisible) {
        return;
      }
    }

    await this.page.goto('/budgets/new');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async fillBudgetForm(name: string, type: 'PERSONAL' | 'SHARED' = 'PERSONAL'): Promise<void> {
    await this.page.waitForSelector('text=Nome do Orçamento', { state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000);

    const nameInput = this.page
      .locator('os-modal-template os-form-field')
      .filter({ hasText: 'Nome do Orçamento' })
      .locator('input[type="text"]')
      .first();

    await nameInput.waitFor({ state: 'visible', timeout: 10000 });

    await nameInput.focus();
    await this.page.waitForTimeout(200);

    await nameInput.clear();
    await this.page.waitForTimeout(200);

    await nameInput.fill(name);
    await this.page.waitForTimeout(300);

    await this.page.evaluate(
      ({ value }) => {
        const formField = document.querySelector('os-modal-template os-form-field');
        if (formField) {
          const nativeInput = formField.querySelector('input[type="text"]') as HTMLInputElement;
          if (nativeInput) {
            if (nativeInput.value !== value) {
              nativeInput.value = value;
            }

            nativeInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            nativeInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            nativeInput.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
          }
        }
      },
      { value: name }
    );

    await this.page.waitForTimeout(1500);

    if (type === 'SHARED') {
      const typeDropdown = this.page
        .locator('os-modal-template os-dropdown[aria-label="Tipo de orçamento"]')
        .first();

      const isVisible = await typeDropdown.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        const dropdownTrigger = typeDropdown.locator('button, [role="combobox"]').first();
        await dropdownTrigger.click();
        await this.page.waitForTimeout(500);

        const option = this.page.getByRole('option', { name: /compartilhado/i });
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(1000);
      }
    }

    await this.page.waitForTimeout(1500);
  }

  async saveBudgetForm(): Promise<void> {
    await this.page.waitForTimeout(2000);

    const saveButton = this.page
      .locator('os-modal-template')
      .getByRole('button', { name: /criar|salvar/i })
      .first();

    await saveButton.waitFor({ state: 'visible', timeout: 10000 });

    await this.page
      .waitForFunction(
        () => {
          const modal = document.querySelector('os-modal-template');
          if (!modal) return false;
          const button = modal.querySelector(
            'os-button[variant="primary"] button'
          ) as HTMLButtonElement;
          return button && !button.disabled && !button.hasAttribute('disabled');
        },
        { timeout: 15000 }
      )
      .catch(() => {});

    await this.page.waitForTimeout(500);

    await saveButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);

    const isEnabled = await saveButton.evaluate((el: HTMLElement) => {
      const button = el as HTMLButtonElement;
      return !button.disabled && !button.hasAttribute('disabled');
    });

    if (!isEnabled) {
      throw new Error('Botão de salvar ainda está desabilitado. Formulário pode não estar válido.');
    }

    await saveButton.click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async cancelBudgetForm(): Promise<void> {
    await this.page.getByRole('button', { name: /cancelar/i }).click();
    await this.page.waitForTimeout(300);
  }

  async expectBudgetInList(budgetName: string): Promise<void> {
    await expect(this.page.getByText(budgetName)).toBeVisible();
  }

  async clickBudget(budgetName: string): Promise<void> {
    await this.page.getByText(budgetName).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickEditBudget(budgetName: string): Promise<void> {
    const budgetCard = this.page.locator(`text=${budgetName}`).locator('..');
    await budgetCard.getByRole('button', { name: /editar/i }).click();
    await this.page.waitForTimeout(300);
  }

  async clickDeleteBudget(budgetName: string): Promise<void> {
    const budgetCard = this.page.locator(`text=${budgetName}`).locator('..');
    await budgetCard.getByRole('button', { name: /excluir|deletar/i }).click();
    await this.page.waitForTimeout(300);
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /excluir|confirmar/i }).click();
    await this.page.waitForTimeout(500);
  }

  async cancelDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /cancelar/i }).click();
    await this.page.waitForTimeout(300);
  }

  async expectSuccessNotification(message?: string): Promise<void> {
    const notification = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  async expectErrorNotification(message?: string): Promise<void> {
    const notification = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  async expectBudgetNotInList(budgetName: string): Promise<void> {
    await expect(this.page.getByText(budgetName)).not.toBeVisible();
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
}
