import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewPassword } from '@shared/Models/NewPassword';
import { NewPasswordService } from '@shared/Services/new-password.service';


@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {

  dataForPassword: NewPassword = new NewPassword('', '');
  newPasswordForm: FormGroup = new FormGroup({});
  token: string;
  email: string;
  errorMessage: Subject<string> = new Subject<string>();
  successMessage: Subject<string> = new Subject<string>();


  constructor(public activateroute: ActivatedRoute, public newPasswordService: NewPasswordService , public router :Router) { }


  ngOnInit() {
    this.newPasswordForm = new FormGroup({
      NewPassword: new FormControl(null, [Validators.required]),
      ConfirmPassword: new FormControl(null, [Validators.required]),
    });


    this.activateroute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });

  }



  onSubmit() {
    this.dataForPassword=new NewPassword(this.newPasswordForm.value.NewPassword,this.newPasswordForm.value.ConfirmPassword);

    this.newPasswordService.changePassword(this.email, this.token, this.dataForPassword).subscribe({
      next: (response) => {
        this.successMessage.next('Password changed successfully.');
        this.errorMessage.next(null);

        setTimeout(() => {
          this.router.navigateByUrl('account/login');
        }, 5000);
      },
      error: (error) => {
        this.errorMessage.next(`Failed to change password`);
      }
    });
       

  }
}

