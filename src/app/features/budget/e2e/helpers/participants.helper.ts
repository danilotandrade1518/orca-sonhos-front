import { Page, expect } from '@playwright/test';

export class ParticipantsHelper {
  constructor(private page: Page) {}
  
  async navigateToBudgetDetail(budgetId: string): Promise<void> {
    await this.page.goto(`/budgets/${budgetId}`);
    await this.page.waitForLoadState('networkidle');
    
    // Aguardar a página de detalhes estar completamente carregada
    await this.page.waitForSelector('os-budget-detail-page', { state: 'attached', timeout: 10000 });
    await this.page.waitForSelector('os-button[aria-label*="Gerenciar participantes"]', { 
      state: 'visible', 
      timeout: 15000 
    }).catch(() => {
      // Tentar encontrar o botão de outra forma
      return this.page.getByRole('button', { name: /gerenciar participantes/i }).first().waitFor({ 
        state: 'visible', 
        timeout: 15000 
      });
    });
    
    await this.page.waitForTimeout(500);
  }
  
  async openManageParticipants(): Promise<void> {
    // Tentar encontrar o botão de várias formas
    const button = this.page.getByRole('button', { name: /gerenciar participantes/i }).first();
    await button.waitFor({ state: 'visible', timeout: 15000 });
    await button.scrollIntoViewIfNeeded();
    
    // Aguardar a resposta da requisição após clicar (se houver)
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes('/participants') || r.url().includes('/budget'),
      { timeout: 10000 }
    ).catch(() => null);
    
    await button.click({ force: true });
    await responsePromise;
    await this.page.waitForTimeout(1000);

    // Aguardar o componente share-budget estar presente
    await this.page.waitForSelector('os-share-budget', { state: 'attached', timeout: 15000 });
    
    // Aguardar o modal estar visível
    await this.page.waitForSelector('.os-modal', { state: 'visible', timeout: 15000 });
    await this.page.waitForSelector('os-modal-template', { state: 'attached', timeout: 10000 }).catch(() => {});
    
    // Aguardar o título do modal aparecer - tentar várias formas
    try {
      await this.page.getByRole('heading', { name: /gerenciar participantes/i }).first().waitFor({ 
        state: 'visible', 
        timeout: 10000 
      });
    } catch {
      // Se não encontrar pelo role, tentar pelo seletor de classe
      await this.page.locator('.os-modal__title').filter({ hasText: /gerenciar participantes/i }).first().waitFor({ 
        state: 'visible', 
        timeout: 10000 
      });
    }
    
    await this.page.waitForTimeout(500);
  }
  
  async closeManageParticipants(): Promise<void> {
    await this.page.getByRole('button', { name: /fechar|cancelar/i }).first().click();
    await this.page.waitForTimeout(300);
  }
  
  async addParticipant(participantEmail: string): Promise<void> {
    // Aguardar o componente de busca estar visível
    const search = this.page.locator('os-search-box input[placeholder*="email"]').or(
      this.page.locator('os-search-box input[placeholder*="telefone"]')
    ).or(
      this.page.locator('os-user-invite input')
    ).first();
    
    await search.waitFor({ state: 'visible', timeout: 10000 });
    await search.fill(participantEmail);
    await this.page.waitForTimeout(500); // Aguardar sugestões aparecerem

    // Tentar encontrar a sugestão de várias formas
    const listbox = this.page.getByRole('listbox').first();
    const suggestionButton = listbox.getByRole('button').or(
      listbox.getByRole('option')
    ).first();
    
    await suggestionButton.waitFor({ state: 'visible', timeout: 10000 });
    await suggestionButton.click();
    await this.page.waitForTimeout(300);

    const addButton = this.page.getByRole('button', { name: /^adicionar$/i }).first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click({ force: true });

    // Aguardar a requisição completar
    await this.page.waitForResponse(
      (r) => r.url().includes('/budget/add-participant') || r.url().includes('/participants'),
      { timeout: 20000 }
    ).catch(() => {});
    
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // Aguardar atualização da UI
  }
  
  async removeParticipant(participantEmail: string): Promise<void> {
    const item = this.page.getByRole('listitem', { name: new RegExp(participantEmail, 'i') }).first();
    await item.waitFor({ state: 'visible', timeout: 10000 });

    const removeButton = item.getByRole('button', { name: /remover/i }).first();
    await removeButton.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async expectParticipantInList(participantEmail: string): Promise<void> {
    await expect(this.page.getByText(participantEmail)).toBeVisible();
  }
  
  async expectParticipantNotInList(participantEmail: string): Promise<void> {
    await expect(this.page.getByText(participantEmail)).not.toBeVisible();
  }
  
  async expectParticipantCount(count: number): Promise<void> {
    const countText = `${count} ${count === 1 ? 'participante' : 'participantes'}`;
    const regex = new RegExp(`${count}\\s+participantes?`, 'i');
    
    // Aguardar um pouco para a UI atualizar
    await this.page.waitForTimeout(1000);
    
    // Tentar encontrar pelo aria-label do badge primeiro
    try {
      const badge = this.page.getByLabel(regex);
      await expect(badge).toBeVisible({ timeout: 5000 });
      return;
    } catch {
      // Se não encontrar pelo label, tentar pelo texto do badge
      try {
        const badgeByText = this.page.locator('os-badge').filter({ hasText: count.toString() });
        await expect(badgeByText).toBeVisible({ timeout: 5000 });
        return;
      } catch {
        // Tentar encontrar na seção de informações básicas da página de detalhes
        try {
          const infoSection = this.page.locator('.budget-detail-page__info-grid').filter({ hasText: regex });
          await expect(infoSection).toBeVisible({ timeout: 5000 });
          return;
        } catch {
          // Por último, tentar encontrar qualquer texto na página
          await expect(this.page.getByText(regex).first()).toBeVisible({ timeout: 10000 });
        }
      }
    }
  }
  
  async expectPersonalBudgetError(): Promise<void> {
    await this.expectErrorNotification(/pessoal|personal|não permite participantes/i);
  }
  
  async expectSuccessNotification(message?: string | RegExp): Promise<void> {
    // Aguardar o container de notificações estar presente
    await this.page.waitForSelector('os-notification-container', { state: 'attached', timeout: 5000 }).catch(() => {});
    
    // Aguardar um pouco para a notificação aparecer
    await this.page.waitForTimeout(500);
    
    let notification;
    if (message) {
      notification = this.page.getByText(message).first();
    } else {
      // Tentar vários seletores para encontrar a notificação de sucesso
      notification = this.page.locator('os-alert[data-type="success"]')
        .or(this.page.locator('os-alert[type="success"]'))
        .or(this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i }))
        .first();
    }

    await expect(notification).toBeVisible({ timeout: 10000 });
  }
  
  async expectErrorNotification(message?: string | RegExp): Promise<void> {
    // Aguardar o container de notificações estar presente
    await this.page.waitForSelector('os-notification-container', { state: 'attached', timeout: 5000 }).catch(() => {});
    
    // Aguardar um pouco para a notificação aparecer
    await this.page.waitForTimeout(500);
    
    let notification;
    if (message) {
      notification = this.page.getByText(message).first();
    } else {
      // Tentar vários seletores para encontrar a notificação de erro
      notification = this.page.locator('os-alert[data-type="error"]')
        .or(this.page.locator('os-alert[type="error"]'))
        .or(this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i }))
        .first();
    }

    await expect(notification).toBeVisible({ timeout: 10000 });
  }
}
