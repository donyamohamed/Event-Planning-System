import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignGoogleService {

  private baseUrl = `${environment.API_URL_BASE_PART}/api/SignByGoogle`; // Adjust this URL

  constructor(private http: HttpClient) { }

  googleSignIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/google-signin`, data);
  }
}


