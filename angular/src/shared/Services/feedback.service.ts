import { ApiResponse } from './../../app/layout/event-details/rating-interface';
import { Injectable } from '@angular/core';
import { Feedback } from '../Models/feedback';
import { GuestFeedback } from '../Models/GuestFeed';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public http:HttpClient) { }

  private createUrl = 'https://localhost:44311/api/services/app/Feedback/Create';
  private getRatingUrl = 'https://localhost:44311/api/Feedback/CalculateAverageRating';
  private CreateGuestFeedUrl='https://localhost:44311/api/services/app/GuestsFeedback/Add';


 public createFeedback(feedbackFormData: Feedback): Observable<any> {
    return this.http.post<any>(this.createUrl, feedbackFormData)
  }
  public createFeed(feedbackFormData: GuestFeedback): Observable<any> {
    return this.http.post<any>(this.CreateGuestFeedUrl, feedbackFormData)
  }
  public getRating(eventId:number):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.getRatingUrl + '/' + eventId)
  }
}
