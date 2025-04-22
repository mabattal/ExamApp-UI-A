import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AnswerCreateRequestModel } from "../models/answer/answerCreateRequestModel";
import { Observable } from "rxjs";
import { ApiEmptyResponse, ApiResponse } from "../models/api-response.model";
import { environment } from "../../../environments/environment";
import { AnswerUpdateRequestModel } from "../models/answer/answerUpdateRequestModel";
import { AnswerResponseModel } from "../models/answer/AnswerResponseModel";


@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(private http: HttpClient) { }

  CreateAnswer(answer: AnswerCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.answer.createAnswerUrl
    return this.http.post<ApiResponse<{ id: number }>>(url, answer);
  }

  UpdateAnswer(id: number, answer: AnswerUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.answer.updateAnswerUrl
      .replace('{answerId}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, answer);
  }

  GetAnswersByExamIdAndUserId(examId: number, userId: number): Observable<ApiResponse<AnswerResponseModel[]>>{
    const url = environment.answer.getAnswerByexamIdAndUserIdUrl
    .replace('{examId}', examId.toString())
    .replace('{userId}', userId.toString());

    return this.http.get<ApiResponse<AnswerResponseModel[]>>(url);
  }

}