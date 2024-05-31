import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Interests } from '@shared/Models/interests';

@Injectable({
  providedIn: 'root'
})
export class InterestsService {

  constructor(public http:HttpClient) { }
  getUrl="https://localhost:44311/api/services/app/Interests/GetUserIntersts";
  deleteUrl="https://localhost:44311/api/services/app/Interests/Delete";
  GetAll="https://localhost:44311/api/services/app/Interests/GetAllInterests";
  addUrl="https://localhost:44311/api/services/app/Interests/Add";

  public GetUserInterests(){
    return this.http.get<Interests>(this.getUrl);
  }
  public Delete(id:number){
    const headers = new HttpHeaders().set('id', id.toString());
    console.log("id",id);
    const options = {
      headers: headers
    };
    return this.http.delete(this.deleteUrl,options);
  }
  public GetAllInterests(){
    return this.http.get(this.GetAll);
  }


public AddInterest(interestId: any, interestData: any) {
  const headers = new HttpHeaders().set('id', interestId.toString());
  const options = {
    headers: headers
  };
  return this.http.post(this.addUrl, interestData, options);
}

}
