import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QuestionResponseWithoutCorrectAnswerModel } from '../../../core/models/question/questionResponseWithoutCorrectAnswer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { QuestionService } from '../../../core/services/question.service';
import { AnswerService } from '../../../core/services/answer.service';
import { ExamResultService } from '../../../core/services/examResult.service';
import { Exam } from '../../../core/models/exam/exam-response.model';
import { AnswerCreateRequestModel } from '../../../core/models/answer/answerCreateRequestModel';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-start-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-exam.component.html',
  styleUrl: './start-exam.component.css'
})
export class StartExamComponent implements OnInit {
  examId!: number;
  exam!: Exam;
  questions: QuestionResponseWithoutCorrectAnswerModel[] = [];
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  timer!: number; // saniye cinsinden
  intervalId: any;
  errorMessage: string = '';
  totalExamSeconds!: number; // toplam süre

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private examResultService: ExamResultService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.startFullScreen();
    this.startExam();
  }

  startFullScreen(): void {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  startExam(): void {
    this.examResultService.StartExam(this.examId).subscribe({
      next: () => {
        this.loadExam();
        this.loadQuestions();
      },
      error: (err) => {
        this.errorMessage = 'Sınav başlatılırken bir hata oluştu.';
        console.error(err);
      }
    });
  }

  loadExam(): void {
    this.examService.getExamById(this.examId.toString()).subscribe({
      next: res => {
        this.exam = res.data!;
        this.calculateTimer();
      }
    });
  }

  calculateTimer(): void {
    const now = new Date().getTime(); // Şu an
    const endDate = new Date(this.exam.endDate).getTime(); // Sınav bitiş tarihi (UTC)
  
    const examDurationMs = this.exam.duration * 60 * 1000;
    const plannedEndTime = now + examDurationMs;
  
    const effectiveEndTime = Math.min(endDate, plannedEndTime);
    this.timer = Math.floor((effectiveEndTime - now) / 1000); // saniyeye çevir
    this.totalExamSeconds = this.timer;
  
    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  get minutes(): number {
    return Math.floor(this.timer / 60);
  }
  
  get seconds(): number {
    return this.timer % 60;
  }
  

  loadQuestions(): void {
    this.questionService.getQuestionWithoutCorrectAnswer(this.examId.toString()).subscribe({
      next: res => this.questions = res.data ?? []
    });
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
  }

  nextQuestion(): void {
    if (this.selectedAnswer) {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const answerRequest: AnswerCreateRequestModel = {
        examId: this.examId,
        questionId: currentQuestion.questionId,
        selectedAnswer: this.selectedAnswer
      };

      this.answerService.CreateAnswer(answerRequest).subscribe();
    }

    this.selectedAnswer = null;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.submitExam();
    }
  }

  submitExam(): void {
    clearInterval(this.intervalId);
    this.examResultService.SubmitExam(this.examId).subscribe({
      next: () => {
        document.exitFullscreen();
        this.router.navigate(['/student/exams']);
      }
    });
    alert('Sınavınız tamamlandı!');

  }

  get currentQuestion(): QuestionResponseWithoutCorrectAnswerModel {
    return this.questions[this.currentQuestionIndex];
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  get remainingPercentage(): number {
    return Math.max(0, (this.timer / this.totalExamSeconds) * 100);
  }
  
}
