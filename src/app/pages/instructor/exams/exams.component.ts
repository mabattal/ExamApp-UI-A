import { Component, OnInit } from '@angular/core';
import { Exam } from '../../../core/models/exam/exam-response.model';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
  providers: [DatePipe]
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  isLoading = false;
  errorMessage = '';

  userId!: number;

  constructor(
    private examService: ExamService, 
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.userId = this.authService.currentUserValue.userId;
    this.loadExams();
  }

  loadExams(): void {
    this.isLoading = true;
    this.examService.getExamsByInstructorId(this.userId).subscribe({
      next: (response: ApiResponse<Exam[]>) => {
        if (response.data) {
          this.exams = response.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Sınavlar alınırken bir hata oluştu';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'd MMMM yyyy HH:mm', 'tr')!;
  }

  createExam() {
    this.router.navigate(['/instructor/exams/create']);
    console.log('Sınav oluşturma ekranı açılıyor...');
  }

  editExam(id: number) {
    this.router.navigate(['/instructor/exams/update', id.toString()]);
  }

  deleteExam(exam: Exam) {
    const confirmation = confirm(`${exam.title} sınavını silmek istediğinizden emin misiniz?`);
    if (confirmation) {
      this.examService.deleteExam(exam.examId).subscribe({
        next: () => {
          alert('Sınav başarıyla silindi!');
          this.loadExams();  // Sınav listesini tekrar yükleyerek güncelleme yapıyoruz
        },
        error: (error) => {
          console.error('Hata:', error);
          alert('Sınav silinirken bir hata oluştu!');
        }
      });
    }
  }

  viewExam(id: number) {
    this.router.navigate(['/instructor/exams', id.toString()]);
  }

  goToCreateQuestion(id: number): void {
      this.router.navigate(['/instructor/exams', id.toString(), 'create-question']);
  }
  
}
