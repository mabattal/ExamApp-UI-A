import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { InstructorGuard } from './core/guards/instructor.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StudentGuard } from './core/guards/student.guard';

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
            pathMatch: 'full',
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
          {
            path: 'exams/:id',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/instructor/exams/exam-detail/exam-detail.component').then(m => m.ExamDetailComponent),
          },
          {
            path: 'exams/:id/create-question',
            loadComponent: () =>
              import('./pages/instructor/questions/create-question/create-question.component').then(m => m.CreateQuestionComponent),
          },
          {
            path: 'update-question/:id',
            loadComponent: () =>
              import('./pages/instructor/questions/update-question/update-question.component').then(m => m.UpdateQuestionComponent),
          },
          {
            path: 'exam-results',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/instructor/exam-results/exam-list/exam-list.component').then(m => m.ExamListComponent),
          },
          {
            path: 'exam-results/exam/:examId',
            loadComponent: () =>
              import('./pages/instructor/exam-results/examResult-list/examResult-list.component').then(m => m.ExamResultListComponent),
          },
          {
            path: 'exam-results/exam/:examId/user/:userId',
            loadComponent: () =>
              import('./pages/instructor/exam-results/examResult-detail/examResult-detail.component').then(m => m.ExamResultDetailComponent),
          },
        ],
      },

      // Student alt route'ları
      {
        path: 'student',
        canActivate: [StudentGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/student/dashboard/dashboard.component').then(m => m.StudentDashboardComponent),
          },
          {
            path: 'exams',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/student/exams/exams.component').then(m => m.ExamsComponent),
          },
          {
            path: 'exam/:examId',
            loadComponent: () =>
              import('./pages/student/start-exam/start-exam.component').then(m => m.StartExamComponent),
          },
          {
            path: 'results',
            loadComponent: () =>
              import('./pages/student/exam-results/exam-results.component').then(m => m.ExamResultsComponent),
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
