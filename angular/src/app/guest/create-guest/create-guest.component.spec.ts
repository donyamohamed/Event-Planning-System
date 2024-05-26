import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGuestComponent } from './create-guest.component';

describe('CreateGuestComponent', () => {
  let component: CreateGuestComponent;
  let fixture: ComponentFixture<CreateGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
