import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGuestModelComponent } from './create-guest-model.component';

describe('CreateGuestModelComponent', () => {
  let component: CreateGuestModelComponent;
  let fixture: ComponentFixture<CreateGuestModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGuestModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateGuestModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
