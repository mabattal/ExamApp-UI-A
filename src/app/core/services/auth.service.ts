import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, BehaviorSubject, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Sayfa yenilendiğinde localStorage'dan kullanıcı bilgilerini geri yükle
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(environment.auth.loginUrl, { email, password }).pipe(
      tap((response) => {
        if (response.data != null) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
        } else if (response.errorMessage) {
          throw new Error(response.errorMessage);
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        if (error instanceof HttpErrorResponse) {
          console.error('HTTP Hatası:', error);
        } else {
          console.error('Giriş Hatası:', error.message);
        }
        throw error;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Token varsa true, yoksa false döner
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(environment.auth.logoutUrl, {}, { 
      headers: headers,
      responseType: 'text' 
    }).pipe(
      tap((response) => {
        if (response === "Successfully logged out"){
          localStorage.clear(); // Tüm local storage'ı temizle
          this.currentUserSubject.next(null);
        }        
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Çıkış yaparken hata:', error);
        // Hata olsa bile local storage'ı temizle
        localStorage.clear();
        this.currentUserSubject.next(null);
        throw error;
      }),
      finalize(() => {
        // Her durumda local storage'ı temizle
        localStorage.clear();
        this.currentUserSubject.next(null);
      })
    );
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