import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSession();
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        router.navigate(['/forbidden']);
      }

      if (error.status === 404) {
        // Handle 404 errors if needed
      }

      if (error.status === 500) {
        // Handle server errors if needed
      }

      return throwError(() => error);
    })
  );
};
