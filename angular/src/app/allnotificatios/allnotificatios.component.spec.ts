import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALLNotificatiosComponent } from './allnotificatios.component';

describe('ALLNotificatiosComponent', () => {
  let component: ALLNotificatiosComponent;
  let fixture: ComponentFixture<ALLNotificatiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ALLNotificatiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ALLNotificatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
