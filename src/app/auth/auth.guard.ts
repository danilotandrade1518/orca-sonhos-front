import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { ENV } from '../env';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (ENV.AUTH_DISABLED || !ENV.FIREBASE.apiKey) return true; // allow dev when auth is disabled or before configuring Firebase
  // If a redirect login is in progress (pre-init), don't trigger login again
  try {
    if (sessionStorage.getItem('auth_redirect') === '1') return true;
    const attemptedAt = Number(sessionStorage.getItem('auth_login_attempted_at') ?? '0');
    if (attemptedAt && Date.now() - attemptedAt < 8000) return true; // cool-off
  } catch {}

  if (auth.isRedirecting()) return true; // let the redirect flow complete without looping
  if (auth.isAuthenticated()) return true;
  void auth.login();
  return false;
};
