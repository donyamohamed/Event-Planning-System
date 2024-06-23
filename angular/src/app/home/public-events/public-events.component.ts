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
import { Router } from '@angular/router';
import { GuestService } from '../../../shared/Services/guest.service'; // Adjust path as per your project structure

@Component({
    selector: 'app-public-events',
    templateUrl: './public-events.component.html',
    styleUrls: ['./public-events.component.css'],
    standalone:true,
    imports: [CommonModule, SharedModule],
    providers: [GuestService] // Ensure GuestService is provided
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
        private http: HttpClient,
        private router: Router,
        private guestService: GuestService // Inject GuestService
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
                this.checkMaxCountAndGuests();
            },
            (error) => {
                console.error('Error fetching user events', error);
                this.isLoading = false; // Change to false to indicate loading finished
            }
        );
    }

    // Function to check maxCount against number of guests
    // public-events.component.ts
// public-events.component.ts
checkMaxCountAndGuests(): void {
  this.events.forEach(event => {
      this.guestService.getGuestsPerEvent(event.id).subscribe(
          (response) => {
              const guests = response.result;
              const guestCount = guests.length;
              // Dynamically add isButtonDisabled property
              (event as any).isButtonDisabled = event.maxCount === guestCount;
              // Trigger change detection manually
              this.cdr.detectChanges();
          },
          (error) => {
              console.error(`Error fetching guests for event ${event.name}`, error);
          }
      );
  });
}


    // Function to ask for invitation
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

    // Function to fetch user data and proceed
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

    // Function to create notification and send email
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
            eventAddress: event.location,
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

    // Function to save event data to session storage
    saveEventDataToSession(event: Event): void {
        sessionStorage.setItem('selectedEvent', JSON.stringify(event));
    }

    // Function to get background image for event
    getBackgroundImage(event: any): string {
        return event.eventImg ? event.eventImg : 'https://cdn.pixabay.com/photo/2016/03/28/09/50/firework-1285261_1280.jpg';
    }

    // Function to navigate to component based on userId
    navigateToComponent(id: number): void {
        this.router.navigateByUrl(`/app/Chat/${id}`);
    }

    // Function to get user data
    getUserData(): Observable<any> {
        return this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile');
    }
}
