import { GuestResponse } from "./../../app/guest/guest-response.model";
import { Guest } from "./../Models/guest";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GuestGetResponse } from "@app/guest/guest-get-response";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class GuestService {
  private baseUrlForGetAll =
    "https://localhost:44311/api/services/app/Guest/GetAll";
  private baseUrlForGet = "https://localhost:44311/api/services/app/Guest/Get";
  private baseUrlForCreate =
    "https://localhost:44311/api/services/app/Guest/Create";
  private baseUrlForDelete =
    "https://localhost:44311/api/services/app/Guest/Delete";
  private baseUrlForUpdate =
    "https://localhost:44311/api/services/app/Guest/Update";
 
  
  constructor(private httpClient: HttpClient) {}
  public getAllGuest(): Observable<GuestResponse> {
    return this.httpClient.get<GuestResponse>(this.baseUrlForGetAll);
  }
  public getGuest(id: number):Observable<GuestGetResponse> {
    const url = `${this.baseUrlForGet}?Id=${id}`;
    return this.httpClient.get<GuestGetResponse>(
      url
    );
  }
  public createGuest(guest: Guest) {
    console.log(guest);
    
    return this.httpClient.post<Guest>(this.baseUrlForCreate, guest);
  }
  public updateGuest(guest: Guest) {
    
    return this.httpClient.put<Guest>(this.baseUrlForUpdate, guest);
  }
  public deleteGuest(id: number) {
    const url = `${this.baseUrlForDelete}?Id=${id}`;
    return this.httpClient.delete(
      url
    );
  }
}
