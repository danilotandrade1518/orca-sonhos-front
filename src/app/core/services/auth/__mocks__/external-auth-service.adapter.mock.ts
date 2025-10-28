import {
  AuthCredentials,
  AuthResult,
  AuthUser,
  ExternalAuthServiceAdapter,
} from '../../../adapters/external-auth-service.adapter';

export class MockExternalAuthServiceAdapter implements ExternalAuthServiceAdapter {
  private _currentUser: AuthUser | null = null;
  private _isAuthenticated = false;
  private _token: string | null = null;
  private _onAuthStateChanged: ((user: AuthUser | null) => void) | null = null;

  initializeAuthState(onAuthStateChanged: (user: AuthUser | null) => void): void {
    this._onAuthStateChanged = onAuthStateChanged;
    onAuthStateChanged(this._currentUser);
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    
    await new Promise((resolve) => setTimeout(resolve, 10));

    const user: AuthUser = {
      id: 'mock-user-id',
      email: credentials.email,
      name: 'Mock User',
      avatar: null,
      metadata: { provider: 'mock' },
    };

    this._currentUser = user;
    this._isAuthenticated = true;
    this._token = 'mock-token';

    if (this._onAuthStateChanged) {
      this._onAuthStateChanged(user);
    }

    return {
      user,
      token: this._token,
    };
  }

  async signOut(): Promise<void> {
    
    await new Promise((resolve) => setTimeout(resolve, 10));

    this._currentUser = null;
    this._isAuthenticated = false;
    this._token = null;

    if (this._onAuthStateChanged) {
      this._onAuthStateChanged(null);
    }
  }

  async getToken(): Promise<string | null> {
    return this._token;
  }

  async refreshToken(): Promise<string | null> {
    this._token = 'refreshed-mock-token';
    return this._token;
  }

  getCurrentUser(): AuthUser | null {
    return this._currentUser;
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  setMockUser(user: AuthUser | null): void {
    this._currentUser = user;
    this._isAuthenticated = user !== null;
    if (this._onAuthStateChanged) {
      this._onAuthStateChanged(user);
    }
  }

  setMockToken(token: string | null): void {
    this._token = token;
  }

  simulateAuthStateChange(user: AuthUser | null): void {
    this._currentUser = user;
    this._isAuthenticated = user !== null;
    if (this._onAuthStateChanged) {
      this._onAuthStateChanged(user);
    }
  }
}
