import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const createUserUrl = `${this.baseUrl}/signup`;
    return this.http.post<string>(createUserUrl, user, { headers: headers })
      .pipe(
        tap((data) => console.log(data)),
        catchError(this.handleError)
      );
  }

  getUser(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const getUserUrl = `${this.baseUrl}/signup/confirm/${id}`;
    return this.http.get<User>(getUserUrl, { headers: headers })
      .pipe(
        tap((data) => console.log(data)),
        catchError(this.handleError)
      );
  }

  updateUserById(id: string, user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const getUserUrl = `${this.baseUrl}/edit-user/${id}`;
    return this.http.put<User>(getUserUrl, user, { headers: headers })
      .pipe(
        tap((data) => console.log(data)),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
