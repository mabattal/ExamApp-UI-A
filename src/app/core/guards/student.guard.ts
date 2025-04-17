import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const user = this.authService.currentUserValue;

    if (user && user.role === 'Student') {
      return true;
    }

    this.router.navigate(['/unauthorized']); // veya başka bir yönlendirme
    return false;
  }
}