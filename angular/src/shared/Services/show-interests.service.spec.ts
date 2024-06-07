import { TestBed } from '@angular/core/testing';

import { ShowInterestsService } from './show-interests.service';

describe('ShowInterestsService', () => {
  let service: ShowInterestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowInterestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
