import { ApiResponse } from './../../app/layout/event-details/rating-interface';
import { Injectable } from '@angular/core';
import { Feedback } from '../Models/feedback';
import { GuestFeedback } from '../Models/GuestFeed';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public http: HttpClient) { }

  private createUrl = 'https://localhost:44311/api/services/app/Feedback/Create';
  private getRatingUrl = 'https://localhost:44311/api/Feedback/CalculateAverageRating';
  private CreateGuestFeedUrl='https://localhost:44311/api/services/app/GuestsFeedback/Add';
  private getAllFeedbackUrl = 'https://localhost:44311/api/services/app/Feedback/GetFeedbackByEventId'


  public createFeedback(feedbackFormData: Feedback): Observable<any> {
    return this.http.post<any>(this.createUrl, feedbackFormData)
  }

  public createFeed(feedbackFormData: GuestFeedback): Observable<any> {
    return this.http.post<any>(this.CreateGuestFeedUrl, feedbackFormData)
  }
  public getRating(eventId:number):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.getRatingUrl + '/' + eventId)
  }
  public getAllFeedback(eventId: number): Observable<Feedback[]> {
    const url = `${this.getAllFeedbackUrl}?eventId=${eventId}`;
    return this.http.get<Feedback[]>(url).pipe(
      map((data) => data["result"]
      ),
    );
  }

}
