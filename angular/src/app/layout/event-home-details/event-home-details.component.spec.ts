import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHOmeDetailsComponent } from './event-home-details.component';

describe('EventHOmeDetailsComponent', () => {
  let component: EventHOmeDetailsComponent;
  let fixture: ComponentFixture<EventHOmeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHOmeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventHOmeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
