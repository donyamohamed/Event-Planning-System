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
  private baseUrl= 'https://localhost:44311/api/services/app/Guest/'
  private baseUrlForGetAll =`${this.baseUrl}GetAll`;
  private baseUrlForGet = `${this.baseUrl}Get`;
  // private baseUrlForCreate = `${this.baseUrl}Create`;
  private baseUrlForCreate =`${this.baseUrl}Add`;
  private baseUrlForDelete =`${this.baseUrl}Delete`;
  private baseUrlForUpdate =
    `${this.baseUrl}Update`;
  private baseUrlForGetAllPerEvent =
    `${this.baseUrl}GetEventGuests`;

  private baseUrlforExcel = 
    `${this.baseUrl}AddGuestsThroughExcelFile`;
    private baseUrlDeleteAll=`${this.baseUrl}DeleteAllGuests` //?eventId=15&ids=21&ids=20

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
