import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentUser } from '@shared/Models/current-user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserDataService {
  private baseUrl = "https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile";
  private UpdateUrl="https://localhost:44311/api/services/app/UserProfileAppServices/UpdateUserProfileData";

  constructor(private http: HttpClient) {}

  public GetCurrentUserData(): Observable<CurrentUser> {
    return this.http.get<{ result: CurrentUser }>(this.baseUrl).pipe(
      map(response => response.result)
    );
  }
  public UpdateUserData(user:FormData){
  return this.http.put<CurrentUser>(this.UpdateUrl,user);
  }
}
