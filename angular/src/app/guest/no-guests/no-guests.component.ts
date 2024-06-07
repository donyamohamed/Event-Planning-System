import { Subscription } from 'rxjs';
import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestService } from '@shared/Services/guest.service';
import { Guest } from '@shared/Models/guest';
import { ActivatedRoute, Router } from '@angular/router';
import { template } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-no-guests',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './no-guests.component.html',
  styleUrl: './no-guests.component.css'
})
export class NoGuestsComponent {
  sub:Subscription|null=null;
  idEvent:number=0;
  id:number=0;
  guest:Guest=new Guest();
  guestForm: FormGroup;
  modalRef: BsModalRef;
  bsModalRef: any;
  constructor(
    private fb: FormBuilder,
    public guestSer:GuestService,
    public activatedRouter:ActivatedRoute,
    private modalService: BsModalService,
    public router:Router
  ){
    this.guestForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      invitationState: ['', [Validators.required]]
    });
  }
  AddGeust(){
    // this.sub= this.activatedRouter.params.subscribe(param=> {
    //   this.sub=this.guestSer.createGuest(this.guest).subscribe({
    //     next(result) {
          
    //       console.log(result);
    //       console.log(param["id"]);  
    //       this.router.navigate(["app/allGuests/" +param["id"]]);
    //       // this.router.navigateByUrl("app/allGuests/" +param["id"]);
    //     },
    //     error(err){console.log(err);}
        
    //   })
    // });
    if (this.guestForm.valid) {
    this.sub = this.activatedRouter.params.subscribe(param => {
      this.guestSer.createGuest(this.guest).subscribe({
        next: (result) => {
          console.log(result);
          this.router.navigateByUrl("app/allGuests/" + param["id"]);
          this.modalRef.hide();
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }
  } //end AddGuest function

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }
}
