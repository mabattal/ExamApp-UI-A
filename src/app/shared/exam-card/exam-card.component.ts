import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExamWithInstructorResponseModel } from '../../core/models/exam/examWithInstructorResponseModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.css',
  providers: [DatePipe]
})
export class ExamCardComponent {
  @Input() exam!: ExamWithInstructorResponseModel;
  @Input() hasTakenExam = false;
  @Input() examType!: 'active' | 'past' | 'upcoming';

  constructor(
    private router: Router,
    private datePipe: DatePipe
  ) { }

  startExam(): void {
    const confirmation = confirm(`${this.exam.description}\nSınavı başlatmak istiyor musunuz?`);
    if(confirmation){
      this.router.navigate(['/student/exam', this.exam.examId]);
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'd MMMM yyyy HH.mm', 'tr')!;
  }
}
