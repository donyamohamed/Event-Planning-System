import { TestBed } from '@angular/core/testing';

import { NewPasswordService } from './new-password.service';

describe('NewPasswordService', () => {
  let service: NewPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
