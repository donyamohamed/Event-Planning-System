import { EventResponse } from "./../../guest/event-response";
import { Enumerator } from "./../../../shared/Models/ToDoList";
import { Event } from "./../../../shared/Models/Event";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserEventsService } from "../../../shared/Services/user-events.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http"; // Updated import
import swal from "sweetalert2";
import { SharedModule } from "../../../shared/shared.module";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: "app-user-event",
  standalone: true,
  templateUrl: "./user-event.component.html",
  styleUrls: ["./user-event.component.css"],
  imports: [
    CommonModule,
    RouterLink,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserEventComponent implements OnInit {
  events: Event[] = [];
  userId: number | null = null;
  modalRef: BsModalRef;
  bsModalRef: any;
  eventEditForm: FormGroup;
  eventEdit: Event = new Event();
  enumeratorKeys = Object.values(Enumerator);
  today: string = new Date().toISOString().split("T")[0];

  // baseUrl: string = 'https://localhost:44311/api/services/app/Event/GetEventById?id='; // Replace with your actual base URL

  constructor(
    private userEventsService: UserEventsService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private http: HttpClient,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.eventEditForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      location: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+$")],
      ],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      maxCount: ["", Validators.required],
      category: ["", Validators.required],
      isPublic: ["", Validators.required],
      description: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+$")],
      ],
    });
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.http
      .get<any>(
        "https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile"
      )
      .subscribe(
        (response) => {
          if (response && response.result) {
            this.userId = response.result.id;
            this.fetchUserEvents();
          }
        },
        (error) => {
          console.error("Error fetching user profile", error);
        }
      );
  }
  openEditModal(template: TemplateRef<any>, id: number): void {
    this.userEventsService.getEventById(id).subscribe({
      next: (data: EventResponse) => {
        this.eventEdit = data.result;
        console.log(this.eventEdit);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.bsModalRef = this.modalService.show(template);
  }
  fetchUserEvents(): void {
    if (this.userId === null) {
      console.error("User ID is not available.");
      return;
    }

    this.userEventsService.getUserEvents(this.userId).subscribe(
      (data: Event[]) => {
        if (Array.isArray(data)) {
          this.events = data;
          console.log(data);
        } else {
          console.error("Data is not an array", data);
        }
      },
      (error) => {
        console.error("Error fetching user events", error);
      }
    );
  }

  guestAppearing(event: Event): void {
    if (this.events.length === 0) {
      this.route.navigateByUrl("app/NoGuests/" + event.id);
    } else {
      this.route.navigateByUrl("app/allGuests/" + event.id, {
        state: { event },
      });
    }
  }

  details(event: Event): void {
    if (this.events.length > 0) {
      this.route.navigateByUrl("app/eventDetails/" + event.id, {
        state: { event },
      });
    }
  }

  deleteEvent(event: Event): void {
    swal
      .fire({
        title: `Do you really want to delete ${event.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.userEventsService.deleteEvent(event.id).subscribe(
            () => {
              this.events = this.events.filter((e) => e.id !== event.id);
              swal.fire(
                "Deleted!",
                `The event ${event.name} has been deleted.`,
                "success"
              );
            },
            (error) => {
              console.error("Error deleting event", error);
              const localizedMessage = abp.localization.localize(
                "There was an error deleting the event.",
                "YourSourceName"
              );
              swal.fire("Error!", localizedMessage, "error");
            }
          );
        }
      });
  }
  editEvent(): void {
    if (this.eventEditForm.valid) {
      this.userEventsService.editEvent(this.eventEdit).subscribe({
        next: (data) => {
          console.log(data);
          location.reload();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.markFormGroupTouched(this.eventEditForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  } // end of mark Form Group Touched function
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.eventEdit.eventImgFile = file;
    }
  }

  setDefaultValues(): void {
    this.eventEdit.isPublic = true;
    if (this.enumeratorKeys.length > 0) {
      this.eventEdit.category = this.enumeratorKeys[0];
    }
  }

  validateDates() {
    if (new Date(this.eventEdit.startDate) > new Date(this.eventEdit.endDate)) {
      this.eventEdit.endDate = this.eventEdit.startDate;
    }
  }
}
