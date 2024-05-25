import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignGoogleService {

  private baseUrl = ' https://localhost:44311/api/SignByGoogle'; // Adjust this URL

  constructor(private http: HttpClient) { }

  googleSignIn(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/google-signin`, data);
  }
}


