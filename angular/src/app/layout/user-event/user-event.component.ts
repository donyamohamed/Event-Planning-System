import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEventsService } from '../../../shared/Services/user-events.service';
import { Event } from '../../../shared/Models/Event';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Updated import
import swal from 'sweetalert2';

@Component({
  selector: 'app-user-event',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.css']
})
export class UserEventComponent implements OnInit {
  events: Event[] = [];
  userId: number | null = null;

  constructor(
    private userEventsService: UserEventsService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile')
      .subscribe(response => {
        if (response && response.result) {
          this.userId = response.result.id;
          this.fetchUserEvents();
        }
      }, error => {
        console.error('Error fetching user profile', error);
      });
  }

  fetchUserEvents(): void {
    if (this.userId === null) {
      console.error('User ID is not available.');
      return;
    }

    this.userEventsService.getUserEvents(this.userId).subscribe(
      (data: Event[]) => {
        if (Array.isArray(data)) {
          this.events = data;
        } else {
          console.error('Data is not an array', data);
        }
      },
      (error) => {
        console.error('Error fetching user events', error);
      }
    );
  }

  guestAppearing(event: Event): void {
    if (this.events.length === 0) {
      this.route.navigateByUrl("app/NoGuests/" + event.id);
    } else {
      this.route.navigateByUrl("app/allGuests/" + event.id, { state: { event } });
    }
  }

  details(event: Event): void {
    if (this.events.length > 0) {
      this.route.navigateByUrl("app/eventDetails/" + event.id, { state: { event } });
    }
  }

  deleteEvent(event: Event): void {
    swal.fire({
      title: `Do you really want to delete ${event.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userEventsService.deleteEvent(event.id).subscribe(
          () => {
            this.events = this.events.filter(e => e.id !== event.id);
            swal.fire(
              'Deleted!',
              `The event ${event.name} has been deleted.`,
              'success'
            );
          },
          (error) => {
            console.error('Error deleting event', error);
            swal.fire(
              'Error!',
              'There was an error deleting the event.',
              'error'
            );
          }
        );
      }
    });
  }
}
