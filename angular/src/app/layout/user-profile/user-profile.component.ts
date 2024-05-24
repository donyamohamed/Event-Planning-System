import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CurrentUserDataService } from '@shared/Services/current-user-data.service'; 
import { CurrentUser } from '@shared/Models/current-user'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: CurrentUser | null = null;

  constructor(
    private _userService: CurrentUserDataService,
    // private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u); 
        this.user = u;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  getUserImage(): string {
    return this.user?.imageName ? `assets/img/${this.user.imageName}` : 'assets/img/user.png';
  }

  openEditModal(content: TemplateRef<any>) {
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(modal: any) {
    if (this.user) {
      this._userService.UpdateUserData(this.user).subscribe({
        next: (updatedUser: CurrentUser) => {
          this.user = updatedUser;
          modal.close();
          console.log('User profile updated:', this.user);
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        }
      });
    }
  }
}
