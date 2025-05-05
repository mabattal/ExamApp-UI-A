import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (req.url.includes('/Auth/Login')) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      const status = error?.status;

      if (status === 401 || status === 403) {
        console.warn('Oturum süresi doldu veya yetkisiz erişim. Login sayfasına yönlendiriliyor.');
        authService.logout();

        // Mevcut sayfa login değilse yönlendir
        if (router.url !== '/login') {
          setTimeout(() => router.navigate(['/login']), 0);
        }

        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};
