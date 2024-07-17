


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
      this.updateAmount();
    });

    this.stripe = await loadStripe('pk_test_51PcdCYAFPDLjCbDzwHkNgTZrjOtrHXTVE4pakNnVcAeWrAmdj3n7ijP4K55TqQX6c5j2OUfOGYtl95nremtJHEXQ00jN5ilOxe');

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }
  }

  incrementTickets() {
    this.numberOfTickets++;
    this.updateAmount();
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

  async submitPayment() {
 
    const paymentData = {
      id: 0, 
      userId:this.creatorId ,
      guestId:this.userId,
      eventId: this.eventId,
      money: this.totalAmount,
      numberOfTickets: this.numberOfTickets,
      paymentDate: new Date().toISOString() 
    };

    this.paymentService.createPayment(paymentData).subscribe(
      async response => {
        const sessionId = response.result.sessionId;
        if (this.stripe) {
          await this.stripe.redirectToCheckout({ sessionId });
        }
      },
      error => {
        console.error('Error creating checkout session:', error);
        this.notify.error('Payment failed. Please try again.');
      }
    );
  }
}










// import { Component, OnInit } from '@angular/core';
// import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { ActivatedRoute,Router } from '@angular/router';
// import { AppSessionService } from '@shared/session/app-session.service';
// import { PaymentService } from '@shared/services/payment.service';
// import { NotifyService } from 'abp-ng2-module';
// import swal from 'sweetalert2';
// @Component({
//   selector: 'app-payment',
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css']
// })
// export class PaymentComponent implements OnInit {
//   stripe: Stripe | null = null;
//   elements: any;
//   card: any;
//   ticketPrice: number;
//   eventId: number;
//   creatorId: number;
//   userId: number;
//   numberOfTickets: number = 1;
//   totalAmount: number;

//   constructor(
//     private route: ActivatedRoute,
//     private appSessionService: AppSessionService,
//     private paymentService: PaymentService,
//     private notify: NotifyService,
//     private router: Router,
//   ) {
//     this.userId = this.appSessionService.userId; // Fetch user ID from session
//   }

//   async ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       this.eventId = params['eventId'];
//       this.creatorId = params['creatorId'];
//       this.ticketPrice = params['ticketPrice'];
//       this.updateAmount();
//     });

//     this.stripe = await loadStripe('pk_test_51PcdCYAFPDLjCbDzwHkNgTZrjOtrHXTVE4pakNnVcAeWrAmdj3n7ijP4K55TqQX6c5j2OUfOGYtl95nremtJHEXQ00jN5ilOxe');

//     if (this.stripe) {
//       this.elements = this.stripe.elements();
//       this.card = this.elements.create('card');
//       this.card.mount('#card-element');
//     }
//   }

//   incrementTickets() {
//     this.numberOfTickets++;
//     this.updateAmount();
//   }

//   decrementTickets() {
//     if (this.numberOfTickets > 1) {
//       this.numberOfTickets--;
//       this.updateAmount();
//     }
//   }

//   updateAmount() {
//     this.totalAmount = this.ticketPrice * this.numberOfTickets;
//   }

//   async submitPayment() {
//     const paymentData = {
//       id: 0,
//       userId: this.creatorId,
//       guestId: this.userId,
//       eventId: this.eventId,
//       money: this.totalAmount,
//       numberOfTickets: this.numberOfTickets,
//       paymentDate: new Date().toISOString()
//     };

//     this.paymentService.createPayment(paymentData).subscribe(
//       async response => {
//         console.log(response)
//         const clientSecret = response.result.clientSecret;
//         if (this.stripe) {
//           const { error } = await this.stripe.confirmCardPayment(clientSecret, {
//             payment_method: {
//               card: this.card,
//               billing_details: {
//                 name: 'Jenny Rosen'
//               }
//             }
//           });

//           if (error) {
//             console.error('Payment failed:', error.message);
//             this.notify.error('Payment failed. Please try again.');
//           } else {
//             console.log('Payment successful');
//             this.notify.success('Payment successful!');
//             swal.fire({
//               icon: 'success',
//               title: 'Payment Successful!',
//               text: 'Redirecting to home page...',
//               confirmButtonText: 'OK',
//               allowOutsideClick: false
//             }).then((result) => {
//               if (result.isConfirmed || result.isDismissed) {
          
//                 this.router.navigate(['/app/home']);
//               }
//             });
          
//           }
//         }
//       },
//       error => {
//         console.error('Error creating payment intent:', error);
//         this.notify.error('Payment failed. Please try again.');
//       }
//     );
//   }
// }
