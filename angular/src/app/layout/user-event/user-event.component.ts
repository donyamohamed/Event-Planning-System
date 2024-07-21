import { EventResponse } from "./../../guest/event-response";
import { Enumerator } from "./../../../shared/Models/Event";
import { Event, EventType } from "./../../../shared/Models/Event";

import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectionStrategy,
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { UserEventsService } from "../../../shared/services/user-events.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http"; // Updated import
import swal from "sweetalert2";
import { SharedModule } from "../../../shared/shared.module";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { CurrentUserDataService } from "../../../shared/services/current-user-data.service";

import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";

import { SidebarEventComponent } from "../sidebar-event/sidebar-event.component";
import { SearchComponent } from "../../search/search.component";
import { SupplierService } from "@shared/Services/Supplier.service";

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
    SidebarEventComponent,
    SearchComponent,
  ],
})
export class UserEventComponent implements OnInit {
  events: Event[] = [];
  userId: number | null = null;
  modalRef: BsModalRef;
  bsModalRef: any;
  map: mapboxgl.Map;
  eventEditForm: FormGroup;
  eventEdit: Event = new Event();
  enumeratorKeys = Object.values(Enumerator);
  today: string = new Date().toISOString().split("T")[0];
  lastStartDate: Date = new Date();
  lastEndDate: Date = new Date();
  public filteredEvents: Event[] = []; // Initialize filteredEvents
  free: EventType.Free;
  paid: EventType.Paid;
  places: any[] = [];
  enumeratorKey = Object.keys(Enumerator); // Assuming Enumerator is an Enum
  // Error properties
  dateErrors = {
    endDateError: "",
    startDateError: "",
  };

  constructor(
    private userEventsService: UserEventsService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private http: HttpClient,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private currentUserDataService: CurrentUserDataService, // Inject the service
    private supplierService: SupplierService

  ) {
    this.eventEditForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      location: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      maxCount: ["", Validators.required],
      category: ["", Validators.required],
      isPublic: ["", Validators.required],
      description: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-500 ]+$")],
      ],
      // ticketPrice: [null, [Validators.min(0)]],
      type: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCurrentUserId();
    this.fetchUserEvents();
   
  }

  getCurrentUserId(): void {
    this.currentUserDataService.GetCurrentUserData().subscribe(
      (response) => {
        if (response) {
          this.userId = response.id;
          console.log("User ID:", this.userId);
          this.fetchUserEvents();
        } else {
          console.error("No user data found");
        }
      },
      (error) => {
        console.error("Error fetching user data", error);
      }
    );
  }
  initializeMap(): void {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFiZG9naCIsImEiOiJjbGp1em54c24xaTd4M2NsbDBiOWZuMXk4In0.n4ILS2Jtk5tZ9onHBcL8Cw";
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [30.8025, 26.8206], // Default center (Egypt)
      zoom: 5, // Default zoom level
      attributionControl: false,
    });
    // https://api.mapbox.com/geocoding/v5/mapbox.places/30.744557462642092,28.09867557063106.json?access_token=pk.eyJ1IjoibWFiZG9naCIsImEiOiJjbGp1em54c24xaTd4M2NsbDBiOWZuMXk4In0.n4ILS2Jtk5tZ9onHBcL8Cw`;
    // Add map click event to update location input
    this.map.on("click", (e) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const placeName = data.features[0]?.place_name || "Unknown location";
          this.eventEdit.location = placeName;
          console.log(placeName);
        })
        .catch((err) => {
          console.error("Error fetching location name:", err);
        });
    });
  }

  openEditModal(template: TemplateRef<any>, id: number): void {
    this.userEventsService.getEventById(id).subscribe({
      next: (data: EventResponse) => {
        this.eventEdit = data.result;
        this.initializeMap();
        this.lastStartDate = this.eventEdit.startDate;
        this.lastEndDate = this.eventEdit.endDate;
        console.log(this.eventEdit);
        console.log(this.lastEndDate);
        console.log(this.lastStartDate);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.bsModalRef = this.modalService.show(template);
  }


  onCategoryChange(): void {
    if (this.eventEdit.category) {
      const categoryIndex = this.enumeratorKey.indexOf(
        this.eventEdit.category
      );
      if (categoryIndex !== -1) {
        this.supplierService.getPlacesByCategory(categoryIndex).subscribe(
          (response: any) => {
            this.places = response.result; // Assuming response has an array of places
            console.log(this.places);
            
          },
          (error) => {
            console.error("Error fetching places:", error);
          }
        );
      }
    }
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
          this.filteredEvents = this.events;
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
    // if (this.events.length === 0) {
    //   this.route.navigateByUrl("app/NoGuests/" + event.id);
    // } else {
    //   this.route.navigateByUrl("app/allGuests/" + event.id, {
    //     state: { event },
    //   });
    // }
    this.route.navigateByUrl("app/allGuests/" + event.id, {
      state: { event },
    });
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
              let errorMessage = "There was an error deleting the event.";
              // Check for specific error message
              if (error.error && error.error.message) {
                errorMessage = error.error.message;
              } else if (error.status === 400) {
                errorMessage = "Cannot delete the event because you have reserved a place for it or people have paid for it.";
              }
              swal.fire("Error!", errorMessage, "error");
            }
          );
        }
      });
      }
     

  editEvent(): void {
    if (this.eventEditForm.valid) {
      // this.userEventsService.editEvent(this.eventEdit).subscribe({
      //   next: (data) => {
      //     console.log(data);
      //     location.reload();
      //   },
      //   error: (err) => {
      //     console.log(err);
      //   },
      // });
      this.userEventsService.editEventWithDetails(this.eventEdit).subscribe({
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
  }

  validateDates() {
    const startDate = new Date(this.eventEdit.startDate);
    const endDate = new Date(this.eventEdit.endDate);
    const lastStartDate = new Date(this.lastStartDate);

    this.dateErrors.endDateError = "";
    this.dateErrors.startDateError = "";

    if (startDate > endDate) {
      this.eventEdit.endDate = this.eventEdit.startDate;
      this.dateErrors.endDateError = "End date cannot be before start date.";
    }

    const oneDayBeforeLastStartDate = new Date(lastStartDate);
    oneDayBeforeLastStartDate.setDate(lastStartDate.getDate() - 1);

    if (startDate < oneDayBeforeLastStartDate) {
      this.dateErrors.startDateError =
        "Start date is too far in the past compared to the last start date.";
    }

    const now = new Date();
    const twentyFourHoursLater = new Date(now);
    twentyFourHoursLater.setHours(now.getHours() + 24);

    if (startDate < twentyFourHoursLater) {
      this.dateErrors.startDateError =
        "Start date is within the next 24 hours.";
    }
  }
  handleSearchResults(filteredEvents: Event[]): void {
    this.filteredEvents = filteredEvents;
  }
}
