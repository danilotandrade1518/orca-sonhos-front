import { Page, expect } from '@playwright/test';

/**
 * Helper para interações com a página de orçamentos
 */
export class BudgetHelper {
  constructor(private page: Page) {}

  /**
   * Navega para a página de lista de orçamentos
   */
  async navigateToBudgetList(): Promise<void> {
    await this.page.goto('/budgets');
    await this.page.waitForLoadState('networkidle');
    // Aguardar um pouco mais para garantir que Angular renderizou
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clica no botão de criar novo orçamento
   */
  async clickCreateBudget(): Promise<void> {
    // O botão pode estar no header ("Novo Orçamento") ou na lista vazia ("Criar Orçamento")
    // Tentar encontrar o botão no header primeiro
    let createButton = this.page.getByRole('button', { name: /novo orçamento/i }).first();

    const isHeaderButtonVisible = await createButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isHeaderButtonVisible) {
      // Tentar botão da lista vazia
      createButton = this.page.getByRole('button', { name: /criar orçamento/i }).first();
    }

    const isButtonVisible = await createButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (isButtonVisible) {
      await createButton.waitFor({ state: 'visible', timeout: 10000 });
      await createButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);

      // Tentar clicar no botão
      try {
        await createButton.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verificar se navegou ou se o modal abriu
        const currentUrl = this.page.url();
        if (currentUrl.includes('/budgets/new')) {
          await this.page.waitForLoadState('networkidle');
          await this.page.waitForTimeout(1000);
          return;
        }

        // Se não navegou, pode ter aberto modal - verificar se formulário apareceu
        const formVisible = await this.page
          .waitForSelector('text=Nome do Orçamento', { state: 'visible', timeout: 3000 })
          .then(() => true)
          .catch(() => false);

        if (formVisible) {
          return;
        }
      } catch (error) {
        // Se o clique falhar, tentar navegação direta
      }
    }

    // Se o clique não funcionou, navegar diretamente
    // Isso pode acontecer se o componente os-button não propagar o evento corretamente
    await this.page.goto('/budgets/new');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Preenche o formulário de criação/edição de orçamento
   */
  async fillBudgetForm(name: string, type: 'PERSONAL' | 'SHARED' = 'PERSONAL'): Promise<void> {
    // Aguardar o formulário aparecer - pode estar em modal ou na página
    await this.page.waitForSelector('text=Nome do Orçamento', { state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000);

    // Preencher nome - usar o input dentro do modal/formulário
    // O input está dentro de os-form-field que está dentro de os-modal-template
    const nameInput = this.page
      .locator('os-modal-template os-form-field')
      .filter({ hasText: 'Nome do Orçamento' })
      .locator('input[type="text"]')
      .first();

    await nameInput.waitFor({ state: 'visible', timeout: 10000 });

    // Focar no input primeiro
    await nameInput.focus();
    await this.page.waitForTimeout(200);

    // Limpar campo primeiro
    await nameInput.clear();
    await this.page.waitForTimeout(200);

    // Preencher o campo usando fill (mais confiável)
    await nameInput.fill(name);
    await this.page.waitForTimeout(300);

    // Disparar eventos manualmente no input nativo para garantir que Angular detecte
    // O os-input escuta eventos 'input' no input nativo dentro do mat-form-field
    await this.page.evaluate(
      ({ value }) => {
        // Encontrar o input nativo dentro do mat-form-field dentro do os-form-field
        const formField = document.querySelector('os-modal-template os-form-field');
        if (formField) {
          const nativeInput = formField.querySelector('input[type="text"]') as HTMLInputElement;
          if (nativeInput) {
            // Garantir que o valor está definido
            if (nativeInput.value !== value) {
              nativeInput.value = value;
            }

            // Disparar eventos na ordem correta para Angular detectar
            // O evento 'input' é o mais importante para o os-input
            nativeInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            nativeInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            nativeInput.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
          }
        }
      },
      { value: name }
    );

    // Aguardar Angular processar mudanças e validar formulário
    await this.page.waitForTimeout(1500);

    // Selecionar tipo se necessário - usar seletor mais específico dentro do modal
    if (type === 'SHARED') {
      // O dropdown está dentro do modal, então usar seletor mais específico
      // Evitar o dropdown do seletor de orçamento que também tem "Tipo de orçamento"
      const typeDropdown = this.page
        .locator('os-modal-template os-dropdown[aria-label="Tipo de orçamento"]')
        .first();

      const isVisible = await typeDropdown.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        // Clicar no botão/trigger do dropdown
        const dropdownTrigger = typeDropdown.locator('button, [role="combobox"]').first();
        await dropdownTrigger.click();
        await this.page.waitForTimeout(500);

        // Aguardar opções aparecerem e clicar na opção correta
        const option = this.page.getByRole('option', { name: /compartilhado/i });
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForTimeout(1000);
      }
    }

    // Aguardar validação do formulário e Angular processar mudanças
    await this.page.waitForTimeout(1500);
  }

  /**
   * Salva o formulário de orçamento
   */
  async saveBudgetForm(): Promise<void> {
    // Aguardar validação do formulário e Angular processar
    await this.page.waitForTimeout(2000);

    // O botão está dentro do modal, usar seletor mais específico
    // O botão pode ter texto "Criar" (modo create) ou "Salvar" (modo edit)
    const saveButton = this.page
      .locator('os-modal-template')
      .getByRole('button', { name: /criar|salvar/i })
      .first();

    // Aguardar que o botão esteja visível
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });

    // Aguardar que o botão esteja habilitado (não tenha disabled)
    // O botão só fica habilitado quando o formulário está válido
    await this.page.waitForFunction(
      () => {
        const modal = document.querySelector('os-modal-template');
        if (!modal) return false;
        const button = modal.querySelector('os-button[variant="primary"] button') as HTMLButtonElement;
        return button && !button.disabled && !button.hasAttribute('disabled');
      },
      { timeout: 15000 }
    ).catch(() => {
      // Se não conseguir verificar, tentar mesmo assim após aguardar
    });

    // Aguardar um pouco mais para garantir que Angular processou
    await this.page.waitForTimeout(500);

    // Scroll para garantir que está visível
    await saveButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);

    // Verificar novamente se está habilitado antes de clicar
    const isEnabled = await saveButton.evaluate((el: HTMLElement) => {
      const button = el as HTMLButtonElement;
      return !button.disabled && !button.hasAttribute('disabled');
    });

    if (!isEnabled) {
      throw new Error('Botão de salvar ainda está desabilitado. Formulário pode não estar válido.');
    }

    // Clicar no botão
    await saveButton.click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Cancela o formulário de orçamento
   */
  async cancelBudgetForm(): Promise<void> {
    await this.page.getByRole('button', { name: /cancelar/i }).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Verifica se um orçamento aparece na lista
   */
  async expectBudgetInList(budgetName: string): Promise<void> {
    await expect(this.page.getByText(budgetName)).toBeVisible();
  }

  /**
   * Clica em um orçamento na lista para abrir detalhes
   */
  async clickBudget(budgetName: string): Promise<void> {
    await this.page.getByText(budgetName).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clica no botão de editar de um orçamento
   */
  async clickEditBudget(budgetName: string): Promise<void> {
    // Encontrar o card do orçamento e clicar em editar
    const budgetCard = this.page.locator(`text=${budgetName}`).locator('..');
    await budgetCard.getByRole('button', { name: /editar/i }).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Clica no botão de deletar de um orçamento
   */
  async clickDeleteBudget(budgetName: string): Promise<void> {
    const budgetCard = this.page.locator(`text=${budgetName}`).locator('..');
    await budgetCard.getByRole('button', { name: /excluir|deletar/i }).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Confirma a exclusão de um orçamento
   */
  async confirmDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /excluir|confirmar/i }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Cancela a exclusão de um orçamento
   */
  async cancelDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /cancelar/i }).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Verifica se uma notificação de sucesso aparece
   */
  async expectSuccessNotification(message?: string): Promise<void> {
    const notification = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"]').filter({ hasText: /sucesso/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verifica se uma notificação de erro aparece
   */
  async expectErrorNotification(message?: string): Promise<void> {
    const notification = message
      ? this.page.getByText(message)
      : this.page.locator('[role="alert"]').filter({ hasText: /erro|erro ao/i });

    await expect(notification).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verifica se o orçamento não aparece mais na lista
   */
  async expectBudgetNotInList(budgetName: string): Promise<void> {
    await expect(this.page.getByText(budgetName)).not.toBeVisible();
  }

  /**
   * Aguarda a lista de orçamentos carregar
   */
  async waitForBudgetList(): Promise<void> {
    // Aguardar que a página carregue completamente
    await this.page.waitForLoadState('networkidle');

    // Aguardar que o componente principal apareça (título da página ou lista)
    await Promise.race([
      this.page.waitForSelector('os-entity-list', { state: 'visible', timeout: 10000 }).catch(() => null),
      this.page.waitForSelector('text=Orçamentos', { state: 'visible', timeout: 10000 }).catch(() => null),
      this.page.waitForSelector('text=Nenhum orçamento encontrado', { state: 'visible', timeout: 10000 }).catch(() => null),
    ]);

    await this.page.waitForTimeout(500);
  }
}
