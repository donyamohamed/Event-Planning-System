import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interests } from '@shared/Models/interests';

@Injectable({
  providedIn: 'root'
})
export class InterestsService {

  constructor(public http:HttpClient) { }
  getUrl="https://localhost:44311/api/services/app/Interests/GetUserIntersts";
  public GetUserInterests(){
    return this.http.get<Interests>(this.getUrl);
  }
}
