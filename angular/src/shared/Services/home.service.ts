import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventsResponse } from '@app/home/eventInterface';
import { map, Observable } from 'rxjs';
import { Event } from '@shared/Models/Event';
import { Enumerator } from "../../shared/Models/Event";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private publicEventsUrl = "https://localhost:44311/api/services/app/Event/GetPublicEventsByInterest";

  constructor(private http: HttpClient) {}

  getPublicEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.publicEventsUrl);
  }
  private publicEventsUrl2 = "https://localhost:44311/api/services/app/Event/GetPublicEventsByCategory";


  public getEventsByCategory(_category: Enumerator): Observable<EventsResponse> {
    const url = `${this.publicEventsUrl2}?_category=${_category}`;
    console.log(`Fetching events from URL: ${url}`);
    return this.http.get<EventsResponse>(url);
  }


}
