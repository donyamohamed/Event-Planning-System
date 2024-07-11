import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interest } from '../Models/interestss';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShowInterestsService {
  private baseUrl=`${environment.API_URL_BASE_PART}/api/services/app/Interests/GetAllInterstsForChoosing`;
  private baseUrl2=`${environment.API_URL_BASE_PART}/api/services/app/Interests/addUserInterests`;
  private baseUrl3=`${environment.API_URL_BASE_PART}/api/services/app/Interests/GetHasInterests`;

  constructor(private http : HttpClient) { }

   public GetAllInterests(): Observable<Interest[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.result)
    );
  }

  public AddInterstsForUser(ids : number[]) : Observable<any>{
    return this.http.post<number[]>(this.baseUrl2 , ids);
  }

  public HasInterests():Observable<boolean>{
    return this.http.get<any>(this.baseUrl3).pipe(
      map(response=>response.result)
    );
  }

}
