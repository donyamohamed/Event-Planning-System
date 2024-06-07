import { TestBed } from '@angular/core/testing';

import { EventBudgetService } from './event-budget.service';

describe('EventBudgetService', () => {
  let service: EventBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
