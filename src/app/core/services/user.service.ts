import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponseModel } from '../models/UserResponseModel';
import { ApiResponse } from '../models/api-response.model';
import { UserCreateRequestModel } from '../models/user-create-request.model';

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
}
