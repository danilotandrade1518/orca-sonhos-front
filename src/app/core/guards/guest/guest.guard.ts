import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const guestGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthStateReady();
  const user = authService.getCurrentUser();

  if (!user) {
    return true;
  }

  if (!user.name || !user.name.trim()) {
    return router.createUrlTree(['/register/complete-profile']);
  }

  return router.createUrlTree(['/dashboard']);
};
