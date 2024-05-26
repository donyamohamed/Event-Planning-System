import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GuestService } from '../../../shared/Services/guest.service';
import { Guest } from '../../../shared/Models/guest';
import { GuestResponse } from '../guest-response.model';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-all-guest',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './all-guest.component.html',
  styleUrl: './all-guest.component.css'
})
export class AllGuestComponent implements OnInit, OnDestroy{
  subscribe:Subscription|null=null;
  guests:Guest[]=[];
  dataTable: any;
  constructor(public guestSer:GuestService) { }
  ngOnInit(): void {
    this.subscribe= this.guestSer.getAllGuest().subscribe({
      next:(res:GuestResponse)=>{
        console.log(res);
        this.guests=res.result.items;
        console.log(this.guests);
  },
  error:(err)=>{console.log(err);
  }
})
  }
  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy(true);
    }
  }
}
