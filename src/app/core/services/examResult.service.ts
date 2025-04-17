import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ExamResultResponse } from "../models/examResult/ExamResultResponse.model";
import { ApiResponse } from "../models/api-response.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class ExamResultService {
    constructor(private http: HttpClient) {}

    GetByUserIdAndExamId(userId: number, examId:number): Observable<ApiResponse<ExamResultResponse>> {
        const url = environment.examResult.GetByUserIdAndExamIdUrl
          .replace('{userId}', userId.toString())
          .replace('{examId}', examId.toString());
    
        return this.http.get<ApiResponse<ExamResultResponse>>(url);
      }



  }