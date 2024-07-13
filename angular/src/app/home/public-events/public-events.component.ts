import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Event } from '../../../shared/Models/Event';
import { HomeService } from '../../../shared/services/home.service';
import { AskforInvitationService } from '../../../shared/services/askfor-invitation.service';
import { EventsResponse } from '../../../app/home/eventInterface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { GuestService } from '../../../shared/services/guest.service';
import { Enumerator } from "../../../shared/Models/Event";
import Swal from 'sweetalert2';
import { SharedModule } from "../../../shared/shared.module";
import { CommonModule } from '@angular/common';
import { CurrentUserDataService } from '../../../shared/services/current-user-data.service';

@Component({
    selector: 'app-public-events',
    templateUrl: './public-events.component.html',
    styleUrls: ['./public-events.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, RouterLink]
})
export class PublicEventsComponent implements OnInit {
  public events: Event[] = [];
  public isLoading: boolean = true;
  public isLoggedIn: boolean = false;
  public isButtonDisabledMap: { [key: number]: boolean } = {}; // Map to store disabled states for each event button
  username: string;
  guestEmail: string;
  guestId: number;
  enumeratorKeys = Object.values(Enumerator);

  constructor(
    private PublicEventServ: HomeService,
    private askForInvitationServ: AskforInvitationService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private guestService: GuestService,
    private currentUserDataService: CurrentUserDataService
  ) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.currentUserDataService.GetCurrentUserData().subscribe(
      response => {
        if (response ) {
          this.isLoggedIn = true;
          this.username = response.name;
          this.guestId = response.id;
          this.guestEmail = response.emailAddress;
          this.fetchUserEvents(); // Fetch events after login status is known
        }
      },
      error => {
        this.isLoggedIn = false;
        this.fetchUserEvents(); // Fetch events even if not logged in
      }
    );
  }

  fetchUserEvents(): void {
    this.PublicEventServ.getPublicEvents().subscribe(
      (data: EventsResponse) => {
        this.events = data.result;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.initializeButtonStates(); // Initialize button states after fetching events
      },
      error => {
        console.error('Error fetching user events', error);
        this.isLoading = false;
      }
    );
  }

  initializeButtonStates(): void {
    this.events.forEach(event => {
      this.askForInvitation(event, true); // Check if already requested during initialization
    });
  }

  askForInvitation(event: Event, isInitialization: boolean = false): void {
    this.currentUserDataService.GetCurrentUserData().subscribe(
      response => {
        if (response ) {
          this.username = response.name;
          this.guestId = response.id;
          this.guestEmail = response.emailAddress;
          this.checkIfAlreadyRequested(event, isInitialization);
        } else if (!isInitialization) {
          this.saveEventDataToSession(event);
          window.location.href = "/account/login";
        }
      },
      error => {
        if (!isInitialization) {
          this.saveEventDataToSession(event);
          window.location.href = "/account/login";
        }
      }
    );
  }

  checkIfAlreadyRequested(event: Event, isInitialization: boolean): void {
    if (event.userId === this.guestId) {
      if (!isInitialization) {
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Event Owner',
        //   text: 'You cannot request an invitation to your own event.',
        //   confirmButtonText: 'OK'
        // });
      }
      this.isButtonDisabledMap[event.id] = true;
      this.cdr.detectChanges();
      return;
    }

    this.askForInvitationServ.checkExistingInvitation(this.guestId, event.id).subscribe(
      (response: any) => {
        if (response && response.result === true) {
          this.isButtonDisabledMap[event.id] = true;
          if (!isInitialization) {
            Swal.fire({
              icon: 'info',
              title: 'Request Already Sent',
              text: 'You have already requested an invitation for this event.',
              confirmButtonText: 'OK'
            });
          }
        } else if (!isInitialization) {
          this.createNotificationAndSendEmail(event);
        }
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error checking existing invitation', error);
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
        this.askForInvitationServ.sendPendingEmail(emailData).subscribe(
          emailResponse => {
            Swal.fire({
              icon: 'success',
              title: 'Request Sent',
              text: 'Your invitation request has been sent successfully. Please wait for a response.',
              confirmButtonText: 'OK'
            });
          },
          emailError => {
            console.error('Error sending pending email:', emailError);
          }
        );
      },
      error => {
        console.error('Error creating notification:', error);
      }
    );
  }

  saveEventDataToSession(event: Event): void {
    sessionStorage.setItem('selectedEvent', JSON.stringify(event));
  }

  getUserData(): Observable<any> {
    return this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile');
  }

  details(event: Event): void {
    this.router.navigateByUrl("app/eventDetails/" + event.id, { state: { event } });
  }

  fetchEventsByCategory(category: Enumerator): void {
    this.isLoading = true;
    this.PublicEventServ.getEventsByCategory(category).subscribe(
      (data: EventsResponse) => {
        this.events = data.result;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.initializeButtonStates(); // Initialize button states after fetching events
      },
      error => {
        console.error('Error fetching events by category', error);
        this.isLoading = false;
      }
    );
  }

  navigateToComponent(id: number): void {
    this.router.navigateByUrl(`/app/Chat/${id}`);
  }

  getBackgroundImage(event: any): string {
    return event.eventImg ? event.eventImg : 'https://cdn.pixabay.com/photo/2016/03/28/09/50/firework-1285261_1280.jpg';
  }
}
