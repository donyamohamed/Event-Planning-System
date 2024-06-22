import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-chat-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-component.component.html',
  styleUrls: ['./chat-component.component.css']  // Correct property name
})
export class ChatComponentComponent implements OnInit {
  private hubConnection: signalR.HubConnection;
  public messages: string[] = [];

  ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44311/chatHub')
      .build();

    this.hubConnection.start().catch(err => console.error('Error while starting connection: ' + err.toString()));

    this.hubConnection.on('ReceiveMessage', (message) => {
      this.messages.push(message);
    });
  }

  public sendMessage(message: string) {
    const input = {
      senderUserId: 8,  // Example sender ID
      receiverUserId: 3,  // Example receiver ID
      message: message
    };
    this.hubConnection.invoke('SendMessage', input)
      .catch(err => console.error('Error while sending message: ' + err.toString()));
  }
}
