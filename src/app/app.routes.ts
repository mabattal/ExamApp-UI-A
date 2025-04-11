/* import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from './core/guards/admin.guard';
import { InstructorGuard } from './core/guards/instructor.guard';
import { ExamsComponent } from './pages/instructor/exams/exams.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },

      // 👨‍💼 Admin route grubu (admin/users gibi)
      {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/users/users.component').then(m => m.UsersComponent)
          },
          {
            path: 'users/create',
            loadComponent: () =>
              import('./pages/admin/users/create-user/create-user.component').then(m => m.CreateUserComponent)
          },
          {
            path: 'users/update/:id',
            loadComponent: () =>
              import('./pages/admin/users/update-user/update-user.component').then(m => m.UpdateUserComponent)
          }
        ]
      },

      // 👨‍🏫 Instructor route grubu (instructor/exams gibi)
      {
        path: 'instructor',
        canActivate: [InstructorGuard],
        children: [
          {
            path: 'exams',
            loadComponent: () =>
              import('./pages/instructor/exams/exams.component').then(m => m.ExamsComponent)
          }
        ]
      }
    ]
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  { path: '**', redirectTo: 'dashboard' }
];
 */

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { InstructorGuard } from './core/guards/instructor.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Ortak erişilebilir sayfalar
      { path: 'profile', component: ProfileComponent },

      // Admin alt route'ları
      {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
          },

          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/users/users.component').then(m => m.UsersComponent),
          },
          {
            path: 'users/create',
            loadComponent: () =>
              import('./pages/admin/users/create-user/create-user.component').then(m => m.CreateUserComponent),
          },
          {
            path: 'users/update/:id',
            loadComponent: () =>
              import('./pages/admin/users/update-user/update-user.component').then(m => m.UpdateUserComponent),
          },
        ],
      },

      // Instructor alt route'ları
      {
        path: 'instructor',
        canActivate: [InstructorGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/instructor/dashboard/dashboard.component').then(m => m.InstructorDashboardComponent),
          },
          {
            path: 'exams',
            loadComponent: () =>
              import('./pages/instructor/exams/exams.component').then(m => m.ExamsComponent),
          },
          {
            path: 'exams/create',
            loadComponent: () =>
              import('./pages/instructor/exams/create-exam/create-exam.component').then(m => m.CreateExamComponent),
          },
          {
            path: 'exams/update/:id',
            loadComponent: () =>
              import('./pages/instructor/exams/update-exam/update-exam.component').then(m => m.UpdateExamComponent),
          },
        ],
      },

      // Student alt route'ları
      {
        path: 'student',
        //canActivate: [StudentGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/student/dashboard/dashboard.component').then(m => m.StudentDashboardComponent),
          },
        ],
      },
    ],
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
  },

  // Tüm tanımsız rotalarda giriş yapmışsa rolüne göre yönlendirildiği için boş root’a dön
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
