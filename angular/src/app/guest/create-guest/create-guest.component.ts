
import { ActivatedRoute, Router } from "@angular/router";
import { GuestService } from "../../../shared/services/guest.service";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

//import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Guest } from "@shared/Models/guest";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

@Component({
    selector: "app-create-guest",
    standalone: true,
    templateUrl: "./create-guest.component.html",
    styleUrl: "./create-guest.component.css",
    imports: [CommonModule, FormsModule, SharedModule]
})
export class CreateGuestComponent //implements OnInit 
{
  subscribe: Subscription | null = null;
  guest: Guest = new Guest();
  constructor(
    private guestSer: GuestService,
    public activatedRoute: ActivatedRoute,

    //public modalService: NgbModal,

    public router: Router
  ) {}

  openModal(): void {

    //this.modalService.open(CreateGuestModelComponent);

  }

  Save() {
    // this.guestSer.createGuest(this.guest).subscribe({
    //   next: (data) => {
    //     this.guest=data;
    //     console.log("gust"+this.guest);
    //     console.log(data);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
    console.log(this.guest);
    this.router.navigateByUrl("/app/allGuests");
  }
}
