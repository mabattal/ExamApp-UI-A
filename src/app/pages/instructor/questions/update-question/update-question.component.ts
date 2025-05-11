import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Editor, NgxEditorModule, Validators } from 'ngx-editor';
import { QuestionService } from '../../../../core/services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionUpdateRequestModel } from '../../../../core/models/question/questionUpdateRequestModel';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { QuestionResponseModel } from '../../../../core/models/question/questionResponse.model';

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
      questionText: ['', [Validators.required, Validators.maxLength(1000), this.emptyHtmlValidator]],
      optionA: ['', [Validators.required, Validators.maxLength(200), this.emptyHtmlValidator]],
      optionB: ['', [Validators.required, Validators.maxLength(200), this.emptyHtmlValidator]],
      optionC: ['', [Validators.required, Validators.maxLength(200), this.emptyHtmlValidator]],
      optionD: ['', [Validators.required, Validators.maxLength(200), this.emptyHtmlValidator]],
      correctAnswer: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

    // Özel validator: boş HTML içeriğini engeller
  emptyHtmlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/<[^>]*>/g, '').trim();
    return value ? null : { emptyHtml: true };
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

    this.setupDuplicateOptionValidation();
  }

  setupDuplicateOptionValidation() {
    const optionKeys: ('optionA' | 'optionB' | 'optionC' | 'optionD')[] = [
      'optionA', 'optionB', 'optionC', 'optionD'
    ];

    for (const key of optionKeys) {
      const control = this.questionForm.get(key);
      control?.valueChanges.subscribe(() => {
        const currentValue = this.stripHtml(control?.value);
        let isDuplicate = false;

        for (const otherKey of optionKeys) {
          if (otherKey === key) continue;

          const otherValue = this.questionForm.get(otherKey)?.value;
          const otherText = this.stripHtml(otherValue);

          if (currentValue && currentValue === otherText) {
            isDuplicate = true;
            break;
          }
        }

        if (isDuplicate) {
          control?.setErrors({ ...control.errors, duplicate: true });
        } else {
          if (control?.hasError('duplicate')) {
            const errors = { ...control.errors };
            delete errors['duplicate'];
            if (Object.keys(errors).length === 0) {
              control.setErrors(null);
            } else {
              control.setErrors(errors);
            }
          }
        }
      });
    }
  }

  loadQuestionData() {
    this.questionService.getQuestion(this.questionId.toString()).subscribe({
      next: (response: ApiResponse<QuestionResponseModel>) => {
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
    // Soru metni kontrolü
    const strippedQuestion = this.stripHtml(this.questionForm.value.questionText);
    if (!strippedQuestion) {
      alert('Soru metni boş olamaz.');
      return;
    }

    const optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const strippedOptions: Record<string, string> = {};

    // Her bir şık için HTML'den arındırılmış metnin alınması
    for (const key of optionKeys) {
      const value = this.questionForm.get(`option${key}`)?.value;
      const stripped = this.stripHtml(value);

      if (!stripped) {
        alert(`Şık ${key} boş olamaz.`);
        return;
      }

      strippedOptions[key] = stripped;
    }

    // Aynı içeriğe sahip şık var mı kontrol et
    const contents = Object.values(strippedOptions);
    const uniqueContents = new Set(contents);

    if (uniqueContents.size < contents.length) {
      alert('Tüm şıklar birbirinden farklı olmalıdır.');
      return;
    }

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
    const selectedValue = this.questionForm.get(`option${optionKey}`)?.value;
    const selectedText = this.stripHtml(selectedValue);

    if (!selectedText) {
      alert('Seçilen seçenek boş içerik içerdiği için doğru cevap olarak atanamaz.');
      this.correctAnswer?.reset();
      return;
    }

    const otherOptions = ['A', 'B', 'C', 'D'].filter(key => key !== optionKey);
    for (const otherKey of otherOptions) {
      const otherValue = this.questionForm.get(`option${otherKey}`)?.value;
      const otherText = this.stripHtml(otherValue);

      if (selectedText === otherText) {
        alert('Seçilen seçenek diğer seçeneklerle aynı içeriğe sahip olamaz.');
        this.correctAnswer?.reset();
        return;
      }
    }

    this.correctAnswer?.setValue(selectedValue);
  }

  isCorrectAnswerSelected(optionKey: 'A' | 'B' | 'C' | 'D'): boolean {
  const selectedValue = this.stripHtml(this.correctAnswer?.value);
  const optionValue = this.stripHtml(this.questionForm.get(`option${optionKey}`)?.value);
  return selectedValue === optionValue;
}

  stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '').trim() || '';
  }
}


