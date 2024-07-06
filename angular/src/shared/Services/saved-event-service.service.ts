import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SavedEventServiceService {

  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/FavouriteEvent`;

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
