import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
        providedIn: 'root'
})
export class SupplierService {
        private createUrl = 'https://localhost:44311/api/services/app/SupplierLocation/CreateSupplierPlace';
        constructor(private http: HttpClient) { }
        createPlace(place: any) {
                return this.http.post(this.createUrl, place);
        }
}