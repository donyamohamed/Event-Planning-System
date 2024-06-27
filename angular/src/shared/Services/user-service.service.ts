import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://localhost:44311/api/services/app/User';

  constructor(private http: HttpClient) { }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Get?Id=${userId}`);
  }
}
