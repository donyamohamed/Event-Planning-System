import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventsResponse } from '@app/home/eventInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private publicEventsUrl = "https://localhost:44311/api/services/app/Event/GetPublicEventsByInterest";

  constructor(private http:HttpClient) { }
  getPublicEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.publicEventsUrl);
  }
}
