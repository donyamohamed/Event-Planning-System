import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/User/GetUserById`;

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?Id=${userId}`);
  }

  getUserById2(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?Id=${userId}`);
  }

  createSupplierAccount(email: string): Observable<any> {
    const url = `${environment.API_URL_BASE_PART}/api/services/app/Account/CreateSupplierAccount`;
    const params = { email };
    return this.http.post<any>(url, null, { params });
  }
}
