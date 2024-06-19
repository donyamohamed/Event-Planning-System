import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Event } from '../../../shared/Models/Event';
import { EventService } from '../../../shared/Services/eventa.service';
import { Enumerator } from "../../../shared/Models/Event";
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/shared.module";

@Component({
    selector: 'app-create-event',
    standalone: true,
    templateUrl: './create-event.component.html',
    styleUrls: ['./create-event.component.css'],
    imports: [FormsModule, CommonModule, SharedModule]
})
export class CreateEventComponent implements OnInit {
  @ViewChild('eventForm') eventForm: NgForm;

  eventData: Event = new Event();
  enumeratorKeys = Object.values(Enumerator);
  username: string;
  today: Date = new Date();

  constructor(private eventService: EventService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserData();
    this.setDefaultValues();
  }

  getUserData(): void {
    this.http.get<any>('https://localhost:44311/api/services/app/UserProfileAppServices/GetUserProfile')
      .subscribe(response => {
        if (response && response.result) {
          this.username = response.result.name;
          this.eventData.userId = response.result.id;
        }
      });
  }

  createEvent(): void {
    if (typeof this.eventData.startDate === 'string') {
      this.eventData.startDate = new Date(this.eventData.startDate);
    }
    if (typeof this.eventData.endDate === 'string') {
      this.eventData.endDate = new Date(this.eventData.endDate);
    }
    const formData = new FormData();
    formData.append('name', this.eventData.name || '');
    formData.append('description', this.eventData.description || '');
    formData.append('location', this.eventData.location || '');
    formData.append('startDate', this.eventData.startDate?.toISOString() || '');
    formData.append('endDate', this.eventData.endDate?.toISOString() || '');
    formData.append('isPublic', this.eventData.isPublic?.toString() || '');
    formData.append('maxCount', this.eventData.maxCount?.toString() || '');
    formData.append('eventImg', this.eventData.eventImg || '');
    formData.append('category', this.eventData.category || '');
    formData.append('userId', this.eventData.userId?.toString() || '');
    if (this.eventData.eventImgFile) {
      formData.append('eventImgFile', this.eventData.eventImgFile);
    }

    this.eventService.createEvent(formData)
      .subscribe(
        (response) => {
          console.log(response);

          this.eventData = new Event();
          swal.fire({
            title: 'Success',
            text: 'Event added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            swal.fire({
              title: 'Do you want to set event expenses now?',
              html: '<img src="assets/img/Coins.gif" alt="Custom Icon" style="width: 200px; height: 150px;">',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'Later',
              customClass: {
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
              },
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = `/app/set-expenses?eventId=${response.result.id}`;
              } else {
                window.location.href = "/app/user-event";
              }
            });
          });

          // Reset the form after successful creation
          this.eventForm.resetForm();
        },
        (error) => {
          console.error('Error creating event:', error);
          swal.fire({
            title: 'Error',
            text: 'Failed to create event. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.eventData.eventImgFile = file;
    }
  }

  setDefaultValues(): void {
    this.eventData.isPublic = true;
    if (this.enumeratorKeys.length > 0) {
      this.eventData.category = this.enumeratorKeys[0];
    }
  }
}
