import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  AfterViewInit,
  HostListener,
  OnInit,
  ChangeDetectorRef
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Location } from '@angular/common';
import { ShowInterestsService } from '../../shared/services/show-interests.service';
import { Router } from '@angular/router';  // Import Router
import { CurrentUserDataService } from '@shared/services/current-user-data.service';
import { CurrentUser } from '@shared/Models/current-user';
import { SignalRServiceService } from '../../shared/services/signal-rservice.service';

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppComponentBase implements AfterViewInit, OnInit {
  slideIndex: number = 1;
  private shouldRefresh: boolean = false;
  hasInterests: boolean = false;  // Property to track if the user has interests
  user: CurrentUser | null = null; // Declare the user property
  questions: string[] = [
    "How can our system help streamline your event planning process?",
    "What features does the system offer for creating event plans?",
    "How does the system assist in managing tasks and deadlines?",
    "Can I invite guests and track RSVPs through the system?",
    "What customization options are available for event details and settings?"
  ];
  selectedQuestion: string | null = null;
  answer: string | null = null;
  connectionEstablished: boolean = false;

  constructor(
    injector: Injector,
    private location: Location,
    private ShowInterestsService: ShowInterestsService,  // Inject ShowInterestsService
    private router: Router,  // Inject Router
    private _userService: CurrentUserDataService,
    private signalRService: SignalRServiceService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit() {
    // Check if should refresh the page
    if (this.location.path() === '/app/home') {
      if (!sessionStorage.getItem('refreshed')) {
        sessionStorage.setItem('refreshed', 'true');
        this.refreshPage();
      }
    } else {
      sessionStorage.removeItem('refreshed');
    }

    // Check if the user has interests
    this.ShowInterestsService.HasInterests().subscribe(x => {
      this.hasInterests = x;  // Set the hasInterests property based on the response
      this.cdr.markForCheck();
    });

    // Load current user data
    this._userService.GetCurrentUserData().subscribe({
      next: (u: CurrentUser) => {
        console.log('User data loaded:', u); // Debugging: Log the user data
        this.user = u;
        this.cdr.markForCheck(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });

    // Start SignalR connection
    this.signalRService.startConnection().then(() => {
      this.connectionEstablished = true;
      this.signalRService.addReceiveAnswerListener();

      // Listen to answers
      this.signalRService.hubConnection.on('ReceiveAnswer', (answer: string) => {
        this.answer = answer;
        this.cdr.detectChanges();  // Manually trigger change detection
      });
    }).catch(err => {
      console.error('SignalR connection error: ', err);
      this.connectionEstablished = false;
    });
  }

  refreshPage() {
    window.location.reload();
  }

  ngAfterViewInit() {
    this.showSlides(this.slideIndex);
    this.adjustArrowPosition();
  }

  showSlides(n: number) {
    const slides = document.getElementsByClassName(
      "ui-start-page mySlides"
    ) as HTMLCollectionOf<HTMLElement>;

    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    if (slides.length > 0) {
      slides[this.slideIndex - 1].style.display = "block";
    }
  }

  plusSlides(n: number) {
    this.showSlides((this.slideIndex += n));
  }

  adjustArrowPosition() {
    if (window.innerWidth < 768) {
      const imgHeight =
        document.getElementsByClassName("slider-img")[0]?.clientHeight;
      const arrows = document.querySelectorAll(".slider-prev, .slider-next");
      arrows.forEach((arrow) => {
        (arrow as HTMLElement).style.top = `${imgHeight / 2}px`;
      });
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.adjustArrowPosition();
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  askQuestion(question: string): void {
    if (this.connectionEstablished) {
      this.selectedQuestion = question;
      this.answer = null;  // Clear previous answer
      this.signalRService.askQuestion(this.selectedQuestion);
    } else {
      console.error('Connection is not established. Please try again later.');
    }
  }

  resetQuestions(): void {
    this.selectedQuestion = null;
    this.answer = null;
  }

  openChat(): void {
    document.getElementById('chatPopup')!.style.display = 'block';
  }

  closeChat(): void {
    document.getElementById('chatPopup')!.style.display = 'none';
  }
}
