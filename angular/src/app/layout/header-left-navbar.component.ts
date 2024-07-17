import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { CurrentUserDataService } from '@shared/services/current-user-data.service'; 
import { CurrentUser } from '@shared/Models/current-user'; 

@Component({
  selector: 'header-left-navbar',
  templateUrl: './header-left-navbar.component.html',
  styleUrl:'./header-left-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderLeftNavbarComponent implements OnInit {
  sidebarExpanded: boolean;
  user: CurrentUser | null = null;
  roleData:any;
  constructor(
    private _layoutStore: LayoutStoreService,
    private _userService: CurrentUserDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });

    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u); // Debugging: Log the user data
        this.user = u;
        this.cdr.markForCheck(); // Manually trigger change detection
        this._userService.GetUserRole(this.user.id).subscribe({
          next :n=>{
            if(n){
              this.roleData=n;
              console.log("role ",n);
            }
          }
        });
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }
}
