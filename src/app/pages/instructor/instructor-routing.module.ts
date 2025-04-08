import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamsComponent } from './exams/exams.component';
import { InstructorGuard } from '../../core/guards/instructor.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [InstructorGuard],
    children: [
      { path: 'exams', component: ExamsComponent },
      // Örnek olarak aşağıdakiler de eklenecek:
      // { path: 'exams/create', component: CreateExamComponent },
      // { path: 'exams/update/:id', component: UpdateExamComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {}
