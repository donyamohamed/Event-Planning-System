import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventsResponse } from '@app/home/eventInterface';
import { map, Observable } from 'rxjs';
import { Enumerator } from "../Models/Event";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private publicEventsUrl = `${environment.API_URL_BASE_PART}/api/services/app/Event/GetPublicEventsByInterest`;
  private publicEventsUrl2 = `${environment.API_URL_BASE_PART}/api/services/app/Event/GetPublicEventsByCategory`;
  private allPublicEventsUrl = `${environment.API_URL_BASE_PART}/api/services/app/Event/GetAllPublicEvents`;

  constructor(private http: HttpClient) {}

  getPublicEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.publicEventsUrl);
  }

  getEventsByCategory(_category: Enumerator): Observable<EventsResponse> {
    const url = `${this.publicEventsUrl2}?_category=${_category}`;
    console.log(`Fetching events from URL: ${url}`);
    return this.http.get<EventsResponse>(url);
  }

  getAllPublicEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.allPublicEventsUrl);
  }
}