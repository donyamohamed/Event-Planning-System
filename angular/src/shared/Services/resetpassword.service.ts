import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  private baseUrl = "https://localhost:44311/api/services/app/Account/SendResetPasswordLink";
 

  constructor(private http: HttpClient) { }

  public SendEmailForPassword( email:string): Observable<string> {
     return this.http.post<string>(this.baseUrl,{},{params:{emailAddress:email}});
  }

}
