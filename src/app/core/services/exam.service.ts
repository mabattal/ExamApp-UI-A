import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponseModel } from '../models/user/UserResponseModel';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { UserCreateRequestModel } from '../models/user/user-create-request.model';
import { UserUpdateRequestModel } from '../models/user/user-update-request.model';
import { Exam } from '../models/exam/exam-response.model';

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

  getUser(value: string): Observable<ApiResponse<UserResponseModel>> {
    const url = environment.user.getUserUrl
      .replace('{value}', value);

    return this.http.get<ApiResponse<UserResponseModel>>(url);
  }

  createUser(user: UserCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.user.createUserUrl;
    return this.http.post<ApiResponse<{ id: number }>>(url, user);
  }

  updateUser(id: number, user:UserUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.user.updateUserUrl
      .replace('{id}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, user);
  }

  deleteUser(id: number): Observable<ApiEmptyResponse> {
    const url = environment.user.deleteUserUrl
      .replace('{id}', id.toString());

    return this.http.delete<ApiEmptyResponse>(url);
  }
}
