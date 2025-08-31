import { computed, Injectable, signal } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import {
  Auth,
  browserSessionPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onIdTokenChanged,
  setPersistence,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';

import { ENV } from '../env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;

  private accessToken = signal<string | null>(null);
  private userClaims = signal<Record<string, unknown> | null>(null);
  private redirecting = signal<boolean>(false);
  private wasRedirectFlow = false;
  private signedIn = signal<boolean>(false);
  private authError = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this.signedIn());
  readonly accessTokenValue = computed(() => this.accessToken());
  readonly user = computed(() => this.userClaims());
  readonly isRedirecting = computed(() => this.redirecting());
  readonly error = computed(() => this.authError());

  async init(): Promise<void> {
    if (ENV.AUTH_DISABLED) {
      // Short-circuit: behave as authenticated for local dev without Firebase
      this.signedIn.set(true);
      this.userClaims.set({ dev: true, email: 'dev@local', displayName: 'Dev User' });
      this.accessToken.set('dev-token');
      return;
    }
    if (!ENV.FIREBASE.apiKey) return; // allow boot without config
    if (this.app) return;
    this.app = initializeApp(ENV.FIREBASE as unknown as FirebaseOptions);
    this.auth = getAuth(this.app);
    // Use session persistence to complete redirect flows across full page reload
    await setPersistence(this.auth, browserSessionPersistence);
    const wasRedirect =
      typeof sessionStorage !== 'undefined' && sessionStorage.getItem('auth_redirect') === '1';
    if (wasRedirect) {
      this.redirecting.set(true);
      this.wasRedirectFlow = true;
      try {
        sessionStorage.removeItem('auth_redirect');
      } catch {}
    }
    const redirectResult = await getRedirectResult(this.auth).catch((err: unknown) => {
      // Clear redirecting flag on explicit redirect error so UI can re-attempt
      this.redirecting.set(false);
      const anyErr = err as { code?: string; message?: string } | undefined;
      const msg = anyErr?.code ? `${anyErr.code}: ${anyErr?.message ?? ''}` : String(err);
      this.authError.set(msg);
      // Persist once to help guard/UI break loops
      try {
        sessionStorage.setItem('auth_last_error', msg);
      } catch {}
      console.error('Firebase getRedirectResult error:', err);
      return null;
    });
    // Eagerly hydrate state if currentUser is already available after redirect
    if (redirectResult?.user ?? this.auth.currentUser) {
      const user = (redirectResult?.user ?? this.auth.currentUser)!;
      console.log('redirectResult/currentUser user', user);
      this.signedIn.set(true);
      const idToken = await user.getIdToken(false).catch(() => null);
      if (idToken) this.accessToken.set(idToken);
      this.userClaims.set({
        uid: user.uid,
        email: user.email ?? undefined,
        displayName: user.displayName ?? undefined,
        photoURL: user.photoURL ?? undefined,
      });
    }
    onIdTokenChanged(this.auth, async (user: import('firebase/auth').User | null) => {
      console.log('onIdTokenChanged user', user);
      if (user) {
        this.signedIn.set(true);
        const idToken = await user.getIdToken(/* forceRefresh */ false).catch(() => null);
        if (idToken) this.accessToken.set(idToken);
        this.userClaims.set({
          uid: user.uid,
          email: user.email ?? undefined,
          displayName: user.displayName ?? undefined,
          photoURL: user.photoURL ?? undefined,
        });
        try {
          sessionStorage.removeItem('auth_login_attempted_at');
        } catch {}
      } else {
        this.signedIn.set(false);
        this.accessToken.set(null);
        this.userClaims.set(null);
      }
      // After first state resolution post-redirect, clear redirect flag
      if (this.wasRedirectFlow) {
        this.redirecting.set(false);
        this.wasRedirectFlow = false;
      }
    });
  }

  async login(): Promise<void> {
  if (ENV.AUTH_DISABLED) return;
    if (!this.auth) await this.init();
    if (!this.auth) throw new Error('Firebase Auth not initialized');
    const provider = new GoogleAuthProvider();
    try {
      sessionStorage.setItem('auth_redirect', '1');
      sessionStorage.setItem('auth_login_attempted_at', String(Date.now()));
    } catch {}
    this.redirecting.set(true);
    await signInWithRedirect(this.auth, provider);
  }

  async logout(): Promise<void> {
    if (ENV.AUTH_DISABLED) {
      // Keep signed in state for dev; but clear any fake token/claims if needed
      this.signedIn.set(true);
      return;
    }
    if (!this.auth) return;
    await signOut(this.auth);
  }

  getAccessToken(): string | null {
  if (ENV.AUTH_DISABLED) return 'dev-token';
    const token = this.accessToken();
    if (token) return token;
    const user = this.auth?.currentUser ?? null;
    if (!user) return null;
    // Lazy fetch token when needed
    void user
      .getIdToken(false)
      .then((t) => this.accessToken.set(t))
      .catch(() => null);
    return null;
  }
}
