import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']); // Kullanıcı giriş yapmamışsa login'e yönlendir
      return false;
    }
    return true; // Kullanıcı giriş yapmışsa dashboard'a gitmesine izin ver
  }
}


/*// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token) {
        // Eğer token varsa, sayfaya erişim izni ver
      return of(true);
    }

    // Eğer token yoksa, giriş sayfasına yönlendir
    this.router.navigate(['/login']);
    return of(false);
  }
}
*/