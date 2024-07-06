import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsFeedbackComponent } from './guests-feedback.component';

describe('GuestsFeedbackComponent', () => {
  let component: GuestsFeedbackComponent;
  let fixture: ComponentFixture<GuestsFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestsFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestsFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
