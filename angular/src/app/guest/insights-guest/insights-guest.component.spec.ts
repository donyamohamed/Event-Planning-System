import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsGuestComponent } from './insights-guest.component';

describe('InsightsGuestComponent', () => {
  let component: InsightsGuestComponent;
  let fixture: ComponentFixture<InsightsGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightsGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsightsGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
