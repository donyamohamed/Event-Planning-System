import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../Models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = "https://localhost:44311/api/services/app/Event/Create";
  private budgetUrl = "https://localhost:44311/api/services/app/BudgetExpenseAppServices/GetAll";

  constructor(private http: HttpClient) { }

  public createEvent(eventData: Event): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, eventData);
  }

  public getBudgetAmounts(): Observable<any> {
    return this.http.get<any>(this.budgetUrl);
  }
}

