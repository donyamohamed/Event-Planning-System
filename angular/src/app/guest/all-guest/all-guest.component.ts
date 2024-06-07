
import { GuestResponse } from "./../guest-response.model";
import { InvitationService } from "./../../../shared/Services/invitation.service";
import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Subscription } from "rxjs";
import { GuestService } from "../../../shared/Services/guest.service";
import { Guest } from "../../../shared/Models/guest";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from "@angular/router";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { GuestGetResponse } from "../guest-get-response";
import { GuestPerEventResponse } from "../guest-per-event-response";
import { EmailRequest } from "../../../shared/Models/EmailRequest";

import { Event } from "../../../shared/Models/Event";
import { SmsRequest } from "@shared/Models/Sms";


@Component({
  selector: "app-all-guest",
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
  ],

  templateUrl: "./all-guest.component.html",
  styleUrl: "./all-guest.component.css",
})
export class AllGuestComponent implements OnInit {

  subscribe: Subscription | null = null;
  subGuest: Subscription | null = null;
  guests: Guest[] = [];
  dataTable: any;
  guest: Guest = new Guest();
  guestEdit: Guest = new Guest();

  modalRef: BsModalRef;
  bsModalRef: any;
  guestForm: FormGroup;
  idEvent: number = 0;
  event: Event = new Event();
  guestCount: number;
  maxCountOfGuest: number = 0;
  private emailObj: EmailRequest = new EmailRequest();
  private smsObj: SmsRequest=new SmsRequest();

  //constructor

  constructor(
    public guestSer: GuestService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

    private invitation: InvitationService,
    private fb: FormBuilder
  ) {
    this.guestForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ["", [Validators.required, Validators.email]],
      invitationState: ["", [Validators.required]],
    });
  } //end of constructor

  ngOnInit(): void {
    this.subscribe = this.activatedRoute.params.subscribe((params) => {
      this.idEvent = params["id"];
      this.event = history.state.event;
      console.log(this.event);
      this.maxCountOfGuest = this.event.maxCount;
      this.subGuest = this.guestSer.getGuestsPerEvent(params["id"]).subscribe({
        next: (res: GuestPerEventResponse) => {
          console.log(res);
          this.guests = res.result;
          // console.log(this.guests);
          this.guestCount = res.result.length;
          // console.log(this.guestCount);
          if (this.guestCount === 0) {
            console.log(this.guestCount);
            this.router.navigateByUrl("/app/NoGuests/" + this.idEvent);
          }

        },
        error: (err) => {
          console.log(err);
        },
      });

    });
    
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
    if (this.guestForm.valid) {
      this.guestSer.createGuest(this.guest).subscribe({
        next: (data) => {
          this.guest = data;
          console.log(data);
          this.modalRef.hide();
          location.reload();
          //this.router.navigateByUrl("/app/allGuests");
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      // Form is invalid, mark fields as touched to display validation messages
      this.markFormGroupTouched(this.guestForm);
    }
    console.log(this.guest);
  } //end of save function

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  } //end of markFormGroupTouched function

  SendEmail(email: string) {
    console.log(email);
    this.emailObj.ToEmail = email;
    this.emailObj.Subject = "Invitation to the event";
    this.emailObj.Body = "Dear Guest, you are invited to the event";
    this.emailObj.EventAddress = this.event.location;
    this.emailObj.EventName = this.event.name;
    this.emailObj.Date = this.event.startDate;
    // new Date("2024-05-27T07:01:10.782Z");
    this.invitation.sendInvitationByEmail(this.emailObj).subscribe({
      next: (data) => {
        console.log(data);
        alert("Invitation Sent via email Successfully!");
      },
      error: (err) => console.log(err),
    });
    console.log(this.emailObj);
  } //end of send mail function

  SendSMS(phone: string) {
    console.log(phone);
    //this.emailObj.ToEmail=email;
    this.smsObj.ToPhoneNumber=phone;
    this.smsObj.Message="Dear Guest, you are invited to the event";
    this.smsObj.EventAddress=this.event.location;
    this.smsObj.EventName=this.event.name;
    this.smsObj.Date=this.event.startDate;

    this.invitation.sendInvitationBySms(this.smsObj).subscribe({
      next: (data) => {
        console.log(data);
        alert("Invitation Sent via SMS Successfully!");
      },
      error: (err) => console.log(err),
    });
    console.log(this.smsObj);
  } //end of send SMS function

  Edit() {
    if (this.guestForm.valid) {
      this.guestSer.updateGuest(this.guestEdit).subscribe({
        next: (data) => {
          console.log(data);
         // this.modalRef.hide();
          location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }else{
      this.markFormGroupTouched(this.guestForm);
    }
  } //end of Edit function

  Delete(id: number) {
    var deleteConfirm = confirm("Are you sure you want to delete this guest?");
    if (deleteConfirm) {
      this.subGuest = this.guestSer.deleteGuest(id).subscribe({
        next: (data) => {
          console.log(data);
          location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

  }
} ////end of Delete function

