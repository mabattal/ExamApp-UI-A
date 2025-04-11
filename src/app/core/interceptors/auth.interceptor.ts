import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  //const toastr = inject(ToastrService);

  if (req.url.includes('/Auth/Login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

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
      if (status === 401 || status === 0) {
        console.warn('Oturum süresi doldu veya yetkisiz erişim. Login sayfasına yönlendiriliyor.');

        // Token'ı temizle
        localStorage.removeItem('token');
        //toastr.warning('Oturumunuz sona erdi, lütfen tekrar giriş yapın.', 'Oturum Süresi Doldu');

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
