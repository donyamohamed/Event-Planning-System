import { TestBed } from '@angular/core/testing';

import { UserEventsService } from './user-events.service';

describe('UserEventsService', () => {
  let service: UserEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
