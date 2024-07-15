import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app/Payment`;
  constructor(private http: HttpClient) { }
  createPayment(payment: any): Observable<any> {
    const url = `${this.apiUrl}/Create`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, payment, { headers });
  }
}
