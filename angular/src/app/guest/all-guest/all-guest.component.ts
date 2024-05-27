import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { GuestService } from "../../../shared/Services/guest.service";
import { Guest } from "../../../shared/Models/guest";
import { GuestResponse } from "../guest-response.model";
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { GuestGetResponse } from "../guest-get-response";

@Component({
  selector: "app-all-guest",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: "./all-guest.component.html",
  styleUrl: "./all-guest.component.css",
})
export class AllGuestComponent implements OnInit {
  modalRef: BsModalRef;
  subscribe: Subscription | null = null;
  subGuest: Subscription | null = null;
  guests: Guest[] = [];
  dataTable: any;
  guest: Guest = new Guest();
  guestEdit: Guest = new Guest();
  static guestsCount: number;
  bsModalRef: any;
  constructor(public guestSer: GuestService, private modalService: BsModalService, private router:Router, private activatedRoute:ActivatedRoute) {}
  ngOnInit(): void {
    this.subscribe = this.guestSer.getAllGuest().subscribe({
      next: (res: GuestResponse) => {
        console.log(res);
        this.guests = res.result.items;
        AllGuestComponent.guestsCount = res.result.totalCount;
        console.log(this.guests);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }
  openEditModal(template: TemplateRef<any>,id:number): void {
    this.bsModalRef = this.modalService.show(template);
    // this.subscribe = this.activatedRoute.params.subscribe((params) => {
      this.subGuest= this.guestSer.getGuest(id).subscribe({
        next: (data:GuestGetResponse) => {
          this.guestEdit = data.result;
          console.log(this.guestEdit);
        },
        error: (err) => {
          console.log(err);
        }
      });
    // });
  }
  Save() {
    this.guestSer.createGuest(this.guest).subscribe({
      next: (data) => {
        this.guest = data;
        console.log("gust" + this.guest);
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    console.log(this.guest);
    location.reload();
    this.router.navigateByUrl("/app/allGuests");
  }
}
