import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaildPaymentComponent } from './faild-payment.component';

describe('FaildPaymentComponent', () => {
  let component: FaildPaymentComponent;
  let fixture: ComponentFixture<FaildPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaildPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaildPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
