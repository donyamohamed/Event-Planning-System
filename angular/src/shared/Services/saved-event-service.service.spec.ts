import { TestBed } from '@angular/core/testing';

import { SavedEventServiceService } from './saved-event-service.service';

describe('SavedEventServiceService', () => {
  let service: SavedEventServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedEventServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
