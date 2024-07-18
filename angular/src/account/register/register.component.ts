import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { AccountServiceProxy, RegisterInput, RegisterOutput } from '@shared/service-proxies/service-proxies';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { GoogleAuthService } from '../../shared/Services/google-auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  model: RegisterInput = new RegisterInput();
  fileToUpload: File | null = null;
  imageName: string | null = null;
  saving = false;
  user: any;
  isSupplier = false;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private authService: AppAuthService,
    private googleAuthService: GoogleAuthService,
    private activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isSupplier = params.Supplier === 'true'; // Check if Supplier=true is present
    });
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.model.imageFile = file;
      this.imageName = file.name;
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

    const registerUrl = `/api/services/app/Account/Register${this.isSupplier ? '?Supplier=true' : ''}`;

    this._accountService.registerFromForm(formData, registerUrl).pipe(
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
  }
}
