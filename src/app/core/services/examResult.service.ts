import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ExamResultResponse } from "../models/examResult/ExamResultResponse.model";
import { ApiResponse } from "../models/api-response.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ExamResultStatisticsResponseModel } from "../models/examResult/ExamResultStatisticsResponseModel";

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
  constructor(private http: HttpClient) { }

  GetById(id: number): Observable<ApiResponse<ExamResultResponse>> {
    const url = environment.examResult.GetByIdUrl
      .replace('{id}', id.toString())

    return this.http.get<ApiResponse<ExamResultResponse>>(url);
  }

  GetStatisticsById(examId: number): Observable<ApiResponse<ExamResultStatisticsResponseModel>> {
    const url = environment.examResult.statisticsExamUrl
      .replace('{examId}', examId.toString())

    return this.http.get<ApiResponse<ExamResultStatisticsResponseModel>>(url);
  }

  GetByUserId(userId: number): Observable<ApiResponse<ExamResultResponse[]>> {
    const url = environment.examResult.GetByUserIdUrl
      .replace('{userId}', userId.toString())

    return this.http.get<ApiResponse<ExamResultResponse[]>>(url);
  }

  GetByExamId(examId: number): Observable<ApiResponse<ExamResultResponse[]>> {
    const url = environment.examResult.GetByUserIdUrl
      .replace('{examId}', examId.toString())

    return this.http.get<ApiResponse<ExamResultResponse[]>>(url);
  }

  GetByUserIdAndExamId(userId: number, examId: number): Observable<ApiResponse<ExamResultResponse>> {
    const url = environment.examResult.GetByUserIdAndExamIdUrl
      .replace('{userId}', userId.toString())
      .replace('{examId}', examId.toString());

    return this.http.get<ApiResponse<ExamResultResponse>>(url);
  }

  StartExam(examId: number): Observable<ApiResponse<{ id: number }>> {
    const url = environment.examResult.startExamUrl
      .replace('{examId}', examId.toString());

    return this.http.post<ApiResponse<{ id: number }>>(url, examId);
  }

  SubmitExam(examId: number): Observable<ApiResponse<{ id: number }>> {
    const url = environment.examResult.submitExamUrl
      .replace('{examId}', examId.toString());

    return this.http.post<ApiResponse<{ id: number }>>(url, examId);
  }

}