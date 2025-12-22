import { Injectable } from '@angular/core';
import {
  ExternalAuthServiceAdapter,
  AuthUser,
  AuthResult,
} from '../../app/core/adapters/external-auth-service.adapter';

@Injectable({
  providedIn: 'root',
})
export class MockAuthServiceAdapter implements ExternalAuthServiceAdapter {
  private readonly mockUser: AuthUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'dev@orca-sonhos.com',
    name: 'Developer User',
    avatar: null,
    metadata: {
      bypass: true,
      environment: 'development',
    },
  };

  private readonly mockUserFirstAccess: AuthUser = {
    id: 'mock-user-first-access-id',
    email: 'newuser@orca-sonhos.com',
    name: null,
    avatar: null,
    metadata: {
      bypass: true,
      environment: 'development',
      isFirstAccess: true,
    },
  };

  private readonly mockToken = 'mock-bearer-token';
  private currentUser: AuthUser | null = null;
  private redirectResult: AuthResult | null = null;
  private simulateFirstAccess = false;

  initializeAuthState(callback: (user: AuthUser | null) => void): void {
    setTimeout(() => {
      this.currentUser = this.mockUser;
      callback(this.mockUser);
    }, 100);
  }

  async signIn(): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.currentUser = this.mockUser;

    return {
      user: this.mockUser,
      token: this.mockToken,
      refreshToken: this.mockToken,
    };
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    this.currentUser = null;
  }

  async getToken(): Promise<string | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    return this.currentUser ? this.mockToken : null;
  }

  async refreshToken(): Promise<string | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return this.currentUser ? this.mockToken : null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async signInWithGoogle(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.simulateFirstAccess = Math.random() > 0.5;

    if (this.simulateFirstAccess) {
      this.redirectResult = {
        user: this.mockUserFirstAccess,
        token: this.mockToken,
        refreshToken: this.mockToken,
      };
    } else {
      this.redirectResult = {
        user: this.mockUser,
        token: this.mockToken,
        refreshToken: this.mockToken,
      };
    }
  }

  async getRedirectResult(): Promise<AuthResult | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = this.redirectResult;
    this.redirectResult = null;

    if (result) {
      this.currentUser = result.user;
    }

    return result;
  }

  async updateUserProfile(name: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (this.currentUser) {
      this.currentUser = {
        ...this.currentUser,
        name,
      };
    }
  }
}
