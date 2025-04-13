import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../../../core/services/question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionCreateRequestModel } from '../../../../core/models/question/questionCreateRequestModel';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule
  ],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent implements OnInit, OnDestroy {
  questionForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  examIdFromRoute!: number;

  // 🔥 ngx-editor nesneleri
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
      questionText: ['', [Validators.required]],
      optionA: ['', [Validators.required]],
      optionB: ['', [Validators.required]],
      optionC: ['', [Validators.required]],
      optionD: ['', [Validators.required]],
      correctAnswer: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.examIdFromRoute = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.examIdFromRoute)) {
      this.errorMessage = 'Geçerli sınav ID bulunamadı.';
    }

    // 🧠 ngx-editor instance'larını başlat
    this.questionEditor = new Editor();
    this.optionAEditor = new Editor();
    this.optionBEditor = new Editor();
    this.optionCEditor = new Editor();
    this.optionDEditor = new Editor();
  }

  ngOnDestroy(): void {
    this.questionEditor.destroy();
    this.optionAEditor.destroy();
    this.optionBEditor.destroy();
    this.optionCEditor.destroy();
    this.optionDEditor.destroy();
  }

  get examId() { return this.questionForm.get('examId'); }
  get questionText() { return this.questionForm.get('questionText'); }
  get optionA() { return this.questionForm.get('optionA'); }
  get optionB() { return this.questionForm.get('optionB'); }
  get optionC() { return this.questionForm.get('optionC'); }
  get optionD() { return this.questionForm.get('optionD'); }
  get correctAnswer() { return this.questionForm.get('correctAnswer'); }

  // ✅ Tüm şıkları döndüren getter
  get optionControls() {
    return [
      { key: 'A', control: this.optionA, editor: this.optionAEditor},
      { key: 'B', control: this.optionB },
      { key: 'C', control: this.optionC },
      { key: 'D', control: this.optionD }
    ];
  }

  onSubmit() {
    if (this.questionForm.valid && this.examIdFromRoute) {
      this.isLoading = true;
      this.errorMessage = '';

      const questionData: QuestionCreateRequestModel = {
        examId: this.examIdFromRoute,
        questionText: this.questionForm.value.questionText,
        optionA: this.questionForm.value.optionA,
        optionB: this.questionForm.value.optionB,
        optionC: this.questionForm.value.optionC,
        optionD: this.questionForm.value.optionD,
        correctAnswer: this.questionForm.value.correctAnswer
      };

      this.questionService.createQuestion(questionData).subscribe({
        next: (response) => {
          if (response.data) {
            alert('Soru başarıyla eklendi!');
            this.router.navigate(['/instructor/exams', this.examIdFromRoute]);
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.errorMessage || 'Soru eklenirken bir hata oluştu';
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
    this.router.navigate(['/instructor/exams', this.examIdFromRoute]);
  }

  setCorrectAnswer(optionKey: 'A' | 'B' | 'C' | 'D') {
    const value = this.questionForm.get(`option${optionKey}`)?.value;
    this.correctAnswer?.setValue(value);
  }
}
