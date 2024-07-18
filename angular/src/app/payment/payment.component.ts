import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@shared/session/app-session.service';
import { PaymentService } from '@shared/services/payment.service';
import { NotifyService } from 'abp-ng2-module';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: any;
  card: any;
  ticketPrice: number;
  eventId: number;
  creatorId: number;
  userId: number;
  numberOfTickets: number = 1;
  totalAmount: number;
  availableTickets: number = 0;

  constructor(
    private route: ActivatedRoute,
    private appSessionService: AppSessionService,
    private paymentService: PaymentService,
    private notify: NotifyService
  ) {
    this.userId = this.appSessionService.userId; // Fetch user ID from session
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.creatorId = params['creatorId'];
      this.ticketPrice = params['ticketPrice'];
      this.availableTickets = params['availableTickets'];
      this.updateAmount();
    });

    this.stripe = await loadStripe('pk_test_51PcdCYAFPDLjCbDzwHkNgTZrjOtrHXTVE4pakNnVcAeWrAmdj3n7ijP4K55TqQX6c5j2OUfOGYtl95nremtJHEXQ00jN5ilOxe');

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      // this.card.mount('#card-element');
    }
  }

  incrementTickets() {
    if (this.numberOfTickets < this.availableTickets) {
      this.numberOfTickets++;
      this.updateAmount();
    }
  }

  decrementTickets() {
    if (this.numberOfTickets > 1) {
      this.numberOfTickets--;
      this.updateAmount();
    }
  }

  updateAmount() {
    this.totalAmount = this.ticketPrice * this.numberOfTickets;
  }

  submitPayment() {
    const paymentData = {
      id: 0,
      userId: this.creatorId,
      guestId: this.userId,
      eventId: this.eventId,
      money: this.totalAmount,
      numberOfTickets: this.numberOfTickets,
      paymentDate: new Date().toISOString()
    };

    this.paymentService.createPayment(paymentData).subscribe({
      next: response => {
        console.log(response);
        const sessionId = response.result.sessionId;

        if (this.stripe) {
          this.stripe.redirectToCheckout({ sessionId })
            .then(result => {
              if (result.error) {
                console.error('Error redirecting to checkout:', result.error.message);
                this.notify.error('Error redirecting to checkout.');
              }
            });
        }
      },
      error: error => {
        console.error('Error creating checkout session:', error);
        this.notify.error('Payment failed. Please try again.');
      }
    });
  }
}
