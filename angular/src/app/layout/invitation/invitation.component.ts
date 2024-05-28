import { Component } from '@angular/core';
import { InvitationService } from '../../../shared/Services/invitation.service';
import { EmailRequest } from '../../../shared/Models/EmailRequest';
import { SmsRequest } from '../../../shared/Models/Sms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class InvitionComponent {
  constructor(private invitationService: InvitationService) { }

  sendEmail() {
    const emailRequest: EmailRequest = {
      ToEmail: 'example@example.com',
      Subject: 'Invitation to Event',
      Body: 'Please join us for an event.',
      EventName: 'Event Name',
      Date: new Date(),
      EventAddress: '123 Event Street'
    };

    this.invitationService.sendInvitationByEmail(emailRequest).subscribe(response => {
      console.log('Email sent successfully', response);
    }, error => {
      console.error('Error sending email', error);
    });
  }

  sendSms() {
    const smsRequest: SmsRequest = {
      ToPhoneNumber: '1234567890',
      Message: 'Please join us for an event.',
      EventName: 'Event Name',
      Date: new Date(),
      EventAddress: '123 Event Street'
    };

    this.invitationService.sendInvitationBySms(smsRequest).subscribe(response => {
      console.log('SMS sent successfully', response);
    }, error => {
      console.error('Error sending SMS', error);
    });
  }
}
