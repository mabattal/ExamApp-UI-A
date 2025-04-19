import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Exam } from "../../../core/models/exam/exam-response.model";
import { ExamResultResponse } from "../../../core/models/examResult/ExamResultResponse.model";
import { AuthService } from "../../../core/services/auth.service";
import { ExamService } from "../../../core/services/exam.service";
import { ExamResultService } from "../../../core/services/examResult.service";

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.css']
})
export class ExamResultsComponent implements OnInit {
  examResults: ExamResultResponse[] = [];
  examsMap: Map<number, Exam> = new Map();
  isLoading = true;

  constructor(
    private examResultService: ExamResultService,
    private examService: ExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUserValue.userId;

    this.examResultService.GetByUserId(userId).subscribe(response => {
      this.examResults = response.data!;

      // Her examId için ilgili exam'leri getirme
      this.examResults.forEach(result => {
        this.examService.getExamById(result.examId.toString()).subscribe(examRes => {
          this.examsMap.set(result.examId, examRes.data!);
        });
      });

      this.isLoading = false;
    });
  }

  getExamTitle(examId: number): string {
    return this.examsMap.get(examId)?.title ?? 'Yükleniyor...';
  }

  getExamInstructor(examId: number): string {
    return this.examsMap.get(examId)?.instructor.fullName ?? 'Yükleniyor...';
  }
}
