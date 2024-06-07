import { TestBed } from '@angular/core/testing';

import { HistoryeventService } from './historyevent.service';

describe('HistoryeventService', () => {
  let service: HistoryeventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryeventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
