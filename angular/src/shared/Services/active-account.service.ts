import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ActiveAccountService {
  private baseUrl = `${environment.API_URL_BASE_PART}/api/services/app`; 

  constructor(private http: HttpClient) {} 

  activeAccount(id: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/User/Activate`, id);
  }
}
