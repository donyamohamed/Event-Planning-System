import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowInterestsService } from '../../shared/services/show-interests.service';
import { Interest } from '../../shared/Models/interestss';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { publicDecrypt } from 'crypto';
import { Router } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@Component({
    selector: 'app-intersts',
    // standalone: true,
    templateUrl: './intersts.component.html',
    styleUrl: './intersts.component.css',
    // imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class InterstsComponent implements OnInit {

  intersts: Interest[] = [];
  selectedInterestsId: number[] = [];
  interstsForm: FormGroup = new FormGroup({});

  constructor(public InterstsService: ShowInterestsService, public router:Router ) { }

  ngOnInit() {

    this.InterstsService.HasInterests().subscribe(x => {
      if (!x) {
        this.router.navigate(['/app/showInterests']);
        this.InterstsService.GetAllInterests().subscribe({
          next: (data) => { this.intersts = data },
          error: (err) => { console.log(err); }
        })
      } else{
         this.router.navigateByUrl("app/home");
      }
    })


  }

  SelectedInterests(id: number) {
    if (this.selectedInterestsId.includes(id)) {
      this.selectedInterestsId = this.selectedInterestsId.filter(a => a != id)
    }
    else {
      this.selectedInterestsId.push(id);
    }
  }

  onSubmit() {
    console.log('Selected Interests:', this.selectedInterestsId);
    this.InterstsService.AddInterstsForUser(this.selectedInterestsId).subscribe({
      next: (response) => {
        // this.router.navigateByUrl("app/home");
        window.location.reload();
      },
      error: (err) => {
        console.error('Error adding interests:', err);
      }
    });
  }
  
}
