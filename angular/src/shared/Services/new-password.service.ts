import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NewPassword } from '../Models/NewPassword';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NewPasswordService {
  private baseUrl2 = `${environment.API_URL_BASE_PART
    
  }/api/services/app/Account/ResetPassword`;
  constructor(private http: HttpClient) { }

  public changePassword(email: string, token: string, data: NewPassword): Observable<any> {
    const params = new HttpParams()
    .set('token', token)
      .set('email', email);
  
    return this.http.post<NewPassword>(this.baseUrl2, data, { params });
  }
  


}
