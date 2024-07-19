import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEventsComponent } from './supplier-events.component';

describe('SupplierEventsComponent', () => {
  let component: SupplierEventsComponent;
  let fixture: ComponentFixture<SupplierEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierEventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
