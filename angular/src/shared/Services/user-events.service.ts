import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../Models/Event'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class UserEventsService {
  private apiUrl = 'https://localhost:44311/api/services/app/Event/GetUserEvents';

  constructor(private http: HttpClient) {}

  getUserEvents(userId: number): Observable<Event[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<{ result: Event[] }>(url).pipe(
      map(response => response.result) // Assuming the API returns an object with a `result` property
    );
   
    
  }
  
}
