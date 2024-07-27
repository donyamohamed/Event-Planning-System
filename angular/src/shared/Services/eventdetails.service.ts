import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventdetailsService {

  constructor(private http: HttpClient) { }

  getEventById(eventId: number): Observable<any> {
    const url = `${environment.API_URL_BASE_PART}/api/services/app/Event/Get?Id=${eventId}`;
    return this.http.get<any>(url);
  }

  getGuestCountByEventId(eventId:number): Observable<any>{
    const url = `${environment.API_URL_BASE_PART}/api/services/app/AllGuestService/GetGuestCountByEventId?eventId=${eventId}`;
    return this.http.get<any>(url);
  }

  getPlaceOfEvent(eventId : number):Observable<any>{
    const url = `${environment.API_URL_BASE_PART}/api/services/app/SupplierLocation/GetPlaceForEvent?eventId=${eventId}`;
    return this.http.get<any>(url);
  }

}
