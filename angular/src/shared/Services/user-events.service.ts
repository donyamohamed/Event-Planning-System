import { EventResponse } from './../../app/guest/event-response';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../Models/Event'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  private apiUrl = 'https://localhost:44311/api/services/app/Event';
private apiGuestUrl='https://localhost:44311/api/UpcomingEventUserAttended'
  constructor(private http: HttpClient) {}

  getUserEvents(userId: number): Observable<Event[]> {
    const url = `${this.apiUrl}/GetUserEvents?userId=${userId}`;
    return this.http.get<{ result: Event[] }>(url).pipe(
      map(response => response.result)
    );
  }

  getUpcomingEventsForCurrentUser(userId: number): Observable<Event[]> {
    const url = `${this.apiGuestUrl}/GetUserAcceptedUpcomingEvents?userId=${userId}`;
    return this.http.get<{ result: Event[] }>(url).pipe(
      map(response => response.result)
    );
  }


  getUpcomingEventsToAttendForCurrentUser(userId: number): Observable<Event[]> {
    const url = `${this.apiUrl}/GetUpcomingEventsForCurrentUser?userId=${userId}`;
    return this.http.get<{ result: Event[] }>(url).pipe(
      map(response => response.result)
    );
  }


  deleteEvent(eventId: number): Observable<void> {
    const url = `${this.apiUrl}/DeleteEventWithDetails?eventId=${eventId}`;
    return this.http.delete<void>(url);
  }
  editEvent(event:Event): Observable<void> {
    const url = `${this.apiUrl}/Update`;
    return this.http.put<void>(url,event);
  }

  getEventById(id:Number): Observable<EventResponse> {
    const url = `${this.apiUrl}/Get?Id=${id}`;
    return this.http.get<EventResponse>(url);
  }
}

  
