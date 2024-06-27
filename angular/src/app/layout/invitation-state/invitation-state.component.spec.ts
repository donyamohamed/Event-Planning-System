import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationStateComponent } from './invitation-state.component';

describe('InvitationStateComponent', () => {
  let component: InvitationStateComponent;
  let fixture: ComponentFixture<InvitationStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
