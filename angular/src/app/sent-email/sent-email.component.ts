import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sent-email',
  templateUrl: './sent-email.component.html',
  styleUrls: ['./sent-email.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SentEmailComponent implements OnInit {
  eventName: string = '';
  eventDate: Date = new Date();
  eventAddress: string = '';
  eventImage: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFBUqNx8mExyRVoNROZfwyUSiG5inpnmWPrg&s'; // Default image
  guestName: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventName = params['eventName'] || '';
      this.eventDate = new Date(params['date']) || new Date();
      this.eventAddress = params['eventAddress'] || '';
      this.eventImage = params['eventImg'] || this.eventImage;
      this.guestName = params['guestName'] || '';
    });
  }

  downloadInvitation(): void {
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait orientation, millimeters, A4 size
    const margin = 15; // margin for positioning elements
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    this.loading = true;
    this.error = '';

    this.loadImage(this.eventImage).then((imgData) => {
      // if (imgData) {
      //   // Add background image
      //  // doc.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, 80); // Adjust dimensions and position
      // }
      this.addEventDetails(doc, pageWidth, pageHeight, imgData);
      doc.save('Invitation.pdf');
      this.loading = false;
    }).catch((error) => {
      console.error('Error fetching image:', error);
      this.error = 'Error fetching image. Downloading without image.';
      this.addEventDetails(doc, pageWidth, pageHeight, '');
      doc.save('Invitation.pdf');
      this.loading = false;
    });
  }

  private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        } else {
          reject('Canvas context is null');
        }
      };
      img.onerror = () => {
        reject('Image failed to load');
      };
      img.src = url;
    });
  }

  private addEventDetails(doc: jsPDF, pageWidth: number, pageHeight: number, imgData: string): void {
    const margin = 20;
    // Add white background rectangle
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin, 'F');

    // Add border
    doc.setLineWidth(1);
    doc.setDrawColor(224, 224, 224); // Light gray border color
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Add header background image if available
    if (imgData) {
      doc.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, 80); // Adjust dimensions and position
    }

    // Add event details
    doc.setFontSize(36);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('Georgia', 'normal');
    doc.text(this.eventName, pageWidth / 2, margin + 100, { align: 'center' });

    doc.setFontSize(18);
    doc.text(`Join us as we celebrate our love and commitment.`, pageWidth / 2, margin + 130, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(119, 119, 119); // Gray color
    doc.text(`Date: ${this.eventDate.toLocaleDateString()}`, pageWidth / 2, margin + 150, { align: 'center' });
    doc.text(`Time: ${this.eventDate.toLocaleTimeString()}`, pageWidth / 2, margin + 165, { align: 'center' });
    doc.text(`Address: ${this.eventAddress}`, pageWidth / 2, margin + 180, { align: 'center' });
    
    if (this.guestName) {
      doc.setFontSize(16);
      doc.text(`Dear ${this.guestName},`, pageWidth / 2, margin + 195, { align: 'center' });
    }
  }
}
