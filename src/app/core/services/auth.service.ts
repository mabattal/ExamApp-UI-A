import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, BehaviorSubject, finalize, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(environment.auth.loginUrl, { email, password }).pipe(
      tap((response) => {
        if (response?.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        const errMsg = error instanceof HttpErrorResponse
          ? `Sunucu hatası: ${error.status} ${error.message}`
          : `Uygulama hatası: ${error.message}`;
        console.error(errMsg);
        return throwError(() => new Error(errMsg));
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(environment.auth.logoutUrl, {}, {
      headers,
      responseType: 'text'
    }).pipe(
      tap((response) => {
        console.log('Çıkış yanıtı:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Çıkış hatası:', error);
        return throwError(() => error);
      }),
      finalize(() => {
        localStorage.clear();
        this.currentUserSubject.next(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'Admin';
  }

  isInstructor(): boolean {
    return this.currentUserValue?.role === 'Instructor';
  }

  isStudent(): boolean {
    return this.currentUserValue?.role === 'Student';
  }
}
