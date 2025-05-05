import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEmptyResponse, ApiResponse } from '../models/api-response.model';
import { Exam } from '../models/exam/exam-response.model';
import { ExamCreateRequestModel } from '../models/exam/examCreateRequestModel';
import { ExamUpdateRequestModel } from '../models/exam/examUpdateRequestModel';
import { ExamWithInstructorResponseModel } from '../models/exam/examWithInstructorResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private http: HttpClient) { }

  getExamsByInstructorId(id: number): Observable<ApiResponse<Exam[]>> {
    const url = environment.exam.getExamsByInstructorIdUrl
      .replace('{id}', id.toString());

    return this.http.get<ApiResponse<Exam[]>>(url);
  }

  getExamById(id: string): Observable<ApiResponse<Exam>> {
    const url = environment.exam.getByIdUrl
      .replace('{id}', id);

    return this.http.get<ApiResponse<Exam>>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let customErrorMessage = 'Sınav getirilirken bir hata oluştu.';

        if (error.error?.errorMessage) {
          customErrorMessage = Array.isArray(error.error.errorMessage)
            ? error.error.errorMessage.join(', ')
            : error.error.errorMessage;
        }

        return throwError(() => new Error(customErrorMessage));
      })
    );
  }

  createExam(exam: ExamCreateRequestModel): Observable<ApiResponse<{ id: number }>> {
    const url = environment.exam.createExamUrl;
    return this.http.post<ApiResponse<{ id: number }>>(url, exam).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
  


  updateExam(id: number, exam: ExamUpdateRequestModel): Observable<ApiEmptyResponse> {
    const url = environment.exam.updateExamUrl
      .replace('{id}', id.toString());

    return this.http.put<ApiEmptyResponse>(url, exam);
  }

  deleteExam(id: number): Observable<ApiEmptyResponse> {
    const url = environment.exam.deleteExamUrl
      .replace('{id}', id.toString());

    return this.http.delete<ApiEmptyResponse>(url);
  }

  getActiveExam(): Observable<ApiResponse<ExamWithInstructorResponseModel[]>> {
    const url = environment.exam.getActiveExams
    return this.http.get<ApiResponse<ExamWithInstructorResponseModel[]>>(url);
  }

  getPastExam(): Observable<ApiResponse<ExamWithInstructorResponseModel[]>> {
    const url = environment.exam.getPastExams
    return this.http.get<ApiResponse<ExamWithInstructorResponseModel[]>>(url);
  }

  getUpcomingExam(): Observable<ApiResponse<ExamWithInstructorResponseModel[]>> {
    const url = environment.exam.getUpcomingExams
    return this.http.get<ApiResponse<ExamWithInstructorResponseModel[]>>(url);
  }
}
