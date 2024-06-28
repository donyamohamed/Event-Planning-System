import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../shared/Services/notificatios.service';
import { Notifications, NotificationStatus } from '../../../shared/Models/Notification';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invitation-state',
  templateUrl: './invitation-state.component.html',
  styleUrls: ['./invitation-state.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InvitationStateComponent implements OnInit {
  notifications: Notifications[] = [];

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationsService.getUserProfile().subscribe(profileResponse => {
      const guestId = profileResponse.result.id;
      this.notificationsService.getAskForInvitationNotifications(guestId).subscribe(notificationsResponse => {
        this.notifications = notificationsResponse.result;
      });
    });
  }

  getStatusString(status: NotificationStatus): string {
    return NotificationStatus[status];
  }

  formatDate(date: string, part: 'month' | 'day'): string {
    const options: Intl.DateTimeFormatOptions = part === 'month' 
      ? { month: 'short' } 
      : { day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  }
}
