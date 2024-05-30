import { Component, OnInit } from "@angular/core";
import { CurrentUserDataService } from "@shared/Services/current-user-data.service";
import { InterestsService } from "@shared/Services/interests.service";
import { CurrentUser } from "@shared/Models/current-user";
import { Interests } from "@shared/Models/interests";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";

@Component({
  imports: [FormsModule, CommonModule, RouterLink],
  standalone: true,
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  user: CurrentUser | null = null;
  bsModalRef!: BsModalRef;
  AllInterests: Interests[] | any;
  constructor(
    private _userService: CurrentUserDataService,
    private modalService: BsModalService,
    private interestsService: InterestsService
  ) {}

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
      ? `https://localhost:44311/${this.user.image}`
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
