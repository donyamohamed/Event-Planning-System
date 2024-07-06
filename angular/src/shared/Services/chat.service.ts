import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from 'abp-ng2-module';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection;
  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app/ChatMessage`; // Update with your actual API URL

  constructor(private http: HttpClient, private _tokenService: TokenService) {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_URL_BASE_PART}/chathub`, {
        accessTokenFactory: () => {
          return this._tokenService.getToken() || '';
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startHubConnection = () => {
      this.hubConnection.start()
        .then(() => console.log('Connection started'))
        .catch(err => {
          console.error('Error while starting connection: ' + err);
          setTimeout(startHubConnection, 5000); // Retry connection after 5 seconds
        });
    };

    this.hubConnection.onclose(async () => {
      console.log('Connection closed. Reconnecting...');
      await startHubConnection(); // Ensure reconnection attempt is awaited
    });

    startHubConnection(); // Start initial connection

    // Add message listener directly in startConnection
    this.hubConnection.on('ReceiveMessage', (message) => {
      console.log('Received message:', message);
      // alert(message.message);
      // Handle the message here, such as updating the UI or invoking other functions
    });
  }

  sendMessage(input: any): Promise<void> {
    return this.hubConnection.invoke('SendMessage', input)
      .catch(err => console.error(err));
  }

  getMessages(userId: number, receiverId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getMessages?userId=${userId}&receiverId=${receiverId}`);
  }

  GetAllUserChats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllUserChats`);
  }

  GetLastMessage(receiverId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetTheLastMsg/?receiverId=${receiverId}`);
  }

  getUnreadMessageCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/GetUnreadMessageCount`);
  }
}
