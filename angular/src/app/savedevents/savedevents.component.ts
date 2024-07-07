import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedEventServiceService } from '../../shared/services/saved-event-service.service';
import { EventdetailsService } from '../../shared/services/eventdetails.service';
import { CurrentUserDataService } from '../../shared/services/current-user-data.service'; // Import the service
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SidebarEventComponent } from "../layout/sidebar-event/sidebar-event.component";
import { GuestService } from '../../shared/services/guest.service';

import { Router, RouterLink } from '@angular/router';

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
  events: any[] = [];
  isLoggedIn: boolean = true;
  enumeratorKeys: string[] = ['Music', 'Sports', 'Arts'];
  userId: number; // Add a property to store the userId

  constructor(
    private savedEventService: SavedEventServiceService,
    private eventService: EventdetailsService,
    private currentUserDataService: CurrentUserDataService, // Inject the service
    private router: Router,
    private guestService: GuestService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getCurrentUserId(); // Call the method to get the current user's ID
  }

  getCurrentUserId(): void {
    this.currentUserDataService.GetCurrentUserData().subscribe(
      response => {
        if (response) {
          this.userId = response.id;
          console.log('User ID:', this.userId);
          this.loadSavedEvents(); // Call loadSavedEvents after getting userId
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
        const eventIds = response.result.map((savedEvent: { eventId: any; }) => savedEvent.eventId);
        const eventDetailsObservables = eventIds.map((id: number) => this.eventService.getEventById(id));
        return forkJoin(eventDetailsObservables);
      })
    ).subscribe(
      (events: any[]) => {
        this.events = events;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading saved events:', error);
        this.isLoading = false;
      }
    );
  }

  getEventDetails(eventId: number): void {
    this.eventDetails$ = this.eventService.getEventById(eventId);
    console.log(this.eventDetails$);
  }

  checkMaxCountAndGuests(): void {
    this.events.forEach(event => {
      this.guestService.getGuestsPerEvent(event.id).subscribe(
        (response) => {
          const guests = response.result;
          const guestCount = guests.length;
          (event as any).isButtonDisabled = event.maxCount === guestCount;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error(`Error fetching guests for event ${event.name}`, error);
        }
      );
    });
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
}
