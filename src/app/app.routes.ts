import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from './core/guards/admin.guard';
import { InstructorGuard } from './core/guards/instructor.guard';
import {ExamsComponent} from './pages/instructor/exams/exams.component';

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
        children:[
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
