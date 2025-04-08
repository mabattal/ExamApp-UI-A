import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser: any = null;
  isSidebarOpen: boolean = false;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserRole(role: string): string {
    switch(role) {
      case 'Admin':
        return 'Admin';
      case 'Instructor':
        return 'Eğitmen';
      case 'Student':
        return 'Öğrenci';
      default:
        return role;
    }
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggle.emit(this.isSidebarOpen);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Çıkış yaparken hata:', error);
        // Hata olsa bile login sayfasına yönlendir
        this.router.navigate(['/login']);
      }
    });
  }
} 