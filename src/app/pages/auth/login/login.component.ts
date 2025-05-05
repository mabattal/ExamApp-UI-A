import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.data) {
          console.log('Giriş başarılı:', response);
          const role = response.data.role;

          switch (role) {
            case 'Admin':
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'Instructor':
              this.router.navigate(['/instructor/dashboard']);
              break;
            case 'Student':
              this.router.navigate(['/student/dashboard']);
              break;
            default:
              this.router.navigate(['/']); // varsayılan
          }
        }
      },
      error: (error) => {
        console.error('Giriş hatası:', error);
        this.errorMessage = 'E-posta veya şifre hatalı.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
