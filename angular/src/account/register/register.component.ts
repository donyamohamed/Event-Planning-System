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
import { GoogleAuthService } from '../../shared/Services/google-auth.service';


declare var gapi: any;  

@Component({
  templateUrl: './register.component.html',
  animations: [accountModuleAnimation()],
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  model: RegisterInput = new RegisterInput();
  fileToUpload: File | null = null;
  imageName:string | null=null;
  saving = false;
  user: any;
  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private authService: AppAuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
  ) {
    super(injector);
  }

 

  ngOnInit(): void {
    this.googleAuthService.user.subscribe(user => {
      this.user = user;
    });
  }

  signInWithGoogle() {
    this.googleAuthService.signIn();
  }

  signOut() {
    this.googleAuthService.signOut();
  }

  // googleSignIn(): void {
  //   const auth2 = gapi.auth2.getAuthInstance();
  //   auth2.signIn().then((googleUser: any) => {
  //     const idToken = googleUser.getAuthResponse().id_token;
  //     // Make HTTP request to back end
  //     this._googleService.googleSignIn({ idToken }).subscribe(
  //       (response) => {
  //         console.log('Google sign-in successful:', response);
        
  //       },
  //       (error) => {
  //         console.error('Error signing in with Google:', error);
         
  //       }
  //     );
  //   }).catch((error) => {
  //     console.error('Error signing in with Google:', error);
  //   });
  // }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.model.imageFile = file;
      this.imageName=file.name;
      // console.log(this.model.imageFile );
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

    if (this.model.imageFile) {
      formData.append('imageFile', this.model.imageFile);
    }

    this._accountService.registerFromForm(formData).pipe(
      finalize(() => { this.saving = false; })
    ).subscribe(
      (result: RegisterOutput) => {
        if (!result.canLogin) {
      
          setTimeout(() => {
              this.notify.success('Registration successful! Please check your email for further instructions.');
          }, 4000);
          this._router.navigate(['/account/login']);
        } else {
            this._router.navigate(['/account/login']);
        }
      },
      (error: any) => {
        console.error('An error occurred during registration', error);
        this.notify.error(error.message || 'Registration failed. Please try again.');
      }
    );
    // this._accountService
    //   .registerFromForm(formData)
    //   .pipe(
    //     finalize(() => {
    //       this.saving = false;
    //     })
    //   )
    //   .subscribe(
    //     (result: RegisterOutput) => {
    //       console.log(result);
    //       this.notify.success('Registration successful! Please check your email for further instructions.');
    //       this._router.navigate(['/login']);
    //       if (result.canLogin) {
    //         this.saving = true;
    //         this.authService.authenticateModel.userNameOrEmailAddress = this.model.userName;
    //         this.authService.authenticateModel.password = this.model.password;
    //         this.authService.authenticate(() => {
    //           this.saving = false;
    //           this._router.navigate(['/home']);
    //         });
    //       }
    //     },
    //     (error) => {
    //       this.notify.error(error.message || 'Registration failed. Please try again.');
    //     }
    //   );
  }
  
}
