import { Component, OnInit } from '@angular/core';
import { CurrentUserDataService } from '@shared/Services/current-user-data.service';
import { CurrentUser } from '@shared/Models/current-user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {UpcomingEventsComponent} from './upcoming-events/upcoming-events.component'
@Component({
  imports: [
    FormsModule,
    CommonModule,
    UpcomingEventsComponent,
  
  ],
   standalone:true,
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 
  user: CurrentUser | null = null;
  bsModalRef!: BsModalRef;

  constructor(
    private _userService: CurrentUserDataService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u);
        this.user = u;
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  getUserImage(): string {
    return this.user?.image ? `https://localhost:44311/${this.user.image}` : 'assets/img/user.jpg';
  }

  openModal(template: any): void {
    this.bsModalRef = this.modalService.show(template);
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.user) {
      this.user.ImagePath = file;
        console.log(file);
        
    }
  }
  onSubmit(): void {
    
      const formData = new FormData();
      formData.append('userName', this.user.userName);
      if (this.user.ImagePath) {
        formData.append('imagePath', this.user.ImagePath);
      }
      formData.append('emailAddress', this.user.emailAddress);
      formData.append('age', this.user.age.toString());
      formData.append('genderUser', this.user.genderUser.toString());
  
      this._userService.UpdateUserData(formData).subscribe({
        next: updatedUser => {
          console.log('User data updated:', updatedUser);
          this.user = updatedUser;
          this.bsModalRef.hide();
          location.reload();
        },
       
      });
      // this._userService.UpdateUserData(this.user).subscribe({
      //   next: updatedUser => {
      //     this.user = updatedUser;
      //     console.log(updatedUser);
      //     this.bsModalRef.hide(); 
      //     location.reload();
      //   },
      // });
    
  }
  }

