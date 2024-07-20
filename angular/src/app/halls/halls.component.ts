import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SupplierService } from '@shared/Services/Supplier.service';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import { CurrentUser } from '@shared/Models/current-user';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
@Component({
  selector: 'app-hall',
  templateUrl: './halls.component.html',
  styleUrls: ['./halls.component.css']
})
export class HallsComponent implements OnInit {
  halls: any[] = [];
  userRole: string;
  userId: number;
  user: CurrentUser;
  roleData: any;
  title: string;
  public isLoggedIn: boolean = false;
  constructor(
    private supplierService: SupplierService,
    private userService: CurrentUserDataService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        if(CurrentUser){
          this.isLoggedIn = true;
        }
        console.log('User data loaded:', u);
        this.user = u;
        this.userId = u.id;
        this.userService.GetUserRole(this.user.id).subscribe({
          next: (role: any) => {
            if (role) {
              this.roleData = role;
              this.userRole = role.result.roleNames[0];
              console.log("Role data:", role);
              this.setTitle();
              this.loadHalls();
              this.cdr.markForCheck();
            }
          },
          error: (err) => {
            console.error('Failed to load role data', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  setTitle(): void {
    this.title = this.userRole === 'SUPPLIER' ? 'My Halls' : 'Available Halls';
  }

  loadHalls(): void {
    if (this.userRole === 'SUPPLIER') {
      this.supplierService.getPlacesBySupplier(this.userId).subscribe(halls => {
  
        this.halls = halls;
      });
    } else if (this.userRole === 'ADMIN') {
   
      this.supplierService.getAllPlacesWithSupplierInfo().subscribe(halls => {
        this.halls = halls;
      });
    }
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }


  navigateToComponent(id: number): void {
    this.router.navigateByUrl(`/app/Chat/${id}`);
  }

  truncateDescription(description: string): string {
    const words = description.split(' ');
    return words.length > 17 ? words.slice(0, 17).join(' ') + '...' : description;
  }
  navigateToHallDetails(placeId: number) {
    this.router.navigate(['/app/hall-details', placeId]);
  }
}
