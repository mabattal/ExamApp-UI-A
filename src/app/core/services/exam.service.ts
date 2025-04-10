import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Exam } from '../models/exam/exam-response.model';
import { ExamCreateRequestModel } from '../models/exam/examCreateRequestModel';

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

  /* getUser(value: string): Observable<ApiResponse<UserResponseModel>> {
    const url = environment.user.getUserUrl
      .replace('{value}', value);

    return this.http.get<ApiResponse<UserResponseModel>>(url);
  } */

  createExam(exam: ExamCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.exam.createExamUrl;
    return this.http.post<ApiResponse<{ id: number }>>(url, exam);
  }

  /* updateUser(id: number, user:UserUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.user.updateUserUrl
      .replace('{id}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, user);
  }

  deleteUser(id: number): Observable<ApiEmptyResponse> {
    const url = environment.user.deleteUserUrl
      .replace('{id}', id.toString());

    return this.http.delete<ApiEmptyResponse>(url);
  } */
}
