import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-guest-model',
  //imports: [CommonModule],
  templateUrl: './create-guest-model.component.html',
  styleUrl: './create-guest-model.component.css'
})
export class CreateGuestModelComponent {
  constructor(public activeModal: NgbActiveModal){

  }
}
