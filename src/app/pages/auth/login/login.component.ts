import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Giriş başarılı:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Giriş hatası:', error);
        alert(`Giriş başarısız! Hata: ${error.message}`);
      },
    });
  }
}