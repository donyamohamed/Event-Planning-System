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
  //sub: Subscription | null = null;
  constructor(private PublicEventServ: HomeService){}
  // async ngOnInit(): Promise<void> {

  //   try {
  //     const res: EventsResponse = await firstValueFrom(this.PublicEventServ.getPublicEvents());
  //     console.log(res);
  //     this.events = res.result;
  //     console.log(this.events);  // Now this will log the updated events array
  //   } catch (err) {
  //     console.error('Error fetching public events:', err);
  //   }

  //   console.log(this.events);  // This will now correctly wait for the events to be fetched
  // }

  getUserData(): void {
    //this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile')
     // .subscribe(response => {
       // if (response && response.result) {
         // this.userId = response.result.id;
          //console.log('User ID fetched:', this.userId); // Debug log
         // Fetch events after getting the user ID
      //  }
     // }, error => {
       // console.error('Error fetching user profile', error);
     // });
  }

  ngOnInit(): void {
    this.fetchUserEvents();  // Call to get user data
    console.log(this.events);
    
  }

  fetchUserEvents(): void {
    this.PublicEventServ.getPublicEvents().subscribe(
      (data: EventsResponse) => {
       this.events=data.result
        console.log(this.events);
        
      },
      (error) => {
        console.error('Error fetching user events', error);
      }
    );

  }
}
