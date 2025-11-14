import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Guard que protege a rota de completar perfil.
 * Permite acesso apenas se o usuário estiver autenticado (mesmo que seja primeiro acesso).
 * Redireciona usuários não autenticados para a página de registro.
 */
export const completeProfileGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/register']);
    return false;
  }

  return true;
};

