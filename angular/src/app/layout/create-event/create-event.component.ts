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
  today: Date = new Date(); 

  constructor(private eventService: EventService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserData();
    this.fetchBudgetOptions();
    this.setDefaultValues();
  }

  getUserData(): void {
    this.http.get<any>('https://localhost:44311/api/services/app/User/Get?Id=1')
      .subscribe(response => {
        if (response && response.result && response.result.name) {
          this.username = response.result.name; 
          this.eventData.userId = response.result.id; 
        }
      });
  }

  fetchBudgetOptions(): void {
    this.eventService.getBudgetAmounts()
      .subscribe(response => {
        if (response && response.result && response.result.items) {
          this.budgetOptions = response.result.items;
          this.setDefaultBudgetId();
        }
      });
  }

  setDefaultBudgetId(): void {
    if (this.budgetOptions.length > 0) {
      this.eventData.budgetId = this.budgetOptions[0].id;
    }
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
    this.eventData.isPublic = true;
    if (this.enumeratorKeys.length > 0) {
      this.eventData.category = this.enumeratorKeys[0];
    }
  }
}
