import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Ticket } from '../request-ticket/ticket';
import { Comment } from './comment';

@Injectable({
  providedIn: 'root'
})
export class AdminHomeService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  getTickets(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const getTicketsUrl = `${this.baseUrl}/admin/home`;
    return this.http.get<Ticket[]>(getTicketsUrl, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  updateTicket(id: string, ticket: Ticket): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const updateTicketUrl = `${this.baseUrl}/admin/update-ticket/${id}`;
    return this.http.post<Ticket>(updateTicketUrl, ticket, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  getEmployeeFiles(ticketID: string): Observable<any> {
    const getFilesUrl = `${this.baseUrl}/employee/getFiles/${ticketID}`;
    return this.http.get<any>(getFilesUrl)
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  getFiles(ticketID: string): Observable<any> {
    const getFilesUrl = `${this.baseUrl}/admin/getFiles/${ticketID}`;
    return this.http.get<any>(getFilesUrl)
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  uploadFile(formData: FormData, ticketId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const uploadtUrl = `${this.baseUrl}/admin/uploadFile/${ticketId}`;
    return this.http.post<FormData>(uploadtUrl, formData)
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  deleteFile(id: string): Observable<any> {
    const deleteFileUrl = `${this.baseUrl}/deleteFile/${id}`;
    return this.http.delete<any>(deleteFileUrl)
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  getComments(id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const getCommentUrl = `${this.baseUrl}/admin/getComments/${id}`;
    return this.http.get<any>(getCommentUrl, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  postComment(comment: Comment): Observable<Comment> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const commentUrl = `${this.baseUrl}/admin/comment`;
    return this.http.post<Comment>(commentUrl, comment, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
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
