import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'abp-ng2-module';
import { EventdetailsService } from '@shared/services/eventdetails.service';
import { GuestService } from '@shared/services/guest.service';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import { PaymentService } from '@shared/services/payment.service';
import { Guest } from '@shared/Models/guest';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private notify: NotifyService,
    private eventService: EventdetailsService,
    private guestService: GuestService,
    private userData: CurrentUserDataService,
    private paymentService: PaymentService,
       private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      const eventId = +params['eventId']; 
      const numberOfTickets = +params['numberOfTickets'];
      if (eventId && sessionId) {
        this.handleSuccessActions(eventId);
      }
    });
  }

  handleSuccessActions(eventId: number) {
    console.log(eventId);
    this.isLoading = true; // Start loading
  this.cdr.detectChanges();
    // Fetch event details
    this.eventService.getEventById(eventId).pipe(
      catchError(error => {
        console.error('Error fetching event details:', error);
        this.notify.error('Error fetching event details.');
        this.isLoading = false; // Stop loading
          this.cdr.detectChanges();
        return of(null);
      })
    ).subscribe(eventResponse => {
      const event = eventResponse?.result;
      console.log(event);

      if (!event) {
        this.notify.error('Event not found.');
        this.isLoading = false; // Stop loading
          this.cdr.detectChanges();
        return;
      }

      // Fetch current user data
      this.userData.GetCurrentUserData().pipe(
        catchError(error => {
          console.error('Error fetching user data:', error);
          this.notify.error('Error fetching user data.');
          this.isLoading = false; // Stop loading
            this.cdr.detectChanges();
          return of(null);
        })
      ).subscribe(user => {
        if (user) {
          console.log(user);

          const guestData: Guest = {
            name: user.userName,
            email: user.emailAddress,
            phone: '1234567890',
            invitationState: 'Accepted',
            eventId: eventId,
            userId: user.id
          };

          this.createGuestAndSendEmail(guestData, event);
        } else {
          this.isLoading = false; // Stop loading
            this.cdr.detectChanges();
        }
      });
    });
  }

  createGuestAndSendEmail(guestData: Guest, event: any) {
    // Create guest
    this.paymentService.createGuest(guestData, event.id).pipe(
      catchError(error => {
        console.error('Error creating guest:', error);
        this.notify.error('Error creating guest.');
        return of(null);
      })
    ).subscribe(guest => {
      if (guest) {
        console.log('Guest created successfully', guest);
        this.notify.success('Congratulations! You are now in the guest list of the event.');

        // Send email
        const emailRequest = {
          toEmail: guestData.email,
          subject: 'Event Ticket',
          body: 'Your event ticket details',
          eventName: event.name,
          date: new Date(event.startDate).toISOString(), 
          eventAddress: event.location,
          eventImage: event.eventImg
        };

        this.paymentService.sendEventTicketEmail(emailRequest).pipe(
          catchError(error => {
            console.error('Error sending email:', error);
            this.notify.error('Error sending email.');
            return of(null);
          })
        ).subscribe(emailResponse => {
          if (emailResponse) {
            console.log('Email sent successfully', emailResponse);
            this.notify.success('Event Ticket sent successfully.');
          }
          this.isLoading = false; // Stop loading
            this.cdr.detectChanges();
        });
      } else {
        this.isLoading = false; // Stop loading
          this.cdr.detectChanges();
      }
    });
  }
}
