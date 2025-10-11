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

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly currentUser = computed(() => this.user());

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    this.externalAuthService.initializeAuthState((user: AuthUser | null) => {
      this._isLoading.set(false);
      this._user.set(user);
    });
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
}
