import { GuestResponse } from "./../guest-response.model";
import { InvitationService } from "../../../shared/Services/invitation.service";
import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import swal from "sweetalert2";

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
import { SharedModule } from "../../../shared/shared.module";
import { EventdetailsService } from "@shared/Services/eventdetails.service";
import { EventResponse } from "../event-response";
import { L } from "@fullcalendar/list/internal-common";

@Component({
  selector: "app-all-guest",
  standalone: true,
  templateUrl: "./all-guest.component.html",
  styleUrls: ["./all-guest.component.css"],
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
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
  idEvent: number;
  event: any | Event = new Event();
  guestCount: number;
  maxCountOfGuest: number = 0;
  private emailObj: EmailRequest = new EmailRequest();
  private smsObj: SmsRequest = new SmsRequest();
  eventname: string;
  isCheckedAllDisabled: boolean = true;
  selectedGuestIds: number[] = [];

  constructor(
    public guestSer: GuestService,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private invitation: InvitationService,
    private fb: FormBuilder,
    private eventService: EventdetailsService
  ) {
    this.guestForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.subscribe = this.activatedRoute.params.subscribe((params) => {
      this.idEvent = params["id"];
      this.eventService.getEventById(this.idEvent).subscribe({
        next: (res: EventResponse) => {
          this.eventname = res.result.name;
          this.maxCountOfGuest = res.result.maxCount;
        },
        error: (err) => {
          console.log(err);
        },
      });
      //this.event = history.state.event;
      // this.eventname=this.event.name;
      console.log(this.eventname);

      this.subGuest = this.guestSer.getGuestsPerEvent(params["id"]).subscribe({
        next: (res: GuestPerEventResponse) => {
          this.guests = res.result;
          console.log(this.guests);

          this.guestCount = res.result.length;
          if (this.guestCount === 0) {
            this.router.navigateByUrl("/app/NoGuests/" + this.idEvent);
          }
          this.setupCheckboxEvents();
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
   
  }

   setupCheckboxEvents(): void {
    const checkAll = document.getElementById("checkAll") as HTMLInputElement;
    checkAll.addEventListener("click", () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        "input[type=checkbox][name=send]"
      );
      allCheckboxes.forEach((checkbox) => {
        checkbox.checked = checkAll.checked;
      });
      this.updateDeleteAllButtonState();
    });

    const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
      "input[type=checkbox][name=send]"
    );

    allCheckboxes.forEach((checkbox) => {
      console.log(checkbox);
      
      checkbox.addEventListener("click", () => {
        this.updateDeleteAllButtonState();
      });
    });
  }

  updateDeleteAllButtonState(): void {
    const allCheckboxes = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        "input[type=checkbox][name=send]"
      )
    );
    const anyChecked = allCheckboxes.some((checkbox) => checkbox.checked);
    this.isCheckedAllDisabled = !anyChecked;
    console.log(anyChecked);
    
    this.selectedGuestIds = allCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => Number(checkbox.value));
  }

  deleteAll(): void {
  
    swal.fire("Deleted!", "Your guest has been deleted.", "success");
    swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    })
    .then((result) => {
      if (result.isConfirmed) {
          console.log("Selected Guest IDs: ", this.selectedGuestIds);
          this.subGuest = this.guestSer.deleteAllGuest(this.idEvent,this.selectedGuestIds).subscribe({
            next: (data) => {
              location.reload();
            },
            error: (err) => {
              console.log(err);
            },
          });
          // Use this.selectedGuestIds for partial deletion logic
          swal.fire("Deleted!", "Your guest has been deleted.", "success");
        //}
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire("Cancelled", "Your guest is safe :)", "error");
      }
    });
  }


  openModal(template: TemplateRef<any>): void {
    this.modalRef?.hide();
    this.modalRef = this.modalService.show(template);
  }

  openEditModal(template: TemplateRef<any>, id: number): void {
    this.bsModalRef = this.modalService.show(template);
    this.subGuest = this.guestSer.getGuest(id).subscribe({
      next: (data: GuestGetResponse) => {
        this.guestEdit = data.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  Save() {
    if (this.guestForm.valid) {
      this.guest.invitationState = "Pending";
      this.guestSer.createGuest(this.guest, this.idEvent).subscribe({
        next: (data) => {
          this.guest = data;
          this.modalRef.hide();
          location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.markFormGroupTouched(this.guestForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  SendEmail(email: string) {
    this.emailObj.ToEmail = email;
    this.emailObj.Subject = "Invitation to the event";
    this.emailObj.Body = "Dear Guest, you are invited to the event";
    this.emailObj.EventAddress = this.event.location;
    this.emailObj.EventName = this.event.name;
    this.emailObj.Date = this.event.startDate;
    this.emailObj.EventImage = this.event.eventImg;
    this.invitation.sendInvitationByEmail(this.emailObj).subscribe({
      next: (data) => {
        swal.fire({
          title: "Success",
          text: "Invitation Sent via email Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        location.reload();
      },
      error: (err) => console.log(err),
    });
  }

  SendSMS(phone: string) {
    this.smsObj.ToPhoneNumber = phone;
    this.smsObj.Message = "Dear Guest, you are invited to the event";
    this.smsObj.EventAddress = this.event.location;
    this.smsObj.EventName = this.event.name;
    this.smsObj.Date = this.event.startDate;
    this.invitation.sendInvitationBySms(this.smsObj).subscribe({
      next: (data) => {
        swal.fire({
          title: "Success",
          text: "Invitation Sent via SMS Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      error: (err) => console.log(err),
    });
  }

  Edit() {
    if (this.guestForm.valid) {
      this.guestSer.updateGuest(this.guestEdit).subscribe({
        next: (data) => {
          location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.markFormGroupTouched(this.guestForm);
    }
  }

  Delete(id: number) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.subGuest = this.guestSer.deleteGuest(id).subscribe({
            next: (data) => {
              location.reload();
            },
            error: (err) => {
              console.log(err);
            },
          });
          swal.fire("Deleted!", "Your guest has been deleted.", "success");
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal.fire("Cancelled", "Your guest is safe :)", "error");
        }
      });
  }

  fileToUpload: File | null = null;
  uploadResponse: string = "";

  promptFileSelection(): void {
    swal
      .fire({
        title: "Enter the Name, Phone number, and Email. Each one in a column",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, got it!",
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const fileInput = document.getElementById(
            "file-upload"
          ) as HTMLInputElement;
          fileInput.click();
        }
      });
  }

  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const allowedExtensions = ["xls", "xlsx"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (file && allowedExtensions.includes(fileExtension || "")) {
      this.fileToUpload = file;
      this.uploadResponse = "";
    } else {
      this.fileToUpload = null;
      this.uploadResponse = "Invalid file type. Please upload an Excel file.";
    }
  }

  uploadFile(): void {
    if (this.fileToUpload) {
      this.guestSer.uploadFile(this.fileToUpload, this.idEvent).subscribe({
        next: (response: any) => {
          swal
            .fire({
              title: "Success",
              text: response.result,
              icon: "success",
              confirmButtonText: "OK",
            })
            .then((result) => {
              this.router.navigateByUrl(`app/allGuests/${this.idEvent}`);
            });

          this.uploadResponse = "File uploaded successfully";
        },
        error: (error: any) => {
          console.log(error);
          swal.fire({
            title: "Error",
            text: error.error.result,
            icon: "error",
            confirmButtonText: "OK",
          });

          this.uploadResponse = `Error: ${error}`;
        },
      });
    } else {
      this.uploadResponse = "Please select a valid Excel file first.";
    }
  }


  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
    this.subGuest?.unsubscribe();
  }
}
