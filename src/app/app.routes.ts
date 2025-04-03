// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UsersComponent } from './pages/admin/users/users.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CreateUserComponent } from './pages/admin/users/create-user/create-user.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/create', component: CreateUserComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];