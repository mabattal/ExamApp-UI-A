import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { UserCreateRequestModel } from '../../../../core/models/user-create-request.model';
import { UserRole } from '../../../../core/enums/user-role.enum';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]],
      role: [UserRole.Student, Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  get fullName() { return this.userForm.get('fullName'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }
  get role() { return this.userForm.get('role'); }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Şifre alanında değişiklik olduğunda validasyonu kontrol eder
  checkPasswordMatch() {
    this.userForm.updateValueAndValidity();
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData: UserCreateRequestModel = {
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role
      };

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          if (response.data) {
            this.router.navigate(['/users']);
            alert('Kullanıcı başarıyla kaydedildi!');
          }
        },
        error: (error) => {
          // API'nin döndürdüğü hata mesajlarını al
          if (error.error?.errorMessage) {
            this.errorMessage = Array.isArray(error.error.errorMessage) 
              ? error.error.errorMessage.join(', ') 
              : String(error.error.errorMessage);
          } else {
            this.errorMessage = 'Kullanıcı oluşturulurken bir hata oluştu';
          }
      
          this.isLoading = false;
        }
      });
      
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control?.valid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
} 