import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import {
  ExternalAuthServiceAdapter,
  AuthUser,
  AuthCredentials,
  AuthResult,
} from '../../app/core/adapters/external-auth-service.adapter';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthServiceAdapter implements ExternalAuthServiceAdapter {
  private readonly auth = inject(Auth);

  initializeAuthState(callback: (user: AuthUser | null) => void): void {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        const authUser: AuthUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
          metadata: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        };
        callback(authUser);
      } else {
        callback(null);
      }
    });
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    const authUser: AuthUser = {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      avatar: user.photoURL,
      metadata: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };

    return {
      user: authUser,
      token,
    };
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
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

  getCurrentUser(): AuthUser | null {
    const user = this.auth.currentUser;
    if (user) {
      return {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL,
        metadata: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      };
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}
