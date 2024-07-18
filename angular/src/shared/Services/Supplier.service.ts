import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private createUrl = `${environment.API_URL_BASE_PART}/api/services/app/SupplierLocation/CreateSupplierPlace`;
  private getPlacesByCategoryUrl = `${environment.API_URL_BASE_PART}/api/services/app/SupplierLocation/GetPlacesByCategory`;

  constructor(private http: HttpClient) { }

  createPlace(place: any): Observable<any> {
    return this.http.post(this.createUrl, place);
  }

  getPlacesByCategory(category: number): Observable<any> {
    const url = `${this.getPlacesByCategoryUrl}?category=${category}`;
    return this.http.get(url);
  }
}
