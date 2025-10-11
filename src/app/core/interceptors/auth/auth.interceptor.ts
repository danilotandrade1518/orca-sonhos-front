import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, switchMap, throwError, from } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  if (shouldSkipAuth(req.url)) {
    return next(req);
  }

  return from(authService.getToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    }),
    catchError((error) => {
      if (error.status === 401) {
        authService.signOut();
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};

function shouldSkipAuth(url: string): boolean {
  const skipAuthUrls = ['/health', '/ready', '/me'];

  return skipAuthUrls.some((skipUrl) => url.includes(skipUrl));
}
