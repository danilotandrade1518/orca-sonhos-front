import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForAuthStateReady();

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
