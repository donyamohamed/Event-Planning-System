import { Component, OnInit, ViewChild } from '@angular/core';
import { Event, EventType } from '../../../shared/Models/Event';
import { EventService } from '../../../shared/Services/eventa.service';
import { Enumerator } from "../../../shared/Models/Event";
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { SupplierService } from '../../../shared/Services/Supplier.service';
import * as Filter from 'bad-words';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SharedModule]
})
export class CreateEventComponent implements OnInit {
    @ViewChild('eventForm') eventForm!: NgForm;
  eventData: Event = new Event();
  enumeratorKeys = Object.values(Enumerator);
  map: mapboxgl.Map;
  username: string;
  today: string = new Date().toISOString().slice(0, 16);
  filter = new Filter();
  EventType: EventType;
  places: any[] = [];
  enumeratorKey = Object.keys(Enumerator); // Assuming Enumerator is an Enum

  constructor(
    private eventService: EventService,
    private http: HttpClient,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.setDefaultValues();
    this.initializeMap();
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

  initializeMap(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFiZG9naCIsImEiOiJjbGp1em54c24xaTd4M2NsbDBiOWZuMXk4In0.n4ILS2Jtk5tZ9onHBcL8Cw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.8025, 26.8206],
      zoom: 5,
      attributionControl: false
    });

    this.map.on('click', (e) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const placeName = data.features[0]?.place_name || 'Unknown location';
          this.eventData.location = placeName;
        })
        .catch(err => {
          console.error('Error fetching location name:', err);
        });
    });
  }

  onEventTypeChange(): void {
    if (this.eventData.type === EventType.Free) {
      this.eventData.ticketPrice = 0;
      this.eventData.type = EventType.Free;
    } else {
      this.eventData.ticketPrice = null;
      this.eventData.type = EventType.Paid;
      this.eventData.isPublic = true;
    }
  }

  onEventpublicChange() {
    if (this.eventData.isPublic === false) {
      this.eventData.type = 1;
      this.eventData.ticketPrice = 0;
    }
  }

  onCategoryChange(): void {
    if (this.eventData.category) {
      const categoryIndex = this.enumeratorKey.indexOf(this.eventData.category);
      if (categoryIndex !== -1) {
        this.supplierService.getPlacesByCategory(categoryIndex)
          .subscribe((response: any) => {
            this.places = response.result; // Assuming response has an array of places
          }, (error) => {
            console.error('Error fetching places:', error);
          });
      }
    }
  }
  

  createEvent(): void {
    if (typeof this.eventData.startDate === 'string') {
      this.eventData.startDate = new Date(this.eventData.startDate);
    }
    if (typeof this.eventData.endDate === 'string') {
      this.eventData.endDate = new Date(this.eventData.endDate);
    }

    if (this.containsBadWords(this.eventData.name) || this.containsBadWords(this.eventData.description)) {
      swal.fire({
        title: 'Validation Error',
        text: 'Event name or description contains inappropriate language.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
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
    formData.append('ticketPrice', this.eventData.ticketPrice?.toString() || '');
    formData.append('type', this.eventData.type?.toString() || '');
    formData.append('placeId', this.eventData.placeId?.toString() || '');
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
            text: 'Event added successfully! The supplier will reply to you regarding checking out the place.',
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

          // Reset the form after successful event creation
          if (this.eventForm) {
            this.eventForm.resetForm();
          }
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

  validateDates() {
    if (new Date(this.eventData.startDate) > new Date(this.eventData.endDate)) {
      this.eventData.endDate = this.eventData.startDate;
    }
  }

  private containsBadWords(text: string): boolean {
    return this.filter.isProfane(text);
  }
}
