import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestService } from '@shared/Services/guest.service';
import { Guest } from '@shared/Models/guest';
import { Subscription } from 'rxjs';
import { GuestGetResponse } from '../guest-get-response';

@Component({
  selector: 'app-delete-guest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-guest.component.html',
  styleUrl: './delete-guest.component.css'
})
export class DeleteGuestComponent implements OnInit{
  subscribe:Subscription|null=null;
  // guest:Guest=new Guest();
  subGuest:Subscription|null=null;
  constructor(
    private guestSer:GuestService,
    private activatedRoute:ActivatedRoute,
    private router:Router 
  ) {}  
  ngOnInit(): void {
    this.subscribe = this.activatedRoute.params.subscribe((params) => {
      this.subGuest= this.guestSer.deleteGuest(params["id"]).subscribe({
        next: (data) => {
          console.log(data);
          location.reload();
          this.router.navigateByUrl("/app/allGuests/:id");
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }

}
