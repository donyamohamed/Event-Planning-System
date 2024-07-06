import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedeventsComponent } from './savedevents.component';

describe('SavedeventsComponent', () => {
  let component: SavedeventsComponent;
  let fixture: ComponentFixture<SavedeventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedeventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedeventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
