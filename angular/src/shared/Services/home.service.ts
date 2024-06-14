import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventsResponse } from '@app/home/eventInterface';
import { Observable } from 'rxjs';
import { Event } from '@shared/Models/Event';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private publicEventsUrl = "https://localhost:44311/api/services/app/Event/GetPublicEventsByInterest";
  testData:Event[]=[];
  constructor(private http:HttpClient) { }
  getPublicEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.publicEventsUrl);
  }
}
