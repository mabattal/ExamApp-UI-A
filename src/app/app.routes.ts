import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UsersComponent } from './pages/admin/users/users.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CreateUserComponent } from './pages/admin/users/create-user/create-user.component';
import { UpdateUserComponent } from './pages/admin/users/update-user/update-user.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from './core/guards/admin.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
      { path: 'users/create', component: CreateUserComponent, canActivate: [AdminGuard] },      
      { path: 'users/update/:id', component: UpdateUserComponent, canActivate: [AdminGuard] },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  // ⬇️ Unauthorized sayfası burada
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      )
  },
  { path: '**', redirectTo: 'dashboard' }
];
