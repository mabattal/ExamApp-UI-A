import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorRoutingModule } from './instructor-routing.module';
import { ExamsComponent } from './exams/exams.component';

@NgModule({
  imports: [
    CommonModule,
    InstructorRoutingModule
  ]
})
export class InstructorModule {}
