import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient module
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveAccountService {
  private baseUrl = ' https://localhost:44311/api/services/app/User'; // Remove the forward slash

  constructor(private http: HttpClient) {} // Inject HttpClient module

  activeAccount(id: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Activate`, id);
  }
}
