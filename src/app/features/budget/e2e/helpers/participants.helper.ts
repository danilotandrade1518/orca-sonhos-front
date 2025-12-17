import { Page, expect } from '@playwright/test';

/**
 * Helper para interações com participantes de orçamentos
 */
export class ParticipantsHelper {
  constructor(private page: Page) {}

  /**
   * Navega para a página de detalhes do orçamento
   */
  async navigateToBudgetDetail(budgetId: string): Promise<void> {
    await this.page.goto(`/budgets/${budgetId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Abre o modal de gerenciar participantes
   */
  async openManageParticipants(): Promise<void> {
    await this.page.getByRole('button', { name: /gerenciar participantes/i }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Fecha o modal de participantes
   */
  async closeManageParticipants(): Promise<void> {
    await this.page.getByRole('button', { name: /fechar|cancelar/i }).first().click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Adiciona um participante ao orçamento
   */
  async addParticipant(participantEmail: string): Promise<void> {
    // Preencher campo de email
    const emailInput = this.page.getByLabel(/email|participante/i).or(
      this.page.getByPlaceholder(/email|participante/i)
    );
    await emailInput.fill(participantEmail);

    // Clicar em adicionar
    await this.page.getByRole('button', { name: /adicionar|convidar/i }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Remove um participante do orçamento
   */
  async removeParticipant(participantEmail: string): Promise<void> {
    // Encontrar o card do participante e clicar em remover
    const participantCard = this.page.locator(`text=${participantEmail}`).locator('..');
    await participantCard.getByRole('button', { name: /remover|excluir/i }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Verifica se um participante aparece na lista
   */
  async expectParticipantInList(participantEmail: string): Promise<void> {
    await expect(this.page.getByText(participantEmail)).toBeVisible();
  }

  /**
   * Verifica se um participante não aparece mais na lista
   */
  async expectParticipantNotInList(participantEmail: string): Promise<void> {
    await expect(this.page.getByText(participantEmail)).not.toBeVisible();
  }

  /**
   * Verifica a contagem de participantes
   */
  async expectParticipantCount(count: number): Promise<void> {
    const countText = count === 1 ? '1 participante' : `${count} participantes`;
    await expect(this.page.getByText(countText)).toBeVisible();
  }

  /**
   * Verifica se aparece mensagem de erro ao tentar adicionar participante em orçamento PERSONAL
   */
  async expectPersonalBudgetError(): Promise<void> {
    await this.expectErrorNotification(/pessoal|personal|não permite participantes/i);
  }

  /**
   * Verifica se aparece notificação de sucesso
   */
  async expectSuccessNotification(message?: string): Promise<void> {
    const notification = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verifica se aparece notificação de erro
   */
  async expectErrorNotification(message?: string | RegExp): Promise<void> {
    const notification = message
      ? typeof message === 'string'
        ? this.page.getByText(message)
        : this.page.locator(`text=${message}`)
      : this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }
}
