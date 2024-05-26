import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGuestComponent } from './delete-guest.component';

describe('DeleteGuestComponent', () => {
  let component: DeleteGuestComponent;
  let fixture: ComponentFixture<DeleteGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
