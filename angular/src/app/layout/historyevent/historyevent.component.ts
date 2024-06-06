import { Component, OnInit } from '@angular/core';
import { HistoryeventService } from '../../../shared/Services/historyevent.service';
import { Event } from '../../../shared/Models/Event'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-historyevent',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './historyevent.component.html',
  styleUrls: ['./historyevent.component.css']
})
export class HistoryeventComponent implements OnInit {
  historyevent: Event[] = [];
  
  constructor(private historyeventService: HistoryeventService) {}

  ngOnInit(): void {
    this.historyeventService.getHistoryEvent().subscribe(
      data => {
        this.historyevent = data.result; 
      },
      error => {
        console.error('Error fetching history event', error);
      }
    );
  }
}
