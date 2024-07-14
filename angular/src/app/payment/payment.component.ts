import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit  {
  stripe: any;
  elements: any;
  card: any;
  ticketPrice: number = 20; // Example ticket price

  constructor() {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51PbhokHI9E95Zl9vzuPBiZV7E7SpMsqrFIFBLgX8tkfvC57mkWUUM3x6kDc8XkHjr8MlI6yydbrcQUoGl6Hdj68Z00Ble9w77m');
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }

  async submitPayment() {
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      console.error('Error creating token:', error);
      alert('Payment failed. Please try again.');
      return;
    }
    this.processPayment(token.id);
  }

  processPayment(token: string) {
    // Here you would make an HTTP request to your backend to process the payment
    // Example pseudo-code:
    // this.http.post('/api/payment', { token, amount: this.ticketPrice }).subscribe(response => {
    //   if (response.success) {
    //     alert('Payment successful!');
    //   } else {
    //     alert('Payment failed. Please try again.');
    //   }
    // });
    alert('Payment successful!');
  }

}
