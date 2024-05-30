import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interest } from '../Models/interestss';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShowInterestsService {
  private baseUrl="https://localhost:44311/api/services/app/Interests/GetAllIntersts";

  constructor(private http : HttpClient) { }

   public GetAllInterests(): Observable<Interest[]>{
    return this.http.get<Interest[]>(this.baseUrl);
   }
}
