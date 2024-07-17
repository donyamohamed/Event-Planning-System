import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierPlaces } from '@shared/Models/SupplierPlaces';
import { Enumerator } from '@shared/Models/Event';
import { SupplierService } from '@shared/Services/Supplier.service';
import mapboxgl from 'mapbox-gl';
import swal from 'sweetalert2';
import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-places',
  standalone: true,
  imports: [FormsModule, SharedModule,CommonModule],
  templateUrl: './supplier-places.component.html',
  styleUrls: ['./supplier-places.component.css']
})
export class SupplierPlacesComponent implements OnInit {
  supplierPlace: SupplierPlaces = new SupplierPlaces();
  enumeratorKeys = Object.values(Enumerator);
  map: mapboxgl.Map;

  constructor(private supService: SupplierService) { }

  ngOnInit(): void {
    mapboxgl.accessToken =  'pk.eyJ1IjoibWFiZG9naCIsImEiOiJjbGp1em54c24xaTd4M2NsbDBiOWZuMXk4In0.n4ILS2Jtk5tZ9onHBcL8Cw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.8025, 26.8206], // Default center (Egypt)
      zoom: 5, // Default zoom level
      attributionControl: false
    });

    // Add map click event to update location input
    this.map.on('click', (e) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const placeName = data.features[0]?.place_name || 'Unknown location';
          this.supplierPlace.location = placeName;
        })
        .catch(err => {
          console.error('Error fetching location name:', err);
        });
    });

    this.setDefaultValues();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.supplierPlace.imagePath = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.supplierPlace.name || '');
    formData.append('emailAddress', this.supplierPlace.contactEmail || '');
    formData.append('Capacity', this.supplierPlace.capacity.toString() || '');
    formData.append('Price', this.supplierPlace.price.toString() || '');
    formData.append('Description', this.supplierPlace.description || '');
    formData.append('category', this.supplierPlace.eventCategory || '');

    if (this.supplierPlace.imagePath) {
      formData.append('imagePath', this.supplierPlace.imagePath);
    }

    this.supService.createPlace(formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.supplierPlace = new SupplierPlaces();
          swal.fire({
            title: 'Success',
            text: 'New Event Place added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          console.error('Error creating event place:', error);
          swal.fire({
            title: 'Error',
            text: 'Failed to create event place. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  setDefaultValues(): void {
    if (this.enumeratorKeys.length > 0) {
      this.supplierPlace.eventCategory = this.enumeratorKeys[0];
    }
  }
}
