import { TestBed } from '@angular/core/testing';

import { AskforInvitationService } from './askfor-invitation.service';

describe('AskforInvitationService', () => {
  let service: AskforInvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskforInvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
