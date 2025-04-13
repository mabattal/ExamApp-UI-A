import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { QuestionCreateRequestModel } from '../models/question/questionCreateRequestModel';
import { QuestionUpdateRequestModel } from '../models/question/questionUpdateRequestModel';
import { Question } from '../models/question/question-response.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  /* getExams(id: number): Observable<ApiResponse<Exam[]>> {
    const url = environment.exam.getExamsUrl
      .replace('{id}', id.toString());

    return this.http.get<ApiResponse<Exam[]>>(url);
  } */

  getQuestion(id: string): Observable<ApiResponse<Question>> {
    const url = environment.question.getQuestionUrl
      .replace('{id}', id);

    return this.http.get<ApiResponse<Question>>(url);
  }

  createQuestion(question: QuestionCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.question.createQuestionUrl;
    return this.http.post<ApiResponse<{ id: number }>>(url, question);
  }

   updateQuestion(id: number, question:QuestionUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.question.updateQuestionUrl
      .replace('{id}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, question);
  }

  deleteQuestion(id: number): Observable<ApiEmptyResponse> {
    const url = environment.question.deleteQuestionUrl
      .replace('{id}', id.toString());

    return this.http.delete<ApiEmptyResponse>(url);
  }
}
