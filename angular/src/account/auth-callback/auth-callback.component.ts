import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../../shared/services/google-auth.service';
import { NotifyService } from 'abp-ng2-module';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private notify:NotifyService
  ) { }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = urlParams.get('id_token');

    if (idToken) {
      const decodedPayload = this.decodeIdToken(idToken);
      const email = decodedPayload.email;

      this.googleAuthService.registerWithGoogle(idToken).subscribe(
        (response: any) => {
          console.log('Registration successful:', response);
        
        
       
            this.router.navigate(['/app/home']); 

     
        },
        (error: any) => {
          console.error('Registration failed, Please try again.', error);
          this.notify.error('Registration failed. Please try again.'); 
          this.router.navigate(['/account/login']); 
        }
      );
    } else {
      console.error('No id_token found in the URL');
      this.router.navigate(['/account/login']); 
    }
  }

  private decodeIdToken(idToken: string): any {
    const payload = idToken.split('.')[1]; 
    return JSON.parse(atob(payload));
  }
  
}
