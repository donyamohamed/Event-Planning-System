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
export class HomeComponent extends AppComponentBase implements AfterViewInit {
  slideIndex: number = 1;

  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    this.showSlides(this.slideIndex);
    this.adjustArrowPosition();
    // this.initializeLoader();
  }

  showSlides(n: number) {
    let i: number;
    const slides = document.getElementsByClassName(
      "ui-start-page mySlides"
    ) as HTMLCollectionOf<HTMLElement>;
    //const navlabels = document.getElementsByClassName("navlabel");

    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    // for (i = 0; i < navlabels.length; i++) {
    //   navlabels[i].className = navlabels[i].className.replace(" active", "");
    // }
    if (slides.length > 0) {
      slides[this.slideIndex - 1].style.display = "block";
      //navlabels[this.slideIndex - 1].className += " active";
    }
  }

  plusSlides(n: number) {
    this.showSlides((this.slideIndex += n));
  }

  // currentSlide(n: number) {
  //   this.showSlides(this.slideIndex = n);
  // }

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
// declare var $: any;