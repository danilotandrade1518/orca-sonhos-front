import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
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
    onAuthStateChanged(this.auth, (user: User | null) => {
      this._isLoading.set(false);
      if (user) {
        this._user.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        this._user.set(null);
      }
    });
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      this._user.set(authUser);
      return authUser;
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

      await signOut(this.auth);
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
    return this.user()?.uid || null;
  }

  getCurrentUserEmail(): string | null {
    return this.user()?.email || null;
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken();
      } catch (error) {
        console.error('Erro ao obter token:', error);
        return null;
      }
    }
    return null;
  }

  async refreshToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken(true);
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        return null;
      }
    }
    return null;
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
