import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NewPassword } from '../Models/NewPassword';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPasswordService {
  private baseUrl2 = "https://localhost:44311/api/services/app/Account/ResetPassword";
  constructor(private http: HttpClient) { }

  public changePassword(email: string, token: string, data: NewPassword): Observable<any> {
    const params = new HttpParams()
    .set('token', token)
      .set('email', email);
  
    return this.http.post<NewPassword>(this.baseUrl2, data, { params });
  }
  


}
