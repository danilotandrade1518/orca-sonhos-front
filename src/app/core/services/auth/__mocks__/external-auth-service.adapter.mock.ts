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
  private _redirectResult: AuthResult | null = null;
  private _simulateFirstAccess = false;

  initializeAuthState(onAuthStateChanged: (user: AuthUser | null) => void): void {
    this._onAuthStateChanged = onAuthStateChanged;
    onAuthStateChanged(this._currentUser);
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {

    await new Promise((resolve) => setTimeout(resolve, 10));

    const user: AuthUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
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

  async signInWithGoogle(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    this._simulateFirstAccess = Math.random() > 0.5;

    const mockUser: AuthUser = this._simulateFirstAccess
      ? {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'newuser@orca-sonhos.com',
          name: null,
          avatar: null,
          metadata: { provider: 'google', isFirstAccess: true },
        }
      : {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@orca-sonhos.com',
          name: 'Mock User',
          avatar: null,
          metadata: { provider: 'google' },
        };

    this._redirectResult = {
      user: mockUser,
      token: 'mock-google-token',
    };
  }

  async getRedirectResult(): Promise<AuthResult | null> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const result = this._redirectResult;
    this._redirectResult = null;

    if (result) {
      this._currentUser = result.user;
      this._isAuthenticated = true;
      this._token = result.token || null;

      if (this._onAuthStateChanged) {
        this._onAuthStateChanged(result.user);
      }
    }

    return result;
  }

  async updateUserProfile(name: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    if (this._currentUser) {
      this._currentUser = {
        ...this._currentUser,
        name,
      };

      if (this._onAuthStateChanged) {
        this._onAuthStateChanged(this._currentUser);
      }
    }
  }
}
