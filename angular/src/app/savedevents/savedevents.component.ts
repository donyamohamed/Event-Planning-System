import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedEventServiceService } from '../../shared/services/saved-event-service.service';
import { EventdetailsService } from '../../shared/services/eventdetails.service';
import { CurrentUserDataService } from '../../shared/services/current-user-data.service';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SidebarEventComponent } from "../layout/sidebar-event/sidebar-event.component";
import { GuestService } from '../../shared/services/guest.service';

import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

interface SavedEvent {
  eventId: number;
  id: number; // favorite event ID
}

interface EventDetail {
  result: {
    eventImg?: string;
    startDate: string;
    name: string;
    location: string;
    id: number;
  };
  favoriteEventId?: number;
}

@Component({
  selector: 'app-savedevents',
  standalone: true,
  imports: [CommonModule, SidebarEventComponent, RouterLink],
  templateUrl: './savedevents.component.html',
  styleUrls: ['./savedevents.component.css']
})
export class SavedeventsComponent implements OnInit {

  savedEvents$: Observable<any>;
  eventDetails$: Observable<any>;
  isLoading: boolean = true;
  events: EventDetail[] = [];
  isLoggedIn: boolean = true;
  enumeratorKeys: string[] = ['Music', 'Sports', 'Arts'];
  userId: number;

  constructor(
    private savedEventService: SavedEventServiceService,
    private eventService: EventdetailsService,
    private currentUserDataService: CurrentUserDataService,
    private router: Router,
    private guestService: GuestService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getCurrentUserId();
  }

  getCurrentUserId(): void {
    this.currentUserDataService.GetCurrentUserData().subscribe(
      response => {
        if (response) {
          this.userId = response.id;
          console.log('User ID:', this.userId);
          this.loadSavedEvents();
        } else {
          console.error('No user data found');
        }
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  loadSavedEvents(): void {
    this.savedEvents$ = this.savedEventService.getSavedEvents(this.userId);
    this.savedEvents$.pipe(
      switchMap(response => {
        const eventIds = response.result.map((savedEvent: SavedEvent) => savedEvent.eventId);
        const favoriteEventIds = response.result.map((savedEvent: SavedEvent) => savedEvent.id); // Store favorite event IDs
        const eventDetailsObservables = eventIds.map((id: number) => this.eventService.getEventById(id));
        return forkJoin(eventDetailsObservables).pipe(
          map((eventDetails: EventDetail[]) => {
            return eventDetails.map((eventDetail, index) => ({
              ...eventDetail,
              favoriteEventId: favoriteEventIds[index] // Attach favorite event ID to event details
            }));
          })
        );
      })
    ).subscribe(
      (events: EventDetail[]) => {
        this.events = events;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading saved events:', error);
        this.isLoading = false;
      }
    );
  }

  confirmDeleteSavedEvent(favoriteEventId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this event from your saved events?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSavedEvent(favoriteEventId);
      }
    });
  }

  deleteSavedEvent(favoriteEventId: number): void {
    this.savedEventService.deleteSavedEvent(favoriteEventId).subscribe(
      () => {
        this.events = this.events.filter(event => event.favoriteEventId !== favoriteEventId);
        Swal.fire(
          'Deleted!',
          'Your event has been removed from saved events.',
          'success'
        );
        console.log(`Event with ID ${favoriteEventId} deleted successfully`);
      },
      (error: any) => {
        console.error('Error deleting saved event:', error);
        Swal.fire(
          'Error!',
          'There was an error deleting your event. Please try again later.',
          'error'
        );
      }
    );
  }

  details(event: any): void {
    console.log('Event object:', event);
    if (event && event.id) {
      this.router.navigateByUrl("app/eventDetails/" + event.id, { state: { event } });
    } else {
      console.error('Event ID is missing');
    }
  }

  navigateToComponent(id: number): void {
    this.router.navigateByUrl(`/app/Chat/${id}`);
  }
  askForInvitation(event: Event): void {
    // this.currentUserDataService.GetCurrentUserData().subscribe(
    //   response => {
    //     if (response) {
    //       console.log(response);
    //       this.username = response.name;
    //       this.guestId = response.id;
    //       this.guestEmail = response.email;
    //       this.checkIfAlreadyRequested(event);
    //     } else {
    //       this.saveEventDataToSession(event);
    //       window.location.href = "/account/login";
    //     }
    //   },
    //   error => {
    //     console.error('Error fetching user data', error);
    //     this.saveEventDataToSession(event);
    //     window.location.href = "/account/login";
    //   }
    // );
  }
}
