import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:44311/api/services/app/ChatMessage'; // Update with your actual API URL
  private GetAllUrl = 'https://localhost:44311/api/services/app/ChatMessage/GetAllReceiversData';

  constructor(private http: HttpClient) { }

  getMessages(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetMessages/?userId=${userId}`);
  }
  sendMessage(input: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SendMessage`, input);
  }
  GetAllUserChats(): Observable<any> {
    return this.http.get(this.GetAllUrl);
  }
}
