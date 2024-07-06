import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HistoryeventService {
  private userProfileUrl = `${environment.API_URL_BASE_PART}/api/services/app/UserProfileAppServices/GetUserProfile`;
  private apiHistoryUrl = `${environment.API_URL_BASE_PART}/api/services/app/Event/GetHistoryEvent`;
  private  getEventNamesAndEventRatingApi=`${environment.API_URL_BASE_PART}/api/services/app/Event/GetNamesAndRatingForeachEvent`;
  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.userProfileUrl);
  }

  getHistoryEvent(): Observable<any> {
    return this.getUserProfile().pipe(
      switchMap(profile => {
        const userId = profile.result.id; 
        return this.http.get<any>(`${this.apiHistoryUrl}?userId=${userId}`);
      })
    );
  }
  getEventNamesAndEventRating(){
    return this.getUserProfile().pipe(
      switchMap(profile => {
        const userId = profile.result.id; 
        return this.http.get<any>(`${this.getEventNamesAndEventRatingApi}?userId=${userId}`);
      })
    );
  }
}
