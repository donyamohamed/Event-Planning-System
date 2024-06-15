import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Notifications, UpdateNotificationStatusDto } from '../Models/Notification';
import { Event } from '../Models/Event';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
   URL="https://localhost:44311/api/services/app/Notification/GetAllUserNotifications";
   UpcommingURL="https://localhost:44311/api/services/app/Event/GetReminderOfUpcomming";
   UnreadCountURL="https://localhost:44311/api/services/app/Notification/GetNotificationCount";
   UpdateUrl='https://localhost:44311/api/services/app/Notification/UpdateNotificationStatus';
  constructor(private http:HttpClient) { }
  GetUserNotifications(){
   return this.http.get<Notifications[]>(this.URL);
  }

  GetUpcommingEventsReminder(){
    return this.http.get(this.UpcommingURL);
  }
  GetNotificationsCount(){
    return this.http.get(this.UnreadCountURL);
  }
  UpdateNotificationStatus(updatedNotification:UpdateNotificationStatusDto){
    return this.http.put(this.UpdateUrl,updatedNotification);
  }
}
