import { Subscription } from 'rxjs';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestService } from '@shared/Services/guest.service';
import { Guest } from '@shared/Models/guest';
import { ActivatedRoute, Router } from '@angular/router';
import { template } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";
<<<<<<< HEAD
=======
import Swal from 'sweetalert2';
>>>>>>> 845dc930c55d93ed4ae36bfc25712512aaefe2a5


@Component({
    selector: 'app-no-guests',
    standalone: true,
    templateUrl: './no-guests.component.html',
    styleUrl: './no-guests.component.css',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class NoGuestsComponent {
  sub: Subscription | null = null;
  idEvent: number = 0;
  id: number = 0;
  guest: Guest = new Guest();
  guestForm: FormGroup;
  modalRef: BsModalRef;
  bsModalRef: any;
  constructor(
    private fb: FormBuilder,
    public guestSer: GuestService,
    public activatedRouter: ActivatedRoute,
    private modalService: BsModalService,
    public router: Router
  ) {
    this.guestForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      invitationState: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.sub = this.activatedRouter.params.subscribe((params) => {
      this.idEvent = params["id"];
<<<<<<< HEAD
      // console.log(this.event);

        console.log("Event ID: ", this.idEvent ); 
=======
    
       // console.log("Event ID: ", this.idEvent ); 
>>>>>>> 845dc930c55d93ed4ae36bfc25712512aaefe2a5
    })

  }
  AddGeust() {

    // this.sub= this.activatedRouter.params.subscribe(param=> {
    //   this.sub=this.guestSer.createGuest(this.guest).subscribe({
    //     next(result) {

    //       console.log(result);
    //       console.log(param["id"]);  
    //       this.router.navigate(["app/allGuests/" +param["id"]]);
    //       // this.router.navigateByUrl("app/allGuests/" +param["id"]);
    //     },
    //     error(err){console.log(err);}

    //   })
    // });
    if (this.guestForm.valid) {

      this.sub = this.activatedRouter.params.subscribe(param => {
        this.guestSer.createGuest(this.guest, this.idEvent).subscribe({
          next: (result) => {
            console.log(result);
            this.router.navigateByUrl("app/allGuests/" + param["id"]);
            this.modalRef.hide();
          },
          error: (err) => {
            console.log(err);
          }
        });
      });
    } //end AddGuest function
  }
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }





  fileToUpload: File | null = null;
  uploadResponse: string = '';


<<<<<<< HEAD
=======
  // handleFileInput(event: any): void {
  //   const file: File = event.target.files[0];
  //   const allowedExtensions = ['xls', 'xlsx'];
  //   const fileExtension = file.name.split('.').pop()?.toLowerCase();

  //   if (file && allowedExtensions.includes(fileExtension || '')) {
  //     this.fileToUpload = file;
  //     this.uploadResponse = '';
  //   } else {
  //     this.fileToUpload = null;
  //     this.uploadResponse = 'Invalid file type. Please upload an Excel file.';
  //   }
  // }

  // uploadFile(): void {
  //   if (this.fileToUpload) {
  //     this.guestSer.uploadFile(this.fileToUpload, this.idEvent).subscribe(
  //       (response) => {
  //         this.uploadResponse = 'File uploaded successfully';
  //         this.router.navigateByUrl('app/allGuests/'+this.idEvent);
  //       },
  //       (error) => {
  //         this.uploadResponse = `Error: ${error.message}`;
  //       }
  //     );
  //   } else {
  //     this.uploadResponse = 'Please select a valid Excel file first.';
  //   }
  // }

  promptFileSelection(): void {
    Swal.fire({
      title: 'Enter the Name, Phone number, and Email. Each one in a column',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, got it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        fileInput.click();
      }
    });
  }

>>>>>>> 845dc930c55d93ed4ae36bfc25712512aaefe2a5
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (file && allowedExtensions.includes(fileExtension || '')) {
      this.fileToUpload = file;
      this.uploadResponse = '';
    } else {
      this.fileToUpload = null;
      this.uploadResponse = 'Invalid file type. Please upload an Excel file.';
    }
  }

  uploadFile(): void {
    if (this.fileToUpload) {
      this.guestSer.uploadFile(this.fileToUpload, this.idEvent).subscribe(
        (response) => {
          this.uploadResponse = 'File uploaded successfully';
<<<<<<< HEAD
          this.router.navigateByUrl('app/allGuests/'+this.idEvent);
=======
          this.router.navigateByUrl('app/allGuests/' + this.idEvent);
>>>>>>> 845dc930c55d93ed4ae36bfc25712512aaefe2a5
        },
        (error) => {
          this.uploadResponse = `Error: ${error.message}`;
        }
      );
    } else {
      this.uploadResponse = 'Please select a valid Excel file first.';
    }
  }
<<<<<<< HEAD

=======
>>>>>>> 845dc930c55d93ed4ae36bfc25712512aaefe2a5
}
