import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AskforInvitationService {
  

  private askforInvitationApi = `${environment.API_URL_BASE_PART}/api/services/app/Notification/CreateNotification`;
private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/Notification/CheckExistingInvitation`;
  private pendingEmailApi = `${environment.API_URL_BASE_PART}/api/Invitation/SendPendingEmail`;


  constructor(private http: HttpClient) {}

  createNotification(notificationData: any): Observable<any> {
    return this.http.post<any>(this.askforInvitationApi, notificationData);
  }

  sendPendingEmail(emailData: any): Observable<any> {
    return this.http.post<any>(this.pendingEmailApi, emailData);
  }
  checkExistingInvitation(guestId: number, eventId: number): Observable<{ result: boolean }> {
    return this.http.post<{ result: boolean }>(`${this.baseUrl}?guestId=${guestId}&eventId=${eventId}`, {});
  }
  
}
