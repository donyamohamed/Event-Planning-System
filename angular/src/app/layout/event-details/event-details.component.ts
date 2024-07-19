
import { FeedbackService } from '../../../shared/services/feedback.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventdetailsService } from '../../../shared/services/eventdetails.service';
import { EventBudgetService } from '../../../shared/services/event-budget.service';
import { Event } from '../../../shared/Models/Event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";
import { UserService } from '../../../shared/services/user-service.service';
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import Swal from 'sweetalert2';
import { Feedback } from '@shared/Models/feedback';
import { forkJoin, map, Subject } from 'rxjs';
import { SavedEventServiceService } from '../../../shared/services/saved-event-service.service';
import { SavedEventData } from '../../../shared/Models/SavedEventData';
import {SupplierPlaces} from '../../../shared/Models/SupplierPlaces';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SharedModule]
})


export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  eventId: number | undefined;
  budgetAmount: number | undefined;
  user: any;
  loggedInUserId: number | undefined;
  isEventCreator: boolean = false; 
  rating: any;
  stars: { type: string, title: string }[] = [];
  numberOfRaters: number | undefined;
  feedbackList: Feedback[] = [];
  isEventSaved: boolean = false;
  isLogin: boolean = false;
  guestCount: number | undefined;
  place :SupplierPlaces | undefined;
  private destroy$ = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventDetailsService: EventdetailsService,
    private eventBudgetService: EventBudgetService,
    private userService: UserService,
    private currentUserData: CurrentUserDataService,
    private feedbackServ: FeedbackService,
    private savedEventService: SavedEventServiceService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('id'));
      this.loadEventDetails();
      this.showFeedbackForEvent();
      this.showPlaceOfEvent();
      this.loadGuestCount();

      if (this.loggedInUserId && this.eventId) {
        this.checkIfEventSaved();
      }
      this.navigateToSaveEvent(this.eventId);
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadCurrentUser(): void {
    this.currentUserData.GetCurrentUserData().subscribe(
      response => {
        console.log(response);
        this.loggedInUserId = response.id;
        this.isLogin = true;
        this.loadEventDetails();
        this.checkIfEventCreator(); // Check if the event creator is the logged-in user
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  loadEventDetails(): void {
    if (this.eventId) {
      this.eventDetailsService.getEventById(this.eventId).subscribe(
        (data) => {
          this.event = data.result;
          console.log("Event Details:", data.result);

          this.rating = this.feedbackServ.getRating(this.event.id).subscribe(
            (res) => {
              console.log("Rating:", res.result.numberOfRaters);
              this.numberOfRaters = res.result.numberOfRaters;
              console.log(res.result.averageRating);
              this.setStars(res.result.averageRating); // Set stars based on rating
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          ); // Set rating from event data


          this.userService.getUserById(this.event.userId).subscribe(
            (userData) => {
              this.user = userData.result;
              console.log("User Data:", userData.result);
              this.checkIfEventCreator(); // Check if the event creator is the logged-in user
              this.checkIfEventSaved();
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }
  loadGuestCount(): void {
    if (this.eventId) {
      this.eventDetailsService.getGuestCountByEventId(this.eventId).subscribe(
        (data) => {
          this.guestCount = data.result;
          console.log("Guest Count:", this.guestCount);
        },
        (error) => {
          console.error('Error fetching guest count:', error);
        }
      );
    }
  }

  checkIfEventCreator(): void {
    if (this.event && this.loggedInUserId !== undefined) {
      this.isEventCreator = (this.event.userId === this.loggedInUserId);
      if (this.isEventCreator) {
        console.log("The logged-in user is the creator of the event.");
      } else {
        console.log("The logged-in user is not the creator of the event.");
      }
    }
  }

  navigateToSetExpenses(eventId: number): void {
    this.router.navigate(['/app/set-expenses'], { queryParams: { eventId: eventId } });
  }

  getUserImage(): string {
    return this.user?.image
      ? this.user.image
      : "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";
  }

  openShareAlert(): void {
    const shareUrl = this.getShareUrl();

    Swal.fire({
      title: 'Share this event',
      html: `
        <button class="btn text-primary" id="share-facebook"><i class="fa-brands fa-facebook-f fa-x"></i></button> | 
        <button class="btn text-primary" id="share-linkedin"><i class="fa-brands fa-linkedin-in fa-x"></i></button> | 
        <button class="btn text-dark" id="share-twitter"><i class="fa-brands fa-x-twitter fa-x"></i></button> | 
        <button class="btn text-success" id="share-whatsapp"><i class="fa-brands fa-whatsapp fa-x"></i></button>
        <div class="mt-3 link-forcopy d-flex align-items-center justify-content-center">
          <span id="share-link" class="pr-1" >${shareUrl}</span>
          <button class="btn text-dark"><i class="far fa-clone" id="copy-link"></i></button>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'swal2-custom-popup'
      },
      didOpen: () => {
        document.getElementById('share-facebook')?.addEventListener('click', () => this.shareOnFacebook());
        document.getElementById('share-linkedin')?.addEventListener('click', () => this.shareOnLinkedIn());
        document.getElementById('share-twitter')?.addEventListener('click', () => this.shareOnTwitter());
        document.getElementById('share-whatsapp')?.addEventListener('click', () => this.shareOnWhatsApp());
        document.getElementById('copy-link')?.addEventListener('click', () => this.copyToClipboard(shareUrl));
      }
    });
  }

  getShareUrl(): string {
    return `${window.location.origin}/event-details/${this.eventId}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire('Copied!', 'The link has been copied to the clipboard.', 'success');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  shareOnFacebook(): void {
    const shareUrl = this.getShareUrl();
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookShareUrl, '_blank');
  }

  shareOnTwitter(): void {
    const shareUrl = this.getShareUrl();
    const text = `Check out this event! ${this.event?.name}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterShareUrl, '_blank');
  }

  shareOnLinkedIn(): void {
    const shareUrl = this.getShareUrl();
    const title = this.event?.name;
    const summary = this.event?.description;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title!)}&summary=${encodeURIComponent(summary!)}`;
    window.open(linkedInShareUrl, '_blank');
  }

  shareOnWhatsApp(): void {
    const shareUrl = this.getShareUrl();
    const whatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    window.open(whatsAppShareUrl, '_blank');
  }

  sendEmail(email: string): void {
    if (email) {
      console.log(email);
      window.location.href = `mailto:${email}`;
    } else {
      console.error('Email address is not defined');
    }
  }

  setStars(rating: number): void {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        this.stars.push({ type: 'full', title: `${i} stars` });
      } else if (rating > i - 1) {
        this.stars.push({ type: 'half', title: `${i - 0.5} stars` });
      } else {
        this.stars.push({ type: 'empty', title: `${i} stars` });
      }
    }
  }

  // this.feedbackServ.getAllFeedback(this.eventId).subscribe(
  //   data => {
  //     const userRequests = data.map(feedback =>
  //       this.userService.getUserById(feedback.userId)
  //         .pipe(
  //           map(user => ({ ...feedback, user: user.result }))
  //         )
  //     );

  showFeedbackForEvent(): void {
    if (this.eventId) {
      console.log('Fetching feedback for event ID:', this.eventId);

      this.feedbackServ.getAllFeedback(this.eventId).subscribe(
        (data) => {
          console.log('Feedback data:', data);
          data.map(feedback =>
            this.userService.getUserById2(feedback.userId)
              .pipe(
                map(user => ({ ...feedback, user: user }))
              ).subscribe(data =>
                this.feedbackList.push(data)
              ))
        },
        (error) => {
          console.error('Error fetching feedback:', error);
        }
      );
    }
  }

  private showPlaceOfEvent(): void {
    if (this.eventId) {
      console.log('Fetching place for event ID:', this.eventId);
      this.eventDetailsService.getPlaceOfEvent(this.eventId).pipe(takeUntil(this.destroy$)).subscribe(
        (result) => {
          console.log('Place data:', result);
          this.place = result;
          console.log('Assigned place:', this.place);
        },
        (error) => {
          console.error('Error fetching place:', error);
        }
      );
    }
  }
  

  // private showPlaceOfEvent(): void {
  //   if (this.eventId) {
  //     this.eventDetailsService.getPlaceOfEvent(this.eventId).pipe(takeUntil(this.destroy$)).subscribe(
  //       result => {
  //         this.place = result;
  //         console.log('Place data:', result);
  //       },
  //       error => console.error('Error fetching place:', error)
  //     );
  //   }
  // }
  















  checkIfEventSaved(): void {
    this.savedEventService.getAllSavedEvents().subscribe(
      (response) => {
        console.log('GetAllSavedEvents response:', response); // Log the response for debugging
        const savedEvents = response.result.items;

        if (Array.isArray(savedEvents)) {
          this.isEventSaved = savedEvents.some((event: any) => event.eventId === this.eventId && this.event.userId === this.loggedInUserId);
        } else {
          console.error('GetAllSavedEvents did not return an array:', savedEvents);
        }
      },
      (error) => {
        console.error('Error checking if event is saved:', error);
      }
    );
  }




  // Function to save an event
  navigateToSaveEvent(eventId: number): void {
    const data: SavedEventData = {
      eventId: eventId,
      userId: this.loggedInUserId!
    };
    this.savedEventService.createSavedEvent(data).subscribe(
      (res) => {
        this.isEventSaved = true; // Mark the event as saved
        console.log('Event saved successfully.');
      },
      (error) => {
        console.error('Error saving event:', error);
      }
    );
  }

  // Function to cancel saving an event
  cancelEventSave(eventId: number): void {
    this.savedEventService.deleteSavedEvent(eventId).subscribe(
      (res) => {
        this.isEventSaved = false;
        console.log('Event save canceled successfully.');
      },
      (error) => {
        console.error('Error canceling saved event:', error);
      }
    );
  }


  // Function to determine which bookmark icon class to use
  getBookmarkIconClass(): string {
    return this.isEventSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
  }
}

