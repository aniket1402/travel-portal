import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoronaService {

  private coronaUrl = 'https://pomber.github.io/covid19/timeseries.json';
  private travelUrl = 'https://www.trackcorona.live/api/travel';

  constructor(private http: HttpClient) { }

  getCoronaStats(): Observable<any> {
    return this.http.get(this.coronaUrl)
      .pipe(
        tap((data) => console.log("Fetched")),
        catchError(this.handleError)
      );
  }

  getTravelStats(): Observable<any> {
    return this.http.get(this.travelUrl)
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
