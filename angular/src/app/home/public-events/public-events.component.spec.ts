import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicEventsComponent } from './public-events.component';

describe('PublicEventsComponent', () => {
  let component: PublicEventsComponent;
  let fixture: ComponentFixture<PublicEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
