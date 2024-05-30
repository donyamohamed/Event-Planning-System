import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterstsComponent } from './intersts.component';

describe('InterstsComponent', () => {
  let component: InterstsComponent;
  let fixture: ComponentFixture<InterstsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterstsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterstsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
