import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../../core/enums/user-role.enum';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserUpdateRequestModel } from '../../core/models/user/user-update-request.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { UserResponseModel } from '../../core/models/user/UserResponseModel';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  userId!: number;
  userRole: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue.userId;
    this.initializeForm();
    this.loadUser();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required],
      password: ['', [Validators.minLength(3), Validators.required]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  loadUser(): void {
    this.userService.getUser(this.userId.toString()).subscribe({
      next: (response: ApiResponse<UserResponseModel>) => {
        const user = response.data;
        this.userForm.patchValue({
          fullName: user?.fullName,
          email: user?.email,
          role: user?.role
          // Parola alanları bilerek boş bırakılıyor
        });
      },
      error: () => {
        this.errorMessage = 'Kullanıcı bilgileri alınamadı';
      }
    });
  }

  passwordMatchValidator(form: FormGroup): any {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get fullName() { return this.userForm.get('fullName'); }
  get email() { return this.userForm.get('email'); }
  get role() { return this.userForm.get('role'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordMatch() {
    this.userForm.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formValue = this.userForm.value;

    const updatedUser: UserUpdateRequestModel = {
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
        alert('Profil başarıyla güncellendi!');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Güncelleme sırasında bir hata oluştu';
        console.error(err);
      }
    });
  }

  onCancel(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isInstructor()) {
      this.router.navigate(['/instructor/dashboard']);
    } else if (this.authService.isStudent()) {
      this.router.navigate(['/student/dashboard']);
    } else {
      this.router.navigate(['']);
    }
  }
  
}