import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRServiceService {
  public hubConnection: signalR.HubConnection;

  public startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44311/chatHub')
      .build();

    return this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        throw err; // Ensure the error is propagated
      });
  }

  public addReceiveAnswerListener() {
    this.hubConnection.on('ReceiveAnswer', (data) => {
      console.log('Received answer: ', data);
    });
  }

  public askQuestion(question: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('AskQuestion', question)
        .catch(err => console.error(err));
    } else {
      console.error('Cannot send data if the connection is not in the Connected state.');
    }
  }
}
