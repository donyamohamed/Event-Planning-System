import { TestBed } from '@angular/core/testing';

import { EventdetailsService } from './eventdetails.service';

describe('EventdetailsService', () => {
  let service: EventdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
