import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Validators } from 'ngx-editor';
import { QuestionService } from '../../../../core/services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionUpdateRequestModel } from '../../../../core/models/question/questionUpdateRequestModel';
import { Question } from '../../../../core/models/question/question-response.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-update-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule
  ],
  templateUrl: './update-question.component.html',
  styleUrl: './update-question.component.css'
})
export class UpdateQuestionComponent implements OnInit, OnDestroy {
  questionForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  questionId!: number;
  examId!: number;

  // ngx-editor nesneleri
  questionEditor!: Editor;
  optionAEditor!: Editor;
  optionBEditor!: Editor;
  optionCEditor!: Editor;
  optionDEditor!: Editor;

  html = '';

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required, Validators.maxLength(1000)]],
      optionA: ['', [Validators.required, Validators.maxLength(200)]],
      optionB: ['', [Validators.required, Validators.maxLength(200)]],
      optionC: ['', [Validators.required, Validators.maxLength(200)]],
      optionD: ['', [Validators.required, Validators.maxLength(200)]],
      correctAnswer: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestionData();

    // ngx-editor instance'ları
    this.questionEditor = new Editor();
    this.optionAEditor = new Editor();
    this.optionBEditor = new Editor();
    this.optionCEditor = new Editor();
    this.optionDEditor = new Editor();
  }

  loadQuestionData() {
    this.questionService.getQuestion(this.questionId.toString()).subscribe({
      next: (response: ApiResponse<Question>) => {
        const question = response.data;
        this.examId = question?.examId!;
        this.questionForm.patchValue({
          questionText: question?.questionText,
          optionA: question?.optionA,
          optionB: question?.optionB,
          optionC: question?.optionC,
          optionD: question?.optionD,
          correctAnswer: question?.correctAnswer
        });
      },
      error: () => {
        this.errorMessage = 'Soru bilgileri yüklenemedi.';
      }
    });
  }

  ngOnDestroy(): void {
    this.questionEditor.destroy();
    this.optionAEditor.destroy();
    this.optionBEditor.destroy();
    this.optionCEditor.destroy();
    this.optionDEditor.destroy();
  }

  get questionText() { return this.questionForm.get('questionText'); }
  get optionA() { return this.questionForm.get('optionA'); }
  get optionB() { return this.questionForm.get('optionB'); }
  get optionC() { return this.questionForm.get('optionC'); }
  get optionD() { return this.questionForm.get('optionD'); }
  get correctAnswer() { return this.questionForm.get('correctAnswer'); }

  onSubmit() {
    if (this.questionForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const questionData: QuestionUpdateRequestModel = {
        questionText: this.questionForm.value.questionText,
        optionA: this.questionForm.value.optionA,
        optionB: this.questionForm.value.optionB,
        optionC: this.questionForm.value.optionC,
        optionD: this.questionForm.value.optionD,
        correctAnswer: this.questionForm.value.correctAnswer
      };

      this.questionService.updateQuestion(this.questionId, questionData).subscribe({
        next: () => {
          this.router.navigate(['/instructor/exams', this.examId]);
          alert('Soru başarıyla güncellendi!');
        },
        error: (error) => {
          this.errorMessage = error.error?.errorMessage || 'Soru güncellenirken bir hata oluştu';
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.questionForm.controls).forEach(control => {
        if (control.invalid) control.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/instructor/exams', this.examId]);
  }

  setCorrectAnswer(optionKey: 'A' | 'B' | 'C' | 'D') {
    const value = this.questionForm.get(`option${optionKey}`)?.value;
    this.correctAnswer?.setValue(value);
  }
}


