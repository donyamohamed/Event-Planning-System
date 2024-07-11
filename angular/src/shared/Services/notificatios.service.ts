import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notifications, UpdateNotificationStatusDto, UpdateReminderStatusDto, UpdateReviewStatus } from '../Models/Notification';
import { environment } from '../../environments/environment';
interface ApiResponse<T> {
  result: T;
}

interface Event {
  name: string;
  startDate: string; 
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private URL = `${environment.API_URL_BASE_PART}/api/services/app/Notification/GetAllUserNotifications`;
  private UpcommingURL = `${environment.API_URL_BASE_PART}/api/services/app/Event/GetReminderOfUpcomming`;
  private UnreadCountURL = `${environment.API_URL_BASE_PART}/api/services/app/Notification/GetNotificationCount`;
  private UpdateUrl = `${environment.API_URL_BASE_PART}/api/services/app/Notification/UpdateNotificationStatus`;
  private ReminderUnreadCount = `${environment.API_URL_BASE_PART}/api/services/app/Event/GetReminderCount`;
  private UpdateReminderStatusUrl = `${environment.API_URL_BASE_PART}/api/services/app/Event/UpdateReminderStatus`;
  private GetUserURL = `${environment.API_URL_BASE_PART}/api/services/app/User/Get?Id=`;
  private EventUrl = `${environment.API_URL_BASE_PART}/api/services/app/Event/Get?Id=`;
  private AcceptanceEmail = `${environment.API_URL_BASE_PART}/api/Invitation/SendAcceptanceEmail`;
  private RejectingEmail = `${environment.API_URL_BASE_PART}/api/Invitation/SendRejectionEmail`;
  private UserProfileUrl = `${environment.API_URL_BASE_PART}/api/services/app/UserProfileAppServices/GetUserProfile`;
  private NotificationsUrl = `${environment.API_URL_BASE_PART}/api/services/app/Notification/GetAskForInvitationNotifications`;
  private ReviewNotificationUrl=`${environment.API_URL_BASE_PART}/api/services/app/Notification/GetNotificationOfEventReview`;
  private GetNotReviewedCountUrl=`${environment.API_URL_BASE_PART}/api/services/app/Notification/GetCountOfNotReviewedUserEvents` ;
  private UpdateIsReviewTakenUrl=`${environment.API_URL_BASE_PART}/api/services/app/Notification/UpdateIsReviewdStatus`;

  constructor(private http: HttpClient) { }

  GetUserNotifications(): Observable<ApiResponse<Notifications[]>> {
    return this.http.get<ApiResponse<Notifications[]>>(this.URL);
  }

  GetUpcommingEventsReminder(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(this.UpcommingURL);
  }

  GetNotificationsCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(this.UnreadCountURL);
  }

  UpdateNotificationStatus(updatedNotification: UpdateNotificationStatusDto): Observable<any> {
    return this.http.put<any>(this.UpdateUrl, updatedNotification);
  }

  UpdateReminderStatusFun(updatedNotification: UpdateReminderStatusDto): Observable<any> {
    return this.http.put<any>(this.UpdateReminderStatusUrl, updatedNotification);
  }

  GetReminderCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(this.ReminderUnreadCount);
  }
  GetUserById(id: any) {
    return this.http.get(this.GetUserURL + id);
  }
  GetEventById(id: any) {
    return this.http.get(this.EventUrl + id);
  }
  sendAcceptanceEmail(data: any) {
    return this.http.post(this.AcceptanceEmail, data);
  }
  sendRejectingEmail(data: any) {
    return this.http.post(this.RejectingEmail, data);

  }
  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.UserProfileUrl);
  }

  getAskForInvitationNotifications(guestId: number): Observable<ApiResponse<Notifications[]>> {
    return this.http.get<ApiResponse<Notifications[]>>(`${this.NotificationsUrl}?guestId=${guestId}`);
  }
  GetREviewsNotification(){
    return this.http.get(this.ReviewNotificationUrl);
  }
  GetNotReviewedCount(){
    return this.http.get(this.GetNotReviewedCountUrl);
  }
  UpdateIsReviewTaken(updatedNotification: UpdateReviewStatus): Observable<any> {
    return this.http.put<any>(this.UpdateUrl, updatedNotification);
  }
  GetEventNameandStartdateById(id: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(this.EventUrl + id);
  }
}
