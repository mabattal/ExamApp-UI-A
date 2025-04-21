import { Component, OnInit } from '@angular/core';
import { Exam } from '../../../../core/models/exam/exam-response.model';
import { ExamResultStatisticsResponseModel } from '../../../../core/models/examResult/ExamResultStatisticsResponseModel';
import { ExamService } from '../../../../core/services/exam.service';
import { ExamResultService } from '../../../../core/services/examResult.service';
import { AuthService } from '../../../../core/services/auth.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-exam-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.css',
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  statsMap: Map<number, ExamResultStatisticsResponseModel | null> = new Map();
  isLoading = true;

  constructor(
    private examService: ExamService,
    private examResultService: ExamResultService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) return;

    this.examService.getExamsByInstructorId(userId).subscribe({
      next: (res) => {
        this.exams = res.data!;
        const statCalls = this.exams.map((exam) =>
          this.examResultService.GetStatisticsById(exam.examId).pipe(
            map((res) => res.data), // sadece data'yı al
            catchError(() => of(null)) // hata olursa null dön
          )
        );

        forkJoin(statCalls).subscribe((statResults) => {
          statResults.forEach((stat, idx) => {
            const examId = this.exams[idx].examId;
            this.statsMap.set(examId, stat);
          });
          this.isLoading = false;
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getStats(examId: number): ExamResultStatisticsResponseModel | null {
    return this.statsMap.get(examId) ?? null;
  }

  viewExamDetail(id: number) {
    this.router.navigate(['/instructor/exam-results/exams', id.toString()]);
  }
}