import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedEventServiceService } from './../../shared/Services/saved-event-service.service';
import { EventdetailsService } from './../../shared/Services/eventdetails.service';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SidebarEventComponent } from "../layout/sidebar-event/sidebar-event.component";
import { GuestService } from './../../shared/Services/guest.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-savedevents',
  standalone: true,
  imports: [CommonModule,SidebarEventComponent,RouterLink],
  templateUrl: './savedevents.component.html',
  styleUrls: ['./savedevents.component.css']
})
export class SavedeventsComponent implements OnInit {

  savedEvents$: Observable<any>;
  eventDetails$: Observable<any>; // Declared as a property
  isLoading: boolean = true;
  events: any[] = []; // Placeholder for event data
  isLoggedIn: boolean = true; // Placeholder for login status
  enumeratorKeys: string[] = ['Music', 'Sports', 'Arts']; // Placeholder for categories

  constructor(
    private savedEventService: SavedEventServiceService,
    private eventService: EventdetailsService,
    private router:Router,
    private guestService:GuestService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadSavedEvents();
  }

  loadSavedEvents(): void {
    const userId = 1;  // Replace this with the actual logic to get the logged-in user's ID
    this.savedEvents$ = this.savedEventService.getSavedEvents(userId);
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
          // Dynamically add isButtonDisabled property
          (event as any).isButtonDisabled = event.maxCount === guestCount;
          // Trigger change detection manually
          this.cdr.detectChanges();
        },
        (error) => {
          console.error(`Error fetching guests for event ${event.name}`, error);
        }
      );
    });
  }
  askForInvitation(event: Event): void {
    // this.getUserData().subscribe(
    //   response => {
    //     if (response && response.result) {
    //       console.log(response);
    //       this.username = response.result.name;
    //       this.guestId = response.result.id;
    //       this.guestEmail = response.result.email;
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
    console.log('Event object:', event); // Log the event object to verify its structure
    if (event && event.id) {
      this.router.navigateByUrl("app/eventDetails/" + event.id, { state: { event } });
    } else {
      console.error('Event ID is missing');
    }
  }

  navigateToComponent(userId: number): void {
    // Implement navigation logic here
    console.log('Navigate to user:', userId);
  }
}
