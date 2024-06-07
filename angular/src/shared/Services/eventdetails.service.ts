import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../Models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventdetailsService {

  constructor(private http: HttpClient) { }

  getEventById(eventId: number): Observable<any> {
    const url = `https://localhost:44311/api/services/app/Event/Get?Id=${eventId}`;
    return this.http.get<any>(url);
  }
}
