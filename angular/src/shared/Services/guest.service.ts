import { GuestResponse } from "./../../app/guest/guest-response.model";
import { GuestPerEventResponse } from "./../../app/guest/guest-per-event-response";
import { Guest } from "./../Models/guest";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
  private baseUrlForGetAllPerEvent =
    "https://localhost:44311/api/services/app/Guest/GetEventGuests";
 
    private baseUrlforExcel = 'https://localhost:44311/api/services/app/Guest/AddGuestsThroughExcelFile';

    constructor(private httpClient: HttpClient) {}

   public uploadFile(file: File, eventId: number): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
  
      const url = `${this.baseUrlforExcel}?eventId=${eventId}`;
  
      return this.httpClient.post<any>(url, formData);
    }




  public getAllGuest(): Observable<GuestResponse> {
    return this.httpClient.get<GuestResponse>(this.baseUrlForGetAll);
  }
  public getGuestsPerEvent(id:number): Observable<GuestPerEventResponse> {
    const url = `${this.baseUrlForGetAllPerEvent}?eventId=${id}`;
    return this.httpClient.get<GuestPerEventResponse>(url);
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
