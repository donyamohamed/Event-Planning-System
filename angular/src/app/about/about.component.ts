import { Component, Injector, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';


@Component({
  templateUrl: './about.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent extends AppComponentBase  {
  questions: string[] = [
    "What is Eventa Planning System?",
    "How to create an event?",
    "How to manage tasks?",
    "How to track RSVPs?"
  ];
  selectedQuestion: string;
  answer: string;
  connectionEstablished: boolean = false;

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

}
