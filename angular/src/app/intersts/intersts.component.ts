import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowInterestsService } from '../../shared/Services/show-interests.service';
import { Interest } from '../../shared/Models/interestss';

@Component({
  selector: 'app-intersts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intersts.component.html',
  styleUrl: './intersts.component.css'
})
export class InterstsComponent implements OnInit {

  intersts: Interest[] = [];

  constructor(public showAllIntersts: ShowInterestsService) { }

  ngOnInit() {
    this.showAllIntersts.GetAllInterests().subscribe({
      next: (data) => { this.intersts = data },
      error: (err) => {console.log(err); }
    })
  }

}
