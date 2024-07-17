import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'abp-ng2-module';
import { EventdetailsService } from '@shared/services/eventdetails.service';
import { GuestService } from '@shared/services/guest.service';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import { PaymentService } from '@shared/services/payment.service';
@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private notify: NotifyService,
    private eventService: EventdetailsService,
    private guestService: GuestService,
    private userData: CurrentUserDataService,
    private paymentService: PaymentService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      const eventId = +params['eventId']; // Convert to number if needed
      const creatorId = +params['creatorId']; // Convert to number if needed
      const numberOfTickets = +params['numberOfTickets'];
      if (sessionId && eventId && creatorId && numberOfTickets) {
        this.handleSuccessActions(sessionId, eventId, creatorId, numberOfTickets);
      }
    });
  }

  handleSuccessActions(sessionId: string, eventId: number, creatorId: number, numberOfTickets: number) {
    // Fetch event details
    this.eventService.getEventById(eventId).subscribe(
      (event) => {
        if (!event) {
          console.error('Event not found');
          this.notify.error('Event not found.');
          return;
        }

        // Fetch current user data
        this.userData.GetCurrentUserData().subscribe(user => {
          if (user) {
            const guestData = {
              name: user.name,
              email: user.emailAddress,
              phone: '1234567890',
              invitationState: 'Accepted'
            };

       
            this.guestService.createGuest(guestData, eventId).subscribe(
              (guest) => {
                console.log('Guest created successfully', guest);

             
                const emailRequest = {
                  ToEmail: guest.email,
                  Subject: 'Event Ticket',
                  Body: 'Your event ticket details',
                  EventName: event.name,
                  Date: event.startDate.toISOString(),
                  EventAddress: event.location,
                  EventImage: event.eventImg
                };

            
                this.paymentService.sendEventTicketEmail(emailRequest).subscribe(
                  () => {
                    console.log('Event ticket email sent successfully');
                    this.notify.success('Event ticket email sent successfully.');
                  },
                  (error) => {
                    console.error('Error sending event ticket:', error);
                    this.notify.error('Error sending event ticket.');
                  }
                );
              },
              (error) => {
                console.error('Error creating guest:', error);
                this.notify.error('Error creating guest. Please try again.');
              }
            );
          } else {
            console.error('User data not available');
            this.notify.error('User data not available.');
          }
        });
      },
      (error) => {
        console.error('Error fetching event details:', error);
        this.notify.error('Error fetching event details.');
      }
    );
  }
}
