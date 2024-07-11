import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailRequest } from '../Models/EmailRequest';
import { SmsRequest } from '../Models/Sms';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private emailUrl = `${environment.API_URL_BASE_PART}/api/Invitation/SendInvitationByEmail`;
  private smsUrl = `${environment.API_URL_BASE_PART}/api/Invitation/SendInvitationBySms`;

  constructor(private http: HttpClient) { }

  sendInvitationByEmail(emailRequest: EmailRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.emailUrl, emailRequest, { headers });
  }

  sendInvitationBySms(smsRequest: SmsRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.smsUrl, smsRequest, { headers });
  }
}




