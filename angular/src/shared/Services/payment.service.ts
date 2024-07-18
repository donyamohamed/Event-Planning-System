import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { NotifyService } from 'abp-ng2-module';
import {Guest}  from '../Models/guest'
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app`;
  private baseUrlForAddGuest =
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/AddAfterPayment`;
  constructor(private http: HttpClient,private notify:NotifyService) { }

 
  createPayment(paymentData: any): Observable<any> {
    const url = `${this.apiUrl}/Payment/CreateCheckoutSession`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, paymentData, { headers });
  }
  

  

 


  public createGuest(guest: Guest, eventId: number) {
    console.log(guest);

    return this.http.post<Guest>(`${this.baseUrlForAddGuest}?eventId=${eventId}`, guest);
  }


 sendEventTicketEmail(emailRequest: any): Observable<any> {
  console.log(emailRequest)
    return this.http.post(`${environment.API_URL_BASE_PART}/api/invitation/SendEventTicket`, emailRequest)
      .pipe(
        catchError((error) => {
          console.error('Error sending event ticket:', error);
          this.notify.error('Error sending event ticket.');
          return throwError(error);
        })
      );
  }

   // decrementTickets(eventId: number, numberOfTickets: number): Observable<any> {
   
  //   const params = {
  //     eventId: eventId,
  //     ticketNo: numberOfTickets
  //   };

  //   return this.http.post<any>(`${environment.API_URL_BASE_PART}/api/services/app/Event/DecrementNoOfTickets`, params);
  // }
}
