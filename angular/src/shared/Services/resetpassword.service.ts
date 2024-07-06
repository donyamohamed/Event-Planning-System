import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/Account/SendResetPasswordLink`;
 

  constructor(private http: HttpClient) { }

  public SendEmailForPassword( email:string): Observable<string> {
     return this.http.post<string>(this.baseUrl,{},{params:{emailAddress:email}});
  }

}
