import { Page } from '@playwright/test';

/**
 * Helper para autenticação em testes E2E
 * Como o ambiente usa authBypass: true, podemos simular autenticação via localStorage
 */
export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Autentica um usuário de teste no sistema
   * @param userId ID do usuário de teste
   * @param email Email do usuário de teste
   * @param name Nome do usuário de teste
   */
  async login(userId: string = 'test-user-id', email: string = 'test@example.com', name: string = 'Test User'): Promise<void> {
    // Como o ambiente usa authBypass: true, o MockAuthServiceAdapter já está ativo
    // Apenas navegar para a página - a autenticação mock já está funcionando
    await this.page.goto('/');

    // Aguardar a aplicação carregar completamente
    await this.page.waitForLoadState('networkidle');

    // Aguardar que algum elemento da aplicação apareça para garantir que carregou
    await this.page.waitForSelector('body', { state: 'visible' });

    // Aguardar um pouco mais para garantir que Angular inicializou
    await this.page.waitForTimeout(1000);
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user: null } }));
    });

    await this.page.waitForTimeout(300);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return localStorage.getItem('auth_user') !== null;
    });
  }
}
