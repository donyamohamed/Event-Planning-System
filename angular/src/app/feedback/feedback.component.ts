import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from '../../shared/Services/feedback.service';
import { Feedback } from '../../shared/Models/feedback';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  feedbackForm: FormGroup = new FormGroup({});
  numberOfStars: number = 0;

  constructor(private fb: FormBuilder, private service: FeedbackService ,  public activatedRouter: ActivatedRoute,) {
    this.feedbackForm = this.fb.group({
      rate: [0, Validators.required],
      body: ['']
    });
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
        id: 0, // Assuming ID is auto-generated or not needed in the request
        body: this.feedbackForm.value.body,
        rate: this.numberOfStars,
        date: new Date() 
      };

      this.service.createFeedback(feedbackData).subscribe(
        response => {
          console.log('Feedback submitted successfully!', response);
          this.feedbackForm.reset();
        },
        error => {
          console.error('Error submitting feedback:', error);
        }
      );
    }
  }
}
