import { computed, inject, Injectable, signal } from '@angular/core';
import { from, Observable } from 'rxjs';

import {
  AuthCredentials,
  AuthUser,
  EXTERNAL_AUTH_SERVICE_ADAPTER,
} from '../../adapters/external-auth-service.adapter';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private externalAuthService = inject(EXTERNAL_AUTH_SERVICE_ADAPTER);
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _authStateReady = signal<boolean>(false);
  private authStateReadyResolver: (() => void) | null = null;
  private readonly authStateReadyPromise: Promise<void>;

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly currentUser = computed(() => this.user());

  constructor() {
    this.authStateReadyPromise = new Promise((resolve) => {
      this.authStateReadyResolver = resolve;
    });
    this.initializeAuthState().catch(() => {
      this.markAuthStateReady();
    });
  }

  private async initializeAuthState(): Promise<void> {
    this.externalAuthService.initializeAuthState((user: AuthUser | null) => {
      this._isLoading.set(false);
      this._user.set(user);
      this.markAuthStateReady();
    });
  }

  private markAuthStateReady(): void {
    if (!this._authStateReady()) {
      this._authStateReady.set(true);
      this.authStateReadyResolver?.();
      this.authStateReadyResolver = null;
    }
  }

  async waitForAuthStateReady(): Promise<void> {
    if (this._authStateReady()) {
      return;
    }
    return this.authStateReadyPromise;
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const credentials: AuthCredentials = { email, password };
      const authResult = await this.externalAuthService.signIn(credentials);
      this._user.set(authResult.user);
      return authResult.user;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  async signOut(): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      await this.externalAuthService.signOut();
      this._user.set(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer logout';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.user();
  }

  getCurrentUserId(): string | null {
    return this.user()?.id || null;
  }

  getCurrentUserEmail(): string | null {
    return this.user()?.email || null;
  }

  async getToken(): Promise<string | null> {
    return this.externalAuthService.getToken();
  }

  async refreshToken(): Promise<string | null> {
    return this.externalAuthService.refreshToken();
  }

  clearError(): void {
    this._error.set(null);
  }

  signInWithEmailObservable(email: string, password: string): Observable<AuthUser> {
    return from(this.signInWithEmail(email, password));
  }

  signOutObservable(): Observable<void> {
    return from(this.signOut());
  }

  async signInWithGoogle(): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      await this.externalAuthService.signInWithGoogle();

      const user = this.externalAuthService.getCurrentUser();
      if (user) {
        this._user.set(user);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao autenticar com Google';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  async handleRedirectResult(): Promise<{ isFirstAccess: boolean; user: AuthUser } | null> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const result = await this.externalAuthService.getRedirectResult();
      if (!result) {
        return null;
      }

      this._user.set(result.user);
      const isFirstAccess = !result.user.name || result.user.name.trim() === '';

      return {
        isFirstAccess,
        user: result.user,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao processar autenticação';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  async completeProfile(name: string): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      await this.externalAuthService.updateUserProfile(name);

      const currentUser = this._user();
      if (currentUser) {
        this._user.set({
          ...currentUser,
          name,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }
}
