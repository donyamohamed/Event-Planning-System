import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGuestsComponent } from './no-guests.component';

describe('NoGuestsComponent', () => {
  let component: NoGuestsComponent;
  let fixture: ComponentFixture<NoGuestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoGuestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
