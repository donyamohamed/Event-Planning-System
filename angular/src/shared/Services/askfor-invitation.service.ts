import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AskforInvitationService {
  private askforInvitationApi = "https://localhost:44311/api/services/app/Notification/CreateNotification";
  private pendingEmailApi = "https://localhost:44311/api/Invitation/SendPendingEmail";
  private baseUrl = 'https://localhost:44311/api/services/app/Notification/CheckExistingInvitation';

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
