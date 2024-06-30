import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChatService } from '@shared/Services/chat.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-icon',
  standalone: true,
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.css'],
  imports: [CommonModule, SharedModule]
})
export class ChatIconComponent implements OnInit {
  AllChats: any[] = [];
  defaultImage = './../../assets/img/userImg.png';
  LastMsgs: { [key: number]: any } = {};
  public userId = this.appSessionService.userId;
  isCollapsed = false;
  public unreadMessageCount: number = 0;
  constructor(
    private chatService: ChatService,
    private elementRef: ElementRef,
    private appSessionService: AppSessionService,
    public router: Router
  ) {}

  ngOnInit(): void {
      this.loadUnreadMessageCount();
    this.loadAllChats();

  }
  loadUnreadMessageCount(): void {
    this.chatService.getUnreadMessageCount().subscribe(
      (count: any) => {
        console.log(count);
        this.unreadMessageCount = count.result; // Ensure to use the correct property
      },
      error => {
        console.error('Error fetching unread message count:', error);
      }
    );
  }
  private loadAllChats() {
    this.chatService.GetAllUserChats().subscribe({
      next: chats => {
        if (chats && chats.result) {
          this.AllChats = chats.result;
          this.AllChats.forEach(chat => {
            this.loadLastMsg(chat.recieverId);
          });
        }
      },
      error: err => {
        console.error('Error fetching all chats:', err);
      }
    });
  }

  private loadLastMsg(receiverId: number) {
    this.chatService.GetLastMessage(receiverId).subscribe(
      lastMsg => {
        console.log('Last message for receiver', receiverId, ':', lastMsg); // Check last message data
        this.LastMsgs[receiverId] = lastMsg.result;
      },
      error => {
        console.error('Error fetching last message:', error);
      }
    );
  }

  public getLastMsg(receiverId: number) {
    return this.LastMsgs[receiverId] || {};
  }

  toggleCollapse(event: MouseEvent) {
    this.isCollapsed = !this.isCollapsed;
    event.stopImmediatePropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCollapsed = false;
    }
  }

  LoadUserChat(id: any) {
    this.router.navigateByUrl(`/app/Chat/${id}`);
  }

  public getMessageTime(message: any): string {
    return new Date(message).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    });
  }
}