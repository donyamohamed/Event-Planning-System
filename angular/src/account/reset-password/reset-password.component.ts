import { Component, OnInit ,Renderer2  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetpasswordService } from '../../shared/Services/resetpassword.service';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { SharedModule } from "../../shared/shared.module";
import swal from 'sweetalert2';
import { result } from 'lodash-es';
@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
    imports: [CommonModule, FormsModule, SharedModule]
})
export class ResetPasswordComponent implements OnInit {
  errorMessage: Subject<string> = new Subject<string>();
  successMessage: Subject<string> = new Subject<string>();
    constructor(public _resetPasswordService :ResetpasswordService , public router:Router ,  private renderer: Renderer2,){}

  email : string;

 ngOnInit(): void {
  this.renderer.removeClass(document.body, 'login-page');
 } 
 
  SendEmail() {
    this._resetPasswordService.SendEmailForPassword(this.email).subscribe({
      next: (response) => {  
           console.log(response);
        swal.fire({
          title: 'Success',
          text: "Email has been sent to you",
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
            this.router.navigateByUrl('account/login');
        });
    
        this.successMessage.next('Sent successfully, Check your Email.');
        this.errorMessage.next(null);

       
      },
      error: (error) => {

        // console.log(error);

        swal.fire({
          title: 'Error',
          text: error.error.result, 
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.errorMessage.next('Failed to Send Email');
        this.successMessage.next(null);
      }
    });
  }
  

}