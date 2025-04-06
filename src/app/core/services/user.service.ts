import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponseModel } from '../models/UserResponseModel';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { UserCreateRequestModel } from '../models/user-create-request.model';
import { UserUpdateRequestModel } from '../models/user-update-request.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(pageNumber: number, pageSize: number): Observable<ApiResponse<UserResponseModel[]>> {
    const url = environment.user.getUsersUrl
      .replace('{pageNumber}', pageNumber.toString())
      .replace('{pageSize}', pageSize.toString());

    return this.http.get<ApiResponse<UserResponseModel[]>>(url);
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
