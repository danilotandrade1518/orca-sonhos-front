import { Page } from '@playwright/test';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(): Promise<void> {

    await this.page.goto('/');

    await this.page.waitForLoadState('networkidle');

    await this.page.waitForSelector('body', { state: 'visible' });

    await this.page.waitForTimeout(1000);
  }

  async logout(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user: null } }));
    });

    await this.page.waitForTimeout(300);
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return localStorage.getItem('auth_user') !== null;
    });
  }
}
