import { Injectable } from '@angular/core';
import { Feedback } from '../Models/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(public http:HttpClient) { }

  private createUrl = 'https://localhost:44311/api/services/app/Feedback/Create';


 public createFeedback(feedbackFormData: Feedback): Observable<any> {
    return this.http.post<any>(this.createUrl, feedbackFormData)
  }
}
