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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = ''; // Her girişte hata mesajını temizle
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.data) {
          console.log('Giriş başarılı:', response);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Giriş hatası:', error);
        this.errorMessage = error instanceof Error ? error.message : 'E-posta veya şifre hatalı.';
      },
    });
  }
}