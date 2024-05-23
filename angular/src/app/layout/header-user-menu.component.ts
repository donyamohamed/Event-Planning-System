import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { CurrentUserDataService } from '@shared/Services/current-user-data.service'; 
import { CurrentUser } from '@shared/Models/current-user'; 

@Component({
  selector: 'header-user-menu',
  templateUrl: './header-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserMenuComponent implements OnInit {
  user: CurrentUser | null = null;

  constructor(
    private _authService: AppAuthService,
    private _userService: CurrentUserDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u); // Debugging: Log the user data
        this.user = u;
     
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  logout(): void {
    this._authService.logout();
  }
}
