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
  private UserRole=`${environment.API_URL_BASE_PART}/api/services/app/User/GetUserById?id=`;

  constructor(private http: HttpClient) {}

  public GetCurrentUserData(): Observable<CurrentUser> {
    return this.http.get<{ result: CurrentUser }>(this.baseUrl).pipe(
      map(response => response.result)
    );
  }
  public UpdateUserData(user:FormData){
  return this.http.put<CurrentUser>(this.UpdateUrl,user);
  }
  public GetUserRole(id:number|any){
    return  this.http.get(this.UserRole+id);
  }

  getUserRole(id: number | any): Observable<string> {
    return this.http.get<{ result: { roleNames: string[] } }>(this.UserRole + id).pipe(
      map(response => response.result.roleNames[0])
    );
  }
}
