import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  AfterViewInit,
  HostListener,
  OnInit
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Location } from '@angular/common';

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppComponentBase implements AfterViewInit, OnInit {
  slideIndex: number = 1;
  private shouldRefresh: boolean = false;

  constructor(
    injector: Injector,
    private location: Location
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
}
