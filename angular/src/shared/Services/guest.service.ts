import { GuestResponse } from "./../../app/guest/guest-response.model";
import { GuestPerEventResponse } from "./../../app/guest/guest-per-event-response";
import { Guest } from "./../Models/guest";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GuestGetResponse } from "@app/guest/guest-get-response";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class GuestService {
  private baseUrlForGetAll =
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/GetAll`;
  private baseUrlForGet = `${environment.API_URL_BASE_PART}/api/services/app/Guest/Get`;

  private baseUrlForCreate =
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/Add`;
  private baseUrlForDelete =
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/Delete`;
  private baseUrlForUpdate =
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/Update`;
  private baseUrlForGetAllPerEvent =
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/GetEventGuests`;

  private baseUrlforExcel = 
    `${environment.API_URL_BASE_PART}/api/services/app/Guest/AddGuestsThroughExcelFile`;
    private baseUrlDeleteAll=`${environment.API_URL_BASE_PART}/api/services/app/Guest/DeleteAllGuests` //?eventId=15&ids=21&ids=20


  constructor(private httpClient: HttpClient) { }

  public uploadFile(file: File, eventId: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const url = `${this.baseUrlforExcel}?eventId=${eventId}`;

    return this.httpClient.post<any>(url, formData);
  }



  public getAllGuest(): Observable<GuestResponse> {
    return this.httpClient.get<GuestResponse>(this.baseUrlForGetAll);
  }
  public getGuestsPerEvent(id: number): Observable<GuestPerEventResponse> {
    const url = `${this.baseUrlForGetAllPerEvent}?eventId=${id}`;
    return this.httpClient.get<GuestPerEventResponse>(url);
  }
  public getGuest(id: number): Observable<GuestGetResponse> {
    const url = `${this.baseUrlForGet}?Id=${id}`;
    return this.httpClient.get<GuestGetResponse>(
      url
    );
  }
  public createGuest(guest: Guest, eventId: number) {
    console.log(guest);

    return this.httpClient.post<Guest>(this.baseUrlForCreate + `?eventId=${eventId}`, guest);
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
  public deleteAllGuest(eventId: number, ids:number[] | null=null) {
    var url;
    if (ids?.length === 0 || ids === null) {
      url = `${this.baseUrlDeleteAll}?eventId=${eventId}`;
    } else {
      url = `${this.baseUrlDeleteAll}?eventId=${eventId}&ids=${ids.join('&ids=')}`;
    }
    return this.httpClient.delete(url);
  }
}
