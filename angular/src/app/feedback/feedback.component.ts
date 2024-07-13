import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedbackService } from '../../shared/services/feedback.service';
import { Feedback } from '../../shared/Models/feedback';
import { CurrentUserDataService } from '../../shared/services/current-user-data.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;
  numberOfStars: number = 0;
  userId: number | any;

  constructor(
    private fb: FormBuilder,
    private service: FeedbackService,
    private currentUserService: CurrentUserDataService,
    private appSessionService: AppSessionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FeedbackComponent>
  ) {
    this.feedbackForm = this.fb.group({
      rate: [0, Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.appSessionService.userId;
  }

  selectedStars(number: number) {
    this.numberOfStars = number;
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.feedbackForm.patchValue({
        rate: this.numberOfStars
      });
      const feedbackData: Feedback = {
        body: this.feedbackForm.value.body,
        rate: this.numberOfStars,
        dateTime: new Date(),
        userId: this.userId,
        eventId: this.data.eventId
      };
      console.log("Feedback Data:", feedbackData);

      this.service.createFeedback(feedbackData).subscribe(
        response => {
          console.log('Feedback submitted successfully!', response);
          this.feedbackForm.reset();
          this.dialogRef.close(); 
        },
        error => {
          console.error('Error submitting feedback:', error);
        }
      );
    }
  }

  submitFeedback() {
    return new Promise((resolve, reject) => {
      this.onSubmit();
      resolve(true);
    });
  }
}