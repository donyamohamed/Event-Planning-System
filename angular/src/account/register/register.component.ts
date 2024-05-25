import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  AccountServiceProxy,
  RegisterInput,
  RegisterOutput
} from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { SignGoogleService } from '@shared/Services/sign-google.service';

declare var gapi: any;  

@Component({
  templateUrl: './register.component.html',
  animations: [accountModuleAnimation()],
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  model: RegisterInput = new RegisterInput();
  fileToUpload: File | null = null;
  saving = false;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private authService: AppAuthService,
    private _googleService: SignGoogleService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: '1014379927954-9l3ht03g8nsribu8kkd6qd2tb7c9e0rj.apps.googleusercontent.com',
          scope: 'email profile openid',
        });
      });
    };
    document.head.appendChild(script);
  }

  googleSignIn(): void {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser: any) => {
      const idToken = googleUser.getAuthResponse().id_token;
      // Make HTTP request to back end
      this._googleService.googleSignIn({ idToken }).subscribe(
        (response) => {
          console.log('Google sign-in successful:', response);
        
        },
        (error) => {
          console.error('Error signing in with Google:', error);
         
        }
      );
    }).catch((error) => {
      console.error('Error signing in with Google:', error);
    });
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.model.imageFile = file;
      console.log(this.model.imageFile );
    }
  }

  

  save(): void {
    this.saving = true;

    const formData = new FormData();
  

    formData.append('name', this.model.name);
    formData.append('surname', this.model.surname);
    formData.append('emailAddress', this.model.emailAddress);
    formData.append('userName', this.model.userName);
    formData.append('password', this.model.password);
    formData.append('age', this.model.age.toString());
    formData.append('gender', this.model.gender.toString());
  
  
    // if (this.fileToUpload) {
    //   formData.append('imageFile', this.fileToUpload, this.fileToUpload.name);
    // }
    if (this.model.imageFile) {
      formData.append('imageFile', this.model.imageFile); 
  }
    this._accountService
      .registerFromForm(formData) 
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((result: RegisterOutput) => {
        if (!result.canLogin) {
          this.notify.success(this.l('SuccessfullyRegistered'));
          this._router.navigate(['/login']);
          return;
        }
  
        // Authenticate
        this.saving = true;
        this.authService.authenticateModel.userNameOrEmailAddress = this.model.userName;
        this.authService.authenticateModel.password = this.model.password;
        this.authService.authenticate(() => {
          this.saving = false;
        });
      });
  }
  
}
