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
import { Router, RouterLink } from '@angular/router';
import { GuestService } from '../../../shared/Services/guest.service';
import { Enumerator } from "../../../shared/Models/Event";
import Swal from 'sweetalert2';
import { preventDefault } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.css'],
  imports: [CommonModule, SharedModule, RouterLink],
  standalone: true
})
export class PublicEventsComponent implements OnInit {
  public events: Event[] = [];
  public isLoading: boolean = true;
  public isLoggedIn: boolean = false;
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
    private guestService: GuestService
  ) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
    this.fetchUserEvents();



    // Check if there's a saved event after login
    const savedEvent = sessionStorage.getItem('selectedEvent');
    if (savedEvent) {
      const event: Event = JSON.parse(savedEvent);
      this.fetchUserDataAndProceed(event);
      sessionStorage.removeItem('selectedEvent');
    }
  }



  checkIfLoggedIn(): void {
    this.getUserData().subscribe(
      response => {
        if (response && response.result) {
          this.isLoggedIn = true;
          this.username = response.result.name;
          this.guestId = response.result.id;
          this.guestEmail = response.result.email;
        }
      },
      error => {
        this.isLoggedIn = false;
      }
    );
  }

  details(event: Event): void {
    if (this.events.length > 0) {
      this.router.navigateByUrl("app/eventDetails/" + event.id, { state: { event } });

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

  fetchEventsByCategory(category: Enumerator): void {
    this.isLoading = true;
    this.PublicEventServ.getEventsByCategory(category).subscribe(
      (data:EventsResponse) => {
        this.events = data.result;
        console.log(this.events);
        this.isLoading = false;
        this.cdr.detectChanges();  
        this.checkMaxCountAndGuests();
      },
      (error) => {
        console.error('Error fetching events by category', error);
        this.isLoading = false; 
      }
    );
  }
  




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

  askForInvitation(event: Event): void {
    this.getUserData().subscribe(
      response => {
        if (response && response.result) {
          console.log(response);
          this.username = response.result.name;
          this.guestId = response.result.id;
          this.guestEmail = response.result.email;
          this.checkIfAlreadyRequested(event);
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
          this.checkIfAlreadyRequested(event);
        }
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  checkIfAlreadyRequested(event: Event): void {
    if (event.userId === this.guestId) {
      Swal.fire({
        icon: 'warning',
        title: 'Event Owner',
        text: 'You cannot request an invitation to your own event.',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.askForInvitationServ.checkExistingInvitation(this.guestId, event.id).subscribe(
      (response: any) => {
      console.log(this.guestId);
      console.log(event.id);
      
      
        console.log('Response received:', response); // Add this line for debugging
    
        if (response && response.result === true) {
          Swal.fire({
            icon: 'info',
            title: 'Invitation Request',
            text: 'You have already requested an invitation for this event.',
            confirmButtonText: 'OK'
          });
        } else {
          this.createNotificationAndSendEmail(event);
        }
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
        console.log('Notification created:', response);
        this.askForInvitationServ.sendPendingEmail(emailData).subscribe(
          emailResponse => {
            console.log('Pending email sent:', emailResponse);
            Swal.fire({
              icon: 'success',
              title: 'Request Sent',
              text: 'Your invitation request has been sent successfully. Please wait for a response.',
              confirmButtonText: 'OK'
            });
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

  getBackgroundImage(event: any): string {
    return event.eventImg ? event.eventImg : 'https://cdn.pixabay.com/photo/2016/03/28/09/50/firework-1285261_1280.jpg';
  }

  navigateToComponent(id: number): void {
    this.router.navigateByUrl(`/app/Chat/${id}`);
  }

  getUserData(): Observable<any> {
    return this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile');
  }



// selectCategory(_category: string): void {
//   this.events.find(a=>a.category==_category)
//   console.log('Selected category:', _category);
  
// }





}
