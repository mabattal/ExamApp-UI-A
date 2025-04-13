import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { Exam } from '../models/exam/exam-response.model';
import { ExamCreateRequestModel } from '../models/exam/examCreateRequestModel';
import { ExamUpdateRequestModel } from '../models/exam/examUpdateRequestModel';
import { QuestionCreateRequestModel } from '../models/question/questionCreateRequestModel';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  /* getExams(id: number): Observable<ApiResponse<Exam[]>> {
    const url = environment.exam.getExamsUrl
      .replace('{id}', id.toString());

    return this.http.get<ApiResponse<Exam[]>>(url);
  }

  getExam(id: string): Observable<ApiResponse<Exam>> {
    const url = environment.exam.getExamUrl
      .replace('{id}', id);

    return this.http.get<ApiResponse<Exam>>(url);
  } */

  createQuestion(question: QuestionCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.question.createQuestionUrl;
    return this.http.post<ApiResponse<{ id: number }>>(url, question);
  }

   /* updateQuestion(id: number, exam:ExamUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.exam.updateExamUrl
      .replace('{id}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, exam);
  } */

  deleteQuestion(id: number): Observable<ApiEmptyResponse> {
    const url = environment.question.deleteQuestionUrl
      .replace('{id}', id.toString());

    return this.http.delete<ApiEmptyResponse>(url);
  }
}
