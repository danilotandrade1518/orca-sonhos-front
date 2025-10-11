import { InjectionToken } from '@angular/core';

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: AuthUser;
  token?: string;
  refreshToken?: string;
}

export interface ExternalAuthServiceAdapter {
  initializeAuthState(onAuthStateChanged: (user: AuthUser | null) => void): void;
  signIn(credentials: AuthCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
  getToken(): Promise<string | null>;
  refreshToken(): Promise<string | null>;
  getCurrentUser(): AuthUser | null;
  isAuthenticated(): boolean;
}

export const EXTERNAL_AUTH_SERVICE_ADAPTER = new InjectionToken<ExternalAuthServiceAdapter>(
  'ExternalAuthServiceAdapter'
);
