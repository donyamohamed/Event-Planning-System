import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPlacesComponent } from './supplier-places.component';

describe('SupplierPlacesComponent', () => {
  let component: SupplierPlacesComponent;
  let fixture: ComponentFixture<SupplierPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPlacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
