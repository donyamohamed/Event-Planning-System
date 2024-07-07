import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentUser } from '@shared/Models/current-user';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CurrentUserDataService {
  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/UserProfileAppServices/GetUserProfile`;
  private UpdateUrl=`${environment.API_URL_BASE_PART}/api/services/app/UserProfileAppServices/UpdateUserProfileData`;

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
