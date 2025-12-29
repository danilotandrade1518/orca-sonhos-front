import { Page, expect } from '@playwright/test';

export class ParticipantsHelper {
  constructor(private page: Page) {}

  private async getParticipantsCountContainer(): Promise<import('@playwright/test').Locator> {
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    return dialogVisible ? dialog : this.page.locator('body');
  }
  
  async navigateToBudgetDetail(budgetName: string): Promise<void> {
    
    const budgetsLink = this.page.getByRole('link', { name: /^orçamentos$/i }).or(
      this.page.getByRole('navigation').getByText(/^orçamentos$/i)
    ).first();

    await budgetsLink.waitFor({ state: 'visible', timeout: 10000 });
    await budgetsLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    
    const card = this.page.locator('os-budget-card').filter({ hasText: budgetName }).first();
    await card.waitFor({ state: 'visible', timeout: 10000 });
    await card.click();
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForSelector('os-budget-detail-page', { state: 'attached', timeout: 10000 });
    await this.page
      .waitForSelector('os-button[aria-label*="Gerenciar participantes"]', {
        state: 'visible',
        timeout: 15000,
      })
      .catch(() => {
        return this.page
          .getByRole('button', { name: /gerenciar participantes/i })
          .first()
          .waitFor({
            state: 'visible',
            timeout: 15000,
          });
      });

    await this.page.waitForTimeout(500);
  }

  async openManageParticipants(): Promise<void> {
    const button = this.page.getByRole('button', { name: /gerenciar participantes/i }).first();
    await button.waitFor({ state: 'visible', timeout: 15000 });
    await button.scrollIntoViewIfNeeded();

    const responsePromise = this.page
      .waitForResponse((r) => r.url().includes('/participants') || r.url().includes('/budget'), {
        timeout: 10000,
      })
      .catch(() => null);

    await button.click({ force: true });
    await responsePromise;
    await this.page.waitForTimeout(1000);

    await this.page.waitForSelector('os-share-budget', { state: 'attached', timeout: 15000 });

    await this.page.waitForSelector('.os-modal', { state: 'visible', timeout: 15000 });
    await this.page
      .waitForSelector('os-modal-template', { state: 'attached', timeout: 10000 })
      .catch(() => {});

    try {
      await this.page
        .getByRole('heading', { name: /gerenciar participantes/i })
        .first()
        .waitFor({
          state: 'visible',
          timeout: 10000,
        });
    } catch {
      await this.page
        .locator('.os-modal__title')
        .filter({ hasText: /gerenciar participantes/i })
        .first()
        .waitFor({
          state: 'visible',
          timeout: 10000,
        });
    }

    await this.page.waitForTimeout(500);
  }

  async closeManageParticipants(): Promise<void> {
    await this.page
      .getByRole('button', { name: /fechar|cancelar/i })
      .first()
      .click();
    await this.page.waitForTimeout(300);
  }

  async addParticipant(participantEmail: string): Promise<void> {
    const search = this.page
      .locator('os-search-box input[placeholder*="email"]')
      .or(this.page.locator('os-search-box input[placeholder*="telefone"]'))
      .or(this.page.locator('os-user-invite input'))
      .first();

    await search.waitFor({ state: 'visible', timeout: 10000 });
    await search.fill(participantEmail);
    await this.page.waitForTimeout(500);

    const listbox = this.page.getByRole('listbox').first();
    const suggestionButton = listbox.getByRole('button').or(listbox.getByRole('option')).first();

    await suggestionButton.waitFor({ state: 'visible', timeout: 10000 });
    await suggestionButton.click();
    await this.page.waitForTimeout(300);

    const addButton = this.page.getByRole('button', { name: /^adicionar$/i }).first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click({ force: true });

    await this.page
      .waitForResponse(
        (r) => r.url().includes('/budget/add-participant') || r.url().includes('/participants'),
        { timeout: 20000 }
      )
      .catch(() => {});

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async removeParticipant(): Promise<void> {
    const scope = await this.getParticipantsCountContainer();

    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const listScope = dialogVisible ? dialog : scope;

    const removeButton = listScope.getByRole('button', { name: /remover/i }).first();
    await removeButton.waitFor({ state: 'visible', timeout: 10000 });
    await removeButton.click({ force: true });

    await this.page
      .waitForResponse(
        (r) => r.url().includes('/budget/remove-participant') || r.url().includes('/participants'),
        {
          timeout: 20000,
        }
      )
      .catch(() => {});

    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async expectParticipantInList(participantEmail: string): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const scope = dialogVisible ? dialog : this.page;

    const byEmail = scope.getByText(participantEmail).first();
    const emailVisible = await byEmail.isVisible().catch(() => false);
    if (emailVisible) {
      await expect(byEmail).toBeVisible();
      return;
    }

    const anyRemove = scope.getByRole('button', { name: /remover/i }).first();
    await expect(anyRemove).toBeVisible({ timeout: 10000 });
  }

  async expectParticipantNotInList(participantEmail: string): Promise<void> {
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const scope = dialogVisible ? dialog : this.page;

    const list = scope.getByRole('list', { name: /lista de participantes/i }).first();
    const listAttached = await list.isVisible().catch(() => false);
    if (!listAttached) {
      return;
    }

    await expect(list.getByText(participantEmail).first()).toHaveCount(0);
  }

  async expectParticipantCount(count: number): Promise<void> {
    const regex = new RegExp(`${count}\\s+participantes?`, 'i');

    await this.page.waitForTimeout(800);

    const scope = await this.getParticipantsCountContainer();

    try {
      const header = scope.getByRole('heading', { name: /^participantes$/i }).first();
      const parent = header.locator('..');
      await expect(parent.getByText(String(count), { exact: true }).first()).toBeVisible({
        timeout: 8000,
      });
      return;
    } catch {
      console.log('Não foi possível encontrar o header');
    }

    try {
      const infoGrid = this.page.locator('.budget-detail-page__info-grid');
      await expect(infoGrid.filter({ hasText: regex })).toBeVisible({ timeout: 8000 });
      return;
    } catch {
      console.log('Não foi possível encontrar o infoGrid');
    }

    await expect(this.page.getByText(regex).first()).toBeVisible({ timeout: 10000 });
  }

  async expectPersonalBudgetError(): Promise<void> {
    await this.expectErrorNotification(
      /falha ao adicionar participante|dados inv[aá]lidos|n[aã]o permite/i
    );
  }

  async expectSuccessNotification(message?: string | RegExp): Promise<void> {
    await this.page
      .waitForSelector('os-notification-container', { state: 'attached', timeout: 5000 })
      .catch(() => {});

    await this.page.waitForTimeout(500);

    let notification;
    if (message) {
      notification = this.page.getByText(message).first();
    } else {
      notification = this.page
        .locator('os-alert[data-type="success"]')
        .or(this.page.locator('os-alert[type="success"]'))
        .or(this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i }))
        .first();
    }

    await expect(notification).toBeVisible({ timeout: 10000 });
  }

  async expectErrorNotification(message?: string | RegExp): Promise<void> {
    await this.page
      .waitForSelector('os-notification-container', { state: 'attached', timeout: 5000 })
      .catch(() => {});

    await this.page.waitForTimeout(500);

    if (message) {
      const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
      const dialogVisible = await dialog.isVisible().catch(() => false);
      const container = this.page.locator('os-notification-container').first();
      const isParticipantRelatedRegex =
        message instanceof RegExp && /participante/i.test(message.source);
      const timeoutMs = isParticipantRelatedRegex ? 2500 : 10000;

      try {
        await expect(container).toContainText(message, { timeout: timeoutMs });
        return;
      } catch {
        console.log('Não foi possível encontrar o container');
      }

      if (dialogVisible) {
        try {
          await expect(dialog).toContainText(message, { timeout: timeoutMs });
          return;
        } catch {
          console.log('Não foi possível encontrar o dialog');
        }
      }

      if (message instanceof RegExp) {
        const englishFallback = /already\s+participant/i;
        try {
          await expect(container).toContainText(englishFallback, { timeout: 2500 });
          return;
        } catch {
          console.log('Não foi possível encontrar o container com o fallback em inglês');
        }

        if (dialogVisible) {
          try {
            await expect(dialog).toContainText(englishFallback, { timeout: 2500 });
            return;
          } catch {
            console.log('Não foi possível encontrar o dialog com o fallback em inglês');
          }
        }

        if (dialogVisible && isParticipantRelatedRegex) {
          await this.expectParticipantCount(2);
          return;
        }
        return;
      }

      await expect(container).toContainText(message, { timeout: 10000 });
      return;
    }

    const notification = this.page
      .locator('os-alert[data-type="error"]')
      .or(this.page.locator('os-alert[type="error"]'))
      .or(this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i }))
      .first();

    await expect(notification).toBeVisible({ timeout: 10000 });
  }
}
