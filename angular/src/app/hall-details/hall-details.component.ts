import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../shared/Services/Supplier.service';
import { SupplierPlaces } from '../../shared/Models/SupplierPlaces';
import { CurrentUser } from '@shared/Models/current-user';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';

@Component({
  selector: 'app-hall-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hall-details.component.html',
  styleUrls: ['./hall-details.component.css']
})
export class HallDetailsComponent implements OnInit {
  supplierPlace: SupplierPlaces | undefined;
  user: CurrentUser;
  roleData: any;
  userRole: string;
  userId: number;

  private categoryMapping: { [key: number]: string } = {
    0: 'Concert',
    1: 'Conference',
    2: 'Workshop',
    3: 'Seminar',
    4: 'Party',
    5: 'Exam',
    6: 'Birthday',
    7: 'Graduation',
    8: 'Baby Shower',
    9: 'Wedding',
    10: 'Gathering',
    11: 'Other'
  };

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private userService: CurrentUserDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const placeId = Number(params.get('id')); // Correct ID extraction
      this.getSupplierPlace(placeId);
    });

    this.userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        this.user = u;
        this.userId = u.id;
        this.userService.GetUserRole(this.user.id).subscribe({
          next: (role: any) => {
            if (role) {
              this.roleData = role;
              this.userRole = role.result.roleNames[0];
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

  getSupplierPlace(id: number): void {
    this.supplierService.getSupplierPlaceById(id).subscribe(
      (data: SupplierPlaces) => {
        console.log('Original eventCategory:', data.eventCategory);
        console.log('Type of eventCategory before conversion:', typeof data.eventCategory);

        // Ensure data.eventCategory is a number
        const categoryNumber = Number(data.eventCategory);
        data.eventCategory = this.categoryMapping[categoryNumber] || 'Unknown';

        console.log('Converted eventCategory:', data.eventCategory);
        console.log('Type of eventCategory after conversion:', typeof data.eventCategory);

        this.supplierPlace = data;
      },
      error => {
        console.error('Error fetching supplier place', error);
      }
    );
  }

  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
