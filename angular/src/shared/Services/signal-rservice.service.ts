import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalRServiceService  {
  public hubConnection: signalR.HubConnection;
  private connectionEstablished: boolean = false;
  private pendingInvocations: Array<{ method: string, args: any[] }> = [];

  public startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_URL_BASE_PART}/chatbothub`)
      .build();

    return this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.connectionEstablished = true;
        this.processPendingInvocations();
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        throw err; 
      });
  }

  private processPendingInvocations() {
    this.pendingInvocations.forEach(invocation => {
      this.hubConnection.invoke(invocation.method, ...invocation.args)
        .catch(err => console.error(err));
    });
    this.pendingInvocations = [];
  }

  public addReceiveAnswerListener() {
    this.hubConnection.on('ReceiveAnswer', (data) => {
      console.log('Received answer: ', data);
    });
  }

  public askQuestion(question: string) {
    if (this.connectionEstablished) {
      this.hubConnection.invoke('AskQuestion', question)
        .catch(err => console.error(err));
    } else {
      console.error('Connection is not established. Please try again later.');
      this.pendingInvocations.push({ method: 'AskQuestion', args: [question] });
    }
  }
}
