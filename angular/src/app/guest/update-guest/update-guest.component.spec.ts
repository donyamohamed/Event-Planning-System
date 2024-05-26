import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGuestComponent } from './update-guest.component';

describe('UpdateGuestComponent', () => {
  let component: UpdateGuestComponent;
  let fixture: ComponentFixture<UpdateGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
