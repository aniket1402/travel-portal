import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})
export class RequestTicketService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  requestTicket(ticket: Ticket): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestTicketUrl = `${this.baseUrl}/request-ticket`;
    console.log("Sending: ", ticket);
    return this.http.post<Ticket>(requestTicketUrl, ticket, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  requestTickectById(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Sending: ", id);
    const requestTickectByIdUrl = `${this.baseUrl}/request-ticket-confirm/${id}`;
    return this.http.get<Ticket>(requestTickectByIdUrl, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  updateTicketById(id: string, ticket: Ticket): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Sending: ", id);
    const updateTicketByIdUrl = `${this.baseUrl}/request-ticket-edit/${id}`;
    return this.http.put<Ticket>(updateTicketByIdUrl, ticket, { headers: headers })
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  getTicketsByUserId(id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Sending: ", id);
    const getTicketsByUserIdUrl = `${this.baseUrl}/my-tickets/${id}`;
    return this.http.get<Ticket[]>(getTicketsByUserIdUrl, { headers: headers })
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

  getEmployeeFiles(ticketID: string): Observable<any> {
    const getFilesUrl = `${this.baseUrl}/employee/getFiles/${ticketID}`;
    return this.http.get<any>(getFilesUrl)
      .pipe(
        tap((data) => console.log("Data ", data)),
        catchError(this.handleError)
      );
  }

  uploadFile(formData: FormData, ticketId: string): Observable<any> {
    const uploadtUrl = `${this.baseUrl}/employee/uploadFile/${ticketId}`;
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
