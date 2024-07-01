import { Component, OnDestroy, OnInit , Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewPassword } from '@shared/Models/NewPassword';
import { NewPasswordService } from '@shared/Services/new-password.service';
import { SharedModule } from "../../shared/shared.module";


@Component({
    selector: 'app-new-password',
    standalone: true,
    templateUrl: './new-password.component.html',
    styleUrl: './new-password.component.css',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class NewPasswordComponent implements OnInit {
  [x: string]: any;

  dataForPassword: NewPassword = new NewPassword('', '');
  newPasswordForm: FormGroup = new FormGroup({});
  token: string;
  email: string;
  errorMessage: Subject<string> = new Subject<string>();
  successMessage: Subject<string> = new Subject<string>();


  constructor(public activateroute: ActivatedRoute, public newPasswordService: NewPasswordService , public router :Router,   private renderer: Renderer2,) { }


  ngOnInit() {
    this.newPasswordForm = new FormGroup({
      NewPassword: new FormControl(null, [Validators.required , Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      ConfirmPassword: new FormControl(null, [Validators.required]),
        // { validator: this.mustMatch('NewPassword', 'ConfirmPassword')}

      });
      
      
      this.activateroute.queryParams.subscribe(params => {
        this.email = params['email'];
        this.token = params['token'];
      });
      
      this.renderer.removeClass(document.body, 'login-page');
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.dataForPassword=new NewPassword(this.newPasswordForm.value.NewPassword,this.newPasswordForm.value.ConfirmPassword);

    this.newPasswordService.changePassword(this.email, this.token, this.dataForPassword).subscribe({
      next: (response) => {
        this.successMessage.next('Password changed successfully.');
        this.errorMessage.next(null);

        setTimeout(() => {
          window.close();
        }, 5000);
      },
      error: (error) => {
        this.errorMessage.next(`Failed to change password`);
      }
    });

  }
    mustMatch(controlName: string, matchingControlName: string) {

      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
  
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          return;
        }
  
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      };


    }
  }


