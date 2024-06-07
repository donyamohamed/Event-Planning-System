import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventdetailsService } from '../../../shared/Services/eventdetails.service';
import { EventBudgetService } from '../../../shared/Services/event-budget.service'; // Import EventBudgetService
import { Event } from '../../../shared/Models/Event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone:true,
  imports: [CommonModule,RouterLink,FormsModule],
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  eventId: number | undefined;
  budgetAmount: number | undefined; // Define budgetAmount property

  constructor(
    private route: ActivatedRoute,
    private eventDetailsService: EventdetailsService,
    private eventBudgetService: EventBudgetService // Inject EventBudgetService
  ) { }

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
          if (this.event?.budgetId) {
            this.fetchBudgetAmount(this.event.budgetId); // Fetch budget amount if budgetId is available
          }
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  fetchBudgetAmount(budgetId: number): void {
    this.eventBudgetService.getBudgetAmountById(budgetId).subscribe(
      (data) => {
        this.budgetAmount = data.result.amount; // Assuming the API returns the budget amount in the 'amount' field
        console.log("Budget Amount:", this.budgetAmount);
      },
      (error) => {
        console.error('Error fetching budget amount:', error);
      }
    );
  }
}
