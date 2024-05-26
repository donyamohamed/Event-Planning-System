import { GuestResponse } from "./../../app/guest/guest-response.model";
import { Guest } from "./../Models/guest";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
  private queryString = "?Id=";
  
  constructor(private httpClient: HttpClient) {}
  public getAllGuest(): Observable<GuestResponse> {
    return this.httpClient.get<GuestResponse>(this.baseUrlForGetAll);
  }
  public getGuest(id: number) {
    return this.httpClient.get<Guest>(
      this.baseUrlForGet + this.queryString + id
    );
  }
  public createGuest(guest: Guest) {
    return this.httpClient.post<Guest>(this.baseUrlForCreate, guest);
  }
  public updateGuest(guest: Guest) {
    return this.httpClient.put<Guest>(this.baseUrlForUpdate, guest);
  }
  public deleteGuest(id: number) {
    return this.httpClient.delete(
      this.baseUrlForDelete + this.queryString + id
    );
  }
}
