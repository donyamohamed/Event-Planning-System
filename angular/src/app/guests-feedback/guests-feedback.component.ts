import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestFeedback } from '@shared/Models/GuestFeed';
import { FeedbackService } from '@shared/Services/feedback.service';

@Component({
  selector: 'app-guests-feedback',
  templateUrl: './guests-feedback.component.html',
  styleUrls: ['./guests-feedback.component.css']
})
export class GuestsFeedbackComponent implements OnInit {
  eventId: number;
  guestId: number;
  guestsfeedbackForm: FormGroup;
  numberOfStars: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: FeedbackService,
  ) {
    this.guestsfeedbackForm = this.fb.group({
      rate: [0, Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.guestId = params['guestId'];
      console.log('Event ID:', this.eventId);
      console.log('Guest ID:', this.guestId);
    });
  }

  selectedStars(stars: number) {
    this.numberOfStars = stars;
  }

  onSubmit() {
    if (this.guestsfeedbackForm.valid) {
      this.guestsfeedbackForm.patchValue({
        rate: this.numberOfStars
      });
      const feedbackData: GuestFeedback = {
        body: this.guestsfeedbackForm.value.body,
        rate: this.numberOfStars,
        dateTime: new Date(),
        guestId: this.guestId,
        eventId: this.eventId
      };
      console.log("Feedback Data:", feedbackData);

      this.service.createFeed(feedbackData).subscribe(
        response => {
          console.log('Feedback submitted successfully!', response);
          this.guestsfeedbackForm.reset();
          setTimeout(() => {
            window.close();
          }, 3000); // Adjust the delay as needed
        },
      
        error => {
          console.error('Error submitting feedback:', error);
        }
      );
    }
  }
}
