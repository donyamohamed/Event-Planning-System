import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEventsService } from '../../../shared/Services/user-events.service';
import { Event } from '../../../shared/Models/Event';
import { AllGuestComponent } from '@app/guest/all-guest/all-guest.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.css']
})
export class UserEventComponent implements OnInit {
  events: Event[] = [];
  userId: number = 3;

  constructor(private userEventsService: UserEventsService, private activatedRoute:ActivatedRoute, private route:Router) {}

  ngOnInit(): void {
    this.userEventsService.getUserEvents(this.userId).subscribe(
      (data: Event[]) => {
        if (Array.isArray(data)) {
          this.events = data;
          console.log('Fetched events:', data);
        } else {
          console.error('Data is not an array', data);
        }
      },
      (error) => {
        console.error('Error fetching user events', error);
      }
    );
  } 
  guestAppearing(){
    if(AllGuestComponent.guestsCount>0){
      this.route.navigateByUrl("app/allGuests")
    }else{
      this.route.navigateByUrl("app/allGuests")
      console.log("hg yhhhg hgy");
      console.log(AllGuestComponent.guestsCount);
    }
    
    
  } 
}
