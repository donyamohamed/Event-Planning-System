import { EventsResponse } from './eventInterface';
import { HomeService } from "./../../shared/Services/home.service";
import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { gsap, TweenMax, TimelineMax, Power1, Power2 } from "gsap";
import { Subscription } from "rxjs";
import { Event } from '@shared/Models/Event';

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent
  extends AppComponentBase
  implements AfterViewInit, OnInit
{
  events: Event[]=[];
  sub: Subscription | null = null;
  constructor(injector: Injector, private PublicEventServ: HomeService) {
    super(injector);
  }

  ngAfterViewInit() {
    this.init();
  }

  private Utils = {
    Android: () => navigator.userAgent.match(/Android/i),
    BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
    iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
    Opera: () => navigator.userAgent.match(/Opera Mini/i),
    Windows: () => navigator.userAgent.match(/IEMobile/i),
    any: function () {
      return (
        this.Android() ||
        this.BlackBerry() ||
        this.iOS() ||
        this.Opera() ||
        this.Windows()
      );
    },
    randomInRange: (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min,
  };

  private init() {
    const $borders = Array.from(
      document.querySelectorAll(".border-inner")
    ) as HTMLElement[];
    const wrapperRombo = document.getElementById("wrapper");
    const control = document.getElementById("control");
    const colors = [
      "#df3891",
      "#fff78b",
      "#692286",
      "#c4a66b",
      "#ed95c0",
      "#6ac1b8",
    ];
    const nRombo = 46;
    const timer = 0.8;

    const setObj = () => {
      const zoomLevel =
        document.documentElement.clientWidth / window.innerWidth;
      const heightIOs = window.innerHeight * zoomLevel;

      if (this.Utils.iOS()) {
        const mainElement = document.querySelector(".Main") as HTMLElement;
        if (heightIOs > window.innerWidth && mainElement) {
          mainElement.style.height = `${heightIOs}px`;
          mainElement.style.minHeight = `${heightIOs}px`;
        }
      }

      TweenMax.set($borders[0], { y: -32 });
      TweenMax.set($borders[1], { y: 32 });
      TweenMax.set($borders[2], { x: -32 });
      TweenMax.set($borders[3], { x: 32 });
    };

    const border = () => {
      const tl = new TimelineMax();
      tl.to($borders, 1.8, {
        x: 0,
        y: 0,
        force3D: true,
        ease: Power1.easeOut,
        onComplete: () => {
          document.body.classList.remove("overflow");
        },
      });
      return tl;
    };

    const romboInit = () => {
      for (let i = 0; i < nRombo; i++) {
        const gridItem = document.createElement("div");
        const romboDiv = document.createElement("div");

        wrapperRombo?.appendChild(gridItem);
        gridItem.className = "box";

        TweenMax.set(".box", {
          perspective: 600,
          transformOrigin: "50% 50%",
        });

        gridItem.appendChild(romboDiv);
        romboDiv.className = "rombo";

        TweenMax.set(".rombo", {
          transformStyle: "preserve-3d",
        });

        if (this.Utils.any()) {
          TweenMax.set(romboDiv, {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: this.Utils.randomInRange(-40, 40),
            left: this.Utils.randomInRange(-40, 40),
            y: 0,
            scale: 0,
            opacity: 0,
            transformOrigin: "50% 50%",
            rotationY: this.Utils.randomInRange(-720, 720),
            rotation: this.Utils.randomInRange(-320, 320),
          });
        } else {
          TweenMax.set(romboDiv, {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: this.Utils.randomInRange(-180, 180),
            left: this.Utils.randomInRange(-180, 180),
            y: -100,
            scale: 0,
            opacity: 0,
            transformOrigin: "50% 50%",
            rotationY: this.Utils.randomInRange(-720, 720),
            rotation: this.Utils.randomInRange(-320, 320),
          });
        }
      }
    };

    const romboAnimation = () => {
      const romboTodo = Array.from(
        document.querySelectorAll(".rombo")
      ) as HTMLElement[];
      const tl = new TimelineMax();

      tl.staggerTo(
        romboTodo,
        1.2,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          rotationY: 0,
          rotation: "+=240",
          force3D: true,
          ease: Power2.easeOut,
        },
        0.08
      );

      return tl;
    };

    const master = new TimelineMax({ delay: 0.4 });

    setObj();
    romboInit();

    master.add(border(), "scene1").add(romboAnimation(), "-=1.8");
    master.timeScale(timer);

    const go = (el: HTMLElement) => {
      master.play();
      master.timeScale(timer);
      el.textContent = "REVERSE";
    };

    const rewards = (el: HTMLElement) => {
      master.reverse();
      master.timeScale(timer * 5);
      el.textContent = "PLAY";
    };

    control?.addEventListener("click", function () {
      if (master.reversed()) {
        go(this as HTMLElement);
      } else {
        rewards(this as HTMLElement);
      }
      return false;
    });
  }
  ngOnInit(): void {
    console.log("welcome home");
    this.PublicEventServ.getPublicEvents().subscribe({
      next: (u: EventsResponse) => {
        this.events = u.result.items;
        console.log(u.result.items);
      },
    });
  
  }
}
