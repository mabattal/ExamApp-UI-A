import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { QuestionCreateRequestModel } from '../models/question/questionCreateRequestModel';
import { QuestionUpdateRequestModel } from '../models/question/questionUpdateRequestModel';
import { QuestionResponseWithoutCorrectAnswerModel } from '../models/question/questionResponseWithoutCorrectAnswer.model';
import { QuestionResponseModel } from '../models/question/questionResponse.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getQuestionWithoutCorrectAnswer(examId: string): Observable<ApiResponse<QuestionResponseWithoutCorrectAnswerModel[]>> {
    const url = environment.question.getByExamUrl
      .replace('{id}', examId);

    return this.http.get<ApiResponse<QuestionResponseWithoutCorrectAnswerModel[]>>(url);
  }

  getQuestion(id: string): Observable<ApiResponse<QuestionResponseModel>> {
    const url = environment.question.getQuestionUrl
      .replace('{id}', id);

    return this.http.get<ApiResponse<QuestionResponseModel>>(url);
  }

  getQuestionWithCorrectAnswer(examId: string): Observable<ApiResponse<QuestionResponseModel[]>> {
    const url = environment.question.getQuestionWithCorrectAnswerUrl
      .replace('{examId}', examId);

    return this.http.get<ApiResponse<QuestionResponseModel[]>>(url);
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
