import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewPassword } from '@shared/Models/NewPassword';
import { NewPasswordService } from '@shared/Services/new-password.service';
import { SharedModule } from "../../shared/shared.module";
import swal from 'sweetalert2';

@Component({
  selector: 'app-new-password',
  standalone: true,
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class NewPasswordComponent implements OnInit {
  dataForPassword: NewPassword = new NewPassword('', '');
  newPasswordForm: FormGroup = new FormGroup({});
  token: string;
  email: string;
  errorMessage: Subject<string> = new Subject<string>();
  successMessage: Subject<string> = new Subject<string>();

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    public activateroute: ActivatedRoute,
    public newPasswordService: NewPasswordService,
    public router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.newPasswordForm = new FormGroup({
      NewPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      ConfirmPassword: new FormControl(null, [Validators.required])
    // }, { validators: this.mustMatch('NewPassword', 'ConfirmPassword') 
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
    if (this.newPasswordForm.invalid) {
      this.errorMessage.next('Form is invalid. Please check the inputs.');
      return;
    }

    this.dataForPassword = new NewPassword(
      this.newPasswordForm.value.NewPassword,
      this.newPasswordForm.value.ConfirmPassword
    );

    this.newPasswordService.changePassword(this.email, this.token, this.dataForPassword).subscribe({
      next: (response) => {
        swal.fire({
          title: 'Password changed successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          setTimeout(() => {
            window.close();
          }, 3000);
        });

        this.successMessage.next('Password changed successfully.');
        this.errorMessage.next(null);
      },
      error: (error) => {
        this.errorMessage.next('Failed to change password.');
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