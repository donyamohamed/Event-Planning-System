import { Component } from '@angular/core';
import { Event, EventType } from '../../../shared/Models/Event';
import { SupplierService} from '../../../shared/Services/Supplier.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
@Component({
  selector: 'app-supplier-events',
  standalone: true,
  imports: [CommonModule,SharedModule],
  templateUrl: './supplier-events.component.html',
  styleUrl: './supplier-events.component.css'
})
export class SupplierEventsComponent {
  events: Event[] = [];
  userId: number ; 

  constructor(private eventService: SupplierService) {}

  ngOnInit(): void {
    // this.getPendingEvents();
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.eventService.getUserProfile().subscribe(
      (profile) => {
        this.userId = profile.id;
        this.getPendingEvents();
        console.log("supplierId",this.userId)
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }
  getPendingEvents(): void {
    this.eventService.getPendingEventsBySupplierId(this.userId).subscribe(
      (events: Event[]) => {
        this.events = events;
        console.log("Events loaded successfully");
      },
      (error) => {
        console.error('Error fetching pending events', error);
      }
    );
  }

  acceptEvent(eventId: number): void {
    this.eventService.acceptEvent(eventId).subscribe(
      () => {
        this.getPendingEvents();
      },
      (error) => {
        console.error('Error accepting event', error);
      }
    );
  }

  rejectEvent(eventId: number): void {
    this.eventService.rejectEvent(eventId).subscribe(
      () => {
        this.getPendingEvents();
      },
      (error) => {
        console.error('Error rejecting event', error);
      }
    );
  }
  
}