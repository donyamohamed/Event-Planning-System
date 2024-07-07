import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../shared/Services/notificatios.service';
import { Notifications, NotificationStatus } from '../../../shared/Models/Notification';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SharedModule } from "../../../shared/shared.module";

@Component({
    selector: 'app-invitation-state',
    templateUrl: './invitation-state.component.html',
    styleUrls: ['./invitation-state.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, SharedModule]
})
export class InvitationStateComponent implements OnInit {
  notifications: Notifications[] = [];
  today: Date = new Date();

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationsService.getUserProfile().pipe(
      switchMap(profileResponse => {
        const guestId = profileResponse.result.id;
        return this.notificationsService.getAskForInvitationNotifications(guestId);
      })
    ).subscribe(notificationsResponse => {
      this.notifications = notificationsResponse.result;
      this.loadEventNamesAndStartDates();
    });
  }

  loadEventNamesAndStartDates(): void {
    const eventRequests = this.notifications.map(notification => 
      this.notificationsService.GetEventNameandStartdateById(notification.eventId).pipe(
        map(eventResponse => {
          notification.eventName = eventResponse.result.name;
          notification.startDate = new Date(eventResponse.result.startDate); 
          return notification;
        }),
        catchError(error => {
          console.error(error);
          return of(notification);
        })
      )
    );

    forkJoin(eventRequests).subscribe(() => {
    });
  }

  getStatusString(status: NotificationStatus): string {
    return NotificationStatus[status];
  }

  formatDate(date: Date, part: 'month' | 'day'): string {
    const options: Intl.DateTimeFormatOptions = part === 'month' 
      ? { month: 'short' } 
      : { day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  isPastEvent(startDate: Date): boolean {
    return startDate < this.today;
  }
}
