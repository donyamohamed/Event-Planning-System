import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavedEventServiceService {

  private baseUrl = 'https://localhost:44311/api/services/app/FavouriteEvent';

  constructor(private http: HttpClient) { }

  getSavedEvents(userId: number): Observable<any> {
    const url = `${this.baseUrl}/GetSavedEvent?userId=${userId}`;
    return this.http.get(url);
  }

  createSavedEvent(eventData: any): Observable<any> {
    const url = `${this.baseUrl}/Create`;
    return this.http.post(url, eventData);
  }

  deleteSavedEvent(id: number): Observable<any> {
    const url = `${this.baseUrl}/Delete?Id=${id}`;
    return this.http.delete(url);
  }
}
