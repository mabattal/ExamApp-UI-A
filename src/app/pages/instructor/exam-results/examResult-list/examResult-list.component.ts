import { Component, OnInit } from '@angular/core';
import { ExamResultResponse } from '../../../../core/models/examResult/ExamResultResponse.model';
import { ExamService } from '../../../../core/services/exam.service';
import { ExamResultService } from '../../../../core/services/examResult.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-examResult-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './examResult-list.component.html',
  styleUrl: './examResult-list.component.css'
})
export class ExamResultListComponent implements OnInit {
  examId!: number;
  examTitle: string = '';
  results: ExamResultResponse[] = [];
  filteredResults: ExamResultResponse[] = [];
  searchTerm: string = '';

  currentPage = 1;
  pageSize = 10;

  isLoading = true;

  constructor(
    private examService: ExamService,
    private resultService: ExamResultService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = +this.route.snapshot.paramMap.get('examId')!;
    this.fetchExam();
    this.fetchResults();
  }

  fetchExam() {
    this.examService.getExamById(this.examId.toString()).subscribe(res => {
      this.examTitle = res.data!.title;
    });
  }

  fetchResults() {
    this.resultService.GetByExamId(this.examId).subscribe(res => {
      this.results = res.data!;
      this.filteredResults = [...this.results];
      this.isLoading = false;
    });
  }

  onSearchChange() {
    const keyword = this.searchTerm.toLowerCase();
    this.filteredResults = this.results.filter(r =>
      r.user?.fullName?.toLowerCase().includes(keyword) ||
      r.user?.email?.toLowerCase().includes(keyword)
    );
    this.currentPage = 1;
  }

  get paginatedResults(): ExamResultResponse[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredResults.slice(startIndex, startIndex + this.pageSize);
  }

  onRowClick(resultId: number) {
    this.router.navigate(['/instructor/exam-result-detail', resultId]);
  }

  totalPages(): number {
    return Math.ceil(this.filteredResults.length / this.pageSize);
  }

  goBack(): void {
    this.router.navigate(['/instructor/exam-results/exams']);
  }
}
