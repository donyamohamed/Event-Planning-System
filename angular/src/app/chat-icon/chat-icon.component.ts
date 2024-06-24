import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { ChatService } from '@shared/Services/chat.service';

@Component({
    selector: 'app-chat-icon',
    standalone: true,
    templateUrl: './chat-icon.component.html',
    styleUrl: './chat-icon.component.css',
    imports: [CommonModule, SharedModule]
})
export class ChatIconComponent implements OnInit{
  AllChats:any;
  ngOnInit(): void {
   this.chatService.GetAllUserChats().subscribe({
    next:chats=>{
       if(chats && chats.result){
        this.AllChats=chats.result;
       }
    }
   });

  }
  constructor(private chatService:ChatService) {
  }
  isCollapsed = false;
  toggleCollapse(event: MouseEvent) {
    this.isCollapsed = !this.isCollapsed;
    event.stopImmediatePropagation();
  }
  //

}
