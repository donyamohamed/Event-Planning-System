import { TestBed } from '@angular/core/testing';

import { NotificatiosService } from './notificatios.service';

describe('NotificatiosService', () => {
  let service: NotificatiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificatiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
