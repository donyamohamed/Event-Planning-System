import { InvitationService } from './../../../shared/Services/invitation.service';
import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { GuestService } from "../../../shared/Services/guest.service";
import { Guest } from "../../../shared/Models/guest";
import { GuestResponse } from "../guest-response.model";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { GuestGetResponse } from "../guest-get-response";
import { GuestPerEventResponse } from "../guest-per-event-response";
import { EmailRequest } from "../../../shared/Models/EmailRequest";
import { now } from 'moment/moment';


@Component({
  selector: "app-all-guest",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: "./all-guest.component.html",
  styleUrl: "./all-guest.component.css",
})
export class AllGuestComponent implements OnInit {
  modalRef: BsModalRef;
  subscribe: Subscription | null = null;
  subGuest: Subscription | null = null;
  guests: Guest[] = [];
  dataTable: any;
  guest: Guest = new Guest();
  guestEdit: Guest = new Guest();
  static guestsCount: number;
  bsModalRef: any;
  private emailObj:EmailRequest=new EmailRequest();
  constructor(
    public guestSer: GuestService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private invitation:InvitationService
  ) {}
  ngOnInit(): void {
    this.subscribe = this.activatedRoute.params.subscribe((params) => {
      this.subGuest = this.guestSer.getGuestsPerEvent(params["id"]).subscribe({
        next: (res: GuestPerEventResponse) => {
          console.log(res);
          this.guests = res.result;
         // AllGuestComponent.guestsCount = res.result.totalCount;
          console.log(this.guests);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
    if(AllGuestComponent.guestsCount==0){
     // this.router.navigate(["/event"]); //must go to add gusts page
    }
  }
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }
  openEditModal(template: TemplateRef<any>, id: number): void {
    this.bsModalRef = this.modalService.show(template);
    // this.subscribe = this.activatedRoute.params.subscribe((params) => {
    this.subGuest = this.guestSer.getGuest(id).subscribe({
      next: (data: GuestGetResponse) => {
        this.guestEdit = data.result;
        console.log(this.guestEdit);
      },
      error: (err) => {
        console.log(err);
      },
    });
    // });
  }
  Save() {
    this.guestSer.createGuest(this.guest).subscribe({
      next: (data) => {
        this.guest = data;
        console.log(data);
        location.reload();
        this.router.navigateByUrl("/app/allGuests");
      },
      error: (err) => {
        console.log(err);
      },
    });
    console.log(this.guest);
  }
  SendEmail(email:string){
    console.log(email);
    this.emailObj.ToEmail=email;
    this.emailObj.Subject="Invitation to the event";
    this.emailObj.Body="Dear Guest, you are invited to the event";
    this.emailObj.EventAddress="Mansoura"
    this.emailObj.EventName="Farah"
    this.emailObj.Date=new Date('2024-05-27T07:01:10.782Z')
    this.invitation.sendInvitationByEmail(this.emailObj).subscribe({
      next: (data) => {
        console.log(data);
        },
        error: (err) => console.log(err)
        
    })
    console.log(this.emailObj);
    
    
  }
  SendSMS(phone:number){
    console.log(phone);
    //this.emailObj.ToEmail=email;
    this.emailObj.Subject="Invitation to the event";
    this.emailObj.Body="Dear Guest, you are invited to the event";
    this.emailObj.EventAddress="Mansoura"
    this.emailObj.EventName="Farah"
    this.emailObj.Date=new Date('2024-05-27T07:01:10.782Z')
    this.invitation.sendInvitationByEmail(this.emailObj).subscribe({
      next: (data) => {
        console.log(data);
        },
        error: (err) => console.log(err)
        
    })
    console.log(this.emailObj);
    
    
  }
  Edit(){
    this.guestSer.updateGuest(this.guestEdit).subscribe({
      next: (data) => {
        console.log(data);
        location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.router.navigateByUrl("/app/allGuests");
  }
}
