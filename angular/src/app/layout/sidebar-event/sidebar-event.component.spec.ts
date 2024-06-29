import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEventComponent } from './sidebar-event.component';

describe('SidebarEventComponent', () => {
  let component: SidebarEventComponent;
  let fixture: ComponentFixture<SidebarEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
