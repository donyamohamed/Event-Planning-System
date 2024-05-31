import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryeventComponent } from './historyevent.component';

describe('HistoryeventComponent', () => {
  let component: HistoryeventComponent;
  let fixture: ComponentFixture<HistoryeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryeventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
