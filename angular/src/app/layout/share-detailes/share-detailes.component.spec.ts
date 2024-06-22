import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDetailesComponent } from './share-detailes.component';

describe('ShareDetailesComponent', () => {
  let component: ShareDetailesComponent;
  let fixture: ComponentFixture<ShareDetailesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareDetailesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareDetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
