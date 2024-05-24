import { Component, OnInit } from '@angular/core';
import { Event } from '../../../shared/Models/Event';
import { EventService } from '../../../shared/Services/eventa.service';
import { Enumerator } from "../../../shared/Models/Event";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports:[FormsModule,CommonModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  eventData: Event = new Event(); 
  enumeratorKeys = Object.values(Enumerator);
  Enumerator = Enumerator;
  username: string; 
  budgetOptions: { id: number, amount: number, description: string }[] = [];
  today: Date = new Date(); // Property to hold today's date

  constructor(private eventService: EventService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserData();
    this.fetchBudgetOptions();
  }

  getUserData(): void {
    this.http.get<any>('https://localhost:44311/api/services/app/User/Get?Id=1')
      .subscribe(response => {
        if (response && response.result && response.result.name) {
          this.username = response.result.name; // Assigning username
          this.eventData.userId = response.result.id; // Assigning userID
        }
      });
  }

  fetchBudgetOptions(): void {
    this.eventService.getBudgetAmounts()
      .subscribe(response => {
        if (response && response.result && response.result.items) {
          this.budgetOptions = response.result.items;
        }
      });
  }

  createEvent(): void {
    this.eventService.createEvent(this.eventData)
      .subscribe(() => {
        this.eventData = new Event();
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.eventData.eventImg = file.name; 
    }
  
  }
  setDefaultValues(): void {
    // Set default value for isPublic
    this.eventData.isPublic = true;
    // Set default value for category
    if (this.enumeratorKeys.length > 0) {
      this.eventData.category = this.enumeratorKeys[0];
    }
    // Set default value for budgetId
    if (this.budgetOptions.length > 0) {
      this.eventData.budgetId = this.budgetOptions[0].amount;
    }
}
}
