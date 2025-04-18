import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ExamCardComponent } from "../../../shared/exam-card/exam-card.component";
import { ExamWithInstructorResponseModel } from "../../../core/models/exam/examWithInstructorResponseModel";
import { ExamService } from "../../../core/services/exam.service";
import { ApiResponse } from "../../../core/models/api-response.model";
import { ExamResultService } from "../../../core/services/examResult.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [CommonModule, ExamCardComponent],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class ExamsComponent implements OnInit {
  activeExams: ExamWithInstructorResponseModel[] = [];
  pastExams: ExamWithInstructorResponseModel[] = [];
  upcomingExams: ExamWithInstructorResponseModel[] = [];
  errorMessage = '';
  userId!: number;
  activeTab: 'active' | 'upcoming' | 'past' = 'active';

  constructor(
    private examService: ExamService,
    private examResultService: ExamResultService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.userId = this.authService.currentUserValue.userId;
    this.loadAllExams();
  }

  loadAllExams(): void {
    this.examService.getActiveExam().subscribe({
      next: (response: ApiResponse<ExamWithInstructorResponseModel[]>) => {
        if (response.data) {
          this.activeExams = response.data;
          this.enrichExams(this.activeExams);
        }
      },
      error: (err) => {
        console.error('Aktif sınavlar alınırken bir hata oluştu', err);
      }
    });

    this.examService.getPastExam().subscribe({
      next: (response: ApiResponse<ExamWithInstructorResponseModel[]>) => {
        if (response.data) {
          this.pastExams = response.data;
          this.enrichExams(this.pastExams);
        }
      },
      error: (err) => {
        console.error('Geçmiş sınavlar alınırken bir hata oluştu', err);
      }
    });

    this.examService.getUpcomingExam().subscribe({
      next: (response: ApiResponse<ExamWithInstructorResponseModel[]>) => {
        if (response.data) {
          this.upcomingExams = response.data;
          this.enrichExams(this.upcomingExams);
        }
      },
      error: (err) => {
        console.error('Gelecek sınavlar alınırken bir hata oluştu' ,err);
      }
    });
  }

  enrichExams(exams: ExamWithInstructorResponseModel[]): void {
    exams.forEach(exam => {
      this.examService.getExamById(exam.examId.toString()).subscribe({
        next: res => {
          exam.questionCount = res.data?.questions.length;
        },
        error:(err) =>{
          this.errorMessage = 'Soru sayısı alınırken bir hata oluştu';
          console.error('Soru sayısı alınırken bir hata oluştu',err);
        }
      });

      this.examResultService.GetByUserIdAndExamId(this.userId, exam.examId).subscribe({
        next: res => {
          exam.hasParticipated = !!res.data;
        },
        error: (err) => {
          if (err.status === 404) {
            exam.hasParticipated = false;
          } else {
            console.error('Katılım bilgisi alınamadı:', err);
          }
        }
      });
    });
  }
}