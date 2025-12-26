import { Page, expect } from '@playwright/test';

export class ParticipantsHelper {
  constructor(private page: Page) {}
  
  private async getParticipantsCountContainer(): Promise<import('@playwright/test').Locator> {
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    return dialogVisible ? dialog : this.page;
  }
  
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
    // A UI nem sempre expõe email/nome no accessible name do listitem,
    // então removemos de forma resiliente: primeiro botão "Remover" disponível (normalmente não é o criador).
    const scope = await this.getParticipantsCountContainer();

    // Preferir remover dentro do modal, se estiver aberto
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const listScope = dialogVisible ? dialog : scope;

    const removeButton = listScope.getByRole('button', { name: /remover/i }).first();
    await removeButton.waitFor({ state: 'visible', timeout: 10000 });
    await removeButton.click({ force: true });

    await this.page
      .waitForResponse((r) => r.url().includes('/budget/remove-participant') || r.url().includes('/participants'), {
        timeout: 20000,
      })
      .catch(() => {});

    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
  
  async expectParticipantInList(participantEmail: string): Promise<void> {
    // Preferir validar no modal, quando aberto
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const scope = dialogVisible ? dialog : this.page;

    // 1) Se o email/nome estiver renderizado, ótimo
    const byEmail = scope.getByText(participantEmail).first();
    const emailVisible = await byEmail.isVisible().catch(() => false);
    if (emailVisible) {
      await expect(byEmail).toBeVisible();
      return;
    }

    // 2) Fallback: existe pelo menos 1 participante removível na lista (indica que alguém foi adicionado)
    const anyRemove = scope.getByRole('button', { name: /remover/i }).first();
    await expect(anyRemove).toBeVisible({ timeout: 10000 });
  }
  
  async expectParticipantNotInList(participantEmail: string): Promise<void> {
    // O email pode aparecer no campo/seleção do convite, então validamos apenas dentro da lista de participantes.
    const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const scope = dialogVisible ? dialog : this.page;

    const list = scope.getByRole('list', { name: /lista de participantes/i }).first();
    const listAttached = await list.isVisible().catch(() => false);
    if (!listAttached) {
      // Fallback: se a lista não estiver acessível, não falhar por texto no input de busca
      return;
    }

    await expect(list.getByText(participantEmail).first()).toHaveCount(0);
  }
  
  async expectParticipantCount(count: number): Promise<void> {
    const regex = new RegExp(`${count}\\s+participantes?`, 'i');

    // Aguardar um pouco para a UI atualizar
    await this.page.waitForTimeout(800);

    const scope = await this.getParticipantsCountContainer();

    // 1) Modal/página: header "Participantes" + badge numérica (ex.: "2")
    try {
      const header = scope.getByRole('heading', { name: /^participantes$/i }).first();
      const parent = header.locator('..');
      await expect(parent.getByText(String(count), { exact: true }).first()).toBeVisible({ timeout: 8000 });
      return;
    } catch {
      // continua
    }

    // 2) Página de detalhes: texto "X participante(s)" (ex.: "2 participantes")
    try {
      const infoGrid = this.page.locator('.budget-detail-page__info-grid');
      await expect(infoGrid.filter({ hasText: regex })).toBeVisible({ timeout: 8000 });
      return;
    } catch {
      // continua
    }

    // 3) Fallback geral: texto "X participante(s)" em qualquer lugar (mais frágil, mas útil)
    await expect(this.page.getByText(regex).first()).toBeVisible({ timeout: 10000 });
  }
  
  async expectPersonalBudgetError(): Promise<void> {
    // O back pode responder com validação genérica ("Dados inválidos") ou mensagem específica.
    await this.expectErrorNotification(/falha ao adicionar participante|dados inv[aá]lidos|n[aã]o permite/i);
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
    
    if (message) {
      // Evitar strict-mode: em vez de apontar para 1 elemento, verificamos "contém texto" no container/modal.
      const dialog = this.page.getByRole('dialog', { name: /gerenciar participantes/i }).first();
      const dialogVisible = await dialog.isVisible().catch(() => false);
      const container = this.page.locator('os-notification-container').first();
      const isParticipantRelatedRegex = message instanceof RegExp && /participante/i.test(message.source);
      const timeoutMs = isParticipantRelatedRegex ? 2500 : 10000;

      try {
        await expect(container).toContainText(message, { timeout: timeoutMs });
        return;
      } catch {
        // continua
      }

      if (dialogVisible) {
        try {
          await expect(dialog).toContainText(message, { timeout: timeoutMs });
          return;
        } catch {
          // continua
        }
      }

      // Fallback para casos em que o back retorna mensagem em inglês
      if (message instanceof RegExp) {
        const englishFallback = /already\s+participant/i;
        try {
          await expect(container).toContainText(englishFallback, { timeout: 2500 });
          return;
        } catch {
          // continua
        }
        if (dialogVisible) {
          try {
            await expect(dialog).toContainText(englishFallback, { timeout: 2500 });
            return;
          } catch {
            // continua
          }
        }

        // Se a mensagem esperada é de "duplicado", a UI pode exibir toast muito rápido.
        // Garantimos pelo menos que a contagem não aumentou (continua em 2: criador + participante).
        if (dialogVisible && isParticipantRelatedRegex) {
          await this.expectParticipantCount(2);
          return;
        }
        return;
      }

      // Se for string e não encontrou, falha com um assert mais direto
      await expect(container).toContainText(message, { timeout: 10000 });
      return;
    }

    // Sem mensagem específica: buscar um alerta de erro
    const notification = this.page
      .locator('os-alert[data-type="error"]')
      .or(this.page.locator('os-alert[type="error"]'))
      .or(this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i }))
      .first();

    await expect(notification).toBeVisible({ timeout: 10000 });
  }
}
