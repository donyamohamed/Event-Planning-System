import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import swal from 'sweetalert2';
import { UserService } from '@shared/services/user-service.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls:['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent extends AppComponentBase {
  currentYear: number;
  versionText: string;

  constructor(injector: Injector,private userService: UserService) {
    super(injector);

    this.currentYear = new Date().getFullYear();
    this.versionText =
      this.appSession.application.version +
      ' [' +
      this.appSession.application.releaseDate.format('YYYYDDMM') +
      ']';
  }
  openCreateSupplierAlert(): void {
    swal.fire({
      title: 'Create Supplier Account',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'example@example.com',
      showCancelButton: true,
      confirmButtonText: 'Create Account',
      cancelButtonText: 'Cancel',
      preConfirm: (email) => {
        if (!email) {
          swal.showValidationMessage('Email address is required');
        }
        return email;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const email = result.value as string;
        this.userService.createSupplierAccount(email).subscribe(
          () => {
            swal.fire({
              icon: 'success',
              title: 'Success!',
              html: `An email has been sent to ${email} with instructions to create your supplier account. Check your inbox (and spam folder).`
            });
          },
          (error) => {
            swal.fire('Error!', 'Failed to send email.', 'error');
          }
        );
      }
    });
  }
}
