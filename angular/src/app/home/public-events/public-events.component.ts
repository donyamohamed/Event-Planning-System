import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Event } from '../../../shared/Models/Event';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../shared/Services/home.service';
import { AskforInvitationService } from '../../../shared/Services/askfor-invitation.service';
import { EventsResponse } from '../../../app/home/eventInterface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedModule } from "../../../shared/shared.module";

@Component({
    selector: 'app-public-events',
    standalone: true,
    templateUrl: './public-events.component.html',
    styleUrls: ['./public-events.component.css'],
    imports: [CommonModule, SharedModule]
})
export class PublicEventsComponent implements OnInit {
  public events: Event[] = [];
  public isLoading: boolean = true;
  username: string;
  guestEmail: string;
  guestId: number;

  constructor(
    private PublicEventServ: HomeService,
    private askForInvitationServ: AskforInvitationService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchUserEvents();

    // Check if there's a saved event after login
    const savedEvent = sessionStorage.getItem('selectedEvent');
    if (savedEvent) {
      const event: Event = JSON.parse(savedEvent);
      this.fetchUserDataAndProceed(event);
      sessionStorage.removeItem('selectedEvent');
      
    }
  }

  fetchUserEvents(): void {
    this.PublicEventServ.getPublicEvents().subscribe(
      (data: EventsResponse) => {
        this.events = data.result;
        console.log(this.events);
        this.isLoading = false;
        this.cdr.detectChanges();  // Manually trigger change detection
      },
      (error) => {
        console.error('Error fetching user events', error);
        this.isLoading = false; // Change to false to indicate loading finished
      }
    );
  }

  getUserData(): Observable<any> {
    return this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile');
  }

  askForInvitation(event: Event): void {
    this.getUserData().subscribe(
      response => {
        if (response && response.result) {
          this.username = response.result.name;
          this.guestId = response.result.id;
          this.guestEmail = response.result.email;
          this.createNotificationAndSendEmail(event);
        } else {
          this.saveEventDataToSession(event);
          window.location.href = "/account/login";
        }
      },
      error => {
        console.error('Error fetching user data', error);
        this.saveEventDataToSession(event);
        window.location.href = "/account/login";
      }
    );
  }

  fetchUserDataAndProceed(event: Event): void {
    this.getUserData().subscribe(
      response => {
        if (response && response.result) {
          this.username = response.result.name;
          this.guestId = response.result.id;
          this.guestEmail = response.result.emailAddress;
          console.log(this.guestEmail);
          this.createNotificationAndSendEmail(event);
        }
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  createNotificationAndSendEmail(event: Event): void {
    const notificationData = {
      content: `Invitation request for event: ${event.name}`,
      date: new Date().toISOString(),
      nType: 1,
      isRead: false,
      status: 0,
      userId: event.userId,
      guestId: this.guestId,
      eventId: event.id
    };

    const emailData = {
      toEmail: this.guestEmail,
      subject: `Invitation Request for ${event.name}`,
      body: `Your request is currently pending. We will notify you once your request has been processed.`,
      eventName: event.name,
      date: event.startDate,
      eventAddress: event.location
    };

    this.askForInvitationServ.createNotification(notificationData).subscribe(
      response => {
        console.log('Notification created:', response);
        this.askForInvitationServ.sendPendingEmail(emailData).subscribe(
          emailResponse => {
            console.log('Pending email sent:', emailResponse);
          },
          emailError => {
            console.error('Error sending pending email:', emailError);
            if (emailError.error) {
              console.error('Server error details:', emailError.error);
            }
          }
        );
      },
      error => {
        console.error('Error creating notification:', error);
        if (error.error) {
          console.error('Server error details:', error.error);
        }
      }
    );
  }

  saveEventDataToSession(event: Event): void {
    sessionStorage.setItem('selectedEvent', JSON.stringify(event));
  }
}
