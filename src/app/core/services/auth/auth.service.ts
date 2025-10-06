import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isAuthenticated = signal(false);
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly loading = this._loading.asReadonly();

  async login(email: string, password: string): Promise<void> {
    this._loading.set(true);
    try {
      // TODO: Implement Firebase Auth login with password
      // Placeholder implementation
      void password; // Will be used when Firebase Auth is implemented
      const user: User = {
        id: '1',
        email,
        name: 'User Name',
      };
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    } finally {
      this._loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this._loading.set(true);
    try {
      // TODO: Implement Firebase Auth logout
      this._currentUser.set(null);
      this._isAuthenticated.set(false);
    } finally {
      this._loading.set(false);
    }
  }

  async getToken(): Promise<string | null> {
    // TODO: Implement Firebase Auth token retrieval
    return null;
  }

  clearSession(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
}
