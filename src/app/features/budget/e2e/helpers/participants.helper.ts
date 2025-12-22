import { Page, expect } from '@playwright/test';

export class ParticipantsHelper {
  constructor(private page: Page) {}
  
  async navigateToBudgetDetail(budgetId: string): Promise<void> {
    await this.page.goto(`/budgets/${budgetId}`);
    await this.page.waitForLoadState('networkidle');
  }
  
  async openManageParticipants(): Promise<void> {
    await this.page.getByRole('button', { name: /gerenciar participantes/i }).click();
    await this.page.waitForTimeout(500);
  }
  
  async closeManageParticipants(): Promise<void> {
    await this.page.getByRole('button', { name: /fechar|cancelar/i }).first().click();
    await this.page.waitForTimeout(300);
  }
  
  async addParticipant(participantEmail: string): Promise<void> {
    
    const emailInput = this.page.getByLabel(/email|participante/i).or(
      this.page.getByPlaceholder(/email|participante/i)
    );
    await emailInput.fill(participantEmail);
    
    await this.page.getByRole('button', { name: /adicionar|convidar/i }).click();
    await this.page.waitForTimeout(500);
  }
  
  async removeParticipant(participantEmail: string): Promise<void> {
    
    const participantCard = this.page.locator(`text=${participantEmail}`).locator('..');
    await participantCard.getByRole('button', { name: /remover|excluir/i }).click();
    await this.page.waitForTimeout(500);
  }
  
  async expectParticipantInList(participantEmail: string): Promise<void> {
    await expect(this.page.getByText(participantEmail)).toBeVisible();
  }
  
  async expectParticipantNotInList(participantEmail: string): Promise<void> {
    await expect(this.page.getByText(participantEmail)).not.toBeVisible();
  }
  
  async expectParticipantCount(count: number): Promise<void> {
    const countText = count === 1 ? '1 participante' : `${count} participantes`;
    await expect(this.page.getByText(countText)).toBeVisible();
  }
  
  async expectPersonalBudgetError(): Promise<void> {
    await this.expectErrorNotification(/pessoal|personal|não permite participantes/i);
  }
  
  async expectSuccessNotification(message?: string): Promise<void> {
    const notification = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }
  
  async expectErrorNotification(message?: string | RegExp): Promise<void> {
    const notification = message
      ? typeof message === 'string'
        ? this.page.getByText(message)
        : this.page.locator(`text=${message}`)
      : this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }
}
