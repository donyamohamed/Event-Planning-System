import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CurrentUser } from '@shared/Models/current-user';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import { SupplierService} from '@shared/Services/Supplier.service'
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { Router } from '@angular/router';
import { Event, EventType } from '@shared/Models/Event';
@Component({
  
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent  implements OnInit{
  sidebarExpanded: boolean;
  user: CurrentUser | null = null;
  eventCount: number;
  events: Event[] = [];
  userId: number; 
  showDropdown: boolean = false;
  roleData: any;
  constructor(
    private _userService: CurrentUserDataService,
    private cdr: ChangeDetectorRef,
    private eventService: SupplierService,
    private router: Router 
  ) {}
  ngOnInit(): void {
    this.loadUserProfile();
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u); 
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
    console.log(this.isLoggedIn);
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }
  loadUserProfile(): void {
    this.eventService.getUserProfile().subscribe(
      (profile) => {
        this.userId = profile.id;
        this.getPendingEvents(this.userId);
        this.getPendingEventsCount(this.userId);
        console.log("supplierId",this.userId)
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }
  getPendingEventsCount(userId: number) {
    this.eventService.getPendingEventsCount(userId).subscribe(response => {
      this.eventCount = response.result;
    });
  }

  getPendingEvents(userId: number) {
    this.eventService.getPendingEventsBySupplierId(this.userId).subscribe(
      (events: Event[]) => {
        this.events = events;
        console.log("Events loaded successfully");
      },
      (error) => {
        console.error('Error fetching pending events', error);
      }
    );
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToAllNotifications() {
    this.router.navigate(['/app/supplier-events']);
  }
  acceptEvent(eventId: number): void {
    this.eventService.acceptEvent(eventId).subscribe(
      () => {
        this.getPendingEvents(this.userId);
      },
      (error) => {
        console.error('Error accepting event', error);
      }
    );
  }

  rejectEvent(eventId: number): void {
    this.eventService.rejectEvent(eventId).subscribe(
      () => {
        this.getPendingEvents(this.userId);
      },
      (error) => {
        console.error('Error rejecting event', error);
      }
    );
  }
}