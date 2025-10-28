import { Injectable } from '@angular/core';
import {
  ExternalAuthServiceAdapter,
  AuthUser,
  AuthCredentials,
  AuthResult,
} from '../../app/core/adapters/external-auth-service.adapter';

@Injectable({
  providedIn: 'root',
})
export class MockAuthServiceAdapter implements ExternalAuthServiceAdapter {
  private readonly mockUser: AuthUser = {
    id: 'mock-user-id',
    email: 'dev@orca-sonhos.com',
    name: 'Developer User',
    avatar: null,
    metadata: {
      bypass: true,
      environment: 'development',
    },
  };

  private readonly mockToken = 'mock-bearer-token';
  private currentUser: AuthUser | null = null;

  initializeAuthState(callback: (user: AuthUser | null) => void): void {
    
    setTimeout(() => {
      this.currentUser = this.mockUser;
      callback(this.mockUser);
    }, 100);
  }
  
  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    
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
}
