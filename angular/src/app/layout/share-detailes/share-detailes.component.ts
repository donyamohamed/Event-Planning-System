import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventdetailsService } from '@shared/Services/eventdetails.service';
import { Event } from '@shared/Models/Event';

@Component({
  selector: 'app-share-detailes',
  standalone: true,
  imports: [],
  templateUrl: './share-detailes.component.html',
  styleUrl: './share-detailes.component.css'
})
export class ShareDetailesComponent {
  event: Event | undefined;
  eventId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventDetailsService: EventdetailsService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('id'));
      if (this.eventId) {
        this.loadEventDetails();
      }
    });
  }

  loadEventDetails(): void {
    if (this.eventId) {
      this.eventDetailsService.getEventById(this.eventId).subscribe(
        (data) => {
          this.event = data.result;
          console.log("Event Details:", data.result);
          this.setMetaTags(this.event);
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  setMetaTags(event: Event): void {
    this.addMetaTag('og:title', event.name);
    this.addMetaTag('og:description', event.description);
    this.addMetaTag('og:image', event.eventImg);
    this.addMetaTag('og:url', window.location.href);
  }

  addMetaTag(name: string, content: string): void {
    const metaTag = this.renderer.createElement('meta');
    this.renderer.setAttribute(metaTag, 'property', name);
    this.renderer.setAttribute(metaTag, 'content', content);
    this.renderer.appendChild(document.head, metaTag);
  }
}
