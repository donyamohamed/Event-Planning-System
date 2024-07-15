import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
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
  stripe: any;
  elements: any;
  card: any;
  ticketPrice: number;
  eventId: number;
  creatorId: number;
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private appSessionService: AppSessionService,
    private paymentService: PaymentService,
    private notify:NotifyService
  ) {
    this.userId = this.appSessionService.userId; // Fetch user ID from session
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.creatorId = params['creatorId'];
      this.ticketPrice = params['ticketPrice'];
    });

    this.stripe = await loadStripe('pk_test_51PbhokHI9E95Zl9vzuPBiZV7E7SpMsqrFIFBLgX8tkfvC57mkWUUM3x6kDc8XkHjr8MlI6yydbrcQUoGl6Hdj68Z00Ble9w77m');

    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#ffffff',
        colorBackground: '#000000',
        colorText: '#ffffff',
        colorDanger: '#ff0000',
      },
      rules: {
        '.Input': {
          borderColor: 'hsl(279, 6%, 55%)',
          borderRadius: '4px',
          color: 'hsl(0, 0%, 100%)',
        },
        '.Input:focus': {
          borderImageSource: 'linear-gradient(to right, hsl(249, 99%, 64%), hsl(278, 94%, 30%))',
          borderImageSlice: '1',
          outline: 'none',
        },
      }
    };

    this.elements = this.stripe.elements({ appearance });
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  async submitPayment() {
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      console.error('Error creating token:', error);
      alert('Payment failed. Please try again.');
      this.notify.error("Payment failed. Please try again")
      return;
    }
    this.processPayment(token.id);
  }

  processPayment(token: string) {

    const paymentData = {
      token,
      money: this.ticketPrice, // Assuming ticketPrice is set correctly elsewhere in your component
      numberOfTickets: 1, // Fixed number of tickets
      eventId: this.eventId,
      creatorId: this.creatorId,
      paymentDate: new Date().toISOString() // Set paymentDate to current date in ISO format
    };
    // Simulate backend processing (replace with actual HTTP request)
    this.paymentService.createPayment(paymentData).subscribe(
      response => {
        console.log('Payment response:', response);
        alert('Payment successful!');
        this.notify.success("Payment successful!")
        // Optionally, redirect or perform additional actions based on the response
      },
      error => {
        console.error('Error processing payment:', error);
        alert('Payment failed. Please try again.');
        this.notify.error("Payment failed. Please try again.")
        // Handle error scenario
      }
    );
  }
}
