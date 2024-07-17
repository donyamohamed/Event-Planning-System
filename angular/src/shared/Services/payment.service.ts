import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { NotifyService } from 'abp-ng2-module';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app`;

  constructor(private http: HttpClient,private notify:NotifyService) { }

  // createPayment(payment: any): Observable<any> {
  //   debugger;
  //   const url = `${this.apiUrl}/Payment/CreateCheckoutSession`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.http.post<any>(url, payment, { headers, withCredentials: true });
  // }

  createPayment(paymentData: any): Observable<any> {
    const url = `${this.apiUrl}/Payment/CreateCheckoutSession`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, paymentData, { headers });
  }
  

  addGuest(data: any): Observable<any> {
    return this.http.post('/api/guest/add', data);
  }

  decrementTickets(eventId: number, numberOfTickets: number): Observable<any> {
   
    const params = {
      eventId: eventId,
      ticketNo: numberOfTickets
    };

    return this.http.post<any>(`${environment.API_URL_BASE_PART}/api/services/app/Event/DecrementNoOfTickets`, params);
  }

 sendEventTicketEmail(emailRequest: any): Observable<any> {
    return this.http.post(`${environment.API_URL_BASE_PART}/api/invitation/SendEventTicket`, emailRequest)
      .pipe(
        catchError((error) => {
          console.error('Error sending event ticket:', error);
          this.notify.error('Error sending event ticket.');
          return throwError(error);
        })
      );
  }
}
