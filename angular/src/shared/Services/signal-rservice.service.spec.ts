import { TestBed } from '@angular/core/testing';

import { SignalRServiceService } from './signal-rservice.service';

describe('SignalRServiceService', () => {
  let service: SignalRServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalRServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
