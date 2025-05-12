import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../../core/services/exam.service';
import { Exam } from '../../../../core/models/exam/exam-response.model';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuestionService } from '../../../../core/services/question.service';
import { QuestionResponseModel } from '../../../../core/models/question/questionResponse.model';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe]
})
export class ExamDetailComponent implements OnInit {
  exam: Exam | null = null;
  currentPage = 1;
  pageSize = 1;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private datePipe: DatePipe,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(examId)) {
      this.examService.getExamById(examId.toString()).subscribe({
        next: (res) => this.exam = res.data,
        error: (error) => console.error(error)
      });
    }
  }

  get totalPages(): number {
    return this.exam?.questions ? Math.ceil(this.exam.questions.length / this.pageSize) : 0;
  }

  get paginatedQuestions(): QuestionResponseModel[] {
    if (!this.exam?.questions) return [];
    const start = (this.currentPage - 1) * this.pageSize;
    return this.exam.questions.slice(start, start + this.pageSize);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'd MMMM yyyy HH:mm', 'tr')!;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goBack(): void {
    this.router.navigate(['/instructor/exams']);
  }

  goToCreateQuestion(): void {
    if (this.exam?.examId) {
      this.router.navigate(['/instructor/exams', this.exam.examId, 'create-question']);
    }
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  editQuestion(id: number) {
    this.router.navigate(['/instructor/update-question', id.toString()]);
  }

  deleteQuestion(question: QuestionResponseModel) {
    const confirmation = confirm(`Soruyu silmek istediğinizden emin misiniz?`);
    if (confirmation) {
      this.questionService.deleteQuestion(question.questionId).subscribe({
        next: () => {
          alert('Soru başarıyla silindi!');
          this.ngOnInit(); // Sınav detay sayfasını tekrar yükleyerek güncelleme yapıyoruz
        },
        error: (error) => {
          console.error('Hata:', error);
          alert('Soru silinirken bir hata oluştu!');
        }
      });
    }
  }
}
