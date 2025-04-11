import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { Exam } from '../models/exam/exam-response.model';
import { ExamCreateRequestModel } from '../models/exam/examCreateRequestModel';
import { ExamUpdateRequestModel } from '../models/exam/examUpdateRequestModel';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private http: HttpClient) {}

  getExams(id: number): Observable<ApiResponse<Exam[]>> {
    const url = environment.exam.getExamsUrl
      .replace('{id}', id.toString());

    return this.http.get<ApiResponse<Exam[]>>(url);
  }

  getExam(id: string): Observable<ApiResponse<Exam>> {
    const url = environment.exam.getExamUrl
      .replace('{id}', id);

    return this.http.get<ApiResponse<Exam>>(url);
  }

  createExam(exam: ExamCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.exam.createExamUrl;
    return this.http.post<ApiResponse<{ id: number }>>(url, exam);
  }

   updateExam(id: number, exam:ExamUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.exam.updateExamUrl
      .replace('{id}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, exam);
  }

  deleteExam(id: number): Observable<ApiEmptyResponse> {
    const url = environment.exam.deleteExamUrl
      .replace('{id}', id.toString());

    return this.http.delete<ApiEmptyResponse>(url);
  }
}
