
import { Component, OnInit, TemplateRef, ChangeDetectionStrategy } from "@angular/core";

import { CurrentUserDataService } from "@shared/Services/current-user-data.service";
import { InterestsService } from "@shared/Services/interests.service";
import { CurrentUser } from "@shared/Models/current-user";
import { Interests } from "@shared/Models/interests";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import Swal from "sweetalert2";
import { finalize } from "rxjs";
import {UpcomingEventsComponent} from './upcoming-events/upcoming-events.component';
import {HistoryeventComponent} from '../historyevent/historyevent.component';
import { SharedModule } from "../../../shared/shared.module";
@Component({
    standalone: true,
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, CommonModule, RouterLink, UpcomingEventsComponent, HistoryeventComponent, SharedModule]
})
export class UserProfileComponent implements OnInit {

  AddInterest(id: any, interest: any) {
    this.interestsService.AddInterest(id, interest).subscribe({
      next: i => {
        location.reload();
      }
    });
  }
  openModal2(_t38: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(_t38);

  }
  deleteItem(id: number) {
    Swal.fire({
        title: 'Are you sure You Want To Delete This Interest?',
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
            `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
            `
        },
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4242c5',
        cancelButtonColor: '#9f9e9e',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            this.interestsService.Delete(id)
                .pipe(
                    finalize(() => {
                      //  location.reload();
                    })
                )
                .subscribe(() => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'Interest has been deleted'
                        
                    }).then(n=>{
                      location.reload();

                    });
                });
        }
    });
}


  // deleteItem(id: number) {
  //   var isConfirmed = confirm("Are You Sure?");
  //   if (isConfirmed) {
  //     this.interestsService.Delete(id).subscribe({
  //       next: inter => {
  //         console.log(inter);
  //         location.reload();
  //       }
  //     });
  //   }
  // }

  user: CurrentUser | null = null;
  bsModalRef!: BsModalRef;
  AllInterests: Interests[] | any;
  constructor(
    private _userService: CurrentUserDataService,
    private modalService: BsModalService,
    private interestsService: InterestsService

  ) { }
  AllExistingInterests: any;

  ngOnInit(): void {
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log("User data loaded:", u);
        this.user = u;
      },
      error: (err) => {
        console.error("Failed to load user data", err);
      },
    });
    //interests
    this.interestsService.GetUserInterests().subscribe({
      next: (interest) => {
        this.AllInterests = interest;
        console.log("my interests :", this.AllInterests.result[0]);
      },

    });
    //all
    this.interestsService.GetAllInterests().subscribe({
      next: inter => {
        this.AllExistingInterests = inter;
        console.log(this.AllExistingInterests.result);
      }
    });
  }
  //filtered
  getFilteredInterests() {
    return this.AllExistingInterests.result.filter(interest => {
      return !this.AllInterests.result.some(added => added.id === interest.id);
    });
  }
  /*Concert,
  Conference,
  Workshop,
  Seminar,
  Party,
  Exam,
  Birthday,
  Graduation,
  Baby_Shower,
  Wedding,
  Gathering,
  Other */

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return "Concert";
      case 1:
        return "Conference";
      case 2:
        return "Workshop";
      case 3:
        return "Seminar";
      case 4:
        return "Party";
      case 5:
        return "Exam";
      case 6:
        return "Birthday";
      case 7:
        return "Graduation";
      case 8:
        return "Baby_Shower";
      case 9:
        return "Wedding";
      case 10:
        return "Gathering";
      case 11:
        return "Other";
    }
  }
  getUserImage(): string {
    return this.user?.image
      ? this.user.image
      : "assets/img/user.jpg";
  }

  openModal(template: any): void {
    this.bsModalRef = this.modalService.show(template);
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.user) {
      this.user.ImagePath = file;
      console.log(file);
    }
  }
  onSubmit(): void {
    const formData = new FormData();
    formData.append("userName", this.user.userName);
    if (this.user.ImagePath) {
      formData.append("imagePath", this.user.ImagePath);
    }
    formData.append("emailAddress", this.user.emailAddress);
    formData.append("age", this.user.age.toString());
    formData.append("genderUser", this.user.genderUser.toString());

    this._userService.UpdateUserData(formData).subscribe({
      next: (updatedUser) => {
        console.log("User data updated:", updatedUser);
        this.user = updatedUser;
        this.bsModalRef.hide();
        location.reload();
      },
    });
    // this._userService.UpdateUserData(this.user).subscribe({
    //   next: updatedUser => {
    //     this.user = updatedUser;
    //     console.log(updatedUser);
    //     this.bsModalRef.hide();
    //     location.reload();
    //   },
    // });
  }

}

