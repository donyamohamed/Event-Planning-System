import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetByIdGuestComponent } from './get-by-id-guest.component';

describe('GetByIdGuestComponent', () => {
  let component: GetByIdGuestComponent;
  let fixture: ComponentFixture<GetByIdGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetByIdGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetByIdGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
