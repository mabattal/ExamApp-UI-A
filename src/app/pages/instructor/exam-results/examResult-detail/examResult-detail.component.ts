import { Component, OnInit } from '@angular/core';
import { Exam } from '../../../../core/models/exam/exam-response.model';
import { UserResponseModel } from '../../../../core/models/user/UserResponseModel';
import { QuestionResponseModel } from '../../../../core/models/question/questionResponse.model';
import { AnswerResponseModel } from '../../../../core/models/answer/AnswerResponseModel';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../../core/services/question.service';
import { AnswerService } from '../../../../core/services/answer.service';
import { ExamService } from '../../../../core/services/exam.service';
import { UserService } from '../../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ExamResultResponse } from '../../../../core/models/examResult/ExamResultResponse.model';
import { ExamResultService } from '../../../../core/services/examResult.service';

@Component({
  selector: 'app-examResult-detail',
  imports: [CommonModule],
  templateUrl: './examResult-detail.component.html',
  styleUrl: './examResult-detail.component.css'
})
export class ExamResultDetailComponent implements OnInit {
  examId!: number;
  userId!: number;

  exam?: Exam;
  user?: UserResponseModel;
  examResult?: ExamResultResponse;

  questions: QuestionResponseModel[] = [];
  answers: AnswerResponseModel[] = [];

  pagedQuestions: QuestionResponseModel[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private examService: ExamService,
    private userService: UserService,
    private examResultService: ExamResultService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = +this.route.snapshot.paramMap.get('examId')!;
    this.userId = +this.route.snapshot.paramMap.get('userId')!;

    this.loadHeaderInfo();
    this.loadData();
  }

  loadHeaderInfo() {
    this.examService.getExamById(this.examId.toString()).subscribe(res => {
      this.exam = res.data!;
    });

    this.userService.getUser(this.userId.toString()).subscribe(res => {
      this.user = res.data!;
    });

    this.examResultService.GetByUserIdAndExamId(this.userId, this.examId).subscribe(res => {
      this.examResult = res.data!;
    });
  }

  loadData() {
    this.questionService.getQuestionWithCorrectAnswer(this.examId.toString()).subscribe((res) => {
      this.questions = res.data || [];
      this.totalPages = Math.ceil(this.questions.length / this.pageSize);
      this.updatePagedQuestions();
    });

    this.answerService.GetAnswersByExamIdAndUserId(this.examId, this.userId).subscribe((res) => {
      this.answers = res.data || [];
    });
  }

  updatePagedQuestions() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedQuestions = this.questions.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedQuestions();
  }

  getAnswerForQuestion(questionId: number): AnswerResponseModel | undefined {
    return this.answers.find(a => a.questionId === questionId);
  }

  goBack(): void {
    this.router.navigate(['/instructor/exam-results/exam',this.examId]);
  }
}
