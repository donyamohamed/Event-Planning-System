import { ApiResponse } from './../../app/layout/event-details/rating-interface';
import { Injectable } from '@angular/core';
import { Feedback } from '../Models/feedback';
import { GuestFeedback } from '../Models/GuestFeed';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public http: HttpClient) { }

  private createUrl = `${environment.API_URL_BASE_PART}/api/services/app/Feedback/Create`;
  private getRatingUrl = `${environment.API_URL_BASE_PART}/api/Feedback/CalculateAverageRating`;
  private CreateGuestFeedUrl=`${environment.API_URL_BASE_PART}/api/services/app/GuestsFeedback/Add`;
  private getAllFeedbackUrl = `${environment.API_URL_BASE_PART}/api/services/app/Feedback/GetFeedbackByEventId`;


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
