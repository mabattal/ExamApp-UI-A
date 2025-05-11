import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
    this.examIdFromRoute = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.examIdFromRoute)) {
      this.errorMessage = 'Geçerli sınav ID bulunamadı.';
    }

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


  onSubmit() {
    if (!this.examIdFromRoute) {
      this.errorMessage = 'Geçerli sınav ID bulunamadı.';
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

    // Soru metni kontrolü
    const strippedQuestion = this.stripHtml(this.questionForm.value.questionText);
    if (!strippedQuestion) {
      alert('Soru metni boş olamaz.');
      return;
    }

    // Form kontrolleri geçerli mi kontrol et
    if (this.questionForm.valid) {
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
          console.error(error);
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
