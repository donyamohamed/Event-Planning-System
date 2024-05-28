import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGuestComponent } from './all-guest.component';

describe('AllGuestComponent', () => {
  let component: AllGuestComponent;
  let fixture: ComponentFixture<AllGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
