import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Event } from '../Models/Event';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private createUrl = `${environment.API_URL_BASE_PART}/api/services/app/SupplierLocation/CreateSupplierPlace`;
  private getPlacesByCategoryUrl = `${environment.API_URL_BASE_PART}/api/services/app/SupplierLocation/GetPlacesByCategory`;
  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app/SupplierLocation`;
  private userProfileUrl = `${environment.API_URL_BASE_PART}/api/services/app/UserProfileAppServices/GetUserProfile`;



  constructor(private http: HttpClient) { }

  createPlace(place: any): Observable<any> {
    return this.http.post(this.createUrl, place);
  }

  getPlacesByCategory(category: number): Observable<any> {
    const url = `${this.getPlacesByCategoryUrl}?category=${category}`;
    return this.http.get(url);
  }
  getPendingEventsBySupplierId(userId: number): Observable<Event[]> {
    return this.http.get<any>(`${this.apiUrl}/GetPendingEventsBySupplierId?userId=${userId}`).pipe(
      map(response => response.result)
    );
  }
  getPendingEventsCount(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPendingEventsCountBySupplierId?userId=${userId}`);
  }

  acceptEvent(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/AcceptEvent?eventId=${eventId}`, {});
  }

  rejectEvent(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/RejectEvent?eventId=${eventId}`, {});
  }
  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.userProfileUrl).pipe(
      map(response => response.result)
    );
  }

  //asma:)
  getAllPlacesWithSupplierInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllPlacesWithSupplierInfo`).pipe(
      map(response => response.result)
    );
  }

  getPlacesBySupplier(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPlacesBySupplier?userId=${userId}`).pipe(
      map(response => response.result)
    );
  }
}
