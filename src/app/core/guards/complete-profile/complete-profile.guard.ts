import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const completeProfileGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthStateReady();

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth']);
  }

  return true;
};
