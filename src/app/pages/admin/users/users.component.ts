import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserResponseModel } from '../../../core/models/user/UserResponseModel';
import { UserRole } from '../../../core/enums/user-role.enum';
import { ApiResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: UserResponseModel[] = [];
  currentPage = 1;
  pageSize = 10;
  searchEmail = '';
  searchError = '';
  UserRole = UserRole;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: ApiResponse<UserResponseModel[]>) => {
        if (response.data) {
          this.users = response.data;
        }
      },
      error: (error: any) => {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      }
    });
  }

  searchUsers() {
    if (!this.searchEmail) {
      this.searchError = 'Lütfen bir e-posta adresi girin';
      return;
    }

    this.searchError = '';
    this.userService.getUser(this.searchEmail).subscribe({
      next: (response: ApiResponse<UserResponseModel>) => {
        if (response.data) {
          this.users = [response.data];
        }
      },
      error: (error: any) => {
        this.searchError = 'Kullanıcı bulunamadı';
        console.error('Kullanıcı aranırken hata oluştu:', error);
      }
    });
  }

  clearSearch() {
    this.searchEmail = '';
    this.searchError = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  createUser() {
    this.router.navigate(['/admin/users/create']);
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users/update/', id.toString()]);
  }

  deleteUser(user: UserResponseModel) {
    const confirmation = confirm(`${user.email} kullanıcısını silmek istediğinizden emin misiniz?`);
    if (confirmation) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          alert('Kullanıcı başarıyla silindi!');
          this.loadUsers();  // Kullanıcı listesini tekrar yükleyerek güncelleme yapıyoruz
        },
        error: (error) => {
          console.error('Hata:', error);
          alert('Kullanıcı silinirken bir hata oluştu!');
        }
      });
    }
  }

  getRoleName(role: number): string {
    switch (role) {
      case UserRole.Student:
        return 'Öğrenci';
      case UserRole.Instructor:
        return 'Eğitmen';
      case UserRole.Admin:
        return 'Admin';
      default:
        return 'Bilinmeyen';
    }
  }
}
