import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../../../core/services/exam.service';
import { ExamCreateRequestModel } from '../../../../core/models/exam/examCreateRequestModel';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css']
})
export class CreateExamComponent implements OnInit {
  examForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

  get title() { return this.examForm.get('title'); }
  get description() { return this.examForm.get('description'); }
  get startDate() { return this.examForm.get('startDate'); }
  get endDate() { return this.examForm.get('endDate'); }
  get duration() { return this.examForm.get('duration'); }

  onSubmit() {
    if (this.examForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const start = new Date(this.examForm.value.startDate!);
      const end = new Date(this.examForm.value.endDate!);

      if (start >= end) {
        this.errorMessage = 'Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.';
        this.isLoading = false;
        return;
      }

      const examData: ExamCreateRequestModel = {
        title: this.examForm.value.title!,
        description: this.examForm.value.description!,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        duration: Number(this.examForm.value.duration)
      };

      this.examService.createExam(examData).subscribe({
        next: (response) => {
          if (response.data) {
            this.router.navigate(['/instructor/exams']);
            alert('Sınav başarıyla oluşturuldu!');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Hata yanıtı:', error);
        
          this.errorMessage = 'Sunucudan bilinmeyen bir hata döndü.';
        
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
