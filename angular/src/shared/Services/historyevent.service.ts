import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryeventService {
  private userProfileUrl = "https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile";
  private apiHistoryUrl = "https://localhost:44311/api/services/app/Event/GetHistoryEvent";

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
}
