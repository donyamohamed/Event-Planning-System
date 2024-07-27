import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  
  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/Event/Create`;

 
  constructor(private http: HttpClient) { }
  

  public createEvent(eventData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, eventData);
  }



}
