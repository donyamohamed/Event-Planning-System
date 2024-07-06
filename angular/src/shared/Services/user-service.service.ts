import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CurrentUser } from '@shared/Models/current-user';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app/User/GetUserById`;

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?Id=${userId}`);
  }

  getUserById2(userId: number): Observable<CurrentUser> {
    return this.http.get<any>(`${this.baseUrl}?Id=${userId}`).pipe(
      map((data) => data["result"]
      ),
    );;
  }
}
