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
      const ls = (globalThis as Window & typeof globalThis).localStorage;
      ls?.removeItem?.('auth_user');
      ls?.removeItem?.('auth_token');

      const w = globalThis as Window & typeof globalThis;
      const CE = globalThis.CustomEvent;
      if (w?.dispatchEvent && CE) {
        w.dispatchEvent(new CE('auth-state-changed', { detail: { user: null } }));
      }
    });

    await this.page.waitForTimeout(300);
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const ls = (globalThis as Window & typeof globalThis).localStorage;
      return !!ls?.getItem?.('auth_user');
    });
  }
}
