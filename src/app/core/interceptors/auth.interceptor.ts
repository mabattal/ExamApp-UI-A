import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Login isteğine token eklenmez
  if (req.url.includes('/Auth/Login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  // Eğer token varsa Authorization başlığına ekle
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return EMPTY; // 401 ise boş observable
      }
  
      return throwError(() => error); // Diğer hatalarda hatayı fırlat
    })
  );
};
