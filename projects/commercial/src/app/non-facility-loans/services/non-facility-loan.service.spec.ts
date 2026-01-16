import { TestBed } from '@angular/core/testing';

import { NonFacilityLoanService } from './non-facility-loan.service';

describe('NonFacilityLoanService', () => {
  let service: NonFacilityLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonFacilityLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
