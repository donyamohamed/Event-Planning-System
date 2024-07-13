import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventdetailsService } from '../../../shared/services/eventdetails.service';
import { EventBudgetService } from '../../../shared/services/event-budget.service'; 
import { Event } from '../../../shared/Models/Event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-event-home-details',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,SharedModule],
  templateUrl: './event-home-details.component.html',
  styleUrl: './event-home-details.component.css'
})
export class EventHOmeDetailsComponent {
  event: Event | undefined;
  eventId: number | undefined;
  budgetAmount: number | undefined; // Define budgetAmount property

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private eventDetailsService: EventdetailsService,
    private eventBudgetService: EventBudgetService // Inject EventBudgetService
  ) { }


  navigateToSetExpenses(eventId: number): void {
    this.router.navigate(['/app/set-expenses'], { queryParams: { eventId: eventId } });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('id'));
      this.loadEventDetails();
    });
  }
 
  loadEventDetails(): void {
    if (this.eventId) {
      this.eventDetailsService.getEventById(this.eventId).subscribe(
        (data) => {
          this.event = data.result;
          console.log("Event Details:", data.result);
          
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  shareOnFacebook(): void {
    const shareUrl = `${window.location.origin}/event-details/${this.eventId}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookShareUrl, '_blank');
  }
  shareOnTwitter(): void {
    const shareUrl = `${window.location.origin}/event-details/${this.eventId}`;
    const text = `Check out this event! ${this.event?.name}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterShareUrl, '_blank');
  }

  shareOnLinkedIn(): void {
    const shareUrl = `${window.location.origin}/event-details/${this.eventId}`;
    const title = this.event?.name;
    const summary = this.event?.description;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title!)}&summary=${encodeURIComponent(summary!)}`;
    window.open(linkedInShareUrl, '_blank');
  }

  shareOnWhatsApp(): void {
    const shareUrl = `${window.location.origin}/event-details/${this.eventId}`;
    const whatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    window.open(whatsAppShareUrl, '_blank');
  }
  
}
