import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../../core/services/exam.service';
import { ExamUpdateRequestModel } from '../../../../core/models/exam/examUpdateRequestModel';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Exam } from '../../../../core/models/exam/exam-response.model';

@Component({
  selector: 'app-update-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-exam.component.html',
  styleUrls: ['./update-exam.component.css']
})
export class UpdateExamComponent implements OnInit {
  examForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  examId!: number;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExamData();
  }

  get title() { return this.examForm.get('title'); }
  get description() { return this.examForm.get('description'); }
  get startDate() { return this.examForm.get('startDate'); }
  get endDate() { return this.examForm.get('endDate'); }
  get duration() { return this.examForm.get('duration'); }

  loadExamData() {
    this.examService.getExamById(this.examId.toString()).subscribe({
      next: (response: ApiResponse<Exam>) => {
        const exam = response.data
        this.examForm.patchValue({
          title: exam!.title,
          description: exam!.description,
          startDate: this.toDateTimeLocal(exam!.startDate),
          endDate: this.toDateTimeLocal(exam!.endDate),
          duration: exam?.duration
        });
      },
      error: () => {
        this.errorMessage = 'Sınav bilgileri yüklenemedi.';
      }
    });
  }

  toDateTimeLocal(dateStr: Date): string {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  onSubmit() {
    if (this.examForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const start = new Date(this.examForm.value.startDate!);
      const end = new Date(this.examForm.value.endDate!);
      const now = new Date();
      const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      const duration = Number(this.examForm.value.duration);

      if (start >= end) {
        this.errorMessage = 'Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.';
        this.isLoading = false;
        return;
      }

      if (start <= now || end < now) {
        this.errorMessage = 'Başlangıç ve bitiş tarihleri, şu anki zamandan sonra olmalıdır.';
        this.isLoading = false;
        return;
      }

      // Süre, tarih aralığından büyük olamaz
      if (duration > diffInMinutes) {
        this.errorMessage = 'Süre, sınavın başlangıç ve bitiş tarihleri arasındaki zaman diliminden uzun olamaz.';
        this.isLoading = false;
        return;
      }

      const examData: ExamUpdateRequestModel = {
        title: this.examForm.value.title!,
        description: this.examForm.value.description!,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        duration: Number(this.examForm.value.duration)
      };

      this.examService.updateExam(this.examId, examData).subscribe({
        next: () => {
          this.router.navigate(['/instructor/exams']);
          alert('Sınav başarıyla güncellendi!');
        },
        error: (error) => {
          if (error.error?.errorMessage) {
            this.errorMessage = Array.isArray(error.error.errorMessage)
              ? error.error.errorMessage.join(', ')
              : String(error.error.errorMessage);
          } else {
            this.errorMessage = 'Sınav güncellenirken bir hata oluştu';
          }
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.examForm.controls).forEach(key => {
        const control = this.examForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/instructor/exams']);
  }
}
