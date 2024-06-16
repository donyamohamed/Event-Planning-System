import { Component, HostListener, OnInit,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationStatus, Notifications, UpdateNotificationStatusDto } from "@shared/Models/Notification";
import { NotificationsService } from "@shared/Services/notificatios.service";
import { Event } from '@shared/Models/Event';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificatios.component.html',
  styleUrl: './notificatios.component.css'
})
export class NotificatiosComponent implements OnInit {
  oldObj: UpdateNotificationStatusDto = new UpdateNotificationStatusDto(0, NotificationStatus.Pending);
  Reject(item: any) {
    this.oldObj.id = item.id;
    this.oldObj.status = NotificationStatus.Rejected;
    Swal.fire({
      title: 'Are you sure You Will Reject This Request?',
      showClass: {
        popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
        `
      },
      hideClass: {
        popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
        `
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4242c5',
      cancelButtonColor: '#9f9e9e',
      confirmButtonText: 'Reject!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.UpdateNotificationStatus(this.oldObj)
          .subscribe(() => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });
            Toast.fire({
              icon: 'success',
              title: 'Invitation Updated Successfully'

            }).then(n => {
              location.reload();

            });
          });
      }
    });
  }
  Accept(item: any) {
    this.oldObj.id = item.id;
    this.oldObj.status = NotificationStatus.Accepted;
    Swal.fire({
      title: 'Are you sure You Will Accept This Request?',
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
          `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
          `
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4242c5',
      cancelButtonColor: '#9f9e9e',
      confirmButtonText: 'Sure, Accept!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.UpdateNotificationStatus(this.oldObj)
          .subscribe(() => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });
            Toast.fire({
              icon: 'success',
              title: 'Invitation Updated Successfully'

            }).then(n => {
              location.reload();

            });
          });
      }
    });
  }
  AllNotifications: Notifications[] | any;
  Upcomming: Event[] | any;
  count: number | any=0;
  count2:number|any=0;
  ngOnInit(): void {
    this.Service.GetUserNotifications().subscribe({
      next: n => {
        this.AllNotifications = n;
      }
    });
    this.Service.GetUpcommingEventsReminder().subscribe({
      next: U => {
        this.Upcomming = U;
      }
    });
    this.Service.GetNotificationsCount().subscribe({
      next: c => {
        this.count = c;
      }
    });
    this.Service.GetReminderCount().subscribe({
      next:r=>{
        this.count2=r;
      }
    });
  }
  AllCount:number=this.count+this.count2;
  fontWeight: string = 'bold';
  changeFontWeight(item:any) {

    this.fontWeight= 'normal';
  
  }
  isCollapsed = false;
  toggleCollapse( event: MouseEvent) {
    this.isCollapsed = !this.isCollapsed;
    event.stopImmediatePropagation();
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCollapsed = false;
    }
  }
  constructor(public Service: NotificationsService,private elementRef: ElementRef) {


  }
}
