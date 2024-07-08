import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CurrentUser } from '@shared/Models/current-user';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

@Component({
  
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent  implements OnInit{
  sidebarExpanded: boolean;
  user: CurrentUser | null = null;
  constructor(
    private _userService: CurrentUserDataService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u); // Debugging: Log the user data
        this.user = u;
        this.cdr.markForCheck(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }
 
}


