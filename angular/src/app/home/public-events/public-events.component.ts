import { EventsResponse } from '../../../app/home/eventInterface';
import { HomeService } from './../../../shared/Services/home.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Event} from '../../../shared/Models/Event';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-public-events',
  standalone: true,
  imports: [CommonModule
   // ,BrowserAnimationsModule
  ],
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.css']
})
export class PublicEventsComponent implements  OnInit{
  public events: Event[]=[];
  public isLoading: boolean = true;
    constructor(private PublicEventServ: HomeService){}

  ngOnInit(): void {
    this.fetchUserEvents();  // Call to get user data
    console.log(this.events);
    // this.initializeLoader();
    
  }

  fetchUserEvents(): void {
    this.PublicEventServ.getPublicEvents().subscribe(
      (data: EventsResponse) => {
       this.events=data.result
        console.log(this.events);
        this.isLoading = false; 
        
      },
      (error) => {
        console.error('Error fetching user events', error);
        this.isLoading = true; 
      }
    );

  }
  
  // initializeLoader() {
  //   function hideLoader() {
  //     const loadingElement = document.getElementById('loading');
  //     if (loadingElement) {
  //       loadingElement.style.display = 'none';
  //     }
  //   }

  //   window.addEventListener('load', hideLoader);

  //   // Strongly recommended: Hide loader after 20 seconds, even if the page hasn't finished loading
  //   setTimeout(hideLoader, 20 * 1000);
  // }
}
