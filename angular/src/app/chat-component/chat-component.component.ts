import { Component, OnInit } from '@angular/core';
import { ChatService } from '@shared/Services/chat.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@shared/session/app-session.service';
@Component({
  selector: 'app-chat-component',
  standalone:true,
  imports: [CommonModule ],
  templateUrl: './chat-component.component.html',
  
  styleUrls: ['./chat-component.component.css']
})
export class ChatComponentComponent implements OnInit {
  public messages: string[] = [];
  public userId = this.appSessionService.userId;
public receiverId;
  constructor(private chatService: ChatService,private route: ActivatedRoute, private appSessionService: AppSessionService) {}

  
  ngOnInit() {
    this.loadMessages();
    this.route.params.subscribe(params => {
     this.receiverId = +params['plannerId'];
      
  
  
    });
  }
  private loadMessages() {
    this.chatService.getMessages(this.userId).subscribe(
      messages => {
        console.log(messages)
        this.messages = messages.result;
      },
      error => {
        console.error('Error fetching messages:', error);
        // Handle error gracefully
      }
    );
  }

  public sendMessage(message: string) {
    const input = {
      senderUserId: this.userId,  // Replace with actual sender ID
      receiverUserId: this.receiverId,  // Replace with actual receiver ID
      message: message
    };

    this.chatService.sendMessage(input).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        // Optionally, refresh messages after sending
        this.loadMessages();
      },
      error => {
        console.error('Error sending message:', error);
        // Handle error gracefully
      }
    );
  }

  public getMessageDate(message: any): string {
    return new Date(message.creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper function to get the time part of the message creation time
  public getMessageTime(message: any): string {
    return new Date(message.creationTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    });
  }
}