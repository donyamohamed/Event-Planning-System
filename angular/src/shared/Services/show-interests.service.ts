import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interest } from '../Models/interestss';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShowInterestsService {
  private baseUrl="https://localhost:44311/api/services/app/Interests/GetAllIntersts";
  private baseUrl2="https://localhost:44311/api/services/app/Interests/addUserInterests";
  private baseUrl3="https://localhost:44311/api/services/app/Interests/GetHasInterests";

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
