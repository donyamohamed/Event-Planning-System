import { GuestGetResponse } from './../guest-get-response';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GuestService } from '@shared/Services/guest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Guest } from '@shared/Models/guest';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-guest',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './update-guest.component.html',
  styleUrl: './update-guest.component.css'
})
export class UpdateGuestComponent implements OnInit{

  subscribe:Subscription|null=null;
  guest:Guest=new Guest();
  subGuest:Subscription|null=null;
  constructor(private guestSer:GuestService, private activatedRoute:ActivatedRoute, private router:Router ) { }
  ngOnInit(): void {
    this.subscribe = this.activatedRoute.params.subscribe((params) => {
      this.subGuest= this.guestSer.getGuest(params["id"]).subscribe({
        next: (data:GuestGetResponse) => {
          this.guest = data.result;
        },
        error: (err) => {console.log(err);
        }
      });
    });
  }
  // openModal(): void {
  //   this.modalService.open(CreateGuestModelComponent);
  // }

  Save() {
    this.guestSer.updateGuest(this.guest).subscribe({
      next: (data) => {
        console.log(data);
        location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.router.navigateByUrl("/app/allGuests");
  
  }
}
