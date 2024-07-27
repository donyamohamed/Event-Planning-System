import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ChatService } from "@shared/services/chat.service";
import { ActivatedRoute } from "@angular/router";
import { AppSessionService } from "@shared/session/app-session.service";

@Component({
  selector: "app-chat-component",
  templateUrl: "./chat-component.component.html",
  styleUrls: ["./chat-component.component.css"],
})
export class ChatComponentComponent implements OnInit, AfterViewChecked {
  public messages: any[] = [];
  public userId: number;
  public receiverId: number;
  public talkTo: string = ""; // Initialize with an empty string

  @ViewChild("messageContainer", { static: false })
  private messageContainer?: ElementRef;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private appSessionService: AppSessionService
  ) {
    this.userId = this.appSessionService.userId;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.receiverId = +params["plannerId"];
      if (this.receiverId) {
        this.loadMessages();
      }
    });

    this.chatService.startConnection();

    this.chatService["hubConnection"].on("ReceiveMessage", (messageObject) => {
      console.log("Received message object:", messageObject);

      if (
        !this.messages.find(
          (m) => m.creationTime === messageObject.creationTime
        )
      ) {
        this.messages.push(messageObject);
        this.updateTalkTo(messageObject);
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private updateTalkTo(messageObject: any) {
    if (messageObject.receiverUserId === this.receiverId) {
      this.talkTo = messageObject.receiverUserName;
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messageContainer && this.messageContainer.nativeElement) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error("Error scrolling to bottom:", err);
    }
  }

  private loadMessages() {
    if (this.receiverId) {
      this.chatService.getMessages(this.userId, this.receiverId).subscribe(
        (messages) => {
          this.messages = messages.result;

          if (messages.length > 0) {
            this.talkTo =
              messages[0].senderUserId === this.userId
                ? messages[0].SenderUserName
                : messages[0].ReceiverUserName;
          }
          this.scrollToBottom();
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
    }
  }

  public sendMessage(messageInput: HTMLInputElement) {
    const message = messageInput.value.trim();
    if (!message) {
      return; // Do not send empty message
    }

    const input = {
      senderUserId: this.userId,
      receiverUserId: this.receiverId,
      message: message,
    };

    // Send message to server
    this.chatService
      .sendMessage(input)
      .then(() => {
        messageInput.value = "";
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }

  public getMessageDate(message: any): string {
    return new Date(message.creationTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  public getMessageTime(message: any): string {
    return new Date(message.creationTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  public getUserName(message: any): string {
    return message.senderUserId === this.userId ? "You:" : "Receiver:";
  }
}
