import { TestBed } from '@angular/core/testing';

import { EventaService } from './eventa.service';

describe('EventaService', () => {
  let service: EventaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
